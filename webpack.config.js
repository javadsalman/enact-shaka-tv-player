const path = require('path');

module.exports = {
  entry: './dist/main.js',
  output: {
    filename: './main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  mode: 'production' // or 'development' for development mode
};
