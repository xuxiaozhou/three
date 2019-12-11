(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('store'), require('fs-extra'), require('path'), require('electron'), require('request')) :
  typeof define === 'function' && define.amd ? define(['store', 'fs-extra', 'path', 'electron', 'request'], factory) :
  (global = global || self, global.imageManage = factory(global.store, global.fs, global.path, global.electron, global.request));
}(this, (function (store, fs, path, electron, request) { 'use strict';

  store = store && store.hasOwnProperty('default') ? store['default'] : store;
  fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;
  path = path && path.hasOwnProperty('default') ? path['default'] : path;
  electron = electron && electron.hasOwnProperty('default') ? electron['default'] : electron;
  request = request && request.hasOwnProperty('default') ? request['default'] : request;

  var ImageManager = /** @class */ (function () {
      function ImageManager() {
          this.saveing = {};
          this.userDataPath = path.join(electron.app.getPath('userData'));
      }
      ImageManager.prototype.cache = function (imgUrl) {
          var _this = this;
          var localImg = this.store(imgUrl);
          if (localImg) {
              var urlPath = this.getPath(localImg);
              if (this.isFilePath(urlPath)) {
                  return urlPath;
              }
              else {
                  this.removeStore(this.getFullField(imgUrl));
              }
          }
          this.down(imgUrl).then(function (url) {
              _this.store(_this.getFullField(imgUrl), url);
          });
          return imgUrl;
      };
      ImageManager.prototype.base64 = function (base64) {
          var _this = this;
          return new Promise(function (resolve, reject) {
              var date = new Date();
              var dir = "img/" + date.getFullYear() + "-" + (date.getMonth() + 1);
              var filename = new Date().getTime() + Math.random().toString(36).slice(2) + ".png";
              try {
                  fs.mkdirsSync(path.join(_this.userDataPath, dir));
                  fs.writeFileSync(path.join(_this.userDataPath, dir, filename), base64, 'base64');
                  resolve(dir + '/' + filename);
              }
              catch (e) {
                  reject(new Error('保存失败'));
              }
          });
      };
      ImageManager.prototype.down = function (imgUrl) {
          var _this = this;
          return new Promise(function (resolve) {
              try {
                  if (_this.saveing[imgUrl]) {
                      // 正在存储
                      resolve(imgUrl);
                      return;
                  }
                  _this.saveing[imgUrl] = true;
                  request({
                      url: imgUrl,
                      encoding: 'base64'
                  }, function (err, res, body) {
                      if (!!err || res.statusCode !== 200) {
                          resolve(imgUrl);
                          return;
                      }
                      _this.base64(body).then(function (filename) {
                          delete _this.saveing[imgUrl];
                          resolve(filename);
                      }).catch(function () {
                          resolve(imgUrl);
                      });
                  });
              }
              catch (e) {
                  resolve(imgUrl);
              }
          });
      };
      ImageManager.prototype.isFilePath = function (urlPath) {
          return urlPath.match(/^file/);
      };
      ImageManager.prototype.getFullField = function (field) {
          return "ImgLocal_" + field;
      };
      ImageManager.prototype.store = function (field, value) {
          if (value === void 0) { value = undefined; }
          var fullField = this.getFullField(field);
          if (value !== undefined) {
              store.set(fullField, value);
          }
          else {
              return store.get(fullField);
          }
      };
      ImageManager.prototype.removeStore = function (field) {
          store.remove(this.getFullField(field));
      };
      Object.defineProperty(ImageManager.prototype, "isMac", {
          get: function () {
              // @ts-ignore
              return process.platform !== 'darwin';
          },
          enumerable: true,
          configurable: true
      });
      ImageManager.prototype.getPath = function (imgpath) {
          if (imgpath.match(/^http/)) {
              return imgpath;
          }
          var repath = path.join(this.userDataPath, imgpath);
          if (fs.existsSync(repath)) {
              if (this.isMac) {
                  repath = repath.replace(/\//g, '\\');
              }
              return 'file://' + repath;
          }
          else {
              return imgpath;
          }
      };
      return ImageManager;
  }());
  var index = new ImageManager();

  return index;

})));
