const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title = '维词AI听力训练营管理后台';
          return args;
        })
  }
})
