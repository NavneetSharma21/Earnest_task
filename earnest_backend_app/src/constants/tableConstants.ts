export const tableConstants = {
  USER: "user",
  TASK: "task",
} as const;

export type ModelName = (typeof tableConstants)[keyof typeof tableConstants];