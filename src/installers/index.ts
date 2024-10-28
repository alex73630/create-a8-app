import { type PackageManager } from "~/utils/getUserPkgManager.js"
import { envVariablesInstaller } from "~/installers/envVars.js"
import { prismaInstaller } from "~/installers/prisma.js"
import { dockerInstaller } from "./docker.js"
import { drizzleInstaller } from "~/installers/drizzle.js"

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availablePackages = ["drizzle", "prisma", "docker", "envVariables"] as const
export type AvailablePackages = (typeof availablePackages)[number]

export interface InstallerOptions {
	projectDir: string
	pkgManager: PackageManager
	noInstall: boolean
	packages?: PkgInstallerMap
	projectName?: string
}

export type Installer = (opts: InstallerOptions) => void

export type PkgInstallerMap = {
	[pkg in AvailablePackages]: {
		inUse: boolean
		installer: Installer
	}
}

export const buildPkgInstallerMap = (packages: AvailablePackages[]): PkgInstallerMap => ({
	drizzle: {
		inUse: packages.includes("drizzle"),
		installer: drizzleInstaller
	},
	prisma: {
		inUse: packages.includes("prisma"),
		installer: prismaInstaller
	},
	docker: {
		inUse: packages.includes("docker"),
		installer: dockerInstaller
	},
	envVariables: {
		inUse: true,
		installer: envVariablesInstaller
	}
})
