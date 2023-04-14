import pkg from "../packages/table/package.json" assert { type: "json" };
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getBaseConfig } from "./rollup.base.config.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgDir = resolve(__dirname, "../packages/table");
export default getBaseConfig({ pkg, pkgDir, name: "SlackingTable" });
