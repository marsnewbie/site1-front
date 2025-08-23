# Site1 Frontend

外卖点餐系统前端

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件 `.env.local`：
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. 启动开发服务器：
```bash
npm run dev
```

## Vercel 部署

1. 在 Vercel 中导入此 GitHub 仓库
2. 在环境变量中设置：
   - `NEXT_PUBLIC_API_URL`: 你的后端 API URL (例如: https://your-backend.railway.app)

## 功能

- 菜单展示
- 购物车管理
- 配送计算
- 结账流程
- 用户登录/注册 (UI已准备)
