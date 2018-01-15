const path = require('path');
const express = require('express');
const morgan = require('morgan');
const apiModel = require('./build/api/model');
const bodyParser = require('body-parser');


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

  app.use(bodyParser.json());

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

  app.post('/api/order', (req, res) => {
    apiModel.getAllOrders()
      .then(orders => res.status(200).json({ orders }))
      .catch(error => res.status(500).json({ error }));
  });
  app.post('/api/table', (req, res) => {
    apiModel.getTableData(req.headers.table)
      .then(data => res.status(200).json({ data }))
      .catch(error => res.status(500).json({ error }));
  });
  app.post('/api/add', (req, res) => {
    apiModel.addEntry(req.headers.table, req.body, !!req.headers.multiple)
      .then(result => res.status(200).json({ result }))
      .catch(error => res.status(500).json({ error }));
  });
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
