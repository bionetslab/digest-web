const TerserPlugin = require('terser-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all') // required for purgecss
const path = require('path') // re quired for purgecss
module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
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
        plugins: [new PurgecssPlugin({
            paths: glob.sync([
                path.join(__dirname, './public/index.html'),
                path.join(__dirname, './src/**/*.vue'),
                path.join(__dirname, './src/**/*.html')
            ])
        })]
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
