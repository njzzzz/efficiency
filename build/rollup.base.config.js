import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import vue from "@vitejs/plugin-vue2";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import { resolve } from "node:path";
const globals = {
  vue: "Vue",
  "lodash-es": "_",
  "element-ui": "ElementUi",
  "@slacking/form": "SlackingForm",
  "@slacking/table": "SlackingTable",
  "@slacking/shared": "SlackingShared",
};
const isDevelopment = process.env.BUILD === "development";

export function getBaseConfig({ pkg, pkgDir, name }) {
  const inputPlugins = [
    typescript({
      declaration: false,
      sourceMap: isDevelopment,
      tsconfig: resolve(pkgDir, "tsconfig.json"),
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
  ];
  const outputPlugins = [];
  if (!isDevelopment) {
    inputPlugins.push(
      strip({
        include: "**/*.(mjs|js|jsx|ts|tsx|vue)",
      })
    );
    outputPlugins.push(terser());
  }
  return defineConfig([
    {
      input: resolve(pkgDir, "index.ts"),
      plugins: inputPlugins,
      external: [
        "vue",
        "lodash-es",
        "element-ui",
        "@slacking/form",
        "@slacking/table",
        "@slacking/shared",
      ],
      output: [
        {
          sourcemap: isDevelopment,
          name,
          format: "umd",
          file: resolve(pkgDir, pkg.main),
          globals,
        },
        {
          sourcemap: isDevelopment,
          format: "es",
          file: resolve(pkgDir, pkg.module),
          globals,
        },
        {
          sourcemap: isDevelopment,
          name,
          file: resolve(pkgDir, pkg.unpkg),
          format: "umd",
          plugins: outputPlugins,
          globals,
        },
      ],
    },
  ]);
}
