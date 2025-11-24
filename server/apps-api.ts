import express, { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import multer from 'multer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
dotenv.config()

// ========= 类型定义 =========
export interface AppItem {
  name: string
  url: string
  image: string
  date?: string
}

export interface HotApps {
  topApps: AppItem[]
  listApps: AppItem[]
}

// 统一的应用数据结构（新结构）
export interface AppsData {
  recommandApps: AppItem[]
  hotApps: HotApps
  recentApps: AppItem[]
  iosApps: AppItem[]
  androidApps: AppItem[]
}

// 兼容旧结构的类型
export interface LegacyAppsData {
  topApps?: AppItem[]
  listApps?: AppItem[]
  // 同时也允许已经是新结构的字段（便于宽松解析）
  recommandApps?: AppItem[]
  hotApps?: Partial<HotApps>
  recentApps?: AppItem[]
  iosApps?: AppItem[]
  androidApps?: AppItem[]
  [k: string]: unknown
}

interface UploadedFile {
  originalname: string
  mimetype: string
  buffer: Buffer
}

type UploadRequest = Request & { file?: UploadedFile }

const app = express()
app.use(express.json({ limit: '1mb' }))

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// 在 ESM 模式下获取 __dirname 的等价方式
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 默认路径：项目根目录下的 public/data/apps.json
// 可通过环境变量 APPS_JSON_PATH 覆盖
const APPS_JSON_PATH = process.env.APPS_JSON_PATH || path.resolve(__dirname, '..', 'public', 'data', 'apps.json')

const R2_ENDPOINT = process.env.R2_ENDPOINT || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET = process.env.R2_BUCKET || ''
const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE || ''

const r2Configured = Boolean(R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_BASE)

const r2Client = r2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      },
      forcePathStyle: true
    })
  : null

// 确保存储目录存在
async function ensureDir(p: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(p), { recursive: true })
  } catch {}
}

// 备份 apps.json 文件
async function backupAppsJson(): Promise<void> {
  try {
    // 检查原文件是否存在
    try {
      await fs.access(APPS_JSON_PATH)
    } catch {
      // 文件不存在，无需备份
      return
    }

    // 读取旧数据
    const oldContent = await fs.readFile(APPS_JSON_PATH, 'utf-8')
    
    // 创建备份基础目录（在 APPS_JSON_PATH 的同一目录下）
    const backupBaseDir = path.join(path.dirname(APPS_JSON_PATH), 'backups')
    
    // 生成日期目录结构：yyyy/mm/dd
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    // 创建日期目录：backups/yyyy/mm/dd/
    const backupDir = path.join(backupBaseDir, String(year), month, day)
    await fs.mkdir(backupDir, { recursive: true })

    // 生成备份文件名：hh:mm-app.json
    const backupFileName = `${hours}:${minutes}-app.json`
    const backupPath = path.join(backupDir, backupFileName)

    // 写入备份文件
    await fs.writeFile(backupPath, oldContent, 'utf-8')
    const relativePath = path.relative(path.dirname(APPS_JSON_PATH), backupPath)
    console.log(`[BACKUP] Created backup: ${relativePath}`)

    // 清理旧备份，只保留最近 10 个
    await cleanupOldBackups(backupBaseDir)
  } catch (e: any) {
    console.error('[BACKUP] Backup failed:', e)
    // 备份失败不影响主流程，继续执行
  }
}

// 清理旧备份文件，只保留最近 10 个
async function cleanupOldBackups(backupBaseDir: string): Promise<void> {
  try {
    // 递归收集所有备份文件
    const backupFiles: Array<{ name: string; path: string; mtime: Date }> = []
    
    async function collectBackups(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            // 递归遍历子目录
            await collectBackups(fullPath)
          } else if (entry.isFile() && entry.name.endsWith('-app.json')) {
            // 获取文件修改时间用于排序
            const stats = await fs.stat(fullPath)
            backupFiles.push({
              name: entry.name,
              path: fullPath,
              mtime: stats.mtime
            })
          }
        }
      } catch (e) {
        // 忽略无法访问的目录
      }
    }

    await collectBackups(backupBaseDir)

    // 按修改时间排序（最新的在前）
    backupFiles.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

    // 如果超过 10 个，删除多余的
    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10)
      for (const file of filesToDelete) {
        await fs.unlink(file.path)
        console.log(`[BACKUP] Deleted old backup: ${file.path}`)
      }
    }
  } catch (e: any) {
    console.error('[BACKUP] Cleanup failed:', e)
    // 清理失败不影响主流程
  }
}

