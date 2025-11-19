# 手赚网（Vue3 + TypeScript Express API）

这是一个基于 Vue3 的移动端网站与一个使用 TypeScript 编写的 Express API 服务。前端用于展示与管理应用数据，后端提供 `/api/apps` 接口读写 `apps.json`。

## 功能概览
- 前端：Vue3 + Vite，组件化页面（热门下载、站长推荐、最近更新等）。
- 后端：TypeScript + Express，读写 `public/data/apps.json`。
- 后台管理：`/AppsAdmin` 页面，使用 Tabs 管理多个一级菜单，支持表格/JSON 双模式编辑。
- 一键联启：使用 concurrently 一条命令同时启动前端和 API 服务。
- Logo 长按直达后台（Header Logo 长按 700ms 进入 AppsAdmin）。

## 目录结构
```
.
├─ public/
│  ├─ data/
│  │  └─ apps.json              # 应用数据源
│  └─ staticFiles/              # 静态资源（图片等）
├─ server/
│  └─ apps-api.ts               # TypeScript 版 Express API
├─ src/
│  ├─ components/               # Vue 组件（HotDownloads、RecommendedApps 等）
│  ├─ pages/                    # 页面组件（AppsAdmin.vue）
│  └─ ...
├─ package.json
└─ README.md
```

## 安装与启动

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```
（已在 devDependencies 中包含 TypeScript、ts-node、concurrently 等依赖）

### 启动（推荐：联启前后端）
```bash
npm run dev:all
```
- 前端默认运行在 `http://localhost:5173`
- API 默认运行在 `http://localhost:3001`

### 分开启动
- 仅前端：
  ```bash
  npm run dev:client
  ```
- 仅 API（TypeScript 直跑）：
  ```bash
  npm run dev:api
  ```

### 生产构建与预览
- 构建前端：
  ```bash
  npm run build
  ```
- 预览前端构建结果：
  ```bash
  npm run preview
  ```

## NPM 脚本说明（package.json）
- dev: 启动 Vite（等同 dev:client）
- dev:client: 启动前端（Vite）
- dev:api: 启动后端（ts-node --esm 执行 server/apps-api.ts）
- dev:all: 使用 concurrently 同时启动前端与后端
- build: 构建前端
- preview: 预览构建产物

## API 说明
- GET `/api/apps`
  - 返回 `apps.json` 的原始对象（为兼容旧前端，若文件不存在则返回 `{ topApps: [], listApps: [] }`）。
- POST `/api/apps`
  - 将请求体原样写入 `apps.json`。支持旧/新结构，便于渐进迁移。

可用环境变量：
- `APPS_JSON_PATH`：自定义存储路径（默认 `/data/apps.json`）。
- `PORT`：API 监听端口（默认 `3001`）。

## 数据结构（新）
后台页面（AppsAdmin.vue）推荐的新结构如下：
```json
{
  "recommandApps": [{ "name": "", "url": "", "image": "" }],
  "hotApps": {
    "topApps": [{ "name": "", "url": "", "image": "" }],
    "listApps": [{ "name": "", "url": "", "image": "", "date": "YYYY-MM-DD" }]
  },
  "recentApps": [],
  "iosApps": [],
  "androidApps": []
}
```
说明：
- 为兼容旧组件（如 HotDownloads.vue），API 的 GET 默认不强转结构，直接返回文件内容。
- AppsAdmin 页面会自动识别旧结构 `{ topApps, listApps }` 并映射到 `hotApps`。

## 后台管理（/AppsAdmin）
- 顶部 Tabs 对应 5 个一级菜单：
  - `recommandApps`（站长推荐）
  - `hotApps`（热门下载，包含 `topApps` 与 `listApps`）
  - `recentApps`（最近更新）
  - `iosApps`（苹果 Apps）
  - `androidApps`（安卓 Apps）
- 支持：
  - 表格编辑：逐字段修改、增删行
  - JSON 编辑：快速批量编辑，失焦自动解析
  - 导入/下载 JSON
  - 保存到服务器（POST /api/apps）

## 常见问题
1. 端口被占用？
   - 修改前端/后端运行端口或关闭占用进程。后端可通过 `PORT` 环境变量指定。
2. Windows 下 concurrently 报错？
   - 已使用 `npm:` 前缀方式，通常兼容。若仍有问题，请更新 shell 或使用 PowerShell/Git Bash。
3. ESM/TS 运行报错？
   - 我们已使用 `ts-node --esm` 直跑 TS。若本地环境不支持，请改用 tsc 编译后 `node` 运行。

## 许可证
该项目仅用于演示与内部使用，未指定开源许可证。如需开源请补充 LICENSE 文件。
