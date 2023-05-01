import { createEnv } from "@t3-oss/env-core"
import z from "zod"
import dotenv from "dotenv"

dotenv.config()

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	server: {
		NODE_ENV: z.enum(["development", "test", "production"])
	},
	client: {},
	runtimeEnv: process.env
})
