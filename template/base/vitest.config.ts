import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"
export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "node",
		coverage: {
			reporter: ["text", "json", "html"] // Optional: Add coverage reports
		}
	}
})
