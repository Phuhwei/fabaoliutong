"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var apiModel = require("./model");
var app = express();
app.use(morgan('tiny'));
process.title = 'fabaoliutong';
var nodeEnv = process.env.NODE_ENV;
var IP = nodeEnv === 'development' ? require('ip').address() : '127.0.0.1';
process.env.IP = IP;
if (nodeEnv === 'development') {
    var webpackMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var webpackConfig = require('../webpack.config.babel.js');
    var webpackCompiler = webpack(webpackConfig);
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
}
else {
    app.use(express.static('./'));
    app.get('*', function (_req, res) { return res.sendFile(path.join(__dirname, '../index.html')); });
}
app.post('/api/order', function (_req, res) {
    apiModel.getAllOrders()
        .then(function (orders) { return res.status(200).json({ orders: orders }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
});
app.post('/api/table', function (req, res) {
    apiModel.getTableData(req.headers.table)
        .then(function (data) { return res.status(200).json({ data: data }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
});
app.post('/api/add', function (req, res) {
    apiModel.addEntry(req.headers.table, req.body, !!req.headers.multiple)
        .then(function (result) { return res.status(200).json({ result: result }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
});
app.post('/api/update', function (req, res) {
    apiModel.updateEntry(req.headers.table, req.body)
        .then(function (result) { return res.status(200).json({ result: result }); })
        .catch(function (error) { return res.status(500).json({ error: error }); });
});
var port = process.env.PORT || (nodeEnv !== 'development' && 3000) || 5000;
app.listen(port, function () { return console.log('\x1b[32m%s\x1b[0m', "listening: " + IP + ":" + port + "..."); });
