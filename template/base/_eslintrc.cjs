/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	env: {
		node: true,
		es2021: true,
		es6: true
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "import"],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:prettier/recommended",
		"plugin:import/typescript",
		"prettier" // Prettier plugin
	],
	settings: {
		"import/resolver": {
			typescript: {
				project: "./tsconfig.json"
			}
		}
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"]
	},
	rules: {
		"prettier/prettier": ["error", {}, { usePrettierrc: true }], // Includes .prettierrc.cjs rules
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }
		],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "inline-type-imports" }
		],
		"sort-imports": [
			"error",
			{
				ignoreCase: false,
				ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
				allowSeparatedGroups: true
			}
		],
		"import/order": [
			"error",
			{
				groups: [
					"builtin", // Built-in imports (come from NodeJS native) go first
					"external", // <- External imports
					"internal", // <- Absolute imports
					["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
					"index", // <- index imports
					"unknown" // <- unknown
				],
				"newlines-between": "always",
				alphabetize: {
					/* sort in ascending order. Options: ["ignore", "asc", "desc"] */
					order: "asc",
					/* ignore case. Options: [true, false] */
					caseInsensitive: true
				}
			}
		]
	}
}

module.exports = config
