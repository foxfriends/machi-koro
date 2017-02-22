'use strict';
module.exports = [
  {
    entry: './src/client/index.js',
    output: {
      path: './public_html',
      filename: 'machi-koro.js'
    },
    module: {
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
        { test: /\.s(a|c)ss$/, exclude: /node_modules.*\.js/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' },
        { test: /\.(gif|svg|png|jpe?g)$/, loader: 'file-loader?name=images/[hash].[ext]!img-loader' }
      ]
    }
  },
  {
    entry: './src/server/index.js',
    output: {
      path: './',
      filename: 'server.js'
    },
    target: 'node',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' }
      ]
    },
    externals: {
      // NOTE: this looks kind of wrong. maybe there's a real way to do it.. hm?
      'express': `require('express')`,
      'socket.io': `require('socket.io')`
    }
  }
]
