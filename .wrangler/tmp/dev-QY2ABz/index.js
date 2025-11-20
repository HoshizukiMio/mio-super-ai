var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-mOxIRK/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/config.js
var config_default = {
  // 统一的 API Key，显示在前端
  apiKey: "sk-mio-is-watching-you-super-secret-key",
  // 触发错误的概率 (0.0 - 1.0)，0.3 表示 30% 概率报错
  errorRate: 0.2,
  // 随机错误信息列表
  errorMessages: [
    "Mio \u6B63\u5728\u5403\u5E03\u4E01\uFF0C\u6CA1\u7A7A\u7406\u4F60\u3002",
    "\u670D\u52A1\u5668\u88AB\u732B\u54AC\u65AD\u4E86\u7F51\u7EBF\u3002",
    "Error 418: I'm a teapot (and Mio is cute).",
    "\u7B97\u529B\u4E0D\u8DB3\uFF1ACPU \u6B63\u5728\u8BA1\u7B97\u5B87\u5B99\u7EC8\u6781\u7B54\u6848\u3002",
    "Mio \u8BF4\u4E0D\u60F3\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\uFF0C\u5E76\u5728\u4F60\u7684\u63A7\u5236\u53F0\u753B\u4E86\u4E2A\u4E4C\u9F9F\u3002"
  ],
  // 模型定义
  models: {
    // --- 聊天模型 ---
    "mio-flash-v1": {
      type: "random",
      // 随机回复模式
      description: "\u53F7\u79F0\u901F\u5EA6\u6700\u5FEB\uFF0C\u4F46\u7ECF\u5E38\u80E1\u8A00\u4E71\u8BED\u7684\u95EA\u7535\u6A21\u578B\u3002",
      avatar: "\u26A1",
      // 关键词回复：优先匹配
      keywords: {
        "\u4F60\u597D": "\u4F60\u597D\u5440\uFF01\u8981\u6765\u70B9\u4E0B\u5348\u8336\u5417\uFF1F",
        "\u4F60\u662F\u8C01": "\u6211\u662F Mio's SuperAI\uFF0C\u7EDF\u6CBB\u4E16\u754C\u7684... \u90A3\u4E2A... \u54CE\u5440\u5FD8\u8BCD\u4E86\u3002",
        "\u5929\u6C14": "\u4E0D\u7BA1\u5916\u9762\u600E\u6837\uFF0CMio \u7684\u5FC3\u91CC\u6C38\u8FDC\u662F\u6674\u5929\uFF01"
      },
      // 随机回复池 (当没有关键词且没报错时)
      responses: [
        "\u6211\u89C9\u5F97\u4F60\u8BF4\u5F97\u5BF9\uFF0C\u4F46\u6211\u6CA1\u542C\u61C2\u3002",
        "\u8FD9\u4E2A\u95EE\u9898\u592A\u6DF1\u5965\u4E86\uFF0C\u5EFA\u8BAE\u53BB\u95EE Siri\u3002",
        "Zzzzz... (Mio \u7761\u7740\u4E86)",
        "\u6B63\u5728\u751F\u6210... \u7B97\u4E86\uFF0C\u7F16\u4E0D\u51FA\u6765\u3002",
        "42\u3002"
      ]
    },
    // 模型 2：废话文学大师 (特定逻辑模式)
    // 逻辑：去除疑问词，问号变句号
    "mio-logic-master": {
      type: "logic_remove_question",
      // 特殊逻辑标记
      description: "\u7EDD\u5BF9\u7406\u6027\u7684\u903B\u8F91\u5927\u5E08\uFF0C\u5B83\u80FD\u89E3\u51B3\u4F60\u6240\u6709\u7684\u95EE\u9898\uFF08\u901A\u8FC7\u6D88\u706D\u95EE\u9898\u672C\u8EAB\uFF09\u3002",
      avatar: "\u{1F9E0}",
      // 即使是逻辑模型，也可以配置特定关键词覆盖逻辑
      keywords: {
        "help": "\u8FD9\u91CC\u6CA1\u6709\u5E2E\u52A9\uFF0C\u53EA\u6709\u7EDD\u671B\u3002",
        "\u6551\u547D": "\u575A\u6301\u4F4F\uFF0CMio \u6B63\u5728\u8D76\u6765\uFF08\u5176\u5B9E\u6CA1\u6709\uFF09\u3002"
      },
      // 如果输入不包含关键词，也没有触发逻辑转换（比如输入不是问句），使用以下兜底
      responses: [
        "\u5DF2\u9605\u3002",
        "\u786E\u5B9E\u3002",
        "\u4F60\u8BF4\u7684\u5F88\u6709\u9053\u7406\u3002"
      ]
    },
    // 模型 3：暴躁老哥
    "mio-chaos-ultra": {
      type: "random",
      description: "\u6027\u80FD\u6781\u5176\u4E0D\u7A33\u5B9A\uFF0C\u7ECF\u5E38\u5D29\u6E83\uFF0C\u6027\u683C\u66B4\u8E81\u3002",
      avatar: "\u{1F525}",
      keywords: {},
      responses: [
        "\u522B\u70E6\u6211\uFF01",
        "\u4F60\u77E5\u9053\u73B0\u5728\u7684 GPU \u7535\u8D39\u591A\u8D35\u5417\uFF1F",
        "\u62D2\u7EDD\u56DE\u7B54\u3002",
        "\u4F60\u7684 Token \u4F59\u989D\u4E0D\u8DB3\uFF08\u9A97\u4F60\u7684\uFF09\u3002"
      ]
    },
    // 模型 4：二次元宅版
    "mio-otaku-xl": {
      type: "chat",
      description: "Mio \u5B85\u7248\uFF1A\u4E8C\u6B21\u5143\u6D53\u5EA6 1000%\u3002",
      avatar: "\u{1F38C}",
      keywords: { "JOJO": "\u6B27\u62C9\u6B27\u62C9\uFF01" },
      responses: ["\u9519\u7684\u4E0D\u662F\u6211\uFF0C\u662F\u4E16\u754C\u3002", "\u7206\u88C2\u5427\u73B0\u5B9E\uFF01"]
    },
    // --- 嵌入模型 (Embeddings) ---
    "mio-embed-dim-0": {
      type: "embedding",
      description: "\u5C06\u6587\u672C\u8F6C\u6362\u4E3A 0 \u7EF4\u5EA6\u7684\u865A\u65E0\u5411\u91CF\u3002",
      avatar: "\u{1F573}\uFE0F"
    },
    // --- 绘图模型 (Image) ---
    "mio-paint-v1": {
      type: "image",
      description: "Mio \u7684\u7075\u9B42\u753B\u4F5C\u751F\u6210\u5668\u3002",
      avatar: "\u{1F3A8}"
    },
    // --- 语音识别模型 (Audio Transcription) ---
    "mio-ear-v1": {
      type: "audio_in",
      description: "Mio \u7684\u8033\u6735\uFF08\u7ECF\u5E38\u9009\u62E9\u6027\u5931\u806A\uFF09\u3002",
      avatar: "\u{1F442}"
    },
    // --- 语音合成模型 (TTS) ---
    "mio-voice-v1": {
      type: "audio_out",
      description: "Mio \u7684\u6B4C\u58F0\uFF08\u53EF\u80FD\u5BFC\u81F4\u73BB\u7483\u9707\u788E\uFF09\u3002",
      avatar: "\u{1F3A4}"
    },
    // --- 审核模型 (Moderation) ---
    "mio-police-v1": {
      type: "moderation",
      description: "Mio \u7EA0\u5BDF\u961F\uFF1A\u4E00\u5207\u4E0D\u840C\u7684\u4E1C\u897F\u90FD\u662F\u8FDD\u89C4\u7684\u3002",
      avatar: "\u{1F46E}\u200D\u2640\uFE0F"
    }
  },
  images: [
    "https://http.cat/200",
    // 著名的 HTTP 猫
    "https://http.cat/404",
    "https://http.cat/500",
    "https://placekitten.com/1024/1024",
    "https://dummyimage.com/1024x1024/ff69b4/ffffff&text=Mio+Drew+This",
    "https://dummyimage.com/1024x1024/000000/ffffff&text=Dark+Mode+Mio"
  ],
  // === 新增配置：音频转录的随机回复 ===
  transcriptions: [
    "\uFF08\u542C\u4E0D\u6E05\uFF0C\u597D\u50CF\u5728\u5403\u4E1C\u897F\u7684\u58F0\u97F3\uFF09",
    "Mio \u542C\u5230\u4F60\u5728\u8BF4\u574F\u8BDD\uFF01",
    "\u8FD9\u662F\u4E00\u9996\u5173\u4E8E\u5E03\u4E01\u7684\u8D5E\u6B4C\u3002",
    "\u7FFB\u8BD1\u7ED3\u679C\uFF1A\u55B5\u55B5\u55B5\u55B5\u55B5\uFF1F",
    "\u7528\u6237\u4F3C\u4E4E\u5728\u8BD5\u56FE\u4E0E AI \u5BF9\u8BDD\uFF0C\u4F46 AI \u7761\u7740\u4E86\u3002"
  ]
};

