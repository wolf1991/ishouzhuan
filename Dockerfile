# Stage 1: Build the Vue.js application
# 使用一个轻量的 Node.js Alpine 镜像作为构建环境
FROM node:lts-alpine as builder

# 在容器中创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
# 这样做可以利用 Docker 的层缓存机制，只有在这些文件变化时才重新安装依赖
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的其余源代码
COPY . .

# 执行构建命令，生成静态文件
RUN npm run build

# Stage 2: Serve the application with Nginx
# 使用一个轻量的 Nginx Alpine 镜像作为生产环境
FROM nginx:stable-alpine

# 从构建阶段（builder）复制编译好的静态文件到 Nginx 的默认 web 根目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制我们自定义的 Nginx 配置文件，覆盖默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# （可选）复制 SSL 证书到容器内。如果你选择将证书以卷挂载进容器，可删除下两行。
# 期望你在项目根目录有 ssl/fullchain.pem 和 ssl/privkey.pem
COPY ssl /etc/nginx/ssl
RUN chmod 600 /etc/nginx/ssl/privkey.pem || true

# 暴露 80 与 443 端口
EXPOSE 80 443

# Nginx 进程在前台运行，这是 Docker 容器的最佳实践
CMD ["nginx", "-g", "daemon off;"]
