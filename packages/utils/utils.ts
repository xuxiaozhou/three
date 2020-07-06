export function createId(pre: string = '') {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  function guid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  }

  return pre + guid()
}

export function wait(time: number = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const createCanvas = (id: string, containerWidth: number, containerHeight: number): HTMLCanvasElement => {
  const element = window.document.createElement('canvas');
  element.id = id;
  element.width = containerWidth;
  element.height = containerHeight;

  return element;
};
