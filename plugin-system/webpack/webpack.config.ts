import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: webpack.Configuration = {
  mode: "production",
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'by sulirc'
    }),
    new HtmlWebpackPlugin()
  ]
};

export default config;
