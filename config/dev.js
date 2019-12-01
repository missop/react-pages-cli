const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const webpackConfig = require('./common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const express = require('express')
const WebpckDevMiddleware = require('webpack-dev-middleware')
const WebpackHotMiddleware = require('webpack-hot-middleware')
// express实例
const app = express()
// 获取页面目录
const entries = utils.entries
// entry中添加hotupdate地址
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
// 设置soucemap格式
webpackConfig.devtool = 'eval-cheap-module-source-map'
webpackConfig.mode = 'development'
webpackConfig.entry = {}
// 设置output去掉hash
webpackConfig.output.filename = '[name].js'
// 遍历每个入口，和生产环境相似
Object.keys(entries).forEach(entryName => {
  // 每个页面生成一个entry，这里实现hotupdate
  webpackConfig.entry[entryName] = [entries[entryName], hotMiddlewareScript]
  //   每个页面进行静态文件提取，生成html
  const plugin = new HtmlWebpackPlugin({
    filename: entryName + '.html',
    template: path.join(__dirname, '../public/index.html'),
    inject: true,
    chunks: [entryName]
  })
  webpackConfig.plugins.push(plugin)
})
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
const complier = webpack(webpackConfig)
// 设置dev-server中间件
const devMiddleware = WebpckDevMiddleware(complier, {
  publicPath: '/',
  stats: {
    colors: true,
    chunks: false
  },
  progress: true,
  inline: true,
  hot: true
})
app.use(devMiddleware)
app.use(WebpackHotMiddleware(complier))

// 设置路由
app.get('/:pagename?', (req, res, next) => {
  const pathname = req.params.pagename
    ? req.params.pagename + '.html'
    : 'index.html'
  const filepath = path.join(complier.outputPath, pathname)
  complier.outputFileSystem.readFile(filepath, (err, rel) => {
    if (err)
      return next(
        '输入路径无效，请输入目录名作为路径，有效路径有：\n/' +
          Object.keys(entries).join('\n/')
      )
    //   发送获取到的页面
    res.set('content-type', 'text/html')
    res.send(rel)
    res.end()
  })
})
module.exports = app.listen(8080, err => {
  if (err) return
  console.log('listening at http:localhost:8080\n')
})
