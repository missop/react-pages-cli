const path = require('path')
const webpackConfig = require('./common')
// nodejs中的loading效果
const ora = require('ora')
// 实现node.js环境的UNIX命令rm -rf。
// rimraf(f, [opts], callback)
const rimraf = require('rimraf')
// 命令行输出各种样式的字符串。
const chalk = require('chalk')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils')

let pageArray = []
// 由于最终的命令带有打包页面参数[例如:npm run build page1]则先去掉前两个参数
const argv = process.argv.slice(2)
// 如果带有参数则赋值给entries，否则打包全部
if (argv.length) {
  pageArray = argv
} else {
  pageArray = Object.keys(utils.entries)
}
// 开始输出，显示loading状态
const spinner = ora(' 🍎 building for production...\n')
spinner.start()
pageArray.forEach((value, index, array) => {
  const distPath = path.join(__dirname, '../dist', value)
  // 先删除老的打包后的文件，再修改打包配置，最后打包
  rimraf(distPath, err => {
    if (err) {
      throw err
    }

    // 修改输出目录
    webpackConfig.output.path = distPath
    // 设置入口文件
    webpackConfig.entry = {}
    webpackConfig.entry[index] = path.join(
      __dirname,
      '../src/views',
      value,
      'main.js'
    )
    // 使用html提取文件
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        // 多个页面公用同一模板或者可以单独设置模板，只需要拼接路径就可以了
        template: './public/index.html',
        // 将静态资源地址注入html
        inject: true
      })
    )

    // 开启打包
    webpack(webpackConfig, (err, stats) => {
      console.log(webpackConfig)
      spinner.stop()
      // 输出错误信息
      if (err) {
        throw err
      }
      // 输出打包完成信息
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n'
      )
      console.log(chalk.cyan('Build complete.\n'))
    })
  })
})
