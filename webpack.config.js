var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './create.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /(\.js?)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          "presets": ["es2015"]
        }
      },
    ]
  },
  resolveLoader: {
      modulesDirectories: [
          './node_modules'
      ]
  },
  plugins: [
      // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats: {
      // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};
