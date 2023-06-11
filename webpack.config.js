const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_PATH = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_PATH + "main.js",
    videoPlayer: BASE_PATH + "videoPlayer.js",
    recorder: BASE_PATH + "recorder.js",
    commentSection: BASE_PATH + "commentSection.js",
  },
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
