interface IMsg {
  data?: any,
  topic?: string | number,
  id?: string
}

interface IRes {
  data?: object,
  code?: number,
  msg?: string,
  topic?: string
}

class Ws {
  private connected: boolean = false;

  private msgCache: IMsg[] = []

  private ws: WebSocket;

  private callback: (topic: string, data?: any) => void

  private timeout: number = 5000

  private timeoutObj: number | null = null

  private serverTimeoutObj: number | null = null

  private path: string

  private events: object = {}

  public constructor(config) {
    const { path, callback } = config
    this.callback = callback
    this.path = path
    this.initWs()
  }

  private initWs() {
    this.ws = new window.WebSocket(this.path)
    this.ws.onopen = this.onopen.bind(this)
    this.ws.onmessage = this.onmessage.bind(this)
    this.ws.onclose = this.onclose.bind(this)
    this.ws.onerror = this.onerror.bind(this)
  }

  public send(message: IMsg) {
    if (this.connected) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.msgCache.push(message)
    }
  }

  public on(topic, callback) {
    if (typeof callback !== 'function') {
      return null
    }
    if (!this.events[topic]) {
      this.events[topic] = {}
    }
    const socketId = new Date().getTime() + Math.random()
    this.events[topic][socketId] = callback
    return socketId
  }

  public off(topic, socketId): boolean {
    if (this.events && this.events[topic]) {
      delete this.events[topic][socketId]
      return true
    }
    return false
  }

  public request(data: object, topic: string) {
    return new Promise((resolve, reject) => {
      try {
        const messageId = topic + '_' + (new Date().getTime())
        const message = { data, topic, id: messageId }
        this.on(messageId, ({ data, code }) => {
          if (code !== 0) {
            reject()
          } else {
            resolve(data)
            delete this.events[messageId]
          }
        })
        this.send(message)
      } catch (e) {
        reject(e)
      }
    })
  }

  private sendMessageFromCache() {
    if (this.msgCache.length > 0) {
      const msg = this.msgCache.shift()
      this.send(msg)
      this.sendMessageFromCache()
    }
  }

  private onopen() {
    this.connected = true
    this.callback('onopen')
    this.sendMessageFromCache()
    this.startHeartCheck()
  }

  private startHeartCheck() {
    this.timeoutObj = setTimeout(() => {
      this.ws.send('HeartBeat')
      this.serverTimeoutObj = setTimeout(() => {
        this.onclose()
      }, this.timeout);
    }, this.timeout);
  }

  private resetHeartCheck() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    this.startHeartCheck()
  }

  private dispacth({ topic, data }: IRes) {
    if (this.events[topic]) {
      Object.keys(this.events[topic]).forEach(listenKey => {
        try {
          this.events[topic][listenKey](data)
        } catch (e) {
          console.log(e)
        }
      })
    }
    this.callback(topic, data)
  }

  private onmessage({ data }) {
    const message = JSON.parse(data) as IRes
    if (message.topic !== 'HeartBeatSuccess') {
      this.dispacth(message)
    }
    this.resetHeartCheck()
  }

  private onclose() {
    this.connected = false
    setTimeout(() => {
      this.initWs()
    }, 2000);
    this.callback('close')
  }

  private onerror() {
    this.callback('error')
  }

}

export default Ws
