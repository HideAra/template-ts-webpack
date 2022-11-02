const path = require("path");
//mini-css-extract-plugin の読み込み
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//optimize-css-assets-webpack-plugin の読み込み
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//JavaScript の圧縮用のプラグイン TerserPlugin の読み込み
const TerserPlugin = require("terser-webpack-plugin");
//html-webpack-plugin の読み込み
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 変数 devMode に開発モードの場合は true、プロダクションの場合は false を代入
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  // mode: "development",
  target: "web",
  //エントリポイント（入力ファイル）
  entry: "./src/main.ts",
  //出力先
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    //Asset Modules の出力先の指定
    assetModuleFilename: "assets/images/[name][ext][query]",
    clean: {
      keep(asset) {
        // index.html をキープ（削除しない）
        if (asset.includes("test_index.html")) {
          return true;
        } else if (asset.includes("assets/images")) {
          return true;
        } else false;
      },
    },
  },
  //source-map タイプのソースマップを出力
  devtool: "source-map",
  //プラグインの設定
  plugins: [
    new MiniCssExtractPlugin({
      //出力するスタイルシートの名前
      filename: "css/style.css",
    }),
    //HtmlWebpackPlugin プラグイン（インスタンスを生成）
    new HtmlWebpackPlugin({
      title: "My Template X",
      filename: "index.html",
      hash: true,
      // テンプレートで使用するファイルのパスを指定
      template: "src/template/index.html",
      // テンプレートで使用する変数 h1 を設定
      h1: "Heading Title H1",
    }),
  ],
  module: {
    rules: [
      {
        // ローダーの処理対象ファイル（拡張子 .ts .tsx .js .jsx ファイルを対象）
        test: /\.(ts|tsx|js|jsx)$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        // 処理対象のファイルに使用するローダーやオプションを指定
        use: [
          {
            // 利用するローダーを指定
            loader: "babel-loader",
            // ローダー（babel-loader）のオプションを指定
            options: {
              // プリセットを指定
              presets: [
                [
                  // targets を指定していないので、一律に ES5 の構文に変換
                  "@babel/preset-env",
                ],
                ["@babel/preset-typescript"],
              ],
            },
          },
        ],
      },
      {
        test: /\.(scss|sass|css)$/i, //拡張子 .scss、.sass、css を対象
        //使用するローダーを指定
        use: [
          // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
          MiniCssExtractPlugin.loader,
          // CSS を JavaScript に変換するローダー（ソースマップを有効に）
          {
            loader: "css-loader",
            options: {
              //   url: false, //URL の解決を無効に
              sourceMap: true,
            },
          },
          // PostCSS の設定
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      //必要に応じてオプションを指定
                      //stage: 0,
                      //browsers: 'last 2 versions',
                      //autoprefixer のオプション
                      //autoprefixer: { grid: true }
                    },
                  ],
                ],
              },
            },
          },
          // Sass をコンパイルするローダー（ソースマップを有効に）
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "compressed", // アウトプットスタイルの指定
              },
            },
          },
        ],
      },
      //Asset Modules
      {
        //対象のアセットファイルの拡張子を指定
        test: /\.(png|jpe?g|gif|svg)$/i,
        generator: {
          filename: "assets/images/[name][ext][query]",
        },
        type: "asset/resource", //ファイルを生成（コピー）して出力
      },
      {
        //対象のアセットファイルの拡張子を指定
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        generator: {
          filename: "assets/fonts/[name][ext][query]",
        },
        type: "asset/resource", //ファイルを生成（コピー）して出力
      },
    ],
  },
  optimization: {
    minimizer: [
      //JavaScript 用の圧縮プラグイン
      new TerserPlugin({}),
      //CSS 用の圧縮プラグイン
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      // 明示的に特定のファイル（共通モジュール）を chunk に分離して出力する場合に設定
      chunks: "initial",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: [".ts", ".tsx", ".js", ".jsx", "..."],
  },
  //webpack-dev-server の設定
  devServer: {
    static: "./dist", //静的ファイルの場所
    //サーバー起動時にブラウザを自動的に起動
    open: true,
    // ポート番号を変更
    port: 3000,
    //webpack-dev-middleware 関連の設定
    devMiddleware: {
      writeToDisk: true, //バンドルされたファイルを出力する（実際に書き出す）
    },
  },
  watchOptions: {
    ignored: /node_modules/, //正規表現で指定（node_modules を除外）
  },
};
