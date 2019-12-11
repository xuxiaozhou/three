'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var TWEEN = _interopDefault(require('@tweenjs/tween.js'));
var THREE = require('three');
var THREE__default = _interopDefault(THREE);
var _ = require('lodash');
var ___default = _interopDefault(_);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var postprocessing = createCommonjsModule(function (module, exports) {
/**
 * postprocessing v2.3.1 build Aug 18 2017
 * https://github.com/vanruesc/postprocessing
 * Copyright 2017 Raoul van Rüschen, Zlib
 */

!function(e,t){t(exports,THREE__default);}(commonjsGlobal,function(e,t){function r(e,t){return e+Math.floor(Math.random()*(t-e+1))}function n(e,t){return e+Math.random()*(t-e)}function i(e,t,r){return Math.max(t,Math.min(r,e))}function a(e){return Math.pow(2,Math.max(0,Math.ceil(Math.log2(e))))}var o="uniform sampler2D tPreviousLum;\r\nuniform sampler2D tCurrentLum;\r\nuniform float minLuminance;\r\nuniform float delta;\r\nuniform float tau;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tfloat previousLum = texture2D(tPreviousLum, vUv, MIP_LEVEL_1X1).r;\r\n\tfloat currentLum = texture2D(tCurrentLum, vUv, MIP_LEVEL_1X1).r;\r\n\r\n\tpreviousLum = max(minLuminance, previousLum);\r\n\tcurrentLum = max(minLuminance, currentLum);\r\n\r\n\t// Adapt the luminance using Pattanaik's technique.\r\n\tfloat adaptedLum = previousLum + (currentLum - previousLum) * (1.0 - exp(-delta * tau));\r\n\r\n\tgl_FragColor.r = adaptedLum;\r\n\r\n}\r\n",s="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",l=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},c=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),f=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t);},u=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !t||"object"!=typeof t&&"function"!=typeof t?e:t},d=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"AdaptiveLuminosityMaterial",defines:{MIP_LEVEL_1X1:"0.0"},uniforms:{tPreviousLum:new t.Uniform(null),tCurrentLum:new t.Uniform(null),minLuminance:new t.Uniform(.01),delta:new t.Uniform(0),tau:new t.Uniform(1)},fragmentShader:o,vertexShader:s,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),v="uniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\n\r\nuniform float focus;\r\nuniform float aspect;\r\nuniform float aperture;\r\nuniform float maxBlur;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifndef USE_LOGDEPTHBUF\r\n\r\n\t#include <packing>\r\n\r\n\tuniform float cameraNear;\r\n\tuniform float cameraFar;\r\n\r\n\tfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n\r\n\t\tfloat fragCoordZ = texture2D(depthSampler, coord).x;\r\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n\r\n\t\treturn viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\nvoid main() {\r\n\r\n\tvec2 aspectCorrection = vec2(1.0, aspect);\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tfloat depth = texture2D(tDepth, vUv).x;\r\n\r\n\t#else\r\n\r\n\t\tfloat depth = readDepth(tDepth, vUv);\r\n\r\n\t#endif\r\n\r\n\tfloat factor = depth - focus;\r\n\r\n\tvec2 dofBlur = vec2(clamp(factor * aperture, -maxBlur, maxBlur));\r\n\r\n\tvec2 dofblur9 = dofBlur * 0.9;\r\n\tvec2 dofblur7 = dofBlur * 0.7;\r\n\tvec2 dofblur4 = dofBlur * 0.4;\r\n\r\n\tvec4 color = vec4(0.0);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15,  0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37,  0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37, -0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15,  0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37,  0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15, -0.37) * aspectCorrection) * dofBlur);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15,  0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37,  0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37, -0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15,  0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37,  0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15, -0.37) * aspectCorrection) * dofblur9);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur7);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.4,   0.0 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur4);\r\n\r\n\tgl_FragColor = color / 41.0;\r\n\r\n}\r\n",h="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",m=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(this,r),void 0===n.focus&&(n.focus=1),void 0===n.aperture&&(n.aperture=.025),void 0===n.maxBlur&&(n.maxBlur=1);var i=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"BokehMaterial",uniforms:{cameraNear:new t.Uniform(.1),cameraFar:new t.Uniform(2e3),aspect:new t.Uniform(1),tDiffuse:new t.Uniform(null),tDepth:new t.Uniform(null),focus:new t.Uniform(n.focus),aperture:new t.Uniform(n.aperture),maxBlur:new t.Uniform(n.maxBlur)},fragmentShader:v,vertexShader:h,depthWrite:!1,depthTest:!1}));return null!==e&&i.adoptCameraSettings(e),i}return f(r,e),c(r,[{key:"adoptCameraSettings",value:function(e){this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,this.uniforms.aspect.value=e.aspect;}}]),r}(t.ShaderMaterial),p="uniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\n\r\nuniform vec2 texelSize;\r\nuniform vec2 halfTexelSize;\r\n\r\nuniform float cameraNear;\r\nuniform float cameraFar;\r\n\r\nuniform float focalLength;\r\nuniform float focalStop;\r\n\r\nuniform float maxBlur;\r\nuniform vec3 luminanceCoefficients;\r\nuniform float luminanceThreshold;\r\nuniform float luminanceGain;\r\nuniform float bias;\r\nuniform float fringe;\r\nuniform float ditherStrength;\r\n\r\n#ifdef SHADER_FOCUS\r\n\r\n\tuniform vec2 focusCoords;\r\n\r\n#else\r\n\r\n\tuniform float focalDepth;\r\n\r\n#endif\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifndef USE_LOGDEPTHBUF\r\n\r\n\t#include <packing>\r\n\r\n\tfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n\r\n\t\tfloat fragCoordZ = texture2D(depthSampler, coord).x;\r\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n\r\n\t\treturn viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef PENTAGON\r\n\r\n\tfloat penta(vec2 coords) {\r\n\r\n\t\tconst vec4 HS0 = vec4( 1.0,          0.0,         0.0, 1.0);\r\n\t\tconst vec4 HS1 = vec4( 0.309016994,  0.951056516, 0.0, 1.0);\r\n\t\tconst vec4 HS2 = vec4(-0.809016994,  0.587785252, 0.0, 1.0);\r\n\t\tconst vec4 HS3 = vec4(-0.809016994, -0.587785252, 0.0, 1.0);\r\n\t\tconst vec4 HS4 = vec4( 0.309016994, -0.951056516, 0.0, 1.0);\r\n\t\tconst vec4 HS5 = vec4( 0.0,          0.0,         1.0, 1.0);\r\n\r\n\t\tconst vec4 ONE = vec4(1.0);\r\n\r\n\t\tconst float P_FEATHER = 0.4;\r\n\t\tconst float N_FEATHER = -P_FEATHER;\r\n\r\n\t\tfloat inOrOut = -4.0;\r\n\r\n\t\tvec4 P = vec4(coords, vec2(RINGS_FLOAT - 1.3));\r\n\r\n\t\tvec4 dist = vec4(\r\n\t\t\tdot(P, HS0),\r\n\t\t\tdot(P, HS1),\r\n\t\t\tdot(P, HS2),\r\n\t\t\tdot(P, HS3)\r\n\t\t);\r\n\r\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\r\n\r\n\t\tinOrOut += dot(dist, ONE);\r\n\r\n\t\tdist.x = dot(P, HS4);\r\n\t\tdist.y = HS5.w - abs(P.z);\r\n\r\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\r\n\t\tinOrOut += dist.x;\r\n\r\n\t\treturn clamp(inOrOut, 0.0, 1.0);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef SHOW_FOCUS\r\n\r\n\tvec3 debugFocus(vec3 c, float blur, float depth) {\r\n\r\n\t\tfloat edge = 0.002 * depth;\r\n\t\tfloat m = clamp(smoothstep(0.0, edge, blur), 0.0, 1.0);\r\n\t\tfloat e = clamp(smoothstep(1.0 - edge, 1.0, blur), 0.0, 1.0);\r\n\r\n\t\tc = mix(c, vec3(1.0, 0.5, 0.0), (1.0 - m) * 0.6);\r\n\t\tc = mix(c, vec3(0.0, 0.5, 1.0), ((1.0 - e) - (1.0 - m)) * 0.2);\r\n\r\n\t\treturn c;\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef VIGNETTE\r\n\r\n\tfloat vignette() {\r\n\r\n\t\tconst vec2 CENTER = vec2(0.5);\r\n\r\n\t\tconst float VIGNETTE_OUT = 1.3;\r\n\t\tconst float VIGNETTE_IN = 0.0;\r\n\t\tconst float VIGNETTE_FADE = 22.0; \r\n\r\n\t\tfloat d = distance(vUv, CENTER);\r\n\t\td = smoothstep(VIGNETTE_OUT + (focalStop / VIGNETTE_FADE), VIGNETTE_IN + (focalStop / VIGNETTE_FADE), d);\r\n\r\n\t\treturn clamp(d, 0.0, 1.0);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\nvec2 rand(vec2 coord) {\r\n\r\n\tvec2 noise;\r\n\r\n\t#ifdef NOISE\r\n\r\n\t\tconst float a = 12.9898;\r\n\t\tconst float b = 78.233;\r\n\t\tconst float c = 43758.5453;\r\n\r\n\t\tnoise.x = clamp(fract(sin(mod(dot(coord, vec2(a, b)), 3.14)) * c), 0.0, 1.0) * 2.0 - 1.0;\r\n\t\tnoise.y = clamp(fract(sin(mod(dot(coord, vec2(a, b) * 2.0), 3.14)) * c), 0.0, 1.0) * 2.0 - 1.0;\r\n\r\n\t#else\r\n\r\n\t\tnoise.x = ((fract(1.0 - coord.s * halfTexelSize.x) * 0.25) + (fract(coord.t * halfTexelSize.y) * 0.75)) * 2.0 - 1.0;\r\n\t\tnoise.y = ((fract(1.0 - coord.s * halfTexelSize.x) * 0.75) + (fract(coord.t * halfTexelSize.y) * 0.25)) * 2.0 - 1.0;\r\n\r\n\t#endif\r\n\r\n\treturn noise;\r\n\r\n}\r\n\r\nvec3 processTexel(vec2 coords, float blur) {\r\n\r\n\tvec3 c;\r\n\tc.r = texture2D(tDiffuse, coords + vec2(0.0, 1.0) * texelSize * fringe * blur).r;\r\n\tc.g = texture2D(tDiffuse, coords + vec2(-0.866, -0.5) * texelSize * fringe * blur).g;\r\n\tc.b = texture2D(tDiffuse, coords + vec2(0.866, -0.5) * texelSize * fringe * blur).b;\r\n\r\n\t// Calculate the luminance of the constructed colour.\r\n\tfloat luminance = dot(c, luminanceCoefficients);\r\n\tfloat threshold = max((luminance - luminanceThreshold) * luminanceGain, 0.0);\r\n\r\n\treturn c + mix(vec3(0.0), c, threshold * blur);\r\n\r\n}\r\n\r\nfloat linearize(float depth) {\r\n\r\n\treturn -cameraFar * cameraNear / (depth * (cameraFar - cameraNear) - cameraFar);\r\n\r\n}\r\n\r\nfloat gather(float i, float j, float ringSamples, inout vec3 color, float w, float h, float blur) {\r\n\r\n\tconst float TWO_PI = 6.28318531;\r\n\r\n\tfloat step = TWO_PI / ringSamples;\r\n\tfloat pw = cos(j * step) * i;\r\n\tfloat ph = sin(j * step) * i;\r\n\r\n\t#ifdef PENTAGON\r\n\r\n\t\tfloat p = penta(vec2(pw, ph));\r\n\r\n\t#else\r\n\r\n\t\tfloat p = 1.0;\r\n\r\n\t#endif\r\n\r\n\tcolor += processTexel(vUv + vec2(pw * w, ph * h), blur) * mix(1.0, i / RINGS_FLOAT, bias) * p;\r\n\r\n\treturn mix(1.0, i / RINGS_FLOAT, bias) * p;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tfloat depth = linearize(texture2D(tDepth, vUv).x);\r\n\r\n\t#else\r\n\r\n\t\tfloat depth = linearize(readDepth(tDepth, vUv));\r\n\r\n\t#endif\r\n\r\n\t#ifdef SHADER_FOCUS\r\n\r\n\t\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\t\tfloat fDepth = linearize(texture2D(tDepth, focusCoords).x);\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat fDepth = linearize(readDepth(tDepth, focusCoords));\r\n\r\n\t\t#endif\r\n\r\n\t#else\r\n\r\n\t\tfloat fDepth = focalDepth;\r\n\r\n\t#endif\r\n\r\n\t#ifdef MANUAL_DOF\r\n\r\n\t\tconst float nDoFStart = 1.0; \r\n\t\tconst float nDoFDist = 2.0;\r\n\t\tconst float fDoFStart = 1.0;\r\n\t\tconst float fDoFDist = 3.0;\r\n\r\n\t\tfloat focalPlane = depth - fDepth;\r\n\t\tfloat farDoF = (focalPlane - fDoFStart) / fDoFDist;\r\n\t\tfloat nearDoF = (-focalPlane - nDoFStart) / nDoFDist;\r\n\r\n\t\tfloat blur = (focalPlane > 0.0) ? farDoF : nearDoF;\r\n\r\n\t#else\r\n\r\n\t\tconst float CIRCLE_OF_CONFUSION = 0.03; // 35mm film = 0.03mm CoC.\r\n\r\n\t\tfloat focalPlaneMM = fDepth * 1000.0;\r\n\t\tfloat depthMM = depth * 1000.0;\r\n\r\n\t\tfloat focalPlane = (depthMM * focalLength) / (depthMM - focalLength);\r\n\t\tfloat farDoF = (focalPlaneMM * focalLength) / (focalPlaneMM - focalLength);\r\n\t\tfloat nearDoF = (focalPlaneMM - focalLength) / (focalPlaneMM * focalStop * CIRCLE_OF_CONFUSION);\r\n\r\n\t\tfloat blur = abs(focalPlane - farDoF) * nearDoF;\r\n\r\n\t#endif\r\n\r\n\tblur = clamp(blur, 0.0, 1.0);\r\n\r\n\t// Dithering.\r\n\tvec2 noise = rand(vUv) * ditherStrength * blur;\r\n\r\n\tfloat blurFactorX = texelSize.x * blur * maxBlur + noise.x;\r\n\tfloat blurFactorY = texelSize.y * blur * maxBlur + noise.y;\r\n\r\n\tconst int MAX_RING_SAMPLES = RINGS_INT * SAMPLES_INT;\r\n\r\n\t// Calculation of final color.\r\n\tvec4 color;\r\n\r\n\tif(blur < 0.05) {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t} else {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t\tfloat s = 1.0;\r\n\t\tint ringSamples;\r\n\r\n\t\tfor(int i = 1; i <= RINGS_INT; ++i) {\r\n\r\n\t\t\tringSamples = i * SAMPLES_INT;\r\n\r\n\t\t\t// Constant loop.\r\n\t\t\tfor(int j = 0; j < MAX_RING_SAMPLES; ++j) {\r\n\r\n\t\t\t\t// Break earlier.\r\n\t\t\t\tif(j >= ringSamples) { break; }\r\n\r\n\t\t\t\ts += gather(float(i), float(j), float(ringSamples), color.rgb, blurFactorX, blurFactorY, blur);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tcolor.rgb /= s; // Divide by sample count.\r\n\r\n\t}\r\n\r\n\t#ifdef SHOW_FOCUS\r\n\r\n\t\tcolor.rgb = debugFocus(color.rgb, blur, depth);\r\n\r\n\t#endif\r\n\r\n\t#ifdef VIGNETTE\r\n\r\n\t\tcolor.rgb *= vignette();\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n",x="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",g=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(this,r),void 0===n.rings&&(n.rings=3),void 0===n.samples&&(n.samples=2),void 0===n.showFocus&&(n.showFocus=!1),void 0===n.showFocus&&(n.showFocus=!1),void 0===n.manualDoF&&(n.manualDoF=!1),void 0===n.vignette&&(n.vignette=!1),void 0===n.pentagon&&(n.pentagon=!1),void 0===n.shaderFocus&&(n.shaderFocus=!0),void 0===n.noise&&(n.noise=!0);var i=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"Bokeh2Material",defines:{RINGS_INT:n.rings.toFixed(0),RINGS_FLOAT:n.rings.toFixed(1),SAMPLES_INT:n.samples.toFixed(0),SAMPLES_FLOAT:n.samples.toFixed(1)},uniforms:{tDiffuse:new t.Uniform(null),tDepth:new t.Uniform(null),texelSize:new t.Uniform(new t.Vector2),halfTexelSize:new t.Uniform(new t.Vector2),cameraNear:new t.Uniform(.1),cameraFar:new t.Uniform(2e3),focalLength:new t.Uniform(24),focalStop:new t.Uniform(.9),maxBlur:new t.Uniform(1),luminanceThreshold:new t.Uniform(.5),luminanceGain:new t.Uniform(2),luminanceCoefficients:new t.Uniform(new t.Vector3(.2126,.7152,.0722)),bias:new t.Uniform(.5),fringe:new t.Uniform(.7),ditherStrength:new t.Uniform(1e-4),focusCoords:new t.Uniform(new t.Vector2(.5,.5)),focalDepth:new t.Uniform(1)},fragmentShader:p,vertexShader:x,depthWrite:!1,depthTest:!1}));return n.showFocus&&(i.defines.SHOW_FOCUS="1"),n.manualDoF&&(i.defines.MANUAL_DOF="1"),n.vignette&&(i.defines.VIGNETTE="1"),n.pentagon&&(i.defines.PENTAGON="1"),n.shaderFocus&&(i.defines.SHADER_FOCUS="1"),n.noise&&(i.defines.NOISE="1"),void 0!==n.texelSize&&i.setTexelSize(n.texelSize.x,n.texelSize.y),null!==e&&i.adoptCameraSettings(e),i}return f(r,e),c(r,[{key:"setTexelSize",value:function(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5);}},{key:"adoptCameraSettings",value:function(e){this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,this.uniforms.focalLength.value=e.getFocalLength();}}]),r}(t.ShaderMaterial),y="uniform sampler2D texture1;\r\nuniform sampler2D texture2;\r\n\r\nuniform float opacity1;\r\nuniform float opacity2;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel1 = opacity1 * texture2D(texture1, vUv);\r\n\tvec4 texel2 = opacity2 * texture2D(texture2, vUv);\r\n\r\n\t#ifdef SCREEN_MODE\r\n\r\n\t\tvec3 invTexel1 = vec3(1.0) - texel1.rgb;\r\n\t\tvec3 invTexel2 = vec3(1.0) - texel2.rgb;\r\n\r\n\t\tvec4 color = vec4(\r\n\t\t\tvec3(1.0) - invTexel1 * invTexel2,\r\n\t\t\ttexel1.a + texel2.a\r\n\t\t);\r\n\r\n\t#else\r\n\r\n\t\tvec4 color = texel1 + texel2;\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n",S="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",D=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"CombineMaterial",uniforms:{texture1:new t.Uniform(null),texture2:new t.Uniform(null),opacity1:new t.Uniform(1),opacity2:new t.Uniform(1)},fragmentShader:y,vertexShader:S,depthWrite:!1,depthTest:!1}));return e&&(n.defines.SCREEN_MODE="1"),n}return f(r,e),r}(t.ShaderMaterial),M="uniform sampler2D tDiffuse;\r\n\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\t// Sample top left texel.\r\n\tvec4 sum = texture2D(tDiffuse, vUv0);\r\n\r\n\t// Sample top right texel.\r\n\tsum += texture2D(tDiffuse, vUv1);\r\n\r\n\t// Sample bottom right texel.\r\n\tsum += texture2D(tDiffuse, vUv2);\r\n\r\n\t// Sample bottom left texel.\r\n\tsum += texture2D(tDiffuse, vUv3);\r\n\r\n\t// Compute the average.\r\n\tgl_FragColor = sum * 0.25;\r\n\r\n}\r\n",w="uniform vec2 texelSize;\r\nuniform vec2 halfTexelSize;\r\nuniform float kernel;\r\n\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\tvec2 dUv = (texelSize * vec2(kernel)) + halfTexelSize;\r\n\r\n\tvUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);\r\n\tvUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);\r\n\tvUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);\r\n\tvUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",b=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new t.Vector2;l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"ConvolutionMaterial",uniforms:{tDiffuse:new t.Uniform(null),texelSize:new t.Uniform(new t.Vector2),halfTexelSize:new t.Uniform(new t.Vector2),kernel:new t.Uniform(0)},fragmentShader:M,vertexShader:w,depthWrite:!1,depthTest:!1}));return n.setTexelSize(e.x,e.y),n.kernelSize=A.LARGE,n}return f(r,e),c(r,[{key:"getKernel",value:function(){return T[this.kernelSize]}},{key:"setTexelSize",value:function(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5);}}]),r}(t.ShaderMaterial),T=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],A={VERY_SMALL:0,SMALL:1,MEDIUM:2,LARGE:3,VERY_LARGE:4,HUGE:5},U="uniform sampler2D tDiffuse;\r\nuniform float opacity;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tgl_FragColor = opacity * texel;\r\n\r\n}\r\n",P="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",O=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"CopyMaterial",uniforms:{tDiffuse:new t.Uniform(null),opacity:new t.Uniform(1)},fragmentShader:U,vertexShader:P,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),L="uniform sampler2D tDepth;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifndef USE_LOGDEPTHBUF\r\n\r\n\t#include <packing>\r\n\r\n\tuniform float cameraNear;\r\n\tuniform float cameraFar;\r\n\r\n\tfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n\r\n\t\tfloat fragCoordZ = texture2D(depthSampler, coord).x;\r\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n\r\n\t\treturn viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\nvoid main() {\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tfloat depth = texture2D(tDepth, vUv).x;\r\n\r\n\t#else\r\n\r\n\t\tfloat depth = readDepth(tDepth, vUv);\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = vec4(depth, depth, depth, 1.0);\r\n\r\n}\r\n",C="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",E=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"DepthMaterial",uniforms:{cameraNear:new t.Uniform(.1),cameraFar:new t.Uniform(2e3),tDepth:new t.Uniform(null)},fragmentShader:L,vertexShader:C,depthWrite:!1,depthTest:!1}));return null!==e&&n.adoptCameraSettings(e),n}return f(r,e),c(r,[{key:"adoptCameraSettings",value:function(e){this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far;}}]),r}(t.ShaderMaterial),z="uniform sampler2D tDiffuse;\r\n\r\nuniform float angle;\r\nuniform float scale;\r\nuniform float intensity;\r\n\r\nvarying vec2 vUv;\r\nvarying vec2 vUvPattern;\r\n\r\nfloat pattern() {\r\n\r\n\tfloat s = sin(angle);\r\n\tfloat c = cos(angle);\r\n\r\n\tvec2 point = vec2(c * vUvPattern.x - s * vUvPattern.y, s * vUvPattern.x + c * vUvPattern.y) * scale;\r\n\r\n\treturn (sin(point.x) * sin(point.y)) * 4.0;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tvec3 color = texel.rgb;\r\n\r\n\t#ifdef AVERAGE\r\n\r\n\t\tcolor = vec3((color.r + color.g + color.b) / 3.0);\r\n\r\n\t#endif\r\n\r\n\tcolor = vec3(color * 10.0 - 5.0 + pattern());\r\n\tcolor = texel.rgb + (color - texel.rgb) * intensity;\r\n\r\n\tgl_FragColor = vec4(color, texel.a);\r\n\r\n}\r\n",F="uniform vec4 offsetRepeat;\r\n\r\nvarying vec2 vUv;\r\nvarying vec2 vUvPattern;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tvUvPattern = uv * offsetRepeat.zw + offsetRepeat.xy;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",N=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"DotScreenMaterial",uniforms:{tDiffuse:new t.Uniform(null),angle:new t.Uniform(1.57),scale:new t.Uniform(1),intensity:new t.Uniform(1),offsetRepeat:new t.Uniform(new t.Vector4(.5,.5,1,1))},fragmentShader:z,vertexShader:F,depthWrite:!1,depthTest:!1}));return e&&(n.defines.AVERAGE="1"),n}return f(r,e),r}(t.ShaderMaterial),B="uniform sampler2D tDiffuse;\r\nuniform float time;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifdef NOISE\r\n\r\n\tuniform float noiseIntensity;\r\n\r\n#endif\r\n\r\n#ifdef SCANLINES\r\n\r\n\tuniform float scanlineIntensity;\r\n\tuniform float scanlineCount;\r\n\r\n#endif\r\n\r\n#ifdef GREYSCALE\r\n\r\n\tuniform vec3 luminanceCoefficients;\r\n\tuniform float greyscaleIntensity;\r\n\r\n#elif defined(SEPIA)\r\n\r\n\tuniform float sepiaIntensity;\r\n\r\n#endif\r\n\r\n#ifdef VIGNETTE\r\n\r\n\tuniform float vignetteOffset;\r\n\tuniform float vignetteDarkness;\r\n\r\n#endif\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tvec3 color = texel.rgb;\r\n\r\n\t#ifdef SCREEN_MODE\r\n\r\n\t\tvec3 invColor;\r\n\r\n\t#endif\r\n\r\n\t#ifdef NOISE\r\n\r\n\t\tfloat x = vUv.x * vUv.y * time * 1000.0;\r\n\t\tx = mod(x, 13.0) * mod(x, 123.0);\r\n\t\tx = mod(x, 0.01);\r\n\r\n\t\tvec3 noise = texel.rgb * clamp(0.1 + x * 100.0, 0.0, 1.0) * noiseIntensity;\r\n\r\n\t\t#ifdef SCREEN_MODE\r\n\r\n\t\t\tinvColor = vec3(1.0) - color;\r\n\t\t\tvec3 invNoise = vec3(1.0) - noise;\r\n\r\n\t\t\tcolor = vec3(1.0) - invColor * invNoise;\r\n\r\n\t\t#else\r\n\r\n\t\t\tcolor += noise;\r\n\r\n\t\t#endif\r\n\r\n\t#endif\r\n\r\n\t#ifdef SCANLINES\r\n\r\n\t\tvec2 sl = vec2(sin(vUv.y * scanlineCount), cos(vUv.y * scanlineCount));\r\n\t\tvec3 scanlines = texel.rgb * vec3(sl.x, sl.y, sl.x) * scanlineIntensity;\r\n\r\n\t\t#ifdef SCREEN_MODE\r\n\r\n\t\t\tinvColor = vec3(1.0) - color;\r\n\t\t\tvec3 invScanlines = vec3(1.0) - scanlines;\r\n\r\n\t\t\tcolor = vec3(1.0) - invColor * invScanlines;\r\n\r\n\t\t#else\r\n\r\n\t\t\tcolor += scanlines;\r\n\r\n\t\t#endif\r\n\r\n\t#endif\r\n\r\n\t#ifdef GREYSCALE\r\n\r\n\t\tcolor = mix(color, vec3(dot(color, luminanceCoefficients)), greyscaleIntensity);\r\n\r\n\t#elif defined(SEPIA)\r\n\r\n\t\tvec3 c = color.rgb;\r\n\r\n\t\tcolor.r = dot(c, vec3(1.0 - 0.607 * sepiaIntensity, 0.769 * sepiaIntensity, 0.189 * sepiaIntensity));\r\n\t\tcolor.g = dot(c, vec3(0.349 * sepiaIntensity, 1.0 - 0.314 * sepiaIntensity, 0.168 * sepiaIntensity));\r\n\t\tcolor.b = dot(c, vec3(0.272 * sepiaIntensity, 0.534 * sepiaIntensity, 1.0 - 0.869 * sepiaIntensity));\r\n\r\n\t#endif\r\n\r\n\t#ifdef VIGNETTE\r\n\r\n\t\tconst vec2 center = vec2(0.5);\r\n\r\n\t\t#ifdef ESKIL\r\n\r\n\t\t\tvec2 uv = (vUv - center) * vec2(vignetteOffset);\r\n\t\t\tcolor = mix(color.rgb, vec3(1.0 - vignetteDarkness), dot(uv, uv));\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat dist = distance(vUv, center);\r\n\t\t\tcolor *= smoothstep(0.8, vignetteOffset * 0.799, dist * (vignetteDarkness + vignetteOffset));\r\n\r\n\t\t#endif\t\t\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a);\r\n\r\n}\r\n",k="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",R=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,r),void 0===e.screenMode&&(e.screenMode=!0),void 0===e.noise&&(e.noise=!0),void 0===e.scanlines&&(e.scanlines=!0),void 0===e.greyscale&&(e.greyscale=!1),void 0===e.sepia&&(e.sepia=!1),void 0===e.vignette&&(e.vignette=!1),void 0===e.eskil&&(e.eskil=!1),void 0===e.noiseIntensity&&(e.noiseIntensity=.5),void 0===e.scanlineIntensity&&(e.scanlineIntensity=.05),void 0===e.greyscaleIntensity&&(e.greyscaleIntensity=1),void 0===e.sepiaIntensity&&(e.sepiaIntensity=1),void 0===e.vignetteOffset&&(e.vignetteOffset=1),void 0===e.vignetteDarkness&&(e.vignetteDarkness=1);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"FilmMaterial",uniforms:{tDiffuse:new t.Uniform(null),time:new t.Uniform(0),noiseIntensity:new t.Uniform(e.noiseIntensity),scanlineIntensity:new t.Uniform(e.scanlineIntensity),scanlineCount:new t.Uniform(0),luminanceCoefficients:new t.Uniform(new t.Vector3(.2126,.7152,.0722)),greyscaleIntensity:new t.Uniform(e.greyscaleIntensity),sepiaIntensity:new t.Uniform(e.sepiaIntensity),vignetteOffset:new t.Uniform(e.vignetteOffset),vignetteDarkness:new t.Uniform(e.vignetteDarkness)},fragmentShader:B,vertexShader:k,depthWrite:!1,depthTest:!1}));return e.greyscale&&(n.defines.GREYSCALE="1"),e.sepia&&(n.defines.SEPIA="1"),e.vignette&&(n.defines.VIGNETTE="1"),e.eskil&&(n.defines.ESKIL="1"),e.screenMode&&(n.defines.SCREEN_MODE="1"),e.noise&&(n.defines.NOISE="1"),e.scanlines&&(n.defines.SCANLINES="1"),n}return f(r,e),r}(t.ShaderMaterial),j="uniform sampler2D tDiffuse;\r\nuniform sampler2D tPerturb;\r\n\r\nuniform bool active;\r\n\r\nuniform float amount;\r\nuniform float angle;\r\nuniform float seed;\r\nuniform float seedX;\r\nuniform float seedY;\r\nuniform float distortionX;\r\nuniform float distortionY;\r\nuniform float colS;\r\n\r\nvarying vec2 vUv;\r\n\r\nfloat rand(vec2 tc) {\r\n\r\n\tconst float a = 12.9898;\r\n\tconst float b = 78.233;\r\n\tconst float c = 43758.5453;\r\n\r\n\tfloat dt = dot(tc, vec2(a, b));\r\n\tfloat sn = mod(dt, 3.14);\r\n\r\n\treturn fract(sin(sn) * c);\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec2 coord = vUv;\r\n\r\n\tfloat xs, ys;\r\n\tvec4 normal;\r\n\r\n\tvec2 offset;\r\n\tvec4 cr, cga, cb;\r\n\tvec4 snow, color;\r\n\r\n\tfloat sx, sy;\r\n\r\n\tif(active) {\r\n\r\n\t\txs = floor(gl_FragCoord.x / 0.5);\r\n\t\tys = floor(gl_FragCoord.y / 0.5);\r\n\r\n\t\tnormal = texture2D(tPerturb, coord * seed * seed);\r\n\r\n\t\tif(coord.y < distortionX + colS && coord.y > distortionX - colS * seed) {\r\n\r\n\t\t\tsx = clamp(ceil(seedX), 0.0, 1.0);\r\n\t\t\tcoord.y = sx * (1.0 - (coord.y + distortionY)) + (1.0 - sx) * distortionY;\r\n\r\n\t\t}\r\n\r\n\t\tif(coord.x < distortionY + colS && coord.x > distortionY - colS * seed) {\r\n\r\n\t\t\tsy = clamp(ceil(seedY), 0.0, 1.0);\r\n\t\t\tcoord.x = sy * distortionX + (1.0 - sy) * (1.0 - (coord.x + distortionX));\r\n\r\n\t\t}\r\n\r\n\t\tcoord.x += normal.x * seedX * (seed / 5.0);\r\n\t\tcoord.y += normal.y * seedY * (seed / 5.0);\r\n\r\n\t\toffset = amount * vec2(cos(angle), sin(angle));\r\n\r\n\t\tcr = texture2D(tDiffuse, coord + offset);\r\n\t\tcga = texture2D(tDiffuse, coord);\r\n\t\tcb = texture2D(tDiffuse, coord - offset);\r\n\r\n\t\tcolor = vec4(cr.r, cga.g, cb.b, cga.a);\r\n\t\tsnow = 200.0 * amount * vec4(rand(vec2(xs * seed, ys * seed * 50.0)) * 0.2);\r\n\t\tcolor += snow;\r\n\r\n\t} else {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n",W="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",X=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"GlitchMaterial",uniforms:{tDiffuse:new t.Uniform(null),tPerturb:new t.Uniform(null),active:new t.Uniform(1),amount:new t.Uniform(.8),angle:new t.Uniform(.02),seed:new t.Uniform(.02),seedX:new t.Uniform(.02),seedY:new t.Uniform(.02),distortionX:new t.Uniform(.5),distortionY:new t.Uniform(.6),colS:new t.Uniform(.05)},fragmentShader:j,vertexShader:W,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),I="uniform sampler2D tDiffuse;\r\nuniform vec3 lightPosition;\r\n\r\nuniform float exposure;\r\nuniform float decay;\r\nuniform float density;\r\nuniform float weight;\r\nuniform float clampMax;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec2 texCoord = vUv;\r\n\r\n\t// Calculate vector from pixel to light source in screen space.\r\n\tvec2 deltaTexCoord = texCoord - lightPosition.st;\r\n\tdeltaTexCoord *= 1.0 / NUM_SAMPLES_FLOAT * density;\r\n\r\n\t// A decreasing illumination factor.\r\n\tfloat illuminationDecay = 1.0;\r\n\r\n\tvec4 sample;\r\n\tvec4 color = vec4(0.0);\r\n\r\n\t// Estimate the probability of occlusion at each pixel by summing samples along a ray to the light source.\r\n\tfor(int i = 0; i < NUM_SAMPLES_INT; ++i) {\r\n\r\n\t\ttexCoord -= deltaTexCoord;\r\n\t\tsample = texture2D(tDiffuse, texCoord);\r\n\r\n\t\t// Apply sample attenuation scale/decay factors.\r\n\t\tsample *= illuminationDecay * weight;\r\n\r\n\t\tcolor += sample;\r\n\r\n\t\t// Update exponential decay factor.\r\n\t\tilluminationDecay *= decay;\r\n\r\n\t}\r\n\r\n\tgl_FragColor = clamp(color * exposure, 0.0, clampMax);\r\n\r\n}\r\n",G="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",H=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"GodRaysMaterial",defines:{NUM_SAMPLES_FLOAT:"60.0",NUM_SAMPLES_INT:"60"},uniforms:{tDiffuse:new t.Uniform(null),lightPosition:new t.Uniform(null),exposure:new t.Uniform(.6),decay:new t.Uniform(.93),density:new t.Uniform(.96),weight:new t.Uniform(.4),clampMax:new t.Uniform(1)},fragmentShader:I,vertexShader:G,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),V="uniform sampler2D tDiffuse;\r\nuniform float distinction;\r\nuniform vec2 range;\r\nuniform vec3 luminanceCoefficients;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tfloat v = dot(texel.rgb, luminanceCoefficients);\r\n\r\n\t#ifdef RANGE\r\n\r\n\t\tfloat low = step(range.x, v);\r\n\t\tfloat high = step(v, range.y);\r\n\r\n\t\t// Apply the mask.\r\n\t\tv *= low * high;\r\n\r\n\t#endif\r\n\r\n\tv = pow(abs(v), distinction);\r\n\r\n\t#ifdef COLOR\r\n\r\n\t\tgl_FragColor = vec4(texel.rgb * v, texel.a);\r\n\r\n\t#else\r\n\r\n\t\tgl_FragColor = vec4(v, v, v, texel.a);\r\n\r\n\t#endif\r\n\r\n}\r\n",Y="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",q=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;l(this,r);var i=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"LuminosityMaterial",uniforms:{tDiffuse:new t.Uniform(null),distinction:new t.Uniform(1),range:new t.Uniform(null!==n?n:new t.Vector2),luminanceCoefficients:new t.Uniform(new t.Vector3(.2126,.7152,.0722))},fragmentShader:V,vertexShader:Y}));return e&&(i.defines.COLOR="1"),null!==n&&(i.defines.RANGE="1"),i}return f(r,e),r}(t.ShaderMaterial),K="uniform sampler2D tDiffuse;\r\nuniform float granularity;\r\nuniform float dx;\r\nuniform float dy;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel;\r\n\r\n\tif(granularity > 0.0) {\r\n\r\n\t\tvec2 coord = vec2(\r\n\t\t\tdx * (floor(vUv.x / dx) + 0.5),\r\n\t\t\tdy * (floor(vUv.y / dy) + 0.5)\r\n\t\t);\r\n\r\n\t\ttexel = texture2D(tDiffuse, coord);\r\n\r\n\t} else {\r\n\r\n\t\ttexel = texture2D(tDiffuse, vUv);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = texel;\r\n\r\n}\r\n",Z="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",J=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"PixelationMaterial",uniforms:{tDiffuse:new t.Uniform(null),granularity:new t.Uniform(1),resolution:new t.Uniform(new t.Vector2(1,1)),dx:new t.Uniform(1),dy:new t.Uniform(1)},fragmentShader:K,vertexShader:Z,depthWrite:!1,depthTest:!1}))}return f(r,e),c(r,[{key:"setResolution",value:function(e,t){this.uniforms.resolution.value.set(e,t),this.granularity=this.granularity;}},{key:"granularity",get:function(){return this.uniforms.granularity.value},set:function(e){var t=this.uniforms,r=t.resolution.value;t.granularity.value=e,t.dx.value=e/r.x,t.dy.value=e/r.y;}}]),r}(t.ShaderMaterial),Q="#include <common>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform vec2 center;\r\nuniform float aspect;\r\nuniform float waveSize;\r\nuniform float radius;\r\nuniform float maxRadius;\r\nuniform float amplitude;\r\n\r\nvarying vec2 vUv;\r\nvarying float vSize;\r\n\r\nvoid main() {\r\n\r\n\tvec2 aspectCorrection = vec2(aspect, 1.0);\r\n\r\n\tvec2 difference = vUv * aspectCorrection - center * aspectCorrection;\r\n\tfloat distance = sqrt(dot(difference, difference)) * vSize;\r\n\r\n\tvec2 displacement = vec2(0.0);\r\n\r\n\tif(distance > radius) {\r\n\r\n\t\tif(distance < radius + waveSize) {\r\n\r\n\t\t\tfloat angle = (distance - radius) * PI2 / waveSize;\r\n\t\t\tfloat cosSin = (1.0 - cos(angle)) * 0.5;\r\n\r\n\t\t\tfloat extent = maxRadius + waveSize;\r\n\t\t\tfloat decay = max(extent - distance * distance, 0.0) / extent;\r\n\r\n\t\t\tdisplacement = ((cosSin * amplitude * difference) / distance) * decay;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\tgl_FragColor = texture2D(tDiffuse, vUv - displacement);\r\n\r\n}\r\n",_="uniform float size;\r\nuniform float scale;\r\nuniform float cameraDistance;\r\n\r\nvarying vec2 vUv;\r\nvarying float vSize;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tvSize = (0.1 * cameraDistance) / size;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",$=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return l(this,r),void 0===e.maxRadius&&(e.maxRadius=1),void 0===e.waveSize&&(e.waveSize=.2),void 0===e.amplitude&&(e.amplitude=.05),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"ShockWaveMaterial",uniforms:{tDiffuse:new t.Uniform(null),center:new t.Uniform(new t.Vector2(.5,.5)),aspect:new t.Uniform(1),cameraDistance:new t.Uniform(1),size:new t.Uniform(1),radius:new t.Uniform(-e.waveSize),maxRadius:new t.Uniform(e.maxRadius),waveSize:new t.Uniform(e.waveSize),amplitude:new t.Uniform(e.amplitude)},fragmentShader:Q,vertexShader:_,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),ee="uniform sampler2D tDiffuse;\r\nuniform sampler2D tWeights;\r\n\r\nuniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset;\r\n\r\nvoid main() {\r\n\r\n\t// Fetch the blending weights for current pixel.\r\n\tvec4 a;\r\n\ta.xz = texture2D(tWeights, vUv).xz;\r\n\ta.y = texture2D(tWeights, vOffset.zw).g;\r\n\ta.w = texture2D(tWeights, vOffset.xy).a;\r\n\r\n\tvec4 color;\r\n\r\n\t// Check if there is any blending weight with a value greater than 0.0.\r\n\tif(dot(a, vec4(1.0)) < 1e-5) {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv, 0.0);\r\n\r\n\t} else {\r\n\r\n\t\t/* Up to four lines can be crossing a pixel (one through each edge). We favor\r\n\t\t * blending by choosing the line with the maximum weight for each direction.\r\n\t\t */\r\n\r\n\t\tvec2 offset;\r\n\t\toffset.x = a.a > a.b ? a.a : -a.b; // Left vs. right.\r\n\t\toffset.y = a.g > a.r ? -a.g : a.r; // Top vs. bottom (changed signs).\r\n\r\n\t\t// Then we go in the direction that has the maximum weight (horizontal vs. vertical).\r\n\t\tif(abs(offset.x) > abs(offset.y)) {\r\n\r\n\t\t\toffset.y = 0.0;\r\n\r\n\t\t} else {\r\n\r\n\t\t\toffset.x = 0.0;\r\n\r\n\t\t}\r\n\r\n\t\t// Fetch the opposite color and lerp by hand.\r\n\t\tcolor = texture2D(tDiffuse, vUv, 0.0);\r\n\t\tvec2 coord = vUv + sign(offset) * texelSize;\r\n\t\tvec4 oppositeColor = texture2D(tDiffuse, coord, 0.0);\r\n\t\tfloat s = abs(offset.x) > abs(offset.y) ? abs(offset.x) : abs(offset.y);\r\n\r\n\t\t// Gamma correction.\r\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(2.2));\r\n\t\toppositeColor.rgb = pow(abs(oppositeColor.rgb), vec3(2.2));\r\n\t\tcolor = mix(color, oppositeColor, s);\r\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(1.0 / 2.2));\r\n\r\n\t}\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n",te="uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvOffset = uv.xyxy + texelSize.xyxy * vec4(1.0, 0.0, 0.0, -1.0); // Changed sign in W component.\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",re=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new t.Vector2;return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"SMAABlendMaterial",uniforms:{tDiffuse:new t.Uniform(null),tWeights:new t.Uniform(null),texelSize:new t.Uniform(e)},fragmentShader:ee,vertexShader:te,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),ne="uniform sampler2D tDiffuse;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\n\r\nvoid main() {\r\n\r\n\tconst vec2 THRESHOLD = vec2(EDGE_THRESHOLD);\r\n\r\n\t// Calculate color deltas.\r\n\tvec4 delta;\r\n\tvec3 c = texture2D(tDiffuse, vUv).rgb;\r\n\r\n\tvec3 cLeft = texture2D(tDiffuse, vOffset[0].xy).rgb;\r\n\tvec3 t = abs(c - cLeft);\r\n\tdelta.x = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cTop = texture2D(tDiffuse, vOffset[0].zw).rgb;\r\n\tt = abs(c - cTop);\r\n\tdelta.y = max(max(t.r, t.g), t.b);\r\n\r\n\t// We do the usual threshold.\r\n\tvec2 edges = step(THRESHOLD, delta.xy);\r\n\r\n\t// Then discard if there is no edge.\r\n\tif(dot(edges, vec2(1.0)) == 0.0) {\r\n\r\n\t\tdiscard;\r\n\r\n\t}\r\n\r\n\t// Calculate right and bottom deltas.\r\n\tvec3 cRight = texture2D(tDiffuse, vOffset[1].xy).rgb;\r\n\tt = abs(c - cRight);\r\n\tdelta.z = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cBottom  = texture2D(tDiffuse, vOffset[1].zw).rgb;\r\n\tt = abs(c - cBottom);\r\n\tdelta.w = max(max(t.r, t.g), t.b);\r\n\r\n\t// Calculate the maximum delta in the direct neighborhood.\r\n\tfloat maxDelta = max(max(max(delta.x, delta.y), delta.z), delta.w);\r\n\r\n\t// Calculate left-left and top-top deltas.\r\n\tvec3 cLeftLeft  = texture2D(tDiffuse, vOffset[2].xy).rgb;\r\n\tt = abs(c - cLeftLeft);\r\n\tdelta.z = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cTopTop = texture2D(tDiffuse, vOffset[2].zw).rgb;\r\n\tt = abs(c - cTopTop);\r\n\tdelta.w = max(max(t.r, t.g), t.b);\r\n\r\n\t// Calculate the final maximum delta.\r\n\tmaxDelta = max(max(maxDelta, delta.z), delta.w);\r\n\r\n\t// Local contrast adaptation in action.\r\n\tedges.xy *= step(0.5 * maxDelta, delta.xy);\r\n\r\n\tgl_FragColor = vec4(edges, 0.0, 0.0);\r\n\r\n}\r\n",ie="uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvOffset[0] = uv.xyxy + texelSize.xyxy * vec4(-1.0, 0.0, 0.0, 1.0); // Changed sign in W component.\r\n\tvOffset[1] = uv.xyxy + texelSize.xyxy * vec4(1.0, 0.0, 0.0, -1.0); // Changed sign in W component.\r\n\tvOffset[2] = uv.xyxy + texelSize.xyxy * vec4(-2.0, 0.0, 0.0, 2.0); // Changed sign in W component.\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",ae=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new t.Vector2;return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"SMAAColorEdgesMaterial",defines:{EDGE_THRESHOLD:"0.1"},uniforms:{tDiffuse:new t.Uniform(null),texelSize:new t.Uniform(e)},fragmentShader:ne,vertexShader:ie,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),oe="data:image/png;base64,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",se="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII=",le="#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + float(offset) * texelSize, 0.0)\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tArea;\r\nuniform sampler2D tSearch;\r\n\r\nuniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\nvarying vec2 vPixCoord;\r\n\r\nvec2 round(vec2 x) {\r\n\r\n\treturn sign(x) * floor(abs(x) + 0.5);\r\n\r\n}\r\n\r\nfloat searchLength(vec2 e, float bias, float scale) {\r\n\r\n\t// Not required if tSearch accesses are set to point.\r\n\t// const vec2 SEARCH_TEX_PIXEL_SIZE = 1.0 / vec2(66.0, 33.0);\r\n\t// e = vec2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE + e * vec2(scale, 1.0) * vec2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;\r\n\r\n\te.r = bias + e.r * scale;\r\n\r\n\treturn 255.0 * texture2D(tSearch, e, 0.0).r;\r\n\r\n}\r\n\r\nfloat searchXLeft(vec2 texCoord, float end) {\r\n\r\n\t/* @PSEUDO_GATHER4\r\n\t * This texCoord has been offset by (-0.25, -0.125) in the vertex shader to\r\n\t * sample between edge, thus fetching four edges in a row.\r\n\t * Sampling with different offsets in each direction allows to disambiguate\r\n\t * which edges are active from the four fetched ones.\r\n\t */\r\n\r\n\tvec2 e = vec2(0.0, 1.0);\r\n\r\n\tfor(int i = 0; i < SMAA_MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord -= vec2(2.0, 0.0) * texelSize;\r\n\r\n\t\tif(!(texCoord.x > end && e.g > 0.8281 && e.r == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\t// Correct the previously applied offset (-0.25, -0.125).\r\n\ttexCoord.x += 0.25 * texelSize.x;\r\n\r\n\t// The searches are biased by 1, so adjust the coords accordingly.\r\n\ttexCoord.x += texelSize.x;\r\n\r\n\t// Disambiguate the length added by the last step.\r\n\ttexCoord.x += 2.0 * texelSize.x; // Undo last step.\r\n\ttexCoord.x -= texelSize.x * searchLength(e, 0.0, 0.5);\r\n\r\n\treturn texCoord.x;\r\n\r\n}\r\n\r\nfloat searchXRight(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(0.0, 1.0);\r\n\r\n\tfor(int i = 0; i < SMAA_MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord += vec2(2.0, 0.0) * texelSize;\r\n\r\n\t\tif(!(texCoord.x < end && e.g > 0.8281 && e.r == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.x -= 0.25 * texelSize.x;\r\n\ttexCoord.x -= texelSize.x;\r\n\ttexCoord.x -= 2.0 * texelSize.x;\r\n\ttexCoord.x += texelSize.x * searchLength(e, 0.5, 0.5);\r\n\r\n\treturn texCoord.x;\r\n\r\n}\r\n\r\nfloat searchYUp(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(1.0, 0.0);\r\n\r\n\tfor(int i = 0; i < SMAA_MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord += vec2(0.0, 2.0) * texelSize; // Changed sign.\r\n\r\n\t\tif(!(texCoord.y > end && e.r > 0.8281 && e.g == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.y -= 0.25 * texelSize.y; // Changed sign.\r\n\ttexCoord.y -= texelSize.y; // Changed sign.\r\n\ttexCoord.y -= 2.0 * texelSize.y; // Changed sign.\r\n\ttexCoord.y += texelSize.y * searchLength(e.gr, 0.0, 0.5); // Changed sign.\r\n\r\n\treturn texCoord.y;\r\n\r\n}\r\n\r\nfloat searchYDown(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(1.0, 0.0);\r\n\r\n\tfor(int i = 0; i < SMAA_MAX_SEARCH_STEPS_INT; ++i ) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord -= vec2(0.0, 2.0) * texelSize; // Changed sign.\r\n\r\n\t\tif(!(texCoord.y < end && e.r > 0.8281 && e.g == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.y += 0.25 * texelSize.y; // Changed sign.\r\n\ttexCoord.y += texelSize.y; // Changed sign.\r\n\ttexCoord.y += 2.0 * texelSize.y; // Changed sign.\r\n\ttexCoord.y -= texelSize.y * searchLength(e.gr, 0.5, 0.5); // Changed sign.\r\n\r\n\treturn texCoord.y;\r\n\r\n}\r\n\r\nvec2 area(vec2 dist, float e1, float e2, float offset) {\r\n\r\n\t// Rounding prevents precision errors of bilinear filtering.\r\n\tvec2 texCoord = SMAA_AREATEX_MAX_DISTANCE * round(4.0 * vec2(e1, e2)) + dist;\r\n\r\n\t// Scale and bias for texel space translation.\r\n\ttexCoord = SMAA_AREATEX_PIXEL_SIZE * texCoord + (0.5 * SMAA_AREATEX_PIXEL_SIZE);\r\n\r\n\t// Move to proper place, according to the subpixel offset.\r\n\ttexCoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;\r\n\r\n\treturn texture2D(tArea, texCoord, 0.0).rg;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 weights = vec4(0.0);\r\n\tvec4 subsampleIndices = vec4(0.0);\r\n\tvec2 e = texture2D(tDiffuse, vUv).rg;\r\n\r\n\tif(e.g > 0.0) {\r\n\r\n\t\t// Edge at north.\r\n\t\tvec2 d;\r\n\r\n\t\t// Find the distance to the left.\r\n\t\tvec2 coords;\r\n\t\tcoords.x = searchXLeft(vOffset[0].xy, vOffset[2].x);\r\n\t\tcoords.y = vOffset[1].y; // vOffset[1].y = vUv.y - 0.25 * texelSize.y (@CROSSING_OFFSET)\r\n\t\td.x = coords.x;\r\n\r\n\t\t/* Now fetch the left crossing edges, two at a time using bilinear filtering.\r\n\t\tSampling at -0.25 (see @CROSSING_OFFSET) enables to discern what value each edge has. */\r\n\r\n\t\tfloat e1 = texture2D(tDiffuse, coords, 0.0).r;\r\n\r\n\t\t// Find the distance to the right.\r\n\t\tcoords.x = searchXRight(vOffset[0].zw, vOffset[2].y);\r\n\t\td.y = coords.x;\r\n\r\n\t\t// Translate distances to pixel units for better interleave arithmetic and memory accesses.\r\n\t\td = d / texelSize.x - vPixCoord.x;\r\n\r\n\t\t// The area below needs a sqrt, as the areas texture is compressed quadratically.\r\n\t\tvec2 sqrtD = sqrt(abs(d));\r\n\r\n\t\t// Fetch the right crossing edges.\r\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\r\n\t\tfloat e2 = sampleLevelZeroOffset(tDiffuse, coords, ivec2(1, 0)).r;\r\n\r\n\t\t// Pattern recognised, now get the actual area.\r\n\t\tweights.rg = area(sqrtD, e1, e2, subsampleIndices.y);\r\n\r\n\t}\r\n\r\n\tif(e.r > 0.0) {\r\n\r\n\t\t// Edge at west.\r\n\t\tvec2 d;\r\n\r\n\t\t// Find the distance to the top.\r\n\t\tvec2 coords;\r\n\r\n\t\tcoords.y = searchYUp(vOffset[1].xy, vOffset[2].z);\r\n\t\tcoords.x = vOffset[0].x; // vOffset[1].x = vUv.x - 0.25 * texelSize.x;\r\n\t\td.x = coords.y;\r\n\r\n\t\t// Fetch the top crossing edges.\r\n\t\tfloat e1 = texture2D(tDiffuse, coords, 0.0).g;\r\n\r\n\t\t// Find the distance to the bottom.\r\n\t\tcoords.y = searchYDown(vOffset[1].zw, vOffset[2].w);\r\n\t\td.y = coords.y;\r\n\r\n\t\t// Distances in pixel units.\r\n\t\td = d / texelSize.y - vPixCoord.y;\r\n\r\n\t\t// The area below needs a sqrt, as the areas texture is compressed quadratically.\r\n\t\tvec2 sqrtD = sqrt(abs(d));\r\n\r\n\t\t// Fetch the bottom crossing edges.\r\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\r\n\t\tfloat e2 = sampleLevelZeroOffset(tDiffuse, coords, ivec2(0, 1)).g;\r\n\r\n\t\t// Get the area for this direction.\r\n\t\tweights.ba = area(sqrtD, e1, e2, subsampleIndices.x);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = weights;\r\n\r\n}\r\n",ce="uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\nvarying vec2 vPixCoord;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvPixCoord = uv / texelSize;\r\n\r\n\t// Offsets for the searches (see @PSEUDO_GATHER4).\r\n\tvOffset[0] = uv.xyxy + texelSize.xyxy * vec4(-0.25, 0.125, 1.25, 0.125); // Changed sign in Y and W components.\r\n\tvOffset[1] = uv.xyxy + texelSize.xyxy * vec4(-0.125, 0.25, -0.125, -1.25); //Changed sign in Y and W components.\r\n\r\n\t// This indicates the ends of the loops.\r\n\tvOffset[2] = vec4(vOffset[0].xz, vOffset[1].yw) + vec4(-2.0, 2.0, -2.0, 2.0) * texelSize.xxyy * SMAA_MAX_SEARCH_STEPS_FLOAT;\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",fe=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new t.Vector2;l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"SMAAWeightsMaterial",defines:{SMAA_MAX_SEARCH_STEPS_INT:"8",SMAA_MAX_SEARCH_STEPS_FLOAT:"8.0",SMAA_AREATEX_MAX_DISTANCE:"16.0",SMAA_AREATEX_PIXEL_SIZE:"(1.0 / vec2(160.0, 560.0))",SMAA_AREATEX_SUBTEX_SIZE:"(1.0 / 7.0)"},uniforms:{tDiffuse:new t.Uniform(null),tArea:new t.Uniform(null),tSearch:new t.Uniform(null),texelSize:new t.Uniform(e)},fragmentShader:le,vertexShader:ce,depthWrite:!1,depthTest:!1}));return n.areaImage=oe,n.searchImage=se,n}return f(r,e),r}(t.ShaderMaterial),ue="uniform sampler2D tDiffuse;\r\nuniform float middleGrey;\r\nuniform float maxLuminance;\r\nuniform vec3 luminanceCoefficients;\r\n\r\n#ifdef ADAPTED_LUMINANCE\r\n\r\n\tuniform sampler2D luminanceMap;\r\n\r\n#else\r\n\r\n\tuniform float averageLuminance;\r\n\r\n#endif\r\n\r\nvarying vec2 vUv;\r\n\r\nvec3 toneMap(vec3 c) {\r\n\r\n\t#ifdef ADAPTED_LUMINANCE\r\n\r\n\t\t// Get the calculated average luminance by sampling the center.\r\n\t\tfloat lumAvg = texture2D(luminanceMap, vec2(0.5)).r;\r\n\r\n\t#else\r\n\r\n\t\tfloat lumAvg = averageLuminance;\r\n\r\n\t#endif\r\n\r\n\t// Calculate the luminance of the current pixel.\r\n\tfloat lumPixel = dot(c, luminanceCoefficients);\r\n\r\n\t// Apply the modified operator (Reinhard Eq. 4).\r\n\tfloat lumScaled = (lumPixel * middleGrey) / lumAvg;\r\n\r\n\tfloat lumCompressed = (lumScaled * (1.0 + (lumScaled / (maxLuminance * maxLuminance)))) / (1.0 + lumScaled);\r\n\r\n\treturn lumCompressed * c;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tgl_FragColor = vec4(toneMap(texel.rgb), texel.a);\r\n\r\n}\r\n",de="varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n",ve=function(e){function r(){return l(this,r),u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{type:"ToneMappingMaterial",uniforms:{tDiffuse:new t.Uniform(null),luminanceMap:new t.Uniform(null),averageLuminance:new t.Uniform(1),luminanceCoefficients:new t.Uniform(new t.Vector3(.2126,.7152,.0722)),maxLuminance:new t.Uniform(16),middleGrey:new t.Uniform(.6)},fragmentShader:ue,vertexShader:de,depthWrite:!1,depthTest:!1}))}return f(r,e),r}(t.ShaderMaterial),he=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new t.Scene,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new t.OrthographicCamera(-1,1,1,-1,0,1),i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new t.Mesh(new t.PlaneBufferGeometry(2,2),null);l(this,e),this.name="Pass",this.scene=r,this.camera=n,this.quad=i,null!==this.quad&&(this.quad.frustumCulled=!1,null!==this.scene&&this.scene.add(this.quad)),this.needsSwap=!1,this.enabled=!0,this.renderToScreen=!1;}return c(e,[{key:"render",value:function(e,t,r,n,i){throw new Error("Render method not implemented!")}},{key:"setSize",value:function(e,t){}},{key:"initialise",value:function(e,t){}},{key:"dispose",value:function(){var e=Object.keys(this),t=void 0,r=!0,n=!1,i=void 0;try{for(var a,o=e[Symbol.iterator]();!(r=(a=o.next()).done);r=!0)null!==this[t=a.value]&&"function"==typeof this[t].dispose&&(this[t].dispose(),this[t]=null);}catch(e){n=!0,i=e;}finally{try{!r&&o.return&&o.return();}finally{if(n)throw i}}}}]),e}(),me=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.name="BlurPass",n.needsSwap=!0,n.renderTargetX=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,magFilter:t.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),n.renderTargetX.texture.name="Blur.TargetX",n.renderTargetX.texture.generateMipmaps=!1,n.renderTargetY=n.renderTargetX.clone(),n.renderTargetY.texture.name="Blur.TargetY",n.resolutionScale=void 0!==e.resolutionScale?e.resolutionScale:.5,n.convolutionMaterial=new b,n.kernelSize=e.kernelSize,n.quad.material=n.convolutionMaterial,n}return f(r,he),c(r,[{key:"render",value:function(e,t,r){var n=this.scene,i=this.camera,a=this.renderTargetX,o=this.renderTargetY,s=this.convolutionMaterial,l=s.uniforms,c=s.getKernel(),f=t,u=void 0,d=void 0,v=void 0;for(d=0,v=c.length-1;d<v;++d)u=d%2==0?a:o,l.kernel.value=c[d],l.tDiffuse.value=f.texture,e.render(n,i,u),f=u;l.kernel.value=c[d],l.tDiffuse.value=f.texture,e.render(n,i,this.renderToScreen?null:r);}},{key:"initialise",value:function(e,r){r||(this.renderTargetX.texture.format=t.RGBFormat,this.renderTargetY.texture.format=t.RGBFormat);}},{key:"setSize",value:function(e,t){e=Math.max(1,Math.floor(e*this.resolutionScale)),t=Math.max(1,Math.floor(t*this.resolutionScale)),this.renderTargetX.setSize(e,t),this.renderTargetY.setSize(e,t),this.convolutionMaterial.setTexelSize(1/e,1/t);}},{key:"width",get:function(){return this.renderTargetX.width}},{key:"height",get:function(){return this.renderTargetX.height}},{key:"kernelSize",get:function(){return this.convolutionMaterial.kernelSize},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A.LARGE;this.convolutionMaterial.kernelSize=e;}}]),r}(),pe=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.name="BloomPass",n.needsSwap=!0,n.blurPass=new me(e),n.renderTarget=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,magFilter:t.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),n.renderTarget.texture.name="Bloom.Target",n.renderTarget.texture.generateMipmaps=!1,n.combineMaterial=new D(void 0===e.screenMode||e.screenMode),n.intensity=e.intensity,n.luminosityMaterial=new q(!0),n.distinction=e.distinction,n}return f(r,he),c(r,[{key:"render",value:function(e,t,r){var n=this.quad,i=this.scene,a=this.camera,o=this.blurPass,s=this.luminosityMaterial,l=this.combineMaterial,c=this.renderTarget;n.material=s,s.uniforms.tDiffuse.value=t.texture,e.render(i,a,c),o.render(e,c,c),n.material=l,l.uniforms.texture1.value=t.texture,l.uniforms.texture2.value=c.texture,e.render(i,a,this.renderToScreen?null:r);}},{key:"initialise",value:function(e,r){this.blurPass.initialise(e,r),r||(this.renderTarget.texture.format=t.RGBFormat);}},{key:"setSize",value:function(e,t){this.blurPass.setSize(e,t),e=this.blurPass.width,t=this.blurPass.height,this.renderTarget.setSize(e,t);}},{key:"resolutionScale",get:function(){return this.blurPass.resolutionScale},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.5;this.blurPass.resolutionScale=e;}},{key:"kernelSize",get:function(){return this.blurPass.kernelSize},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A.LARGE;this.blurPass.kernelSize=e;}},{key:"intensity",get:function(){return this.combineMaterial.uniforms.opacity2.value},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.combineMaterial.uniforms.opacity2.value=e;}},{key:"distinction",get:function(){return this.luminosityMaterial.uniforms.distinction.value},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.luminosityMaterial.uniforms.distinction.value=e;}}]),r}(),xe=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(this,t);var n=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.name="BokehPass",n.needsSwap=!0,n.bokehMaterial=new m(e,r),n.quad.material=n.bokehMaterial,n}return f(t,he),c(t,[{key:"render",value:function(e,t,r){this.bokehMaterial.uniforms.tDiffuse.value=t.texture,this.bokehMaterial.uniforms.tDepth.value=t.depthTexture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.bokehMaterial.uniforms.aspect.value=e/t;}}]),t}(),ge=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(this,t);var n=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.name="Bokeh2Pass",n.needsSwap=!0,n.bokehMaterial=new g(e,r),n.quad.material=n.bokehMaterial,n}return f(t,he),c(t,[{key:"render",value:function(e,t,r){this.bokehMaterial.uniforms.tDiffuse.value=t.texture,this.bokehMaterial.uniforms.tDepth.value=t.depthTexture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.bokehMaterial.setTexelSize(1/e,1/t);}}]),t}(),ye=function(e){function t(){l(this,t);var e=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,null,null,null));return e.name="ClearMaskPass",e}return f(t,he),c(t,[{key:"render",value:function(e){e.state.buffers.stencil.setTest(!1);}}]),t}(),Se=new t.Color,De=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,t);var r=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,null,null,null));return r.name="ClearPass",r.clearColor=void 0!==e.clearColor?e.clearColor:null,r.clearAlpha=void 0!==e.clearAlpha?e.clearAlpha:0,r}return f(t,he),c(t,[{key:"render",value:function(e,t){var r=this.clearColor,n=void 0;null!==r&&(Se.copy(e.getClearColor()),n=e.getClearAlpha(),e.setClearColor(r,this.clearAlpha)),e.setRenderTarget(this.renderToScreen?null:t),e.clear(),null!==r&&e.setClearColor(Se,n);}}]),t}(),Me=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,t);var r=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.name="DotScreenPass",r.needsSwap=!0,r.material=new N(e.average),void 0!==e.angle&&(r.material.uniforms.angle.value=e.angle),void 0!==e.scale&&(r.material.uniforms.scale.value=e.scale),void 0!==e.intensity&&(r.material.uniforms.intensity.value=e.intensity),r.quad.material=r.material,r}return f(t,he),c(t,[{key:"render",value:function(e,t,r){this.material.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){e=Math.max(1,e),t=Math.max(1,t),this.material.uniforms.offsetRepeat.value.z=e,this.material.uniforms.offsetRepeat.value.w=t;}}]),t}(),we=function(e){function t(e){l(this,t);var r=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.name="DepthPass",r.needsSwap=!0,r.depthMaterial=new E(e),r.quad.material=r.depthMaterial,r}return f(t,he),c(t,[{key:"render",value:function(e,t,r){this.depthMaterial.uniforms.tDepth.value=t.depthTexture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}}]),t}(),be=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,t);var r=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.name="FilmPass",r.needsSwap=!0,r.material=new R(e),r.quad.material=r.material,r.scanlineDensity=void 0===e.scanlineDensity?1.25:e.scanlineDensity,r}return f(t,he),c(t,[{key:"render",value:function(e,t,r,n){this.material.uniforms.tDiffuse.value=t.texture,this.material.uniforms.time.value+=n,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.material.uniforms.scanlineCount.value=Math.round(t*this.scanlineDensity);}}]),t}(),Te=function(e){function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,i);var t=u(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return t.name="GlitchPass",t.needsSwap=!0,t.material=new X,t.quad.material=t.material,t.texture=null,t.perturbMap=void 0!==e.perturbMap?e.perturbMap:t.generatePerturbMap(e.dtSize),t.perturbMap.name="Glitch.Perturbation",t.perturbMap.generateMipmaps=!1,t.mode=Ae.SPORADIC,t.counter=0,t.breakPoint=r(120,240),t}return f(i,he),c(i,[{key:"generatePerturbMap",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:64,r=e*e,n=new Float32Array(3*r),i=this.perturbMap,a=void 0,o=void 0;for(a=0;a<r;++a)o=Math.random(),n[3*a]=o,n[3*a+1]=o,n[3*a+2]=o;return null!==i&&i.dispose(),i=new t.DataTexture(n,e,e,t.RGBFormat,t.FloatType),i.needsUpdate=!0,this.perturbMap=i,i}},{key:"render",value:function(e,t,i){var a=this.mode,o=this.counter,s=this.breakPoint,l=this.material.uniforms;l.tDiffuse.value=t.texture,l.seed.value=Math.random(),l.active.value=!0,o%s==0||a===Ae.CONSTANT_WILD?(l.amount.value=Math.random()/30,l.angle.value=n(-Math.PI,Math.PI),l.seedX.value=n(-1,1),l.seedY.value=n(-1,1),l.distortionX.value=n(0,1),l.distortionY.value=n(0,1),this.breakPoint=r(120,240),this.counter=0):o%s<s/5||a===Ae.CONSTANT_MILD?(l.amount.value=Math.random()/90,l.angle.value=n(-Math.PI,Math.PI),l.distortionX.value=n(0,1),l.distortionY.value=n(0,1),l.seedX.value=n(-.3,.3),l.seedY.value=n(-.3,.3)):l.active.value=!1,++this.counter,e.render(this.scene,this.camera,this.renderToScreen?null:i);}},{key:"perturbMap",get:function(){return this.texture},set:function(e){this.texture=e,this.material.uniforms.tPerturb.value=e;}}]),i}(),Ae={SPORADIC:0,CONSTANT_MILD:1,CONSTANT_WILD:2},Ue=function(e){function t(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};l(this,t);var i=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,r,null));return i.name="RenderPass",i.clearPass=new De(n),i.overrideMaterial=void 0!==n.overrideMaterial?n.overrideMaterial:null,i.clearDepth=void 0!==n.clearDepth&&n.clearDepth,i.clear=void 0===n.clear||n.clear,i}return f(t,he),c(t,[{key:"render",value:function(e,t){var r=this.scene,n=this.renderToScreen?null:t;this.clear?this.clearPass.render(e,n):this.clearDepth&&(e.setRenderTarget(n),e.clearDepth()),r.overrideMaterial=this.overrideMaterial,e.render(r,this.camera,n),r.overrideMaterial=null;}}]),t}(),Pe=function(e){function r(e,n,i){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};l(this,r);var o=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return o.name="GodRaysPass",o.needsSwap=!0,o.lightScene=new t.Scene,o.mainScene=e,o.mainCamera=n,o.renderPassLight=new Ue(o.lightScene,o.mainCamera),o.renderPassMask=new Ue(o.mainScene,o.mainCamera,{overrideMaterial:new t.MeshBasicMaterial({color:0}),clearColor:new t.Color(0)}),o.renderPassMask.clear=!1,o.blurPass=new me(a),o.renderTargetX=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,magFilter:t.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),o.renderTargetX.texture.name="GodRays.TargetX",o.renderTargetX.texture.generateMipmaps=!1,o.renderTargetY=o.renderTargetX.clone(),o.renderTargetY.texture.name="GodRays.TargetY",o.renderTargetMask=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,magFilter:t.LinearFilter}),o.renderTargetMask.texture.name="GodRays.Mask",o.renderTargetMask.texture.generateMipmaps=!1,o.lightSource=i,o.screenPosition=new t.Vector3,o.godRaysMaterial=new H,o.godRaysMaterial.uniforms.lightPosition.value=o.screenPosition,void 0!==a.exposure&&(o.godRaysMaterial.uniforms.exposure.value=a.exposure),void 0!==a.density&&(o.godRaysMaterial.uniforms.density.value=a.density),void 0!==a.decay&&(o.godRaysMaterial.uniforms.decay.value=a.decay),void 0!==a.weight&&(o.godRaysMaterial.uniforms.weight.value=a.weight),void 0!==a.clampMax&&(o.godRaysMaterial.uniforms.clampMax.value=a.clampMax),o.samples=a.samples,o.combineMaterial=new D(void 0===a.screenMode||a.screenMode),o.intensity=a.intensity,o}return f(r,he),c(r,[{key:"render",value:function(e,t,r){var n=this.quad,a=this.scene,o=this.camera,s=this.mainScene,l=this.lightSource,c=this.screenPosition,f=this.godRaysMaterial,u=this.combineMaterial,d=this.renderTargetMask,v=this.renderTargetX,h=this.renderTargetY,m=void 0,p=void 0;c.copy(l.position).project(this.mainCamera),c.x=i(.5*(c.x+1),0,1),c.y=i(.5*(c.y+1),0,1),p=l.parent,m=s.background,s.background=null,this.lightScene.add(l),this.renderPassLight.render(e,d),this.renderPassMask.render(e,d),null!==p&&p.add(l),s.background=m,this.blurPass.render(e,d,v),n.material=f,f.uniforms.tDiffuse.value=v.texture,e.render(a,o,h),n.material=u,u.uniforms.texture1.value=t.texture,u.uniforms.texture2.value=h.texture,e.render(a,o,this.renderToScreen?null:r);}},{key:"initialise",value:function(e,r){this.renderPassLight.initialise(e,r),this.renderPassMask.initialise(e,r),this.blurPass.initialise(e,r),r||(this.renderTargetMask.texture.format=t.RGBFormat,this.renderTargetX.texture.format=t.RGBFormat,this.renderTargetY.texture.format=t.RGBFormat);}},{key:"setSize",value:function(e,t){this.renderPassLight.setSize(e,t),this.renderPassMask.setSize(e,t),this.blurPass.setSize(e,t),e=this.blurPass.width,t=this.blurPass.height,this.renderTargetMask.setSize(e,t),this.renderTargetX.setSize(e,t),this.renderTargetY.setSize(e,t);}},{key:"resolutionScale",get:function(){return this.blurPass.resolutionScale},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.5;this.blurPass.resolutionScale=e;}},{key:"kernelSize",get:function(){return this.blurPass.kernelSize},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A.LARGE;this.blurPass.kernelSize=e;}},{key:"intensity",get:function(){return this.combineMaterial.uniforms.opacity2.value},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.combineMaterial.uniforms.opacity2.value=e;}},{key:"samples",get:function(){return Number.parseInt(this.godRaysMaterial.defines.NUM_SAMPLES_INT)},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:60;e=Math.floor(e),this.godRaysMaterial.defines.NUM_SAMPLES_FLOAT=e.toFixed(1),this.godRaysMaterial.defines.NUM_SAMPLES_INT=e.toFixed(0),this.godRaysMaterial.needsUpdate=!0;}}]),r}(),Oe=function(e){function t(e,r){l(this,t);var n=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,r,null));return n.name="MaskPass",n.inverse=!1,n.clearStencil=!0,n}return f(t,he),c(t,[{key:"render",value:function(e,t,r){var n=e.context,i=e.state,a=this.scene,o=this.camera,s=this.inverse?0:1,l=1-s;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),i.buffers.stencil.setFunc(n.ALWAYS,s,4294967295),i.buffers.stencil.setClear(l),this.clearStencil&&(e.setRenderTarget(t),e.clearStencil(),e.setRenderTarget(r),e.clearStencil()),e.render(a,o,t),e.render(a,o,r),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.stencil.setFunc(n.EQUAL,1,4294967295),i.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP);}}]),t}(),Le=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:30;l(this,t);var r=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.name="PixelationPass",r.needsSwap=!0,r.pixelationMaterial=new J,r.granularity=e,r.quad.material=r.pixelationMaterial,r}return f(t,he),c(t,[{key:"render",value:function(e,t,r){this.pixelationMaterial.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.pixelationMaterial.setResolution(e,t);}},{key:"granularity",get:function(){return this.pixelationMaterial.granularity},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:30;(e=Math.floor(e))%2>0&&(e+=1),this.pixelationMaterial.granularity=e;}}]),t}(),Ce=function(e){function r(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];l(this,r);var i=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return i.name="SavePass",i.material=new O,i.quad.material=i.material,i.renderTarget=void 0!==e?e:new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,magFilter:t.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),i.renderTarget.texture.name="Save.Target",i.renderTarget.texture.generateMipmaps=!1,i.resize=n,i}return f(r,he),c(r,[{key:"render",value:function(e,t){this.material.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderTarget);}},{key:"initialise",value:function(e,r){r||(this.renderTarget.texture.format=t.RGBFormat);}},{key:"setSize",value:function(e,t){this.resize&&(e=Math.max(1,e),t=Math.max(1,t),this.renderTarget.setSize(e,t));}}]),r}(),Ee=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"tDiffuse";l(this,t);var n=u(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.name="ShaderPass",n.needsSwap=!0,n.material=e,n.quad.material=n.material,n.textureID=r,n}return f(t,he),c(t,[{key:"render",value:function(e,t,r){void 0!==this.material.uniforms[this.textureID]&&(this.material.uniforms[this.textureID].value=t.texture),e.render(this.scene,this.camera,this.renderToScreen?null:r);}}]),t}(),ze=.5*Math.PI,Fe=new t.Vector3,Ne=new t.Vector3,Be=function(e){function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new t.Vector3,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};l(this,r);var a=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return a.name="ShockWavePass",a.needsSwap=!0,a.mainCamera=e,a.epicenter=n,a.screenPosition=new t.Vector3,a.speed=void 0!==i.speed?i.speed:2,a.time=0,a.active=!1,a.shockWaveMaterial=new $(i),a.shockWaveMaterial.uniforms.center.value=a.screenPosition,a.copyMaterial=new O,a}return f(r,he),c(r,[{key:"explode",value:function(){this.time=0,this.active=!0;}},{key:"render",value:function(e,t,r,n){var i=this.epicenter,a=this.mainCamera,o=this.screenPosition,s=this.shockWaveMaterial,l=s.uniforms,c=l.center,f=l.radius,u=l.maxRadius,d=l.waveSize;this.copyMaterial.uniforms.tDiffuse.value=t.texture,this.quad.material=this.copyMaterial,this.active&&(a.getWorldDirection(Fe),Ne.copy(a.position).sub(i),Fe.angleTo(Ne)>ze&&(l.cameraDistance.value=a.position.distanceTo(i),o.copy(i).project(a),c.value.x=.5*(o.x+1),c.value.y=.5*(o.y+1),l.tDiffuse.value=t.texture,this.quad.material=s),this.time+=n*this.speed,f.value=this.time-d.value,f.value>=2*(u.value+d.value)&&(this.active=!1)),e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.shockWaveMaterial.uniforms.aspect.value=e/t;}}]),r}(),ke=function(e){function r(e){l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));n.name="SMAAPass",n.needsSwap=!0,n.renderTargetColorEdges=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearFilter,format:t.RGBFormat,stencilBuffer:!1,depthBuffer:!1}),n.renderTargetColorEdges.texture.name="SMAA.ColorEdges",n.renderTargetColorEdges.texture.generateMipmaps=!1,n.renderTargetWeights=n.renderTargetColorEdges.clone(),n.renderTargetWeights.texture.name="SMAA.Weights",n.renderTargetWeights.texture.format=t.RGBAFormat,n.colorEdgesMaterial=new ae,n.weightsMaterial=new fe;var i=new e;i.src=n.weightsMaterial.areaImage;var a=new t.Texture;a.image=i,a.name="SMAA.Area",a.minFilter=t.LinearFilter,a.format=t.RGBFormat,a.generateMipmaps=!1,a.needsUpdate=!0,a.flipY=!1;var o=new e;o.src=n.weightsMaterial.searchImage;var s=new t.Texture;return s.image=o,s.name="SMAA.Search",s.magFilter=t.NearestFilter,s.minFilter=t.NearestFilter,s.generateMipmaps=!1,s.needsUpdate=!0,s.flipY=!1,n.weightsMaterial.uniforms.tDiffuse.value=n.renderTargetColorEdges.texture,n.weightsMaterial.uniforms.tArea.value=a,n.weightsMaterial.uniforms.tSearch.value=s,n.blendMaterial=new re,n.blendMaterial.uniforms.tWeights.value=n.renderTargetWeights.texture,n.quad.material=n.blendMaterial,n}return f(r,he),c(r,[{key:"render",value:function(e,t,r){this.quad.material=this.colorEdgesMaterial,this.colorEdgesMaterial.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderTargetColorEdges,!0),this.quad.material=this.weightsMaterial,e.render(this.scene,this.camera,this.renderTargetWeights,!1),this.quad.material=this.blendMaterial,this.blendMaterial.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"setSize",value:function(e,t){this.renderTargetColorEdges.setSize(e,t),this.renderTargetWeights.setSize(e,t),this.colorEdgesMaterial.uniforms.texelSize.value.copy(this.weightsMaterial.uniforms.texelSize.value.copy(this.blendMaterial.uniforms.texelSize.value.set(1/e,1/t)));}}]),r}(),Re=function(e){function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;l(this,r);var i=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return i.name="TexturePass",i.copyMaterial=new O,i.copyMaterial.blending=t.AdditiveBlending,i.copyMaterial.transparent=!0,i.texture=e,i.opacity=n,i.quad.material=i.copyMaterial,i}return f(r,he),c(r,[{key:"render",value:function(e,t){e.render(this.scene,this.camera,this.renderToScreen?null:t);}},{key:"texture",get:function(){return this.copyMaterial.uniforms.tDiffuse.value},set:function(e){this.copyMaterial.uniforms.tDiffuse.value=e;}},{key:"opacity",get:function(){return this.copyMaterial.uniforms.opacity.value},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.copyMaterial.uniforms.opacity.value=e;}}]),r}(),je=function(e){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l(this,r);var n=u(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.name="ToneMappingPass",n.needsSwap=!0,n.renderTargetLuminosity=new t.WebGLRenderTarget(1,1,{minFilter:t.LinearMipMapLinearFilter,magFilter:t.LinearFilter,format:t.RGBFormat,stencilBuffer:!1,depthBuffer:!1}),n.renderTargetLuminosity.texture.name="ToneMapping.Luminosity",n.renderTargetAdapted=n.renderTargetLuminosity.clone(),n.renderTargetAdapted.texture.name="ToneMapping.AdaptedLuminosity",n.renderTargetAdapted.texture.generateMipmaps=!1,n.renderTargetAdapted.texture.minFilter=t.LinearFilter,n.renderTargetPrevious=n.renderTargetAdapted.clone(),n.renderTargetPrevious.texture.name="ToneMapping.PreviousLuminosity",n.copyMaterial=new O,n.luminosityMaterial=new q,n.luminosityMaterial.uniforms.distinction.value=void 0!==e.distinction?e.distinction:1,n.adaptiveLuminosityMaterial=new d,n.resolution=e.resolution,n.toneMappingMaterial=new ve,n.adaptive=e.adaptive,n}return f(r,he),c(r,[{key:"render",value:function(e,t,r,n){var i=this.quad,a=this.scene,o=this.camera,s=this.adaptiveLuminosityMaterial,l=this.luminosityMaterial,c=this.toneMappingMaterial,f=this.copyMaterial,u=this.renderTargetPrevious,d=this.renderTargetLuminosity,v=this.renderTargetAdapted;this.adaptive&&(i.material=l,l.uniforms.tDiffuse.value=t.texture,e.render(a,o,d),i.material=s,s.uniforms.delta.value=n,s.uniforms.tPreviousLum.value=u.texture,s.uniforms.tCurrentLum.value=d.texture,e.render(a,o,v),i.material=f,f.uniforms.tDiffuse.value=v.texture,e.render(a,o,u)),i.material=c,c.uniforms.tDiffuse.value=t.texture,e.render(this.scene,this.camera,this.renderToScreen?null:r);}},{key:"initialise",value:function(e){this.quad.material=new t.MeshBasicMaterial({color:8388607}),e.render(this.scene,this.camera,this.renderTargetPrevious),this.quad.material.dispose();}},{key:"resolution",get:function(){return this.renderTargetLuminosity.width},set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:256;e=a(e),this.renderTargetLuminosity.setSize(e,e),this.renderTargetPrevious.setSize(e,e),this.renderTargetAdapted.setSize(e,e),this.adaptiveLuminosityMaterial.defines.MIP_LEVEL_1X1=(Math.round(Math.log(e))/Math.log(2)).toFixed(1),this.adaptiveLuminosityMaterial.needsUpdate=!0;}},{key:"adaptive",get:function(){return void 0!==this.toneMappingMaterial.defines.ADAPTED_LUMINANCE},set:function(){!(arguments.length>0&&void 0!==arguments[0])||arguments[0]?(this.toneMappingMaterial.defines.ADAPTED_LUMINANCE="1",this.toneMappingMaterial.uniforms.luminanceMap.value=this.renderTargetAdapted.texture):(delete this.toneMappingMaterial.defines.ADAPTED_LUMINANCE,this.toneMappingMaterial.uniforms.luminanceMap.value=null),this.toneMappingMaterial.needsUpdate=!0;}}]),r}(),We=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(this,e),this.renderer=t,this.readBuffer=null,this.writeBuffer=null,null!==this.renderer&&(this.renderer.autoClear=!1,this.readBuffer=this.createBuffer(void 0===r.depthBuffer||r.depthBuffer,void 0!==r.stencilBuffer&&r.stencilBuffer,void 0!==r.depthTexture&&r.depthTexture),this.writeBuffer=this.readBuffer.clone()),this.copyPass=new Ee(new O),this.passes=[];}return c(e,[{key:"replaceRenderer",value:function(e){var t=this.renderer,r=void 0,n=void 0,i=void 0;return null!==t&&t!==e&&(this.renderer=e,this.renderer.autoClear=!1,r=t.domElement.parentNode,n=t.getSize(),i=e.getSize(),null!==r&&(r.removeChild(t.domElement),r.appendChild(e.domElement)),n.width===i.width&&n.height===i.height||this.setSize()),t}},{key:"createBuffer",value:function(e,r,n){var i=this.renderer.getSize(),a=this.renderer.getPixelRatio(),o=this.renderer.context.getContextAttributes().alpha,s=new t.WebGLRenderTarget(i.width*a,i.height*a,{minFilter:t.LinearFilter,magFilter:t.LinearFilter,format:o?t.RGBAFormat:t.RGBFormat,depthBuffer:e,stencilBuffer:r,depthTexture:n?new t.DepthTexture:null});return n&&r&&(s.depthTexture.format=t.DepthStencilFormat,s.depthTexture.type=t.UnsignedInt248Type),s.texture.name="EffectComposer.Buffer",s.texture.generateMipmaps=!1,s}},{key:"addPass",value:function(e,t){var r=this.renderer,n=r.getSize(),i=r.getPixelRatio();e.setSize(n.width*i,n.height*i),e.initialise(r,r.context.getContextAttributes().alpha),void 0!==t?this.passes.splice(t,0,e):this.passes.push(e);}},{key:"removePass",value:function(e){this.passes.splice(this.passes.indexOf(e),1);}},{key:"render",value:function(e){var t=this.passes,r=this.renderer,n=this.copyPass,i=this.readBuffer,a=this.writeBuffer,o=!1,s=void 0,l=void 0,c=void 0,f=void 0,u=void 0;for(f=0,u=t.length;f<u;++f)(s=t[f]).enabled&&(s.render(r,i,a,e,o),s.needsSwap&&(o&&((l=r.context).stencilFunc(l.NOTEQUAL,1,4294967295),n.render(r,i,a),l.stencilFunc(l.EQUAL,1,4294967295)),c=i,i=a,a=c),s instanceof Oe?o=!0:s instanceof ye&&(o=!1));}},{key:"setSize",value:function(e,t){var r=this.passes,n=this.renderer.getSize(),i=this.renderer.getPixelRatio(),a=void 0,o=void 0;for(void 0!==e&&void 0!==t||(e=n.width,t=n.height),this.renderer.setSize(e,t),e*=i,t*=i,this.readBuffer.setSize(e,t),this.writeBuffer.setSize(e,t),a=0,o=r.length;a<o;++a)r[a].setSize(e,t);}},{key:"reset",value:function(e){var t=this.readBuffer.depthBuffer,r=this.readBuffer.stencilBuffer,n=null!==this.readBuffer.depthTexture;this.dispose(void 0===e?this.createBuffer(t,r,n):e);}},{key:"dispose",value:function(e){var t=this.passes;for(null!==this.readBuffer&&null!==this.writeBuffer&&(this.readBuffer.dispose(),this.writeBuffer.dispose(),this.readBuffer=null,this.writeBuffer=null);t.length>0;)t.pop().dispose();void 0!==e?(this.readBuffer=e,this.writeBuffer=this.readBuffer.clone()):this.copyPass.dispose();}},{key:"depthTexture",get:function(){return this.readBuffer.depthTexture},set:function(e){this.readBuffer.depthTexture=e,this.writeBuffer.depthTexture=e;}}]),e}();e.EffectComposer=We,e.BloomPass=pe,e.BlurPass=me,e.BokehPass=xe,e.Bokeh2Pass=ge,e.ClearPass=De,e.ClearMaskPass=ye,e.DepthPass=we,e.DotScreenPass=Me,e.FilmPass=be,e.GlitchMode=Ae,e.GlitchPass=Te,e.GodRaysPass=Pe,e.MaskPass=Oe,e.Pass=he,e.PixelationPass=Le,e.RenderPass=Ue,e.SavePass=Ce,e.ShaderPass=Ee,e.ShockWavePass=Be,e.SMAAPass=ke,e.TexturePass=Re,e.ToneMappingPass=je,e.AdaptiveLuminosityMaterial=d,e.BokehMaterial=m,e.Bokeh2Material=g,e.CombineMaterial=D,e.ConvolutionMaterial=b,e.CopyMaterial=O,e.DepthMaterial=E,e.DotScreenMaterial=N,e.FilmMaterial=R,e.GlitchMaterial=X,e.GodRaysMaterial=H,e.KernelSize=A,e.LuminosityMaterial=q,e.PixelationMaterial=J,e.ShockWaveMaterial=$,e.SMAABlendMaterial=re,e.SMAAColorEdgesMaterial=ae,e.SMAAWeightsMaterial=fe,e.ToneMappingMaterial=ve,Object.defineProperty(e,"__esModule",{value:!0});});
});

