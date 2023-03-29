// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
// });

import { defineConfig } from "@vue/cli-service";
export default defineConfig({
  transpileDependencies: ["@slacking"],
  lintOnSave: false,
});
