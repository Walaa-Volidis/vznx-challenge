import { z } from 'zod';

export const ZServerSettings = z.object({
  port: z.string().transform(Number).pipe(z.number().min(1).max(65535)),
  databaseUrl: z.string(),
  nodeEnv: z.enum(['development', 'production']),
  corsOrigin: z.string(),
});

export const SERVER_SETTINGS = ZServerSettings.parse({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN,
});
