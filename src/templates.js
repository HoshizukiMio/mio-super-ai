import config from './config.js';

const commonHead = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mio's SuperAI - 人工智障体验中心</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
    <style>
        /* 字体设置：英文用 Fredoka (圆润可爱)，中文用 Noto Sans SC 或微软雅黑 */
        body { 
            font-family: 'Fredoka', 'Noto Sans SC', 'Microsoft YaHei', sans-serif; 
            background: #fefce8; 
        }
        .blob { position: absolute; filter: blur(40px); z-index: -1; opacity: 0.6; }
        .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.5); }
        
        /* 简单的入场动画 */
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .float-anim { animation: float 3s ease-in-out infinite; }
    </style>
</head>
`;

const navBar = `
<nav class="p-4 flex justify-center space-x-8 text-lg font-bold text-pink-500">
    <a href="/" class="hover:text-pink-700 hover:underline transition flex items-center gap-2">
        <span>🏠</span> 首页
    </a>
    <a href="/models" class="hover:text-pink-700 hover:underline transition flex items-center gap-2">
        <span>🤖</span> 模型图鉴
    </a>
</nav>
`;

const background = `
<div class="blob bg-pink-300 w-64 h-64 rounded-full top-0 left-0 mix-blend-multiply animate-bounce" style="animation-duration: 6s;"></div>
<div class="blob bg-yellow-300 w-64 h-64 rounded-full top-0 right-0 mix-blend-multiply animate-bounce" style="animation-duration: 8s;"></div>
<div class="blob bg-blue-300 w-64 h-64 rounded-full bottom-0 left-20 mix-blend-multiply animate-bounce" style="animation-duration: 10s;"></div>
`;

export function getHomePage() {
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="flex-grow flex flex-col items-center justify-center w-full max-w-2xl p-4 text-center">
            <div class="float-anim">
                <h1 class="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                    Mio's SuperAI
                </h1>
            </div>
            <p class="text-xl mb-8 italic text-gray-500">
                "大概是全网最不靠谱的人工智能。"
            </p>

            <div class="glass rounded-3xl p-8 w-full shadow-xl transform hover:scale-105 transition duration-300">
                <h2 class="text-2xl font-bold mb-4 text-pink-600">✨ 你的专属 API 密钥 ✨</h2>
                
                <div class="bg-slate-800 text-green-400 font-mono p-4 rounded-lg break-all border-2 border-dashed border-slate-600 relative group cursor-pointer transition hover:border-pink-400" 
                     onclick="navigator.clipboard.writeText('${config.apiKey}'); alert('已复制到剪贴板！Mio 说要保管好哦！')">
                    ${config.apiKey}
                    <span class="absolute top-2 right-2 text-xs text-gray-400 group-hover:text-white bg-slate-700 px-2 py-1 rounded">点击复制</span>
                </div>

                <div class="mt-6 text-left bg-white/50 p-4 rounded-xl">
                    <p class="text-sm text-gray-600 mb-2 font-bold">🚀 接口配置指南 (Base URL):</p>
                    <code class="block bg-gray-200 px-3 py-2 rounded text-sm select-all">https://super-ai.hoshizukimio.com/v1</code>
                    <p class="text-xs text-gray-400 mt-2">支持 NextChat, LobeChat, LangChain 等所有 OpenAI 兼容客户端。</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-sm">
                <div class="glass p-4 rounded-xl">
                    <div class="text-2xl mb-1">🎲</div>
                    <div class="font-bold text-pink-600">完全随机</div>
                    <div class="text-gray-500">心情好就回，心情不好就报错。</div>
                </div>
                <div class="glass p-4 rounded-xl">
                    <div class="text-2xl mb-1">⚡</div>
                    <div class="font-bold text-pink-600">极速响应</div>
                    <div class="text-gray-500">虽然快，但可能全是废话。</div>
                </div>
                <div class="glass p-4 rounded-xl">
                    <div class="text-2xl mb-1">🎌</div>
                    <div class="font-bold text-pink-600">二次元</div>
                    <div class="text-gray-500">浓度过高，现充慎入。</div>
                </div>
            </div>
        </main>
        
        <footer class="p-4 text-gray-400 text-sm text-center">
            由 Cloudflare Workers 驱动 <br> 
            <span class="text-xs opacity-75">Made with 💖 and lots of Puddings.</span>
        </footer>
    </body>
    </html>
    `;
}

export function getModelsPage() {
    const modelsHtml = Object.entries(config.models).map(([id, model]) => `
        <div class="glass p-6 rounded-2xl shadow-md hover:shadow-xl transition border-l-8 border-pink-400 flex flex-col group">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-xl font-bold text-slate-800 break-all">${id}</h3>
                <span class="text-4xl transform group-hover:scale-125 transition">${model.avatar || '🤖'}</span>
            </div>
            <div class="mb-4 flex gap-2">
                <span class="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                    类型: ${model.type}
                </span>
            </div>
            <p class="text-gray-600 flex-grow text-sm leading-relaxed font-medium">
                ${model.description}
            </p>
            <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400 font-mono space-y-1">
                <div>Context: Random</div>
                <div>Training Data: Mio's Dreams</div>
            </div>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    ${commonHead}
    <body class="min-h-screen flex flex-col items-center relative overflow-hidden text-slate-700">
        ${background}
        ${navBar}

        <main class="w-full max-w-5xl p-4">
            <div class="text-center mb-10">
                <h1 class="text-4xl font-black text-pink-500 mb-2">Mio 模型展示厅</h1>
                <p class="text-gray-500">请选择你要使用的“降智打击”武器。</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                ${modelsHtml}
            </div>
            
            <div class="text-center text-sm text-gray-400 mb-8">
                提示：在客户端的 "自定义模型" 中输入上述 ID 即可调用。
            </div>
        </main>
    </body>
    </html>
    `;
}