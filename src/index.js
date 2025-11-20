import { 
  handleChat, 
  handleModels, 
  handleLegacyCompletions, 
  handleEmbeddings, 
  handleImages,
  handleAudioSpeech,
  handleTranscriptions,
  handleModerations,
  handleMockList
} from './api.js';
import { getHomePage, getModelsPage } from './templates.js';
import { htmlResponse, jsonResponse } from './utils.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. 全局 CORS 预检
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        }
      });
    }

    // 2. 路由表 (OpenAI 全家桶)
    const routes = {
      // === 基础 ===
      "/v1/models:GET": () => handleModels(),
      
      // === 文本 ===
      "/v1/chat/completions:POST": () => handleChat(request),
      "/v1/completions:POST": () => handleLegacyCompletions(request),
      "/v1/embeddings:POST": () => handleEmbeddings(request),
      
      // === 图像 (DALL-E) ===
      "/v1/images/generations:POST": () => handleImages(request),
      "/v1/images/edits:POST": () => handleImages(request),     // 复用生成逻辑
      "/v1/images/variations:POST": () => handleImages(request),// 复用生成逻辑
      
      // === 音频 (Whisper/TTS) ===
      "/v1/audio/speech:POST": () => handleAudioSpeech(request),
      "/v1/audio/transcriptions:POST": () => handleTranscriptions(request),
      "/v1/audio/translations:POST": () => handleTranscriptions(request), // 复用转录
      
      // === 审核 ===
      "/v1/moderations:POST": () => handleModerations(request),
      
      // === 文件与微调 (空列表欺骗) ===
      "/v1/files:GET": () => handleMockList(),
      "/v1/fine_tuning/jobs:GET": () => handleMockList(),
      "/v1/assistants:GET": () => handleMockList(),
      "/v1/threads:GET": () => handleMockList(),

      // === 网页 ===
      "/:GET": () => htmlResponse(getHomePage()),
      "/index.html:GET": () => htmlResponse(getHomePage()),
      "/models:GET": () => htmlResponse(getModelsPage())
    };

    // 3. 路由匹配
    const routeKey = `${pathname}:${request.method}`;
    const handler = routes[routeKey];

    if (handler) {
      return handler();
    }

    // 4. 404 处理 (返回 JSON 格式的 404，更像 API)
    if (pathname.startsWith('/v1/')) {
        return jsonResponse({
            error: {
                message: `Unknown endpoint: ${pathname}. Mio doesn't go there.`,
                type: "invalid_request_error",
                param: null,
                code: "unknown_url"
            }
        }, 404);
    }

    // 网页 404
    return new Response("404: Mio Not Found", { status: 404 });
  }
};