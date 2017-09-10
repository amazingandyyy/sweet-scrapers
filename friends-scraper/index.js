var cheerio = require('cheerio');
var request = require('request');
var express = require('express')
var app = express();

var dictionary = {};

var bodyParser = require('body-parser')
const IBMDURI = 'http://www.imdb.com/';
app.use(bodyParser.json())

app.post(`/init/amazingandyyy`, function (req, response) {
  request('http://www.imdb.com/title/tt0108778/fullcredits/', (err, res, html) => {
    if (err || !res || !html) {
      reject()
    };
    let NUMBER = 40;
    let count = 0;
    let $ = cheerio.load(html);
    var imagesData = $('td.itemprop');
    for (index in imagesData) {
      var IndexNumber = Number(index);
      if (IndexNumber <= NUMBER) {
        var person = imagesData[index];
        var child = $(person).find('a')['0'];
        console.log('scrapping//' + IndexNumber + ': ', IBMDURI + child.attribs.href + ' ...');
        request(IBMDURI + child.attribs.href, (err, res, html) => {
          let $ = cheerio.load(html);
          // console.log($('#name-poster')['0'].attribs)
          if($('#name-poster')['0'] && $('#name-poster')['0'].attribs){
            var source = $('#name-poster')['0'].attribs.src;
            var name = $('#name-poster')['0']
              .attribs
              .alt
              .replace(' Picture', '');
            dictionary[name] = source;
            count++;
            if(count >= NUMBER){
              console.log('dictionary', dictionary);
              response.send(dictionary)
            }
          }else{
            console.log('skipped');
          }
        })
      }
    }
  })
});

app.get('/all', function (req, response) {
  response.send(dictionary);
})

app.get('/:name', function (req, response) {
  var name = req.params.name;
  console.log('name', name);
  response.send({name: dictionary[name]});
})

app.get('/', function (req, response) {
  response.send({
    "usage1": "GET Request to /all to get a list of images",
    "usage2": "GET Request to /{name} to get certain charater's image",
    "info": {
      "author": "amazingandyyy",
      "license": "MIT",
      "contact": "www.amazingandyyy.com",
      "usage": "POST Request to /init/{token} to init the database",
      "version": "0.0.2",
      "repo": "https://github.com/amazingandyyy/friends-scraper"
    }
  });
})

app.listen(3000);