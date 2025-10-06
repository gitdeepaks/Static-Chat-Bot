const input = document.querySelector('#input');

const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask');
const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

const loading = document.createElement('div');

loading.className = 'my-6 bg-indigo-500 animate-pulse p-3 rounded-xl';
loading.textContent = 'Thinking...';

// console.log(input);

input?.addEventListener('keyup', handleEnter);
askBtn.addEventListener('click', handleAsk);

async function handleAsk(e) {
  const text = input.value.trim();

  if (!text) return;

  await generate(text);
}

async function generate(text) {
  /**
   *
   * 1. append message to UI
   *
   * 2. Send It to LLM
   *
   * 3. Append Message to UI
   */

  const message = document.createElement('div');

  message.className = `my-6 bg-neutral-700 p-3 rounded-xl ml-auto max-w-fit`;

  message.textContent = text;

  chatContainer.appendChild(message);
  input.value = '';

  chatContainer.appendChild(loading);

  // Call server
  // console.log('Calling server with message:', text);

  try {
    const assistantResponse = await callServer(text);
    // console.log('Server response:', assistantResponse);
    console.log(assistantResponse, 'Assistant');

    // Create assistant message element
    const assistantMessage = document.createElement('div');
    assistantMessage.className = `max-w-fit rounded-xl bg-indigo-500 p-3`;
    assistantMessage.textContent = assistantResponse;
    loading.remove();

    chatContainer.appendChild(assistantMessage);
  } catch (error) {
    console.error('Error calling server:', error);
  }
}

async function callServer(inputText) {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ threadId: threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error('Error in generating response from LLM');
  }

  const result = await response.json();

  return result.message;
}

async function handleEnter(e) {
  if (e.key === 'Enter') {
    const text = input.value.trim();

    if (!text) return;
    await generate(text);
    // console.log(text);
  }
}
