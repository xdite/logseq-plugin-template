# Logseq Plugin Template

這是一個用於開發 Logseq 插件的模板專案。它提供了基本的專案結構和配置，幫助開發者快速開始創建自己的 Logseq 插件。

## 功能

- 基本的專案結構
- TypeScript 支持
- React 集成
- 預配置的構建流程
- 格式化答案的工具函數
- 特殊塊（如 Mermaid、Graphviz）的渲染支持

## 快速開始

1. 使用這個模板創建新的 GitHub 倉庫。
2. 克隆你的新倉庫到本地機器。
3. 安裝依賴：
   ```
   yarn install
   ```
4. 啟動開發服務器：
   ```
   yarn dev
   ```
5. 在 Logseq 中加載你的插件：
   - 打開 Logseq
   - 轉到設置 > 插件
   - 選擇"加載未打包的插件"
   - 選擇你的插件目錄

## 開發

這個模板使用 TypeScript 和 React。主要的入口點是 `src/index.tsx`。

### 主要功能

- `formatAnswer`: 這個函數位於 `src/util.ts`，用於格式化文本答案。它可以處理特殊塊（如 Mermaid、Graphviz），數學公式，以及標準的 Markdown 格式。

### 特殊塊支持

這個模板支持以下特殊塊的渲染：
- Mermaid
- Viz
- Graphviz (包括 DOT 語法)

你可以在插件設置中自定義支持的特殊標籤。

### 構建

要構建插件，運行：

```
yarn build
```

這將在 `dist` 目錄中生成生產就緒的文件。

## 貢獻

歡迎提交 Issues 和 Pull Requests 來幫助改進這個插件模板！

## 許可證

MIT

## 聯繫方式

如有任何問題或建議，請通過 [GitHub Issues](https://github.com/xdite/logseq-plugin-template/issues) 聯繫我們。
