# 自定义美化滚动条油猴脚本

这个仓库包含三个不同版本的油猴脚本，可以为任何网页添加美观的自定义滚动条。

## 脚本版本

1. **基础版 (custom-scrollbar.user.js)**
   - 简洁美观的基础滚动条样式
   - 适用于任何网页
   - 最小化资源占用
2. **增强版 (custom-scrollbar-enhanced.user.js)**
   - 支持多种主题颜色（默认、深色、蓝色、紫色、自定义）
   - 可自定义滚动条宽度、透明度和圆角
   - 通过油猴菜单轻松切换设置
3. **动画版 (custom-scrollbar-animated.user.js)**
   - 包含渐变色彩和动画效果
   - 滚动时有特殊视觉反馈
   - 平滑滚动体验
4. **彩虹版 (彩虹滚动条.js)**
   - 彩虹颜色滚动条

## 安装方法

1. 首先安装 [Tampermonkey](https://www.tampermonkey.net/) (油猴) 浏览器扩展
2. 选择你想要使用的脚本版本
3. 点击对应的 `.user.js` 文件
4. 在 Tampermonkey 界面中点击"安装"按钮

## 使用说明

### 基础版
安装后自动应用于所有网页，无需额外设置。

### 增强版
安装后，可以通过 Tampermonkey 扩展图标 > 已安装脚本下找到"Beautiful Custom Scrollbar (Enhanced)"，点击后可以在菜单中选择：
- 切换主题（默认/深色/蓝色/紫色）
- 设置自定义颜色
- 调整滚动条宽度
- 重置所有设置

### 动画版
安装后自动应用渐变动画效果，在滚动页面时会有额外的视觉反馈。

## 兼容性

- 这些脚本主要基于 WebKit 的 `::-webkit-scrollbar` API，对 Chrome、Edge、Safari 等浏览器有最佳支持
- 对 Firefox 提供了基本兼容，但动画效果可能有限

## 注意事项

- 某些网站可能会使用自己的滚动条样式，这可能会与这些脚本产生冲突
- 如果遇到任何问题，可以暂时禁用脚本 