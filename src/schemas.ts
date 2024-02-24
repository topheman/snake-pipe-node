// Generated by ts-to-zod
import { z } from "zod";

export const sizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const gameSchema = z.object({
  snake: z.object({
    direction: z.string(),
    head: z.object({
      x: z.number(),
      y: z.number(),
    }),
    tail: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
      }),
    ),
  }),
  fruit: z.object({
    x: z.number(),
    y: z.number(),
  }),
  score: z.number(),
  state: z.string(),
});

export const initOptionsSchema = z.object({
  frameDuration: z.number(),
  size: z.object({
    width: z.number(),
    height: z.number(),
  }),
  featuresWithVersion: z.record(z.string()),
  metadatas: z.record(z.string()).optional(),
});