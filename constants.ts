import { Task, TaskCategory } from './types';

export const MAX_LEVEL = 100;
export const STORAGE_KEY = 'do_or_do_save_v1';

// A pool of gentle narratives to cycle through
const NARRATIVES = [
  "The mist clears slightly, revealing a path.",
  "The wind whispers of old stories.",
  "You are standing at the edge of something new.",
  "A quiet moment in a loud world.",
  "The sun warms the stone beneath your feet.",
  "There is no rush here, only presence.",
  "Reflect on where you have come from.",
  "The horizon is vast and welcoming.",
  "Small steps carve deep canyons.",
  "You breathe in the possibility of change."
];

// A pool of tasks mapped to categories
const TASK_POOL: { cat: TaskCategory; text: string }[] = [
  { cat: TaskCategory.READING, text: "Read 3 pages of any book nearby." },
  { cat: TaskCategory.WRITING, text: "Write one honest sentence about today." },
  { cat: TaskCategory.MOVEMENT, text: "Stretch your arms up to the sky for 10 seconds." },
  { cat: TaskCategory.CREATIVITY, text: "Draw a shape that represents how you feel." },
  { cat: TaskCategory.MUSIC, text: "Listen to one song with your eyes closed." },
  { cat: TaskCategory.REFLECTION, text: "Sit quietly for 2 minutes. Do nothing." },
  { cat: TaskCategory.KINDNESS, text: "Send a kind text message to someone." },
  { cat: TaskCategory.LEARNING, text: "Learn one new word or fact today." },
  { cat: TaskCategory.AWARENESS, text: "Notice 3 blue things in your surroundings." },
  { cat: TaskCategory.MOVEMENT, text: "Take a short walk, even just around the room." },
  { cat: TaskCategory.WRITING, text: "List three things you are grateful for." },
  { cat: TaskCategory.REFLECTION, text: "Forgive yourself for one small thing." },
  { cat: TaskCategory.CREATIVITY, text: "Rearrange a small part of your desk or room." },
  { cat: TaskCategory.AWARENESS, text: "Drink a glass of water slowly." },
  { cat: TaskCategory.KINDNESS, text: "Smile at yourself in the mirror." }
];

// Deterministically generate tasks for levels 1-100
export const getTaskForLevel = (level: number): Task => {
  // Use level to pick from pools to ensure consistency across reloads
  const narrativeIndex = (level - 1) % NARRATIVES.length;
  const taskIndex = (level - 1) % TASK_POOL.length;
  
  const poolItem = TASK_POOL[taskIndex];

  return {
    id: level,
    category: poolItem.cat,
    narrative: NARRATIVES[narrativeIndex],
    instruction: poolItem.text
  };
};

export const KINGS_PATH_CHALLENGES = [
  "Reflect: What does wealth mean beyond money?",
  "Action: Help someone without them knowing.",
  "Create: Write a letter to your past self.",
  "Learn: Read about a culture different from yours."
];