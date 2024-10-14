const path = require("path");
const webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const production = process.env.NODE_ENV === "production";

module.exports = {
    mode: production ? "production" : "development",
    entry: path.resolve(__dirname, "./src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: production ? "[name].[contenthash].js" : "[name].js",
        publicPath: "auto",
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
              cacheDirectory: true
            }
          },
          {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              transpileOnly: true
            }
          },
          {
            test: /\.module\.(s*)css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: `migrator__[local]__[contenthash:base64:5]`
                  },
                  importLoaders: 1
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sassOptions: {
                    includePaths: [path.resolve(__dirname, '../node_modules')]
                  }
                }
              }
            ]
          },
          {
            test: /\.(s*)css$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  sassOptions: {
                    includePaths: [path.resolve(__dirname, '../node_modules')]
                  }
                }
              }
            ],
            exclude: /\.module\.(s*)css$/
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/,
            type: "asset/resource"
          },
          {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            type: "asset/resource"
          }
        ]
      },
    resolve: {
        extensions: [".*", ".js", ".jsx", ".ts", ".tsx", ".scss"],
        fallback: {
            util: require.resolve("util"),
            assert: require.resolve("assert"),
            crypto: require.resolve("crypto-browserify"),
            timers: require.resolve("timers-browserify"),
            stream: require.resolve("stream-browserify"),
            fs: false, //require.resolve("fs"),
            tty: require.resolve("tty-browserify"),
            vm: require.resolve("vm-browserify"),
            buffer: require.resolve("buffer"),
            process: require.resolve("process/browser"),
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Webpack & React",
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
        }),
        new MiniCssExtractPlugin({
            filename: production ? "[name].[contenthash].css" : "[name].css",
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        liveReload: false,
        static: {
            directory: path.resolve(__dirname, "./public"),
            serveIndex: false, // Отключает список файлов
        },
    },
};

// resolve: {
//     fallback: {
//         util: false, //require.resolve("util"),
//         assert: false, //require.resolve("assert"),
//         crypto: false, //require.resolve("crypto-browserify"),
//         timers: false, //require.resolve("timers-browserify"),
//         stream: false, // require.resolve("stream-browserify"),
//         fs: false,
//     },
// },
