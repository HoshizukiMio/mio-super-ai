<div align="center">

# ⚡ Mio's SuperAI ⚡
### 人工智障体验中心 (Ultimate Edition)

**一个基于 Cloudflare Workers 的、二次元浓度过高的、完全兼容 OpenAI 接口的 API 模拟器。**

<p>
  <a href="https://workers.cloudflare.com/"><img src="https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?style=flat-square&logo=cloudflare" alt="Cloudflare Workers"></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/API%20Format-OpenAI%20Compatible-green?style=flat-square&logo=openai" alt="OpenAI Compatible"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Waifu-100%25-pink?style=flat-square" alt="Waifu">
</p>

<p align="center">
  <em>"Probably the worst AI you'll ever use."</em><br>
  （可能是你用过的最糟糕的 AI，但她真的很可爱。）
</p>

</div>

## 📖 简介

**Mio's SuperAI** 是一个运行在 Cloudflare Workers 上的虚假 API 服务。

它**完美伪装**成 OpenAI 的 API（支持流式对话、绘图、语音转录、鉴权等），可以无缝接入 NextChat、LobeChat、LangChain 等现代客户端。

**但它绝不按套路出牌：**
- **拒绝工作**：它可能在回答一半时去吃布丁，或者因为心情不好直接断开连接。
- **胡言乱语**：不同的模型有不同的人格（话唠、杠精、中二病、暴躁狂）。
- **虚假绘图**：
    - 在聊天中：直接发送一张 Markdown 格式的随机图片。
    - 在绘图接口中：实时下载随机图片并转码为 Base64，防止裂图。
- **随机报错**：内置 20% 的概率（可配置）随机返回 500 或 404 错误，模拟真实的服务器崩溃体验。

## ✨ 核心特性

- **🧠 多重人格模型**：
  - **Mio Flash**: 元气话唠，脑子里只有布丁，喜欢卖萌。
  - **Mio Logic**: 废话文学大师，强制把你的问号变成句号。
  - **Mio Otaku**: 沉迷二次元，满嘴 JOJO、高达和原神梗。
  - **Mio Chaos**: 暴躁老哥，拒绝回答，甚至会骂人。
- **🎨 强大的绘图能力**：
  - **Chat 生图**：直接在聊天窗口使用 `mio-paint-v1`，Mio 会给你发一张 Markdown 图片。
  - **DALL-E 接口**：支持标准的 `v1/images/generations`。
  - **Base64 支持**：Worker 实时下载并转码图片，解决跨域显示问题。
- **🌊 完美流式传输**：
  - 支持 Server-Sent Events (SSE)，模拟真实的打字机效果。
  - 包含标准的 `role` 包和 `[DONE]` 结束符，兼容性极佳。
- **🔐 全局鉴权**：
  - 所有接口均需要验证 Bearer Token。
  - 拒绝白嫖，虽然并没有什么有价值的服务。
- **🖥️ 精美前端**：
  - 内置基于 TailwindCSS 的主页和模型图鉴页面。

## 🚀 快速部署

本项目完全运行在 **Cloudflare Workers** 免费版上，无需服务器。

### 1. 环境准备
确保你安装了 [Node.js](https://nodejs.org/) 和 `wrangler` CLI。
```bash
npm install -g wrangler
```

### 2. 获取代码
下载本项目到本地。

### 3. 本地测试
```bash
wrangler dev
```
按 `b` 打开浏览器，访问 `http://localhost:8787` 查看 Mio 的主页。

### 4. 发布上线
```bash
wrangler deploy
```
发布成功后，你会获得一个域名，例如：`https://mio-super-ai.yourname.workers.dev`。

## ⚙️ 配置说明

所有的“魔法”都在 `src/config.js` 中。你可以随意修改文案、概率和模型设定。

```javascript
export default {
  // 设置你的 API Key (显示在前端主页，也用于后端鉴权)
  apiKey: "sk-mio-is-watching-you-super-secret-key",
  
  // 全局随机报错概率 (0.0 - 1.0)
  // 0.2 表示 20% 的请求会失败，触发 "Mio 去吃布丁了" 等报错
  errorRate: 0.2,

  // 模型定义
  models: {
    "mio-flash-v1": {
      type: "chat", 
      keywords: { "你好": "你好呀！" }, // 关键词优先匹配
      responses: [ ... ] // 随机回复池
    },
    // ... 更多模型
  },
  // ...
};
```

## 🤖 可用模型 (Model List)

请在客户端的“自定义模型”中填入以下 ID（不支持 `gpt-3.5` 等官方 ID）：

| 模型 ID | 类型 | 描述 |
| :--- | :--- | :--- |
| **mio-flash-v1** | Chat | ⚡ **极速版**：随机胡言乱语，偶尔会卖萌。 |
| **mio-logic-master** | Chat | 🧠 **逻辑版**：莫得感情的杀手，消灭所有疑问句。 |
| **mio-otaku-xl** | Chat | 🎌 **阿宅版**：二次元浓度 1000%，各种名台词。 |
| **mio-chaos-ultra** | Chat | 🔥 **暴躁版**：拒绝回答，脾气极差，慎用。 |
| **mio-paint-v1** | Image/Chat | 🎨 **绘图版**：可聊天生图，也可调用 DALL-E 接口。 |
| **mio-ear-v1** | Audio | 👂 **听力版**：兼容 Whisper 接口，经常空耳。 |

## 🛠️ API 调用示例

**Base URL**: `https://[你的Worker域名]/v1`
**API Key**: `sk-mio-is-watching-you-super-secret-key`

### 1. 聊天 (Chat Completion)
```bash
curl https://[你的域名]/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-otaku-xl",
    "messages": [{"role": "user", "content": "真相只有一个"}],
    "stream": true
  }'
```

### 2. 聊天生图 (Chat to Image)
直接在聊天窗口获取图片。
```bash
curl https://[你的域名]/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-paint-v1",
    "messages": [{"role": "user", "content": "画一只猫"}],
    "stream": true
  }'
```

### 3. 专业绘图 (DALL-E Interface)
支持返回 Base64 (`b64_json`) 防止裂图。
```bash
curl https://[你的域名]/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-paint-v1",
    "prompt": "一只可爱的猫",
    "n": 1,
    "response_format": "b64_json"
  }'
```

## ⚠️ 常见问题 FAQ

**Q: 为什么一直报错 500 / Mio 心情不好？**
A: 这是特性（Feature）。Mio 设定有 20% 的概率随机报错。如果你受不了，请在 `config.js` 中将 `errorRate` 改为 `0`。

**Q: 为什么提示 `404 Model Not Found`？**
A: Mio 非常挑剔，不支持 `gpt-3.5` 或 `gpt-4` 这种无聊的名字。请务必使用 `mio-flash-v1` 等专属模型 ID。

**Q: 为什么提示 `401 Unauthorized`？**
A: 你没有提供正确的 API Key。请在请求头中添加 `Authorization: Bearer [你的Key]`。

**Q: 为什么图片生成比较慢？**
A: 如果你请求了 `b64_json` 格式，Worker 需要先去网上下载图片再转码，这需要一点时间。

## 📄 免责声明

本项目仅供娱乐、测试和学习 Cloudflare Workers 使用。
- 请勿在生产环境依赖此 API（除非你想被用户投诉）。
- 文案中包含大量 ACG 梗和搞怪内容，如有雷同，纯属巧合。

## 📄 License

MIT