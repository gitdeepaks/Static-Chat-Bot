import express from 'express';
import { generate } from './chatBot';
import cors from 'cors';

const app = express();
app.use(express.json());

const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'frontend' });
});

app.post('/chat', async (req, res) => {
  const { message, threadId } = req.body;

  //TODO: Validate

  if (!message || !threadId) {
    res.status(400).json({ message: 'All field are required' });
  }
  console.log(message);
  const response = await generate(message, threadId);

  res.json({ message: response });
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