unwrapExports(postprocessing);
var postprocessing_1 = postprocessing.EffectComposer;
var postprocessing_2 = postprocessing.RenderPass;
var postprocessing_3 = postprocessing.GodRaysPass;
var postprocessing_4 = postprocessing.KernelSize;
var postprocessing_5 = postprocessing.ClearMaskPass;
var postprocessing_6 = postprocessing.ShaderPass;
var postprocessing_7 = postprocessing.MaskPass;
var postprocessing_8 = postprocessing.ToneMappingPass;
var postprocessing_9 = postprocessing.CopyMaterial;

var textAlign = {
    center: new THREE.Vector2(0, 0),
    left: new THREE.Vector2(1, 0),
    topLeft: new THREE.Vector2(1, -1),
    topRight: new THREE.Vector2(-1, -1),
    right: new THREE.Vector2(-1, 0),
    bottomLeft: new THREE.Vector2(1, 1),
    bottomRight: new THREE.Vector2(-1, 1),
};
var fontHeightCache = {};
function getFontHeight(fontStyle) {
    var result = fontHeightCache[fontStyle];
    if (!result) {
        var body = document.getElementsByTagName('body')[0];
        var dummy = document.createElement('div');
        var dummyText = document.createTextNode('MÉq');
        dummy.appendChild(dummyText);
        dummy.setAttribute('style', "font:" + fontStyle + ";position:absolute;top:0;left:0");
        body.appendChild(dummy);
        result = dummy.offsetHeight;
        fontHeightCache[fontStyle] = result;
        body.removeChild(dummy);
    }
    return result;
}

