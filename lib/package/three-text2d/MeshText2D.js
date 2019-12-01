"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("../three.min");
var Text2D_1 = require("./Text2D");
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
}(Text2D_1.Text2D));
exports.MeshText2D = MeshText2D;
