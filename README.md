# ⚡ Mio's SuperAI

[**English**](README.md) | [简体中文](README.zh_CN.md)

> "Probably the worst AI you'll ever use."

**Mio's SuperAI** is a Cloudflare Workers-based mock API provider. It mimics the OpenAI API structure but returns completely fake, randomized, and often chaotic responses based on a configuration file. 

It features a "mood system" that randomly throws errors, an ACG-themed persona, and a beautiful web interface. Perfect for testing error handling in your apps or just Pranking your friends.

![License](https://img.shields.io/badge/license-MIT-pink)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange)
![Mio](https://img.shields.io/badge/Mio-Cute-ff69b4)

## ✨ Features

- **OpenAI Compatible**: Supports `/v1/chat/completions`, `/v1/images/generations`, `/v1/audio/speech`, and more.
- **Configurable Models**: Define your own fake models in `src/config.js` (e.g., `mio-flash-v1`, `mio-otaku-xl`).
- **Random Chaos**: Configurable `errorRate` (e.g., 20% chance to return 500 errors).
- **Keyword Triggers**: Define specific replies for keywords (e.g., "Hello" -> "Want some tea?").
- **Logic Modes**: Special logic like removing question marks or acting like a "Logic Master".
- **Strict Validation**: Rejects standard model names like `gpt-4`; forces users to use your custom models.
- **Web Interface**: A cute, TailwindCSS-based landing page to display your API Key and Model List.

## 📂 Project Structure

```text
mio-super-ai/
├── wrangler.toml        # Cloudflare configuration
└── src/
    ├── config.js        # Core config (Models, Errors, Keywords)
    ├── utils.js         # Logic helpers & RegEx
    ├── templates.js     # HTML UI templates
    ├── api.js           # API Logic (Chat, Image, Audio...)
    └── index.js         # Router
```

## 🚀 Deployment

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)

### Steps

1. **Clone/Download** this repository.
2. **Install dependencies** (if any, mostly just wrangler is needed):
   ```bash
   npm install
   ```
3. **Local Development**:
   ```bash
   wrangler dev
   ```
   Open `http://localhost:8787` to see the interface.

4. **Deploy to Cloudflare**:
   ```bash
   wrangler deploy
   ```

## ⚙️ Configuration

Edit `src/config.js` to customize Mio's behavior.

```javascript
export default {
  apiKey: "sk-mio-is-watching-you",
  errorRate: 0.2, // 20% chance to fail
  
  // Define funny error messages
  errorMessages: [
    "Mio is eating pudding, come back later.",
    "The server was isekai'd to another world."
  ],

  // Define Models
  models: {
    "mio-flash-v1": {
      type: "chat",
      description: "Fast but dumb.",
      keywords: { "hello": "Hi!" },
      responses: ["Meow?", "42."]
    }
  }
};
```

## 🔌 API Usage

**Base URL**: `https://[your-worker-domain]/v1`
**API Key**: See `src/config.js` (Default: `sk-mio-is-watching-you-super-secret-key`)

### 1. Chat Completion
**Note:** You MUST use a model defined in `config.js` (e.g., `mio-flash-v1`). Using `gpt-3.5-turbo` will result in a 404 error.

```bash
curl https://[your-domain]/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-mio..." \
  -d '{
    "model": "mio-otaku-xl",
    "messages": [{"role": "user", "content": "Do you like Anime?"}]
  }'
```

### 2. Image Generation (Fake DALL-E)
Returns a random image URL from your config.

```bash
curl https://[your-domain]/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{ "model": "mio-paint-v1", "prompt": "A cat" }'
```

## ⚠️ Disclaimer

This project is for educational and entertainment purposes only. It does not provide actual AI capabilities. Do not use it in production environments where reliability is required (unless you want to annoy your users).
