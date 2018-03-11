import path = require('path');
import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import apiModel = require('./model');

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
  const webpackConfig = require('../webpack.config.babel.js');
  const webpackCompiler = webpack(webpackConfig);

  app.use(bodyParser.json());

  app.use(webpackMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      'colors': true,
      'chunks': false,
      'errors-only': true,
    },
  }));
  app.use(webpackHotMiddleware(webpackCompiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));
  // app.get('*', (_req: any, res: any) => res.sendFile(path.join(__dirname, '../build/index.html')));

} else { // Production mode:
  // make the build directory accesible to the server
  app.use(express.static('./'));
  // catch all routes
  app.get('*', (_req: any, res: any) => res.sendFile(path.join(__dirname, '../index.html')));
}
app.post('/api/order', (_req: any, res: any) => {
  apiModel.getAllOrders()
    .then((orders: any) => res.status(200).json({ orders }))
    .catch((error: any) => res.status(500).json({ error }));
});
app.post('/api/table', (req: any, res: any) => {
  apiModel.getTableData(req.headers.table)
    .then((data: any) => res.status(200).json({ data }))
    .catch((error: any) => res.status(500).json({ error }));
});
app.post('/api/add', (req: any, res: any) => {
  apiModel.addEntry(req.headers.table, req.body, !!req.headers.multiple)
    .then((result: any) => res.status(200).json({ result }))
    .catch((error: any) => res.status(500).json({ error }));
});

const port = process.env.PORT || (nodeEnv !== 'development' && 3000) || 5000;

// tslint:disable-next-line:no-console
app.listen(port, () => console.log('\x1b[32m%s\x1b[0m', `listening: ${IP}:${port}...`));
