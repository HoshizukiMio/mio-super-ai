import config from './config.js';

// 公共头部：引入 Tailwind 和 Noto Sans SC 字体
const commonHead = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mio's SuperAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- 引入 Noto Sans SC -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        /* 应用字体 */
        body { 
            font-family: 'Noto Sans SC', sans-serif; 
            background: #fefce8; 
        }
        .blob { position: absolute; filter: blur(40px); z-index: -1; opacity: 0.6; }
        /* 磨砂玻璃效果 */
        .glass { 
            background: rgba(255, 255, 255, 0.75); 
            backdrop-filter: blur(12px); 
            border: 1px solid rgba(255,255,255,0.6); 
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
    </style>
</head>
`;

// 导航栏
const navBar = `
<nav class="p-6 flex justify-center space-x-10 text-lg font-bold text-pink-500">
    <a href="/" class="hover:text-pink-700 hover:scale-110 transition transform">🏠 首页</a>
    <a href="/models" class="hover:text-pink-700 hover:scale-110 transition transform">📚 模型图鉴</a>
</nav>
`;

// 动态背景球
const background = `
<div class="blob bg-pink-300 w-80 h-80 rounded-full top-0 left-0 mix-blend-multiply animate-bounce" style="animation-duration: 6s;"></div>
<div class="blob bg-yellow-300 w-80 h-80 rounded-full top-0 right-0 mix-blend-multiply animate-bounce" style="animation-duration: 8s;"></div>
<div class="blob bg-blue-300 w-80 h-80 rounded-full bottom-0 left-20 mix-blend-multiply animate-bounce" style="animation-duration: 10s;"></div>
`;

// === 首页 ===
export function getHomePage() {
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="flex-grow flex flex-col items-center justify-center w-full max-w-3xl p-4 text-center z-10">
            <h1 class="text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 tracking-tight">
                Mio's SuperAI
            </h1>
            <p class="text-xl mb-10 font-medium text-slate-500">
                “大概是你用过最离谱的人工智障。”
            </p>

            <!-- API Key 卡片 -->
            <div class="glass rounded-3xl p-10 w-full shadow-2xl transform hover:-translate-y-1 transition duration-300">
                <h2 class="text-2xl font-bold mb-6 text-pink-600 flex items-center justify-center gap-2">
                    ✨ 你的专属 API 密钥 ✨
                </h2>
                <div class="bg-slate-800 text-green-400 font-mono p-5 rounded-xl break-all border-2 border-dashed border-slate-600 relative group cursor-pointer transition hover:bg-slate-900 hover:border-green-500 shadow-inner text-lg" 
                     onclick="navigator.clipboard.writeText('${config.apiKey}'); const el=this.querySelector('span'); el.innerText='已复制！'; setTimeout(()=>el.innerText='点击复制', 2000);">
                    ${config.apiKey}
                    <span class="absolute top-3 right-3 text-xs text-gray-500 group-hover:text-white font-sans bg-slate-700 px-2 py-1 rounded transition">点击复制</span>
                </div>
                
                <div class="mt-6 grid grid-cols-1 gap-2 text-sm text-gray-600 bg-white/50 p-4 rounded-lg border border-pink-100">
                    <p class="flex justify-between">
                        <span class="font-bold">Base URL (接口地址):</span>
                        <code class="bg-gray-200 px-2 py-0.5 rounded text-pink-600 select-all">https://[你的域名]/v1</code>
                    </p>
                    <p class="mt-2 text-xs text-center text-gray-400">支持 Chat, Embeddings, DALL-E, Whisper 等接口格式</p>
                </div>
            </div>

            <!-- 特性介绍 -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div class="glass p-6 rounded-2xl text-left hover:bg-white/80 transition">
                    <div class="text-5xl mb-4">🎲</div>
                    <h3 class="font-bold text-xl mb-2 text-slate-800">完全不可预测</h3>
                    <p class="text-slate-600 leading-relaxed">它可能会认真回答你，可能会突然报错，也可能只是想给你讲个冷笑话。Mio 的心情决定一切。</p>
                </div>
                <div class="glass p-6 rounded-2xl text-left hover:bg-white/80 transition">
                    <div class="text-5xl mb-4">🎭</div>
                    <h3 class="font-bold text-xl mb-2 text-slate-800">虚假模型库</h3>
                    <p class="text-slate-600 leading-relaxed">我们提供最先进的 JSON 配置文件模型。请求不存在的模型（如 GPT-4）会被 Mio 无情拒绝。</p>
                </div>
            </div>
        </main>
        
        <footer class="p-6 text-slate-400 text-sm font-medium">
            Powered by Cloudflare Workers & Mio 的脑洞
        </footer>
    </body>
    </html>
    `;
}

// === 模型图鉴页 ===
export function getModelsPage() {
    // 渲染模型卡片
    const modelsHtml = Object.entries(config.models).map(([id, model]) => {
        // 翻译模型类型
        const typeMap = {
            "chat": "聊天对话",
            "chat_logic": "逻辑处理",
            "embedding": "文本嵌入",
            "image": "AI 绘图",
            "audio_in": "语音识别",
            "audio_out": "语音合成",
            "moderation": "安全审核"
        };
        const typeName = typeMap[model.type] || model.type;

        // 随机生成一些伪参数
        const contextWindow = Math.floor(Math.random() * 10000) + 1000;
        
        return `
        <div class="glass p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-l-8 border-pink-400 flex flex-col relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 text-9xl opacity-10 group-hover:opacity-20 transition select-none pointer-events-none">
                ${model.avatar || '🤖'}
            </div>
            
            <div class="flex justify-between items-start mb-4 z-10">
                <div>
                    <h3 class="text-xl font-black text-slate-800 break-all">${id}</h3>
                    <span class="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">
                        ${typeName}
                    </span>
                </div>
                <span class="text-5xl filter drop-shadow-lg animate-pulse">${model.avatar || '🤖'}</span>
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
    }).join('');

    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="w-full max-w-6xl p-4 z-10">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-black text-pink-500 mb-4 drop-shadow-sm">Mio 模型画廊</h1>
                <p class="text-xl text-slate-500">请选择你要调用的混乱源头（仅支持以下模型 ID）</p>
            </div>

            <!-- Grid 布局 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                ${modelsHtml}
            </div>
            
            <!-- 提示信息 -->
            <div class="text-center bg-white/30 p-4 rounded-lg mx-auto max-w-2xl border border-pink-200">
                <p class="text-sm text-slate-600">
                    💡 提示：在 API 调用中，必须严格使用上述 <code class="bg-pink-100 px-1 rounded text-pink-600 font-bold">ID</code>。
                    <br>如果尝试调用 gpt-4 等不存在的模型，Mio 会生气并报错。
                </p>
            </div>
        </main>
    </body>
    </html>
    `;
}