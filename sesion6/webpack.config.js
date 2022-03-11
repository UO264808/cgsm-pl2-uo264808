module.exports = {
    mode: "production",
    entry: {
        "prac6-1": './src/prac6-1.js',
        "prac6-2": './src/prac6-2.js',
        "prac6-3": './src/prac6-3.js',
        "prac6-4": './src/prac6-4.js'
    },
    devServer: {
        static: {
            directory: __dirname
        },
        devMiddleware: {
            writeToDisk: true
        }
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000
    }
};