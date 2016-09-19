var fs = require('fs')
var express = require('express')

var speedTest = require('speedtest-net')

var test_results
try {
  test_results = require('./results.json')
} catch (err) {
  test_results = []
}

function testSpeed () {
  var test = speedTest({maxTime: 15000})
  console.log('Testing speed...')
  test.on('data', function (data) {
    console.log('Done.')
    data.date = new Date()
    test_results.push(data)

    fs.writeFile('./results.json', JSON.stringify(test_results), function (err) {
      if (err) { console.log(err) }
    })
  })

  test.on('error', function (err) {
    console.error(err)
  })
}

setInterval(testSpeed, 20 * 60 * 1000)
// TODO testSpeed()

var app = express()

app.get('/', function (req, res) {
  res.sendfile('index.html')
})

app.get('/js/d3.v4.min.js', function (req, res) {
  res.sendfile('js/d3.v4.min.js')
})

app.get('/results', function (req, res) {
  res.send(test_results)
})

app.listen(8000, function () {
  console.log('WebUI on port 8000!')
})
