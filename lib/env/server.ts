import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
        SHOPIFY_TOKEN: z.string().min(1),
		SHOPIFY_DOMAIN: z.url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});