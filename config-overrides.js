const { injectBabelPlugin } = require('react-app-rewired')
//px自动转换rem
const px2rem = require('postcss-px2rem')
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'import',
      {
        libraryName: 'antd-mobile',
        style: 'css'
      }
    ],
    config
  )

  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [px2rem({ remUnit: 75 })]
        }
      }
    ]
  })

  // 装饰器
  injectBabelPlugin(
    [
      '@babel/plugin-proposal-decorators',
      {
        // "decoratorsBeforeExport":true,
        "legacy": true
      }
    ],
    config
  )

  return config
}
