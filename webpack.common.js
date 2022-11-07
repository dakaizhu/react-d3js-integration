const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {  
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"), 
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/i,
                use: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
        })
      ],
}