import chalk from "chalk"
import { Command } from "commander"
import inquirer from "inquirer"

import { CREATE_A8_APP, DEFAULT_APP_NAME } from "~/consts.js"
import { availablePackages } from "~/installers/index.js"
import { type AvailablePackages } from "~/installers/index.js"
import { getVersion } from "~/utils/getA8Version.js"
import { getUserPkgManager } from "~/utils/getUserPkgManager.js"
import { logger } from "~/utils/logger.js"
import { validateAppName } from "~/utils/validateAppName.js"
import { validateImportAlias } from "~/utils/validateImportAlias.js"

interface CliFlags {
	noGit: boolean
	noInstall: boolean
	default: boolean
	importAlias: string

	/** @internal Used in CI. */
	CI: boolean
	/** @internal Used in CI. */
	prisma: boolean
	/** @internal Used in CI. */
	drizzle: boolean
	/** @internal Used in CI. */
	docker: boolean
}

interface CliResults {
	appName: string
	orm?: AvailablePackages[]
	packages: AvailablePackages[]
	flags: CliFlags
}

const defaultOptions: CliResults = {
	appName: DEFAULT_APP_NAME,
	packages: ["drizzle", "docker"],
	flags: {
		noGit: false,
		noInstall: false,
		default: false,
		CI: false,
		prisma: false,
		drizzle: false,
		docker: false,
		importAlias: "~/"
	}
}

export const runCli = async () => {
	const cliResults = defaultOptions

	const program = new Command().name(CREATE_A8_APP)

	// TODO: This doesn't return anything typesafe. Research other options?
	// Emulate from: https://github.com/Schniz/soundtype-commander
	program
		.description("A CLI for creating web applications with the a8 stack")
		.argument("[dir]", "The name of the application, as well as the name of the directory to create")
		.option("--noGit", "Explicitly tell the CLI to not initialize a new git repo in the project", false)
		.option("--noInstall", "Explicitly tell the CLI to not run the package manager's install command", false)
		.option("-y, --default", "Bypass the CLI and use all default options to bootstrap a new a8-app", false)
		/** START CI-FLAGS */
		/**
		 * @experimental Used for CI E2E tests. If any of the following option-flags are provided, we
		 *               skip prompting.
		 */
		.option("--CI", "Boolean value if we're running in CI", false)
		/** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
		.option(
			"--prisma [boolean]",
			"Experimental: Boolean value if we should install Prisma. Must be used in conjunction with `--CI`.",
			(value) => !!value && value !== "false"
		)
		/** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
		.option(
			"--drizzle [boolean]",
			"Experimental: Boolean value if we should install Drizzle. Must be used in conjunction with `--CI`.",
			(value) => !!value && value !== "false"
		)
		/** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
		.option(
			"-i, --import-alias",
			"Explicitly tell the CLI to use a custom import alias",
			defaultOptions.flags.importAlias
		)
		/** END CI-FLAGS */
		.version(getVersion(), "-v, --version", "Display the version number")
		.addHelpText(
			"afterAll",
			`\n The a8 stack was inspired by ${chalk
				.hex("#E8DCFF")
				.bold("@a8dotgg")} and has been used to build awesome fullstack applications like ${chalk
				.hex("#E24A8D")
				.underline("https://ping.gg")} \n`
		)
		.parse(process.argv)

	// FIXME: TEMPORARY WARNING WHEN USING YARN 3. SEE ISSUE #57
	if (process.env.npm_config_user_agent?.startsWith("yarn/3")) {
		logger.warn(`  WARNING: It looks like you are using Yarn 3. This is currently not supported,
  and likely to result in a crash. Please run create-a8-app with another
  package manager such as pnpm, npm, or Yarn Classic.
  See: https://github.com/a8-oss/create-a8-app/issues/57`)
	}

	// Needs to be separated outside the if statement to correctly infer the type as string | undefined
	const cliProvidedName = program.args[0]
	if (cliProvidedName) {
		cliResults.appName = cliProvidedName
	}

	cliResults.flags = program.opts()

	/** @internal Used for CI E2E tests. */
	let CIMode = false
	if (cliResults.flags.CI) {
		CIMode = true
		cliResults.packages = []
		if (cliResults.flags.drizzle) cliResults.packages.push("drizzle")
		if (cliResults.flags.prisma) cliResults.packages.push("prisma")
		if (cliResults.flags.docker) cliResults.packages.push("docker")
	}

	// Explained below why this is in a try/catch block
	try {
		if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
			logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are 
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you 
  can provide the arguments from the CLI directly: https://create.a8.gg/en/installation#experimental-usage to skip the prompts.`)

			const error = new Error("Non-interactive environment")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(error as any).isTTYError = true
			throw error
		}

		// if --CI flag is set, we are running in CI mode and should not prompt the user
		// if --default flag is set, we should not prompt the user
		if (!cliResults.flags.default && !CIMode) {
			if (!cliProvidedName) {
				cliResults.appName = await promptAppName()
			}

			cliResults.packages = await promptPackages()
			if (!cliResults.flags.noGit) {
				cliResults.flags.noGit = !(await promptGit())
			}

			if (!cliResults.flags.noInstall) {
				cliResults.flags.noInstall = !(await promptInstall())
			}

			cliResults.flags.importAlias = await promptImportAlias()
		}
	} catch (err) {
		// If the user is not calling create-a8-app from an interactive terminal, inquirer will throw an error with isTTYError = true
		// If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default a8 app
		// Otherwise we have to do some fancy namespace extension logic on the Error type which feels overkill for one line
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (err instanceof Error && (err as any).isTTYError) {
			logger.warn(`
  ${CREATE_A8_APP} needs an interactive terminal to provide options`)

			const { shouldContinue } = await inquirer.prompt<{
				shouldContinue: boolean
			}>({
				name: "shouldContinue",
				type: "confirm",
				message: `Continue scaffolding a default A8 app?`,
				default: true
			})

			if (!shouldContinue) {
				logger.info("Exiting...")
				process.exit(0)
			}

			logger.info(`Bootstrapping a default A8 app in ./${cliResults.appName}`)
		} else {
			throw err
		}
	}

	return cliResults
}

