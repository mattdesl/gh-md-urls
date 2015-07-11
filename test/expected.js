module.exports = [{
  alt: 'image',
  type: 'image',
  url: 'some/relative/image.png'
}, {
  alt: 'image-abs',
  type: 'image',
  url: 'http://www.google.com/favicon.ico'
}, {
  text: 'link',
  type: 'link',
  url: 'http://www.google.com/'
}, {
  text: 'relative',
  type: 'link',
  url: './many.md'
}, {
  identifier: '1',
  text: 'link to something',
  type: 'reference',
  url: 'http://reddit.com/'
}, {
  text: 'http://www.google.com/',
  type: 'link',
  url: 'http://www.google.com/'
}, {
  image: {
    alt: 'image-link',
    type: 'image',
    url: 'http://www.google.com/favicon.ico'
  },
  type: 'link',
  url: 'http://google.com/'
}, {
  alt: 'image-link',
  type: 'image',
  url: 'http://www.google.com/favicon.ico'
}, {
  identifier: 'test',
  text: '1',
  type: 'reference',
  url: 'http://npmjs.com/'
}, {
  identifier: '1',
  text: 'another link to same',
  type: 'reference',
  url: 'http://reddit.com/'
}, {
  text: 'fragment',
  type: 'link',
  url: '#fragment'
}]