import "~/env"
import { prisma } from "~/db"

function main() {
	console.log("Hello World!")

	const example = await prisma.example.findMany()
	console.log(example)
}

main()
