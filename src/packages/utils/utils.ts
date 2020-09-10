export function createId(pre: string = '') {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  function guid() {
    return S4() + S4()
  }

  return pre + guid()
}

export const createCanvas = (id: string, containerWidth: number, containerHeight: number): HTMLCanvasElement => {
  const element = window.document.createElement('canvas');
  element.id = id;
  element.width = containerWidth;
  element.height = containerHeight;

  return element;
};

export const randomColor = () => (
  'rgb(' + parseInt(String(Math.random() * 255)) + ',' + parseInt(String(Math.random() * 255)) + ',' + parseInt(String(Math.random() * 255)) + ')'
);

export const mixConfig = (config = {}, defaultConfig = {}) => {
  Object.keys(defaultConfig).forEach(key => {
    if (typeof config[key] === 'undefined') {
      config[key] = defaultConfig[key];
    }
  });

  return config;
};
