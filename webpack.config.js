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

//启用热更新
const webpack = require('webpack');

module.exports = {
  //asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
  //This can impact web performance.
  performance: {
    hints: false
  },
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  //js sourceMap 使用 inline-source-map 选项，这有助于解释说明 js 原始出错的位置。
  //（不要用于生产环境）
  devtool: 'inline-source-map',
  //webpack-dev-server 为你提供了一个简单的 web 服务器
  //并且能够实时重新加载(live reloading)
  devServer: {
    clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
    hot: true,  // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
    contentBase:  path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
    compress: true, // 一切服务都启用gzip 压缩
    host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
    port: 8080, // 端口
    open: true, // 是否打开浏览器
    overlay: {  // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
      warnings: true,
      errors: true
    },
    publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
    proxy: {  // 设置代理
      "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
        target: "http://192.168.0.102:8080",
        pathRewrite: {"^/api" : "/mockjsdata/5/api"}
      }
    },
    quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    watchOptions: { // 监视文件相关的控制选项
      poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
      ignored: /node_modules/, // 忽略监控的文件夹，正则
      aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟
    }
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
      },

      //加载图片和图片优化
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          //加载图片，file-loader处理文件的导入
          //'file-loader',

          //url-loader功能类似于 file-loader，
          //可以把 url 地址对应的文件，打包成 base64 的 DataURL，提高访问的效率。
          {
            loader: 'url-loader', // 根据图片大小，把图片优化成base64
            options: {
              limit: 10000
            }
          },

          //图片优化，image-webpack-loader可以帮助我们对图片进行压缩和优化。
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65,0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          },
        ]
      },

      //字体处理，由于 css 中可能引用到自定义的字体，处理也是跟图片一致。
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,  // 加快编译速度，不包含node_modules文件夹内容
        use: {
          loader: 'babel-loader'
        }
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
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),  // 更容易查看(patch)的依赖
    new webpack.HotModuleReplacementPlugin()  // 替换插件
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
