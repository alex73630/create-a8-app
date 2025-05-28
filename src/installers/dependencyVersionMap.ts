/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
	// Prisma
	prisma: "^6.8.2",
	"@prisma/client": "^6.8.2",

	// Drizzle
	"drizzle-kit": "^0.31.1",
	"drizzle-orm": "^0.44.0",
	pg: "^8.16.0",
	"@types/pg": "^8.15.2",
	"@libsql/client": "^0.15.7"
} as const
export type AvailableDependencies = keyof typeof dependencyVersionMap
