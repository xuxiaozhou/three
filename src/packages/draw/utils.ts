import {IPoint} from "./interface";

export const getPoint = (e): IPoint => {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    return {x, y};
  }

  return {
    x: e.clientX,
    y: e.clientY,
  }
};

export const loadImage = (src: string, callback: (image: HTMLImageElement | false) => void) => {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    callback(image);
  };
  image.onerror = () => {
    callback(false);
  }
};

export const createCanvas = (id: string, containerWidth: number, containerHeight: number): HTMLCanvasElement => {
  const element = window.document.createElement('canvas');
  element.id = id;
  element.width = containerWidth;
  element.height = containerHeight;

  return element;
};
