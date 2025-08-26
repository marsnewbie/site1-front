# 🏮 China Palace - Frontend

中国宫殿外卖点餐系统前端 - 基于 Next.js 14 的现代化在线订餐平台

## 🌐 项目概览

**技术栈**: Next.js 14 + React 18 + Tailwind CSS  
**GitHub仓库**: [https://github.com/marsnewbie/site1-front](https://github.com/marsnewbie/site1-front)  
**部署平台**: Vercel (自动部署)  
**访问地址**: https://site1-front-0822.vercel.app  
**后端API**: https://site1-backend-production.up.railway.app  

---

## ✨ 核心功能

### 🍽️ **菜单系统**
- ✅ 分类浏览和菜品展示
- ✅ 动态菜品选项 (单选/多选)
- ✅ 条件选项系统 (Step1→Step2 逻辑)
- ✅ 实时价格计算
- ✅ 购物车管理和状态保持

### 🛒 **订餐流程**
- ✅ Collection/Delivery 模式选择
- ✅ 时间段选择 (基于店铺营业时间)
- ✅ Postcode 验证和配送费计算
- ✅ Guest/Login/Register 三种结账方式
- ✅ 订单确认和邮件通知

### 👤 **用户系统**
- ✅ 用户注册和登录
- ✅ 密码重置 (邮件验证)
- ✅ 账户详情管理
- ✅ 密码修改功能
- ✅ 订单历史查看
- ✅ JWT Token 认证

### 🎨 **界面特性**
- ✅ 响应式设计 (移动端适配)
- ✅ 统一 Header 组件
- ✅ 用户下拉菜单
- ✅ 现代化 UI/UX
- ✅ 购物车侧边栏

---

## 📱 页面结构

```
app/
├── page.js                    # 🏠 首页 (轮播图 + 菜品分类)
├── menu/page.js              # 🍽️ 菜单页面 (完整菜单系统)
├── checkout/page.js          # 💳 结账页面 (三种结账方式)
├── order-success/page.js     # ✅ 订单成功页面
├── login/page.js             # 🔐 用户登录
├── register/page.js          # 📝 用户注册
├── forgot-password/page.js   # 🔑 忘记密码
├── reset-password/page.js    # 🔄 重置密码
├── account-details/page.js   # 👤 账户详情 (含密码修改)
├── order-history/page.js     # 📋 订单历史
├── contact/page.js           # 📞 联系我们
├── about/page.js             # ℹ️  关于我们
├── terms/page.js             # 📄 条款和条件
├── privacy/page.js           # 🔒 隐私政策
├── disclaimer/page.js        # ⚠️  服务声明
├── cookies/page.js           # 🍪 Cookie 政策
├── components/
│   ├── Header.js             # 📋 统一头部组件
│   └── Cart.js               # 🛒 购物车组件
└── contexts/
    └── AuthContext.js        # 🔐 认证上下文
```

---

## 🚀 本地开发

### 1. 环境准备
```bash
# 克隆项目
git clone https://github.com/marsnewbie/site1-front.git
cd site1-front

# 安装依赖
npm install
```

### 2. 环境变量设置
创建 `.env.local` 文件：
```env
# API 后端地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# 生产环境
# NEXT_PUBLIC_API_URL=https://site1-backend-production.up.railway.app
```

### 3. 启动开发服务器
```bash
# 开发模式
npm run dev

# 访问 http://localhost:3000
```

---

## 🌐 部署配置

### **Vercel 自动部署**
1. **GitHub 连接**: 推送到 main 分支自动触发部署
2. **环境变量**:
   - `NEXT_PUBLIC_API_URL`: `https://site1-backend-production.up.railway.app`
3. **构建命令**: `npm run build`
4. **输出目录**: `.next`

### **项目配置文件**
- `next.config.mjs` - Next.js 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置

---

## 🔧 技术特性

### **现代化技术栈**
- **Next.js 14**: App Router + Server Components
- **React 18**: Hooks + Context API
- **Tailwind CSS**: 现代化样式系统
- **TypeScript**: (可选) 类型安全

### **状态管理**
- **AuthContext**: 全局用户认证状态
- **localStorage**: 购物车持久化
- **sessionStorage**: 临时数据存储

### **UI/UX 特性**
- 📱 移动端优先设计
- 🎨 现代化界面风格
- ⚡ 快速加载和响应
- 🔄 实时状态更新

---

## 📈 性能优化

- ✅ **图片优化**: Next.js Image 组件
- ✅ **代码分割**: 动态导入和懒加载
- ✅ **缓存策略**: 静态资源缓存
- ✅ **SEO 友好**: Meta 标签和结构化数据

---

## 🔗 相关链接

- **后端仓库**: [site1-backend](https://github.com/marsnewbie/site1-backend)
- **项目文档**: [PROJECT_ARCHITECTURE.md](../PROJECT_ARCHITECTURE.md)
- **API 文档**: 查看后端 README
- **部署状态**: [Vercel Dashboard](https://vercel.com/dashboard)

---

## 📝 更新日志

### **最新更新** (2025-01-26)
- ✅ 实现密码修改功能
- ✅ 隐藏联系表单和反馈功能
- ✅ 更新服务声明和条款内容
- ✅ 统一使用 Header 组件
- ✅ 完善用户认证流程

### **核心功能** (2025-01-25)
- ✅ 完整菜单系统和购物车
- ✅ 三种结账方式支持
- ✅ 用户认证和个人中心
- ✅ 订单管理和历史查看
- ✅ 响应式设计和现代UI

---

**🏮 China Palace © 2025 - 现代化外卖订餐解决方案**