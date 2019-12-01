## React 多页面脚手架开发

### 开发环境

1. 需要达到的目标：整个项目启动一次，多页面共享相同环境
2. 根据路由匹配页面，需要用到 express/koa

实现热加载与页面刷新

1. 每个页面入口需要添加 webpack-hot-middleware/client?reload=true。
2. 在 webpack 配置中添加 plugin 插件 new webpack.HotModuleReplacementPlugin()。
3. 在 Express 实例中添加中间件'webpack-hot-middleware'。

### 生产环境

### sourcemap

开发环境：cheap-module-eval-source-map:低性能开销，又能够显示代码行数

生产环境：source-map 不显示行数，或者不启用以保护代码安全

### 代码压缩
