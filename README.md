<div align="center">

# ⚡ Mio's SuperAI ⚡

**一个基于 Cloudflare Workers 的搞怪、不可靠且二次元浓度过高的 OpenAI API 模拟器。**

<p>
  <a href="https://workers.cloudflare.com/"><img src="https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?style=flat-square&logo=cloudflare" alt="Cloudflare Workers"></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/API%20Format-OpenAI%20Compatible-green?style=flat-square&logo=openai" alt="OpenAI Compatible"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
</p>

<p align="center">
  "Probably the worst AI you'll ever use." <br>
  （可能是你用过的最糟糕的 AI。）
</p>

</div>

## 📖 简介

**Mio's SuperAI** 不是一个真正的 AI，而是一个运行在 Cloudflare Workers 上的 API 模拟器。它完全兼容 OpenAI 的 API 格式，可以接入 NextChat、LangChain 等客户端，但它**不会返回任何有用的信息**。

相反，它提供：
- **虚假的模型**：只能使用配置文件中设定的 `mio-xxx` 系列模型。
- **随机的情绪**：可配置的报错概率（模拟服务器崩溃、心情不好、去吃布丁了）。
- **奇怪的逻辑**：有的模型会吞掉你的问号，有的模型满嘴二次元梗，有的模型只会骂人。
- **精美的界面**：内置漂亮的 TailwindCSS 前端页面。

**适用场景**：
- 测试你的应用在 API 不稳定时的健壮性。
- 作为一个只有你自己知道的 API Key 恶作剧。
- 单纯觉得 Mio 很可爱。

## ✨ 特性

- **OpenAI 接口全覆盖**：支持 Chat, Completions, Embeddings, Images (DALL-E), Audio (Whisper/TTS), Moderation。
- **流式传输支持**：支持 `stream: true`，模拟打字机效果。
- **严格的模型校验**：请求 `gpt-4`？直接 404！只允许请求 Mio 的专属模型。
- **高度可配置**：所有回复、关键词、报错信息、报错概率均在 `config.js` 中配置。
- **零成本部署**：完全运行在 Cloudflare Workers 免费版上。

## 🚀 快速部署

### 前置要求
- 安装 [Node.js](https://nodejs.org/)
- 拥有一个 Cloudflare 账号

### 1. 安装 Wrangler
```bash
npm install -g wrangler
```

### 2. 创建项目
将本项目代码下载到本地文件夹。

### 3. 本地测试
```bash
wrangler dev
```
按 `b` 打开浏览器，你应该能看到 Mio 的主页。

### 4. 发布上线
```bash
wrangler deploy
```
发布成功后，你会获得一个 `https://mio-super-ai.你的名字.workers.dev` 的域名。

## ⚙️ 配置说明

核心配置文件位于 `src/config.js`。

```javascript
export default {
  // API Key，显示在前端主页上
  apiKey: "sk-mio-is-watching-you-super-secret-key",
  
  // 全局报错概率 (0.0 - 1.0)，0.2 表示 20% 的请求会失败
  errorRate: 0.2,

  // 随机报错信息库
  errorMessages: [
    "Mio 正在吃布丁，没空理你。",
    "服务器被猫咬断了网线。",
    // ...
  ],

  // 模型列表配置
  models: {
    "mio-flash-v1": {
      type: "chat", // 模型类型
      keywords: { "你好": "你好呀！" }, // 关键词回复
      responses: ["喵？", "42。"] // 随机回复池
    },
    // ... 更多模型
  }
};
```

## 🤖 模型介绍

| 模型 ID | 类型 | 描述 |
| :--- | :--- | :--- |
| **mio-flash-v1** | Chat | ⚡ **极速版**：也就是随机胡言乱语，偶尔会卖萌。 |
| **mio-logic-master** | Chat | 🧠 **逻辑版**：强行去除疑问词，将问号变为句号，只会附和你的废话文学大师。 |
| **mio-otaku-xl** | Chat | 🎌 **阿宅版**：二次元浓度 1000%，满嘴 JOJO 梗和动漫台词。 |
| **mio-chaos-ultra** | Chat | 🔥 **暴躁版**：拒绝回答，脾气极差，动不动就报错。 |
| **mio-paint-v1** | Image | 🎨 **灵魂画师**：随机返回 HTTP Cat 或生成的纯色图片。 |
| **mio-ear-v1** | Audio | 👂 **金耳朵**：语音转录，不管你传什么音频，它都听不清。 |

## 🛠️ API 调用示例

**Base URL**: `https://你的域名/v1`

### 聊天 (Chat Completion)

```bash
curl https://你的域名/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio-is-watching-you-super-secret-key" \
  -d '{
    "model": "mio-otaku-xl",
    "messages": [{"role": "user", "content": "什么是正义？"}],
    "stream": true
  }'
```

**注意**：如果你尝试使用 `gpt-3.5-turbo`，Mio 会生气并返回 `404 Model Not Found`。

### 绘图 (Images)

```bash
curl https://你的域名/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mio-paint-v1",
    "prompt": "a cat"
  }'
```

## 📂 项目结构

```text
mio-super-ai/
├── wrangler.toml      # Cloudflare 配置文件
└── src/
    ├── config.js      # 核心配置（模型、语料、概率）
    ├── utils.js       # 工具函数（逻辑处理、正则、响应封装）
    ├── api.js         # 核心 API 逻辑实现
    ├── templates.js   # HTML 页面模板
    └── index.js       # 路由分发
```

## ⚠️ 免责声明

本项目仅供娱乐和测试使用。
- 请勿在生产环境依赖此 API（除非你想被用户投诉）。
- 所有生成的二次元语录和报错信息纯属虚构，如有雷同，纯属巧合。