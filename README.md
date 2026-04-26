# MiMo TTS Web

基于小米 MiMo-V2.5 语音大模型的在线语音合成工具，支持预设音色合成、文本设计音色、音色复刻三种模式。纯前端应用，API Key 保存在浏览器 Cookie 中。

## 功能

- **预设音色合成** — 8 款内置精品音色（冰糖、茉莉、苏打、白桦、Mia、Chloe、Milo、Dean），支持情绪、方言、语速等风格控制
- **音色设计** — 用自然语言描述声音特征（年龄、性别、口音、语气），无需参考音频即可生成新音色
- **音色复刻** — 上传数秒参考音频，克隆真人音色并保留气息、节奏等细节
- **双计费模式** — 支持按量付费和 Token Plan 两种 API 端点
- **在线播放与下载** — 合成后可直接播放，支持 MP3/WAV 格式下载

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

访问 `http://localhost:5173`，填入 MiMo 开放平台的 API Key 即可使用。

## 自部署

### 静态托管（推荐）

构建后 `dist/` 目录只有 3 个文件，可直接部署到任意静态托管服务。

**Cloudflare Pages / Vercel：**

```bash
npm run build
# 将 dist/ 目录上传，或连接 Git 仓库自动构建
# 构建命令: npm run build
# 输出目录: dist
```

**Nginx：**

```bash
npm run build
cp -r dist/* /var/www/mimo-tts-web/
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mimo-tts-web;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

如果 MiMo API 遇到 CORS 问题，需要在 Nginx 中追加反向代理配置：

```nginx
location /api/mimo-payg/ {
    rewrite ^/api/mimo-payg/(.*) /v1/$1 break;
    proxy_pass https://api.xiaomimimo.com;
    proxy_ssl_server_name on;
    proxy_set_header Host api.xiaomimimo.com;
}

location /api/mimo-token/ {
    rewrite ^/api/mimo-token/(.*) /v1/$1 break;
    proxy_pass https://token-plan-cn.xiaomimimo.com;
    proxy_ssl_server_name on;
    proxy_set_header Host token-plan-cn.xiaomimimo.com;
}
```

此时需将 `src/api/mimo.ts` 中的直连 URL 改回代理路径。

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t mimo-tts-web .
docker run -d -p 8080:80 mimo-tts-web
```

## 技术栈

- React 18 + TypeScript
- Vite 6
- MiMo-V2.5-TTS API（OpenAI Chat Completions 兼容格式）

## 隐私

API Key 仅保存在浏览器 Cookie 中，每次请求直接从浏览器发送到 MiMo API 服务器，不经过任何第三方中转。
