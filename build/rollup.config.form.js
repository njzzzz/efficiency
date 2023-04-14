import pkg from "../packages/form/package.json" assert { type: "json" };
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getBaseConfig } from "./rollup.base.config.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgDir = resolve(__dirname, "../packages/form");
export default getBaseConfig({ pkg, pkgDir, name: "SlackingForm" });
