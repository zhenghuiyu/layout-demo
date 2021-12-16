'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 端口号
const port = process.env.port || process.env.npm_config_port || 1216
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const assetsCDN = {
  css: ['cdn/css/element-ui.min.css'],
  js: [
    'cdn/js/vue.min.js',
    'cdn/js/vue-router.min.js',
    'cdn/js/vuex.min.js',
    'cdn/js/axios.min.js',
    'cdn/js/element-ui.min.js',
    'cdn/js/moment.min.js'
  ]
}

// 所有配置项说明可在中找到https://cli.vuejs.org/zh/config/
module.exports = {
  /**
   * 如果计划在子路径下部署站点，则需要设置publicPath,
   * 如果您计划将站点部署到https://foo.github.io/bar/,
   * 然后publicPath应该设置为“/bar/”.
   * 在大多数情况下，请使用“/”！！！
   * 文档: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: config => {
    config['resolve']['alias'] = {
      '@': resolve('src')
    }
    config['externals'] = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
      'moment': 'moment'
    }
    // return {
    //   plugins: [
    //     new BundleAnalyzerPlugin()
    //   ]
    // }
    // 生产环境取消 console.log和debugger
    if (process.env.NODE_ENV === 'production') {
      return {
        optimization: {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                ecma: undefined,
                warnings: false, // 传递true以在中返回压缩机警告result.warnings。使用该值可"verbose"获取更详细的警告。
                parse: {},
                compress: {
                  drop_console: true, // 移除console
                  drop_debugger: true, // 移除debugger
                  pure_funcs: ['console.log'] // 移除console
                },
                output: {
                  comments: false
                }
              }
            })
          ]
        }
      }
    }
  },
  chainWebpack(config) {
    // 它可以提高第一屏的速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 忽略 runtime.js
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // 生产环境，开启js\css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.js$|.\css|.\scss/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }

    // HtmlWebpackPlugin 插件 存储数据 用于生成html模板
    config.plugin('html')
      .tap(args => {
        args[0].cdn = assetsCDN
        return args
      })

    // 当页面太多时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // 加载svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime`必须与runtimeChunk名称相同。默认值为“运行时”
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 依赖包
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为单个包
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                  priority: 20
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
