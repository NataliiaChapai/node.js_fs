const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dirPath = path.join(__dirname, "/files");
const restriction = ['.log', '.txt', '.json', '.yaml', '.xml', '.js'];

function createFile (req, res, next) {
  
  const { filename, content, password } = req.body;

  if (!filename) {
    return res.status(400).send({"message": "Please specify 'filename' parameter"})
  }
  
  if (!content) {
    return res.status(400).send({"message": "Please specify 'content' parameter"})
  }

  if (password) {
    const filePath = path.join(__dirname, '.env');
    const content = `${filename.split('.').join('_')}_PASSWORD=${password}`
    fs.writeFileSync(filePath, `\n${content}`, {flag: 'a'});
  }

  const extension = path.extname(filename);
  if (!extension) {
    return res.status(400).send({"message": "Please write correct filename"})
  }
  
  if (!restriction.includes(extension)) {
    return res.status(400).send({"message": "Please write filename with one of these extension: 'log', 'txt', 'json', 'yaml', 'xml', 'js'"})
  }

  const filePath = path.join(dirPath, filename);

  fs.writeFileSync(filePath, JSON.stringify(content));
  res.status(200).send({ "message": "File created successfully" });
}

function getFiles (req, res, next) {

  const filenames = fs.readdirSync(dirPath);
  
  if (!filenames) {
    return res.status(400).send({"message": "Client error"})
  }

  res.status(200).send({
    "message": "Success",
    "files": filenames});
}

function getFile (req, res, next) {

  const { filename } = req.params;
  const { password } = req.query;
  const filePath = path.join(dirPath, filename);
  const name = `${filename.split('.').join('_')}_PASSWORD`
  const pass = process.env[name];

  if (!fs.existsSync(filePath)) {
    return res.status(400).send({"message": `No file with '${filename}' filename found`})
  }

  if (pass) {
    if (!password) {
      return res.status(400).send({"message": "This file is password protected. Please write the correct password"})
    }
    if (pass !== password) {
      return res.status(400).send({"message": "Invalid password"})
    }
  }
  
  const extension = path.extname(filename).slice(1);
  const content = fs.readFileSync(filePath, 'utf-8');
  const date = fs.statSync(filePath).birthtime;

  res.status(200).send({
    "message": "Success",
    "filename": filename,
    "content": JSON.parse(content),
    "extension": extension,
    "uploadedDate": date
  })
}

function removeFile (req, res, next) {
  const { filename } = req.params;
  const { password } = req.query;
  const filePath = path.join(dirPath, filename);
  const name = `${filename.split('.').join('_')}_PASSWORD`
  const pass = process.env[name];

  if (!fs.existsSync(filePath)) {
    return res.status(400).send({"message": `No file with ${filename} filename found`})
  }

  if (pass) {
    if (!password) {
      return res.status(400).send({"message": "This file is password protected. Please write the correct password"})
    }
    if (pass !== password) {
      return res.status(400).send({"message": "Invalid password"})
    }
  }

  fs.unlinkSync(filePath);

  res.status(200).send({
    "message": `File ${filename} was deleted`,
    });
}

function updateFile (req, res, next) {
  const { filename } = req.params;
  const { password } = req.query;
  const filePath = path.join(dirPath, filename);
  const { content } = req.body;
  const name = `${filename.split('.').join('_')}_PASSWORD`
  const pass = process.env[name];
  
  if (!fs.existsSync(filePath)) {
    return res.status(400).send({"message": `No file with ${filename} filename found`})
  }

  if (pass) {
    if (!password) {
      return res.status(400).send({"message": "This file is password protected. Please write the correct password"})
    }
    if (pass !== password) {
      return res.status(400).send({"message": "Invalid password"})
    }
  }
  
  if (!content) {
    return res.status(400).send({"message": "Please add new content"})
  }

  fs.writeFileSync(filePath, JSON.stringify(content));
  
  res.status(200).send({
    "message": "Success",
    "filename": filename,
    "newContent": content,
  })
}

module.exports = {
  createFile,
  getFiles,
  getFile, 
  removeFile,
  updateFile
}
