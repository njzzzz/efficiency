import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import vue from "@vitejs/plugin-vue2";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import pkg from "../packages/form/package.json" assert { type: "json" };
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const globals = {
  vue: "Vue",
  "lodash-es": "_",
  'element-ui': 'ElementUi',
  "@slacking/form": 'SlackingForm'
};
const pkgFormDir = resolve(__dirname, "../packages/form");
export default defineConfig([
  {
    input: resolve(pkgFormDir, "index.ts"),
    plugins: [
      typescript({
        declaration: false,
        sourceMap: false,
        tsconfig: resolve(pkgFormDir, "tsconfig.json"),
      }),
      vue(),
      postcss(),
      babel({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        babelHelpers: "runtime",
        plugins: ["@babel/plugin-transform-runtime"],
      }),
      nodeResolve({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
      }),
      commonjs(),
    ],
    external: ["vue", "lodash-es", "element-ui", "@slacking/form"],
    output: [
      {
        name: "SlackingForm",
        format: "umd",
        file: resolve(pkgFormDir, pkg.main),
        globals,
      },
      {
        format: "es",
        file: resolve(pkgFormDir, pkg.module),
        globals,
      },
      {
        name: "SlackingForm",
        file: resolve(pkgFormDir, pkg.unpkg),
        format: "umd",
        plugins: [terser()],
        globals,
      },
    ],
  },
]);
