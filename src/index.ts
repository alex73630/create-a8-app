#!/usr/bin/env node

import path from "path"

import fs from "fs-extra"
import { type PackageJson } from "type-fest"

import { runCli } from "~/cli/index.js"
import { createProject } from "~/helpers/createProject.js"
import { initializeGit } from "~/helpers/git.js"
import { logNextSteps } from "~/helpers/logNextSteps.js"
import { setImportAlias } from "~/helpers/setImportAlias.js"
import { buildPkgInstallerMap } from "~/installers/index.js"
import { logger } from "~/utils/logger.js"
import { parseNameAndPath } from "~/utils/parseNameAndPath.js"
import { renderTitle } from "~/utils/renderTitle.js"

import { installDependencies } from "./helpers/installDependencies.js"
import { getVersion } from "./utils/getA8Version.js"
import { getNpmVersion, renderVersionWarning } from "./utils/renderVersionWarning.js"

type CA8APackageJSON = PackageJson & {
	ca8aMetadata?: {
		initVersion: string
	}
}

const main = async () => {
	const npmVersion = await getNpmVersion()
	renderTitle()
	if (npmVersion) {
		renderVersionWarning(npmVersion)
	}

	const {
		appName,
		packages,
		flags: { noGit, noInstall, importAlias }
	} = await runCli()

	const usePackages = buildPkgInstallerMap(packages)

	// e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
	const [scopedAppName, appDir] = parseNameAndPath(appName)

	const projectDir = await createProject({
		projectName: appDir,
		packages: usePackages,
		importAlias: importAlias,
		noInstall
	})

	// Write name to package.json
	const pkgJson = fs.readJSONSync(path.join(projectDir, "package.json")) as CA8APackageJSON
	pkgJson.name = scopedAppName
	pkgJson.ca8aMetadata = { initVersion: getVersion() }
	fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
		spaces: 2
	})

	// update import alias in any generated files if not using the default
	if (importAlias !== "~/") {
		setImportAlias(projectDir, importAlias)
	}

	if (!noInstall) {
		await installDependencies({ projectDir })
	}

	// Rename _eslintrc.json to .eslintrc.json - we use _eslintrc.json to avoid conflicts with the monorepos linter
	fs.renameSync(path.join(projectDir, "_eslint.config.mjs"), path.join(projectDir, "eslint.config.mjs"))

	if (!noGit) {
		await initializeGit(projectDir)
	}

	logNextSteps({ projectName: appDir, packages: usePackages, noInstall })

	process.exit(0)
}

main().catch((err) => {
	logger.error("Aborting installation...")
	if (err instanceof Error) {
		logger.error(err)
	} else {
		logger.error("An unknown error has occurred. Please open an issue on github with the below:")
		console.log(err)
	}
	process.exit(1)
})
