// path 模块提供用于处理文件路径和目录路径的实用工具。 
// 它可以使用以下方式访问：
const path = require('path');

//HtmlWebpackPlugin插件，可以把打包后的 CSS 或者 JS 文件引用直接注入到 HTML 模板中，
//这样就不用每次手动修改文件引用了。
const HtmlWebpackPlugin = require('html-webpack-plugin');

//样式表抽离成专门的单独文件并且设置版本号(mode 设置为 production)
//抽取了样式，就不能再用 style-loader注入到 html 中了。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 判断当前环境是开发环境还是 部署环境，主要是 mode属性的设置值。
const devMode = process.env.NODE_ENV !== 'production'; 

//压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//js压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//清理 dist 目录
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    // 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。
    //忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。
    // 忽略大型的 library 可以提高构建性能。
    noParse: /jquery|lodash/,
    // 创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。
    // 这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          //'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          // PostCSS是一个 CSS 的预处理工具，可以帮助我们：给 CSS3 的属性添加前缀，样式格式校验（stylelint），提前使用 css 的新特性
          // 比如：表格布局，更重要的是可以实现 CSS 的模块化，防止 CSS 样式冲突。
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: loader => [
                require('autoprefixer')({ browsers: ['> 0.15% in CN'] }) // 添加前缀
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css', // 设置最终输出的文件名
      chunkFilename: '[id].[hash].css'
    }),
    new HtmlWebpackPlugin({
      title: 'AICODER 全栈线下实习', // 默认值：Webpack App
      filename: 'main.html', // 默认值： 'index.html'
      template: path.resolve(__dirname, 'src/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};
