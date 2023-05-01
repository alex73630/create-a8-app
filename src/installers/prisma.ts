import { type PackageJson } from "type-fest"
import { type Installer } from "~/installers/index.js"
import path from "path"
import fs from "fs-extra"
import { PKG_ROOT } from "~/consts.js"
import { addPackageDependency } from "~/utils/addPackageDependency.js"

export const prismaInstaller: Installer = ({ projectDir, packages }) => {
	addPackageDependency({
		projectDir,
		dependencies: ["prisma"],
		devMode: true
	})
	addPackageDependency({
		projectDir,
		dependencies: ["@prisma/client"],
		devMode: false
	})

	const extrasDir = path.join(PKG_ROOT, "template/extras")

	const schemaSrc = path.join(
		extrasDir,
		"prisma/schema",
		packages?.docker.inUse ? "with-docker.prisma" : "base.prisma"
	)
	const schemaDest = path.join(projectDir, "prisma/schema.prisma")

	const clientSrc = path.join(extrasDir, "src/db.ts")
	const clientDest = path.join(projectDir, "src/db.ts")

	const mainSrc = path.join(extrasDir, "src/main/with-prisma.ts")
	const mainDest = path.join(projectDir, "src/main.ts")

	// add postinstall script to package.json
	const packageJsonPath = path.join(projectDir, "package.json")

	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson
	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		postinstall: "prisma generate"
	}

	fs.copySync(schemaSrc, schemaDest)
	fs.copySync(clientSrc, clientDest)
	fs.copySync(mainSrc, mainDest)
	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2
	})
}
