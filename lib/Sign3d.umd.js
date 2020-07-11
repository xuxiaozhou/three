(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Sign3d = factory());
}(this, (function () { 'use strict';

  class Sign3D {
      constructor(config) {
          const { container } = config;
          console.log(container);
      }
  }

  return Sign3D;

})));
