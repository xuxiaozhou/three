const cacheImages: { [x: string]: CanvasImageSource } = {};

export default function loadImage(src: string, needCache = true): Promise<CanvasImageSource> {
  return new Promise((resolve, reject) => {
    if (cacheImages[src] && needCache) {
      resolve(cacheImages[src]);
      return
    }

    const image = new Image();
    image.crossOrigin = '';
    image.src = src;
    image.onload = () => {
      if (needCache) {
        cacheImages[src] = image;
      }
      resolve(cacheImages[src]);
    };
    image.onerror = (e) => {
      reject(e)
    };
  })
};
