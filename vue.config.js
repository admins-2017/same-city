module.exports = {
  // 公共路径(必须有的)
  publicPath: "./",
  outputDir: "dist", //build输出目录
  assetsDir: "assets", //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: "8088",
    https: false, //是否使用https协议
    hotOnly: false, //是否开启热更新
    proxy: {
      "/api": {
        target: "https://www.kangdongwei.cn:8080",
        // target: "https://192.168.0.112:8080",
        ws: true, //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          "^/api": "",
        },
      },
    },
    disableHostCheck: true,
  },
};
