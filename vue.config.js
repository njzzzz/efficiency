// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
// });

import { defineConfig } from "@vue/cli-service";
import CircularDependencyPlugin from "circular-dependency-plugin";
export default defineConfig({
  transpileDependencies: ["@slacking"],
  configureWebpack: {
    devtool: "eval-cheap-source-map",
  },
  lintOnSave: false,
  chainWebpack(config) {
    config.plugin("CircularDependencyPlugin").use(
      new CircularDependencyPlugin({
        failOnError: true,
        include: /src|@slacking/,
        cwd: process.cwd(),
      })
    );
  },
});
