import config from './config.js';
import { getRandomItem, applyMioLogic, jsonResponse, ensureModelExists, verifyApiKey } from './utils.js';

// 1x1 透明 PNG (Base64兜底，防止下载失败时客户端崩溃)
const MOCK_B64_IMAGE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk5+ffDwACvwF3YOQ8AAAAAABJRU5ErkJggg==";

// 检查心情 (随机报错)
function checkMioMood() {
  if (Math.random() < config.errorRate) {
    throw {
      message: getRandomItem(config.errorMessages),
      type: "server_error",
      code: "mio_mood_swing"
    };
  }
}

// === 辅助函数：下载图片并转 Base64 ===
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const arrayBuffer = await response.arrayBuffer();
    
    // Cloudflare Worker 中高效的二进制转 Base64 写法
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    // 分块处理防止栈溢出
    for (let i = 0; i < len; i += 1024) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 1024, len)));
    }
    return btoa(binary);
  } catch (e) {
    // 下载失败回退到兜底图
    return MOCK_B64_IMAGE;
  }
}

// === 伪造流式响应 (SSE) ===
function streamResponse(modelId, content) {
  const encoder = new TextEncoder();
  const id = `chatcmpl-${Math.random().toString(36).slice(2, 10)}`;
  const created = Math.floor(Date.now() / 1000);

  const stream = new ReadableStream({
    async start(controller) {
      const sendChunk = (delta, finish_reason = null) => {
        const chunk = {
          id: id, object: "chat.completion.chunk", created: created, model: modelId,
          choices: [{ index: 0, delta: delta, finish_reason: finish_reason }]
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      };

      sendChunk({ role: "assistant", content: "" }); // 起始包
      sendChunk({ content: content });               // 内容包
      sendChunk({}, "stop");                         // 结束包
      controller.enqueue(encoder.encode("data: [DONE]\n\n")); // 终止符
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

// 通用错误处理器
function handleError(err) {
  let status = 500;
  if (err.type === 'authentication_error') status = 401;
  else if (err.type === 'invalid_request_error') status = 404;
  else if (err.code === 'empty_message') status = 400;
  return jsonResponse({ error: err }, status);
}

// === 1. Chat Completions ===
export async function handleChat(request) {
  try {
    verifyApiKey(request); 
    const body = await request.json();
    const modelId = body.model;
    const isStream = body.stream === true;
    const modelConfig = ensureModelExists(modelId);
    checkMioMood();

    const messages = body.messages || [];
    let lastMessage = "";
    if (messages.length > 0) {
      const contentObj = messages[messages.length - 1].content;
      if (Array.isArray(contentObj)) {
        const textPart = contentObj.find(i => i.type === 'text');
        lastMessage = textPart ? textPart.text : "";
      } else {
        lastMessage = String(contentObj || "");
      }
    }

    if (!lastMessage.trim()) {
      throw { message: "Mio didn't hear anything.", type: "invalid_request_error", code: "empty_message" };
    }

    let replyContent = "";

    if (modelConfig.type === 'image') {
      const imageUrl = getRandomItem(config.images);
      const prompt = lastMessage.length > 10 ? lastMessage.slice(0, 10) + "..." : lastMessage;
      replyContent = `Mio 根据你的描述 "${prompt}" 画了一张图：\n\n![Mio Art](${imageUrl})\n\n*(注：Mio 觉得这张图简直是艺术)*`;
    } 
    else {
      replyContent = getRandomItem(modelConfig.responses || ["Mio?"]);
      let keywordMatched = false;

      if (modelConfig.keywords) {
        const foundKey = Object.keys(modelConfig.keywords).find(k => lastMessage.includes(k));
        if (foundKey) {
          replyContent = modelConfig.keywords[foundKey];
          keywordMatched = true;
        }
      }
      
      if (!keywordMatched && modelConfig.type === 'chat_logic') {
          const logicResult = applyMioLogic(lastMessage);
          if(logicResult.length > 1) replyContent = logicResult;
      }
    }

    if (isStream) {
      return streamResponse(modelId, replyContent);
    } else {
      return jsonResponse({
        id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: modelId,
        choices: [{ index: 0, message: { role: "assistant", content: replyContent }, finish_reason: "stop" }],
        usage: { prompt_tokens: lastMessage.length, completion_tokens: replyContent.length, total_tokens: lastMessage.length + replyContent.length }
      });
    }
  } catch (err) {
    return handleError(err);
  }
}

// === 2. Models List ===
export async function handleModels(request) {
  try {
    verifyApiKey(request);

    const modelList = Object.keys(config.models).map(id => ({
      id: id,
      object: "model",
      created: 1677610602,
      owned_by: "mio-super-ai",
      permission: []
    }));

    return jsonResponse({ object: "list", data: modelList });
  } catch (err) {
    return handleError(err);
  }
}

// === 3. Image Generations (支持真实 Base64) ===
export async function handleImages(request) {
  try {
    verifyApiKey(request);
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();

    let count = parseInt(body.n) || 1;
    if (count < 1) count = 1; if (count > 10) count = 10;
    
    // 检查客户端请求的格式
    const responseFormat = body.response_format || "url"; // 'url' 或 'b64_json'
    const prompt = body.prompt || "Mio's imagination";

    const data = [];
    
    // 并行处理多张图片的逻辑
    const tasks = [];
    for (let i = 0; i < count; i++) {
        tasks.push((async () => {
            const selectedUrl = getRandomItem(config.images);
            const item = { revised_prompt: `Mio 绘制了: ${prompt}` };

            if (responseFormat === "b64_json") {
                // 实时下载图片并转 Base64
                item.b64_json = await imageUrlToBase64(selectedUrl);
            } else {
                // 仅返回 URL
                item.url = selectedUrl;
            }
            return item;
        })());
    }

    const results = await Promise.all(tasks);

    return jsonResponse({ 
        created: Math.floor(Date.now() / 1000), 
        data: results 
    });

  } catch (err) {
    return handleError(err);
  }
}

// === 4. Embeddings ===
export async function handleEmbeddings(request) {
  try {
    verifyApiKey(request);
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    return jsonResponse({
      object: "list",
      data: [{ object: "embedding", embedding: Array.from({length:1536},()=>Math.random()-0.5), index: 0 }],
      model: body.model,
      usage: { prompt_tokens: 10, total_tokens: 10 }
    });
  } catch (err) {
    return handleError(err);
  }
}

// === 5. Legacy Completions ===
export async function handleLegacyCompletions(request) {
  try {
    verifyApiKey(request);
    const body = await request.json();
    const modelConfig = ensureModelExists(body.model);
    checkMioMood();
    const prompt = body.prompt || "";
    const reply = getRandomItem(modelConfig.responses || ["Mio completion."]);
    return jsonResponse({
      id: `cmpl-${Math.random().toString(36).slice(2, 10)}`,
      object: "text_completion",
      created: Math.floor(Date.now() / 1000),
      model: body.model,
      choices: [{ text: reply, index: 0, logprobs: null, finish_reason: "length" }],
      usage: { prompt_tokens: prompt.length, completion_tokens: reply.length, total_tokens: prompt.length + reply.length }
    });
  } catch (err) {
    return handleError(err);
  }
}

// === 6. Audio Speech ===
export async function handleAudioSpeech(request) {
  try {
    verifyApiKey(request);
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    return new Response("Mio Singing Data...", {
      headers: { "Content-Type": "audio/mpeg", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return handleError(err);
  }
}

// === 7. Audio Transcriptions ===
export async function handleTranscriptions(request) {
  try {
    verifyApiKey(request);
    let modelId;
    try {
        const formData = await request.formData();
        modelId = formData.get('model');
    } catch (e) {}
    ensureModelExists(modelId);
    checkMioMood();
    return jsonResponse({ text: getRandomItem(config.transcriptions) });
  } catch (err) {
    return handleError(err);
  }
}

// === 8. Moderations ===
export async function handleModerations(request) {
  try {
    verifyApiKey(request);
    const body = await request.json();
    ensureModelExists(body.model);
    checkMioMood();
    const isFlagged = Math.random() > 0.9;
    return jsonResponse({
      id: `modr-${Math.random().toString(36).slice(2, 10)}`,
      model: body.model,
      results: [{
        flagged: isFlagged,
        categories: { "sexual": false, "hate": false, "violence": isFlagged },
        category_scores: { "violence": isFlagged ? 0.99 : 0.01 }
      }]
    });
  } catch (err) {
    return handleError(err);
  }
}

// === 9. Mock List ===
export async function handleMockList() {
  return jsonResponse({ object: "list", data: [] });
}