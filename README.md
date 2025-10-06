# AI Chat Application

An intelligent chat application powered by Groq's LLM with web search capabilities using Tavily API.

## Features

- 🤖 AI-powered conversations using Groq's Llama 3.3 70B model
- 🔍 Real-time web search integration via Tavily API
- 💬 Modern chat interface with Tailwind CSS
- 🧵 Conversation threading and caching
- 🛠️ Tool calling capabilities for enhanced functionality

## Quick Start

### Prerequisites

- [Bun runtime](https://bun.com) (v1.2.22+)
- API keys for [Groq](https://console.groq.com) and [Tavily](https://tavily.com)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd invoke-llm

# Install dependencies
bun install
```

### Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
# GROQ_API_KEY=your_groq_api_key_here
# TAVILY_API_KEY=your_tavily_api_key_here
```

### Running Locally

```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run server.js
```

Visit `http://localhost:8888` to access the chat interface.

## Deployment

### Vercel (Recommended)

For detailed Vercel deployment instructions, see [deploy.md](./deploy.md).

Quick steps:

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Set environment variables:
   - `GROQ_API_KEY`
   - `TAVILY_API_KEY`
   - `NODE_ENV=production`
4. Deploy!

### Other Platforms

- **Railway**: Supports Bun runtime natively
- **Render**: Simple Node.js deployment
- **Heroku**: Traditional PaaS option

## Project Structure

```
invoke-llm/
├── server.js          # Express server and API endpoints
├── chatBot.js         # Core AI chat logic with tool calling
├── app.js             # Standalone Groq API example
├── toolCalling.js     # CLI version of chat bot
├── frontend/          # Web interface
│   ├── index.html     # Chat UI
│   └── script.js      # Frontend JavaScript
├── vercel.json        # Vercel deployment config
├── package.json       # Dependencies and scripts
└── deploy.md          # Detailed deployment guide
```

## API Endpoints

- `GET /` - Serves the chat interface
- `POST /chat` - Chat API endpoint
  - Body: `{ "message": "your message", "threadId": "unique-id" }`
  - Response: `{ "message": "AI response" }`

## Environment Variables

| Variable         | Description                   | Required |
| ---------------- | ----------------------------- | -------- |
| `GROQ_API_KEY`   | Groq API key for LLM access   | Yes      |
| `TAVILY_API_KEY` | Tavily API key for web search | Yes      |
| `PORT`           | Server port (default: 8888)   | No       |
| `NODE_ENV`       | Environment mode              | No       |

## Technologies Used

- **Runtime**: [Bun](https://bun.com) - Fast JavaScript runtime
- **Backend**: Express.js with CORS
- **AI**: Groq SDK (Llama 3.3 70B model)
- **Search**: Tavily API for real-time web search
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Caching**: Node-cache for conversation persistence

## Development

This project was created using `bun init` and leverages Bun's fast runtime for optimal performance.

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run server.js` - Start production server

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For deployment issues, check [deploy.md](./deploy.md) or create an issue in the repository.
