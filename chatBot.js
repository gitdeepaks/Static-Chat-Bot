import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import NodeCache from 'node-cache';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const myCache = new NodeCache({
  stdTTL: 60 * 60 * 24, // 24 hours
});

export async function generate(userMessage, threadId) {
  const baseMessages = [
    {
      role: 'system',
      content: `You are a smart personal assistant who answers questions using available tools when needed.`,
    },
    {
      role: 'user',
      content: `What is the current weather in New York?`,
    },
    {
      role: 'assistant',
      content: `I'll search for the current weather in New York.`,
      tool_calls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'webSearch',
            arguments: JSON.stringify({ query: 'current weather New York' }),
          },
        },
      ],
    },
    {
      role: 'tool',
      tool_call_id: 'call_1',
      name: 'webSearch',
      content:
        'Current weather in New York: 72°F (22°C), partly cloudy with light winds.',
    },
    {
      role: 'assistant',
      content: `The current weather in New York is 72°F (22°C) with partly cloudy conditions and light winds.`,
    },
    {
      role: 'user',
      content: `What's the latest news about AI?`,
    },
    {
      role: 'assistant',
      content: `I'll search for the latest AI news.`,
      tool_calls: [
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'webSearch',
            arguments: JSON.stringify({ query: 'latest AI news 2024' }),
          },
        },
      ],
    },
    {
      role: 'tool',
      tool_call_id: 'call_2',
      name: 'webSearch',
      content:
        'Latest AI news: Major tech companies announce new AI models, breakthrough in natural language processing, and AI regulation updates.',
    },
    {
      role: 'assistant',
      content: `Here's the latest AI news: Major tech companies have announced new AI models, there have been breakthroughs in natural language processing, and there are updates on AI regulation policies.`,
    },
  ];

  const mymessages = myCache.get(threadId) ?? baseMessages;

  mymessages.push({
    role: 'user',
    content: userMessage,
  });

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > MAX_RETRIES) {
      return 'Max Count get exhausted, please try after some time or start the new session';
    }
    count++;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,

      messages: mymessages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'webSearch',
            description:
              'Search the latest information and real time data on internet.',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city and state, e.g. San Francisco, CA',
                },
                query: {
                  type: 'string',
                  description: 'The search query to perform search on.',
                },
              },
              required: ['query'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    });

    const toolCalls = response.choices[0].message.tool_calls;

    // Add the assistant's message to the conversation
    const assistantMessage = response.choices[0].message;
    // Ensure content is present (can be null for tool calls)
    if (assistantMessage.content === undefined) {
      assistantMessage.content = null;
    }
    mymessages.push(assistantMessage);

    if (!toolCalls) {
      myCache.set(threadId, mymessages);

      console.log(myCache);

      return response.choices[0].message.content;
    }

    for (const tool of toolCalls) {
      // console.log(tool, 'Tool');
      const toolName = tool.function.name;
      const funcParams = tool.function.arguments;

      if (toolName === 'webSearch') {
        const toolRes = await webSearch(JSON.parse(funcParams));
        // console.log(toolRes);

        mymessages.push({
          tool_call_id: tool.id,
          role: 'tool',
          name: toolName,
          content: toolRes,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  //Here we will do Tavily API call

  console.log('calling web search');

  const response = await tvly.search(query);
  // console.log(response, 'Response');

  const finalRes = response.results.map((res) => res.content).join('/n/n');

  return finalRes;
}
