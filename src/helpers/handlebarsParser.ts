import Handlebars from "handlebars"
import { type PackageManager } from "../utils/getUserPkgManager.js"

interface HandlebarsData {
	pkgManager: PackageManager
	pkgRunExternal: "npx" | Omit<PackageManager, "npm">
	pkgRunScript: "npm run" | Omit<PackageManager, "npm">
}
Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
	// @ts-expect-error no handlebars types for this
	return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

export function handlebarsParser<T = Record<string, unknown>>(template: string, pkgManager: PackageManager, data: T) {
	const handlebarsData: HandlebarsData & T = {
		pkgManager,
		pkgRunExternal: pkgManager === "npm" ? "npx" : pkgManager,
		pkgRunScript: pkgManager === "npm" ? "npm run" : pkgManager,
		...data
	}
	const templateParser = Handlebars.compile<HandlebarsData & T>(template)
	return templateParser(handlebarsData)
}
