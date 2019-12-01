import _ from 'lodash'

/**
 * 压缩图片
 * @param image
 * @param maxSize
 * @param round
 */
export const clampToMaxSize = (image, maxSize, round = false) => {
  if (image.width > maxSize || image.height > maxSize) {
    const scale = maxSize / Math.max(image.width, image.height)
    const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
    canvas.width = Math.floor(image.width * scale)
    canvas.height = Math.floor(image.height * scale)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
    if (round) {
      const pattern = context.createPattern(canvas, 'no-repeat')
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.arc(canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2, 0, 2 * Math.PI)
      context.fillStyle = pattern
      context.fill()
    }
    return canvas
  }
  return image
}

export const defaultImageManager = {
  cache (url) {
    return url
  }
}

export const turnSelect = (uInfo, options) => {
  let image = false
  let out = ''
  if (!options)
    return ''

  let sexTurn = function (v) {
    if (v === 1)
      return '男'
    if (v === 2)
      return '女'

    return '未知'
  }

  for (let item of options) {
    // 文本
    if (item.type === 'text') {
      out += item.value
    }
    // 变量
    if (item.type === 'variate') {
      let value = _.get(uInfo, item.key)
      if (item.key === 'sex') {
        value = sexTurn(value)
      }
      if (item.key === 'avatar') {
        !image && (image = value)
        value = ''
      }
      if (typeof value === 'undefined') value = ''
      out += value
    }
  }
  return {
    text: out || '未公开昵称',
    image
  }
}