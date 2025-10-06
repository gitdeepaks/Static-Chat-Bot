import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import readline from 'readline';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const mymessages = [
    {
      role: 'system',
      content: `You are a smart personal assistant who answers the asked question.
        You have access to following tools:
        1. Search Web({query}): {qury:string} //Search the latest information and realtime data on the internet.
        `,
    },
    // {
    //   role: 'user',
    //   content: `What is the current weather in Jaipur, please return in degree Celsius ?`,
    // },
  ];
  while (true) {
    const question = await new Promise((resolve) => {
      rl.question('You: ', resolve);
    });

    //bye

    if (question === 'bye') {
      console.log('Goodbye!');
      break;
    }

    // Skip empty questions
    if (!question || question.trim() === '') {
      console.log('Please enter a valid question.');
      continue;
    }

    mymessages.push({
      role: 'user',
      content: question.trim(),
    });
    while (true) {
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
        console.log(`Assistant: ${response.choices[0].message.content}`);
        break;
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
}

main().catch(console.error);

async function webSearch({ query }) {
  //Here we will do Tavily API call

  console.log('calling web search');

  const response = await tvly.search(query);
  console.log(response, 'Response');

  const finalRes = response.results.map((res) => res.content).join('/n/n');

  return finalRes;
}
