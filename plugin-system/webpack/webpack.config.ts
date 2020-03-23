import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import FileListPlugin from './src/file-list-plugin';

const config: webpack.Configuration = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].bundle.js"
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '(c" ತ,_ತ)'
    }),
    new HtmlWebpackPlugin(),
    new FileListPlugin()
  ]
};

export default config;
