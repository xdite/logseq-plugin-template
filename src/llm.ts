import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { getOpenAIApiKey, getMaxTokens, getTemperature, getLLMModel, getClaudeApiKey } from './settings';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function* streamOpenAICompletion(messages: ChatMessage[], customSystemPrompt: string): AsyncGenerator<string, void, unknown> {
  const openai = new OpenAI({
    apiKey: getOpenAIApiKey(),
    dangerouslyAllowBrowser: true
  });

  const systemMessage: ChatMessage = { role: 'system', content: customSystemPrompt };
  const fullMessages = [systemMessage, ...messages];

  try {
    const stream = await openai.chat.completions.create({
      model: getLLMModel(),
      messages: fullMessages,
      stream: true,
      max_tokens: getMaxTokens(),
      temperature: getTemperature(),
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
  }
}

async function* streamClaudeCompletion(messages: ChatMessage[], customSystemPrompt: string): AsyncGenerator<string, void, unknown> {
  const apiKey = getClaudeApiKey();
  const currentModel = getLLMModel();
  
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const stream = await anthropic.messages.stream({
      model: currentModel,
      max_tokens: getMaxTokens(),
      temperature: getTemperature(),
      system: customSystemPrompt,
      messages: messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.text) {
        yield chunk.delta.text;
      }
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to get response from Claude');
  }
}

export async function* streamChatCompletion(messages: ChatMessage[], customSystemPrompt: string): AsyncGenerator<string, void, unknown> {
  const model = getLLMModel();
  
  if (model.startsWith('gpt')) {
    yield* streamOpenAICompletion(messages, customSystemPrompt);
  } else if (model.startsWith('claude')) {
    yield* streamClaudeCompletion(messages, customSystemPrompt);
  } else {
    throw new Error('Unsupported model');
  }
}
