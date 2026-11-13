# Kiran Zhang · 作品集

[访问网站](https://kiran-zqr.github.io/kiranzhang-portfolio/)

## 文件放在哪里

| 目录 / 文件 | 用途 |
| --- | --- |
| `index.html` | 首页 |
| `about.html` / `resume.html` | 关于 / 简历 |
| `tencent-*.html` | 腾讯实习项目 |
| `academic-*.html` | 学术项目 |
| 其余 `*.html` | AIGC、多媒体等页面 |
| `assets/css/` | 页面样式 |
| `assets/js/` | 浏览器脚本和生成数据 |
| `assets/` 其他子目录 | 图片、字体、视频及第三方资源 |
| `assets/cv.pdf` | 当前简历 PDF |
| `scripts/` | 校验及素材处理工具，不是网页脚本 |
| `docs/` | 设计、素材与维护记录 |
| `en/` | 旧英文地址的中文跳转兼容页 |

## 本地预览

在仓库根目录运行 `python -m http.server 8765`，打开 http://localhost:8765 。无需 npm 安装。

## 维护

- 修改内容：编辑对应 HTML；样式和交互分别在 `assets/css/`、`assets/js/`。
- 首页字母素材配置：`assets/js/config.js`。
- 保持 HTML 文件名不变，避免作品集旧链接失效。
- 当前仅发布中文版。英文完整稿在 F 盘本地，确认排版后才恢复发布。
- GitHub Pages 从 `main` 根目录发布；不要上传本地预览、缓存或打包副本。

校验：`node scripts/validate.mjs`、`node scripts/test-weave-state.cjs`、`node scripts/audit-pages.cjs`。

## 版权

作品、参考图与简历保留各自权利；MIT 许可仅适用于原始模板代码。第三方许可见 `assets/vendor/`。