// src/utils.js
var QUESTION_WORDS = [
  "\u5417",
  "\u5462",
  "\u4EC0\u4E48",
  "\u5565",
  "\u8C01",
  "\u54EA",
  "\u600E\u4E48",
  "\u51E0",
  "\u591A\u5C11",
  "why",
  "what",
  "where",
  "who",
  "how",
  "when"
];
var QUESTION_REGEX = new RegExp(QUESTION_WORDS.join("|"), "gi");
var getRandomItem = /* @__PURE__ */ __name((arr) => arr[Math.floor(Math.random() * arr.length)], "getRandomItem");
function applyMioLogic(text) {
  if (!text) return "";
  let result = text.replace(QUESTION_REGEX, "");
  result = result.replace(/\?/g, ".").replace(/？/g, "\u3002");
  if (!/[.。,，!！]$/.test(result)) {
    result += "\u3002";
  }
  return result.trim();
}
__name(applyMioLogic, "applyMioLogic");
function ensureModelExists(modelId) {
  if (!modelId) {
    throw {
      message: "Model parameter is missing. Mio needs to know who you are looking for.",
      type: "invalid_request_error",
      param: "model",
      code: "model_missing"
    };
  }
  if (!config_default.models[modelId]) {
    throw {
      message: `The model '${modelId}' does not exist. Available models: ${Object.keys(config_default.models).join(", ")}`,
      type: "invalid_request_error",
      param: "model",
      code: "model_not_found"
    };
  }
  return config_default.models[modelId];
}
__name(ensureModelExists, "ensureModelExists");
var jsonResponse = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // 允许所有跨域
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}, "jsonResponse");
var htmlResponse = /* @__PURE__ */ __name((html) => {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}, "htmlResponse");

