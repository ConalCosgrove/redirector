const express = require('express');
const { readFileSync, writeFileSync } = require('fs');

const server = express();


let keywords = {};
try {
  let raw = readFileSync('./keywords.json')
  keywords = JSON.parse(raw);
} catch(err) {

}


server.use(express.json())

server.get('/', (req, res) => {
  const query = req.query.keyword
  if (keywords[query]) {
    console.log(query)
    res.header('Location', keywords[query]).status(302).send("");
  } else {
    res.header('Location',req.url.split('?')[0]+ "notfound?" + req.url.split('?')[1]).status(302).send("")
  }
});

server.get('/createPage', (req, res) => {
  res.sendFile(__dirname + '/public/createPage.html')
});

server.get('/data', (req, res) => {
  res.sendFile(__dirname + '/keywords.json', {headers: {'Content-Type': 'application/json'}})
});

server.get('/list', (req, res) => {
  res.sendFile(__dirname + '/public/list.html')
});

server.get('/notfound', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

server.post('/add', (req,res) => {
  const json = req.body
  keywords[json.shortcut] = json.url
  updateKeywordsFile(keywords)
  res.status(201).send("")
});

function updateKeywordsFile(newMapping) {
  writeFileSync('keywords.json', JSON.stringify(newMapping))
}

server.listen('80', () => {

})

