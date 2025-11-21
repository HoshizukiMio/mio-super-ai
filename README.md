<div align="center">

# ⚡ Mio's SuperAI ⚡
### 人工智障体验中心

**一个基于 Cloudflare Workers 的、极其不靠谱的、二次元浓度过高的 OpenAI API 模拟器。**

<p>
  <a href="https://workers.cloudflare.com/"><img src="https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?style=flat-square&logo=cloudflare" alt="Cloudflare Workers"></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/API%20Format-OpenAI%20Compatible-green?style=flat-square&logo=openai" alt="OpenAI Compatible"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Waifu-100%25-pink?style=flat-square" alt="Waifu">
</p>

<p align="center">
  <em>"Probably the worst AI you'll ever use."</em><br>
  （可能是你用过的最糟糕的 AI，但她很可爱。）
</p>

</div>

## 📖 简介

**Mio's SuperAI** 不是一个真正的 AI，它是一个运行在 Cloudflare Workers 上的 API 模拟器。

它**完美兼容 OpenAI 的 API 格式**（支持流式输出、绘图、语音等），可以无缝接入 NextChat、LobeChat、LangChain 等客户端。

**但它绝不按套路出牌：**
- 它可能在回答一半时去吃布丁。
- 它可能会因为你问了愚蠢的问题而拒绝服务。
- 它可能会用满嘴的二次元梗回答你严肃的技术问题。
- 它有 20% 的概率（可配置）随机报错，模拟服务器崩溃。

**适用场景：**
- 测试你的应用在 API 不稳定/报错时的健壮性（Chaos Engineering）。
- 作为一个只有你自己知道密钥的恶作剧 API。
- 当你需要一个永远秒回（虽然是废话）的“人工智障”伴侣。

## ✨ 特性

- **🧠 多重人格模型**：
  - **Mio Flash**: 极速响应的元气话唠，只会卖萌。
  - **Mio Logic**: 强行废话文学，把你的问号变成句号。
  - **Mio Otaku**: 沉迷二次元的中二病，动不动就 "The World!"。
  - **Mio Chaos**: 暴躁老哥，拒绝回答，甚至会骂人。
- **🎨 灵魂画师**：支持 DALL-E 3 接口，随机返回抽象派图片或 HTTP 猫猫图。
- **👂 选择性失聪**：支持 Whisper 接口，但永远听不懂你在说什么。
- **🌊 伪造流式传输**：支持 `stream: true`，完美模拟打字机效果。
- **🔐 安全鉴权**：内置 API Key 校验，防止白嫖（虽然也没啥价值）。
- **🖥️ 精美前端**：内置基于 TailwindCSS 的可视化主页和模型图鉴。

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
按 `b` 打开浏览器，你应该能看到 Mio 的可爱主页。

### 4. 发布上线
```bash
wrangler deploy
```
发布成功后，你会获得一个域名，例如：`https://mio-super-ai.yourname.workers.dev`。

## ⚙️ 配置说明

所有的魔法都在 `src/config.js` 中。你可以随意修改文案、概率和模型设定。

```javascript
export default {
  // 设置你的 API Key
  apiKey: "sk-mio-is-watching-you-super-secret-key",
  
  // 全局随机报错概率 (0.0 - 1.0)
  // 0.2 表示 20% 的请求会返回 500 或 404 错误
  errorRate: 0.2,

  // 报错文案库 (支持 HTML)
  errorMessages: [ ... ],

  // 模型定义
  models: {
    "mio-flash-v1": {
      type: "chat", 
      keywords: { "你好": "你好呀！" }, // 关键词优先匹配
      responses: [ ... ] // 随机回复池
    },
    // ... 更多模型
  }
};
```

## 🤖 模型列表 (Model List)

| 模型 ID | 头像 | 性格描述 |
| :--- | :---: | :--- |
| **mio-flash-v1** | ⚡ | **元气版**：经常胡言乱语，脑子里只有布丁和猫。 |
| **mio-logic-master** | 🧠 | **逻辑版**：莫得感情的杀手，擅长用废话文学消灭问题。 |
| **mio-otaku-xl** | 🎌 | **阿宅版**：二次元浓度 1000%，满嘴 JOJO 和高达梗。 |
| **mio-chaos-ultra** | 🔥 | **暴躁版**：拒绝回答，脾气极差，没事别惹我。 |
| **mio-paint-v1** | 🎨 | **绘图**：兼容 DALL-E 接口，生成灵魂画作。 |
| **mio-ear-v1** | 👂 | **听力**：兼容 Whisper 接口，经常空耳。 |

## 🛠️ 客户端接入指南

Mio's SuperAI 兼容标准的 OpenAI SDK 和各类 Web 客户端。

### 配置参数
- **接口地址 (Base URL)**: `https://[你的Worker域名]/v1`
- **API Key**: `sk-mio-is-watching-you-super-secret-key` (默认)

### Curl 示例

**聊天 (Chat):**
```bash
curl https://[你的域名]/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-otaku-xl",
    "messages": [{"role": "user", "content": "什么是正义？"}],
    "stream": true
  }'
```

**绘图 (Image):**
```bash
curl https://[你的域名]/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-paint-v1",
    "prompt": "一只可爱的猫",
    "n": 1
  }'
```

## ⚠️ 常见问题

**Q: 为什么请求报错 500？**
A: 恭喜你，触发了 Mio 的心情系统（默认 20% 概率）。多试几次就好了，或者在 `config.js` 中把 `errorRate` 改为 0。

**Q: 为什么请求报错 404 Model Not Found？**
A: Mio 非常挑剔。如果你请求 `gpt-3.5-turbo`，她会生气。请务必使用 `mio-xxx` 系列模型 ID。

**Q: 为什么绘图返回的是 Base64 像素点？**
A: 为了防止客户端因为图片加载失败而崩溃，如果客户端请求 `b64_json` 格式，Mio 会返回一个 1x1 的透明像素点。

## 📄 免责声明

本项目仅供娱乐、测试和学习 Cloudflare Workers 使用。
- 请勿在生产环境依赖此 API（除非你想被用户打）。
- 文案中包含大量 ACG 梗和搞怪内容，如有雷同，纯属巧合。

## 📄 License

MIT