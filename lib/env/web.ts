import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

console.log(`Base ${baseUrl}`)

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: baseUrl,
  },
});