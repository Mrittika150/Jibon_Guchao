// Gentle questions for days when you don't know what to write
export const PROMPTS = [
  "What made you smile today?",
  "What is one small win from today?",
  "What are you grateful for right now?",
  "What took your energy today, and what gave it back?",
  "What do you want to remember about today?",
  "Who was kind to you today?",
  "What would you tell yourself this morning?",
  "What are you looking forward to tomorrow?",
  "What did your body need today?",
  "What is one thing you learned today?",
];

// A random prompt that is different from the one showing now
export function nextPrompt(current: string | null): string {
  const choices = PROMPTS.filter((prompt) => prompt !== current);
  return choices[Math.floor(Math.random() * choices.length)];
}
