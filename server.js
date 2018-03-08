/* for staging build */
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('tiny'));
process.title = 'corl_fe';

// make the build directory accesible to the server
const dir = loc => (path.join(__dirname, loc));
app.use(express.static('./'));
// catch all routes
app.get('*', (req, res) => res.sendFile(dir('index.html')));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening port: ${port}...`));
