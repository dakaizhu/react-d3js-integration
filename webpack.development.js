const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const config =  {
    mode: "development",
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(scss|css)$/i,
          use: ["style-loader","css-loader","sass-loader"],
          exclude: /node_modules/
        }
      ]
    },
    devServer: {  
      port: 3001,
      hot: true,
      open: true,
      compress: true,
      historyApiFallback: true,
      static: {
         directory: path.join(__dirname, "dist/assets"),  
      }
    },  
  };

module.exports = merge(common, config);