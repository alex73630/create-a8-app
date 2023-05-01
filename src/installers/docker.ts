// import { type PackageJson } from "type-fest";
import { type Installer } from "~/installers/index.js"
import path from "path"
import fs from "fs-extra"
import { PKG_ROOT } from "~/consts.js"
import { handlebarsParser } from "../helpers/handlebarsParser.js"

export const dockerInstaller: Installer = ({ projectDir, packages, pkgManager }) => {
	const extrasDir = path.join(PKG_ROOT, "template/extras")

	// copy Dockerfile to project root with right pkg manager
	const dockerfileSrc = path.join(extrasDir, "docker/Dockerfile.hbs")

	// Load the template
	const dockerfileTemplate = fs.readFileSync(dockerfileSrc, "utf-8")

	// Compile the template
	const dockerfile = handlebarsParser<{
		usePrisma: boolean
	}>(dockerfileTemplate, pkgManager, {
		usePrisma: packages?.prisma.inUse ?? false
	})

	const dockerfileDest = path.join(projectDir, "Dockerfile")

	fs.writeFileSync(dockerfileDest, dockerfile, "utf-8")

	const dockerignoreSrc = path.join(extrasDir, "docker/dockerignore.hbs")

	// Load the template
	const dockerignoreTemplate = fs.readFileSync(dockerignoreSrc, "utf-8")

	// Compile the template
	const dockerignore = handlebarsParser<{
		usePrisma: boolean
	}>(dockerignoreTemplate, pkgManager, {
		usePrisma: packages?.prisma.inUse ?? false
	})

	const dockerignoreDest = path.join(projectDir, ".dockerignore")

	fs.writeFileSync(dockerignoreDest, dockerignore, "utf-8")

	if (packages?.prisma.inUse) {
		const dockercomposeSrc = path.join(extrasDir, "docker/docker-compose", "with-prisma.yaml")
		const dockercomposeDest = path.join(projectDir, "docker-compose.yaml")

		fs.copySync(dockercomposeSrc, dockercomposeDest)
	}

	// add postinstall script to package.json
	// const packageJsonPath = path.join(projectDir, "package.json");

	// const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;
	// packageJsonContent.scripts = {
	// 	...packageJsonContent.scripts,
	// 	postinstall: "prisma generate",
	// };
	// fs.writeJSONSync(packageJsonPath, packageJsonContent, {
	// 	spaces: 2,
	// });
}
