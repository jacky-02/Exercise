# Exercise V2

这是对原始 `NeedMoreAshes/Exercise` 的轻量重构版本。目标不是把小工具做成重型 Web 项目，而是补齐真正影响维护和扩展性的基础能力。

## 核心变化

- **仍然是纯静态站**：HTML + CSS + 原生 JavaScript，GitHub Pages 可直接托管。
- **无后端、无账号、无构建步骤**。
- **Content Pack**：内容与业务代码分离，支持多个资料库。
- **IndexedDB**：收藏、生词、笔记、导入内容全部进入浏览器数据库。
- **localStorage 只保存偏好**：当前资料库、主题、字号、布局。
- **稳定 ID**：用户数据引用 `datasetId + itemId`，不同法律的“第 15 条”不会冲突。
- **导入**：支持 JSON、CSV、Markdown、直接粘贴文本。
- **导出**：可导出当前资料库；也可完整备份/恢复所有数据。
- **旧数据迁移**：自动读取 `myCompanyLawFavorites` 与 `myCompanyLawVocabsV2`，迁移后不删除旧 key，便于回退。
- **全文检索**：无需后端即可搜索标题和所有可检索字段。
- **自定义**：主题、字号、字段布局。

## 目录

```text
Exercise-V2/
├─ index.html
├─ styles.css
├─ data.js                      # 旧公司法数据，仅作为首次启动种子
├─ data/
│  └─ content-pack.schema.json
├─ examples/
│  ├─ example.csv
│  └─ example.md
├─ js/
│  ├─ app.js
│  ├─ db.js
│  └─ import-export.js
├─ tests/
│  └─ import-export.test.mjs
└─ package.json
```

> 当前 fork 为兼容原项目，暂时保留根目录 `data.js`。V2 首次启动时会读取它、转换为标准 Content Pack 并写入 IndexedDB；收藏、生词、笔记和后续导入内容都不会继续写回 `data.js`。

## Content Pack v1

```json
{
  "schemaVersion": 1,
  "manifest": {
    "id": "cn.company-law.2023",
    "title": "中华人民共和国公司法（中英对照）",
    "version": "2023",
    "type": "law",
    "fields": [
      { "id": "zh", "label": "中文", "searchable": true },
      { "id": "en", "label": "English", "searchable": true }
    ]
  },
  "items": [
    {
      "id": "article-1",
      "order": 1,
      "title": "第 1 条",
      "fields": {
        "zh": "……",
        "en": "……"
      }
    }
  ]
}
```

### 为什么字段使用 `fields` 而不是写死 `zh/en`

这样同一套应用以后可以直接承载：

- 法条｜翻译｜释义
- 原文｜译文
- 问题｜答案
- 单词｜释义｜例句
- 任意 CSV 列

不用修改数据库结构或 UI 业务逻辑。

## CSV 导入

推荐表头：

```csv
article,中文,英文
1,第一条内容,Article 1...
2,第二条内容,Article 2...
```

也可以使用任意列。`article / 序号 / 编号 / order` 会被识别为顺序字段，其余列自动变成内容字段。

## Markdown 导入约定

```markdown
# 第 1 条

## 中文
中文内容……

## English
English content...

# 第 2 条

## 中文
……
```

一级标题表示一个条目，二级标题表示字段。

## 本地运行

浏览器不允许从 `file://` 直接加载 ES module / fetch 资源，因此请通过任意静态 HTTP Server 打开：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## GitHub Pages

把这些文件放到仓库根目录，GitHub → Settings → Pages → Deploy from a branch → `main / root` 即可。

## 开发检查

不需要安装任何依赖：

```bash
npm run check
npm test
```

## 数据边界

- `IndexedDB`：datasets / items / favorites / vocabs / notes / meta
- `localStorage`：主题、字号、布局、当前资料库
- 完整备份会同时导出两者。

## 暂时没有做的事情

有意不加入：React、Next.js、Node 后端、Supabase、登录、云同步、AI、PDF/OCR。只有实际出现跨设备同步或复杂解析需求时，再额外加层，而不是现在预埋重型架构。
