import config from './config.js';

/**
 * 预编译正则以提升性能
 * 将所有疑问词合并为一个正则：/(吗|呢|什么|...)/gi
 */
const QUESTION_WORDS = [
  "吗", "呢", "什么", "啥", "谁", "哪", "怎么", "几", "多少", 
  "why", "what", "where", "who", "how", "when"
];
const QUESTION_REGEX = new RegExp(QUESTION_WORDS.join('|'), 'gi');

/**
 * 从数组中随机获取一项
 */
export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * 逻辑处理：去除疑问词，符号转换
 * 优化：使用预编译正则一次性处理
 */
export function applyMioLogic(text) {
  if (!text) return "";

  // 1. 移除所有疑问词
  let result = text.replace(QUESTION_REGEX, "");

  // 2. 替换标点 (链式调用)
  result = result
    .replace(/\?/g, ".")   // 英文问号 -> 点
    .replace(/？/g, "。"); // 中文问号 -> 句号

  // 3. 兜底标点补全
  if (!/[.。,，!！]$/.test(result)) {
    result += "。";
  }

  return result.trim();
}

export function ensureModelExists(modelId) {
  // 如果用户没传 model 参数，或者是空字符串，视情况抛出错误或允许（某些接口如 DALL-E 旧版可能不需要 model，但为了严格模拟，我们要求必须传）
  if (!modelId) {
    throw {
      message: "Model parameter is missing. Mio needs to know who you are looking for.",
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

/**
 * 统一构建 JSON 响应 (含 CORS)
 */
export const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // 允许所有跨域
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};

/**
 * 统一构建 HTML 响应
 */
export const htmlResponse = (html) => {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
};