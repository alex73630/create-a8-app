import { createEnv } from "@t3-oss/env-core"
import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true })

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	server: {
		DATABASE_URL: z.url(),
		NODE_ENV: z.enum(["development", "test", "production"])
	},
	client: {},
	runtimeEnv: process.env
})
