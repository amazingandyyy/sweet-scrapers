var cheerio = require('cheerio');
var request = require('request');

var express = require('express')
var app = express()
var dictionary={};

var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post(`/init/amazingandyyy`, function (req, response) {
  request('https://www.skybound.com/the-walking-dead/walking-dead-show-characters/', (err, res, html) => {
    if (err || !res || !html) {
      reject()
    };
    let $ = cheerio.load(html);
    var imagesData = $('.attachment-blog-image.size-blog-image.wp-post-image');
    console.log('imagesData', imagesData)
    for (index in imagesData) {
      if (Number(index)) {
        var imageURL = imagesData[index].attribs.src;
        var name = imagesData[index].attribs.alt;
        dictionary[name] = imageURL;
        // console.log('dictionary', dictionary);
      }
    }
    var time = new Date();
    response.send({
      lastupdateTime: time.toString().split('T')[0],
      dictionary: dictionary
    });
  })
});

app.get('/all', function (req, response) {
  response.send(dictionary);
})

app.get('/:name', function (req, response) {
  var name = req.params.name;
  console.log('name', name);
  response.send({ name: dictionary[name] });
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
      "repo": "https://github.com/amazingandyyy/walking-dead-scraper"
    }
  });
})

app.listen(3000);
