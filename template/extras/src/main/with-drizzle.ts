import "~/env"
import { db } from "~/db"

async function main() {
	console.log("Hello World!")

	const example = await db.query.exampleTable.findMany()
	console.log(example)
}

void main()
