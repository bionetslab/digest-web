const TerserPlugin = require("terser-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const AsyncCssPlugin = require("async-css-plugin");

module.exports = {

    outputDir: "dist",
    assetsDir: "static",
    publicPath: "/",
    transpileDependencies: [
        'vuetify'
    ],
    chainWebpack: config => {
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ /* options */ }]);
    },
    configureWebpack: {
        module: {
            exprContextCritical: false
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true
                        }
                    }
                }),
            ],
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: []
    },
    pluginOptions: {
        compression: {
            gzip: {
                filename: '[file].gz[query]',
                algorithm: 'gzip',
                include: /\.(js|css|html|svg|json)(\?.*)?$/i,
                minRatio: 0.8,
            }
        }
    }
}
