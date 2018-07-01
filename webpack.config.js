const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/client/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist/assets"),
    publicPath: "/assets"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: "babel-loader"
      }
    ]
  }
};
