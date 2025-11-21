import { 
  handleChat, handleModels, handleLegacyCompletions, handleEmbeddings, 
  handleImages, handleAudioSpeech, handleTranscriptions, handleModerations, handleMockList
} from './api.js';
import { getHomePage, getModelsPage } from './templates.js';
import { htmlResponse, jsonResponse } from './utils.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        }
      });
    }

    const routes = {
      "/:GET": () => htmlResponse(getHomePage()),
      "/index.html:GET": () => htmlResponse(getHomePage()),
      "/models:GET": () => htmlResponse(getModelsPage()),
      "/v1/models:GET": () => handleModels(),
      "/v1/chat/completions:POST": () => handleChat(request),
      "/v1/completions:POST": () => handleLegacyCompletions(request),
      "/v1/embeddings:POST": () => handleEmbeddings(request),
      "/v1/images/generations:POST": () => handleImages(request),
      "/v1/images/edits:POST": () => handleImages(request),
      "/v1/images/variations:POST": () => handleImages(request),
      "/v1/audio/speech:POST": () => handleAudioSpeech(request),
      "/v1/audio/transcriptions:POST": () => handleTranscriptions(request),
      "/v1/audio/translations:POST": () => handleTranscriptions(request),
      "/v1/moderations:POST": () => handleModerations(request),
      "/v1/files:GET": () => handleMockList(),
      "/v1/fine_tuning/jobs:GET": () => handleMockList(),
      "/v1/assistants:GET": () => handleMockList(),
      "/v1/threads:GET": () => handleMockList()
    };

    const routeKey = `${pathname}:${request.method}`;
    const handler = routes[routeKey];

    if (handler) return handler();

    if (pathname.startsWith('/v1/')) {
        return jsonResponse({
            error: {
                message: `Unknown endpoint: ${pathname}. Mio doesn't go there.`,
                type: "invalid_request_error",
                code: "unknown_url"
            }
        }, 404);
    }

    return new Response("404: Mio Not Found", { status: 404 });
  }
};