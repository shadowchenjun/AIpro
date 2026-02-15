# 极简待办清单

一个美观、现代的待办事项管理应用，采用 Vue 3 + TypeScript + TailwindCSS 开发。

![Vue 3](https://img.shields.io/badge/Vue-3.5.28-blue?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 特性

- 🎨 **现代深色主题** - 紫蓝渐变背景，星光闪烁效果
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ⏱️ **时间追踪** - 记录任务创建时间、完成时间、耗时
- 💾 **数据持久化** - 本地存储，刷新不丢失
- ✨ **流畅动画** - 入场动画、过渡效果
- 🔍 **智能筛选** - 全部/待办/已完成快速切换
- 📊 **统计面板** - 点击可快速跳转到对应筛选

## 🖥️ 预览

在线预览：https://brain-reprint-knock-counts.trycloudflare.com

![Preview](https://via.placeholder.com/800x400/1e1e3f/6366f1?text=极简待办清单)

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/shadowchenjun/AIPro.git
cd AIPro

# 安装依赖（推荐使用 pnpm）
pnpm install

# 或使用 npm
npm install
```

### 开发

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

构建产物在 `dist` 目录。

## 📁 项目结构

```
AIPro/
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.ts          # 入口文件
│   └── assets/          # 静态资源
├── public/              # 公共资源
├── index.html           # HTML 入口
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
└── tsconfig.json        # TypeScript 配置
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式前端框架
- **TypeScript** - 类型安全
- **Vite** - 快速开发构建工具
- **TailwindCSS** - 原子化 CSS 框架
- **@vueuse/core** - Vue 组合式工具库

## 📝 使用说明

1. **添加任务** - 在输入框中输入任务内容，按回车或点击添加按钮
2. **完成任务** - 点击任务左侧的复选框
3. **编辑任务** - 点击编辑图标 ✏️
4. **删除任务** - 点击删除图标 🗑️
5. **筛选任务** - 点击顶部的"全部/待办/已完成"标签
6. **统计面板** - 点击"总任务数/已完成/待完成"卡片快速筛选

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 了解更多。
