import { OpenAI } from 'openai';

export function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
  });
}

export const getModel = () => process.env.OPENAI_API_MODEL || 'deepseek-chat';

export async function askLLM<T>(prompt: string): Promise<T> {
  const openai = getOpenAIClient();
  const model = getModel();

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: model,
    temperature: 0.1, // Set temperature close to 0 for maximum determinism
    response_format: { type: 'json_object' },
  });

  const resultText = completion.choices[0]?.message?.content;
  if (!resultText) throw new Error('No response from LLM');

  // Clean up potential markdown wrappers
  const cleanedText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  return JSON.parse(cleanedText) as T;
}