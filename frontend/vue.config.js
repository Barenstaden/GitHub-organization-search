module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:3001/",
        pathRewrite: { "^/api": "" },
      },
    },
  },

  // pluginOptions: {
  //   i18n: {
  //     silentFallbackWarn: true,
  //     locale: "no",
  //     fallbackLocale: "no",
  //     localeDir: "locales",
  //     enableInSFC: true,
  //   },
  // },
};
