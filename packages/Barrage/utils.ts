export const loadingImage = (src): Promise<CanvasImageSource> => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      resolve(null)
    }
  })
};

export const createCanvas = (id: string, containerWidth: number, containerHeight: number): HTMLCanvasElement => {
  const element = window.document.createElement('canvas');
  element.id = id;
  element.style.position = 'absolute';
  element.style.display = 'block';
  element.width = containerWidth;
  element.height = containerHeight;

  return element;
};

export const getRandomColor = (): string => (
  'rgb(' + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ')'
);
