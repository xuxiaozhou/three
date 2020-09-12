type eventFunction = (message: any) => void

class Ws {
  private readonly successFn: () => void;
  private readonly path: string;
  private events: { [x: string]: Array<eventFunction> } = {};
  private messageCache = [];
  private connected: boolean = false;
  private ws: WebSocket;

  public constructor(path: string, successFn: () => void, errorFn: (e: any) => void) {
    this.successFn = successFn;
    this.path = path;
    this.init(errorFn)
  }

  private init = (errorFn) => {
    this.ws = new WebSocket(this.path);
    this.ws.onopen = () => {
      this.connected = true;
      this.sendMessageCache();
      if (this.successFn) {
        this.successFn()
      }
    };
    this.ws.onmessage = ({data}) => {
      const message = JSON.parse(data);
      this.dispatch('message', message);
      this.dispatch(message.topic, message)
    };
    this.ws.onclose = () => {
      this.connected = false;
      setTimeout(this.init, 5000)
    };
    this.ws.onerror = (e) => {
      errorFn(e)
    }
  };

  dispatch(topic, message) {
    const eventsArray = this.events[topic];
    if (eventsArray) {
      eventsArray.forEach(fn => {
        fn(message)
      })
    }
  }

  sendMessageCache = () => {
    if (this.messageCache.length > 0) {
      const message = this.messageCache.shift();
      this.sendMessage(message);
      this.sendMessageCache()
    }
  };

  sendMessage(message) {
    if (this.connected) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageCache.push(message)
    }
  }

  send = (topic, data) => {
    const message = {topic, data};
    this.sendMessage(message)
  };

  on = (name: string, fn) => {
    if (typeof fn === 'function') {
      if (!this.events[name]) {
        this.events[name] = []
      }
      this.events[name].push(fn)
    }
  };

  off = (name, fn) => {
    const eventsArray = this.events[name];
    if (eventsArray) {
      eventsArray.forEach(eventFn => {
        if (eventFn === fn) {
          eventsArray.splice(eventsArray.indexOf(eventFn), 1)
        }
      })
    }
  }
}

export default Ws
