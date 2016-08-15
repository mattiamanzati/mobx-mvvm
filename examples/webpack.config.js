module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader!ts-loader' }
        ]
    }
}