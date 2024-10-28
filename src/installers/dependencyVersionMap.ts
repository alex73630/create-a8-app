/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
	// Prisma
	prisma: "^5.21.1",
	"@prisma/client": "^5.21.1",

	// Drizzle
	"drizzle-kit": "^0.26.2",
	"drizzle-orm": "^0.35.3",
	pg: "^8.13.1",
	"@types/pg": "^8.11.10",
	"@libsql/client": "^0.14.0"
} as const
export type AvailableDependencies = keyof typeof dependencyVersionMap
