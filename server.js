const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('tiny'));
process.title = 'fabaoliutong';

const nodeEnv = process.env.NODE_ENV;
const IP = nodeEnv === 'development' ? require('ip').address() : '127.0.0.1';

process.env.IP = IP;

if (nodeEnv === 'development') {
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.babel.js');
  const webpackCompiler = webpack(webpackConfig);

  app.post('/api/order', (req, res) => {
    res.status(200).json({ message: 'success' });
  });
  app.use(webpackMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true,
    },
  }));
  app.use(webpackHotMiddleware(webpackCompiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));
} else { // Production mode:
  // make the build directory accesible to the server
  app.use(express.static('build'));
  // catch all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });
}

const port = process.env.PORT || (nodeEnv !== 'development' && 3000) || 5000;

app.listen(port, () => console.log('\x1b[32m%s\x1b[0m', `listening: ${IP}:${port}...`));
