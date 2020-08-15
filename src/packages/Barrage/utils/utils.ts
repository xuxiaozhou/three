export const getRandomColor = (): string => {
  const arr = [
    parseInt(String(Math.random() * 255)),
    parseInt(String(Math.random() * 255)),
    parseInt(String(Math.random() * 255))
  ];
  return 'rgb(' + arr.join(',') + ')'  
};

export const mixConfig = (config, defaultConfig) => {
  Object.keys(defaultConfig).forEach(key => {
    if (typeof config[key] === 'undefined') {
      config[key] = defaultConfig[key];
    }
  });

  return config;
};

