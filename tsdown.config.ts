import { defineConfig } from "tsdown"

const isDev = process.env.npm_lifecycle_event === "dev"

export default defineConfig({
	clean: true,
	dts: true,
	entry: ["src/index.ts"],
	format: ["esm"],
	minify: !isDev,
	sourcemap: true,
	target: "esnext",
	outDir: "dist",
	onSuccess: isDev ? "node dist/index.js" : undefined
})
