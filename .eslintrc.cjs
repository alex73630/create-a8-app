/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["import"],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:prettier/recommended",
		"prettier" // Prettier plugin
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json", "./template/tsconfig.eslint.json"]
	},
	rules: {
		"prettier/prettier": ["error", {}, { usePrettierrc: true }], // Includes .prettierrc.cjs rules
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }
		],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "inline-type-imports" }
		],
		"import/consistent-type-specifier-style": ["error", "prefer-inline"],

		// These rules are only disabled because we hit a bug in linting.
		// See https://github.com/t3-oss/create-t3-app/pull/1036#discussion_r1060505136
		// If you still see the bug once TypeScript@5 is used, please let typescript-eslint know!
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unnecessary-type-assertion": "off"
	}
}

module.exports = config
