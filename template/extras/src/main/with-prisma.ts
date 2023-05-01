import "~/env"
import { prisma } from "~/db"

function main() {
	console.log("Hello World!")

	prisma.example.findMany().then(console.log)
}

main()
