import path from "path"

import fs from "fs-extra"

import { PKG_ROOT } from "~/consts.js"
import { type PkgInstallerMap } from "~/installers/index.js"
import { type PackageManager } from "~/utils/getUserPkgManager.js"

import { handlebarsParser } from "./handlebarsParser.js"

interface CreateAgentsFileOptions {
	projectDir: string
	pkgManager: PackageManager
	packages: PkgInstallerMap
	projectName: string
}

export const createAgentsFile = ({ projectDir, pkgManager, packages, projectName }: CreateAgentsFileOptions) => {
	const agentsFileSrc = path.join(PKG_ROOT, "template/AGENTS.md.hbs")
	const agentsFileDest = path.join(projectDir, "AGENTS.md")

	const agentsFileTemplate = fs.readFileSync(agentsFileSrc, "utf-8")

	const hasDrizzle = packages.drizzle.inUse
	const hasDocker = packages.docker.inUse

	const agentsFileContent = handlebarsParser(agentsFileTemplate, pkgManager, {
		projectName,
		hasDrizzle,
		hasDocker
	})

	fs.writeFileSync(agentsFileDest, agentsFileContent, "utf-8")
}
