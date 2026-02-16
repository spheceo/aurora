import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SHOPIFY_TOKEN: z.string().min(1),
    SHOPIFY_DOMAIN: z.string().min(1),
    SHOPIFY_CHECKOUT_DOMAIN: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1),
    ADMIN_NOTIFICATION_EMAIL: z.string().email(),
    EMAIL_SENDER_DOMAIN: z.string().min(1).optional(),
    APP_URL: z.string().url().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
