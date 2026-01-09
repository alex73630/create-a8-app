# Copilot Instructions for create-a8-app

This repository contains the `create-a8-app` CLI, a tool for scaffolding TypeScript applications with the A8 Stack (TypeScript, Drizzle, T3-Env). It is inspired by `create-t3-app`.

## Architecture & Logic Flow

- **Entry Point**: `src/index.ts` is the executable entry point. It orchestrates the flow: CLI arguments -> Project creation -> Git initialization -> Dependency installation.
- **CLI Logic**: `src/cli/index.ts` defined the commands using `commander` and interactive prompts using `inquirer`.
- **Scaffolding**: `src/helpers/scaffoldProject.ts` copies the base template from `template/base` to the target directory.
    - _Note_: Files starting with `_` (like `_gitignore`) are renamed to `.` (e.g., `.gitignore`) during scaffolding to prevent NPM publishing issues.
- **Modular Installers**: The architecture is designing around "installers" for optional features (Drizzle, Docker).
    - See `src/installers/index.ts` for the registry of available packages.
    - Each installer (e.g., `src/installers/drizzle.ts`) handles adding dependencies and copying specific template files for that feature.

## Directory Structure

- `src/`: Application source code.
    - `cli/`: CLI command definition and prompt logic.
    - `helpers/`: Core logic for scaffolding, git operations, and logging.
    - `installers/`: Individual setup logic for optional packages.
    - `utils/`: Shared utilities (logging, path parsing, validations).
- `template/`: Contains the raw files that will be generated in the user's project.
    - `base/`: The mandatory core files for every new project.
    - `extras/`: Files specific to optional add-ons (Drizzle, Docker, etc.).

## Development Workflow

- **Build**: `yarn build` uses `tsdown` to bundle the CLI to `dist/`.
- **Dev**: `yarn dev` runs `tsdown --watch` for hot-reloading.
- **Test Manual**: To test changes, run `yarn start` (which executes `dist/index.js`) or link the package locally.
- **Lint/Format**: Use `yarn lint` and `yarn format`.
- **Dependencies**: The project uses `esm` (type: module).

## Coding Conventions

- **Path Aliases**: Use `~/` for imports from `src/` (e.g., `import { logger } from "~/utils/logger.js"`).
- **File Extensions**: Imports must include the `.js` extension (e.g., `import ... from "./file.js"`).
- **Template Management**: When adding a new feature, add its template files to `template/extras/{feature}` and create a corresponding installer in `src/installers/`.
- **Package Managers**: The CLI detects and supports `npm`, `yarn`, and `pnpm`. Logic for this is in `src/utils/getUserPkgManager.ts`.

## Critical Files

- `src/consts.ts`: Configuration constants (app name, root path).
- `src/installers/dependencyVersionMap.ts`: Central place to manage versions of dependencies installed in the generated app. **Update this when upgrading template dependencies.**
