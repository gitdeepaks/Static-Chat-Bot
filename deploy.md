# Deployment Guide - Vercel

This guide will help you deploy your AI Chat Application to Vercel with all the necessary configurations.

## Prerequisites

Before deploying, ensure you have:

1. **API Keys**:

   - [Groq API Key](https://console.groq.com) - For LLM interactions
   - [Tavily API Key](https://tavily.com) - For web search functionality

2. **GitHub Repository**: Your code should be pushed to a GitHub repository

3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your project structure includes:

```
invoke-llm/
├── server.js          # Main server file
├── chatBot.js         # AI chat logic
├── frontend/          # Frontend files
│   ├── index.html
│   └── script.js
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
└── env.example        # Environment template
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**:

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:

   - Framework Preset: `Other`
   - Root Directory: `./` (default)
   - Build Command: Leave empty (Vercel will auto-detect)
   - Output Directory: Leave empty
   - Install Command: Leave empty

3. **Set Environment Variables**:

   - In the Environment Variables section, add:
     ```
     GROQ_API_KEY = your_groq_api_key_here
     TAVILY_API_KEY = your_tavily_api_key_here
     NODE_ENV = production
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Set Environment Variables**:

   ```bash
   vercel env add GROQ_API_KEY
   vercel env add TAVILY_API_KEY
   vercel env add NODE_ENV
   ```

5. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

### 3. Configure Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click on "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

## Configuration Details

### Vercel Configuration (`vercel.json`)

The `vercel.json` file configures:

- **Runtime**: Node.js for server-side functionality
- **Routes**: All requests routed to `server.js`
- **Functions**: 30-second timeout for API calls
- **Environment**: Production mode

### Environment Variables

| Variable         | Description                       | Required |
| ---------------- | --------------------------------- | -------- |
| `GROQ_API_KEY`   | API key for Groq LLM service      | Yes      |
| `TAVILY_API_KEY` | API key for Tavily search service | Yes      |
| `NODE_ENV`       | Environment mode                  | Yes      |
| `PORT`           | Server port (auto-set by Vercel)  | No       |

### API Endpoints

Once deployed, your application will have:

- **Main App**: `https://your-app.vercel.app/`
- **Chat API**: `https://your-app.vercel.app/chat`
- **Health Check**: `https://your-app.vercel.app/` (returns "Hello, Welcome to Chat AI")

## Testing Your Deployment

1. **Visit Your App**: Open `https://your-app.vercel.app/`
2. **Test Chat**: Send a message and verify AI responses
3. **Test Web Search**: Ask questions requiring real-time data
4. **Check Logs**: Monitor function logs in Vercel dashboard

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**:

   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Build Failures**:

   - Check `package.json` has all dependencies
   - Verify Node.js version compatibility
   - Review build logs in Vercel dashboard

3. **API Timeouts**:

   - Increase timeout in `vercel.json` if needed
   - Optimize API calls in your code
   - Check Groq/Tavily API limits

4. **CORS Issues**:
   - CORS is already configured in `server.js`
   - If issues persist, check Vercel's CORS documentation

### Performance Optimization

1. **Function Optimization**:

   - Use caching for repeated queries
   - Implement request batching
   - Monitor function execution time

2. **Frontend Optimization**:
   - Minimize JavaScript bundle size
   - Use CDN for static assets
   - Implement proper error handling

## Monitoring and Analytics

Vercel provides built-in monitoring:

1. **Function Logs**: Monitor API performance
2. **Analytics**: Track usage and performance
3. **Error Tracking**: Identify and fix issues
4. **Performance Metrics**: Monitor response times

## Scaling Considerations

- **Function Limits**: Vercel Pro plan for higher limits
- **API Rate Limits**: Monitor Groq and Tavily usage
- **Caching**: Implement Redis for production caching
- **Database**: Add database for conversation persistence

## Security Best Practices

1. **Environment Variables**: Never commit API keys to repository
2. **API Validation**: Validate all inputs on server side
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **HTTPS**: Vercel provides SSL certificates automatically

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Groq API Documentation](https://console.groq.com/docs)
- [Tavily API Documentation](https://tavily.com/docs)

## Alternative Deployment Options

If Vercel doesn't meet your needs, consider:

1. **Railway**: Easy Bun runtime support
2. **Render**: Simple deployment with good Node.js support
3. **Heroku**: Traditional PaaS with add-on ecosystem
4. **DigitalOcean App Platform**: Cost-effective scaling
5. **AWS Lambda**: Serverless with extensive integrations

---

**Need Help?** Check the troubleshooting section or create an issue in your repository.
