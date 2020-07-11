export const getRandomColor = (): string => (
  'rgb(' + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ','
  + parseInt(String(Math.random() * 255)) + ')'
);

export const mixConfig = (config, defaultConfig) => {
  Object.keys(defaultConfig).forEach(key => {
    if (typeof config[key] === 'undefined') {
      config[key] = defaultConfig[key];
    }
  });

  return config;
};

