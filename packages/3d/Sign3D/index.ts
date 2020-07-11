interface IConfig {
  container: HTMLElement
}

class Index {
  constructor(config: IConfig) {
    const {container} = config;
    console.log(container);
  }
}

export default Index