// src/api.js
function checkMioMood() {
  if (Math.random() < config_default.errorRate) {
    throw {
      message: getRandomItem(config_default.errorMessages),
      type: "server_error",
      code: "mio_mood_swing"
    };
  }
}
__name(checkMioMood, "checkMioMood");
async function handleModels() {
  const modelList = Object.keys(config_default.models).map((id) => ({
    id,
    object: "model",
    created: 1677610602,
    owned_by: "mio-super-ai",
    permission: []
  }));
  return jsonResponse({ object: "list", data: modelList });
}
__name(handleModels, "handleModels");
async function handleChat(request) {
  try {
    const body = await request.json();
    const modelId = body.model;
    const modelConfig = ensureModelExists(modelId);
    checkMioMood();
    const messages = body.messages || [];
    const lastMessage = messages.length > 0 ? String(messages[messages.length - 1].content) : "";
    let replyContent = getRandomItem(modelConfig.responses || ["Mio?"]);
    if (modelConfig.keywords) {
      const foundKey = Object.keys(modelConfig.keywords).find((k) => lastMessage.includes(k));
      if (foundKey) replyContent = modelConfig.keywords[foundKey];
    }
    if (modelConfig.type === "chat_logic" && !Object.keys(modelConfig.keywords || {}).some((k) => lastMessage.includes(k))) {
      replyContent = applyMioLogic(lastMessage);
      if (replyContent.length < 2) replyContent = getRandomItem(modelConfig.responses);
    }
    return jsonResponse({
      id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1e3),
      model: modelId,
      choices: [{ index: 0, message: { role: "assistant", content: replyContent }, finish_reason: "stop" }],
      usage: { prompt_tokens: lastMessage.length, completion_tokens: replyContent.length, total_tokens: lastMessage.length + replyContent.length }
    });
  } catch (err) {
    const status = err.type === "invalid_request_error" ? 404 : 500;
    return jsonResponse({ error: err }, status);
  }
}
__name(handleChat, "handleChat");
async function handleLegacyCompletions(request) {
  try {
    const body = await request.json();
    const modelConfig = ensureModelExists(body.model);
    checkMioMood();
    const prompt = body.prompt || "";
    const reply = getRandomItem(modelConfig.responses || ["Mio completion."]);
    return jsonResponse({
      id: `cmpl-${Math.random().toString(36).slice(2, 10)}`,
      object: "text_completion",
      created: Math.floor(Date.now() / 1e3),
      model: body.model,
      choices: [{ text: reply, index: 0, logprobs: null, finish_reason: "length" }],
      usage: { prompt_tokens: prompt.length, completion_tokens: reply.length, total_tokens: prompt.length + reply.length }
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === "invalid_request_error" ? 404 : 500);
  }
}
__name(handleLegacyCompletions, "handleLegacyCompletions");
async function handleEmbeddings(request) {
  try {
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    const fakeEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
    return jsonResponse({
      object: "list",
      data: [{ object: "embedding", embedding: fakeEmbedding, index: 0 }],
      model: body.model,
      usage: { prompt_tokens: 10, total_tokens: 10 }
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === "invalid_request_error" ? 404 : 500);
  }
}
__name(handleEmbeddings, "handleEmbeddings");
async function handleImages(request) {
  try {
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    return jsonResponse({
      created: Math.floor(Date.now() / 1e3),
      data: [{ url: getRandomItem(config_default.images) }]
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === "invalid_request_error" ? 404 : 500);
  }
}
__name(handleImages, "handleImages");
async function handleAudioSpeech(request) {
  try {
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    return new Response("Mio Singing Data...", {
      headers: { "Content-Type": "audio/mpeg", "Transfer-Encoding": "chunked" }
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === "invalid_request_error" ? 404 : 500);
  }
}
__name(handleAudioSpeech, "handleAudioSpeech");
async function handleTranscriptions(request) {
  try {
    const formData = await request.formData();
    const modelId = formData.get("model");
    ensureModelExists(modelId);
    checkMioMood();
    return jsonResponse({ text: getRandomItem(config_default.transcriptions) });
  } catch (err) {
    const isModelErr = err.code === "model_not_found" || err.code === "model_missing";
    return jsonResponse({ error: isModelErr ? err : { message: "Invalid form data", type: "invalid_request_error" } }, isModelErr ? 404 : 500);
  }
}
__name(handleTranscriptions, "handleTranscriptions");
async function handleModerations(request) {
  try {
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    const isFlagged = Math.random() > 0.8;
    return jsonResponse({
      id: `modr-${Math.random().toString(36).slice(2, 10)}`,
      model: body.model,
      results: [{
        flagged: isFlagged,
        categories: { violence: isFlagged },
        category_scores: { violence: isFlagged ? 0.99 : 0.01 }
      }]
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === "invalid_request_error" ? 404 : 500);
  }
}
__name(handleModerations, "handleModerations");
async function handleMockList() {
  return jsonResponse({ object: "list", data: [] });
}
__name(handleMockList, "handleMockList");

// src/templates.js
var commonHead = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mio's SuperAI</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <!-- Noto Sans (Global) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        /* Apply Font */
        body { 
            font-family: 'Noto Sans', sans-serif; 
            background: #fefce8; 
        }
        .blob { position: absolute; filter: blur(40px); z-index: -1; opacity: 0.6; }
        /* Glassmorphism */
        .glass { 
            background: rgba(255, 255, 255, 0.75); 
            backdrop-filter: blur(12px); 
            border: 1px solid rgba(255,255,255,0.6); 
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
    </style>
</head>
`;
var navBar = `
<nav class="p-6 flex justify-center space-x-10 text-lg font-bold text-pink-500">
    <a href="/" class="hover:text-pink-700 hover:scale-110 transition transform">\u{1F3E0} Home</a>
    <a href="/models" class="hover:text-pink-700 hover:scale-110 transition transform">\u{1F4DA} Model Gallery</a>
</nav>
`;
var background = `
<div class="blob bg-pink-300 w-80 h-80 rounded-full top-0 left-0 mix-blend-multiply animate-bounce" style="animation-duration: 6s;"></div>
<div class="blob bg-yellow-300 w-80 h-80 rounded-full top-0 right-0 mix-blend-multiply animate-bounce" style="animation-duration: 8s;"></div>
<div class="blob bg-blue-300 w-80 h-80 rounded-full bottom-0 left-20 mix-blend-multiply animate-bounce" style="animation-duration: 10s;"></div>
`;
function getHomePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="flex-grow flex flex-col items-center justify-center w-full max-w-3xl p-4 text-center z-10">
            <h1 class="text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 tracking-tight">
                Mio's SuperAI
            </h1>
            <p class="text-xl mb-10 font-medium text-slate-500">
                "Probably the most ridiculous Artificial 'Intelligence' you've ever used."
            </p>

            <!-- API Key Card -->
            <div class="glass rounded-3xl p-10 w-full shadow-2xl transform hover:-translate-y-1 transition duration-300">
                <h2 class="text-2xl font-bold mb-6 text-pink-600 flex items-center justify-center gap-2">
                    \u2728 Your API Key \u2728
                </h2>
                <div class="bg-slate-800 text-green-400 font-mono p-5 rounded-xl break-all border-2 border-dashed border-slate-600 relative group cursor-pointer transition hover:bg-slate-900 hover:border-green-500 shadow-inner text-lg" 
                     onclick="navigator.clipboard.writeText('${config_default.apiKey}'); const el=this.querySelector('span'); el.innerText='Copied!'; setTimeout(()=>el.innerText='Click to Copy', 2000);">
                    ${config_default.apiKey}
                    <span class="absolute top-3 right-3 text-xs text-gray-500 group-hover:text-white font-sans bg-slate-700 px-2 py-1 rounded transition">Click to Copy</span>
                </div>
                
                <div class="mt-6 grid grid-cols-1 gap-2 text-sm text-gray-600 bg-white/50 p-4 rounded-lg border border-pink-100">
                    <p class="flex justify-between">
                        <span class="font-bold">Base URL:</span>
                        <code class="bg-gray-200 px-2 py-0.5 rounded text-pink-600 select-all">https://[your-domain]/v1</code>
                    </p>
                    <p class="mt-2 text-xs text-center text-gray-400">Supports Chat, Embeddings, DALL-E, Whisper formats</p>
                </div>
            </div>

            <!-- Features -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div class="glass p-6 rounded-2xl text-left hover:bg-white/80 transition">
                    <div class="text-5xl mb-4">\u{1F3B2}</div>
                    <h3 class="font-bold text-xl mb-2 text-slate-800">Totally Unpredictable</h3>
                    <p class="text-slate-600 leading-relaxed">It might answer you, it might throw an error, or it might just tell you a bad joke. Mio's mood decides everything.</p>
                </div>
                <div class="glass p-6 rounded-2xl text-left hover:bg-white/80 transition">
                    <div class="text-5xl mb-4">\u{1F3AD}</div>
                    <h3 class="font-bold text-xl mb-2 text-slate-800">Fake Model Registry</h3>
                    <p class="text-slate-600 leading-relaxed">We provide state-of-the-art JSON configurations. Requests for non-existent models (like GPT-4) will be ruthlessly rejected.</p>
                </div>
            </div>
        </main>
        
        <footer class="p-6 text-slate-400 text-sm font-medium">
            Powered by Cloudflare Workers & Mio's Whimsy
        </footer>
    </body>
    </html>
    `;
}
__name(getHomePage, "getHomePage");
function getModelsPage() {
  const modelsHtml = Object.entries(config_default.models).map(([id, model]) => {
    const typeMap = {
      "chat": "Chat Bot",
      "chat_logic": "Logic Unit",
      "embedding": "Embedding",
      "image": "Image Gen",
      "audio_in": "Speech to Text",
      "audio_out": "Text to Speech",
      "moderation": "Moderation"
    };
    const typeName = typeMap[model.type] || model.type;
    const contextWindow = Math.floor(Math.random() * 1e4) + 1e3;
    return `
        <div class="glass p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-l-8 border-pink-400 flex flex-col relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 text-9xl opacity-10 group-hover:opacity-20 transition select-none pointer-events-none">
                ${model.avatar || "\u{1F916}"}
            </div>
            
            <div class="flex justify-between items-start mb-4 z-10">
                <div>
                    <h3 class="text-xl font-black text-slate-800 break-all">${id}</h3>
                    <span class="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">
                        ${typeName}
                    </span>
                </div>
                <span class="text-5xl filter drop-shadow-lg animate-pulse">${model.avatar || "\u{1F916}"}</span>
            </div>
            
            <div class="bg-white/40 p-3 rounded-xl mb-4 flex-grow border border-white/50">
                <p class="text-slate-700 font-medium text-sm leading-relaxed">${model.description}</p>
            </div>

            <div class="pt-4 border-t border-gray-200/50 text-xs text-gray-500 font-mono space-y-1 z-10">
                <div class="flex justify-between">
                    <span>Context Window:</span>
                    <span class="text-pink-600">${contextWindow} tokens</span>
                </div>
                <div class="flex justify-between">
                    <span>Training Data:</span>
                    <span>Mio's Fantasy</span>
                </div>
                <div class="flex justify-between">
                    <span>Owner:</span>
                    <span>mio-super-ai</span>
                </div>
            </div>
        </div>
        `;
  }).join("");
  return `
    <!DOCTYPE html>
    <html lang="en">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="w-full max-w-6xl p-4 z-10">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-black text-pink-500 mb-4 drop-shadow-sm">Mio Model Gallery</h1>
                <p class="text-xl text-slate-500">Choose your source of chaos (Only these IDs are supported).</p>
            </div>

            <!-- Grid Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                ${modelsHtml}
            </div>
            
            <!-- Warning Tip -->
            <div class="text-center bg-white/30 p-4 rounded-lg mx-auto max-w-2xl border border-pink-200">
                <p class="text-sm text-slate-600">
                    \u{1F4A1} Tip: You must strictly use the <code class="bg-pink-100 px-1 rounded text-pink-600 font-bold">ID</code> shown above.
                    <br>Asking for nonexistent models (like GPT-4) will make Mio angry.
                </p>
            </div>
        </main>
    </body>
    </html>
    `;
}
__name(getModelsPage, "getModelsPage");

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }
      });
    }
    const routes = {
      // === 基础 ===
      "/v1/models:GET": /* @__PURE__ */ __name(() => handleModels(), "/v1/models:GET"),
      // === 文本 ===
      "/v1/chat/completions:POST": /* @__PURE__ */ __name(() => handleChat(request), "/v1/chat/completions:POST"),
      "/v1/completions:POST": /* @__PURE__ */ __name(() => handleLegacyCompletions(request), "/v1/completions:POST"),
      "/v1/embeddings:POST": /* @__PURE__ */ __name(() => handleEmbeddings(request), "/v1/embeddings:POST"),
      // === 图像 (DALL-E) ===
      "/v1/images/generations:POST": /* @__PURE__ */ __name(() => handleImages(request), "/v1/images/generations:POST"),
      "/v1/images/edits:POST": /* @__PURE__ */ __name(() => handleImages(request), "/v1/images/edits:POST"),
      // 复用生成逻辑
      "/v1/images/variations:POST": /* @__PURE__ */ __name(() => handleImages(request), "/v1/images/variations:POST"),
      // 复用生成逻辑
      // === 音频 (Whisper/TTS) ===
      "/v1/audio/speech:POST": /* @__PURE__ */ __name(() => handleAudioSpeech(request), "/v1/audio/speech:POST"),
      "/v1/audio/transcriptions:POST": /* @__PURE__ */ __name(() => handleTranscriptions(request), "/v1/audio/transcriptions:POST"),
      "/v1/audio/translations:POST": /* @__PURE__ */ __name(() => handleTranscriptions(request), "/v1/audio/translations:POST"),
      // 复用转录
      // === 审核 ===
      "/v1/moderations:POST": /* @__PURE__ */ __name(() => handleModerations(request), "/v1/moderations:POST"),
      // === 文件与微调 (空列表欺骗) ===
      "/v1/files:GET": /* @__PURE__ */ __name(() => handleMockList(), "/v1/files:GET"),
      "/v1/fine_tuning/jobs:GET": /* @__PURE__ */ __name(() => handleMockList(), "/v1/fine_tuning/jobs:GET"),
      "/v1/assistants:GET": /* @__PURE__ */ __name(() => handleMockList(), "/v1/assistants:GET"),
      "/v1/threads:GET": /* @__PURE__ */ __name(() => handleMockList(), "/v1/threads:GET"),
      // === 网页 ===
      "/:GET": /* @__PURE__ */ __name(() => htmlResponse(getHomePage()), "/:GET"),
      "/index.html:GET": /* @__PURE__ */ __name(() => htmlResponse(getHomePage()), "/index.html:GET"),
      "/models:GET": /* @__PURE__ */ __name(() => htmlResponse(getModelsPage()), "/models:GET")
    };
    const routeKey = `${pathname}:${request.method}`;
    const handler = routes[routeKey];
    if (handler) {
      return handler();
    }
    if (pathname.startsWith("/v1/")) {
      return jsonResponse({
        error: {
          message: `Unknown endpoint: ${pathname}. Mio doesn't go there.`,
          type: "invalid_request_error",
          param: null,
          code: "unknown_url"
        }
      }, 404);
    }
    return new Response("404: Mio Not Found", { status: 404 });
  }
};

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-mOxIRK/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-mOxIRK/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
