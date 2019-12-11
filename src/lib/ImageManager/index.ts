import store from 'store'  
import fs from 'fs-extra'
import path from 'path'
import electron from 'electron'
import request from 'request'

class ImageManager {
  userDataPath: any
  saveing: object = {}

  public constructor() {
    this.userDataPath = path.join(electron.app.getPath('userData'))
  }

  public cache(imgUrl: string) {
    const localImg = this.store(imgUrl)
    if (localImg) {
      const urlPath = this.getPath(localImg)
      if (this.isFilePath(urlPath)) {
        return urlPath
      } else {
        this.removeStore(this.getFullField(imgUrl))
      }
    }
    this.down(imgUrl).then(url => {
      this.store(this.getFullField(imgUrl), url)
    })
    return imgUrl
  }

  private base64(base64) {
    return new Promise((resolve, reject) => {
      let date = new Date()
      let dir = `img/${date.getFullYear()}-${date.getMonth() + 1}`
      let filename = `${new Date().getTime() + Math.random().toString(36).slice(2)}.png`
      try {
        fs.mkdirsSync(path.join(this.userDataPath, dir))
        fs.writeFileSync(path.join(this.userDataPath, dir, filename), base64, 'base64')
        resolve(dir + '/' + filename)
      } catch (e) {
        reject(new Error('保存失败'))
      }
    })
  }

  private down(imgUrl: string) {
    return new Promise(resolve => {
      try {
        if (this.saveing[imgUrl]) {
          // 正在存储
          resolve(imgUrl)
          return
        }

        this.saveing[imgUrl] = true
        request({
          url: imgUrl,
          encoding: 'base64'
        }, (err, res, body) => {
          if (!!err || res.statusCode !== 200) {
            resolve(imgUrl)
            return
          }
          this.base64(body).then(filename => {
            delete this.saveing[imgUrl]
            resolve(filename)
          }).catch(() => {
            resolve(imgUrl)
          })
        })
      } catch (e) {
        resolve(imgUrl)
      }
    })
  }

  private isFilePath(urlPath: string) {
    return urlPath.match(/^file/)
  }

  private getFullField(field: string) {
    return `ImgLocal_${field}`
  }

  private store(field: string, value: any = undefined) {
    const fullField = this.getFullField(field)
    if (value !== undefined) {
      store.set(fullField, value)
    } else {
      return store.get(fullField)
    }
  }

  private removeStore(field: string) {
    store.remove(this.getFullField(field))
  }

  private get isMac() {
    // @ts-ignore
    return process.platform !== 'darwin'
  }

  private getPath(imgpath) {
    if (imgpath.match(/^http/)) {
      return imgpath
    }
    let repath = path.join(this.userDataPath, imgpath)
    if (fs.existsSync(repath)) {
      if (this.isMac) {
        repath = repath.replace(/\//g, '\\')
      }

      return 'file://' + repath
    } else {
      return imgpath
    }
  }
}


export default new ImageManager()