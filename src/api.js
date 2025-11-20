import config from './config.js';
import { getRandomItem, applyMioLogic, jsonResponse, ensureModelExists } from './utils.js';

// 通用错误检查
function checkMioMood() {
  if (Math.random() < config.errorRate) {
    throw {
      message: getRandomItem(config.errorMessages),
      type: "server_error",
      code: "mio_mood_swing"
    };
  }
}

// === 辅助函数：伪造流式响应 (SSE) ===
function streamResponse(modelId, content) {
  const encoder = new TextEncoder();
  const id = `chatcmpl-${Math.random().toString(36).slice(2, 10)}`;
  const created = Math.floor(Date.now() / 1000);

  const stream = new ReadableStream({
    async start(controller) {
      // 模拟打字机效果：虽然是假的，但我们分两次发送（内容 + 结束符），
      // 这样客户端就能识别出这是流式数据。
      
      // 1. 发送内容数据包
      const chunkData = {
        id: id,
        object: "chat.completion.chunk", // 注意这里是 chunk
        created: created,
        model: modelId,
        choices: [{
          index: 0,
          delta: { content: content }, // 流式传输使用的是 delta 而不是 message
          finish_reason: null
        }]
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunkData)}\n\n`));

      // 2. 发送结束数据包
      const endChunk = {
        id: id,
        object: "chat.completion.chunk",
        created: created,
        model: modelId,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: "stop"
        }]
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
      
      // 3. 发送标准结束标记
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
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

// === 1. 模型列表 ===
export async function handleModels() {
  const modelList = Object.keys(config.models).map(id => ({
    id: id,
    object: "model",
    created: 1677610602,
    owned_by: "mio-super-ai",
    permission: []
  }));
  return jsonResponse({ object: "list", data: modelList });
}

// === 2. 聊天补全 (核心修改) ===
export async function handleChat(request) {
  try {
    const body = await request.json();
    const modelId = body.model;
    const isStream = body.stream === true; // 检查客户端是否请求流式传输

    // 1. 严格校验模型
    const modelConfig = ensureModelExists(modelId);
    
    // 2. 检查心情
    checkMioMood();

    const messages = body.messages || [];
    const lastMessage = messages.length > 0 ? String(messages[messages.length - 1].content) : "";
    
    // 3. 生成回复内容
    let replyContent = getRandomItem(modelConfig.responses || ["Mio?"]);
    
    if (modelConfig.keywords) {
      const foundKey = Object.keys(modelConfig.keywords).find(k => lastMessage.includes(k));
      if (foundKey) replyContent = modelConfig.keywords[foundKey];
    }
    
    if (modelConfig.type === 'chat_logic' && !Object.keys(modelConfig.keywords || {}).some(k => lastMessage.includes(k))) {
        replyContent = applyMioLogic(lastMessage);
        if(replyContent.length < 2) replyContent = getRandomItem(modelConfig.responses);
    }

    // === 4. 分支处理：流式 vs 非流式 ===
    if (isStream) {
      return streamResponse(modelId, replyContent);
    } else {
      // 非流式 (普通 JSON)
      return jsonResponse({
        id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: modelId,
        choices: [{ 
          index: 0, 
          message: { role: "assistant", content: replyContent }, // 非流式用 message
          finish_reason: "stop" 
        }],
        usage: { prompt_tokens: lastMessage.length, completion_tokens: replyContent.length, total_tokens: lastMessage.length + replyContent.length }
      });
    }

  } catch (err) {
    const status = err.type === 'invalid_request_error' ? 404 : 500;
    // 如果是流式请求出错，返回 JSON 可能会让客户端困惑，但在建立连接前返回 JSON 错误通常是可行的
    return jsonResponse({ error: err }, status);
  }
}

// ... (其他函数 handleLegacyCompletions, handleEmbeddings 等保持不变，不需要流式支持) ...
// 只有 handleChat 是大多数客户端默认开启流式的接口

export async function handleLegacyCompletions(request) {
  // 为了防止旧版接口也报类似错误，我们也简单处理一下 stream 参数（虽然很少人用）
  try {
    const body = await request.json();
    const modelConfig = ensureModelExists(body.model);
    checkMioMood();
    const prompt = body.prompt || "";
    const reply = getRandomItem(modelConfig.responses || ["Mio completion."]);

    // 这里简单起见，只返回 JSON，通常 Legacy 接口客户端容错率高
    return jsonResponse({
      id: `cmpl-${Math.random().toString(36).slice(2, 10)}`,
      object: "text_completion",
      created: Math.floor(Date.now() / 1000),
      model: body.model,
      choices: [{ text: reply, index: 0, logprobs: null, finish_reason: "length" }],
      usage: { prompt_tokens: prompt.length, completion_tokens: reply.length, total_tokens: prompt.length + reply.length }
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
  }
}

export async function handleEmbeddings(request) {
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
      return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
    }
  }
  
  export async function handleImages(request) {
    try {
      const body = await request.json();
      ensureModelExists(body.model);
      checkMioMood();
      return jsonResponse({
        created: Math.floor(Date.now() / 1000),
        data: [{ url: getRandomItem(config.images) }]
      });
    } catch (err) {
      return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
    }
  }
  
  export async function handleAudioSpeech(request) {
    try {
      const body = await request.json();
      ensureModelExists(body.model);
      checkMioMood();
      return new Response("Mio Singing Data...", {
        headers: { "Content-Type": "audio/mpeg", "Transfer-Encoding": "chunked" }
      });
    } catch (err) {
      return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
    }
  }
  
  export async function handleTranscriptions(request) {
    try {
      const formData = await request.formData();
      const modelId = formData.get('model');
      ensureModelExists(modelId);
      checkMioMood();
      return jsonResponse({ text: getRandomItem(config.transcriptions) });
    } catch (err) {
      const isModelErr = err.code === 'model_not_found' || err.code === 'model_missing';
      return jsonResponse({ error: isModelErr ? err : { message: "Invalid form data", type: "invalid_request_error" } }, isModelErr ? 404 : 500);
    }
  }
  
  export async function handleModerations(request) {
    try {
      const body = await request.json();
      ensureModelExists(body.model);
      checkMioMood();
      const isFlagged = Math.random() > 0.9;
      return jsonResponse({
        id: `modr-${Math.random().toString(36).slice(2, 10)}`,
        model: body.model,
        results: [{
          flagged: isFlagged,
          categories: {
            "sexual": false, "hate": false, "harassment": false, "self-harm": false, "sexual/minors": false,
            "hate/threatening": false, "violence/graphic": false, "self-harm/intent": false, "self-harm/instructions": false,
            "harassment/threatening": false, "violence": isFlagged
          },
          category_scores: {
            "sexual": 0.01, "hate": 0.01, "harassment": 0.01, "self-harm": 0.01, "sexual/minors": 0.01,
            "hate/threatening": 0.01, "violence/graphic": 0.01, "self-harm/intent": 0.01, "self-harm/instructions": 0.01,
            "harassment/threatening": 0.01, "violence": isFlagged ? 0.99 : 0.01
          }
        }]
      });
    } catch (err) {
      return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
    }
  }
  
  export async function handleMockList() {
    return jsonResponse({ object: "list", data: [] });
  }