// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

// Common configuration settings
const mode = "production";
const outputPath = path.resolve(__dirname, "dist");
const commonPlugins = (type, side) => [
  new HtmlWebpackPlugin({
    template: `./src/${type}/${side}/template.html`,
    filename: `${type}_${side}.min.html`,
    inject: "body",
    minify: {
      collapseWhitespace: true,
      removeComments: true,
    },
  }),
  new HtmlInlineScriptPlugin(),
];

// Define the different types and sides you have
const cardTypes = ["2d", "3d"];
const cardSides = ["front", "back"];

// Generate configurations for each combination of type and side
const configs = cardTypes.flatMap((type) =>
  cardSides.map((side) => ({
    entry: `./src/${type}/${side}/index.js`,
    output: {
      path: outputPath,
      filename: `${type}_${side}.bundle.js`,
      publicPath: "",
    },
    plugins: commonPlugins(type, side),
    mode,
  }))
);

module.exports = configs;