const promptAppName = async (): Promise<string> => {
	const { appName } = await inquirer.prompt<Pick<CliResults, "appName">>({
		name: "appName",
		type: "input",
		message: "What will your project be called?",
		default: defaultOptions.appName,
		validate: validateAppName,
		transformer: (input: string) => {
			return input.trim()
		}
	})

	return appName
}

const promptPackages = async (): Promise<AvailablePackages[]> => {
	const { orm } = await inquirer.prompt<{ orm: "Prisma" | "Drizzle" | "None" }>({
		name: "orm",
		type: "select",
		message: "Which ORM would you like to use?",
		choices: ["None", "Drizzle", "Prisma"] // only show prisma and drizzle
			.map((pkgName) => ({
				value: pkgName,
				checked: false
			}))
	})

	const { packages } = await inquirer.prompt<Pick<CliResults, "packages">>({
		name: "packages",
		type: "checkbox",
		message: "Which features would you like to enable?",
		choices: availablePackages
			.filter((pkg) => pkg !== "envVariables" && !["prisma", "drizzle"].includes(pkg)) // don't prompt for env-vars
			.map((pkgName) => ({
				value: pkgName,
				checked: false
			}))
	})

	const finalPackages = [...packages]

	if (orm !== "None") {
		finalPackages.push(orm.toLowerCase() as AvailablePackages)
	}

	return finalPackages
}

const promptGit = async (): Promise<boolean> => {
	const { git } = await inquirer.prompt<{ git: boolean }>({
		name: "git",
		type: "confirm",
		message: "Initialize a new git repository?",
		default: true
	})

	if (git) {
		logger.success("Nice one! Initializing repository!")
	} else {
		logger.info("Sounds good! You can come back and run git init later.")
	}

	return git
}

const promptInstall = async (): Promise<boolean> => {
	const pkgManager = getUserPkgManager()

	const { install } = await inquirer.prompt<{ install: boolean }>({
		name: "install",
		type: "confirm",
		message: `Would you like us to run '${pkgManager}` + (pkgManager === "yarn" ? `'?` : ` install'?`),
		default: true
	})

	if (install) {
		logger.success("Alright. We'll install the dependencies for you!")
	} else {
		if (pkgManager === "yarn") {
			logger.info(`No worries. You can run '${pkgManager}' later to install the dependencies.`)
		} else {
			logger.info(`No worries. You can run '${pkgManager} install' later to install the dependencies.`)
		}
	}

	return install
}

const promptImportAlias = async (): Promise<string> => {
	const { importAlias } = await inquirer.prompt<Pick<CliFlags, "importAlias">>({
		name: "importAlias",
		type: "input",
		message: "What import alias would you like configured?",
		default: defaultOptions.flags.importAlias,
		validate: validateImportAlias,
		transformer: (input: string) => {
			return input.trim()
		}
	})

	return importAlias
}
