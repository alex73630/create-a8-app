import "~/env"
import { db } from "~/db"

export async function main() {
	console.log("Hello World!")

	const example = await db.query.exampleTable.findMany()
	console.log(example)
}

void main()
