import { type PackageJson } from "type-fest"
import { type Installer } from "~/installers/index.js"
import path from "path"
import fs from "fs-extra"
import { PKG_ROOT } from "~/consts.js"
import { addPackageDependency } from "~/utils/addPackageDependency.js"
import { type AvailableDependencies } from "~/installers/dependencyVersionMap"

export const drizzleInstaller: Installer = ({ projectDir, packages }) => {
	addPackageDependency({
		projectDir,
		dependencies: ["drizzle-kit", ...((packages?.docker.inUse ? ["@types/pg"] : []) as AvailableDependencies[])],
		devMode: true
	})
	addPackageDependency({
		projectDir,
		dependencies: [
			"drizzle-orm",
			...((packages?.docker.inUse ? ["pg"] : ["@libsql/client"]) as AvailableDependencies[])
		],
		devMode: false
	})

	const extrasDir = path.join(PKG_ROOT, "template/extras")

	const configSrc = path.join(
		extrasDir,
		"drizzle/config",
		packages?.docker.inUse ? "with-docker.config.ts" : "base.config.ts"
	)
	const configDest = path.join(projectDir, "drizzle.config.ts")

	const schemaSrc = path.join(
		extrasDir,
		"src/db/drizzle/schema",
		packages?.docker.inUse ? "with-docker.ts" : "base.ts"
	)
	const schemaDest = path.join(projectDir, "src/db/schema.ts")

	const clientSrc = path.join(
		extrasDir,
		"src/db/drizzle/client",
		packages?.docker.inUse ? "with-docker.ts" : "base.ts"
	)
	const clientDest = path.join(projectDir, "src/db/index.ts")

	const mainSrc = path.join(extrasDir, "src/main/with-drizzle.ts")
	const mainDest = path.join(projectDir, "src/main.ts")

	// add scripts to package.json
	const packageJsonPath = path.join(projectDir, "package.json")
	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson
	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		"db:push": "drizzle-kit push",
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:check": "drizzle-kit check",
		"db:studio": "drizzle-kit studio"
	}

	fs.copySync(configSrc, configDest)
	fs.copySync(schemaSrc, schemaDest)
	fs.copySync(clientSrc, clientDest)
	fs.copySync(mainSrc, mainDest)
	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2
	})
}
