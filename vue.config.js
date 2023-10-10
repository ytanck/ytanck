const path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: './', // 公共路径
  // publicPath: process.env.NODE_ENV === "production" ? "/site/vue-demo/" : "/", // 公共路径
  // indexPath: "index.html", // 相对于打包路径index.html的路径
  // outputDir: 'dist', //生产环境构建文件的目录
  // assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境关闭 source map
  devServer: {
    // host: 'localhost',
    port: 8080, // 端口号
    open: true,
    proxy: {
      //配置跨域
      '/api': {
        target: 'https://xxx.com',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '',
        // },
      },
    },
  },
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require("postcss-pxtorem")({
  //           //这里是配置项，详见官方文档
  //           rootValue: 75, // 换算的基数
  //           // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
  //           //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
  //           selectorBlackList: ["vant", "mu"], // 忽略转换正则匹配项
  //           propList: ["*"],
  //           exclude: /node_modules/,
  //         }),
  //       ],
  //     },
  //   },
  // },
}