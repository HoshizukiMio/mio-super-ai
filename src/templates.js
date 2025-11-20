import config from './config.js';

// Common Head: Tailwind + Noto Sans (Global)
const commonHead = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mio's SuperAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
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

// Navigation
const navBar = `
<nav class="p-6 flex justify-center space-x-10 text-lg font-bold text-pink-500">
    <a href="/" class="hover:text-pink-700 hover:scale-110 transition transform">🏠 Home</a>
    <a href="/models" class="hover:text-pink-700 hover:scale-110 transition transform">📚 Model Gallery</a>
</nav>
`;

// Animated Background Blobs
const background = `
<div class="blob bg-pink-300 w-80 h-80 rounded-full top-0 left-0 mix-blend-multiply animate-bounce" style="animation-duration: 6s;"></div>
<div class="blob bg-yellow-300 w-80 h-80 rounded-full top-0 right-0 mix-blend-multiply animate-bounce" style="animation-duration: 8s;"></div>
<div class="blob bg-blue-300 w-80 h-80 rounded-full bottom-0 left-20 mix-blend-multiply animate-bounce" style="animation-duration: 10s;"></div>
`;

// === Home Page ===
export function getHomePage() {
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
                    ✨ Your API Key ✨
                </h2>
                <div class="bg-slate-800 text-green-400 font-mono p-5 rounded-xl break-all border-2 border-dashed border-slate-600 relative group cursor-pointer transition hover:bg-slate-900 hover:border-green-500 shadow-inner text-lg" 
                     onclick="navigator.clipboard.writeText('${config.apiKey}'); const el=this.querySelector('span'); el.innerText='Copied!'; setTimeout(()=>el.innerText='Click to Copy', 2000);">
                    ${config.apiKey}
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
                    <div class="text-5xl mb-4">🎲</div>
                    <h3 class="font-bold text-xl mb-2 text-slate-800">Totally Unpredictable</h3>
                    <p class="text-slate-600 leading-relaxed">It might answer you, it might throw an error, or it might just tell you a bad joke. Mio's mood decides everything.</p>
                </div>
                <div class="glass p-6 rounded-2xl text-left hover:bg-white/80 transition">
                    <div class="text-5xl mb-4">🎭</div>
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

// === Models Page ===
export function getModelsPage() {
    // Render Cards
    const modelsHtml = Object.entries(config.models).map(([id, model]) => {
        // Map types to readable English
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

        // Random fake specs
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
                    💡 Tip: You must strictly use the <code class="bg-pink-100 px-1 rounded text-pink-600 font-bold">ID</code> shown above.
                    <br>Asking for nonexistent models (like GPT-4) will make Mio angry.
                </p>
            </div>
        </main>
    </body>
    </html>
    `;
}