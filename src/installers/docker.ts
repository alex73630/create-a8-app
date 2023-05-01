// import { type PackageJson } from "type-fest";
import { type Installer } from "~/installers/index.js"
import path from "path"
import fs from "fs-extra"
import { PKG_ROOT } from "~/consts.js"

export const dockerInstaller: Installer = ({ projectDir, packages, pkgManager }) => {
	const extrasDir = path.join(PKG_ROOT, "template/extras")

	// copy Dockerfile to project root with right pkg manager
	let dockerfileSrc = path.join(extrasDir, "docker/Dockerfile", `with-${pkgManager}.Dockerfile`)

	// Check if dockerfile exists else replace by npm
	if (!fs.existsSync(dockerfileSrc)) {
		dockerfileSrc = path.join(extrasDir, "docker/Dockerfile", "with-npm.Dockerfile")
	}

	const dockerfileDest = path.join(projectDir, "Dockerfile")

	fs.copySync(dockerfileSrc, dockerfileDest)

	const dockerignoreSrc = path.join(
		extrasDir,
		"docker/dockerignore",
		packages?.prisma.inUse ? "with-prisma.dockerignore" : "base.dockerignore"
	)

	const dockerignoreDest = path.join(projectDir, ".dockerignore")

	fs.copySync(dockerignoreSrc, dockerignoreDest)

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
