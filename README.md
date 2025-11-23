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

## 部署指南

本项目通常采用“双线部署”：
- **前端**：构建为静态文件，部署到 GitHub Pages（`https://wolf1991.github.io/ishouzhuan/`）
- **后端**：Express + TypeScript，部署到你自己的服务器（例如 AWS EC2）

### 一、部署前端到 GitHub Pages
项目中已包含 `.github/workflows/deploy.yml`，推送到 `main` 分支后自动构建并发布。如果你 Fork 或更改仓库名，请确认：
1. `vite.config.js` 中 `base` 设置为 `/<你的仓库名>/`
2. `.github/workflows/deploy.yml` 的 `VITE_BASE` 环境变量保持同步
3. `Settings -> Pages` 中选择 `GitHub Actions` 作为 Source

访问：
- 首页：`https://<你的 GitHub 用户名>.github.io/<仓库名>/`
- 后台：`https://<你的 GitHub 用户名>.github.io/<仓库名>/admin/apps`

### 二、部署后端（AWS EC2，无域名先用 IP）

以 Amazon Linux 2023 为例（若为 Amazon Linux 2，将 `dnf` 换成 `yum`）：

#### 1. 系统初始化
```bash
sudo dnf update -y
sudo dnf install -y git curl tar gcc-c++ make
```
安装 Node.js 20：
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
node -v
npm -v
```

#### 2. 拉取代码 & 安装依赖
```bash
git clone https://github.com/wolf1991/ishouzhuan.git
cd ishouzhuan
npm install
```

#### 3. 构建前端 & 后端
```bash
npm run build            # 构建前端（dist/）
npm run build:server     # 将 server/apps-api.ts 编译到 dist/server/
```

#### 4. 配置环境变量
创建 `.env`：
```
PORT=3001
APPS_JSON_PATH=/home/ec2-user/ishouzhuan/public/data/apps.json
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
R2_PUBLIC_BASE=...
R2_DIRECTORY=uploads
```
如暂时没有 Cloudflare R2，可先留空（上传功能会提示未配置）。

#### 5. 启动后端（PM2）
```bash
sudo npm install -g pm2
pm2 start dist/server/apps-api.js --name ishouzhuan-api
pm2 save
pm2 startup   # 按提示执行，以便开机自启
```
API 默认监听 `3001` 端口。

#### 6. 安装并配置 Nginx（使用 IP 访问）
```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```
创建 `/etc/nginx/conf.d/ishouzhuan.conf`：
```nginx
server {
    listen 80;
    server_name _;  # 暂无域名，使用 IP 时写 _

    root /home/ec2-user/ishouzhuan/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
加载配置：
```bash
sudo nginx -t
sudo systemctl reload nginx
```
此时可直接用 IP 访问：
- 前端：`http://<EC2_PUBLIC_IP>/`
- 后台：`http://<EC2_PUBLIC_IP>/admin/apps`

若以后有域名，只需将 `server_name _;` 改为你的域名，并用 Certbot 配置 HTTPS。

#### 7. （可选）GitHub Actions 自动部署后端
可在 `.github/workflows/deploy-backend.yml` 中配置 SSH 部署脚本，实现推送 main 分支后自动：
1. SSH 到 EC2
2. 拉取最新代码
3. `npm install --production`
4. `npm run build` / `npm run build:server`
5. `pm2 reload ishouzhuan-api`

记得在 GitHub Secrets 中配置：
- `EC2_HOST`：EC2 公网 IP
- `EC2_USER`：登录用户名（如 `ec2-user`）
- `EC2_SSH_KEY`：私钥

### 三、当前无域名如何访问？
直接在浏览器输入 `http://<EC2_PUBLIC_IP>/` 即可。如果想通过 IP+端口直连后端，也可访问 `http://<EC2_PUBLIC_IP>:3001/api/apps`。使用 Nginx 反向代理后，前端和 API 都统一到 80 端口，无需加端口号。

## 常见问题
1. **端口被占用**：更改 `PORT` 环境变量，或在 Nginx 中修改转发端口。
2. **API 无法访问**：确认 `.env` 配置、`pm2 status` 是否运行、Nginx 反向代理是否指向 `127.0.0.1:3001`。
3. **R2 上传失败**：检查 `R2_ENDPOINT`、`Access Key` 等是否正确，或暂时禁用上传按钮。
4. **Windows 下 concurrently 报错**：已使用 `npm:script` 方式，若仍有问题请更新 Node/npm，或改用 PowerShell。
5. **TypeScript/ESM 报错**：可以 `npm run build:server && node dist/server/apps-api.js`，无需 `ts-node`。

## 许可证
该项目仅用于演示与内部使用，未指定开源许可证。如需开源请补充 LICENSE 文件。
