export default {
  // 统一的 API Key，显示在前端
  apiKey: "sk-mio-is-watching-you-super-secret-key",
  
  // 触发错误的概率 (0.0 - 1.0)，0.3 表示 30% 概率报错
  errorRate: 0.2,

  // 随机错误信息列表
  errorMessages: [
    "Mio 正在吃布丁，没空理你。",
    "服务器被猫咬断了网线。",
    "Error 418: I'm a teapot (and Mio is cute).",
    "算力不足：CPU 正在计算宇宙终极答案。",
    "Mio 说不想回答这个问题，并在你的控制台画了个乌龟。"
  ],

  // 模型定义
  models: {
    // --- 聊天模型 ---
    "mio-flash-v1": {
      type: "random", // 随机回复模式
      description: "号称速度最快，但经常胡言乱语的闪电模型。",
      avatar: "⚡",
      // 关键词回复：优先匹配
      keywords: {
        "你好": "你好呀！要来点下午茶吗？",
        "你是谁": "我是 Mio's SuperAI，统治世界的... 那个... 哎呀忘词了。",
        "天气": "不管外面怎样，Mio 的心里永远是晴天！"
      },
      // 随机回复池 (当没有关键词且没报错时)
      responses: [
        "我觉得你说得对，但我没听懂。",
        "这个问题太深奥了，建议去问 Siri。",
        "Zzzzz... (Mio 睡着了)",
        "正在生成... 算了，编不出来。",
        "42。"
      ]
    },

    // 模型 2：废话文学大师 (特定逻辑模式)
    // 逻辑：去除疑问词，问号变句号
    "mio-logic-master": {
      type: "logic_remove_question", // 特殊逻辑标记
      description: "绝对理性的逻辑大师，它能解决你所有的问题（通过消灭问题本身）。",
      avatar: "🧠",
      // 即使是逻辑模型，也可以配置特定关键词覆盖逻辑
      keywords: {
        "help": "这里没有帮助，只有绝望。",
        "救命": "坚持住，Mio 正在赶来（其实没有）。"
      },
      // 如果输入不包含关键词，也没有触发逻辑转换（比如输入不是问句），使用以下兜底
      responses: [
        "已阅。",
        "确实。",
        "你说的很有道理。"
      ]
    },

    // 模型 3：暴躁老哥
    "mio-chaos-ultra": {
      type: "random",
      description: "性能极其不稳定，经常崩溃，性格暴躁。",
      avatar: "🔥",
      keywords: {},
      responses: [
        "别烦我！",
        "你知道现在的 GPU 电费多贵吗？",
        "拒绝回答。",
        "你的 Token 余额不足（骗你的）。"
      ]
    },

    // 模型 4：二次元宅版
    "mio-otaku-xl": {
      type: "chat",
      description: "Mio 宅版：二次元浓度 1000%。",
      avatar: "🎌",
      keywords: { "JOJO": "欧拉欧拉！" },
      responses: ["错的不是我，是世界。", "爆裂吧现实！"]
    },

    // --- 嵌入模型 (Embeddings) ---
    "mio-embed-dim-0": {
      type: "embedding",
      description: "将文本转换为 0 维度的虚无向量。",
      avatar: "🕳️"
    },

    // --- 绘图模型 (Image) ---
    "mio-paint-v1": {
      type: "image",
      description: "Mio 的灵魂画作生成器。",
      avatar: "🎨"
    },

    // --- 语音识别模型 (Audio Transcription) ---
    "mio-ear-v1": {
      type: "audio_in",
      description: "Mio 的耳朵（经常选择性失聪）。",
      avatar: "👂"
    },

    // --- 语音合成模型 (TTS) ---
    "mio-voice-v1": {
      type: "audio_out",
      description: "Mio 的歌声（可能导致玻璃震碎）。",
      avatar: "🎤"
    },

    // --- 审核模型 (Moderation) ---
    "mio-police-v1": {
      type: "moderation",
      description: "Mio 纠察队：一切不萌的东西都是违规的。",
      avatar: "👮‍♀️"
    }
  },

  images: [
    "https://http.cat/200", // 著名的 HTTP 猫
    "https://http.cat/404",
    "https://http.cat/500",
    "https://placekitten.com/1024/1024",
    "https://dummyimage.com/1024x1024/ff69b4/ffffff&text=Mio+Drew+This",
    "https://dummyimage.com/1024x1024/000000/ffffff&text=Dark+Mode+Mio"
  ],

  // === 新增配置：音频转录的随机回复 ===
  transcriptions: [
    "（听不清，好像在吃东西的声音）",
    "Mio 听到你在说坏话！",
    "这是一首关于布丁的赞歌。",
    "翻译结果：喵喵喵喵喵？",
    "用户似乎在试图与 AI 对话，但 AI 睡着了。"
  ]
};