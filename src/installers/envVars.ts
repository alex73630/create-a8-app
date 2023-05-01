import { type Installer } from "~/installers/index.js"
import path from "path"
import fs from "fs-extra"
import { PKG_ROOT } from "~/consts.js"

export const envVariablesInstaller: Installer = ({ projectDir, packages }) => {
	const usingDocker = packages?.docker.inUse
	const usingPrisma = packages?.prisma.inUse

	const envContent = getEnvContent(!!usingDocker, !!usingPrisma)

	const envFile = usingPrisma ? "with-prisma.ts" : ""

	if (envFile !== "") {
		const envSchemaSrc = path.join(PKG_ROOT, "template/extras/src/env", envFile)
		const envSchemaDest = path.join(projectDir, "src/env.ts")
		fs.copySync(envSchemaSrc, envSchemaDest)
	}

	const envDest = path.join(projectDir, ".env")
	const envExampleDest = path.join(projectDir, ".env.example")

	fs.writeFileSync(envDest, envContent, "utf-8")
	fs.writeFileSync(envExampleDest, exampleEnvContent + envContent, "utf-8")
}

const getEnvContent = (usingDocker: boolean, usingPrisma: boolean) => {
	let content = `
# When adding additional environment variables, the schema in "/src/env.ts"
# should be updated accordingly.

# Node Environment
NODE_ENV="development"
`
		.trim()
		.concat("\n")

	if (usingPrisma)
		if (usingDocker)
			content += `
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
`
		else
			content += `
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
DATABASE_URL="file:./db.sqlite"
`

	if (!usingDocker && !usingPrisma)
		content += `
# Example:
# SERVERVAR="foo"
# PUBLIC_CLIENTVAR="bar"
`

	return content
}

const exampleEnvContent = `
# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
`
	.trim()
	.concat("\n\n")
