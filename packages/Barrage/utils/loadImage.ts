const cacheImages: { [x: string]: CanvasImageSource } = {};

export default function loadImage(src: string, onload: (img: CanvasImageSource) => void, onError?: () => void) {
  if (cacheImages[src]) {
    onload(cacheImages[src]);
    return
  }

  const image = new Image();
  image.crossOrigin = '';
  image.src = src;
  image.onload = () => {
    cacheImages[src] = image;
    onload(cacheImages[src]);
  };
  image.onerror = onError || function () {
  };
};
