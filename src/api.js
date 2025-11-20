import config from './config.js';
import { getRandomItem, applyMioLogic, jsonResponse, ensureModelExists } from './utils.js';

// 通用错误检查 (随机心情)
function checkMioMood() {
  if (Math.random() < config.errorRate) {
    throw {
      message: getRandomItem(config.errorMessages),
      type: "server_error",
      code: "mio_mood_swing"
    };
  }
}

// === 1. 模型列表 (GET /v1/models) ===
export async function handleModels() {
  // 只返回 config 中配置的模型，不添加任何 OpenAI 标准模型
  const modelList = Object.keys(config.models).map(id => ({
    id: id,
    object: "model",
    created: 1677610602,
    owned_by: "mio-super-ai",
    permission: []
  }));

  return jsonResponse({ object: "list", data: modelList });
}

// === 2. 聊天补全 (POST /v1/chat/completions) ===
export async function handleChat(request) {
  try {
    const body = await request.json();
    const modelId = body.model;
    
    // 1. 严格校验模型
    const modelConfig = ensureModelExists(modelId);
    
    // 2. 检查心情
    checkMioMood();

    const messages = body.messages || [];
    const lastMessage = messages.length > 0 ? String(messages[messages.length - 1].content) : "";
    
    // 3. 生成逻辑
    let replyContent = getRandomItem(modelConfig.responses || ["Mio?"]);
    
    if (modelConfig.keywords) {
      const foundKey = Object.keys(modelConfig.keywords).find(k => lastMessage.includes(k));
      if (foundKey) replyContent = modelConfig.keywords[foundKey];
    }
    
    if (modelConfig.type === 'chat_logic' && !Object.keys(modelConfig.keywords || {}).some(k => lastMessage.includes(k))) {
        replyContent = applyMioLogic(lastMessage);
        if(replyContent.length < 2) replyContent = getRandomItem(modelConfig.responses);
    }

    return jsonResponse({
      id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: modelId,
      choices: [{ index: 0, message: { role: "assistant", content: replyContent }, finish_reason: "stop" }],
      usage: { prompt_tokens: lastMessage.length, completion_tokens: replyContent.length, total_tokens: lastMessage.length + replyContent.length }
    });
  } catch (err) {
    const status = err.type === 'invalid_request_error' ? 404 : 500;
    return jsonResponse({ error: err }, status);
  }
}

// === 3. 旧版文本补全 (POST /v1/completions) ===
export async function handleLegacyCompletions(request) {
  try {
    const body = await request.json();
    
    // 校验模型 (即使用户传 gpt-3.5-turbo-instruct 也会报错，强制用 mio 模型)
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
    return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
  }
}

// === 4. 嵌入 (POST /v1/embeddings) ===
export async function handleEmbeddings(request) {
  try {
    const body = await request.json();
    
    // 必须请求 'mio-embed-dim-0'
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

// === 5. 图片生成 (POST /v1/images/generations) ===
export async function handleImages(request) {
  try {
    const body = await request.json();
    
    // 必须请求 'mio-paint-v1'。如果客户端默认发送 'dall-e-3'，这里会直接报错 404。
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

// === 6. 语音合成 (POST /v1/audio/speech) ===
export async function handleAudioSpeech(request) {
  try {
    const body = await request.json();
    
    // 必须请求 'mio-voice-v1'
    ensureModelExists(body.model);

    checkMioMood();
    
    return new Response("Mio Singing Data...", {
      headers: { "Content-Type": "audio/mpeg", "Transfer-Encoding": "chunked" }
    });
  } catch (err) {
    return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
  }
}

// === 7. 语音转录 (POST /v1/audio/transcriptions) ===
export async function handleTranscriptions(request) {
  try {
    // FormData 处理比较复杂，这里简化检查。
    // 假设客户端在 multipart/form-data 中包含 model 字段。
    // Cloudflare Worker 解析 FormData 需要 await request.formData()
    const formData = await request.formData();
    const modelId = formData.get('model');

    // 必须请求 'mio-ear-v1'
    ensureModelExists(modelId);

    checkMioMood();

    return jsonResponse({ text: getRandomItem(config.transcriptions) });
  } catch (err) {
    // 处理 formData 解析错误或模型错误
    const isModelErr = err.code === 'model_not_found' || err.code === 'model_missing';
    return jsonResponse({ error: isModelErr ? err : { message: "Invalid form data", type: "invalid_request_error" } }, isModelErr ? 404 : 500);
  }
}

// === 8. 内容审核 (POST /v1/moderations) ===
export async function handleModerations(request) {
  try {
    const body = await request.json();
    
    // 必须请求 'mio-police-v1'
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
    return jsonResponse({ error: err }, err.type === 'invalid_request_error' ? 404 : 500);
  }
}

// === 9. 兜底接口 ===
export async function handleMockList() {
  return jsonResponse({ object: "list", data: [] });
}