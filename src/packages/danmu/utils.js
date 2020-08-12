'use strict'
const url = require('url')
const path = require('path')

class ImageCache {
  constructor () {
    this.cache = []
    this.regex = null
  }

  async test (callback, text) {
    if (!this.regex) return
    // Initialize here
    let ret = null
    this.regex.lastIndex = 0
    // Analyze text
    while ((ret = this.regex.exec(text)) !== null) {
      let src = ret[2]
      let imageWidth = ret[1]
      let imageObject = this.getImage(src)
      if (imageObject === null) {
        imageObject = await this.buildCache(src, imageWidth, imageWidth === 'HEIGHT')
      }
      callback(ret, imageObject)

    }
    this.regex.lastIndex = 0
  }

  getImage (src) {
    return this.cache[src] || null
  }

  buildCache (src, width, round = false) {
    return new Promise(res => {

      let parsedUrl = url.parse(src)
      let image = window.document.createElement('img')
      image.src = parsedUrl.protocol ? src : path.resolve('./', './' + src)
      image.onerror = function () {
        window.console.error('Cannot load ' + src)
      }
      image.onload = () => {
        if (round === true) {
          let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
          canvas.width = 200
          canvas.height = 200
          let context = canvas.getContext('2d')

          context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.width)
          let pattern = context.createPattern(canvas, 'no-repeat')
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.arc(canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2, 0, 2 * Math.PI)
          context.fillStyle = pattern
          context.fill()
          image = canvas
        }

        this.cache[src] = {
          error: false,
          element: image,
          width: width,
          height: Math.min(width * 2, image.height * width / image.width)
        }
        res(this.cache[src])
      }
    })

  }
}

let images = new ImageCache()

function tryCatch (fn, fnCatch) {
  try {
    fn()
  } catch (e) {
    fnCatch(e)
  }
}

module.exports = {
  imageAnalyzer: images,
  tryCatch
}
