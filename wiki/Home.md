# 极简待办清单 - 项目介绍

## 📖 项目简介

极简待办清单是一个现代、美观的待办事项管理 Web 应用，采用 Vue 3 + TypeScript + TailwindCSS 开发。具有流畅的动画效果和响应式设计，完美支持移动端和桌面端。

## ✨ 核心功能

### 1. 任务管理
- ✅ 添加新任务
- ✏️ 编辑任务内容  
- 🗑️ 删除任务
- ☑️ 标记完成/未完成

### 2. 时间追踪
- 📝 自动记录任务创建时间
- ✅ 记录任务完成时间
- ⏱️ 计算从创建到完成的总耗时

### 3. 数据持久化
- 💾 使用浏览器 localStorage 本地存储
- 🔄 刷新页面数据不丢失

### 4. 智能筛选
- 全部任务
- 待办任务
- 已完成任务
- 📊 统计面板点击快速跳转

### 5. UI/UX 特性
- 🌙 深色主题，紫蓝渐变背景
- ✨ 闪闪星光装饰动画
- 📱 响应式设计，完美适配手机和电脑
- 🎬 流畅的入场和过渡动画

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.28 | 渐进式前端框架 |
| TypeScript | 5.2 | 类型安全的 JavaScript |
| Vite | 4.5.14 | 下一代前端构建工具 |
| TailwindCSS | 3.3 | 原子化 CSS 框架 |

## 🚀 快速部署

### 本地运行

```bash
# 克隆项目
git clone https://github.com/shadowchenjun/AIPro.git
cd AIPro

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产构建

```bash
pnpm build
```

构建产物在 `dist` 目录，可部署到任何静态托管服务。

## 📱 界面预览

### 桌面端
- 大屏幕展示完整功能
- 统计卡片三列网格布局
- 舒适的阅读体验

### 移动端
- 紧凑布局设计
- 统计卡片横向滚动
- 触摸友好的按钮尺寸

## 🔧 自定义修改

### 修改主题颜色

在 `tailwind.config.js` 中修改颜色配置：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // 修改为你喜欢的颜色
      }
    }
  }
}
```

### 添加新功能

在 `src/App.vue` 中添加新的方法：

```typescript
const newFeature = () => {
  // 实现你的新功能
};
```

## 📄 许可证

MIT License - 自由使用和修改

## 👤 作者

- GitHub: [@shadowchenjun](https://github.com/shadowchenjun)

## 🤝 致谢

- [Vue.js](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

*最后更新：2026-02-15*
