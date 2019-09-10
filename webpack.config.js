// path 模块提供用于处理文件路径和目录路径的实用工具。 
// 它可以使用以下方式访问：
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist')
  }
};
