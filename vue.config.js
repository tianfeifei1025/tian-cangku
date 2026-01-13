const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 解决懒加载 chunk 在不同端口/子路径下请求失败的问题
  publicPath: '/',
  devServer: {
    port: 8080,
  },
})
