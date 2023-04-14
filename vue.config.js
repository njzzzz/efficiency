// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
// });

import { defineConfig } from "@vue/cli-service";
export default defineConfig({
  transpileDependencies: ["@slacking"],
  configureWebpack: {
    devtool: "eval-cheap-source-map",
  },
  lintOnSave: false,
});