// 将任意读到的数据归一化为新结构
// function normalize(data: LegacyAppsData | undefined | null): AppsData {
//   const safe = data || {}
//   // 如果提供了新结构的字段，优先使用
//   const hotTop = Array.isArray(safe.hotApps?.topApps) ? (safe.hotApps!.topApps as AppItem[]) : (Array.isArray(safe.topApps) ? safe.topApps! : [])
//   const hotList = Array.isArray(safe.hotApps?.listApps) ? (safe.hotApps!.listApps as AppItem[]) : (Array.isArray(safe.listApps) ? safe.listApps! : [])

//   return {
//     recommandApps: Array.isArray(safe.recommandApps) ? safe.recommandApps as AppItem[] : [],
//     hotApps: {
//       topApps: hotTop,
//       listApps: hotList,
//     },
//     recentApps: Array.isArray(safe.recentApps) ? safe.recentApps as AppItem[] : [],
//     iosApps: Array.isArray(safe.iosApps) ? safe.iosApps as AppItem[] : [],
//     androidApps: Array.isArray(safe.androidApps) ? safe.androidApps as AppItem[] : [],
//   }
// }

// GET /api/apps - 读取 apps.json（不存在则返回空的“旧结构”以保持向后兼容）
app.get('/api/apps', async (_req: Request, res: Response) => {
  try {
    const content = await fs.readFile(APPS_JSON_PATH, 'utf-8')
    // 如有需要可校验 JSON，但为兼容性，这里原样返回解析后的对象
    const raw = JSON.parse(content)
    return res.json(raw)
  } catch (e: any) {
    if (e?.code === 'ENOENT') {
      // 文件不存在，返回旧结构，兼容现有前端（如 HotDownloads.vue）
      return res.json({})
    }
    console.error('[GET /api/apps] READ_FAILED', e)
    return res.status(500).json({ error: 'READ_FAILED', message: String(e?.message || e) })
  }
})

// POST /api/apps - 保存 apps.json（透传写入，尽量不改动结构，方便渐进迁移）
app.post('/api/apps', async (req: Request, res: Response) => {
  try {
    const incoming = (req.body ?? {}) as unknown
    // 允许是任意对象结构（旧/新），不强制转换，以方便不同前端并存
    if (incoming === null || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'INVALID_PAYLOAD', message: 'Payload must be an object' })
    }
    
    // 在写入新数据之前，先备份旧数据
    await backupAppsJson()
    
    await ensureDir(APPS_JSON_PATH)
    await fs.writeFile(APPS_JSON_PATH, JSON.stringify(incoming, null, 2), 'utf-8')
    return res.json({ ok: true })
  } catch (e: any) {
    console.error('[POST /api/apps] WRITE_FAILED', e)
    return res.status(500).json({ error: 'WRITE_FAILED', message: String(e?.message || e) })
  }
})

// 通用的文件上传处理函数
async function handleUpload(req: UploadRequest, res: Response, category: 'pic' | 'app') {
  console.log(R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE)
  if (!r2Configured || !r2Client) {
    return res.status(500).json({ error: 'R2_NOT_CONFIGURED', message: 'Cloudflare R2 未配置' })
  }
  if (!req.file) {
    return res.status(400).json({ error: 'NO_FILE', message: '未找到上传文件' })
  }
  const file = req.file
  const ext = path.extname(file.originalname) || ''
  const key = `${category}/${Date.now()}-${randomUUID()}${ext}`
  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    )
    // 构建公共访问 URL
    // 确保 R2_PUBLIC_BASE 不以斜杠结尾，key 不以斜杠开头
    const publicBase = R2_PUBLIC_BASE.replace(/\/+$/, '') // 移除末尾的所有斜杠
    const cleanKey = key.replace(/^\/+/, '') // 移除开头的斜杠
    // 拼接 URL，确保只有一个斜杠分隔
    const url = `${publicBase}/${cleanKey}`
    console.log(`[POST /api/upload/${category}] Uploaded file:`, { key, url, publicBase, cleanKey })
    return res.json({ key, url })
  } catch (e: any) {
    console.error(`[POST /api/upload/${category}] UPLOAD_FAILED`, e)
    return res.status(500).json({ error: 'UPLOAD_FAILED', message: String(e?.message || e) })
  }
}

// POST /api/upload/pic - 上传图片文件
app.post('/api/upload/pic', upload.single('file'), async (req: UploadRequest, res: Response) => {
  return handleUpload(req, res, 'pic')
})

// POST /api/upload/app - 上传应用文件
app.post('/api/upload/app', upload.single('file'), async (req: UploadRequest, res: Response) => {
  return handleUpload(req, res, 'app')
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`[apps-api] listening on ${port}, file: ${APPS_JSON_PATH}`))

export default app

