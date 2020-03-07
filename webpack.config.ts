const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: ["./src/index.ts"],
    watch: true,
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
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server.js"
    }
}