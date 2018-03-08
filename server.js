/* for staging build */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const apiModel = require('./api/model');


const app = express();
app.use(morgan('tiny'));
process.title = 'corl_fe';

// make the build directory accesible to the server
const dir = loc => (path.join(__dirname, loc));
app.use(express.static('./'));
// catch all routes
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
app.get('*', (req, res) => res.sendFile(dir('index.html')));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening port: ${port}...`));
