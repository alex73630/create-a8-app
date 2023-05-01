import { defineConfig } from "tsup"

const isDev = process.env.npm_lifecycle_event === "start:dev"

export default defineConfig({
	clean: true,
	dts: true,
	entry: ["src/main.ts"],
	format: ["esm"],
	minify: !isDev,
	metafile: !isDev,
	sourcemap: true,
	target: "esnext",
	outDir: "dist",
	onSuccess: isDev ? "node dist/main.js" : undefined
})
