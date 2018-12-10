const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
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


  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#003580',
      '@link-color': '#1890ff', // 链接色
      '@font-size-base': '14px', // 主字号
      '@text-color': 'rgba(0, 0, 0, .65)' // 主文本色
    }
  })(config, env)

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
