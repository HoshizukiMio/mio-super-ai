import config from './config.js';

// 预编译正则 (防止 Scunthorpe 问题)
const CN_QUESTION_WORDS = ["吗", "呢", "什么", "啥", "谁", "哪", "怎么", "几", "多少"];
const EN_QUESTION_WORDS = ["why", "what", "where", "who", "how", "when"];
const REGEX_PATTERN = [
  ...CN_QUESTION_WORDS, 
  ...EN_QUESTION_WORDS.map(w => `\\b${w}\\b`) // 英文单词加边界
].join('|');
const QUESTION_REGEX = new RegExp(REGEX_PATTERN, 'gi');

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 逻辑处理：去除疑问词，符号转换
export function applyMioLogic(text) {
  if (!text) return "";
  let result = text.replace(QUESTION_REGEX, "");
  result = result.replace(/\?/g, ".").replace(/？/g, "。");
  result = result.replace(/\s+/g, " ").trim(); // 清理空格
  if (!/[.。,，!！]$/.test(result)) result += "。";
  return result;
}

// 模型校验
export function ensureModelExists(modelId) {
  if (!modelId) {
    throw {
      message: "Model parameter is missing.",
      type: "invalid_request_error",
      param: "model",
      code: "model_missing"
    };
  }
  if (!config.models[modelId]) {
    throw {
      message: `The model '${modelId}' does not exist. Available models: ${Object.keys(config.models).join(', ')}`,
      type: "invalid_request_error",
      param: "model",
      code: "model_not_found"
    };
  }
  return config.models[modelId];
}

// === 新增：API Key 校验 ===
export function verifyApiKey(request) {
  const authHeader = request.headers.get("Authorization");
  // 允许 "Bearer sk-xxx" 或直接 "sk-xxx"
  // 简单判断：只要包含配置的 Key 即可
  if (!authHeader || !authHeader.includes(config.apiKey)) {
    throw {
      message: "Incorrect API key provided. Mio doesn't know you.",
      type: "authentication_error",
      code: "invalid_api_key"
    };
  }
}

// 统一 CORS 头部
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
};

export const htmlResponse = (html) => {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
};