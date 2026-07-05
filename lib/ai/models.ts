export const models = [
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT OSS 20B",
    provider: "OpenAI",
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen3 Coder",
    provider: "Qwen",
  },
  {
    id: "cohere/north-mini-code:free",
    name: "North Mini Code",
    provider: "Cohere",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "Nemotron 3 Ultra",
    provider: "NVIDIA",
  },
] as const;

export type ModelId = (typeof models)[number]["id"];
export const DEFAULT_MODEL_ID = models[0].id;

export function getModelById(id: string) {
  return models.find((m) => m.id === id) ?? models[0];
}