var CanvasText = /** @class */ (function () {
    function CanvasText() {
        this.textWidth = null;
        this.textHeight = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    Object.defineProperty(CanvasText.prototype, "width", {
        get: function () {
            return this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasText.prototype, "height", {
        get: function () {
            return this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    CanvasText.prototype.drawText = function (text, ctxOptions) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = ctxOptions.font;
        this.textWidth = Math.ceil(this.ctx.measureText(text).width);
        this.textHeight = getFontHeight(this.ctx.font);
        // 判断画布头像
        var image = ctxOptions.canvas;
        if (image) {
            this.textWidth < image.width && (this.textWidth = image.width);
            this.textHeight += image.height + 20;
        }
        this.canvas.width = this.textWidth + 40;
        this.canvas.height = this.textHeight + 10;
        this.ctx.font = ctxOptions.font;
        // 判断背景图片
        if (ctxOptions.bgColor !== 'transparent' && text.length != 0) {
            this.ctx.fillStyle = ctxOptions.bgColor; // white filler
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // 判断画布头像
        if (image) {
            var top = 10;
            var left = this.canvas.width / 2 - image.width / 2;
            this.ctx.drawImage(image, 0, 0, image.width, image.height, left, top, image.width, image.height);
        }
        this.ctx.fillStyle = ctxOptions.fillStyle;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = ctxOptions.shadowColor;
        this.ctx.shadowBlur = ctxOptions.shadowBlur;
        this.ctx.shadowOffsetX = ctxOptions.shadowOffsetX;
        this.ctx.shadowOffsetY = ctxOptions.shadowOffsetY;
        if (image) {
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - 10);
        }
        else {
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        }
        return this.canvas;
    };
    return CanvasText;
}());

var Text2D = /** @class */ (function (_super) {
    __extends(Text2D, _super);
    function Text2D(text, options) {
        if (text === void 0) { text = ''; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._font = options.font || '30px Arial';
        _this._fillStyle = options.fillStyle || '#FFFFFF';
        _this._bgColor = options.bgColor || 'transparent';
        _this._shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0)';
        _this._shadowBlur = options.shadowBlur || 0;
        _this._shadowOffsetX = options.shadowOffsetX || 0;
        _this._shadowOffsetY = options.shadowOffsetY || 0;
        _this._headCanvas = options.canvas;
        _this.canvas = new CanvasText();
        _this.align = options.align || textAlign.center;
        _this.side = options.side || THREE.DoubleSide;
        // this.anchor = Label.fontAlignAnchor[ this._textAlign ]
        _this.antialias = (typeof options.antialias === "undefined") ? true : options.antialias;
        _this.text = text;
        return _this;
    }
    Object.defineProperty(Text2D.prototype, "width", {
        get: function () {
            return this.canvas.textWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2D.prototype, "height", {
        get: function () {
            return this.canvas.textHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2D.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            if (this._text !== value) {
                this._text = value;
                this.updateText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2D.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (value) {
            if (this._font !== value) {
                this._font = value;
                this.updateText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text2D.prototype, "fillStyle", {
        get: function () {
            return this._fillStyle;
        },
        set: function (value) {
            if (this._fillStyle !== value) {
                this._fillStyle = value;
                this.updateText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Text2D.prototype.cleanUp = function () {
        if (this.texture) {
            this.texture.dispose();
        }
    };
    Text2D.prototype.applyAntiAlias = function () {
        if (this.antialias === false) {
            this.texture.magFilter = THREE.NearestFilter;
            this.texture.minFilter = THREE.LinearMipMapLinearFilter;
        }
    };
    return Text2D;
}(THREE.Object3D));

var MeshText2D = /** @class */ (function (_super) {
    __extends(MeshText2D, _super);
    function MeshText2D(text, options) {
        if (text === void 0) { text = ''; }
        if (options === void 0) { options = {}; }
        return _super.call(this, text, options) || this;
    }
    MeshText2D.prototype.raycast = function () {
        this.mesh.raycast.apply(this.mesh, arguments);
    };
    MeshText2D.prototype.updateText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cleanUp(); // cleanup previous texture
                this.canvas.drawText(this._text, {
                    font: this._font,
                    fillStyle: this._fillStyle,
                    shadowBlur: this._shadowBlur,
                    shadowColor: this._shadowColor,
                    shadowOffsetX: this._shadowOffsetX,
                    shadowOffsetY: this._shadowOffsetY,
                    bgColor: this._bgColor,
                    canvas: this._headCanvas
                });
                this.texture = new THREE.Texture(this.canvas.canvas);
                this.texture.needsUpdate = true;
                this.applyAntiAlias();
                if (!this.material) {
                    this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: this.side });
                    this.material.transparent = true;
                }
                else {
                    this.material.map = this.texture;
                }
                if (!this.mesh) {
                    this.geometry = new THREE.PlaneGeometry(this.canvas.width, this.canvas.height);
                    this.mesh = new THREE.Mesh(this.geometry, this.material);
                    // @ts-ignore
                    this.add(this.mesh);
                }
                this.mesh.position.x = ((this.canvas.width / 2) - (this.canvas.textWidth / 2)) + ((this.canvas.textWidth / 2) * this.align.x);
                this.mesh.position.y = (-this.canvas.height / 2) + ((this.canvas.textHeight / 2) * this.align.y);
                // manually update geometry vertices
                this.geometry.vertices[0].x = this.geometry.vertices[2].x = -this.canvas.width / 2;
                this.geometry.vertices[1].x = this.geometry.vertices[3].x = this.canvas.width / 2;
                this.geometry.vertices[0].y = this.geometry.vertices[1].y = this.canvas.height / 2;
                this.geometry.vertices[2].y = this.geometry.vertices[3].y = -this.canvas.height / 2;
                this.geometry.verticesNeedUpdate = true;
                return [2 /*return*/];
            });
        });
    };
    return MeshText2D;
}(Text2D));

var Base = /** @class */ (function () {
    function Base(config) {
        this.$users = [];
        this.loaded = false;
        var dom = config.dom, callback = config.callback, _a = config.backgroundType, backgroundType = _a === void 0 ? '2D' : _a, backgroundImage = config.backgroundImage;
        this.dom = dom;
        this.callback = callback;
        this.backgroundType = backgroundType;
        this.backgroundImage = backgroundImage;
        this.group = new THREE.Group();
        this.scene = new THREE.Scene();
    }
    Object.defineProperty(Base.prototype, "users", {
        /**
         * 设置参会人
         * @param users
         */
        set: function (users) {
            this.$users = users;
            if (!this.loaded && users.length !== 0) {
                this.callback('loading');
                this.init();
                this.loaded = true;
            }
            if (users.length === 0) {
                this.callback('not user');
            }
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.destroy = function () {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    };
    Base.prototype.initRender = function () {
        if (this.backgroundType === '3D') ;
        else {
            this.dom.style.backgroundImage = "url(" + this.backgroundImage + ")";
        }
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 20, 10000);
        this.camera.position.z = 3000;
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.left = '0px';
        this.dom.appendChild(this.renderer.domElement);
        this.createPassRender();
    };
    Base.clampToMaxSize = function (image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            var scale = maxSize / Math.max(image.width, image.height);
            // @ts-ignore
            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            return canvas;
        }
        return image;
    };
    Base.prototype.getTexture = function (url) {
        var _this = this;
        return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var textTure;
            return __generator(this, function (_a) {
                // 第一种方式获取
                textTure = new THREE.TextureLoader().load(url, function (texture) {
                    textTure.image = Base.clampToMaxSize(texture.image, 128);
                    res(textTure);
                }, function () {
                }, function () {
                    console.log('图片【' + url + '】下载错误');
                    res(textTure);
                });
                return [2 /*return*/];
            });
        }); });
    };
    return Base;
}());

var Artascope = /** @class */ (function () {
    function Artascope(options) {
        this.rotationSpeed = options.rotationSpeed;
        this.group = options.group;
        this.camera = options.camera;
        var vector = new THREE.Vector3();
        var objs = [];
        var radius = 200;
        var everyNum = 25;
        for (var i = 0; i < options.counter; i++) {
            var e = parseInt(String(i / everyNum), 10);
            var phi = Math.PI * (2 / everyNum) * (i % everyNum);
            var object = new THREE.Object3D();
            object.position.x = radius * Math.sin(phi);
            object.position.y = radius * Math.cos(phi);
            object.position.z = -e * 100 + 2800;
            vector.x = object.position.x * 2;
            vector.y = object.position.y * 2;
            vector.z = object.position.z;
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Artascope.prototype.tween = function (TWEEN) {
        var _a = this, rotationSpeed = _a.rotationSpeed, group = _a.group, camera = _a.camera;
        new TWEEN.Tween(camera.position)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(function () {
            group.rotation.z -= 0.001 * rotationSpeed;
        })
            .to({ z: 500 }, 10000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Artascope;
}());

var Grid = /** @class */ (function () {
    function Grid(options) {
        this.group = options.group;
        this.camera = options.camera;
        var objs = [];
        for (var i = 0; i < options.counter; i += 1) {
            var object = new THREE.Object3D();
            var offset = 180;
            var colmn = 8;
            object.position.x = ((i % colmn) * offset) - (offset * (colmn - 1)) / 2;
            object.position.y = (-(Math.floor(i / colmn) % colmn) * offset) + (offset * (colmn - 1)) / 2;
            object.position.z = (Math.floor(i / (colmn * colmn))) * 600 - 4000;
            objs.push(object);
        }
        this.objs = objs;
    }
    Grid.prototype.tween = function (TWEEN) {
        var Time = 5000;
        var _a = this, camera = _a.camera, group = _a.group;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var raio = 3000;
            var height = 250;
            return {
                z: randomNum(500, raio),
                x: randomNum(-height, height),
                y: randomNum(-height, height)
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                camera.lookAt(__assign({}, group.position));
            })
                .to(rand(), Time)
                .start();
        };
        tween();
    };
    return Grid;
}());

var Logo = /** @class */ (function () {
    function Logo(options) {
        var tableData = options.tableData;
        this.group = options.group;
        this.camera = options.camera;
        var objs = [];
        for (var i = 0; i < tableData.length; i++) {
            var object = new THREE.Object3D();
            var itemWidth = 35;
            // 增加向上，减少向下
            object.position.y = -(tableData[i][1] * itemWidth) + itemWidth * 32 / 2;
            // 减小向右，增加向左
            object.position.x = tableData[i][0] * itemWidth - itemWidth * 64 / 2;
            objs.push(object);
        }
        this.objs = objs;
    }
    Logo.prototype.tween = function (TWEEN) {
        var _a = this, camera = _a.camera, group = _a.group;
        var Time = 3000;
        var PositionUpdate = function (num) {
            num = num / 100;
            camera.position.y = num * 100;
            camera.position.x = num * 300;
            camera.lookAt(group.position);
        };
        var tween = new TWEEN.Tween({ Value: 0 })
            .to({ Value: 100 }, Time / 2)
            .easing(TWEEN.Easing.Back.InOut)
            .onUpdate(function (data) {
            PositionUpdate(data.Value);
            camera.position.z = 3000 - (3000 - 2500) * data.Value / 100;
        });
        var rotationTween = new TWEEN.Tween({ Value: 100 })
            .to({ Value: -100 }, Time)
            .easing(TWEEN.Easing.Back.InOut)
            .onUpdate(function (data) {
            PositionUpdate(data.Value);
        })
            .yoyo(true)
            .repeat(Infinity);
        tween.chain(rotationTween);
        tween.start();
        new TWEEN.Tween({ sunShine: 60 })
            .to({ sunShine: 100 }, Time / 2)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(function () {
            // let sunShine = data.sunShine / 100
            // this.GodRaysPass.godRaysMaterial.uniforms.density.value = sunShine
            // this.GodRaysPass.intensity = sunShine
        })
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Logo;
}());

var Helix = /** @class */ (function () {
    function Helix(options) {
        var vector = new THREE.Vector3();
        this.group = options.group;
        this.camera = options.camera;
        this.rotationSpeed = options.rotationSpeed;
        var objs = [];
        for (var i = 0; i < options.counter; i++) {
            var phi = i * 0.155 + Math.PI;
            var object = new THREE.Object3D();
            var radius = 500;
            object.position.x = radius * Math.sin(phi);
            object.position.y = -(i * 3) + radius / 2;
            object.position.z = radius * Math.cos(phi);
            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Helix.prototype.tween = function (TWEEN) {
        var Time = 5000;
        var _a = this, camera = _a.camera, group = _a.group, rotationSpeed = _a.rotationSpeed;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var radio = 1500;
            return {
                z: randomNum(-radio, radio),
                x: randomNum(-radio, radio),
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                camera.lookAt(__assign(__assign({}, group.position), { y: 0 }));
            })
                .to(rand(), Time)
                .start();
        };
        new TWEEN.Tween(group.position)
            .onUpdate(function () {
            group.rotation.y -= 0.001 * rotationSpeed;
        })
            .to({ y: 2000 }, Time * 10)
            .yoyo(true)
            .repeat(Infinity)
            .delay(1000)
            .start();
        tween();
    };
    return Helix;
}());

var Sphere = /** @class */ (function () {
    function Sphere(options) {
        this.lon = 90;
        this.group = options.group;
        this.camera = options.camera;
        var vector = new THREE.Vector3();
        var objs = [];
        for (var i = 0, length = options.counter; i < length; i++) {
            var phi = Math.acos(-1 + (2 * i) / length);
            var theta = Math.sqrt(length * Math.PI) * phi;
            var object = new THREE.Object3D();
            var radius = 850;
            object.position.x = radius * Math.cos(theta) * Math.sin(phi);
            object.position.y = radius * Math.sin(theta) * Math.sin(phi);
            object.position.z = radius * Math.cos(phi);
            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            objs.push(object);
        }
        this.objs = objs;
    }
    Sphere.prototype.tween = function () {
        var Time = 5000;
        var rotationSpeed = 0.2; // 旋转速度
        var _a = this, camera = _a.camera, group = _a.group;
        var rand = function () {
            //生成从minNum到maxNum的随机数
            function randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(String(Math.random() * minNum + 1), 10);
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    default:
                        return 0;
                }
            }
            // 随机位置的最大值
            var raio = 1500;
            return {
                z: randomNum(-raio, raio),
                x: randomNum(-raio, raio),
                y: randomNum(-raio, raio)
            };
        };
        var tween = function () {
            new TWEEN.Tween(camera.position)
                .onComplete(tween)
                .easing(TWEEN.Easing.Back.InOut)
                .onUpdate(function () {
                group.rotation.y -= 0.001 * rotationSpeed;
                camera.lookAt(group.position);
            })
                .to(rand(), Time)
                .start();
        };
        tween();
    };
    /**
     * 球体自转
     * @param speed
     */
    Sphere.prototype.rotation = function (speed) {
        if (speed === void 0) { speed = 0.5; }
        var group = this.group;
        new TWEEN.Tween({ val: 0 })
            .onUpdate(function () {
            group.rotation.y += 0.001 * speed;
        })
            .to({ val: 100 }, 5000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    /**
     * 摄像机旋转
     */
    Sphere.prototype.cameraRotation = function (speed) {
        var _this = this;
        if (speed === void 0) { speed = 0.5; }
        if (!this.lon) {
            this.lon = 90;
        }
        var camera = this.camera;
        var length = camera.position.length();
        var group = this.group;
        new TWEEN.Tween({ val: 0 })
            .onUpdate(function () {
            _this.lon += 0.1 * speed;
            var theta = THREE.Math.degToRad(_this.lon);
            camera.position.x = length * Math.cos(theta);
            camera.position.z = length * Math.sin(theta);
            camera.lookAt(group.position);
        })
            .to({ val: 100 }, 5000)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    };
    return Sphere;
}());



var animatesEffect = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Artascope: Artascope,
    Grid: Grid,
    Logo: Logo,
    Helix: Helix,
    Sphere: Sphere
});

var defaultShowOptions = [
    {
        type: 'variate',
        value: 'name'
    },
    {
        type: 'variate',
        value: 'avatar'
    }
];

var Lottery3d = /** @class */ (function (_super) {
    __extends(Lottery3d, _super);
    function Lottery3d(config) {
        var _this = _super.call(this, config) || this;
        _this.counter = 100;
        _this.turnSelectData = {};
        _this.showOption = config.showOption || defaultShowOptions;
        return _this;
    }
    Lottery3d.prototype.CaculatePosition = function (length) {
        var Position = this.camera.position.clone();
        return Position.setLength(length);
    };
    /**
     * 开始进入抽奖阶段
     */
    Lottery3d.prototype.LotteryInit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.enableInit) {
                reject('正在准备抽奖阶段');
                return;
            }
            _this.enableInit = true;
            var group = _this.group;
            group.add(_this.shineGroup);
            _this.GodRaysPass.renderPassMask = _this.ShineGroupMask;
            _this.toneMappingPass.enabled = true;
            TWEEN.removeAll();
            new TWEEN.Tween(_this.camera.position)
                .easing(TWEEN.Easing.Cubic.Out)
                .to(_this.CaculatePosition(3500), 500)
                .onUpdate(function () {
                _this.camera.lookAt(group.position);
            })
                .onComplete(function () {
                _this.enableInit = false;
                resolve();
            })
                .start();
        });
    };
    Lottery3d.prototype.stop = function () {
        // 减少的加速度
        new TWEEN.Tween(this.camera.position)
            .easing(TWEEN.Easing.Bounce.Out)
            .to(this.CaculatePosition(3000), 800)
            .start();
        new TWEEN.Tween(this.RotationSpeed)
            .easing(TWEEN.Easing.Exponential.Out)
            .to({ x: 0, y: 0, z: 0 }, 5000)
            .start();
    };
    Lottery3d.prototype.start = function (count) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, group, shineGroup, e_1, max, Complete;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.ready !== true) {
                            reject('动画尚未准备就绪，请稍后');
                            return [2 /*return*/];
                        }
                        _a = this, group = _a.group, shineGroup = _a.shineGroup;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.LotteryInit()];
                    case 2:
                        _b.sent();
                        TWEEN.removeAll();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        return [2 /*return*/];
                    case 4:
                        max = 3000;
                        this.RotationSpeed = {
                            x: _.random(0, max),
                            y: _.random(0, max),
                            z: _.random(0, max)
                        };
                        this.ready = false;
                        this.callback('lottery starting');
                        Complete = function () { return __awaiter(_this, void 0, void 0, function () {
                            var objs, users, pushShowUser;
                            var _a;
                            var _this = this;
                            return __generator(this, function (_b) {
                                this.ready = false;
                                objs = this.shineGroup.children;
                                users = [];
                                this.callback('lottery awarding');
                                pushShowUser = function () {
                                    for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
                                        var obj = objs_1[_i];
                                        _this.callback('showOne', obj._uInfo);
                                        // that.Vue.showOne(obj._uInfo)
                                        users.push(obj._uInfo);
                                    }
                                };
                                // if (!!this.Vue.roundConfig.isPaichu) {
                                //   // 中奖排除时的动作
                                //   if (objs.length <= 20)
                                //     // 完成每个头像挨个移除的动效
                                //     await (() => {
                                //       return new Promise(async resolve => {
                                //         let f
                                //         for (let obj of objs) {
                                //           await (() => {
                                //             return new Promise(R => {
                                //               setTimeout(() => {
                                //                 f = this.remove(obj).then(res => {
                                //                   this.Vue.showOne(obj._uInfo)
                                //                 })
                                //                 R()
                                //               }, 200)
                                //             })
                                //           })()
                                //           users.push(obj._uInfo)
                                //         }
                                //         // 最后一个remove结束之后执行
                                //         f.then(res => {
                                //           resolve(res)
                                //         })
                                //       })
                                //     })()
                                //   else
                                //     // 数量超过20个直接删除消失
                                //     pushShowUser()
                                //   this.shineGroup.remove(...objs)
                                // } else {
                                // }
                                pushShowUser();
                                (_a = this.group).add.apply(_a, objs);
                                this.lotteryAfter();
                                resolve(users);
                                return [2 /*return*/];
                            });
                        }); };
                        new TWEEN.Tween()
                            .onUpdate(function () {
                            var speed = _this.RotationSpeed;
                            var isEmpty = true;
                            for (var index in speed) {
                                var item = speed[index] * 0.0001;
                                item = item > 0 ? item : 0;
                                group.rotation[index] += item;
                                // 判断当前速度是否还有效
                                if (item > 0) {
                                    isEmpty = false;
                                }
                            }
                            // 恢复原来的状态
                            var shineChildren = shineGroup.children;
                            shineChildren.length > 0 && group.add.apply(group, shineChildren);
                            shineGroup.remove.apply(shineGroup, shineChildren);
                            var paixuObj = _this.getNearstObj(count);
                            shineGroup.add.apply(shineGroup, paixuObj);
                            // 判断是否速度都为0 结束游戏
                            if (isEmpty) {
                                TWEEN.removeAll();
                                Complete();
                            }
                        })
                            .repeat(Infinity)
                            .start();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
    * 抽奖动画结束后的处理
    */
    Lottery3d.prototype.lotteryAfter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.callback('lottery waiting');
                        return [4 /*yield*/, (function () {
                                return new Promise(function (resolve) {
                                    TWEEN.removeAll();
                                    new TWEEN.Tween(_this.camera.position)
                                        .easing(TWEEN.Easing.Cubic.Out)
                                        .to(_this.CaculatePosition(3000), 500)
                                        .onComplete(function () {
                                        resolve();
                                    })
                                        .start();
                                });
                            })()];
                    case 1:
                        _a.sent();
                        this.GodRaysPass.renderPassMask = this.GroupMask;
                        this.toneMappingPass.enabled = false;
                        this.group.remove(this.shineGroup);
                        this.transform(new Sphere({
                            counter: this.counter,
                            group: this.group,
                            camera: this.camera
                        }), 2000);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    * 获取离摄像机最近的n个元素
    */
    Lottery3d.prototype.getNearstObj = function (n, uInfo) {
        if (uInfo === void 0) { uInfo = true; }
        var group = this.group;
        var camera = this.camera;
        var paixuObj = _.orderBy(group.children, function (obj) {
            if (obj._uInfo || uInfo === false) {
                var vector = new THREE.Vector3();
                vector.subVectors(obj.getWorldPosition(), camera.position);
                return vector.length();
            }
        }, 'asc');
        paixuObj = _.filter(_.take(paixuObj, n), function (o) {
            if (uInfo === false) {
                return true;
            }
            return typeof o._uInfo !== 'undefined';
        });
        return paixuObj;
    };
    Lottery3d.prototype.transform = function (target, duration) {
        var _this = this;
        return new Promise(function (resolve) {
            try {
                var targets = target.objs;
                TWEEN.removeAll();
                _this.ready = false;
                target.scale && _this.group.scale.set(target.scale, target.scale, target.scale);
                var objarr = _this.group.children;
                for (var i = 0; i < objarr.length; i++) {
                    var object = objarr[i];
                    var target_1 = targets[i];
                    if (typeof (target_1) == 'undefined') {
                        continue;
                    }
                    new TWEEN.Tween(object.position)
                        .to({
                        x: target_1.position.x,
                        y: target_1.position.y,
                        z: target_1.position.z
                    }, Math.random() * duration + duration)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start();
                    new TWEEN.Tween(object.rotation)
                        .to({
                        x: target_1.rotation.x,
                        y: target_1.rotation.y,
                        z: target_1.rotation.z
                    }, Math.random() * duration + duration)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start();
                }
                setTimeout(function () {
                    target.cameraRotation && target.cameraRotation();
                    _this.ready = true;
                    resolve();
                }, duration * 2);
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    Lottery3d.turnSelect = function (uInfo, options) {
        var image = false;
        var out = '';
        var sexTurn = function (v) {
            if (v === 1)
                return '男';
            if (v === 2)
                return '女';
            return '未知';
        };
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var item = options_1[_i];
            // 文本
            if (item.type === 'text') {
                out += item.value;
            }
            // 变量
            if (item.type === 'variate') {
                var value = _.get(uInfo, item.value);
                if (item.value === 'sex') {
                    value = sexTurn(value);
                }
                if (item.value === 'avatar') {
                    if (!image) {
                        image = value;
                    }
                    value = '';
                }
                if (typeof value === 'undefined') {
                    value = '';
                }
                out += value;
            }
        }
        return {
            text: out || '未公开昵称',
            image: image
        };
    };
    Lottery3d.prototype.turnOutPut = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, image, text, texturn, e_2, $return;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.turnSelectData[user.openid]) {
                            return [2 /*return*/, this.turnSelectData[user.openid]];
                        }
                        _a = Lottery3d.turnSelect(user, this.showOption), image = _a.image, text = _a.text;
                        if (text === '未公开昵称') {
                            text = '';
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!(image !== false)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTexture(image)];
                    case 2:
                        texturn = _b.sent();
                        image = texturn.image;
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        image = false;
                        return [3 /*break*/, 5];
                    case 5:
                        $return = { text: text, image: image };
                        this.turnSelectData[user.openid] = $return;
                        return [2 /*return*/, $return];
                }
            });
        });
    };
    Lottery3d.prototype.createMesh = function (user, position) {
        if (position === void 0) { position = false; }
        return __awaiter(this, void 0, void 0, function () {
            var mesh, output, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        mesh = void 0;
                        if (!(user === false)) return [3 /*break*/, 1];
                        mesh = new MeshText2D('暂无', {
                            font: '40px PingFang-SC',
                            fillStyle: '#ffffff',
                            antialias: true
                        });
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.turnOutPut(user)];
                    case 2:
                        output = _a.sent();
                        mesh = new MeshText2D(output.text.slice(0, 10), {
                            canvas: output.image,
                            font: '40px PingFang-SC',
                            fillStyle: '#ffffff',
                            antialias: true
                        });
                        mesh._uInfo = user;
                        _a.label = 3;
                    case 3:
                        mesh.material.alphaTest = 0.1;
                        mesh.frustumCulled = true;
                        if (position === false) {
                            mesh.position.x = Math.random() * 4000 - 2000;
                            mesh.position.y = Math.random() * 4000 - 2000;
                            mesh.position.z = Math.random() * 4000 - 2000;
                        }
                        else {
                            mesh.position.x = position.x;
                            mesh.position.y = position.y;
                            mesh.position.z = position.z;
                        }
                        return [2 /*return*/, mesh];
                    case 4:
                        e_3 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Lottery3d.prototype.createMeshs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var num, i, user, object;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        num = this.$users.length < this.counter ? this.counter : this.$users.length;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < num)) return [3 /*break*/, 4];
                        user = this.$users[i] || false;
                        return [4 /*yield*/, this.createMesh(user)];
                    case 2:
                        object = _a.sent();
                        this.group.add(object);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Lottery3d.prototype.render = function () {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));
        TWEEN.update();
        this.passRenderer.render();
        // this.renderer.render(this.scene, this.camera)
    };
    Lottery3d.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    };
    Lottery3d.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.initRender();
                        return [4 /*yield*/, this.createMeshs()];
                    case 1:
                        _a.sent();
                        this.scene.add(this.group);
                        this.transform(new Sphere({
                            counter: this.counter,
                            group: this.group,
                            camera: this.camera
                        }), 2000);
                        this.render();
                        window.addEventListener('resize', this.onResize.bind(this), false);
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.log(e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Lottery3d.prototype.createPassRender = function () {
        var renderer = this.renderer;
        // 创建光源 设为透明
        var sunMaterial = new THREE.PointsMaterial({
            size: 0,
            sizeAttenuation: true,
            color: 0xffddaa,
            alphaTest: 0,
            transparent: true,
            fog: false
        });
        var sunGeometry = new THREE.BufferGeometry();
        sunGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
        var sun = new THREE.Points(sunGeometry, sunMaterial);
        // 超出摄像机部分不渲染
        sun.frustumCulled = true;
        sun.position.set(0, 0, 100);
        this.scene2 = new THREE.Scene();
        this.scene.add(sun);
        this.scene.add(this.group);
        var composer = new postprocessing_1(renderer, {
            stencilBuffer: true,
        });
        var clearMaskPass = new postprocessing_5();
        // let renderBg = new RenderPass(this.sceneBg, this.camera)
        var renderPass = new postprocessing_2(this.scene, this.camera);
        var renderPass2 = new postprocessing_2(this.scene2, this.camera);
        renderPass2.clear = false;
        var effectCopy = new postprocessing_6(new postprocessing_9());
        effectCopy.renderToScreen = true;
        var toneMappingPass = new postprocessing_8({
            adaptive: false,
            resolution: 1,
            distinction: 1
        });
        // toneMappingPass.defines.ADAPTED_LUMINANCE = 1
        toneMappingPass.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3;
        toneMappingPass.toneMappingMaterial.uniforms.maxLuminance.value = 3;
        toneMappingPass.toneMappingMaterial.uniforms.middleGrey.value = .8;
        this.toneMappingPass = toneMappingPass;
        var toneMappingPass2 = new postprocessing_8({
            adaptive: false,
            resolution: 1,
            distinction: 100
        });
        toneMappingPass2.adaptiveLuminosityMaterial.uniforms.minLuminance.value = 3;
        toneMappingPass2.toneMappingMaterial.uniforms.maxLuminance.value = 3;
        toneMappingPass2.toneMappingMaterial.uniforms.middleGrey.value = 80;
        // maskPass.scene = this.group
        // toneMappingPass.renderToScreen = true
        var GodPass = new postprocessing_3(this.group, this.camera, sun, {
            resolutionScale: 0.8,
            kernelSize: postprocessing_4.SMALL,
            intensity: 0.4,
            density: 0.86,
            decay: 0.83,
            weight: 0.4,
            exposure: 0.6,
            samples: 60,
            clampMax: 1.0
        });
        // 设置 renderPassMask 照出的部分设置颜色
        this.GroupMask = new postprocessing_2(GodPass.mainScene, GodPass.mainCamera, {
            clearColor: new THREE.Color(0x000000)
        });
        this.shineGroup = new THREE.Group();
        this.ShineGroupMask = new postprocessing_2(this.shineGroup, GodPass.mainCamera, {
            // overrideMaterial: new MeshBasicMaterial({color: this.roundConfig.shineColor}),
            clearColor: new THREE.Color(0x000000)
        });
        GodPass.renderPassMask = this.GroupMask;
        // GodPass.renderToScreen = true
        this.GodRaysPass = GodPass;
        // composer.addPass(renderBg)
        composer.addPass(renderPass);
        composer.addPass(renderPass2);
        composer.addPass(new postprocessing_7(this.scene, this.camera));
        toneMappingPass.enabled = false;
        composer.addPass(toneMappingPass);
        composer.addPass(clearMaskPass);
        composer.addPass(new postprocessing_7(this.shineGroup, this.camera));
        composer.addPass(toneMappingPass2);
        composer.addPass(clearMaskPass);
        composer.addPass(GodPass);
        composer.addPass(effectCopy);
        this.Clock = new THREE.Clock();
        this.passRenderer = composer;
    };
    return Lottery3d;
}(Base));

