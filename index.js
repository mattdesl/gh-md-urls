var mdast = require('mdast')
var visit = require('mdast-util-visit')
var gh = require('github-url-to-object')
var URL = require('url')
var path = require('path')

module.exports = getMarkdownURLs
function getMarkdownURLs (md, opt) {
  opt = opt || {}
  var ast = mdast.parse(md, opt)
  
  var urls = []
  var definitions = {}
  
  visit(ast, function (node) {
    if (node.type === 'linkReference') {
      var identifier = node.identifier
      if (node.identifier) {
        var child = node.children && node.children[0]
        var text = child && child.value
        urls.push({ // these will get post-processed
          type: 'linkReference',
          identifier: identifier, 
          text: text 
        })
      }
    } else if (node.type === 'definition') {
      if (node.link && node.identifier) {
        definitions[node.identifier] = node.link
      }
    } else if (node.type === 'image') {
      urls.push(imageNode(node))
    } else if (node.type === 'link') {
      if (node.children[0].type === 'image') {
        urls.push({
          type: 'link', url: node.href,
          image: imageNode(node.children[0])
        })
      } else if (node.children[0].type === 'text') {
        urls.push({
          type: 'link', url: node.href, 
          text: node.children[0].value
        })
      }
    }
  })
  
  for (var i=0; i<urls.length; i++) {
    var ref = urls[i]
    if (ref.type === 'linkReference') {
      urls[i] = {
        url: definitions[ref.identifier],
        type: 'reference',
        text: ref.text,
        identifier: ref.identifier
      }
    }
  }  
  
  if (opt.repository) {
    var repo = gh(opt.repository)
    if (!repo) {
      throw new Error('invalid GitHub repository URL: ' + opt.repository)
    }
    var fragmentBase = typeof opt.baseUrl === 'string' ? opt.baseUrl : repo.https_url
    urls.forEach(function (node, i) {
      if (!node.url) return
      
      var parsed = URL.parse(node.url)
      // skip fully-qualified and protocol-relative URLs
      if (parsed.host || (parsed.path && parsed.path.match(/^\/\//))) {
        return
      }
      
      if (node.type === 'image') {
        node.url = 'https://raw.githubusercontent.com/' + path.join(
          repo.user,
          repo.repo,
          'master',
          parsed.href
        )
      } else if (node.type === 'link') {
        // skip #hash fragments
        if (!parsed.path) {
          node.url = fragmentBase + node.url
        } else {
          node.url = repo.https_url + path.join('/blob/master/', parsed.href)
        }
      }
    })
  }
  return urls
}

function imageNode (node) {
  return {
    type: 'image', url: node.src, alt: node.alt || ''
  }
}