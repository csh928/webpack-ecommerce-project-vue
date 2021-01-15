const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const sourcePath = "./vue/pc/pages";
const bundleDeployPath = "britz/src/main/webapp/pc/assets";
const sourceDeployPath = "britz/src/main/webapp/WEB-INF/view/pc";

// 노드의 모듈을 만들었다
// 웹팩은 스크립트등을 너무 많이 사용해서 하나로 합치기 위해 webpack을 사용한다.
// 노드환경에서는 require을 사용하고 vue환경에서는 import를 사용한다.
module.exports = {
  mode: "development", //개발용 배포용:production
  devtool: "eval", //테스트 배포용 : 'hidden-source-map',
  //하나로 합쳐질 파일의 이름 app (나중에 app.js로 하나로 합쳐진다 )
  entry: {
    // app: './main.js',
    // app: path.join(__dirname, "./vue/pc/main.js"),
    app: ["./vue/pc/main.js"],
  },
  //내보낼 파일의이름
  output: {
    //filename: [name].js
    filename: bundleDeployPath + "/js/[name].js",
    //__dirname 현재 경로, dist 폴더 이름
    path: path.join(__dirname, "../"), //경로
    //publicPath: "/dist", //자동 서버 새로고침을 위한
  },
  //웹팩의 핵심
  //loader는 javascript가 아닌 것들(vue, css등등)을 javascript로 만들어주는 역활을 한다.
  module: {
    //자바스크립트 파일들을 어떻게 처리할건지 정해둔다
    rules: [
      {
        test: /\.vue$/, //파일명이 .vue로 끝나는 파일
        loader: "vue-loader", //vue-loader을 사용하겠다. use: 'vue-loader'도 가능
      },
      // 파일명이 .css로 끝나는 파일들은 해당 loader을 사용
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  //output이 나오기전에 추가적인 작업을 해준다
  plugins: [
    new CopyPlugin([
      {
        from: sourcePath + "/**/*.html",
        to: sourceDeployPath,
        transform(content, targetPath) {
          let result = content.toString();
          let target = path.parse(targetPath);

          console.log(
            new Date(),
            `compile file name ==> ${target.name}${target.ext}`
          );

          return Promise.resolve(result);
        },
        transformPath(targetPath, absolutePath) {
          let target = path.parse(targetPath);
          let name = target.name;
          let ext = target.ext;

          console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaa${name}${ext}`);
          return Promise.resolve(
            targetPath
              .replace(sourcePath.substring(1).replace(/\//g, "\\"), "")
              .replace(name + ext, name + ".jsp")
          );
        },
      },
    ]),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: { vue: "vue/dist/vue.esm.js" },
    extensions: [".js", ".vue"], //확장자를 제거하고 불러낼수 있다.
  },
};
