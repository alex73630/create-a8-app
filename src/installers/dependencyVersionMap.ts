/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
	// Drizzle
	"drizzle-kit": "^0.31.7",
	"drizzle-orm": "^0.44.7",
	pg: "^8.16.3",
	"@types/pg": "^8.15.6",
	"@libsql/client": "^0.15.15"
} as const
export type AvailableDependencies = keyof typeof dependencyVersionMap
