import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: "openaiApiKey",
    type: "string",
    default: "",
    title: "OpenAI API Key",
    description: "Enter your OpenAI API key",
  },
  {
    key: "claudeApiKey",
    type: "string",
    default: "",
    title: "Claude API Key",
    description: "Enter your Claude API key",
  },
  {
    key: "systemPrompt",
    type: "string",
    default: "你是一个有帮助的 Logseq 助手。",
    title: "System Prompt",
    description: "Customize the system prompt.",
  },
  {
    key: "maxTokens",
    type: "number",
    default: 2000,
    title: "Max Tokens",
    description: "Set the maximum number of tokens for the AI response.",
  },
  {
    key: "temperature",
    type: "number",
    default: 0.5,
    title: "Temperature",
    description: "Set the temperature for the AI response (0.0 to 1.0).",
  },
  {
    key: "LLMModel",
    type: "enum",
    enumChoices: ["gpt-4o-mini", "gpt-4-1106-preview", "gpt-4-0125-preview", "claude-3-5-sonnet-20240620" ],
    default: "gpt-4o-mini",
    title: "LLM Model",
    description: "Select the LLM model to use",
  },
];

// 这些函数用于从 Logseq 设置中获取值
export function getOpenAIApiKey(): string {
  return logseq.settings!.openaiApiKey as string;
}

export function getClaudeApiKey(): string {
  return logseq.settings!.claudeApiKey as string;
}

export function getSystemPrompt(): string {
  return logseq.settings!.systemPrompt as string;
}

export function getMaxTokens(): number {
  return Number(logseq.settings!.maxTokens);
}

export function getTemperature(): number {
  return parseFloat(logseq.settings!.temperature as string);
}

export function getLLMModel(): string {
  return logseq.settings!.LLMModel as string;
}
