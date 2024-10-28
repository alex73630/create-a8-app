import { integer, pgTable, timestamp } from "drizzle-orm/pg-core"

export const exampleTable = pgTable("example", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
})
