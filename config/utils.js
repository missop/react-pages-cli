const glob = require('glob')
function getEntries(globPath) {
  const files = glob.sync(globPath),
    entries = {}
  console.log(files)
  files.forEach(filePath => {
    //   取到page1,page2类似的页面名
    let rel = filePath.split('/')
    rel = rel[rel.length - 2]
    // 保存为{'目录名':'目录路径'}
    entries[rel]='./'+filePath
  })
  return entries
}
// **指代一级或者多级文件夹
const entries = getEntries('src/**/main.js')
module.exports = { entries }
