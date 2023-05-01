/** @type {import("lint-staged").Config} */
module.exports = {
	"*.{js,cjs,mjs,ts}": (filenames) => [
		`eslint --fix ${filenames.join(" ")}`,
		`prettier --write ${filenames.join(" ")}`
	],
	"*.ts": "tsc --noEmit"
}