var Fadeout = /** @class */ (function () {
    function Fadeout(options) {
        var objs = [];
        for (var i = 0; i < options.counter; i += 1) {
            var object = new THREE.Object3D();
            object.position.z = 30000;
            objs.push(object);
        }
        options.camera.position.set(0, 0, 3000);
        options.camera.lookAt(options.group.position);
        this.objs = objs;
    }
    return Fadeout;
}());

var TWEEN2 = new TWEEN.Group();
var Sign3D = /** @class */ (function (_super) {
    __extends(Sign3D, _super);
    function Sign3D(config) {
        var _this = _super.call(this, config) || this;
        _this.objects = [];
        _this.avatarSize = 35;
        _this.counter = 1000;
        _this.shineColor = config.shineColor;
        _this.tableData = config.tableData;
        var _a = config.animateSpendTime, animateSpendTime = _a === void 0 ? 10 : _a, openAnimates = config.openAnimates, _b = config.shape, shape = _b === void 0 ? 'Round' : _b;
        _this.openAnimates = openAnimates;
        _this.shape = shape;
        _this.animateSpendTime = animateSpendTime;
        _this.addUser = _this.addUser.bind(_this);
        return _this;
    }
    /**
     * 新增参会人
     * @param user
     */
    Sign3D.prototype.addUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            /**
             * 让object跟随相机移动
             * */
            function followCamera(data) {
                // 根据相机朝向 算出物品所在的相对位置
                var relative = CaculatePosition(camera, length);
                for (var index in porperty) {
                    for (var type in porperty[index]) {
                        if (index === 'rotation') {
                            object[index][type] = (camera[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                        }
                        if (index === 'position') {
                            object[index][type] = (relative[type] + randNum[type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                        }
                    }
                }
            }
            /**
             * 初始化porperty 便于下次动画计算初始值与结束值
             */
            function initPorperty(world) {
                if (world === void 0) { world = false; }
                var position = world ? object.getWorldPosition() : object.position;
                var rotation = world ? object.getWorldRotation() : object.rotation;
                porperty = {
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z
                    },
                    rotation: {
                        x: rotation.x,
                        y: rotation.y,
                        z: rotation.z
                    }
                };
            }
            var camera, object, replaceIndex, replaceObj, porperty, length, randNum, CaculatePosition, moveTo, wait, showing;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$users.push(user);
                        if (!this.scene) {
                            return [2 /*return*/];
                        }
                        camera = this.camera;
                        return [4 /*yield*/, this.createMesh(user)];
                    case 1:
                        object = _a.sent();
                        this.scene.add(object);
                        replaceIndex = ___default.random(0, this.nowAnimate.objs.length - 1);
                        replaceObj = this.objects[replaceIndex];
                        porperty = {};
                        length = 200;
                        randNum = {
                            x: THREE.Math.randInt(-50, 50),
                            y: THREE.Math.randInt(-30, 30),
                            z: THREE.Math.randInt(-50, 50),
                        };
                        CaculatePosition = function (camera, length) {
                            var NewVector = new THREE.Vector3(0, 0, 1);
                            NewVector.applyEuler(camera.rotation);
                            NewVector.setLength(length);
                            NewVector.subVectors(camera.position, NewVector);
                            return NewVector;
                        };
                        initPorperty();
                        moveTo = new TWEEN.Tween({ value: 0 }, TWEEN2)
                            .to({ value: 100 }, 1000)
                            .onUpdate(function (data) {
                            followCamera(data);
                        })
                            .easing(TWEEN.Easing.Exponential.InOut);
                        wait = new TWEEN.Tween({ value: 100 }, TWEEN2)
                            .onStart(initPorperty)
                            .to({ value: 100 }, 1000)
                            .onUpdate(function (data) {
                            followCamera(data);
                        });
                        showing = new TWEEN.Tween({ value: 0 }, TWEEN2)
                            .to({ value: 100 }, 3000)
                            .onStart(function () {
                            var newPosition = _this.group.worldToLocal(object.position);
                            var cameraPosition = _this.group.worldToLocal(new THREE.Vector3().copy(camera.position));
                            _this.group.add(object);
                            object.position.copy(newPosition);
                            object.lookAt(cameraPosition);
                            initPorperty();
                        })
                            .onUpdate(function (data) {
                            for (var index in porperty) {
                                for (var type in porperty[index]) {
                                    object[index][type] = (replaceObj[index][type] - porperty[index][type]) * data.value / 100 + porperty[index][type];
                                }
                            }
                        })
                            .onComplete(function () {
                            _this.group.remove(_this.objects[replaceIndex]);
                            _this.scene.remove(object);
                            _this.objects[replaceIndex] = object;
                        })
                            .easing(TWEEN.Easing.Exponential.InOut);
                        moveTo.chain(wait);
                        wait.chain(showing);
                        moveTo.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.destroy = function () {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    };
    Sign3D.prototype.createMesh = function (user, position) {
        if (position === void 0) { position = false; }
        return __awaiter(this, void 0, void 0, function () {
            var map, Plane, radius, material, mesh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTexture(user.avatar)];
                    case 1:
                        map = _a.sent();
                        if (this.shape == 'Circle') {
                            radius = this.avatarSize / 2;
                            Plane = new THREE.CircleGeometry(radius, 30);
                        }
                        else {
                            Plane = new THREE.PlaneGeometry(this.avatarSize, this.avatarSize);
                        }
                        material = new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            side: THREE.DoubleSide,
                            map: map
                        });
                        mesh = new THREE.Mesh(Plane, material);
                        mesh.frustumCulled = true;
                        if (position === false) {
                            mesh.position.x = Math.random() * 4000 - 2000;
                            mesh.position.y = Math.random() * 4000 - 2000;
                            mesh.position.z = Math.random() * 4000 - 2000;
                            return [2 /*return*/, mesh];
                        }
                        mesh.position.x = position.x;
                        mesh.position.y = position.y;
                        mesh.position.z = position.z;
                        return [2 /*return*/, mesh];
                }
            });
        });
    };
    Sign3D.prototype.createMeshs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, user, object;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.counter)) return [3 /*break*/, 4];
                        user = ___default.sample(this.$users);
                        return [4 /*yield*/, this.createMesh(user)];
                    case 2:
                        object = _a.sent();
                        this.group.add(object);
                        this.objects.push(object);
                        _a.label = 3;
                    case 3:
                        i += 1;
                        return [3 /*break*/, 1];
                    case 4:
                        this.scene.add(this.group);
                        return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.transform = function (target, duration) {
        var _this = this;
        return new Promise(function (resolve) {
            var targets = target.objs;
            // this.globalAnimate = false
            TWEEN.removeAll();
            for (var i = 0; i < _this.objects.length; i++) {
                var object = _this.objects[i];
                var target_1 = targets[i];
                if (typeof (target_1) == 'undefined') {
                    continue;
                }
                new TWEEN.Tween(object.position)
                    .to({
                    x: target_1.position.x,
                    y: target_1.position.y,
                    z: target_1.position.z
                }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(object.rotation)
                    .to({
                    x: target_1.rotation.x,
                    y: target_1.rotation.y,
                    z: target_1.rotation.z
                }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
            setTimeout(function () {
                target.tween && target.tween(TWEEN);
                resolve();
            }, duration);
        });
    };
    Sign3D.prototype.animateInit = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var spendTime = 3000;
            _this.transform(_this.fadeout, spendTime);
            new TWEEN.Tween(_this.group.position)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.group.rotation)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.camera.rotation)
                .to({
                x: 0,
                y: 0,
                z: 0
            }, spendTime)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(_this.camera.position)
                .to({
                x: 0,
                y: 0,
                z: 3000
            }, spendTime)
                .onComplete(function () {
                _this.GodRaysPass.godRaysMaterial.uniforms.density.value = 0.83;
                _this.GodRaysPass.intensity = 0.4;
                resolve();
            })
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        });
    };
    Sign3D.prototype.loopAnimate = function () {
        var _this = this;
        var animate = this.lodashAnimates.next().value;
        if (!animate) {
            this.lodashAnimates.__index__ = 0;
            animate = this.lodashAnimates.head();
        }
        this.nowAnimate = animate;
        // 摄像机 group 归位
        this.animateInit().then(function () {
            _this.transform(animate, 3000);
        });
        setTimeout(function () {
            _this.loopAnimate();
        }, (parseInt(String(this.animateSpendTime)) + 5) * 1000);
    };
    Sign3D.prototype.render = function () {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));
        TWEEN.update();
        TWEEN2.update();
        this.passRenderer.render();
        // this.renderer.render(this.scene, this.camera)
    };
    Sign3D.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    };
    Sign3D.prototype.initThree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options_1, animates_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.initRender();
                        options_1 = {
                            counter: this.counter,
                            group: this.group,
                            camera: this.camera,
                            rotationSpeed: 4,
                            shape: this.shape,
                            tableData: this.tableData
                        };
                        this.fadeout = new Fadeout(options_1);
                        animates_1 = [];
                        this.openAnimates.forEach(function (animate) {
                            var Animate = animatesEffect[animate];
                            animates_1.push(new Animate(options_1));
                        });
                        this.lodashAnimates = ___default(animates_1);
                        return [4 /*yield*/, this.createMeshs()];
                    case 1:
                        _a.sent();
                        this.loopAnimate();
                        window.addEventListener('resize', this.onResize.bind(this), false);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Sign3D.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.initThree().then(function () {
                    _this.render();
                });
                return [2 /*return*/];
            });
        });
    };
    Sign3D.prototype.createPassRender = function () {
        var renderer = this.renderer;
        var sunMaterial = new THREE.PointsMaterial({
            size: 0,
            sizeAttenuation: true,
            color: 0xffddaa,
            alphaTest: 0,
            transparent: true,
            fog: false
        });
        var sunGeometry = new THREE.BufferGeometry();
        sunGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
        var sun = new THREE.Points(sunGeometry, sunMaterial);
        // 超出摄像机部分不渲染
        sun.frustumCulled = true;
        sun.position.set(0, 0, -100);
        this.scene.add(sun);
        var composer = new postprocessing_1(renderer);
        var renderPass = new postprocessing_2(this.scene, this.camera);
        composer.addPass(renderPass);
        renderPass = new postprocessing_3(this.group, this.camera, sun, {
            resolutionScale: 0.8,
            kernelSize: postprocessing_4.SMALL,
            intensity: 0.4,
            density: 0.86,
            decay: 0.83,
            weight: 0.4,
            exposure: 0.6,
            samples: 60,
            clampMax: 1.0
        });
        // 设置 renderPassMask 照出的部分设置颜色
        renderPass.renderPassMask = new postprocessing_2(renderPass.mainScene, renderPass.mainCamera, {
            overrideMaterial: new THREE.MeshBasicMaterial({ color: this.shineColor }),
            clearColor: new THREE.Color(0x000000)
        });
        this.GodRaysPass = renderPass;
        composer.addPass(renderPass);
        renderPass.renderToScreen = true;
        this.passRenderer = composer;
    };
    return Sign3D;
}(Base));

exports.Lottery3d = Lottery3d;
exports.Sign3D = Sign3D;
