const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const isDev = process.env.NODE_ENV === 'development'

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

const jsLoader = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/favicon.ico'),
          to: path.resolve('dist'),
        },
      ],
    }),
    new SpriteLoaderPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    watchContentBase: true,
    compress: true,
    port: 9001,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : '',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: jsLoader(),
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader',
          'svgo-loader',
        ],
      },
    ],
  },
}
