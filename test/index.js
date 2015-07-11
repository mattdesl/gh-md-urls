var getUrls = require('../')
var test = require('tape')
var fs = require('fs')
var path = require('path')

test('resolves link URL', function(t) {
  var str = '[text](some/path.md)'
  
  t.throws(function () {
    getUrls(str, { repository: 'https://gitgghub.com/mattdesl/gh-md-urls' })
  }, 'throws error on invalid repository')
  
  var result = getUrls(str, { repository: 'https://github.com/mattdesl/gh-md-urls' })
  t.deepEqual(result, [{
    text: 'text',
    type: 'link',
    url: 'https://github.com/mattdesl/gh-md-urls/blob/master/some/path.md'
  }], 'resolves to blob url')
  t.end()
})

test('returns all URLs in a markdown file', function(t) {
  var str = fs.readFileSync(path.join(__dirname, 'minimal.md'), 'utf8')  
  var result = getUrls(str, {
    repository: 'https://github.com/mattdesl/gh-md-urls',
    baseUrl: 'https://github.com/npm/marky-markdown/docs'
  })
  t.deepEqual(result, [ { type: 'image',
    url: 'https://raw.githubusercontent.com/mattdesl/gh-md-urls/master/images/image.png',
    alt: 'image' },
  { type: 'link', url: 'http://google.com', text: 'google' },
  { type: 'link',
    url: 'https://github.com/npm/marky-markdown/docs#relative',
    text: 'section' } ])
  
  result = getUrls(str, {
    repository: 'https://github.com/mattdesl/gh-md-urls',
    baseUrl: ''
  })
  t.deepEqual(result, [ { type: 'image',
    url: 'https://raw.githubusercontent.com/mattdesl/gh-md-urls/master/images/image.png',
    alt: 'image' },
  { type: 'link', url: 'http://google.com', text: 'google' },
  { type: 'link',
    url: '#relative',
    text: 'section' } ], 'handles baseUrl correctly')
  t.end()
})

test('returns all URLs in a markdown file', function(t) {
  var str = fs.readFileSync(path.join(__dirname, 'many.md'), 'utf8')  
  var result = getUrls(str)
  t.deepEqual(result, require('./expected.js'))
  t.end()
})
