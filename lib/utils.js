export const clampToMaxSize = (image, maxSize) => {
  if (image.width > maxSize || image.height > maxSize) {
    const scale = maxSize / Math.max(image.width, image.height)
    const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
    canvas.width = Math.floor(image.width * scale)
    canvas.height = Math.floor(image.height * scale)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  return image
}