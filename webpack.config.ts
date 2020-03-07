const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: ["./src/index.ts"],
    devtool: 'inline-source-map',
    //watch: true,
    target: "node",
    externals: [
        nodeExternals()     // ignore all modules in node_modules
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    //mode: "development",      // passed through command param
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.js"
    }
}