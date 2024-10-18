// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  // 2D Front Card Configuration
  {
    entry: './src/2d/front/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '2d_front.bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/2d/front/template.html',
        filename: '2d_front.min.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
    mode: 'production',
  },
  // 2D Back Card Configuration
  {
    entry: './src/2d/back/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '2d_back.bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/2d/back/template.html',
        filename: '2d_back.min.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
    mode: 'production',
  },
  // 3D Front Card Configuration
  {
    entry: './src/3d/front/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '3d_front.bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/3d/front/template.html',
        filename: '3d_front.min.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
    mode: 'production',
  },
  // 3D Back Card Configuration
  {
    entry: './src/3d/back/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '3d_back.bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/3d/back/template.html',
        filename: '3d_back.min.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
    mode: 'production',
  },
];

