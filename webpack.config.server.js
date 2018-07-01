const nodeExternals = require("webpack-node-externals"),
  path = require("path"),
  distPath = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",
  entry: "./src/server/server.js",
  output: {
    path: distPath,
    filename: "server.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: "babel-loader"
      }
    ]
  },
  target: "node",
  externals: nodeExternals() // Hey! no agrupes todos los node modules que este servidor necesita porque no es necesario!
};
