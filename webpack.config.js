const glob = require('glob'); // 处理文件路径用到，很有用
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const HtmlWebpackPlugin =  require('html-webpack-plugin'); // 将打包后js自动引入html文件插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除打包文件工具
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩去重
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanPath = [path.join(__dirname, './dist')];
// 多页面配置函数
const pagesSetting = () => {
    const entries = {};
    const htmlWebpackPlugins = [];
    const files = glob.sync(path.join(__dirname, './src/pages/**/*.js'));
    files.forEach((file) => {
        const match = file.match(/\/pages\/(.*)\/(.*).js$/);
        const entry = match && match[1]; // 文件夹
        // 保存入口文件
        entries[entry] = file;
        const pageFiles = fs.readdirSync(path.resolve(file, '..'));
        const htmlFile = pageFiles.filter((file) => /\.html$/.test(file));
        if (htmlFile.length > 0) {
            htmlWebpackPlugins.push(new HtmlWebpackPlugin({
                template: path.join(__dirname, `./src/pages/${entry}/${htmlFile[0]}`),
                filename: `pages/${entry}/${htmlFile[0]}`,
                chunks: [entry],
                inject: true, // 将js放在body底部
                minify:{
                    collapseWhitespace: true, // 折叠标签空白
                    minifyCSS: true,
                    minifyJS: true
                }
            }));
        } else {
            console.log(chalk.red(`${path.resolve(file, '..')}目录下无模板文件`))
        }
    });
    return {
        entries,
        htmlWebpackPlugins
    }
};
const {entries, htmlWebpackPlugins} = pagesSetting();
module.exports = {
    mode: 'development',
    entry: entries,
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "pages/[name]/[name].[chunkhash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"}
                ]
            },
            {
                test: /\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'less-loader'}
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: "postcss-loader"},
                    {loader: 'stylus-loader'}
                ]
            },
            {
                test: /\.(bmp|png|jpg|jpeg|ico|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 1024 * 12, // 文件小于12kb，输出DataUrl
                            outputPath: 'assets/images', // 该路径相对于html输出路径
                            publicPath: '../../assets/images',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'img:data-src', 'audio:src'],
                            minimize: false,
                        }
                    }
                ]
            },{
                test:/\.(woff2?|woff|svg|eot|ttf)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name:"[name].[ext]",
                            limit: 1024 * 5,
                            outputPath:'assets/fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...htmlWebpackPlugins,
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: cleanPath
        }),
        new MiniCssExtractPlugin({
            filename: 'pages/[name]/[name].[chunkhash:8].css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: [
                    'default',
                    { discardComments: { removeAll: true } }
                    ],
            },
            canPrint: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/assets/fonts',
                to: 'assets/fonts'
            }
        ])
    ],
    devServer: {
        host: "localhost",
        open: true,
        port: 8081,
        compress: true,
        historyApiFallback:{
            rewrites:[
                {from: /^\/demo1$/, to: '/pages/three_demo_01/index.html'},
                {from: /^\/demo2$/, to: '/pages/three_demo_02/index.html'},
                {from: /^\/demo3$/, to: '/pages/three_demo_03/index.html'},
                {from: /^\/demo4$/, to: '/pages/three_demo_04/index.html'},
                {from: /^\/demo5$/, to: '/pages/three_demo_05/index.html'},
                {from: /^\/demo6$/, to: '/pages/three_demo_06/index.html'},
                {from: /^\/demo7$/, to: '/pages/three_demo_07/index.html'},
                {from: /^\/demo8$/, to: '/pages/three_DirectionalLight_demo/index.html'},
                {from: /^\/demo9$/, to: '/pages/three_HemisphereLight_demo/index.html'},
                {from: /^\/demo10$/, to: '/pages/three_RectAreaLight_demo/index.html'},
                {from: /^\/demo11$/, to: '/pages/three_LensFlare_demo/index.html'},
                {from: /^\/demo12$/, to: '/pages/three_LineBasicMaterial_demo/index.html'},
                {from: /^\/demo13$/, to: '/pages/three_LineDashedMaterial_demo/index.html'},
                {from: /^\/demo14$/, to: '/pages/three_MeshBasicMaterial_demo/index.html'},
                {from: /^\/demo15$/, to: '/pages/three_MeshDepthMaterial_demo/index.html'},
                {from: /^\/demo16$/, to: '/pages/three_MeshLambertMaterial_demo/index.html'},
                {from: /^\/demo17$/, to: '/pages/three_geometry_demo1/index.html'},
                {from: /^\/demo18$/, to: '/pages/three_geometry_demo2/index.html'},
                {from: /./, to: '/pages/three_geometry_demo2/index.html'}
            ]
        }
    }
};