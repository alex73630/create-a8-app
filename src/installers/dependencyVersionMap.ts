/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
	// Prisma
	prisma: "^4.13.0",
	"@prisma/client": "^4.13.0"
} as const
export type AvailableDependencies = keyof typeof dependencyVersionMap
