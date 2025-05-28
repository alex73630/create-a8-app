// @ts-check

import eslint from "@eslint/js"
import { importX } from "eslint-plugin-import-x"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import globals from "globals"
import tseslint, { configs as tsConfigs } from "typescript-eslint"

export default tseslint.config(
	{
		// config with just ignores is the replacement for `.eslintignore`
		ignores: ["**/dist", "**/node_modules", "**/template", "**/my-a8-app"]
	},
	eslint.configs.recommended,
	tsConfigs.recommended,
	tsConfigs.recommendedTypeChecked,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	{
		plugins: { "@typescript-eslint": tseslint.plugin },
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: { projectService: true },
			globals: {
				...globals.node
			}
		},
		rules: {
			"@typescript-eslint/restrict-template-expressions": "off",

			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_", varsIgnorePattern: "^_" }
			],

			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" }
			],

			"import-x/consistent-type-specifier-style": ["error", "prefer-inline"],
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
			"import-x/order": [
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
			],
			"import-x/no-named-as-default-member": "off",
			"import-x/no-named-as-default": "off",
			"no-case-declarations": "off",
			"no-useless-escape": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "off"
		}
	},
	{
		// disable type-aware linting on JS files
		files: ["**/*.js", "**/*.cjs"],
		extends: [tsConfigs.disableTypeChecked]
	},
	eslintPluginPrettierRecommended
)
