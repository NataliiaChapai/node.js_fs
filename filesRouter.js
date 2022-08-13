const express = require('express');
const router = express.Router();
const { createFile, getFiles, getFile, removeFile, updateFile } = require('./filesService.js');

router.post('/', createFile);

router.get('/', getFiles);

router.get('/:filename', getFile);

router.delete('/:filename', removeFile);

router.patch('/:filename', updateFile);

module.exports = {
  filesRouter: router
};
