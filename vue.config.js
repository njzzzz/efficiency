const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack(config) {
    if (process.env.NODE_ENV !== "development") {
      config.externals = {
        "lodash-es": "lodash-es",
      };
    }
  },
});
