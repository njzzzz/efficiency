import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import vue from "rollup-plugin-vue";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };

const globals = {
  vue: "Vue",
  "lodash-es": "_",
};
export default defineConfig({
  input: "src/components/index.ts",
  plugins: [
    typescript({
      declaration: false,
      sourceMap: false,
    }),
    vue(),
    babel({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      babelHelpers: "bundled",
    }),
    nodeResolve({
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
    }),
    commonjs(),
  ],
  external: ["vue", "lodash-es"],
  output: [
    {
      name: "SlackingForm",
      format: "umd",
      file: pkg.main,
      globals,
    },
    {
      format: "es",
      file: pkg.module,
      globals,
    },
    {
      name: "SlackingForm",
      file: pkg.unpkg,
      format: "umd",
      plugins: [terser()],
      globals,
    },
  ],
});
