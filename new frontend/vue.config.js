const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    publicPath: "/",
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
    pwa: {
      name: "TouchFishing",
      themeColor: "#5561d4",
      msTileColor: "#5561d4",
      appleMobileWebAppCapable: "yes",
      appleMobileWebAppStatusBarStyle: "black",
      // configure the workbox plugin
      workboxPluginMode: "GenerateSW",
      manifestOptions: {
        name: "Touch Fishing",
        short_name: "摸渔",
        icons: [
          {
            src: "./fishicon.svg",
            sizes: "256x256",
            type: "image/svg",
          },
        ],
        background_color: "#bbdefb",
      },
    },
  },
});
