# GitHub Pages 部署说明

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

## 部署步骤

### 1. 启用 GitHub Pages

1. 进入 GitHub 仓库设置：`Settings` → `Pages`
2. 在 `Source` 部分，选择 `GitHub Actions`（而不是 `Deploy from a branch`）
3. 保存设置

### 2. 推送代码触发部署

将代码推送到 `main` 分支（或 `master` 分支，取决于你的默认分支）：

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 3. 查看部署状态

1. 进入仓库的 `Actions` 标签页
2. 查看 `Deploy to GitHub Pages` workflow 的执行状态
3. 部署成功后，访问：`https://<你的用户名>.github.io/ishouzhuan/`

## 配置说明

### Base 路径

- **本地开发**：base 路径为 `/`（根路径）
- **GitHub Pages**：base 路径为 `/ishouzhuan/`（仓库名）

如果仓库名不是 `ishouzhuan`，需要修改以下文件：

1. **`.github/workflows/deploy.yml`**：
   ```yaml
   env:
     VITE_BASE: /你的仓库名/
   ```

2. **`vite-plugin-gh-pages.js`**：插件会自动处理 404.html 的创建

### 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库 `Settings` → `Pages` 中设置自定义域名
2. 更新 `vite.config.js` 中的 base 配置为 `/`（因为自定义域名不需要仓库名前缀）
3. 重新部署

## 注意事项

### 后端 API

⚠️ **重要**：GitHub Pages 只能托管静态文件，**不能运行 Node.js 后端**。

如果你的项目需要后端 API（`/api/apps`、`/api/upload` 等），需要：

1. **将后端部署到其他平台**：
   - [Vercel](https://vercel.com/) - 支持 Node.js，免费
   - [Railway](https://railway.app/) - 支持 Node.js，有免费额度
   - [Render](https://render.com/) - 支持 Node.js，有免费额度
   - [Fly.io](https://fly.io/) - 支持 Node.js，有免费额度

2. **更新前端 API 地址**：
   - 在 `vite.config.js` 中更新 `proxy` 配置（仅开发环境）
   - 在生产环境中，需要配置环境变量或使用绝对 URL

### SPA 路由

项目已配置 Vite 插件自动创建 `404.html` 来处理 Vue Router 的 history 模式路由。

**工作原理：**
1. 构建时，Vite 插件会自动将 `index.html` 复制为 `404.html`
2. 当用户直接访问 `/ishouzhuan/admin/apps` 等路由时，GitHub Pages 会返回 `404.html`（实际上是 `index.html` 的副本）
3. Vue Router 会根据当前 URL 自动处理路由，无需额外重定向

**验证路由是否工作：**
- 访问首页：`https://wolf1991.github.io/ishouzhuan/`
- 访问管理页面：`https://wolf1991.github.io/ishouzhuan/admin/apps`
- 如果两个页面都能正常显示，说明路由配置正确

## 手动触发部署

除了推送代码自动触发外，也可以手动触发：

1. 进入 `Actions` 标签页
2. 选择 `Deploy to GitHub Pages` workflow
3. 点击 `Run workflow` 按钮

## 故障排查

### 部署失败

1. 检查 `Actions` 标签页中的错误信息
2. 确认 Node.js 版本兼容（workflow 使用 Node.js 20）
3. 检查构建日志中的错误

### 页面显示 404

1. 确认 base 路径配置正确
2. 检查构建日志中是否有 "Created 404.html" 的提示
3. 确认 GitHub Pages 设置中选择了 `GitHub Actions` 作为源
4. 检查 `dist` 目录中是否存在 `404.html` 文件

### 路由不工作

1. 确认 `src/router/index.js` 中使用了 `import.meta.env.BASE_URL`
2. 检查浏览器控制台是否有 JavaScript 错误
3. 确认 `vite-plugin-gh-pages.js` 插件正常工作
4. 验证构建后的 `dist/404.html` 文件是否存在且内容与 `index.html` 相同

## 相关文件

- `.github/workflows/deploy.yml` - GitHub Actions 工作流配置
- `vite.config.js` - Vite 构建配置（包含 base 路径和插件）
- `vite-plugin-gh-pages.js` - Vite 插件，自动创建 404.html
- `src/router/index.js` - Vue Router 配置（支持 base 路径）

