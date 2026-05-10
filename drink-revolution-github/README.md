# 饮·革命 | DRINK REVOLUTION

电影级 3D 滚动叙事饮品品牌官网。

## 技术栈

- **Three.js** — 程序化 3D 玻璃瓶、液体着色器、气泡粒子、冰块、冷凝水珠
- **GSAP + ScrollTrigger** — 滚动驱动的摄像机运镜、场景切换
- **Lenis** — 平滑滚动
- **SplitType** — 逐字入场动画
- **EffectComposer + UnrealBloomPass** — 辉光后期

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 7 场景结构 + 文案 |
| `styles.css` | 暗色高级品牌风格 + 响应式 |
| `script.js` | 全部 3D 引擎 + 滚动编排 + 交互 |

## 运行

用任意静态服务器打开即可：

```bash
npx serve .
# 或
python -m http.server 8000
```

所有依赖通过 CDN 加载，无需构建步骤。

## 浏览器支持

Chrome / Edge / Safari / Firefox 最新版。移动端完整适配。

## 许可

MIT
