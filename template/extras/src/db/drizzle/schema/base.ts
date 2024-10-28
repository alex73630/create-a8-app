import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const exampleTable = sqliteTable("example", {
	id: integer().primaryKey({ autoIncrement: true }),
	createdAt: text("timestamp")
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text("timestamp")
		.notNull()
		.default(sql`(current_timestamp)`)
		.$onUpdate(() => sql`(current_timestamp)`)
})
