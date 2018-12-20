const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const webpack = require('webpack')
const path = require('path');
//px自动转换rem
const px2rem = require('postcss-px2rem')
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'import',
      {
        libraryName: 'antd',
        style: 'css'
      }
    ],
    config
  )

  config.resolve.alias['_src'] = path.resolve(__dirname, 'src/');

  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#1070f7',
      '@link-color': '#1070f7', // 链接色
      '@font-size-base': '14px', // 主字号
      '@text-color': 'rgba(0, 0, 0, .65)' // 主文本色
    }
  })(config, env)

  if(process.env.NODE_ENV === 'production'){
    // https://jeremygayed.com/dynamic-vendor-bundling-in-webpack-528993e48aab
    config.plugins.push(
      // Extract all 3rd party modules into a separate 'vendor' chunk
      new webpack.optimize.SplitChunksPlugin({
        cacheGroups: {
          reactBase: {
            name: 'reactBase',
            test: (module) => {
                return /react|redux|prop-types/.test(module.context);
            },
            chunks: 'initial',
            priority: 10,
          },
          common: {
            name: 'common',
            chunks: 'initial',
            priority: 2,
            minChunks: 2,
          },
        }
      }),
      // Generate a 'manifest' chunk to be inlined in the HTML template


      new webpack.HashedModuleIdsPlugin()
    );

  }

  config.module.rules.push({
    test: /\.less$/,
    exclude: /node_modules/,
    use: [
      // {
      //   loader: 'style-loader'
      // },
      // {
      //   loader: 'css-loader'
      // },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [px2rem({ remUnit: 37.5 })]
        }
      },
      {
        loader: 'less-loader'
      }
    ]
  })

  // 装饰器
  injectBabelPlugin(
    [
      '@babel/plugin-proposal-decorators',
      {
        // "decoratorsBeforeExport":true,
        legacy: true
      }
    ],
    config
  )

  return config
}
