---
title: 从零开始配置webpack
date: 2023-09-27 12:15:20
categories: 前端
tags: [JavaScript,webpack]
---

## 从零开始配置webpack(基于webpack 4 和 babel 7版本)

### webpack 核心概念:
- Entry: 入口
- Module:模块，webpack中一切皆是模块
- Chunk:代码库，一个chunk由十多个模块组合而成，用于代码合并与分割
- Loader:模块转换器，用于把模块原内容按照需求转换成新内容
- Plugin:扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情
- Output: 输出结果
### webpack流程:
webpack启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有Module.每找到一个Module,就会根据配置的Loader去找出对应的转换规则，对Module进行转换后，再解析出当前的Module依赖的Module.这些模块会以Entry为单位进行分组，一个Entry和其所有依赖的Module被分到一个组也就是一个Chunk。最好Webpack会把所有Chunk转换成文件输出。在整个流程中Webpack会在恰当的时机执行Plugin里定义的逻辑。

下面我们开始从零开始配置一个支持打包图片,CSS,LESS,SASS,支持ES6/ES7和JSX语法，并对代码进行压缩的webpack配置.

### 1. 最简webpack配置
首先初始化npm和安装webpack的依赖:

```js
npm init -y
npm install --save-dev webpack webpack-cli
```
配置 webpack.config.js 文件如下:
```js
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    }
}
```
说明: publicPath 上线时配置的是cdn的地址。

使用命令进行打包:
```
webpack --mode production
```
也可以将其配置到 package.json 中的 scripts 字段.

入口文件为 src/index.js, 打包输出到 dist/bundle.js.

### 2. 使用模板 html
html-webpack-plugin 可以指定template模板文件，将会在output目录下，生成html文件，并引入打包后的js.

安装依赖:
```
npm install --save-dev html-webpack-plugin
```
在 webpack.config.js 增加 plugins 配置:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //...other code
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ]
}
```

HtmlWebpackPlugin 还有一些其它的参数,如title(html的title),minify(是否要压缩),filename(dist中生成的html的文件名)等

### 3. 配置 webpack-dev-server
webpack-dev-server提供了一个简单的Web服务器和实时热更新的能力

安装依赖:
```
npm install --save-dev webpack-dev-server
```
在 webpack.config.js 增加 devServer 配置:
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //...other code
    devServer: {
        contentBase: './dist',
        port: '8080',
        host: 'localhost'
    }
}
```
在 package.json 的 scripts 字段中增加:
```
webpack-dev-server --mode development
```
之后，我们就可以通过 npm run dev , 来启动服务。

更多 webpack-dev-server 的知识，请访问: https://webpack.js.org/configuration/dev-server/

### 4. 支持加载css文件
通过使用不同的 style-loader 和 css-loader, 可以将 css 文件转换成JS文件类型。

安装依赖:

```
npm install --save-dev style-loader css-loader
```
在 webpack.config.js 中增加 loader 的配置

```js
module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}
```
loader 可以配置以下参数:

- test: 匹配处理文件的扩展名的正则表达式
- use: loader名称
- include/exclude: 手动指定必须处理的文件夹或屏蔽不需要处理的文件夹
- query: 为loader提供额外的设置选项

如果需要给loader传参，那么可以使用use+loader的方式,如:

```js

module.exports = {
    //other code
    module: {
        rules: [
            {
            use: [{
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top'
                        }
                    },
                    'css-loader'
                ],
                //....
            }
        ]
    }
} 
```
### 5. 支持加载图片
- file-loader: 解决CSS等文件中的引入图片路径问题
- url-loader: 当图片小于limit的时候会把图片Base64编码，大于limit参数的时候还是使用file-loader进行拷贝

如果希望图片存放在单独的目录下，那么需要指定outputPath

安装依赖:
```
npm install --save-dev url-loader file-loader
```
在 webpack.config.js 中增加 loader 的配置(增加在 module.rules 的数组中)。
```js
module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images'
                        }
                    }
                ]
            }
        ]
    }
} 
```
### 6.支持编译less和sass
有些前端同事可能习惯于使用less或者是sass编写css，那么也需要在 webpack 中进行配置。

安装对应的依赖:
```
npm install --save-dev less less-loader
npm install --save-dev node-sass sass-loader
```
在 webpack.config.js 中增加 loader 的配置(module.rules 数组中)。

```js
module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.less/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}        
```
### 7.支持转义 ES6/ES7/JSX
ES6/ES7/JSX 转义需要 Babel 的依赖，支持装饰器。
```
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-proposal-decorators @babel/plugin-proposal-object-rest-spread
```
在 webpack.config.js 中增加 loader 的配置(module.rules 数组中)。

```js
module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/react'],
                            plugins: [
                                [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
        ]
    }
}
```
### 8.压缩JS文件
安装依赖:
```
npm install --save-dev uglifyjs-webpack-plugin
npm install --save-dev optimize-css-assets-webpack-plugin
```
在 webpack.config.js 中增加 optimization 的配置

```js
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    //other code
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                parallel: 4
            })
        ]
    }
}

```
### 9.分离CSS(如果CSS文件较大的话)
因为CSS的下载和JS可以并行，当一个HTML文件很大的时候，可以把CSS单独提取出来加载
```
npm install --save-dev mini-css-extract-plugin
```
在 webpack.config.js 中增加 plugins 的配置,并且将 'style-loader' 修改为 { loader: MiniCssExtractPlugin.loader}。

CSS打包在单独目录，那么配置filename。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.css/,
                use: [{ loader: MiniCssExtractPlugin.loader}, 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.less/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
}
```
### 10.压缩CSS文件
安装依赖:
```
npm install --save-dev optimize-css-assets-webpack-plugin
```
在 webpack.config.js 中的 optimization 中增加配置
```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    //other code
    optimization: {
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin()
        ]
    }
}

```
### 11.打包前先清空输出目录
```
npm install --save-dev clean-webpack-plugin
```
在 webpack.config.js 中增加 plugins 的配置
```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    //other code
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```
至此，webpack配置已经基本能满足需求。

### 完整webpack.config.js和package.json文件
webpack.config.js文件:

```js
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: './dist',
        port: '8080',
        host: 'localhost'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/react'],
                            plugins: [
                                [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: [{ loader: MiniCssExtractPlugin.loader}, 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.less/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            outputPath: 'images'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                parallel: 4
            }),
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new CleanWebpackPlugin()
    ]
}
```
package.json文件:

```js
{
  "name": "webpk",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode production",
    "dev": "webpack-dev-server --mode development"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.0",
    "@babel/plugin-proposal-decorators": "^7.4.0",
    "@babel/plugin-proposal-object-rest-spread": "^7.4.0",
    "@babel/preset-env": "^7.4.1",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.5",
    "clean-webpack-plugin": "^2.0.1",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.5.0",
    "node-sass": "^4.11.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "uglifyjs-webpack-plugin": "^2.1.2",
    "url-loader": "^1.1.2",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.2.1"
  },
  "dependencies": {
    "react": "^16.8.4",
    "react-dom": "^16.8.4",
    "react-redux": "^6.0.1",
    "redux": "^4.0.1"
  }
}
```
更多loader和plugin的参数可以参考:

https://www.webpackjs.com/loaders/

https://www.webpackjs.com/plugins/