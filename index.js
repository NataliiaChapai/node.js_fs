const fs = require('fs');
const express = require('express');
const morgan = require('morgan')
const app = express();

const { filesRouter } = require('./filesRouter.js');

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/files', filesRouter);

const start = async () => {
  try {
    if (!fs.existsSync('files')) {
      fs.mkdirSync('files');
    }
    app.listen(8080);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
}

start();

app.use(errorHandler)

function errorHandler (err, req, res, next) {
  console.error('error')
  res.status(500).send({'message': 'Server error'});
}
