import path from "path"
import { fileURLToPath } from "url"

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url)
const distPath = path.dirname(__filename)
export const PKG_ROOT = path.join(distPath, "../")

//export const PKG_ROOT = path.dirname(require.main.filename);

export const TITLE_TEXT = `   _____ _____  ______       _______ ______          ___          _____  _____  
  / ____|  __ \\|  ____|   /\\|__   __|  ____|   /\\   / _ \\   /\\   |  __ \\|  __ \\ 
 | |    | |__) | |__     /  \\  | |  | |__     /  \\ | (_) | /  \\  | |__) | |__) |
 | |    |  _  /|  __|   / /\\ \\ | |  |  __|   / /\\ \\ > _ < / /\\ \\ |  ___/|  ___/ 
 | |____| | \\ \\| |____ / ____ \\| |  | |____ / ____ \\ (_) / ____ \\| |    | |     
  \\_____|_|  \\_\\______/_/    \\_\\_|  |______/_/    \\_\\___/_/    \\_\\_|    |_|     
`
export const DEFAULT_APP_NAME = "my-a8-app"
export const CREATE_A8_APP = "create-a8-app"
