import path from "path"

import fs from "fs-extra"

import { PKG_ROOT } from "~/consts.js"
import { type Installer } from "~/installers/index.js"

export const yarnInstaller: Installer = ({ projectDir }) => {
	const extrasDir = path.join(PKG_ROOT, "template/extras")

	const mainSrc = path.join(extrasDir, "yarn/.yarnrc.yml")
	const mainDest = path.join(projectDir, ".yarnrc.yml")

	fs.copySync(mainSrc, mainDest)
}
