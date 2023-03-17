module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        jsx: {
          vModel: true,
          vOn: true,
          compositionAPI: true,
          functional: true,
          injectH: true,
        },
      },
    ],
  ],
};
