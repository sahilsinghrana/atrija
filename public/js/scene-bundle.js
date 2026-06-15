/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const as = "160";
const Fe = "", _e = "srgb", $e = "srgb-linear", os = "display-p3", nr = "display-p3-linear", $i = "linear", $t = "srgb", Qi = "rec709", tr = "p3";
const ws = "300 es";
class qn {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const r = this._listeners[t];
    if (r !== void 0) {
      const s = r.indexOf(e);
      s !== -1 && r.splice(s, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const r = n.slice(0);
      for (let s = 0, o = r.length; s < o; s++)
        r[s].call(this, t);
      t.target = null;
    }
  }
}
const Me = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"], pr = Math.PI / 180, Zr = 180 / Math.PI;
function je() {
  const i = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (Me[i & 255] + Me[i >> 8 & 255] + Me[i >> 16 & 255] + Me[i >> 24 & 255] + "-" + Me[t & 255] + Me[t >> 8 & 255] + "-" + Me[t >> 16 & 15 | 64] + Me[t >> 24 & 255] + "-" + Me[e & 63 | 128] + Me[e >> 8 & 255] + "-" + Me[e >> 16 & 255] + Me[e >> 24 & 255] + Me[n & 255] + Me[n >> 8 & 255] + Me[n >> 16 & 255] + Me[n >> 24 & 255]).toLowerCase();
}
function ye(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function vo(i, t) {
  return (i % t + t) % t;
}
function mr(i, t, e) {
  return (1 - e) * i + e * t;
}
function Rs(i) {
  return (i & i - 1) === 0 && i !== 0;
}
function Jr(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function Ke(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function Yt(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
class rt {
  constructor(t = 0, e = 0) {
    rt.prototype.isVector2 = !0, this.x = t, this.y = e;
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, r = t.elements;
    return this.x = r[0] * e + r[3] * n + r[6], this.y = r[1] * e + r[4] * n + r[7], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(ye(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e), r = Math.sin(e), s = this.x - t.x, o = this.y - t.y;
    return this.x = s * n - o * r + t.x, this.y = s * r + o * n + t.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Vt {
  constructor(t, e, n, r, s, o, a, l, c) {
    Vt.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, r, s, o, a, l, c);
  }
  set(t, e, n, r, s, o, a, l, c) {
    const h = this.elements;
    return h[0] = t, h[1] = r, h[2] = a, h[3] = e, h[4] = s, h[5] = l, h[6] = n, h[7] = o, h[8] = c, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[4],
      e[8],
      e[1],
      e[5],
      e[9],
      e[2],
      e[6],
      e[10]
    ), this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, r = e.elements, s = this.elements, o = n[0], a = n[3], l = n[6], c = n[1], h = n[4], f = n[7], p = n[2], m = n[5], g = n[8], _ = r[0], d = r[3], u = r[6], T = r[1], v = r[4], b = r[7], R = r[2], A = r[5], w = r[8];
    return s[0] = o * _ + a * T + l * R, s[3] = o * d + a * v + l * A, s[6] = o * u + a * b + l * w, s[1] = c * _ + h * T + f * R, s[4] = c * d + h * v + f * A, s[7] = c * u + h * b + f * w, s[2] = p * _ + m * T + g * R, s[5] = p * d + m * v + g * A, s[8] = p * u + m * b + g * w, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8];
    return e * o * h - e * a * c - n * s * h + n * a * l + r * s * c - r * o * l;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8], f = h * o - a * c, p = a * l - h * s, m = c * s - o * l, g = e * f + n * p + r * m;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / g;
    return t[0] = f * _, t[1] = (r * c - h * n) * _, t[2] = (a * n - r * o) * _, t[3] = p * _, t[4] = (h * e - r * l) * _, t[5] = (r * s - a * e) * _, t[6] = m * _, t[7] = (n * l - c * e) * _, t[8] = (o * e - n * s) * _, this;
  }
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  setUvTransform(t, e, n, r, s, o, a) {
    const l = Math.cos(s), c = Math.sin(s);
    return this.set(
      n * l,
      n * c,
      -n * (l * o + c * a) + o + t,
      -r * c,
      r * l,
      -r * (-c * o + l * a) + a + e,
      0,
      0,
      1
    ), this;
  }
  //
  scale(t, e) {
    return this.premultiply(gr.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(gr.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(gr.makeTranslation(t, e)), this;
  }
  // for 2D Transforms
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(
      1,
      0,
      t.x,
      0,
      1,
      t.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ), this;
  }
  makeRotation(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      n,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e) {
    return this.set(
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let r = 0; r < 9; r++)
      if (e[r] !== n[r]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const gr = /* @__PURE__ */ new Vt();
function Ua(i) {
  for (let t = i.length - 1; t >= 0; --t)
    if (i[t] >= 65535) return !0;
  return !1;
}
function li(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function xo() {
  const i = li("canvas");
  return i.style.display = "block", i;
}
const Cs = {};
function ii(i) {
  i in Cs || (Cs[i] = !0, console.warn(i));
}
const Ps = /* @__PURE__ */ new Vt().set(
  0.8224621,
  0.177538,
  0,
  0.0331941,
  0.9668058,
  0,
  0.0170827,
  0.0723974,
  0.9105199
), Ls = /* @__PURE__ */ new Vt().set(
  1.2249401,
  -0.2249404,
  0,
  -0.0420569,
  1.0420571,
  0,
  -0.0196376,
  -0.0786361,
  1.0982735
), Mi = {
  [$e]: {
    transfer: $i,
    primaries: Qi,
    toReference: (i) => i,
    fromReference: (i) => i
  },
  [_e]: {
    transfer: $t,
    primaries: Qi,
    toReference: (i) => i.convertSRGBToLinear(),
    fromReference: (i) => i.convertLinearToSRGB()
  },
  [nr]: {
    transfer: $i,
    primaries: tr,
    toReference: (i) => i.applyMatrix3(Ls),
    fromReference: (i) => i.applyMatrix3(Ps)
  },
  [os]: {
    transfer: $t,
    primaries: tr,
    toReference: (i) => i.convertSRGBToLinear().applyMatrix3(Ls),
    fromReference: (i) => i.applyMatrix3(Ps).convertLinearToSRGB()
  }
}, Mo = /* @__PURE__ */ new Set([$e, nr]), qt = {
  enabled: !0,
  _workingColorSpace: $e,
  get workingColorSpace() {
    return this._workingColorSpace;
  },
  set workingColorSpace(i) {
    if (!Mo.has(i))
      throw new Error(`Unsupported working color space, "${i}".`);
    this._workingColorSpace = i;
  },
  convert: function(i, t, e) {
    if (this.enabled === !1 || t === e || !t || !e)
      return i;
    const n = Mi[t].toReference, r = Mi[e].fromReference;
    return r(n(i));
  },
  fromWorkingColorSpace: function(i, t) {
    return this.convert(i, this._workingColorSpace, t);
  },
  toWorkingColorSpace: function(i, t) {
    return this.convert(i, t, this._workingColorSpace);
  },
  getPrimaries: function(i) {
    return Mi[i].primaries;
  },
  getTransfer: function(i) {
    return i === Fe ? $i : Mi[i].transfer;
  }
};
function kn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function _r(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let Mn;
class Ia {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let e;
    if (t instanceof HTMLCanvasElement)
      e = t;
    else {
      Mn === void 0 && (Mn = li("canvas")), Mn.width = t.width, Mn.height = t.height;
      const n = Mn.getContext("2d");
      t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = Mn;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = li("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const r = n.getImageData(0, 0, t.width, t.height), s = r.data;
      for (let o = 0; o < s.length; o++)
        s[o] = kn(s[o] / 255) * 255;
      return n.putImageData(r, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(kn(e[n] / 255) * 255) : e[n] = kn(e[n]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let So = 0;
class Na {
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: So++ }), this.uuid = je(), this.data = t, this.version = 0;
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0)
      return t.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, r = this.data;
    if (r !== null) {
      let s;
      if (Array.isArray(r)) {
        s = [];
        for (let o = 0, a = r.length; o < a; o++)
          r[o].isDataTexture ? s.push(vr(r[o].image)) : s.push(vr(r[o]));
      } else
        s = vr(r);
      n.url = s;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function vr(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? Ia.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let yo = 0;
class we extends qn {
  constructor(t = we.DEFAULT_IMAGE, e = we.DEFAULT_MAPPING, n = 1001, r = 1001, s = 1006, o = 1008, a = 1023, l = 1009, c = we.DEFAULT_ANISOTROPY, h = Fe) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: yo++ }), this.uuid = je(), this.name = "", this.source = new Na(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = r, this.magFilter = s, this.minFilter = o, this.anisotropy = c, this.format = a, this.internalFormat = null, this.type = l, this.offset = new rt(0, 0), this.repeat = new rt(1, 1), this.center = new rt(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Vt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, typeof h == "string" ? this.colorSpace = h : (ii("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = h === 3001 ? _e : Fe), this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.needsPMREMUpdate = !1;
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0)
      return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== 300) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case 1e3:
          t.x = t.x - Math.floor(t.x);
          break;
        case 1001:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case 1002:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case 1e3:
          t.y = t.y - Math.floor(t.y);
          break;
        case 1001:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case 1002:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  get encoding() {
    return ii("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace === _e ? 3001 : 3e3;
  }
  set encoding(t) {
    ii("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = t === 3001 ? _e : Fe;
  }
}
we.DEFAULT_IMAGE = null;
we.DEFAULT_MAPPING = 300;
we.DEFAULT_ANISOTROPY = 1;
class Qt {
  constructor(t = 0, e = 0, n = 0, r = 1) {
    Qt.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = n, this.w = r;
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, r) {
    return this.x = t, this.y = e, this.z = n, this.w = r, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, r = this.z, s = this.w, o = t.elements;
    return this.x = o[0] * e + o[4] * n + o[8] * r + o[12] * s, this.y = o[1] * e + o[5] * n + o[9] * r + o[13] * s, this.z = o[2] * e + o[6] * n + o[10] * r + o[14] * s, this.w = o[3] * e + o[7] * n + o[11] * r + o[15] * s, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, r, s;
    const l = t.elements, c = l[0], h = l[4], f = l[8], p = l[1], m = l[5], g = l[9], _ = l[2], d = l[6], u = l[10];
    if (Math.abs(h - p) < 0.01 && Math.abs(f - _) < 0.01 && Math.abs(g - d) < 0.01) {
      if (Math.abs(h + p) < 0.1 && Math.abs(f + _) < 0.1 && Math.abs(g + d) < 0.1 && Math.abs(c + m + u - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const v = (c + 1) / 2, b = (m + 1) / 2, R = (u + 1) / 2, A = (h + p) / 4, w = (f + _) / 4, O = (g + d) / 4;
      return v > b && v > R ? v < 0.01 ? (n = 0, r = 0.707106781, s = 0.707106781) : (n = Math.sqrt(v), r = A / n, s = w / n) : b > R ? b < 0.01 ? (n = 0.707106781, r = 0, s = 0.707106781) : (r = Math.sqrt(b), n = A / r, s = O / r) : R < 0.01 ? (n = 0.707106781, r = 0.707106781, s = 0) : (s = Math.sqrt(R), n = w / s, r = O / s), this.set(n, r, s, e), this;
    }
    let T = Math.sqrt((d - g) * (d - g) + (f - _) * (f - _) + (p - h) * (p - h));
    return Math.abs(T) < 1e-3 && (T = 1), this.x = (d - g) / T, this.y = (f - _) / T, this.z = (p - h) / T, this.w = Math.acos((c + m + u - 1) / 2), this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this.w = Math.max(t.w, Math.min(e.w, this.w)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this.w = Math.max(t, Math.min(e, this.w)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Eo extends qn {
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = 1, this.scissor = new Qt(0, 0, t, e), this.scissorTest = !1, this.viewport = new Qt(0, 0, t, e);
    const r = { width: t, height: e, depth: 1 };
    n.encoding !== void 0 && (ii("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."), n.colorSpace = n.encoding === 3001 ? _e : Fe), n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: 1006,
      depthBuffer: !0,
      stencilBuffer: !1,
      depthTexture: null,
      samples: 0
    }, n), this.texture = new we(r, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.flipY = !1, this.texture.generateMipmaps = n.generateMipmaps, this.texture.internalFormat = n.internalFormat, this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
  }
  setSize(t, e, n = 1) {
    (this.width !== t || this.height !== e || this.depth !== n) && (this.width = t, this.height = e, this.depth = n, this.texture.image.width = t, this.texture.image.height = e, this.texture.image.depth = n, this.dispose()), this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.texture = t.texture.clone(), this.texture.isRenderTargetTexture = !0;
    const e = Object.assign({}, t.texture.image);
    return this.texture.source = new Na(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class on extends Eo {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = !0;
  }
}
class Fa extends we {
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: t, width: e, height: n, depth: r }, this.magFilter = 1003, this.minFilter = 1003, this.wrapR = 1001, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class To extends we {
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: t, width: e, height: n, depth: r }, this.magFilter = 1003, this.minFilter = 1003, this.wrapR = 1001, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class fi {
  constructor(t = 0, e = 0, n = 0, r = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = r;
  }
  static slerpFlat(t, e, n, r, s, o, a) {
    let l = n[r + 0], c = n[r + 1], h = n[r + 2], f = n[r + 3];
    const p = s[o + 0], m = s[o + 1], g = s[o + 2], _ = s[o + 3];
    if (a === 0) {
      t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = f;
      return;
    }
    if (a === 1) {
      t[e + 0] = p, t[e + 1] = m, t[e + 2] = g, t[e + 3] = _;
      return;
    }
    if (f !== _ || l !== p || c !== m || h !== g) {
      let d = 1 - a;
      const u = l * p + c * m + h * g + f * _, T = u >= 0 ? 1 : -1, v = 1 - u * u;
      if (v > Number.EPSILON) {
        const R = Math.sqrt(v), A = Math.atan2(R, u * T);
        d = Math.sin(d * A) / R, a = Math.sin(a * A) / R;
      }
      const b = a * T;
      if (l = l * d + p * b, c = c * d + m * b, h = h * d + g * b, f = f * d + _ * b, d === 1 - a) {
        const R = 1 / Math.sqrt(l * l + c * c + h * h + f * f);
        l *= R, c *= R, h *= R, f *= R;
      }
    }
    t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = f;
  }
  static multiplyQuaternionsFlat(t, e, n, r, s, o) {
    const a = n[r], l = n[r + 1], c = n[r + 2], h = n[r + 3], f = s[o], p = s[o + 1], m = s[o + 2], g = s[o + 3];
    return t[e] = a * g + h * f + l * m - c * p, t[e + 1] = l * g + h * p + c * f - a * m, t[e + 2] = c * g + h * m + a * p - l * f, t[e + 3] = h * g - a * f - l * p - c * m, t;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  set(t, e, n, r) {
    return this._x = t, this._y = e, this._z = n, this._w = r, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  setFromEuler(t, e = !0) {
    const n = t._x, r = t._y, s = t._z, o = t._order, a = Math.cos, l = Math.sin, c = a(n / 2), h = a(r / 2), f = a(s / 2), p = l(n / 2), m = l(r / 2), g = l(s / 2);
    switch (o) {
      case "XYZ":
        this._x = p * h * f + c * m * g, this._y = c * m * f - p * h * g, this._z = c * h * g + p * m * f, this._w = c * h * f - p * m * g;
        break;
      case "YXZ":
        this._x = p * h * f + c * m * g, this._y = c * m * f - p * h * g, this._z = c * h * g - p * m * f, this._w = c * h * f + p * m * g;
        break;
      case "ZXY":
        this._x = p * h * f - c * m * g, this._y = c * m * f + p * h * g, this._z = c * h * g + p * m * f, this._w = c * h * f - p * m * g;
        break;
      case "ZYX":
        this._x = p * h * f - c * m * g, this._y = c * m * f + p * h * g, this._z = c * h * g - p * m * f, this._w = c * h * f + p * m * g;
        break;
      case "YZX":
        this._x = p * h * f + c * m * g, this._y = c * m * f + p * h * g, this._z = c * h * g - p * m * f, this._w = c * h * f - p * m * g;
        break;
      case "XZY":
        this._x = p * h * f - c * m * g, this._y = c * m * f - p * h * g, this._z = c * h * g + p * m * f, this._w = c * h * f + p * m * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o);
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2, r = Math.sin(n);
    return this._x = t.x * r, this._y = t.y * r, this._z = t.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t) {
    const e = t.elements, n = e[0], r = e[4], s = e[8], o = e[1], a = e[5], l = e[9], c = e[2], h = e[6], f = e[10], p = n + a + f;
    if (p > 0) {
      const m = 0.5 / Math.sqrt(p + 1);
      this._w = 0.25 / m, this._x = (h - l) * m, this._y = (s - c) * m, this._z = (o - r) * m;
    } else if (n > a && n > f) {
      const m = 2 * Math.sqrt(1 + n - a - f);
      this._w = (h - l) / m, this._x = 0.25 * m, this._y = (r + o) / m, this._z = (s + c) / m;
    } else if (a > f) {
      const m = 2 * Math.sqrt(1 + a - n - f);
      this._w = (s - c) / m, this._x = (r + o) / m, this._y = 0.25 * m, this._z = (l + h) / m;
    } else {
      const m = 2 * Math.sqrt(1 + f - n - a);
      this._w = (o - r) / m, this._x = (s + c) / m, this._y = (l + h) / m, this._z = 0.25 * m;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(ye(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const r = Math.min(1, e / n);
    return this.slerp(t, r), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x, r = t._y, s = t._z, o = t._w, a = e._x, l = e._y, c = e._z, h = e._w;
    return this._x = n * h + o * a + r * c - s * l, this._y = r * h + o * l + s * a - n * c, this._z = s * h + o * c + n * l - r * a, this._w = o * h - n * a - r * l - s * c, this._onChangeCallback(), this;
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x, r = this._y, s = this._z, o = this._w;
    let a = o * t._w + n * t._x + r * t._y + s * t._z;
    if (a < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, a = -a) : this.copy(t), a >= 1)
      return this._w = o, this._x = n, this._y = r, this._z = s, this;
    const l = 1 - a * a;
    if (l <= Number.EPSILON) {
      const m = 1 - e;
      return this._w = m * o + e * this._w, this._x = m * n + e * this._x, this._y = m * r + e * this._y, this._z = m * s + e * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), h = Math.atan2(c, a), f = Math.sin((1 - e) * h) / c, p = Math.sin(e * h) / c;
    return this._w = o * f + this._w * p, this._x = n * f + this._x * p, this._y = r * f + this._y * p, this._z = s * f + this._z * p, this._onChangeCallback(), this;
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = Math.random(), e = Math.sqrt(1 - t), n = Math.sqrt(t), r = 2 * Math.PI * Math.random(), s = 2 * Math.PI * Math.random();
    return this.set(
      e * Math.cos(r),
      n * Math.sin(s),
      n * Math.cos(s),
      e * Math.sin(r)
    );
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class L {
  constructor(t = 0, e = 0, n = 0) {
    L.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n;
  }
  set(t, e, n) {
    return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  applyEuler(t) {
    return this.applyQuaternion(Ds.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(Ds.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements;
    return this.x = s[0] * e + s[3] * n + s[6] * r, this.y = s[1] * e + s[4] * n + s[7] * r, this.z = s[2] * e + s[5] * n + s[8] * r, this;
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements, o = 1 / (s[3] * e + s[7] * n + s[11] * r + s[15]);
    return this.x = (s[0] * e + s[4] * n + s[8] * r + s[12]) * o, this.y = (s[1] * e + s[5] * n + s[9] * r + s[13]) * o, this.z = (s[2] * e + s[6] * n + s[10] * r + s[14]) * o, this;
  }
  applyQuaternion(t) {
    const e = this.x, n = this.y, r = this.z, s = t.x, o = t.y, a = t.z, l = t.w, c = 2 * (o * r - a * n), h = 2 * (a * e - s * r), f = 2 * (s * n - o * e);
    return this.x = e + l * c + o * f - a * h, this.y = n + l * h + a * c - s * f, this.z = r + l * f + s * h - o * c, this;
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  transformDirection(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements;
    return this.x = s[0] * e + s[4] * n + s[8] * r, this.y = s[1] * e + s[5] * n + s[9] * r, this.z = s[2] * e + s[6] * n + s[10] * r, this.normalize();
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x, r = t.y, s = t.z, o = e.x, a = e.y, l = e.z;
    return this.x = r * l - s * a, this.y = s * o - n * l, this.z = n * a - r * o, this;
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return xr.copy(this).projectOnVector(t), this.sub(xr);
  }
  reflect(t) {
    return this.sub(xr.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(ye(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y, r = this.z - t.z;
    return e * e + n * n + r * r;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const r = Math.sin(e) * t;
    return this.x = r * Math.sin(n), this.y = Math.cos(e) * t, this.z = r * Math.cos(n), this;
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), r = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = n, this.z = r, this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const t = (Math.random() - 0.5) * 2, e = Math.random() * Math.PI * 2, n = Math.sqrt(1 - t ** 2);
    return this.x = n * Math.cos(e), this.y = n * Math.sin(e), this.z = t, this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const xr = /* @__PURE__ */ new L(), Ds = /* @__PURE__ */ new fi();
class di {
  constructor(t = new L(1 / 0, 1 / 0, 1 / 0), e = new L(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(Oe.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(Oe.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = Oe.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const s = n.getAttribute("position");
      if (e === !0 && s !== void 0 && t.isInstancedMesh !== !0)
        for (let o = 0, a = s.count; o < a; o++)
          t.isMesh === !0 ? t.getVertexPosition(o, Oe) : Oe.fromBufferAttribute(s, o), Oe.applyMatrix4(t.matrixWorld), this.expandByPoint(Oe);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), Si.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Si.copy(n.boundingBox)), Si.applyMatrix4(t.matrixWorld), this.union(Si);
    }
    const r = t.children;
    for (let s = 0, o = r.length; s < o; s++)
      this.expandByObject(r[s], e);
    return this;
  }
  containsPoint(t) {
    return !(t.x < this.min.x || t.x > this.max.x || t.y < this.min.y || t.y > this.max.y || t.z < this.min.z || t.z > this.max.z);
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return !(t.max.x < this.min.x || t.min.x > this.max.x || t.max.y < this.min.y || t.min.y > this.max.y || t.max.z < this.min.z || t.min.z > this.max.z);
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, Oe), Oe.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Jn), yi.subVectors(this.max, Jn), Sn.subVectors(t.a, Jn), yn.subVectors(t.b, Jn), En.subVectors(t.c, Jn), Qe.subVectors(yn, Sn), tn.subVectors(En, yn), un.subVectors(Sn, En);
    let e = [
      0,
      -Qe.z,
      Qe.y,
      0,
      -tn.z,
      tn.y,
      0,
      -un.z,
      un.y,
      Qe.z,
      0,
      -Qe.x,
      tn.z,
      0,
      -tn.x,
      un.z,
      0,
      -un.x,
      -Qe.y,
      Qe.x,
      0,
      -tn.y,
      tn.x,
      0,
      -un.y,
      un.x,
      0
    ];
    return !Mr(e, Sn, yn, En, yi) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Mr(e, Sn, yn, En, yi)) ? !1 : (Ei.crossVectors(Qe, tn), e = [Ei.x, Ei.y, Ei.z], Mr(e, Sn, yn, En, yi));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, Oe).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(Oe).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : (We[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), We[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), We[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), We[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), We[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), We[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), We[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), We[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(We), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const We = [
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L(),
  /* @__PURE__ */ new L()
], Oe = /* @__PURE__ */ new L(), Si = /* @__PURE__ */ new di(), Sn = /* @__PURE__ */ new L(), yn = /* @__PURE__ */ new L(), En = /* @__PURE__ */ new L(), Qe = /* @__PURE__ */ new L(), tn = /* @__PURE__ */ new L(), un = /* @__PURE__ */ new L(), Jn = /* @__PURE__ */ new L(), yi = /* @__PURE__ */ new L(), Ei = /* @__PURE__ */ new L(), fn = /* @__PURE__ */ new L();
function Mr(i, t, e, n, r) {
  for (let s = 0, o = i.length - 3; s <= o; s += 3) {
    fn.fromArray(i, s);
    const a = r.x * Math.abs(fn.x) + r.y * Math.abs(fn.y) + r.z * Math.abs(fn.z), l = t.dot(fn), c = e.dot(fn), h = n.dot(fn);
    if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > a)
      return !1;
  }
  return !0;
}
const bo = /* @__PURE__ */ new di(), Kn = /* @__PURE__ */ new L(), Sr = /* @__PURE__ */ new L();
class pi {
  constructor(t = new L(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : bo.setFromPoints(t).getCenter(n);
    let r = 0;
    for (let s = 0, o = t.length; s < o; s++)
      r = Math.max(r, n.distanceToSquared(t[s]));
    return this.radius = Math.sqrt(r), this;
  }
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty())
      return this.center.copy(t), this.radius = 0, this;
    Kn.subVectors(t, this.center);
    const e = Kn.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), r = (n - this.radius) * 0.5;
      this.center.addScaledVector(Kn, r / n), this.radius += r;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : (Sr.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(Kn.copy(t.center).add(Sr)), this.expandByPoint(Kn.copy(t.center).sub(Sr))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Xe = /* @__PURE__ */ new L(), yr = /* @__PURE__ */ new L(), Ti = /* @__PURE__ */ new L(), en = /* @__PURE__ */ new L(), Er = /* @__PURE__ */ new L(), bi = /* @__PURE__ */ new L(), Tr = /* @__PURE__ */ new L();
class ir {
  constructor(t = new L(), e = new L(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, Xe)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = Xe.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (Xe.copy(this.origin).addScaledVector(this.direction, e), Xe.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, r) {
    yr.copy(t).add(e).multiplyScalar(0.5), Ti.copy(e).sub(t).normalize(), en.copy(this.origin).sub(yr);
    const s = t.distanceTo(e) * 0.5, o = -this.direction.dot(Ti), a = en.dot(this.direction), l = -en.dot(Ti), c = en.lengthSq(), h = Math.abs(1 - o * o);
    let f, p, m, g;
    if (h > 0)
      if (f = o * l - a, p = o * a - l, g = s * h, f >= 0)
        if (p >= -g)
          if (p <= g) {
            const _ = 1 / h;
            f *= _, p *= _, m = f * (f + o * p + 2 * a) + p * (o * f + p + 2 * l) + c;
          } else
            p = s, f = Math.max(0, -(o * p + a)), m = -f * f + p * (p + 2 * l) + c;
        else
          p = -s, f = Math.max(0, -(o * p + a)), m = -f * f + p * (p + 2 * l) + c;
      else
        p <= -g ? (f = Math.max(0, -(-o * s + a)), p = f > 0 ? -s : Math.min(Math.max(-s, -l), s), m = -f * f + p * (p + 2 * l) + c) : p <= g ? (f = 0, p = Math.min(Math.max(-s, -l), s), m = p * (p + 2 * l) + c) : (f = Math.max(0, -(o * s + a)), p = f > 0 ? s : Math.min(Math.max(-s, -l), s), m = -f * f + p * (p + 2 * l) + c);
    else
      p = o > 0 ? -s : s, f = Math.max(0, -(o * p + a)), m = -f * f + p * (p + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, f), r && r.copy(yr).addScaledVector(Ti, p), m;
  }
  intersectSphere(t, e) {
    Xe.subVectors(t.center, this.origin);
    const n = Xe.dot(this.direction), r = Xe.dot(Xe) - n * n, s = t.radius * t.radius;
    if (r > s) return null;
    const o = Math.sqrt(s - r), a = n - o, l = n + o;
    return l < 0 ? null : a < 0 ? this.at(l, e) : this.at(a, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0)
      return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, r, s, o, a, l;
    const c = 1 / this.direction.x, h = 1 / this.direction.y, f = 1 / this.direction.z, p = this.origin;
    return c >= 0 ? (n = (t.min.x - p.x) * c, r = (t.max.x - p.x) * c) : (n = (t.max.x - p.x) * c, r = (t.min.x - p.x) * c), h >= 0 ? (s = (t.min.y - p.y) * h, o = (t.max.y - p.y) * h) : (s = (t.max.y - p.y) * h, o = (t.min.y - p.y) * h), n > o || s > r || ((s > n || isNaN(n)) && (n = s), (o < r || isNaN(r)) && (r = o), f >= 0 ? (a = (t.min.z - p.z) * f, l = (t.max.z - p.z) * f) : (a = (t.max.z - p.z) * f, l = (t.min.z - p.z) * f), n > l || a > r) || ((a > n || n !== n) && (n = a), (l < r || r !== r) && (r = l), r < 0) ? null : this.at(n >= 0 ? n : r, e);
  }
  intersectsBox(t) {
    return this.intersectBox(t, Xe) !== null;
  }
  intersectTriangle(t, e, n, r, s) {
    Er.subVectors(e, t), bi.subVectors(n, t), Tr.crossVectors(Er, bi);
    let o = this.direction.dot(Tr), a;
    if (o > 0) {
      if (r) return null;
      a = 1;
    } else if (o < 0)
      a = -1, o = -o;
    else
      return null;
    en.subVectors(this.origin, t);
    const l = a * this.direction.dot(bi.crossVectors(en, bi));
    if (l < 0)
      return null;
    const c = a * this.direction.dot(Er.cross(en));
    if (c < 0 || l + c > o)
      return null;
    const h = -a * en.dot(Tr);
    return h < 0 ? null : this.at(h / o, s);
  }
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class te {
  constructor(t, e, n, r, s, o, a, l, c, h, f, p, m, g, _, d) {
    te.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, r, s, o, a, l, c, h, f, p, m, g, _, d);
  }
  set(t, e, n, r, s, o, a, l, c, h, f, p, m, g, _, d) {
    const u = this.elements;
    return u[0] = t, u[4] = e, u[8] = n, u[12] = r, u[1] = s, u[5] = o, u[9] = a, u[13] = l, u[2] = c, u[6] = h, u[10] = f, u[14] = p, u[3] = m, u[7] = g, u[11] = _, u[15] = d, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new te().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
  }
  copyPosition(t) {
    const e = this.elements, n = t.elements;
    return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[3],
      e[6],
      0,
      e[1],
      e[4],
      e[7],
      0,
      e[2],
      e[5],
      e[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(t, e, n) {
    return this.set(
      t.x,
      e.x,
      n.x,
      0,
      t.y,
      e.y,
      n.y,
      0,
      t.z,
      e.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(t) {
    const e = this.elements, n = t.elements, r = 1 / Tn.setFromMatrixColumn(t, 0).length(), s = 1 / Tn.setFromMatrixColumn(t, 1).length(), o = 1 / Tn.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * r, e[1] = n[1] * r, e[2] = n[2] * r, e[3] = 0, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = 0, e[8] = n[8] * o, e[9] = n[9] * o, e[10] = n[10] * o, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, r = t.y, s = t.z, o = Math.cos(n), a = Math.sin(n), l = Math.cos(r), c = Math.sin(r), h = Math.cos(s), f = Math.sin(s);
    if (t.order === "XYZ") {
      const p = o * h, m = o * f, g = a * h, _ = a * f;
      e[0] = l * h, e[4] = -l * f, e[8] = c, e[1] = m + g * c, e[5] = p - _ * c, e[9] = -a * l, e[2] = _ - p * c, e[6] = g + m * c, e[10] = o * l;
    } else if (t.order === "YXZ") {
      const p = l * h, m = l * f, g = c * h, _ = c * f;
      e[0] = p + _ * a, e[4] = g * a - m, e[8] = o * c, e[1] = o * f, e[5] = o * h, e[9] = -a, e[2] = m * a - g, e[6] = _ + p * a, e[10] = o * l;
    } else if (t.order === "ZXY") {
      const p = l * h, m = l * f, g = c * h, _ = c * f;
      e[0] = p - _ * a, e[4] = -o * f, e[8] = g + m * a, e[1] = m + g * a, e[5] = o * h, e[9] = _ - p * a, e[2] = -o * c, e[6] = a, e[10] = o * l;
    } else if (t.order === "ZYX") {
      const p = o * h, m = o * f, g = a * h, _ = a * f;
      e[0] = l * h, e[4] = g * c - m, e[8] = p * c + _, e[1] = l * f, e[5] = _ * c + p, e[9] = m * c - g, e[2] = -c, e[6] = a * l, e[10] = o * l;
    } else if (t.order === "YZX") {
      const p = o * l, m = o * c, g = a * l, _ = a * c;
      e[0] = l * h, e[4] = _ - p * f, e[8] = g * f + m, e[1] = f, e[5] = o * h, e[9] = -a * h, e[2] = -c * h, e[6] = m * f + g, e[10] = p - _ * f;
    } else if (t.order === "XZY") {
      const p = o * l, m = o * c, g = a * l, _ = a * c;
      e[0] = l * h, e[4] = -f, e[8] = c * h, e[1] = p * f + _, e[5] = o * h, e[9] = m * f - g, e[2] = g * f - m, e[6] = a * h, e[10] = _ * f + p;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(Ao, t, wo);
  }
  lookAt(t, e, n) {
    const r = this.elements;
    return Pe.subVectors(t, e), Pe.lengthSq() === 0 && (Pe.z = 1), Pe.normalize(), nn.crossVectors(n, Pe), nn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Pe.x += 1e-4 : Pe.z += 1e-4, Pe.normalize(), nn.crossVectors(n, Pe)), nn.normalize(), Ai.crossVectors(Pe, nn), r[0] = nn.x, r[4] = Ai.x, r[8] = Pe.x, r[1] = nn.y, r[5] = Ai.y, r[9] = Pe.y, r[2] = nn.z, r[6] = Ai.z, r[10] = Pe.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, r = e.elements, s = this.elements, o = n[0], a = n[4], l = n[8], c = n[12], h = n[1], f = n[5], p = n[9], m = n[13], g = n[2], _ = n[6], d = n[10], u = n[14], T = n[3], v = n[7], b = n[11], R = n[15], A = r[0], w = r[4], O = r[8], M = r[12], S = r[1], U = r[5], N = r[9], Y = r[13], P = r[2], B = r[6], H = r[10], J = r[14], X = r[3], W = r[7], tt = r[11], et = r[15];
    return s[0] = o * A + a * S + l * P + c * X, s[4] = o * w + a * U + l * B + c * W, s[8] = o * O + a * N + l * H + c * tt, s[12] = o * M + a * Y + l * J + c * et, s[1] = h * A + f * S + p * P + m * X, s[5] = h * w + f * U + p * B + m * W, s[9] = h * O + f * N + p * H + m * tt, s[13] = h * M + f * Y + p * J + m * et, s[2] = g * A + _ * S + d * P + u * X, s[6] = g * w + _ * U + d * B + u * W, s[10] = g * O + _ * N + d * H + u * tt, s[14] = g * M + _ * Y + d * J + u * et, s[3] = T * A + v * S + b * P + R * X, s[7] = T * w + v * U + b * B + R * W, s[11] = T * O + v * N + b * H + R * tt, s[15] = T * M + v * Y + b * J + R * et, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[4], r = t[8], s = t[12], o = t[1], a = t[5], l = t[9], c = t[13], h = t[2], f = t[6], p = t[10], m = t[14], g = t[3], _ = t[7], d = t[11], u = t[15];
    return g * (+s * l * f - r * c * f - s * a * p + n * c * p + r * a * m - n * l * m) + _ * (+e * l * m - e * c * p + s * o * p - r * o * m + r * c * h - s * l * h) + d * (+e * c * f - e * a * m - s * o * f + n * o * m + s * a * h - n * c * h) + u * (-r * a * h - e * l * f + e * a * p + r * o * f - n * o * p + n * l * h);
  }
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  setPosition(t, e, n) {
    const r = this.elements;
    return t.isVector3 ? (r[12] = t.x, r[13] = t.y, r[14] = t.z) : (r[12] = t, r[13] = e, r[14] = n), this;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8], f = t[9], p = t[10], m = t[11], g = t[12], _ = t[13], d = t[14], u = t[15], T = f * d * c - _ * p * c + _ * l * m - a * d * m - f * l * u + a * p * u, v = g * p * c - h * d * c - g * l * m + o * d * m + h * l * u - o * p * u, b = h * _ * c - g * f * c + g * a * m - o * _ * m - h * a * u + o * f * u, R = g * f * l - h * _ * l - g * a * p + o * _ * p + h * a * d - o * f * d, A = e * T + n * v + r * b + s * R;
    if (A === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const w = 1 / A;
    return t[0] = T * w, t[1] = (_ * p * s - f * d * s - _ * r * m + n * d * m + f * r * u - n * p * u) * w, t[2] = (a * d * s - _ * l * s + _ * r * c - n * d * c - a * r * u + n * l * u) * w, t[3] = (f * l * s - a * p * s - f * r * c + n * p * c + a * r * m - n * l * m) * w, t[4] = v * w, t[5] = (h * d * s - g * p * s + g * r * m - e * d * m - h * r * u + e * p * u) * w, t[6] = (g * l * s - o * d * s - g * r * c + e * d * c + o * r * u - e * l * u) * w, t[7] = (o * p * s - h * l * s + h * r * c - e * p * c - o * r * m + e * l * m) * w, t[8] = b * w, t[9] = (g * f * s - h * _ * s - g * n * m + e * _ * m + h * n * u - e * f * u) * w, t[10] = (o * _ * s - g * a * s + g * n * c - e * _ * c - o * n * u + e * a * u) * w, t[11] = (h * a * s - o * f * s - h * n * c + e * f * c + o * n * m - e * a * m) * w, t[12] = R * w, t[13] = (h * _ * r - g * f * r + g * n * p - e * _ * p - h * n * d + e * f * d) * w, t[14] = (g * a * r - o * _ * r - g * n * l + e * _ * l + o * n * d - e * a * d) * w, t[15] = (o * f * r - h * a * r + h * n * l - e * f * l - o * n * p + e * a * p) * w, this;
  }
  scale(t) {
    const e = this.elements, n = t.x, r = t.y, s = t.z;
    return e[0] *= n, e[4] *= r, e[8] *= s, e[1] *= n, e[5] *= r, e[9] *= s, e[2] *= n, e[6] *= r, e[10] *= s, e[3] *= n, e[7] *= r, e[11] *= s, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], r = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, r));
  }
  makeTranslation(t, e, n) {
    return t.isVector3 ? this.set(
      1,
      0,
      0,
      t.x,
      0,
      1,
      0,
      t.y,
      0,
      0,
      1,
      t.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      t,
      0,
      1,
      0,
      e,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e), r = Math.sin(e), s = 1 - n, o = t.x, a = t.y, l = t.z, c = s * o, h = s * a;
    return this.set(
      c * o + n,
      c * a - r * l,
      c * l + r * a,
      0,
      c * a + r * l,
      h * a + n,
      h * l - r * o,
      0,
      c * l - r * a,
      h * l + r * o,
      s * l * l + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e, n) {
    return this.set(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(t, e, n, r, s, o) {
    return this.set(
      1,
      n,
      s,
      0,
      t,
      1,
      o,
      0,
      e,
      r,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(t, e, n) {
    const r = this.elements, s = e._x, o = e._y, a = e._z, l = e._w, c = s + s, h = o + o, f = a + a, p = s * c, m = s * h, g = s * f, _ = o * h, d = o * f, u = a * f, T = l * c, v = l * h, b = l * f, R = n.x, A = n.y, w = n.z;
    return r[0] = (1 - (_ + u)) * R, r[1] = (m + b) * R, r[2] = (g - v) * R, r[3] = 0, r[4] = (m - b) * A, r[5] = (1 - (p + u)) * A, r[6] = (d + T) * A, r[7] = 0, r[8] = (g + v) * w, r[9] = (d - T) * w, r[10] = (1 - (p + _)) * w, r[11] = 0, r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = 1, this;
  }
  decompose(t, e, n) {
    const r = this.elements;
    let s = Tn.set(r[0], r[1], r[2]).length();
    const o = Tn.set(r[4], r[5], r[6]).length(), a = Tn.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (s = -s), t.x = r[12], t.y = r[13], t.z = r[14], Be.copy(this);
    const c = 1 / s, h = 1 / o, f = 1 / a;
    return Be.elements[0] *= c, Be.elements[1] *= c, Be.elements[2] *= c, Be.elements[4] *= h, Be.elements[5] *= h, Be.elements[6] *= h, Be.elements[8] *= f, Be.elements[9] *= f, Be.elements[10] *= f, e.setFromRotationMatrix(Be), n.x = s, n.y = o, n.z = a, this;
  }
  makePerspective(t, e, n, r, s, o, a = 2e3) {
    const l = this.elements, c = 2 * s / (e - t), h = 2 * s / (n - r), f = (e + t) / (e - t), p = (n + r) / (n - r);
    let m, g;
    if (a === 2e3)
      m = -(o + s) / (o - s), g = -2 * o * s / (o - s);
    else if (a === 2001)
      m = -o / (o - s), g = -o * s / (o - s);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a);
    return l[0] = c, l[4] = 0, l[8] = f, l[12] = 0, l[1] = 0, l[5] = h, l[9] = p, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = m, l[14] = g, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, e, n, r, s, o, a = 2e3) {
    const l = this.elements, c = 1 / (e - t), h = 1 / (n - r), f = 1 / (o - s), p = (e + t) * c, m = (n + r) * h;
    let g, _;
    if (a === 2e3)
      g = (o + s) * f, _ = -2 * f;
    else if (a === 2001)
      g = s * f, _ = -1 * f;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a);
    return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -p, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -m, l[2] = 0, l[6] = 0, l[10] = _, l[14] = -g, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let r = 0; r < 16; r++)
      if (e[r] !== n[r]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
  }
}
const Tn = /* @__PURE__ */ new L(), Be = /* @__PURE__ */ new te(), Ao = /* @__PURE__ */ new L(0, 0, 0), wo = /* @__PURE__ */ new L(1, 1, 1), nn = /* @__PURE__ */ new L(), Ai = /* @__PURE__ */ new L(), Pe = /* @__PURE__ */ new L(), Us = /* @__PURE__ */ new te(), Is = /* @__PURE__ */ new fi();
class rr {
  constructor(t = 0, e = 0, n = 0, r = rr.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = e, this._z = n, this._order = r;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, e, n, r = this._order) {
    return this._x = t, this._y = e, this._z = n, this._order = r, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const r = t.elements, s = r[0], o = r[4], a = r[8], l = r[1], c = r[5], h = r[9], f = r[2], p = r[6], m = r[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(ye(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(-h, m), this._z = Math.atan2(-o, s)) : (this._x = Math.atan2(p, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-ye(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(a, m), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-f, s), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(ye(p, -1, 1)), Math.abs(p) < 0.9999999 ? (this._y = Math.atan2(-f, m), this._z = Math.atan2(-o, c)) : (this._y = 0, this._z = Math.atan2(l, s));
        break;
      case "ZYX":
        this._y = Math.asin(-ye(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._x = Math.atan2(p, m), this._z = Math.atan2(l, s)) : (this._x = 0, this._z = Math.atan2(-o, c));
        break;
      case "YZX":
        this._z = Math.asin(ye(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-f, s)) : (this._x = 0, this._y = Math.atan2(a, m));
        break;
      case "XZY":
        this._z = Math.asin(-ye(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(p, c), this._y = Math.atan2(a, s)) : (this._x = Math.atan2(-h, m), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return Us.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Us, e, n);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return Is.setFromEuler(this), this.setFromQuaternion(Is, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
rr.DEFAULT_ORDER = "XYZ";
class ls {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let Ro = 0;
const Ns = /* @__PURE__ */ new L(), bn = /* @__PURE__ */ new fi(), qe = /* @__PURE__ */ new te(), wi = /* @__PURE__ */ new L(), jn = /* @__PURE__ */ new L(), Co = /* @__PURE__ */ new L(), Po = /* @__PURE__ */ new fi(), Fs = /* @__PURE__ */ new L(1, 0, 0), Os = /* @__PURE__ */ new L(0, 1, 0), Bs = /* @__PURE__ */ new L(0, 0, 1), Lo = { type: "added" }, Do = { type: "removed" };
class ue extends qn {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: Ro++ }), this.uuid = je(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = ue.DEFAULT_UP.clone();
    const t = new L(), e = new rr(), n = new fi(), r = new L(1, 1, 1);
    function s() {
      n.setFromEuler(e, !1);
    }
    function o() {
      e.setFromQuaternion(n, void 0, !1);
    }
    e._onChange(s), n._onChange(o), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      modelViewMatrix: {
        value: new te()
      },
      normalMatrix: {
        value: new Vt()
      }
    }), this.matrix = new te(), this.matrixWorld = new te(), this.matrixAutoUpdate = ue.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ls(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return bn.setFromAxisAngle(t, e), this.quaternion.multiply(bn), this;
  }
  rotateOnWorldAxis(t, e) {
    return bn.setFromAxisAngle(t, e), this.quaternion.premultiply(bn), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(Fs, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(Os, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Bs, t);
  }
  translateOnAxis(t, e) {
    return Ns.copy(t).applyQuaternion(this.quaternion), this.position.add(Ns.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(Fs, t);
  }
  translateY(t) {
    return this.translateOnAxis(Os, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Bs, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(qe.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, n) {
    t.isVector3 ? wi.copy(t) : wi.set(t, e, n);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1), jn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? qe.lookAt(jn, wi, this.up) : qe.lookAt(wi, jn, this.up), this.quaternion.setFromRotationMatrix(qe), r && (qe.extractRotation(r.matrixWorld), bn.setFromRotationMatrix(qe), this.quaternion.premultiply(bn.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.parent !== null && t.parent.remove(t), t.parent = this, this.children.push(t), t.dispatchEvent(Lo)) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Do)), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), qe.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), qe.multiply(t.parent.matrixWorld)), t.applyMatrix4(qe), this.add(t), t.updateWorldMatrix(!1, !0), this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, r = this.children.length; n < r; n++) {
      const o = this.children[n].getObjectByProperty(t, e);
      if (o !== void 0)
        return o;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const r = this.children;
    for (let s = 0, o = r.length; s < o; s++)
      r[s].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(jn, t, Co), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(jn, Po, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++)
      e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++)
      e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1, t = !0);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++) {
      const s = e[n];
      (s.matrixWorldAutoUpdate === !0 || t === !0) && s.updateMatrixWorld(t);
    }
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (t === !0 && n !== null && n.matrixWorldAutoUpdate === !0 && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), e === !0) {
      const r = this.children;
      for (let s = 0, o = r.length; s < o; s++) {
        const a = r[s];
        a.matrixWorldAutoUpdate === !0 && a.updateWorldMatrix(!1, !0);
      }
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", n = {};
    e && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const r = {};
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.visibility = this._visibility, r.active = this._active, r.bounds = this._bounds.map((a) => ({
      boxInitialized: a.boxInitialized,
      boxMin: a.box.min.toArray(),
      boxMax: a.box.max.toArray(),
      sphereInitialized: a.sphereInitialized,
      sphereRadius: a.sphere.radius,
      sphereCenter: a.sphere.center.toArray()
    })), r.maxGeometryCount = this._maxGeometryCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.geometryCount = this._geometryCount, r.matricesTexture = this._matricesTexture.toJSON(t), this.boundingSphere !== null && (r.boundingSphere = {
      center: r.boundingSphere.center.toArray(),
      radius: r.boundingSphere.radius
    }), this.boundingBox !== null && (r.boundingBox = {
      min: r.boundingBox.min.toArray(),
      max: r.boundingBox.max.toArray()
    }));
    function s(a, l) {
      return a[l.uuid] === void 0 && (a[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(t.geometries, this.geometry);
      const a = this.geometry.parameters;
      if (a !== void 0 && a.shapes !== void 0) {
        const l = a.shapes;
        if (Array.isArray(l))
          for (let c = 0, h = l.length; c < h; c++) {
            const f = l[c];
            s(t.shapes, f);
          }
        else
          s(t.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(t.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const a = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          a.push(s(t.materials, this.material[l]));
        r.material = a;
      } else
        r.material = s(t.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let a = 0; a < this.children.length; a++)
        r.children.push(this.children[a].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let a = 0; a < this.animations.length; a++) {
        const l = this.animations[a];
        r.animations.push(s(t.animations, l));
      }
    }
    if (e) {
      const a = o(t.geometries), l = o(t.materials), c = o(t.textures), h = o(t.images), f = o(t.shapes), p = o(t.skeletons), m = o(t.animations), g = o(t.nodes);
      a.length > 0 && (n.geometries = a), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), f.length > 0 && (n.shapes = f), p.length > 0 && (n.skeletons = p), m.length > 0 && (n.animations = m), g.length > 0 && (n.nodes = g);
    }
    return n.object = r, n;
    function o(a) {
      const l = [];
      for (const c in a) {
        const h = a[c];
        delete h.metadata, l.push(h);
      }
      return l;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === !0)
      for (let n = 0; n < t.children.length; n++) {
        const r = t.children[n];
        this.add(r.clone());
      }
    return this;
  }
}
ue.DEFAULT_UP = /* @__PURE__ */ new L(0, 1, 0);
ue.DEFAULT_MATRIX_AUTO_UPDATE = !0;
ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const ze = /* @__PURE__ */ new L(), Ye = /* @__PURE__ */ new L(), br = /* @__PURE__ */ new L(), Ze = /* @__PURE__ */ new L(), An = /* @__PURE__ */ new L(), wn = /* @__PURE__ */ new L(), zs = /* @__PURE__ */ new L(), Ar = /* @__PURE__ */ new L(), wr = /* @__PURE__ */ new L(), Rr = /* @__PURE__ */ new L();
let Ri = !1;
class Ne {
  constructor(t = new L(), e = new L(), n = new L()) {
    this.a = t, this.b = e, this.c = n;
  }
  static getNormal(t, e, n, r) {
    r.subVectors(n, e), ze.subVectors(t, e), r.cross(ze);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(t, e, n, r, s) {
    ze.subVectors(r, e), Ye.subVectors(n, e), br.subVectors(t, e);
    const o = ze.dot(ze), a = ze.dot(Ye), l = ze.dot(br), c = Ye.dot(Ye), h = Ye.dot(br), f = o * c - a * a;
    if (f === 0)
      return s.set(0, 0, 0), null;
    const p = 1 / f, m = (c * l - a * h) * p, g = (o * h - a * l) * p;
    return s.set(1 - m - g, g, m);
  }
  static containsPoint(t, e, n, r) {
    return this.getBarycoord(t, e, n, r, Ze) === null ? !1 : Ze.x >= 0 && Ze.y >= 0 && Ze.x + Ze.y <= 1;
  }
  static getUV(t, e, n, r, s, o, a, l) {
    return Ri === !1 && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), Ri = !0), this.getInterpolation(t, e, n, r, s, o, a, l);
  }
  static getInterpolation(t, e, n, r, s, o, a, l) {
    return this.getBarycoord(t, e, n, r, Ze) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(s, Ze.x), l.addScaledVector(o, Ze.y), l.addScaledVector(a, Ze.z), l);
  }
  static isFrontFacing(t, e, n, r) {
    return ze.subVectors(n, e), Ye.subVectors(t, e), ze.cross(Ye).dot(r) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, r) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[r]), this;
  }
  setFromAttributeAndIndices(t, e, n, r) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, r), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return ze.subVectors(this.c, this.b), Ye.subVectors(this.a, this.b), ze.cross(Ye).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return Ne.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return Ne.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getUV(t, e, n, r, s) {
    return Ri === !1 && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), Ri = !0), Ne.getInterpolation(t, this.a, this.b, this.c, e, n, r, s);
  }
  getInterpolation(t, e, n, r, s) {
    return Ne.getInterpolation(t, this.a, this.b, this.c, e, n, r, s);
  }
  containsPoint(t) {
    return Ne.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return Ne.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a, r = this.b, s = this.c;
    let o, a;
    An.subVectors(r, n), wn.subVectors(s, n), Ar.subVectors(t, n);
    const l = An.dot(Ar), c = wn.dot(Ar);
    if (l <= 0 && c <= 0)
      return e.copy(n);
    wr.subVectors(t, r);
    const h = An.dot(wr), f = wn.dot(wr);
    if (h >= 0 && f <= h)
      return e.copy(r);
    const p = l * f - h * c;
    if (p <= 0 && l >= 0 && h <= 0)
      return o = l / (l - h), e.copy(n).addScaledVector(An, o);
    Rr.subVectors(t, s);
    const m = An.dot(Rr), g = wn.dot(Rr);
    if (g >= 0 && m <= g)
      return e.copy(s);
    const _ = m * c - l * g;
    if (_ <= 0 && c >= 0 && g <= 0)
      return a = c / (c - g), e.copy(n).addScaledVector(wn, a);
    const d = h * g - m * f;
    if (d <= 0 && f - h >= 0 && m - g >= 0)
      return zs.subVectors(s, r), a = (f - h) / (f - h + (m - g)), e.copy(r).addScaledVector(zs, a);
    const u = 1 / (d + _ + p);
    return o = _ * u, a = p * u, e.copy(n).addScaledVector(An, o).addScaledVector(wn, a);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Oa = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, rn = { h: 0, s: 0, l: 0 }, Ci = { h: 0, s: 0, l: 0 };
function Cr(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * 6 * (2 / 3 - e) : i;
}
class Bt {
  constructor(t, e, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const r = t;
      r && r.isColor ? this.copy(r) : typeof r == "number" ? this.setHex(r) : typeof r == "string" && this.setStyle(r);
    } else
      this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  setHex(t, e = _e) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, qt.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, n, r = qt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, qt.toWorkingColorSpace(this, r), this;
  }
  setHSL(t, e, n, r = qt.workingColorSpace) {
    if (t = vo(t, 1), e = ye(e, 0, 1), n = ye(n, 0, 1), e === 0)
      this.r = this.g = this.b = n;
    else {
      const s = n <= 0.5 ? n * (1 + e) : n + e - n * e, o = 2 * n - s;
      this.r = Cr(o, s, t + 1 / 3), this.g = Cr(o, s, t), this.b = Cr(o, s, t - 1 / 3);
    }
    return qt.toWorkingColorSpace(this, r), this;
  }
  setStyle(t, e = _e) {
    function n(s) {
      s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let r;
    if (r = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let s;
      const o = r[1], a = r[2];
      switch (o) {
        case "rgb":
        case "rgba":
          if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(s[4]), this.setRGB(
              Math.min(255, parseInt(s[1], 10)) / 255,
              Math.min(255, parseInt(s[2], 10)) / 255,
              Math.min(255, parseInt(s[3], 10)) / 255,
              e
            );
          if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(s[4]), this.setRGB(
              Math.min(100, parseInt(s[1], 10)) / 100,
              Math.min(100, parseInt(s[2], 10)) / 100,
              Math.min(100, parseInt(s[3], 10)) / 100,
              e
            );
          break;
        case "hsl":
        case "hsla":
          if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return n(s[4]), this.setHSL(
              parseFloat(s[1]) / 360,
              parseFloat(s[2]) / 100,
              parseFloat(s[3]) / 100,
              e
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (r = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const s = r[1], o = s.length;
      if (o === 3)
        return this.setRGB(
          parseInt(s.charAt(0), 16) / 15,
          parseInt(s.charAt(1), 16) / 15,
          parseInt(s.charAt(2), 16) / 15,
          e
        );
      if (o === 6)
        return this.setHex(parseInt(s, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0)
      return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = _e) {
    const n = Oa[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = kn(t.r), this.g = kn(t.g), this.b = kn(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = _r(t.r), this.g = _r(t.g), this.b = _r(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = _e) {
    return qt.fromWorkingColorSpace(Se.copy(this), t), Math.round(ye(Se.r * 255, 0, 255)) * 65536 + Math.round(ye(Se.g * 255, 0, 255)) * 256 + Math.round(ye(Se.b * 255, 0, 255));
  }
  getHexString(t = _e) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = qt.workingColorSpace) {
    qt.fromWorkingColorSpace(Se.copy(this), e);
    const n = Se.r, r = Se.g, s = Se.b, o = Math.max(n, r, s), a = Math.min(n, r, s);
    let l, c;
    const h = (a + o) / 2;
    if (a === o)
      l = 0, c = 0;
    else {
      const f = o - a;
      switch (c = h <= 0.5 ? f / (o + a) : f / (2 - o - a), o) {
        case n:
          l = (r - s) / f + (r < s ? 6 : 0);
          break;
        case r:
          l = (s - n) / f + 2;
          break;
        case s:
          l = (n - r) / f + 4;
          break;
      }
      l /= 6;
    }
    return t.h = l, t.s = c, t.l = h, t;
  }
  getRGB(t, e = qt.workingColorSpace) {
    return qt.fromWorkingColorSpace(Se.copy(this), e), t.r = Se.r, t.g = Se.g, t.b = Se.b, t;
  }
  getStyle(t = _e) {
    qt.fromWorkingColorSpace(Se.copy(this), t);
    const e = Se.r, n = Se.g, r = Se.b;
    return t !== _e ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(r * 255)})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(rn), this.setHSL(rn.h + t, rn.s + e, rn.l + n);
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  lerpColors(t, e, n) {
    return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
  }
  lerpHSL(t, e) {
    this.getHSL(rn), t.getHSL(Ci);
    const n = mr(rn.h, Ci.h, e), r = mr(rn.s, Ci.s, e), s = mr(rn.l, Ci.l, e);
    return this.setHSL(n, r, s), this;
  }
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  applyMatrix3(t) {
    const e = this.r, n = this.g, r = this.b, s = t.elements;
    return this.r = s[0] * e + s[3] * n + s[6] * r, this.g = s[1] * e + s[4] * n + s[7] * r, this.b = s[2] * e + s[5] * n + s[8] * r, this;
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Se = /* @__PURE__ */ new Bt();
Bt.NAMES = Oa;
let Uo = 0;
class ln extends qn {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Uo++ }), this.uuid = je(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Bt(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = 7680, this.stencilZFail = 7680, this.stencilZPass = 7680, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  onBuild() {
  }
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const r = this[e];
        if (r === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r && r.isColor ? r.set(n) : r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[e] = n;
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (n.blending = this.blending), this.side !== 0 && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== 204 && (n.blendSrc = this.blendSrc), this.blendDst !== 205 && (n.blendDst = this.blendDst), this.blendEquation !== 100 && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (n.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function r(s) {
      const o = [];
      for (const a in s) {
        const l = s[a];
        delete l.metadata, o.push(l);
      }
      return o;
    }
    if (e) {
      const s = r(t.textures), o = r(t.images);
      s.length > 0 && (n.textures = s), o.length > 0 && (n.images = o);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const r = e.length;
      n = new Array(r);
      for (let s = 0; s !== r; ++s)
        n[s] = e[s].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
}
class Wn extends ln {
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Bt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const le = /* @__PURE__ */ new L(), Pi = /* @__PURE__ */ new rt();
class ae {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = 35044, this._updateRange = { offset: 0, count: -1 }, this.updateRanges = [], this.gpuType = 1015, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  get updateRange() {
    return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  copyAt(t, e, n) {
    t *= this.itemSize, n *= e.itemSize;
    for (let r = 0, s = this.itemSize; r < s; r++)
      this.array[t + r] = e.array[n + r];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        Pi.fromBufferAttribute(this, e), Pi.applyMatrix3(t), this.setXY(e, Pi.x, Pi.y);
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        le.fromBufferAttribute(this, e), le.applyMatrix3(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyMatrix4(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyNormalMatrix(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.transformDirection(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = Ke(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = Yt(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, r) {
    return t *= this.itemSize, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array), r = Yt(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = r, this;
  }
  setXYZW(t, e, n, r, s) {
    return t *= this.itemSize, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array), r = Yt(r, this.array), s = Yt(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = r, this.array[t + 3] = s, this;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (t.name = this.name), this.usage !== 35044 && (t.usage = this.usage), t;
  }
}
class Ba extends ae {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class za extends ae {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class ve extends ae {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let Io = 0;
const Ie = /* @__PURE__ */ new te(), Pr = /* @__PURE__ */ new ue(), Rn = /* @__PURE__ */ new L(), Le = /* @__PURE__ */ new di(), $n = /* @__PURE__ */ new di(), ge = /* @__PURE__ */ new L();
class ce extends qn {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Io++ }), this.uuid = je(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (Ua(t) ? za : Ba)(t, 1) : this.index = t, this;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: n
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const s = new Vt().getNormalMatrix(t);
      n.applyNormalMatrix(s), n.needsUpdate = !0;
    }
    const r = this.attributes.tangent;
    return r !== void 0 && (r.transformDirection(t), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return Ie.makeRotationFromQuaternion(t), this.applyMatrix4(Ie), this;
  }
  rotateX(t) {
    return Ie.makeRotationX(t), this.applyMatrix4(Ie), this;
  }
  rotateY(t) {
    return Ie.makeRotationY(t), this.applyMatrix4(Ie), this;
  }
  rotateZ(t) {
    return Ie.makeRotationZ(t), this.applyMatrix4(Ie), this;
  }
  translate(t, e, n) {
    return Ie.makeTranslation(t, e, n), this.applyMatrix4(Ie), this;
  }
  scale(t, e, n) {
    return Ie.makeScale(t, e, n), this.applyMatrix4(Ie), this;
  }
  lookAt(t) {
    return Pr.lookAt(t), Pr.updateMatrix(), this.applyMatrix4(Pr.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Rn).negate(), this.translate(Rn.x, Rn.y, Rn.z), this;
  }
  setFromPoints(t) {
    const e = [];
    for (let n = 0, r = t.length; n < r; n++) {
      const s = t[n];
      e.push(s.x, s.y, s.z || 0);
    }
    return this.setAttribute("position", new ve(e, 3)), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new di());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this), this.boundingBox.set(
        new L(-1 / 0, -1 / 0, -1 / 0),
        new L(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let n = 0, r = e.length; n < r; n++) {
          const s = e[n];
          Le.setFromBufferAttribute(s), this.morphTargetsRelative ? (ge.addVectors(this.boundingBox.min, Le.min), this.boundingBox.expandByPoint(ge), ge.addVectors(this.boundingBox.max, Le.max), this.boundingBox.expandByPoint(ge)) : (this.boundingBox.expandByPoint(Le.min), this.boundingBox.expandByPoint(Le.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new pi());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this), this.boundingSphere.set(new L(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (Le.setFromBufferAttribute(t), e)
        for (let s = 0, o = e.length; s < o; s++) {
          const a = e[s];
          $n.setFromBufferAttribute(a), this.morphTargetsRelative ? (ge.addVectors(Le.min, $n.min), Le.expandByPoint(ge), ge.addVectors(Le.max, $n.max), Le.expandByPoint(ge)) : (Le.expandByPoint($n.min), Le.expandByPoint($n.max));
        }
      Le.getCenter(n);
      let r = 0;
      for (let s = 0, o = t.count; s < o; s++)
        ge.fromBufferAttribute(t, s), r = Math.max(r, n.distanceToSquared(ge));
      if (e)
        for (let s = 0, o = e.length; s < o; s++) {
          const a = e[s], l = this.morphTargetsRelative;
          for (let c = 0, h = a.count; c < h; c++)
            ge.fromBufferAttribute(a, c), l && (Rn.fromBufferAttribute(t, c), ge.add(Rn)), r = Math.max(r, n.distanceToSquared(ge));
        }
      this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.array, r = e.position.array, s = e.normal.array, o = e.uv.array, a = r.length / 3;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new ae(new Float32Array(4 * a), 4));
    const l = this.getAttribute("tangent").array, c = [], h = [];
    for (let S = 0; S < a; S++)
      c[S] = new L(), h[S] = new L();
    const f = new L(), p = new L(), m = new L(), g = new rt(), _ = new rt(), d = new rt(), u = new L(), T = new L();
    function v(S, U, N) {
      f.fromArray(r, S * 3), p.fromArray(r, U * 3), m.fromArray(r, N * 3), g.fromArray(o, S * 2), _.fromArray(o, U * 2), d.fromArray(o, N * 2), p.sub(f), m.sub(f), _.sub(g), d.sub(g);
      const Y = 1 / (_.x * d.y - d.x * _.y);
      isFinite(Y) && (u.copy(p).multiplyScalar(d.y).addScaledVector(m, -_.y).multiplyScalar(Y), T.copy(m).multiplyScalar(_.x).addScaledVector(p, -d.x).multiplyScalar(Y), c[S].add(u), c[U].add(u), c[N].add(u), h[S].add(T), h[U].add(T), h[N].add(T));
    }
    let b = this.groups;
    b.length === 0 && (b = [{
      start: 0,
      count: n.length
    }]);
    for (let S = 0, U = b.length; S < U; ++S) {
      const N = b[S], Y = N.start, P = N.count;
      for (let B = Y, H = Y + P; B < H; B += 3)
        v(
          n[B + 0],
          n[B + 1],
          n[B + 2]
        );
    }
    const R = new L(), A = new L(), w = new L(), O = new L();
    function M(S) {
      w.fromArray(s, S * 3), O.copy(w);
      const U = c[S];
      R.copy(U), R.sub(w.multiplyScalar(w.dot(U))).normalize(), A.crossVectors(O, U);
      const Y = A.dot(h[S]) < 0 ? -1 : 1;
      l[S * 4] = R.x, l[S * 4 + 1] = R.y, l[S * 4 + 2] = R.z, l[S * 4 + 3] = Y;
    }
    for (let S = 0, U = b.length; S < U; ++S) {
      const N = b[S], Y = N.start, P = N.count;
      for (let B = Y, H = Y + P; B < H; B += 3)
        M(n[B + 0]), M(n[B + 1]), M(n[B + 2]);
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new ae(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let p = 0, m = n.count; p < m; p++)
          n.setXYZ(p, 0, 0, 0);
      const r = new L(), s = new L(), o = new L(), a = new L(), l = new L(), c = new L(), h = new L(), f = new L();
      if (t)
        for (let p = 0, m = t.count; p < m; p += 3) {
          const g = t.getX(p + 0), _ = t.getX(p + 1), d = t.getX(p + 2);
          r.fromBufferAttribute(e, g), s.fromBufferAttribute(e, _), o.fromBufferAttribute(e, d), h.subVectors(o, s), f.subVectors(r, s), h.cross(f), a.fromBufferAttribute(n, g), l.fromBufferAttribute(n, _), c.fromBufferAttribute(n, d), a.add(h), l.add(h), c.add(h), n.setXYZ(g, a.x, a.y, a.z), n.setXYZ(_, l.x, l.y, l.z), n.setXYZ(d, c.x, c.y, c.z);
        }
      else
        for (let p = 0, m = e.count; p < m; p += 3)
          r.fromBufferAttribute(e, p + 0), s.fromBufferAttribute(e, p + 1), o.fromBufferAttribute(e, p + 2), h.subVectors(o, s), f.subVectors(r, s), h.cross(f), n.setXYZ(p + 0, h.x, h.y, h.z), n.setXYZ(p + 1, h.x, h.y, h.z), n.setXYZ(p + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      ge.fromBufferAttribute(t, e), ge.normalize(), t.setXYZ(e, ge.x, ge.y, ge.z);
  }
  toNonIndexed() {
    function t(a, l) {
      const c = a.array, h = a.itemSize, f = a.normalized, p = new c.constructor(l.length * h);
      let m = 0, g = 0;
      for (let _ = 0, d = l.length; _ < d; _++) {
        a.isInterleavedBufferAttribute ? m = l[_] * a.data.stride + a.offset : m = l[_] * h;
        for (let u = 0; u < h; u++)
          p[g++] = c[m++];
      }
      return new ae(p, h, f);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new ce(), n = this.index.array, r = this.attributes;
    for (const a in r) {
      const l = r[a], c = t(l, n);
      e.setAttribute(a, c);
    }
    const s = this.morphAttributes;
    for (const a in s) {
      const l = [], c = s[a];
      for (let h = 0, f = c.length; h < f; h++) {
        const p = c[h], m = t(p, n);
        l.push(m);
      }
      e.morphAttributes[a] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const o = this.groups;
    for (let a = 0, l = o.length; a < l; a++) {
      const c = o[a];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l)
        l[c] !== void 0 && (t[c] = l[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = {
      type: e.array.constructor.name,
      array: Array.prototype.slice.call(e.array)
    });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      t.data.attributes[l] = c.toJSON(t.data);
    }
    const r = {};
    let s = !1;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], h = [];
      for (let f = 0, p = c.length; f < p; f++) {
        const m = c[f];
        h.push(m.toJSON(t.data));
      }
      h.length > 0 && (r[l] = h, s = !0);
    }
    s && (t.data.morphAttributes = r, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const o = this.groups;
    o.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(o)));
    const a = this.boundingSphere;
    return a !== null && (t.data.boundingSphere = {
      center: a.center.toArray(),
      radius: a.radius
    }), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const r = t.attributes;
    for (const c in r) {
      const h = r[c];
      this.setAttribute(c, h.clone(e));
    }
    const s = t.morphAttributes;
    for (const c in s) {
      const h = [], f = s[c];
      for (let p = 0, m = f.length; p < m; p++)
        h.push(f[p].clone(e));
      this.morphAttributes[c] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const o = t.groups;
    for (let c = 0, h = o.length; c < h; c++) {
      const f = o[c];
      this.addGroup(f.start, f.count, f.materialIndex);
    }
    const a = t.boundingBox;
    a !== null && (this.boundingBox = a.clone());
    const l = t.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const Gs = /* @__PURE__ */ new te(), dn = /* @__PURE__ */ new ir(), Li = /* @__PURE__ */ new pi(), Hs = /* @__PURE__ */ new L(), Cn = /* @__PURE__ */ new L(), Pn = /* @__PURE__ */ new L(), Ln = /* @__PURE__ */ new L(), Lr = /* @__PURE__ */ new L(), Di = /* @__PURE__ */ new L(), Ui = /* @__PURE__ */ new rt(), Ii = /* @__PURE__ */ new rt(), Ni = /* @__PURE__ */ new rt(), Vs = /* @__PURE__ */ new L(), ks = /* @__PURE__ */ new L(), Ws = /* @__PURE__ */ new L(), Fi = /* @__PURE__ */ new L(), Oi = /* @__PURE__ */ new L();
class ie extends ue {
  constructor(t = new ce(), e = new Wn()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const r = e[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, o = r.length; s < o; s++) {
          const a = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry, r = n.attributes.position, s = n.morphAttributes.position, o = n.morphTargetsRelative;
    e.fromBufferAttribute(r, t);
    const a = this.morphTargetInfluences;
    if (s && a) {
      Di.set(0, 0, 0);
      for (let l = 0, c = s.length; l < c; l++) {
        const h = a[l], f = s[l];
        h !== 0 && (Lr.fromBufferAttribute(f, t), o ? Di.addScaledVector(Lr, h) : Di.addScaledVector(Lr.sub(e), h));
      }
      e.add(Di);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry, r = this.material, s = this.matrixWorld;
    r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Li.copy(n.boundingSphere), Li.applyMatrix4(s), dn.copy(t.ray).recast(t.near), !(Li.containsPoint(dn.origin) === !1 && (dn.intersectSphere(Li, Hs) === null || dn.origin.distanceToSquared(Hs) > (t.far - t.near) ** 2)) && (Gs.copy(s).invert(), dn.copy(t.ray).applyMatrix4(Gs), !(n.boundingBox !== null && dn.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(t, e, dn)));
  }
  _computeIntersections(t, e, n) {
    let r;
    const s = this.geometry, o = this.material, a = s.index, l = s.attributes.position, c = s.attributes.uv, h = s.attributes.uv1, f = s.attributes.normal, p = s.groups, m = s.drawRange;
    if (a !== null)
      if (Array.isArray(o))
        for (let g = 0, _ = p.length; g < _; g++) {
          const d = p[g], u = o[d.materialIndex], T = Math.max(d.start, m.start), v = Math.min(a.count, Math.min(d.start + d.count, m.start + m.count));
          for (let b = T, R = v; b < R; b += 3) {
            const A = a.getX(b), w = a.getX(b + 1), O = a.getX(b + 2);
            r = Bi(this, u, t, n, c, h, f, A, w, O), r && (r.faceIndex = Math.floor(b / 3), r.face.materialIndex = d.materialIndex, e.push(r));
          }
        }
      else {
        const g = Math.max(0, m.start), _ = Math.min(a.count, m.start + m.count);
        for (let d = g, u = _; d < u; d += 3) {
          const T = a.getX(d), v = a.getX(d + 1), b = a.getX(d + 2);
          r = Bi(this, o, t, n, c, h, f, T, v, b), r && (r.faceIndex = Math.floor(d / 3), e.push(r));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(o))
        for (let g = 0, _ = p.length; g < _; g++) {
          const d = p[g], u = o[d.materialIndex], T = Math.max(d.start, m.start), v = Math.min(l.count, Math.min(d.start + d.count, m.start + m.count));
          for (let b = T, R = v; b < R; b += 3) {
            const A = b, w = b + 1, O = b + 2;
            r = Bi(this, u, t, n, c, h, f, A, w, O), r && (r.faceIndex = Math.floor(b / 3), r.face.materialIndex = d.materialIndex, e.push(r));
          }
        }
      else {
        const g = Math.max(0, m.start), _ = Math.min(l.count, m.start + m.count);
        for (let d = g, u = _; d < u; d += 3) {
          const T = d, v = d + 1, b = d + 2;
          r = Bi(this, o, t, n, c, h, f, T, v, b), r && (r.faceIndex = Math.floor(d / 3), e.push(r));
        }
      }
  }
}
function No(i, t, e, n, r, s, o, a) {
  let l;
  if (t.side === 1 ? l = n.intersectTriangle(o, s, r, !0, a) : l = n.intersectTriangle(r, s, o, t.side === 0, a), l === null) return null;
  Oi.copy(a), Oi.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(Oi);
  return c < e.near || c > e.far ? null : {
    distance: c,
    point: Oi.clone(),
    object: i
  };
}
function Bi(i, t, e, n, r, s, o, a, l, c) {
  i.getVertexPosition(a, Cn), i.getVertexPosition(l, Pn), i.getVertexPosition(c, Ln);
  const h = No(i, t, e, n, Cn, Pn, Ln, Fi);
  if (h) {
    r && (Ui.fromBufferAttribute(r, a), Ii.fromBufferAttribute(r, l), Ni.fromBufferAttribute(r, c), h.uv = Ne.getInterpolation(Fi, Cn, Pn, Ln, Ui, Ii, Ni, new rt())), s && (Ui.fromBufferAttribute(s, a), Ii.fromBufferAttribute(s, l), Ni.fromBufferAttribute(s, c), h.uv1 = Ne.getInterpolation(Fi, Cn, Pn, Ln, Ui, Ii, Ni, new rt()), h.uv2 = h.uv1), o && (Vs.fromBufferAttribute(o, a), ks.fromBufferAttribute(o, l), Ws.fromBufferAttribute(o, c), h.normal = Ne.getInterpolation(Fi, Cn, Pn, Ln, Vs, ks, Ws, new L()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const f = {
      a,
      b: l,
      c,
      normal: new L(),
      materialIndex: 0
    };
    Ne.getNormal(Cn, Pn, Ln, f.normal), h.face = f;
  }
  return h;
}
class mi extends ce {
  constructor(t = 1, e = 1, n = 1, r = 1, s = 1, o = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: t,
      height: e,
      depth: n,
      widthSegments: r,
      heightSegments: s,
      depthSegments: o
    };
    const a = this;
    r = Math.floor(r), s = Math.floor(s), o = Math.floor(o);
    const l = [], c = [], h = [], f = [];
    let p = 0, m = 0;
    g("z", "y", "x", -1, -1, n, e, t, o, s, 0), g("z", "y", "x", 1, -1, n, e, -t, o, s, 1), g("x", "z", "y", 1, 1, t, n, e, r, o, 2), g("x", "z", "y", 1, -1, t, n, -e, r, o, 3), g("x", "y", "z", 1, -1, t, e, n, r, s, 4), g("x", "y", "z", -1, -1, t, e, -n, r, s, 5), this.setIndex(l), this.setAttribute("position", new ve(c, 3)), this.setAttribute("normal", new ve(h, 3)), this.setAttribute("uv", new ve(f, 2));
    function g(_, d, u, T, v, b, R, A, w, O, M) {
      const S = b / w, U = R / O, N = b / 2, Y = R / 2, P = A / 2, B = w + 1, H = O + 1;
      let J = 0, X = 0;
      const W = new L();
      for (let tt = 0; tt < H; tt++) {
        const et = tt * U - Y;
        for (let ut = 0; ut < B; ut++) {
          const k = ut * S - N;
          W[_] = k * T, W[d] = et * v, W[u] = P, c.push(W.x, W.y, W.z), W[_] = 0, W[d] = 0, W[u] = A > 0 ? 1 : -1, h.push(W.x, W.y, W.z), f.push(ut / w), f.push(1 - tt / O), J += 1;
        }
      }
      for (let tt = 0; tt < O; tt++)
        for (let et = 0; et < w; et++) {
          const ut = p + et + B * tt, k = p + et + B * (tt + 1), j = p + (et + 1) + B * (tt + 1), ft = p + (et + 1) + B * tt;
          l.push(ut, k, ft), l.push(k, j, ft), X += 6;
        }
      a.addGroup(m, X, M), m += X, p += J;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new mi(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function Xn(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const r = i[e][n];
      r && (r.isColor || r.isMatrix3 || r.isMatrix4 || r.isVector2 || r.isVector3 || r.isVector4 || r.isTexture || r.isQuaternion) ? r.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = r.clone() : Array.isArray(r) ? t[e][n] = r.slice() : t[e][n] = r;
    }
  }
  return t;
}
function Ae(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = Xn(i[e]);
    for (const r in n)
      t[r] = n[r];
  }
  return t;
}
function Fo(i) {
  const t = [];
  for (let e = 0; e < i.length; e++)
    t.push(i[e].clone());
  return t;
}
function Ga(i) {
  return i.getRenderTarget() === null ? i.outputColorSpace : qt.workingColorSpace;
}
const Ha = { clone: Xn, merge: Ae };
var Oo = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Bo = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class Re extends ln {
  constructor(t) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Oo, this.fragmentShader = Bo, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      derivatives: !1,
      // set to use derivatives
      fragDepth: !1,
      // set to use fragment depth values
      drawBuffers: !1,
      // set to use draw buffers
      shaderTextureLOD: !1,
      // set to use shader texture LOD
      clipCullDistance: !1
      // set to use vertex shader clipping
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = Xn(t.uniforms), this.uniformsGroups = Fo(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    e.glslVersion = this.glslVersion, e.uniforms = {};
    for (const r in this.uniforms) {
      const o = this.uniforms[r].value;
      o && o.isTexture ? e.uniforms[r] = {
        type: "t",
        value: o.toJSON(t).uuid
      } : o && o.isColor ? e.uniforms[r] = {
        type: "c",
        value: o.getHex()
      } : o && o.isVector2 ? e.uniforms[r] = {
        type: "v2",
        value: o.toArray()
      } : o && o.isVector3 ? e.uniforms[r] = {
        type: "v3",
        value: o.toArray()
      } : o && o.isVector4 ? e.uniforms[r] = {
        type: "v4",
        value: o.toArray()
      } : o && o.isMatrix3 ? e.uniforms[r] = {
        type: "m3",
        value: o.toArray()
      } : o && o.isMatrix4 ? e.uniforms[r] = {
        type: "m4",
        value: o.toArray()
      } : e.uniforms[r] = {
        value: o
      };
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
    const n = {};
    for (const r in this.extensions)
      this.extensions[r] === !0 && (n[r] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class Va extends ue {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new te(), this.projectionMatrix = new te(), this.projectionMatrixInverse = new te(), this.coordinateSystem = 2e3;
  }
  copy(t, e) {
    return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class De extends Va {
  constructor(t = 50, e = 1, n = 0.1, r = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(t) {
    const e = 0.5 * this.getFilmHeight() / t;
    this.fov = Zr * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength() {
    const t = Math.tan(pr * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  getEffectiveFOV() {
    return Zr * 2 * Math.atan(
      Math.tan(pr * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(t, e, n, r, s, o) {
    this.aspect = t / e, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = o, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = t * Math.tan(pr * 0.5 * this.fov) / this.zoom, n = 2 * e, r = this.aspect * n, s = -0.5 * r;
    const o = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = o.fullWidth, c = o.fullHeight;
      s += o.offsetX * r / l, e -= o.offsetY * n / c, r *= o.width / l, n *= o.height / c;
    }
    const a = this.filmOffset;
    a !== 0 && (s += t * a / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + r, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
  }
}
const Dn = -90, Un = 1;
class zo extends ue {
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const r = new De(Dn, Un, t, e);
    r.layers = this.layers, this.add(r);
    const s = new De(Dn, Un, t, e);
    s.layers = this.layers, this.add(s);
    const o = new De(Dn, Un, t, e);
    o.layers = this.layers, this.add(o);
    const a = new De(Dn, Un, t, e);
    a.layers = this.layers, this.add(a);
    const l = new De(Dn, Un, t, e);
    l.layers = this.layers, this.add(l);
    const c = new De(Dn, Un, t, e);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, r, s, o, a, l] = e;
    for (const c of e) this.remove(c);
    if (t === 2e3)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), o.up.set(0, 0, 1), o.lookAt(0, -1, 0), a.up.set(0, 1, 0), a.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === 2001)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), o.up.set(0, 0, -1), o.lookAt(0, -1, 0), a.up.set(0, -1, 0), a.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
    for (const c of e)
      this.add(c), c.updateMatrixWorld();
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: r } = this;
    this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
    const [s, o, a, l, c, h] = this.children, f = t.getRenderTarget(), p = t.getActiveCubeFace(), m = t.getActiveMipmapLevel(), g = t.xr.enabled;
    t.xr.enabled = !1;
    const _ = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0, r), t.render(e, s), t.setRenderTarget(n, 1, r), t.render(e, o), t.setRenderTarget(n, 2, r), t.render(e, a), t.setRenderTarget(n, 3, r), t.render(e, l), t.setRenderTarget(n, 4, r), t.render(e, c), n.texture.generateMipmaps = _, t.setRenderTarget(n, 5, r), t.render(e, h), t.setRenderTarget(f, p, m), t.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class ka extends we {
  constructor(t, e, n, r, s, o, a, l, c, h) {
    t = t !== void 0 ? t : [], e = e !== void 0 ? e : 301, super(t, e, n, r, s, o, a, l, c, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class Go extends on {
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = !0;
    const n = { width: t, height: t, depth: 1 }, r = [n, n, n, n, n, n];
    e.encoding !== void 0 && (ii("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."), e.colorSpace = e.encoding === 3001 ? _e : Fe), this.texture = new ka(r, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : !1, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : 1006;
  }
  fromEquirectangularTexture(t, e) {
    this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, r = new mi(5, 5, 5), s = new Re({
      name: "CubemapFromEquirect",
      uniforms: Xn(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: 1,
      blending: 0
    });
    s.uniforms.tEquirect.value = e;
    const o = new ie(r, s), a = e.minFilter;
    return e.minFilter === 1008 && (e.minFilter = 1006), new zo(1, 10, this).update(t, o), e.minFilter = a, o.geometry.dispose(), o.material.dispose(), this;
  }
  clear(t, e, n, r) {
    const s = t.getRenderTarget();
    for (let o = 0; o < 6; o++)
      t.setRenderTarget(this, o), t.clear(e, n, r);
    t.setRenderTarget(s);
  }
}
const Dr = /* @__PURE__ */ new L(), Ho = /* @__PURE__ */ new L(), Vo = /* @__PURE__ */ new Vt();
class mn {
  constructor(t = new L(1, 0, 0), e = 0) {
    this.isPlane = !0, this.normal = t, this.constant = e;
  }
  set(t, e) {
    return this.normal.copy(t), this.constant = e, this;
  }
  setComponents(t, e, n, r) {
    return this.normal.set(t, e, n), this.constant = r, this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const r = Dr.subVectors(n, e).cross(Ho.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(r, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), this.constant = t.constant, this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), this.constant *= t, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(Dr), r = this.normal.dot(n);
    if (r === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const s = -(t.start.dot(this.normal) + this.constant) / r;
    return s < 0 || s > 1 ? null : e.copy(t.start).addScaledVector(n, s);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
    return e < 0 && n > 0 || n < 0 && e > 0;
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || Vo.getNormalMatrix(t), r = this.coplanarPoint(Dr).applyMatrix4(t), s = this.normal.applyMatrix3(n).normalize();
    return this.constant = -r.dot(s), this;
  }
  translate(t) {
    return this.constant -= t.dot(this.normal), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const pn = /* @__PURE__ */ new pi(), zi = /* @__PURE__ */ new L();
class cs {
  constructor(t = new mn(), e = new mn(), n = new mn(), r = new mn(), s = new mn(), o = new mn()) {
    this.planes = [t, e, n, r, s, o];
  }
  set(t, e, n, r, s, o) {
    const a = this.planes;
    return a[0].copy(t), a[1].copy(e), a[2].copy(n), a[3].copy(r), a[4].copy(s), a[5].copy(o), this;
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = 2e3) {
    const n = this.planes, r = t.elements, s = r[0], o = r[1], a = r[2], l = r[3], c = r[4], h = r[5], f = r[6], p = r[7], m = r[8], g = r[9], _ = r[10], d = r[11], u = r[12], T = r[13], v = r[14], b = r[15];
    if (n[0].setComponents(l - s, p - c, d - m, b - u).normalize(), n[1].setComponents(l + s, p + c, d + m, b + u).normalize(), n[2].setComponents(l + o, p + h, d + g, b + T).normalize(), n[3].setComponents(l - o, p - h, d - g, b - T).normalize(), n[4].setComponents(l - a, p - f, d - _, b - v).normalize(), e === 2e3)
      n[5].setComponents(l + a, p + f, d + _, b + v).normalize();
    else if (e === 2001)
      n[5].setComponents(a, f, _, v).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(), pn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), pn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(pn);
  }
  intersectsSprite(t) {
    return pn.center.set(0, 0, 0), pn.radius = 0.7071067811865476, pn.applyMatrix4(t.matrixWorld), this.intersectsSphere(pn);
  }
  intersectsSphere(t) {
    const e = this.planes, n = t.center, r = -t.radius;
    for (let s = 0; s < 6; s++)
      if (e[s].distanceToPoint(n) < r)
        return !1;
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const r = e[n];
      if (zi.x = r.normal.x > 0 ? t.max.x : t.min.x, zi.y = r.normal.y > 0 ? t.max.y : t.min.y, zi.z = r.normal.z > 0 ? t.max.z : t.min.z, r.distanceToPoint(zi) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      if (e[n].distanceToPoint(t) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function Wa() {
  let i = null, t = !1, e = null, n = null;
  function r(s, o) {
    e(s, o), n = i.requestAnimationFrame(r);
  }
  return {
    start: function() {
      t !== !0 && e !== null && (n = i.requestAnimationFrame(r), t = !0);
    },
    stop: function() {
      i.cancelAnimationFrame(n), t = !1;
    },
    setAnimationLoop: function(s) {
      e = s;
    },
    setContext: function(s) {
      i = s;
    }
  };
}
function ko(i, t) {
  const e = t.isWebGL2, n = /* @__PURE__ */ new WeakMap();
  function r(c, h) {
    const f = c.array, p = c.usage, m = f.byteLength, g = i.createBuffer();
    i.bindBuffer(h, g), i.bufferData(h, f, p), c.onUploadCallback();
    let _;
    if (f instanceof Float32Array)
      _ = i.FLOAT;
    else if (f instanceof Uint16Array)
      if (c.isFloat16BufferAttribute)
        if (e)
          _ = i.HALF_FLOAT;
        else
          throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");
      else
        _ = i.UNSIGNED_SHORT;
    else if (f instanceof Int16Array)
      _ = i.SHORT;
    else if (f instanceof Uint32Array)
      _ = i.UNSIGNED_INT;
    else if (f instanceof Int32Array)
      _ = i.INT;
    else if (f instanceof Int8Array)
      _ = i.BYTE;
    else if (f instanceof Uint8Array)
      _ = i.UNSIGNED_BYTE;
    else if (f instanceof Uint8ClampedArray)
      _ = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + f);
    return {
      buffer: g,
      type: _,
      bytesPerElement: f.BYTES_PER_ELEMENT,
      version: c.version,
      size: m
    };
  }
  function s(c, h, f) {
    const p = h.array, m = h._updateRange, g = h.updateRanges;
    if (i.bindBuffer(f, c), m.count === -1 && g.length === 0 && i.bufferSubData(f, 0, p), g.length !== 0) {
      for (let _ = 0, d = g.length; _ < d; _++) {
        const u = g[_];
        e ? i.bufferSubData(
          f,
          u.start * p.BYTES_PER_ELEMENT,
          p,
          u.start,
          u.count
        ) : i.bufferSubData(
          f,
          u.start * p.BYTES_PER_ELEMENT,
          p.subarray(u.start, u.start + u.count)
        );
      }
      h.clearUpdateRanges();
    }
    m.count !== -1 && (e ? i.bufferSubData(
      f,
      m.offset * p.BYTES_PER_ELEMENT,
      p,
      m.offset,
      m.count
    ) : i.bufferSubData(
      f,
      m.offset * p.BYTES_PER_ELEMENT,
      p.subarray(m.offset, m.offset + m.count)
    ), m.count = -1), h.onUploadCallback();
  }
  function o(c) {
    return c.isInterleavedBufferAttribute && (c = c.data), n.get(c);
  }
  function a(c) {
    c.isInterleavedBufferAttribute && (c = c.data);
    const h = n.get(c);
    h && (i.deleteBuffer(h.buffer), n.delete(c));
  }
  function l(c, h) {
    if (c.isGLBufferAttribute) {
      const p = n.get(c);
      (!p || p.version < c.version) && n.set(c, {
        buffer: c.buffer,
        type: c.type,
        bytesPerElement: c.elementSize,
        version: c.version
      });
      return;
    }
    c.isInterleavedBufferAttribute && (c = c.data);
    const f = n.get(c);
    if (f === void 0)
      n.set(c, r(c, h));
    else if (f.version < c.version) {
      if (f.size !== c.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      s(f.buffer, c, h), f.version = c.version;
    }
  }
  return {
    get: o,
    remove: a,
    update: l
  };
}
class gi extends ce {
  constructor(t = 1, e = 1, n = 1, r = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: e,
      widthSegments: n,
      heightSegments: r
    };
    const s = t / 2, o = e / 2, a = Math.floor(n), l = Math.floor(r), c = a + 1, h = l + 1, f = t / a, p = e / l, m = [], g = [], _ = [], d = [];
    for (let u = 0; u < h; u++) {
      const T = u * p - o;
      for (let v = 0; v < c; v++) {
        const b = v * f - s;
        g.push(b, -T, 0), _.push(0, 0, 1), d.push(v / a), d.push(1 - u / l);
      }
    }
    for (let u = 0; u < l; u++)
      for (let T = 0; T < a; T++) {
        const v = T + c * u, b = T + c * (u + 1), R = T + 1 + c * (u + 1), A = T + 1 + c * u;
        m.push(v, b, A), m.push(b, R, A);
      }
    this.setIndex(m), this.setAttribute("position", new ve(g, 3)), this.setAttribute("normal", new ve(_, 3)), this.setAttribute("uv", new ve(d, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new gi(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
var Wo = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Xo = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, qo = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Yo = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Zo = `#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`, Jo = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Ko = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, jo = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, $o = `#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Qo = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`, tl = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, el = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, nl = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, il = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, rl = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, sl = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`, al = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, ol = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, ll = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, cl = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, hl = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, ul = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`, fl = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`, dl = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, pl = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, ml = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, gl = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, _l = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, vl = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, xl = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Ml = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Sl = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`, yl = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, El = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, Tl = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, bl = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, Al = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, wl = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, Rl = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Cl = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Pl = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Ll = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, Dl = `#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`, Ul = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Il = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Nl = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, Fl = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Ol = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, Bl = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, zl = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Gl = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, Hl = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Vl = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, kl = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Wl = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Xl = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, ql = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Yl = `#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Zl = `#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Jl = `#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`, Kl = `#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`, jl = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, $l = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Ql = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, tc = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, ec = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, nc = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, ic = `#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, rc = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`, sc = `#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`, ac = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`, oc = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, lc = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, cc = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, hc = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, uc = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, fc = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, dc = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, pc = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, mc = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, gc = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, _c = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, vc = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, xc = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Mc = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, Sc = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, yc = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, Ec = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, Tc = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, bc = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`, Ac = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, wc = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, Rc = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, Cc = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Pc = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Lc = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, Dc = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, Uc = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Ic = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, Nc = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, Fc = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, Oc = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Bc = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, zc = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Gc = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Hc = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Vc = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const kc = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Wc = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Xc = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, qc = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Yc = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Zc = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Jc = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Kc = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`, jc = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, $c = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, Qc = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, th = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, eh = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, nh = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, ih = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, rh = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, sh = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, ah = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, oh = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, lh = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, ch = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, hh = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, uh = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, fh = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, dh = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, ph = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, mh = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, gh = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, _h = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, vh = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, xh = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Mh = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Sh = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, yh = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ot = {
  alphahash_fragment: Wo,
  alphahash_pars_fragment: Xo,
  alphamap_fragment: qo,
  alphamap_pars_fragment: Yo,
  alphatest_fragment: Zo,
  alphatest_pars_fragment: Jo,
  aomap_fragment: Ko,
  aomap_pars_fragment: jo,
  batching_pars_vertex: $o,
  batching_vertex: Qo,
  begin_vertex: tl,
  beginnormal_vertex: el,
  bsdfs: nl,
  iridescence_fragment: il,
  bumpmap_pars_fragment: rl,
  clipping_planes_fragment: sl,
  clipping_planes_pars_fragment: al,
  clipping_planes_pars_vertex: ol,
  clipping_planes_vertex: ll,
  color_fragment: cl,
  color_pars_fragment: hl,
  color_pars_vertex: ul,
  color_vertex: fl,
  common: dl,
  cube_uv_reflection_fragment: pl,
  defaultnormal_vertex: ml,
  displacementmap_pars_vertex: gl,
  displacementmap_vertex: _l,
  emissivemap_fragment: vl,
  emissivemap_pars_fragment: xl,
  colorspace_fragment: Ml,
  colorspace_pars_fragment: Sl,
  envmap_fragment: yl,
  envmap_common_pars_fragment: El,
  envmap_pars_fragment: Tl,
  envmap_pars_vertex: bl,
  envmap_physical_pars_fragment: Ol,
  envmap_vertex: Al,
  fog_vertex: wl,
  fog_pars_vertex: Rl,
  fog_fragment: Cl,
  fog_pars_fragment: Pl,
  gradientmap_pars_fragment: Ll,
  lightmap_fragment: Dl,
  lightmap_pars_fragment: Ul,
  lights_lambert_fragment: Il,
  lights_lambert_pars_fragment: Nl,
  lights_pars_begin: Fl,
  lights_toon_fragment: Bl,
  lights_toon_pars_fragment: zl,
  lights_phong_fragment: Gl,
  lights_phong_pars_fragment: Hl,
  lights_physical_fragment: Vl,
  lights_physical_pars_fragment: kl,
  lights_fragment_begin: Wl,
  lights_fragment_maps: Xl,
  lights_fragment_end: ql,
  logdepthbuf_fragment: Yl,
  logdepthbuf_pars_fragment: Zl,
  logdepthbuf_pars_vertex: Jl,
  logdepthbuf_vertex: Kl,
  map_fragment: jl,
  map_pars_fragment: $l,
  map_particle_fragment: Ql,
  map_particle_pars_fragment: tc,
  metalnessmap_fragment: ec,
  metalnessmap_pars_fragment: nc,
  morphcolor_vertex: ic,
  morphnormal_vertex: rc,
  morphtarget_pars_vertex: sc,
  morphtarget_vertex: ac,
  normal_fragment_begin: oc,
  normal_fragment_maps: lc,
  normal_pars_fragment: cc,
  normal_pars_vertex: hc,
  normal_vertex: uc,
  normalmap_pars_fragment: fc,
  clearcoat_normal_fragment_begin: dc,
  clearcoat_normal_fragment_maps: pc,
  clearcoat_pars_fragment: mc,
  iridescence_pars_fragment: gc,
  opaque_fragment: _c,
  packing: vc,
  premultiplied_alpha_fragment: xc,
  project_vertex: Mc,
  dithering_fragment: Sc,
  dithering_pars_fragment: yc,
  roughnessmap_fragment: Ec,
  roughnessmap_pars_fragment: Tc,
  shadowmap_pars_fragment: bc,
  shadowmap_pars_vertex: Ac,
  shadowmap_vertex: wc,
  shadowmask_pars_fragment: Rc,
  skinbase_vertex: Cc,
  skinning_pars_vertex: Pc,
  skinning_vertex: Lc,
  skinnormal_vertex: Dc,
  specularmap_fragment: Uc,
  specularmap_pars_fragment: Ic,
  tonemapping_fragment: Nc,
  tonemapping_pars_fragment: Fc,
  transmission_fragment: Oc,
  transmission_pars_fragment: Bc,
  uv_pars_fragment: zc,
  uv_pars_vertex: Gc,
  uv_vertex: Hc,
  worldpos_vertex: Vc,
  background_vert: kc,
  background_frag: Wc,
  backgroundCube_vert: Xc,
  backgroundCube_frag: qc,
  cube_vert: Yc,
  cube_frag: Zc,
  depth_vert: Jc,
  depth_frag: Kc,
  distanceRGBA_vert: jc,
  distanceRGBA_frag: $c,
  equirect_vert: Qc,
  equirect_frag: th,
  linedashed_vert: eh,
  linedashed_frag: nh,
  meshbasic_vert: ih,
  meshbasic_frag: rh,
  meshlambert_vert: sh,
  meshlambert_frag: ah,
  meshmatcap_vert: oh,
  meshmatcap_frag: lh,
  meshnormal_vert: ch,
  meshnormal_frag: hh,
  meshphong_vert: uh,
  meshphong_frag: fh,
  meshphysical_vert: dh,
  meshphysical_frag: ph,
  meshtoon_vert: mh,
  meshtoon_frag: gh,
  points_vert: _h,
  points_frag: vh,
  shadow_vert: xh,
  shadow_frag: Mh,
  sprite_vert: Sh,
  sprite_frag: yh
}, ot = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Bt(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Vt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Vt() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  envmap: {
    envMap: { value: null },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Vt() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Vt() },
    normalScale: { value: /* @__PURE__ */ new rt(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Vt() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Vt() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Bt(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Bt(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Vt() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Vt() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Bt(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new rt(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Vt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Vt() },
    alphaTest: { value: 0 }
  }
}, He = {
  basic: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.specularmap,
      ot.envmap,
      ot.aomap,
      ot.lightmap,
      ot.fog
    ]),
    vertexShader: Ot.meshbasic_vert,
    fragmentShader: Ot.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.specularmap,
      ot.envmap,
      ot.aomap,
      ot.lightmap,
      ot.emissivemap,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      ot.fog,
      ot.lights,
      {
        emissive: { value: /* @__PURE__ */ new Bt(0) }
      }
    ]),
    vertexShader: Ot.meshlambert_vert,
    fragmentShader: Ot.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.specularmap,
      ot.envmap,
      ot.aomap,
      ot.lightmap,
      ot.emissivemap,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      ot.fog,
      ot.lights,
      {
        emissive: { value: /* @__PURE__ */ new Bt(0) },
        specular: { value: /* @__PURE__ */ new Bt(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Ot.meshphong_vert,
    fragmentShader: Ot.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.envmap,
      ot.aomap,
      ot.lightmap,
      ot.emissivemap,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      ot.roughnessmap,
      ot.metalnessmap,
      ot.fog,
      ot.lights,
      {
        emissive: { value: /* @__PURE__ */ new Bt(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
        // temporary
      }
    ]),
    vertexShader: Ot.meshphysical_vert,
    fragmentShader: Ot.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.aomap,
      ot.lightmap,
      ot.emissivemap,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      ot.gradientmap,
      ot.fog,
      ot.lights,
      {
        emissive: { value: /* @__PURE__ */ new Bt(0) }
      }
    ]),
    vertexShader: Ot.meshtoon_vert,
    fragmentShader: Ot.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      ot.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Ot.meshmatcap_vert,
    fragmentShader: Ot.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Ae([
      ot.points,
      ot.fog
    ]),
    vertexShader: Ot.points_vert,
    fragmentShader: Ot.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Ot.linedashed_vert,
    fragmentShader: Ot.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.displacementmap
    ]),
    vertexShader: Ot.depth_vert,
    fragmentShader: Ot.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.bumpmap,
      ot.normalmap,
      ot.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ot.meshnormal_vert,
    fragmentShader: Ot.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Ae([
      ot.sprite,
      ot.fog
    ]),
    vertexShader: Ot.sprite_vert,
    fragmentShader: Ot.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Vt() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ot.background_vert,
    fragmentShader: Ot.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ot.backgroundCube_vert,
    fragmentShader: Ot.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Ot.cube_vert,
    fragmentShader: Ot.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Ot.equirect_vert,
    fragmentShader: Ot.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ Ae([
      ot.common,
      ot.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new L() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ot.distanceRGBA_vert,
    fragmentShader: Ot.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Ae([
      ot.lights,
      ot.fog,
      {
        color: { value: /* @__PURE__ */ new Bt(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ot.shadow_vert,
    fragmentShader: Ot.shadow_frag
  }
};
He.physical = {
  uniforms: /* @__PURE__ */ Ae([
    He.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Vt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Vt() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new rt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Vt() },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Vt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Vt() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Bt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Vt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Vt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Vt() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new rt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Vt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Bt(0) },
      specularColor: { value: /* @__PURE__ */ new Bt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Vt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Vt() },
      anisotropyVector: { value: /* @__PURE__ */ new rt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Vt() }
    }
  ]),
  vertexShader: Ot.meshphysical_vert,
  fragmentShader: Ot.meshphysical_frag
};
const Gi = { r: 0, b: 0, g: 0 };
function Eh(i, t, e, n, r, s, o) {
  const a = new Bt(0);
  let l = s === !0 ? 0 : 1, c, h, f = null, p = 0, m = null;
  function g(d, u) {
    let T = !1, v = u.isScene === !0 ? u.background : null;
    v && v.isTexture && (v = (u.backgroundBlurriness > 0 ? e : t).get(v)), v === null ? _(a, l) : v && v.isColor && (_(v, 1), T = !0);
    const b = i.xr.getEnvironmentBlendMode();
    b === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, o) : b === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, o), (i.autoClear || T) && i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil), v && (v.isCubeTexture || v.mapping === 306) ? (h === void 0 && (h = new ie(
      new mi(1, 1, 1),
      new Re({
        name: "BackgroundCubeMaterial",
        uniforms: Xn(He.backgroundCube.uniforms),
        vertexShader: He.backgroundCube.vertexShader,
        fragmentShader: He.backgroundCube.fragmentShader,
        side: 1,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(R, A, w) {
      this.matrixWorld.copyPosition(w.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), r.update(h)), h.material.uniforms.envMap.value = v, h.material.uniforms.flipEnvMap.value = v.isCubeTexture && v.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = u.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = u.backgroundIntensity, h.material.toneMapped = qt.getTransfer(v.colorSpace) !== $t, (f !== v || p !== v.version || m !== i.toneMapping) && (h.material.needsUpdate = !0, f = v, p = v.version, m = i.toneMapping), h.layers.enableAll(), d.unshift(h, h.geometry, h.material, 0, 0, null)) : v && v.isTexture && (c === void 0 && (c = new ie(
      new gi(2, 2),
      new Re({
        name: "BackgroundMaterial",
        uniforms: Xn(He.background.uniforms),
        vertexShader: He.background.vertexShader,
        fragmentShader: He.background.fragmentShader,
        side: 0,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), r.update(c)), c.material.uniforms.t2D.value = v, c.material.uniforms.backgroundIntensity.value = u.backgroundIntensity, c.material.toneMapped = qt.getTransfer(v.colorSpace) !== $t, v.matrixAutoUpdate === !0 && v.updateMatrix(), c.material.uniforms.uvTransform.value.copy(v.matrix), (f !== v || p !== v.version || m !== i.toneMapping) && (c.material.needsUpdate = !0, f = v, p = v.version, m = i.toneMapping), c.layers.enableAll(), d.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function _(d, u) {
    d.getRGB(Gi, Ga(i)), n.buffers.color.setClear(Gi.r, Gi.g, Gi.b, u, o);
  }
  return {
    getClearColor: function() {
      return a;
    },
    setClearColor: function(d, u = 1) {
      a.set(d), l = u, _(a, l);
    },
    getClearAlpha: function() {
      return l;
    },
    setClearAlpha: function(d) {
      l = d, _(a, l);
    },
    render: g
  };
}
function Th(i, t, e, n) {
  const r = i.getParameter(i.MAX_VERTEX_ATTRIBS), s = n.isWebGL2 ? null : t.get("OES_vertex_array_object"), o = n.isWebGL2 || s !== null, a = {}, l = d(null);
  let c = l, h = !1;
  function f(P, B, H, J, X) {
    let W = !1;
    if (o) {
      const tt = _(J, H, B);
      c !== tt && (c = tt, m(c.object)), W = u(P, J, H, X), W && T(P, J, H, X);
    } else {
      const tt = B.wireframe === !0;
      (c.geometry !== J.id || c.program !== H.id || c.wireframe !== tt) && (c.geometry = J.id, c.program = H.id, c.wireframe = tt, W = !0);
    }
    X !== null && e.update(X, i.ELEMENT_ARRAY_BUFFER), (W || h) && (h = !1, O(P, B, H, J), X !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(X).buffer));
  }
  function p() {
    return n.isWebGL2 ? i.createVertexArray() : s.createVertexArrayOES();
  }
  function m(P) {
    return n.isWebGL2 ? i.bindVertexArray(P) : s.bindVertexArrayOES(P);
  }
  function g(P) {
    return n.isWebGL2 ? i.deleteVertexArray(P) : s.deleteVertexArrayOES(P);
  }
  function _(P, B, H) {
    const J = H.wireframe === !0;
    let X = a[P.id];
    X === void 0 && (X = {}, a[P.id] = X);
    let W = X[B.id];
    W === void 0 && (W = {}, X[B.id] = W);
    let tt = W[J];
    return tt === void 0 && (tt = d(p()), W[J] = tt), tt;
  }
  function d(P) {
    const B = [], H = [], J = [];
    for (let X = 0; X < r; X++)
      B[X] = 0, H[X] = 0, J[X] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: B,
      enabledAttributes: H,
      attributeDivisors: J,
      object: P,
      attributes: {},
      index: null
    };
  }
  function u(P, B, H, J) {
    const X = c.attributes, W = B.attributes;
    let tt = 0;
    const et = H.getAttributes();
    for (const ut in et)
      if (et[ut].location >= 0) {
        const j = X[ut];
        let ft = W[ut];
        if (ft === void 0 && (ut === "instanceMatrix" && P.instanceMatrix && (ft = P.instanceMatrix), ut === "instanceColor" && P.instanceColor && (ft = P.instanceColor)), j === void 0 || j.attribute !== ft || ft && j.data !== ft.data) return !0;
        tt++;
      }
    return c.attributesNum !== tt || c.index !== J;
  }
  function T(P, B, H, J) {
    const X = {}, W = B.attributes;
    let tt = 0;
    const et = H.getAttributes();
    for (const ut in et)
      if (et[ut].location >= 0) {
        let j = W[ut];
        j === void 0 && (ut === "instanceMatrix" && P.instanceMatrix && (j = P.instanceMatrix), ut === "instanceColor" && P.instanceColor && (j = P.instanceColor));
        const ft = {};
        ft.attribute = j, j && j.data && (ft.data = j.data), X[ut] = ft, tt++;
      }
    c.attributes = X, c.attributesNum = tt, c.index = J;
  }
  function v() {
    const P = c.newAttributes;
    for (let B = 0, H = P.length; B < H; B++)
      P[B] = 0;
  }
  function b(P) {
    R(P, 0);
  }
  function R(P, B) {
    const H = c.newAttributes, J = c.enabledAttributes, X = c.attributeDivisors;
    H[P] = 1, J[P] === 0 && (i.enableVertexAttribArray(P), J[P] = 1), X[P] !== B && ((n.isWebGL2 ? i : t.get("ANGLE_instanced_arrays"))[n.isWebGL2 ? "vertexAttribDivisor" : "vertexAttribDivisorANGLE"](P, B), X[P] = B);
  }
  function A() {
    const P = c.newAttributes, B = c.enabledAttributes;
    for (let H = 0, J = B.length; H < J; H++)
      B[H] !== P[H] && (i.disableVertexAttribArray(H), B[H] = 0);
  }
  function w(P, B, H, J, X, W, tt) {
    tt === !0 ? i.vertexAttribIPointer(P, B, H, X, W) : i.vertexAttribPointer(P, B, H, J, X, W);
  }
  function O(P, B, H, J) {
    if (n.isWebGL2 === !1 && (P.isInstancedMesh || J.isInstancedBufferGeometry) && t.get("ANGLE_instanced_arrays") === null)
      return;
    v();
    const X = J.attributes, W = H.getAttributes(), tt = B.defaultAttributeValues;
    for (const et in W) {
      const ut = W[et];
      if (ut.location >= 0) {
        let k = X[et];
        if (k === void 0 && (et === "instanceMatrix" && P.instanceMatrix && (k = P.instanceMatrix), et === "instanceColor" && P.instanceColor && (k = P.instanceColor)), k !== void 0) {
          const j = k.normalized, ft = k.itemSize, xt = e.get(k);
          if (xt === void 0) continue;
          const mt = xt.buffer, wt = xt.type, Dt = xt.bytesPerElement, Mt = n.isWebGL2 === !0 && (wt === i.INT || wt === i.UNSIGNED_INT || k.gpuType === 1013);
          if (k.isInterleavedBufferAttribute) {
            const Pt = k.data, C = Pt.stride, st = k.offset;
            if (Pt.isInstancedInterleavedBuffer) {
              for (let Z = 0; Z < ut.locationSize; Z++)
                R(ut.location + Z, Pt.meshPerAttribute);
              P.isInstancedMesh !== !0 && J._maxInstanceCount === void 0 && (J._maxInstanceCount = Pt.meshPerAttribute * Pt.count);
            } else
              for (let Z = 0; Z < ut.locationSize; Z++)
                b(ut.location + Z);
            i.bindBuffer(i.ARRAY_BUFFER, mt);
            for (let Z = 0; Z < ut.locationSize; Z++)
              w(
                ut.location + Z,
                ft / ut.locationSize,
                wt,
                j,
                C * Dt,
                (st + ft / ut.locationSize * Z) * Dt,
                Mt
              );
          } else {
            if (k.isInstancedBufferAttribute) {
              for (let Pt = 0; Pt < ut.locationSize; Pt++)
                R(ut.location + Pt, k.meshPerAttribute);
              P.isInstancedMesh !== !0 && J._maxInstanceCount === void 0 && (J._maxInstanceCount = k.meshPerAttribute * k.count);
            } else
              for (let Pt = 0; Pt < ut.locationSize; Pt++)
                b(ut.location + Pt);
            i.bindBuffer(i.ARRAY_BUFFER, mt);
            for (let Pt = 0; Pt < ut.locationSize; Pt++)
              w(
                ut.location + Pt,
                ft / ut.locationSize,
                wt,
                j,
                ft * Dt,
                ft / ut.locationSize * Pt * Dt,
                Mt
              );
          }
        } else if (tt !== void 0) {
          const j = tt[et];
          if (j !== void 0)
            switch (j.length) {
              case 2:
                i.vertexAttrib2fv(ut.location, j);
                break;
              case 3:
                i.vertexAttrib3fv(ut.location, j);
                break;
              case 4:
                i.vertexAttrib4fv(ut.location, j);
                break;
              default:
                i.vertexAttrib1fv(ut.location, j);
            }
        }
      }
    }
    A();
  }
  function M() {
    N();
    for (const P in a) {
      const B = a[P];
      for (const H in B) {
        const J = B[H];
        for (const X in J)
          g(J[X].object), delete J[X];
        delete B[H];
      }
      delete a[P];
    }
  }
  function S(P) {
    if (a[P.id] === void 0) return;
    const B = a[P.id];
    for (const H in B) {
      const J = B[H];
      for (const X in J)
        g(J[X].object), delete J[X];
      delete B[H];
    }
    delete a[P.id];
  }
  function U(P) {
    for (const B in a) {
      const H = a[B];
      if (H[P.id] === void 0) continue;
      const J = H[P.id];
      for (const X in J)
        g(J[X].object), delete J[X];
      delete H[P.id];
    }
  }
  function N() {
    Y(), h = !0, c !== l && (c = l, m(c.object));
  }
  function Y() {
    l.geometry = null, l.program = null, l.wireframe = !1;
  }
  return {
    setup: f,
    reset: N,
    resetDefaultState: Y,
    dispose: M,
    releaseStatesOfGeometry: S,
    releaseStatesOfProgram: U,
    initAttributes: v,
    enableAttribute: b,
    disableUnusedAttributes: A
  };
}
function bh(i, t, e, n) {
  const r = n.isWebGL2;
  let s;
  function o(h) {
    s = h;
  }
  function a(h, f) {
    i.drawArrays(s, h, f), e.update(f, s, 1);
  }
  function l(h, f, p) {
    if (p === 0) return;
    let m, g;
    if (r)
      m = i, g = "drawArraysInstanced";
    else if (m = t.get("ANGLE_instanced_arrays"), g = "drawArraysInstancedANGLE", m === null) {
      console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
      return;
    }
    m[g](s, h, f, p), e.update(f, s, p);
  }
  function c(h, f, p) {
    if (p === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null)
      for (let g = 0; g < p; g++)
        this.render(h[g], f[g]);
    else {
      m.multiDrawArraysWEBGL(s, h, 0, f, 0, p);
      let g = 0;
      for (let _ = 0; _ < p; _++)
        g += f[_];
      e.update(g, s, 1);
    }
  }
  this.setMode = o, this.render = a, this.renderInstances = l, this.renderMultiDraw = c;
}
function Ah(i, t, e) {
  let n;
  function r() {
    if (n !== void 0) return n;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const w = t.get("EXT_texture_filter_anisotropic");
      n = i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      n = 0;
    return n;
  }
  function s(w) {
    if (w === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      w = "mediump";
    }
    return w === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  const o = typeof WebGL2RenderingContext < "u" && i.constructor.name === "WebGL2RenderingContext";
  let a = e.precision !== void 0 ? e.precision : "highp";
  const l = s(a);
  l !== a && (console.warn("THREE.WebGLRenderer:", a, "not supported, using", l, "instead."), a = l);
  const c = o || t.has("WEBGL_draw_buffers"), h = e.logarithmicDepthBuffer === !0, f = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), p = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), m = i.getParameter(i.MAX_TEXTURE_SIZE), g = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), _ = i.getParameter(i.MAX_VERTEX_ATTRIBS), d = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), u = i.getParameter(i.MAX_VARYING_VECTORS), T = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), v = p > 0, b = o || t.has("OES_texture_float"), R = v && b, A = o ? i.getParameter(i.MAX_SAMPLES) : 0;
  return {
    isWebGL2: o,
    drawBuffers: c,
    getMaxAnisotropy: r,
    getMaxPrecision: s,
    precision: a,
    logarithmicDepthBuffer: h,
    maxTextures: f,
    maxVertexTextures: p,
    maxTextureSize: m,
    maxCubemapSize: g,
    maxAttributes: _,
    maxVertexUniforms: d,
    maxVaryings: u,
    maxFragmentUniforms: T,
    vertexTextures: v,
    floatFragmentTextures: b,
    floatVertexTextures: R,
    maxSamples: A
  };
}
function wh(i) {
  const t = this;
  let e = null, n = 0, r = !1, s = !1;
  const o = new mn(), a = new Vt(), l = { value: null, needsUpdate: !1 };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(f, p) {
    const m = f.length !== 0 || p || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || r;
    return r = p, n = f.length, m;
  }, this.beginShadows = function() {
    s = !0, h(null);
  }, this.endShadows = function() {
    s = !1;
  }, this.setGlobalState = function(f, p) {
    e = h(f, p, 0);
  }, this.setState = function(f, p, m) {
    const g = f.clippingPlanes, _ = f.clipIntersection, d = f.clipShadows, u = i.get(f);
    if (!r || g === null || g.length === 0 || s && !d)
      s ? h(null) : c();
    else {
      const T = s ? 0 : n, v = T * 4;
      let b = u.clippingState || null;
      l.value = b, b = h(g, p, v, m);
      for (let R = 0; R !== v; ++R)
        b[R] = e[R];
      u.clippingState = b, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += T;
    }
  };
  function c() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(f, p, m, g) {
    const _ = f !== null ? f.length : 0;
    let d = null;
    if (_ !== 0) {
      if (d = l.value, g !== !0 || d === null) {
        const u = m + _ * 4, T = p.matrixWorldInverse;
        a.getNormalMatrix(T), (d === null || d.length < u) && (d = new Float32Array(u));
        for (let v = 0, b = m; v !== _; ++v, b += 4)
          o.copy(f[v]).applyMatrix4(T, a), o.normal.toArray(d, b), d[b + 3] = o.constant;
      }
      l.value = d, l.needsUpdate = !0;
    }
    return t.numPlanes = _, t.numIntersection = 0, d;
  }
}
function Rh(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(o, a) {
    return a === 303 ? o.mapping = 301 : a === 304 && (o.mapping = 302), o;
  }
  function n(o) {
    if (o && o.isTexture) {
      const a = o.mapping;
      if (a === 303 || a === 304)
        if (t.has(o)) {
          const l = t.get(o).texture;
          return e(l, o.mapping);
        } else {
          const l = o.image;
          if (l && l.height > 0) {
            const c = new Go(l.height / 2);
            return c.fromEquirectangularTexture(i, o), t.set(o, c), o.addEventListener("dispose", r), e(c.texture, o.mapping);
          } else
            return null;
        }
    }
    return o;
  }
  function r(o) {
    const a = o.target;
    a.removeEventListener("dispose", r);
    const l = t.get(a);
    l !== void 0 && (t.delete(a), l.dispose());
  }
  function s() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: s
  };
}
class hs extends Va {
  constructor(t = -1, e = 1, n = 1, r = -1, s = 0.1, o = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = r, this.near = s, this.far = o, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
  }
  setViewOffset(t, e, n, r, s, o) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = o, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2;
    let s = n - t, o = n + t, a = r + e, l = r - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      s += c * this.view.offsetX, o = s + c * this.view.width, a -= h * this.view.offsetY, l = a - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(s, o, a, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
  }
}
const Gn = 4, Xs = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], _n = 20, Ur = /* @__PURE__ */ new hs(), qs = /* @__PURE__ */ new Bt();
let Ir = null, Nr = 0, Fr = 0;
const gn = (1 + Math.sqrt(5)) / 2, In = 1 / gn, Ys = [
  /* @__PURE__ */ new L(1, 1, 1),
  /* @__PURE__ */ new L(-1, 1, 1),
  /* @__PURE__ */ new L(1, 1, -1),
  /* @__PURE__ */ new L(-1, 1, -1),
  /* @__PURE__ */ new L(0, gn, In),
  /* @__PURE__ */ new L(0, gn, -In),
  /* @__PURE__ */ new L(In, 0, gn),
  /* @__PURE__ */ new L(-In, 0, gn),
  /* @__PURE__ */ new L(gn, In, 0),
  /* @__PURE__ */ new L(-gn, In, 0)
];
class Zs {
  constructor(t) {
    this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   */
  fromScene(t, e = 0, n = 0.1, r = 100) {
    Ir = this._renderer.getRenderTarget(), Nr = this._renderer.getActiveCubeFace(), Fr = this._renderer.getActiveMipmapLevel(), this._setSize(256);
    const s = this._allocateTargets();
    return s.depthBuffer = !0, this._sceneToCubeUV(t, n, r, s), e > 0 && this._blur(s, 0, 0, e), this._applyPMREM(s), this._cleanup(s), s;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   */
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   */
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = js(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Ks(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(t) {
    this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Ir, Nr, Fr), t.scissorTest = !1, Hi(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === 301 || t.mapping === 302 ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), Ir = this._renderer.getRenderTarget(), Nr = this._renderer.getActiveCubeFace(), Fr = this._renderer.getActiveMipmapLevel();
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
      magFilter: 1006,
      minFilter: 1006,
      generateMipmaps: !1,
      type: 1016,
      format: 1023,
      colorSpace: $e,
      depthBuffer: !1
    }, r = Js(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Js(t, e, n);
      const { _lodMax: s } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Ch(s)), this._blurMaterial = Ph(s, t, e);
    }
    return r;
  }
  _compileMaterial(t) {
    const e = new ie(this._lodPlanes[0], t);
    this._renderer.compile(e, Ur);
  }
  _sceneToCubeUV(t, e, n, r) {
    const a = new De(90, 1, e, n), l = [1, -1, 1, 1, 1, 1], c = [1, 1, 1, -1, -1, -1], h = this._renderer, f = h.autoClear, p = h.toneMapping;
    h.getClearColor(qs), h.toneMapping = 0, h.autoClear = !1;
    const m = new Wn({
      name: "PMREM.Background",
      side: 1,
      depthWrite: !1,
      depthTest: !1
    }), g = new ie(new mi(), m);
    let _ = !1;
    const d = t.background;
    d ? d.isColor && (m.color.copy(d), t.background = null, _ = !0) : (m.color.copy(qs), _ = !0);
    for (let u = 0; u < 6; u++) {
      const T = u % 3;
      T === 0 ? (a.up.set(0, l[u], 0), a.lookAt(c[u], 0, 0)) : T === 1 ? (a.up.set(0, 0, l[u]), a.lookAt(0, c[u], 0)) : (a.up.set(0, l[u], 0), a.lookAt(0, 0, c[u]));
      const v = this._cubeSize;
      Hi(r, T * v, u > 2 ? v : 0, v, v), h.setRenderTarget(r), _ && h.render(g, a), h.render(t, a);
    }
    g.geometry.dispose(), g.material.dispose(), h.toneMapping = p, h.autoClear = f, t.background = d;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, r = t.mapping === 301 || t.mapping === 302;
    r ? (this._cubemapMaterial === null && (this._cubemapMaterial = js()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Ks());
    const s = r ? this._cubemapMaterial : this._equirectMaterial, o = new ie(this._lodPlanes[0], s), a = s.uniforms;
    a.envMap.value = t;
    const l = this._cubeSize;
    Hi(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(o, Ur);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = !1;
    for (let r = 1; r < this._lodPlanes.length; r++) {
      const s = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = Ys[(r - 1) % Ys.length];
      this._blur(t, r - 1, r, s, o);
    }
    e.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   */
  _blur(t, e, n, r, s) {
    const o = this._pingPongRenderTarget;
    this._halfBlur(
      t,
      o,
      e,
      n,
      r,
      "latitudinal",
      s
    ), this._halfBlur(
      o,
      t,
      n,
      n,
      r,
      "longitudinal",
      s
    );
  }
  _halfBlur(t, e, n, r, s, o, a) {
    const l = this._renderer, c = this._blurMaterial;
    o !== "latitudinal" && o !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, f = new ie(this._lodPlanes[r], c), p = c.uniforms, m = this._sizeLods[n] - 1, g = isFinite(s) ? Math.PI / (2 * m) : 2 * Math.PI / (2 * _n - 1), _ = s / g, d = isFinite(s) ? 1 + Math.floor(h * _) : _n;
    d > _n && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${_n}`);
    const u = [];
    let T = 0;
    for (let w = 0; w < _n; ++w) {
      const O = w / _, M = Math.exp(-O * O / 2);
      u.push(M), w === 0 ? T += M : w < d && (T += 2 * M);
    }
    for (let w = 0; w < u.length; w++)
      u[w] = u[w] / T;
    p.envMap.value = t.texture, p.samples.value = d, p.weights.value = u, p.latitudinal.value = o === "latitudinal", a && (p.poleAxis.value = a);
    const { _lodMax: v } = this;
    p.dTheta.value = g, p.mipInt.value = v - n;
    const b = this._sizeLods[r], R = 3 * b * (r > v - Gn ? r - v + Gn : 0), A = 4 * (this._cubeSize - b);
    Hi(e, R, A, 3 * b, 2 * b), l.setRenderTarget(e), l.render(f, Ur);
  }
}
function Ch(i) {
  const t = [], e = [], n = [];
  let r = i;
  const s = i - Gn + 1 + Xs.length;
  for (let o = 0; o < s; o++) {
    const a = Math.pow(2, r);
    e.push(a);
    let l = 1 / a;
    o > i - Gn ? l = Xs[o - i + Gn - 1] : o === 0 && (l = 0), n.push(l);
    const c = 1 / (a - 2), h = -c, f = 1 + c, p = [h, h, f, h, f, f, h, h, f, f, h, f], m = 6, g = 6, _ = 3, d = 2, u = 1, T = new Float32Array(_ * g * m), v = new Float32Array(d * g * m), b = new Float32Array(u * g * m);
    for (let A = 0; A < m; A++) {
      const w = A % 3 * 2 / 3 - 1, O = A > 2 ? 0 : -1, M = [
        w,
        O,
        0,
        w + 2 / 3,
        O,
        0,
        w + 2 / 3,
        O + 1,
        0,
        w,
        O,
        0,
        w + 2 / 3,
        O + 1,
        0,
        w,
        O + 1,
        0
      ];
      T.set(M, _ * g * A), v.set(p, d * g * A);
      const S = [A, A, A, A, A, A];
      b.set(S, u * g * A);
    }
    const R = new ce();
    R.setAttribute("position", new ae(T, _)), R.setAttribute("uv", new ae(v, d)), R.setAttribute("faceIndex", new ae(b, u)), t.push(R), r > Gn && r--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function Js(i, t, e) {
  const n = new on(i, t, e);
  return n.texture.mapping = 306, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Hi(i, t, e, n, r) {
  i.viewport.set(t, e, n, r), i.scissor.set(t, e, n, r);
}
function Ph(i, t, e) {
  const n = new Float32Array(_n), r = new L(0, 1, 0);
  return new Re({
    name: "SphericalGaussianBlur",
    defines: {
      n: _n,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r }
    },
    vertexShader: us(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function Ks() {
  return new Re({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: us(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function js() {
  return new Re({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: us(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function us() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function Lh(i) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(a) {
    if (a && a.isTexture) {
      const l = a.mapping, c = l === 303 || l === 304, h = l === 301 || l === 302;
      if (c || h)
        if (a.isRenderTargetTexture && a.needsPMREMUpdate === !0) {
          a.needsPMREMUpdate = !1;
          let f = t.get(a);
          return e === null && (e = new Zs(i)), f = c ? e.fromEquirectangular(a, f) : e.fromCubemap(a, f), t.set(a, f), f.texture;
        } else {
          if (t.has(a))
            return t.get(a).texture;
          {
            const f = a.image;
            if (c && f && f.height > 0 || h && f && r(f)) {
              e === null && (e = new Zs(i));
              const p = c ? e.fromEquirectangular(a) : e.fromCubemap(a);
              return t.set(a, p), a.addEventListener("dispose", s), p.texture;
            } else
              return null;
          }
        }
    }
    return a;
  }
  function r(a) {
    let l = 0;
    const c = 6;
    for (let h = 0; h < c; h++)
      a[h] !== void 0 && l++;
    return l === c;
  }
  function s(a) {
    const l = a.target;
    l.removeEventListener("dispose", s);
    const c = t.get(l);
    c !== void 0 && (t.delete(l), c.dispose());
  }
  function o() {
    t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
  }
  return {
    get: n,
    dispose: o
  };
}
function Dh(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0)
      return t[n];
    let r;
    switch (n) {
      case "WEBGL_depth_texture":
        r = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        r = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        r = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        r = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        r = i.getExtension(n);
    }
    return t[n] = r, r;
  }
  return {
    has: function(n) {
      return e(n) !== null;
    },
    init: function(n) {
      n.isWebGL2 ? (e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance")) : (e("WEBGL_depth_texture"), e("OES_texture_float"), e("OES_texture_half_float"), e("OES_texture_half_float_linear"), e("OES_standard_derivatives"), e("OES_element_index_uint"), e("OES_vertex_array_object"), e("ANGLE_instanced_arrays")), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture");
    },
    get: function(n) {
      const r = e(n);
      return r === null && console.warn("THREE.WebGLRenderer: " + n + " extension not supported."), r;
    }
  };
}
function Uh(i, t, e, n) {
  const r = {}, s = /* @__PURE__ */ new WeakMap();
  function o(f) {
    const p = f.target;
    p.index !== null && t.remove(p.index);
    for (const g in p.attributes)
      t.remove(p.attributes[g]);
    for (const g in p.morphAttributes) {
      const _ = p.morphAttributes[g];
      for (let d = 0, u = _.length; d < u; d++)
        t.remove(_[d]);
    }
    p.removeEventListener("dispose", o), delete r[p.id];
    const m = s.get(p);
    m && (t.remove(m), s.delete(p)), n.releaseStatesOfGeometry(p), p.isInstancedBufferGeometry === !0 && delete p._maxInstanceCount, e.memory.geometries--;
  }
  function a(f, p) {
    return r[p.id] === !0 || (p.addEventListener("dispose", o), r[p.id] = !0, e.memory.geometries++), p;
  }
  function l(f) {
    const p = f.attributes;
    for (const g in p)
      t.update(p[g], i.ARRAY_BUFFER);
    const m = f.morphAttributes;
    for (const g in m) {
      const _ = m[g];
      for (let d = 0, u = _.length; d < u; d++)
        t.update(_[d], i.ARRAY_BUFFER);
    }
  }
  function c(f) {
    const p = [], m = f.index, g = f.attributes.position;
    let _ = 0;
    if (m !== null) {
      const T = m.array;
      _ = m.version;
      for (let v = 0, b = T.length; v < b; v += 3) {
        const R = T[v + 0], A = T[v + 1], w = T[v + 2];
        p.push(R, A, A, w, w, R);
      }
    } else if (g !== void 0) {
      const T = g.array;
      _ = g.version;
      for (let v = 0, b = T.length / 3 - 1; v < b; v += 3) {
        const R = v + 0, A = v + 1, w = v + 2;
        p.push(R, A, A, w, w, R);
      }
    } else
      return;
    const d = new (Ua(p) ? za : Ba)(p, 1);
    d.version = _;
    const u = s.get(f);
    u && t.remove(u), s.set(f, d);
  }
  function h(f) {
    const p = s.get(f);
    if (p) {
      const m = f.index;
      m !== null && p.version < m.version && c(f);
    } else
      c(f);
    return s.get(f);
  }
  return {
    get: a,
    update: l,
    getWireframeAttribute: h
  };
}
function Ih(i, t, e, n) {
  const r = n.isWebGL2;
  let s;
  function o(m) {
    s = m;
  }
  let a, l;
  function c(m) {
    a = m.type, l = m.bytesPerElement;
  }
  function h(m, g) {
    i.drawElements(s, g, a, m * l), e.update(g, s, 1);
  }
  function f(m, g, _) {
    if (_ === 0) return;
    let d, u;
    if (r)
      d = i, u = "drawElementsInstanced";
    else if (d = t.get("ANGLE_instanced_arrays"), u = "drawElementsInstancedANGLE", d === null) {
      console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
      return;
    }
    d[u](s, g, a, m * l, _), e.update(g, s, _);
  }
  function p(m, g, _) {
    if (_ === 0) return;
    const d = t.get("WEBGL_multi_draw");
    if (d === null)
      for (let u = 0; u < _; u++)
        this.render(m[u] / l, g[u]);
    else {
      d.multiDrawElementsWEBGL(s, g, 0, a, m, 0, _);
      let u = 0;
      for (let T = 0; T < _; T++)
        u += g[T];
      e.update(u, s, 1);
    }
  }
  this.setMode = o, this.setIndex = c, this.render = h, this.renderInstances = f, this.renderMultiDraw = p;
}
function Nh(i) {
  const t = {
    geometries: 0,
    textures: 0
  }, e = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(s, o, a) {
    switch (e.calls++, o) {
      case i.TRIANGLES:
        e.triangles += a * (s / 3);
        break;
      case i.LINES:
        e.lines += a * (s / 2);
        break;
      case i.LINE_STRIP:
        e.lines += a * (s - 1);
        break;
      case i.LINE_LOOP:
        e.lines += a * s;
        break;
      case i.POINTS:
        e.points += a * s;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", o);
        break;
    }
  }
  function r() {
    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: r,
    update: n
  };
}
function Fh(i, t) {
  return i[0] - t[0];
}
function Oh(i, t) {
  return Math.abs(t[1]) - Math.abs(i[1]);
}
function Bh(i, t, e) {
  const n = {}, r = new Float32Array(8), s = /* @__PURE__ */ new WeakMap(), o = new Qt(), a = [];
  for (let c = 0; c < 8; c++)
    a[c] = [c, 0];
  function l(c, h, f) {
    const p = c.morphTargetInfluences;
    if (t.isWebGL2 === !0) {
      const m = h.morphAttributes.position || h.morphAttributes.normal || h.morphAttributes.color, g = m !== void 0 ? m.length : 0;
      let _ = s.get(h);
      if (_ === void 0 || _.count !== g) {
        let P = function() {
          N.dispose(), s.delete(h), h.removeEventListener("dispose", P);
        };
        _ !== void 0 && _.texture.dispose();
        const T = h.morphAttributes.position !== void 0, v = h.morphAttributes.normal !== void 0, b = h.morphAttributes.color !== void 0, R = h.morphAttributes.position || [], A = h.morphAttributes.normal || [], w = h.morphAttributes.color || [];
        let O = 0;
        T === !0 && (O = 1), v === !0 && (O = 2), b === !0 && (O = 3);
        let M = h.attributes.position.count * O, S = 1;
        M > t.maxTextureSize && (S = Math.ceil(M / t.maxTextureSize), M = t.maxTextureSize);
        const U = new Float32Array(M * S * 4 * g), N = new Fa(U, M, S, g);
        N.type = 1015, N.needsUpdate = !0;
        const Y = O * 4;
        for (let B = 0; B < g; B++) {
          const H = R[B], J = A[B], X = w[B], W = M * S * 4 * B;
          for (let tt = 0; tt < H.count; tt++) {
            const et = tt * Y;
            T === !0 && (o.fromBufferAttribute(H, tt), U[W + et + 0] = o.x, U[W + et + 1] = o.y, U[W + et + 2] = o.z, U[W + et + 3] = 0), v === !0 && (o.fromBufferAttribute(J, tt), U[W + et + 4] = o.x, U[W + et + 5] = o.y, U[W + et + 6] = o.z, U[W + et + 7] = 0), b === !0 && (o.fromBufferAttribute(X, tt), U[W + et + 8] = o.x, U[W + et + 9] = o.y, U[W + et + 10] = o.z, U[W + et + 11] = X.itemSize === 4 ? o.w : 1);
          }
        }
        _ = {
          count: g,
          texture: N,
          size: new rt(M, S)
        }, s.set(h, _), h.addEventListener("dispose", P);
      }
      let d = 0;
      for (let T = 0; T < p.length; T++)
        d += p[T];
      const u = h.morphTargetsRelative ? 1 : 1 - d;
      f.getUniforms().setValue(i, "morphTargetBaseInfluence", u), f.getUniforms().setValue(i, "morphTargetInfluences", p), f.getUniforms().setValue(i, "morphTargetsTexture", _.texture, e), f.getUniforms().setValue(i, "morphTargetsTextureSize", _.size);
    } else {
      const m = p === void 0 ? 0 : p.length;
      let g = n[h.id];
      if (g === void 0 || g.length !== m) {
        g = [];
        for (let v = 0; v < m; v++)
          g[v] = [v, 0];
        n[h.id] = g;
      }
      for (let v = 0; v < m; v++) {
        const b = g[v];
        b[0] = v, b[1] = p[v];
      }
      g.sort(Oh);
      for (let v = 0; v < 8; v++)
        v < m && g[v][1] ? (a[v][0] = g[v][0], a[v][1] = g[v][1]) : (a[v][0] = Number.MAX_SAFE_INTEGER, a[v][1] = 0);
      a.sort(Fh);
      const _ = h.morphAttributes.position, d = h.morphAttributes.normal;
      let u = 0;
      for (let v = 0; v < 8; v++) {
        const b = a[v], R = b[0], A = b[1];
        R !== Number.MAX_SAFE_INTEGER && A ? (_ && h.getAttribute("morphTarget" + v) !== _[R] && h.setAttribute("morphTarget" + v, _[R]), d && h.getAttribute("morphNormal" + v) !== d[R] && h.setAttribute("morphNormal" + v, d[R]), r[v] = A, u += A) : (_ && h.hasAttribute("morphTarget" + v) === !0 && h.deleteAttribute("morphTarget" + v), d && h.hasAttribute("morphNormal" + v) === !0 && h.deleteAttribute("morphNormal" + v), r[v] = 0);
      }
      const T = h.morphTargetsRelative ? 1 : 1 - u;
      f.getUniforms().setValue(i, "morphTargetBaseInfluence", T), f.getUniforms().setValue(i, "morphTargetInfluences", r);
    }
  }
  return {
    update: l
  };
}
function zh(i, t, e, n) {
  let r = /* @__PURE__ */ new WeakMap();
  function s(l) {
    const c = n.render.frame, h = l.geometry, f = t.get(l, h);
    if (r.get(f) !== c && (t.update(f), r.set(f, c)), l.isInstancedMesh && (l.hasEventListener("dispose", a) === !1 && l.addEventListener("dispose", a), r.get(l) !== c && (e.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, i.ARRAY_BUFFER), r.set(l, c))), l.isSkinnedMesh) {
      const p = l.skeleton;
      r.get(p) !== c && (p.update(), r.set(p, c));
    }
    return f;
  }
  function o() {
    r = /* @__PURE__ */ new WeakMap();
  }
  function a(l) {
    const c = l.target;
    c.removeEventListener("dispose", a), e.remove(c.instanceMatrix), c.instanceColor !== null && e.remove(c.instanceColor);
  }
  return {
    update: s,
    dispose: o
  };
}
class Xa extends we {
  constructor(t, e, n, r, s, o, a, l, c, h) {
    if (h = h !== void 0 ? h : 1026, h !== 1026 && h !== 1027)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && h === 1026 && (n = 1014), n === void 0 && h === 1027 && (n = 1020), super(null, r, s, o, a, l, h, n, c), this.isDepthTexture = !0, this.image = { width: t, height: e }, this.magFilter = a !== void 0 ? a : 1003, this.minFilter = l !== void 0 ? l : 1003, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
const qa = /* @__PURE__ */ new we(), Ya = /* @__PURE__ */ new Xa(1, 1);
Ya.compareFunction = 515;
const Za = /* @__PURE__ */ new Fa(), Ja = /* @__PURE__ */ new To(), Ka = /* @__PURE__ */ new ka(), $s = [], Qs = [], ta = new Float32Array(16), ea = new Float32Array(9), na = new Float32Array(4);
function Yn(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const r = t * e;
  let s = $s[r];
  if (s === void 0 && (s = new Float32Array(r), $s[r] = s), t !== 0) {
    n.toArray(s, 0);
    for (let o = 1, a = 0; o !== t; ++o)
      a += e, i[o].toArray(s, a);
  }
  return s;
}
function fe(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++)
    if (i[e] !== t[e]) return !1;
  return !0;
}
function de(i, t) {
  for (let e = 0, n = t.length; e < n; e++)
    i[e] = t[e];
}
function sr(i, t) {
  let e = Qs[t];
  e === void 0 && (e = new Int32Array(t), Qs[t] = e);
  for (let n = 0; n !== t; ++n)
    e[n] = i.allocateTextureUnit();
  return e;
}
function Gh(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
}
function Hh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (fe(e, t)) return;
    i.uniform2fv(this.addr, t), de(e, t);
  }
}
function Vh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (i.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
  else {
    if (fe(e, t)) return;
    i.uniform3fv(this.addr, t), de(e, t);
  }
}
function kh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (fe(e, t)) return;
    i.uniform4fv(this.addr, t), de(e, t);
  }
}
function Wh(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (fe(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), de(e, t);
  } else {
    if (fe(e, n)) return;
    na.set(n), i.uniformMatrix2fv(this.addr, !1, na), de(e, n);
  }
}
function Xh(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (fe(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), de(e, t);
  } else {
    if (fe(e, n)) return;
    ea.set(n), i.uniformMatrix3fv(this.addr, !1, ea), de(e, n);
  }
}
function qh(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (fe(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), de(e, t);
  } else {
    if (fe(e, n)) return;
    ta.set(n), i.uniformMatrix4fv(this.addr, !1, ta), de(e, n);
  }
}
function Yh(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
}
function Zh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (fe(e, t)) return;
    i.uniform2iv(this.addr, t), de(e, t);
  }
}
function Jh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (fe(e, t)) return;
    i.uniform3iv(this.addr, t), de(e, t);
  }
}
function Kh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (fe(e, t)) return;
    i.uniform4iv(this.addr, t), de(e, t);
  }
}
function jh(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
}
function $h(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (fe(e, t)) return;
    i.uniform2uiv(this.addr, t), de(e, t);
  }
}
function Qh(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (fe(e, t)) return;
    i.uniform3uiv(this.addr, t), de(e, t);
  }
}
function tu(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (fe(e, t)) return;
    i.uniform4uiv(this.addr, t), de(e, t);
  }
}
function eu(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r);
  const s = this.type === i.SAMPLER_2D_SHADOW ? Ya : qa;
  e.setTexture2D(t || s, r);
}
function nu(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTexture3D(t || Ja, r);
}
function iu(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTextureCube(t || Ka, r);
}
function ru(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTexture2DArray(t || Za, r);
}
function su(i) {
  switch (i) {
    case 5126:
      return Gh;
    case 35664:
      return Hh;
    case 35665:
      return Vh;
    case 35666:
      return kh;
    case 35674:
      return Wh;
    case 35675:
      return Xh;
    case 35676:
      return qh;
    case 5124:
    case 35670:
      return Yh;
    case 35667:
    case 35671:
      return Zh;
    case 35668:
    case 35672:
      return Jh;
    case 35669:
    case 35673:
      return Kh;
    case 5125:
      return jh;
    case 36294:
      return $h;
    case 36295:
      return Qh;
    case 36296:
      return tu;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return eu;
    case 35679:
    case 36299:
    case 36307:
      return nu;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return iu;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return ru;
  }
}
function au(i, t) {
  i.uniform1fv(this.addr, t);
}
function ou(i, t) {
  const e = Yn(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function lu(i, t) {
  const e = Yn(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function cu(i, t) {
  const e = Yn(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function hu(i, t) {
  const e = Yn(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function uu(i, t) {
  const e = Yn(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function fu(i, t) {
  const e = Yn(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function du(i, t) {
  i.uniform1iv(this.addr, t);
}
function pu(i, t) {
  i.uniform2iv(this.addr, t);
}
function mu(i, t) {
  i.uniform3iv(this.addr, t);
}
function gu(i, t) {
  i.uniform4iv(this.addr, t);
}
function _u(i, t) {
  i.uniform1uiv(this.addr, t);
}
function vu(i, t) {
  i.uniform2uiv(this.addr, t);
}
function xu(i, t) {
  i.uniform3uiv(this.addr, t);
}
function Mu(i, t) {
  i.uniform4uiv(this.addr, t);
}
function Su(i, t, e) {
  const n = this.cache, r = t.length, s = sr(e, r);
  fe(n, s) || (i.uniform1iv(this.addr, s), de(n, s));
  for (let o = 0; o !== r; ++o)
    e.setTexture2D(t[o] || qa, s[o]);
}
function yu(i, t, e) {
  const n = this.cache, r = t.length, s = sr(e, r);
  fe(n, s) || (i.uniform1iv(this.addr, s), de(n, s));
  for (let o = 0; o !== r; ++o)
    e.setTexture3D(t[o] || Ja, s[o]);
}
function Eu(i, t, e) {
  const n = this.cache, r = t.length, s = sr(e, r);
  fe(n, s) || (i.uniform1iv(this.addr, s), de(n, s));
  for (let o = 0; o !== r; ++o)
    e.setTextureCube(t[o] || Ka, s[o]);
}
function Tu(i, t, e) {
  const n = this.cache, r = t.length, s = sr(e, r);
  fe(n, s) || (i.uniform1iv(this.addr, s), de(n, s));
  for (let o = 0; o !== r; ++o)
    e.setTexture2DArray(t[o] || Za, s[o]);
}
function bu(i) {
  switch (i) {
    case 5126:
      return au;
    case 35664:
      return ou;
    case 35665:
      return lu;
    case 35666:
      return cu;
    case 35674:
      return hu;
    case 35675:
      return uu;
    case 35676:
      return fu;
    case 5124:
    case 35670:
      return du;
    case 35667:
    case 35671:
      return pu;
    case 35668:
    case 35672:
      return mu;
    case 35669:
    case 35673:
      return gu;
    case 5125:
      return _u;
    case 36294:
      return vu;
    case 36295:
      return xu;
    case 36296:
      return Mu;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Su;
    case 35679:
    case 36299:
    case 36307:
      return yu;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Eu;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Tu;
  }
}
class Au {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = su(e.type);
  }
}
class wu {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = bu(e.type);
  }
}
class Ru {
  constructor(t) {
    this.id = t, this.seq = [], this.map = {};
  }
  setValue(t, e, n) {
    const r = this.seq;
    for (let s = 0, o = r.length; s !== o; ++s) {
      const a = r[s];
      a.setValue(t, e[a.id], n);
    }
  }
}
const Or = /(\w+)(\])?(\[|\.)?/g;
function ia(i, t) {
  i.seq.push(t), i.map[t.id] = t;
}
function Cu(i, t, e) {
  const n = i.name, r = n.length;
  for (Or.lastIndex = 0; ; ) {
    const s = Or.exec(n), o = Or.lastIndex;
    let a = s[1];
    const l = s[2] === "]", c = s[3];
    if (l && (a = a | 0), c === void 0 || c === "[" && o + 2 === r) {
      ia(e, c === void 0 ? new Au(a, i, t) : new wu(a, i, t));
      break;
    } else {
      let f = e.map[a];
      f === void 0 && (f = new Ru(a), ia(e, f)), e = f;
    }
  }
}
class ji {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let r = 0; r < n; ++r) {
      const s = t.getActiveUniform(e, r), o = t.getUniformLocation(e, s.name);
      Cu(s, o, this);
    }
  }
  setValue(t, e, n, r) {
    const s = this.map[e];
    s !== void 0 && s.setValue(t, n, r);
  }
  setOptional(t, e, n) {
    const r = e[n];
    r !== void 0 && this.setValue(t, n, r);
  }
  static upload(t, e, n, r) {
    for (let s = 0, o = e.length; s !== o; ++s) {
      const a = e[s], l = n[a.id];
      l.needsUpdate !== !1 && a.setValue(t, l.value, r);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let r = 0, s = t.length; r !== s; ++r) {
      const o = t[r];
      o.id in e && n.push(o);
    }
    return n;
  }
}
function ra(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const Pu = 37297;
let Lu = 0;
function Du(i, t) {
  const e = i.split(`
`), n = [], r = Math.max(t - 6, 0), s = Math.min(t + 6, e.length);
  for (let o = r; o < s; o++) {
    const a = o + 1;
    n.push(`${a === t ? ">" : " "} ${a}: ${e[o]}`);
  }
  return n.join(`
`);
}
function Uu(i) {
  const t = qt.getPrimaries(qt.workingColorSpace), e = qt.getPrimaries(i);
  let n;
  switch (t === e ? n = "" : t === tr && e === Qi ? n = "LinearDisplayP3ToLinearSRGB" : t === Qi && e === tr && (n = "LinearSRGBToLinearDisplayP3"), i) {
    case $e:
    case nr:
      return [n, "LinearTransferOETF"];
    case _e:
    case os:
      return [n, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space:", i), [n, "LinearTransferOETF"];
  }
}
function sa(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS), r = i.getShaderInfoLog(t).trim();
  if (n && r === "") return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const o = parseInt(s[1]);
    return e.toUpperCase() + `

` + r + `

` + Du(i.getShaderSource(t), o);
  } else
    return r;
}
function Iu(i, t) {
  const e = Uu(t);
  return `vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`;
}
function Nu(i, t) {
  let e;
  switch (t) {
    case 1:
      e = "Linear";
      break;
    case 2:
      e = "Reinhard";
      break;
    case 3:
      e = "OptimizedCineon";
      break;
    case 4:
      e = "ACESFilmic";
      break;
    case 6:
      e = "AgX";
      break;
    case 5:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
function Fu(i) {
  return [
    i.extensionDerivatives || i.envMapCubeUVHeight || i.bumpMap || i.normalMapTangentSpace || i.clearcoatNormalMap || i.flatShading || i.shaderID === "physical" ? "#extension GL_OES_standard_derivatives : enable" : "",
    (i.extensionFragDepth || i.logarithmicDepthBuffer) && i.rendererExtensionFragDepth ? "#extension GL_EXT_frag_depth : enable" : "",
    i.extensionDrawBuffers && i.rendererExtensionDrawBuffers ? "#extension GL_EXT_draw_buffers : require" : "",
    (i.extensionShaderTextureLOD || i.envMap || i.transmission) && i.rendererExtensionShaderTextureLod ? "#extension GL_EXT_shader_texture_lod : enable" : ""
  ].filter(Hn).join(`
`);
}
function Ou(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : ""
  ].filter(Hn).join(`
`);
}
function Bu(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function zu(i, t) {
  const e = {}, n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < n; r++) {
    const s = i.getActiveAttrib(t, r), o = s.name;
    let a = 1;
    s.type === i.FLOAT_MAT2 && (a = 2), s.type === i.FLOAT_MAT3 && (a = 3), s.type === i.FLOAT_MAT4 && (a = 4), e[o] = {
      type: s.type,
      location: i.getAttribLocation(t, o),
      locationSize: a
    };
  }
  return e;
}
function Hn(i) {
  return i !== "";
}
function aa(i, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function oa(i, t) {
  return i.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const Gu = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Kr(i) {
  return i.replace(Gu, Vu);
}
const Hu = /* @__PURE__ */ new Map([
  ["encodings_fragment", "colorspace_fragment"],
  // @deprecated, r154
  ["encodings_pars_fragment", "colorspace_pars_fragment"],
  // @deprecated, r154
  ["output_fragment", "opaque_fragment"]
  // @deprecated, r154
]);
function Vu(i, t) {
  let e = Ot[t];
  if (e === void 0) {
    const n = Hu.get(t);
    if (n !== void 0)
      e = Ot[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else
      throw new Error("Can not resolve #include <" + t + ">");
  }
  return Kr(e);
}
const ku = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function la(i) {
  return i.replace(ku, Wu);
}
function Wu(i, t, e, n) {
  let r = "";
  for (let s = parseInt(t); s < parseInt(e); s++)
    r += n.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function ca(i) {
  let t = "precision " + i.precision + ` float;
precision ` + i.precision + " int;";
  return i.precision === "highp" ? t += `
#define HIGH_PRECISION` : i.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
function Xu(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === 1 ? t = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === 2 ? t = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === 3 && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function qu(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case 301:
      case 302:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case 306:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function Yu(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case 302:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function Zu(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case 0:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case 1:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case 2:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function Ju(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 7 * 16)), texelHeight: n, maxMip: e };
}
function Ku(i, t, e, n) {
  const r = i.getContext(), s = e.defines;
  let o = e.vertexShader, a = e.fragmentShader;
  const l = Xu(e), c = qu(e), h = Yu(e), f = Zu(e), p = Ju(e), m = e.isWebGL2 ? "" : Fu(e), g = Ou(e), _ = Bu(s), d = r.createProgram();
  let u, T, v = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (u = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _
  ].filter(Hn).join(`
`), u.length > 0 && (u += `
`), T = [
    m,
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _
  ].filter(Hn).join(`
`), T.length > 0 && (T += `
`)) : (u = [
    ca(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _,
    e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    e.batching ? "#define USE_BATCHING" : "",
    e.instancing ? "#define USE_INSTANCING" : "",
    e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + h : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    e.mapUv ? "#define MAP_UV " + e.mapUv : "",
    e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
    e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
    e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
    e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
    e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
    e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
    e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "",
    e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
    e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
    e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "",
    e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
    e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "",
    e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "",
    e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "",
    e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "",
    e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "",
    e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "",
    e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
    e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "",
    e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "",
    e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "",
    e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
    //
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.skinning ? "#define USE_SKINNING" : "",
    e.morphTargets ? "#define USE_MORPHTARGETS" : "",
    e.morphNormals && e.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    e.morphColors && e.isWebGL2 ? "#define USE_MORPHCOLORS" : "",
    e.morphTargetsCount > 0 && e.isWebGL2 ? "#define MORPHTARGETS_TEXTURE" : "",
    e.morphTargetsCount > 0 && e.isWebGL2 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "",
    e.morphTargetsCount > 0 && e.isWebGL2 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.logarithmicDepthBuffer && e.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )",
    "	attribute vec3 morphTarget0;",
    "	attribute vec3 morphTarget1;",
    "	attribute vec3 morphTarget2;",
    "	attribute vec3 morphTarget3;",
    "	#ifdef USE_MORPHNORMALS",
    "		attribute vec3 morphNormal0;",
    "		attribute vec3 morphNormal1;",
    "		attribute vec3 morphNormal2;",
    "		attribute vec3 morphNormal3;",
    "	#else",
    "		attribute vec3 morphTarget4;",
    "		attribute vec3 morphTarget5;",
    "		attribute vec3 morphTarget6;",
    "		attribute vec3 morphTarget7;",
    "	#endif",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Hn).join(`
`), T = [
    m,
    ca(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _,
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.matcap ? "#define USE_MATCAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + c : "",
    e.envMap ? "#define " + h : "",
    e.envMap ? "#define " + f : "",
    p ? "#define CUBEUV_TEXEL_WIDTH " + p.texelWidth : "",
    p ? "#define CUBEUV_TEXEL_HEIGHT " + p.texelHeight : "",
    p ? "#define CUBEUV_MAX_MIP " + p.maxMip + ".0" : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoat ? "#define USE_CLEARCOAT" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescence ? "#define USE_IRIDESCENCE" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaTest ? "#define USE_ALPHATEST" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.sheen ? "#define USE_SHEEN" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors || e.instancingColor ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.gradientMap ? "#define USE_GRADIENTMAP" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
    e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.logarithmicDepthBuffer && e.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    e.toneMapping !== 0 ? "#define TONE_MAPPING" : "",
    e.toneMapping !== 0 ? Ot.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    e.toneMapping !== 0 ? Nu("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    Ot.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    Iu("linearToOutputTexel", e.outputColorSpace),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`
  ].filter(Hn).join(`
`)), o = Kr(o), o = aa(o, e), o = oa(o, e), a = Kr(a), a = aa(a, e), a = oa(a, e), o = la(o), a = la(a), e.isWebGL2 && e.isRawShaderMaterial !== !0 && (v = `#version 300 es
`, u = [
    g,
    "precision mediump sampler2DArray;",
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + u, T = [
    "precision mediump sampler2DArray;",
    "#define varying in",
    e.glslVersion === ws ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === ws ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + T);
  const b = v + u + o, R = v + T + a, A = ra(r, r.VERTEX_SHADER, b), w = ra(r, r.FRAGMENT_SHADER, R);
  r.attachShader(d, A), r.attachShader(d, w), e.index0AttributeName !== void 0 ? r.bindAttribLocation(d, 0, e.index0AttributeName) : e.morphTargets === !0 && r.bindAttribLocation(d, 0, "position"), r.linkProgram(d);
  function O(N) {
    if (i.debug.checkShaderErrors) {
      const Y = r.getProgramInfoLog(d).trim(), P = r.getShaderInfoLog(A).trim(), B = r.getShaderInfoLog(w).trim();
      let H = !0, J = !0;
      if (r.getProgramParameter(d, r.LINK_STATUS) === !1)
        if (H = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(r, d, A, w);
        else {
          const X = sa(r, A, "vertex"), W = sa(r, w, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(d, r.VALIDATE_STATUS) + `

Program Info Log: ` + Y + `
` + X + `
` + W
          );
        }
      else Y !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", Y) : (P === "" || B === "") && (J = !1);
      J && (N.diagnostics = {
        runnable: H,
        programLog: Y,
        vertexShader: {
          log: P,
          prefix: u
        },
        fragmentShader: {
          log: B,
          prefix: T
        }
      });
    }
    r.deleteShader(A), r.deleteShader(w), M = new ji(r, d), S = zu(r, d);
  }
  let M;
  this.getUniforms = function() {
    return M === void 0 && O(this), M;
  };
  let S;
  this.getAttributes = function() {
    return S === void 0 && O(this), S;
  };
  let U = e.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return U === !1 && (U = r.getProgramParameter(d, Pu)), U;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), r.deleteProgram(d), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = Lu++, this.cacheKey = t, this.usedTimes = 1, this.program = d, this.vertexShader = A, this.fragmentShader = w, this;
}
let ju = 0;
class $u {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(t) {
    const e = t.vertexShader, n = t.fragmentShader, r = this._getShaderStage(e), s = this._getShaderStage(n), o = this._getShaderCacheForMaterial(t);
    return o.has(r) === !1 && (o.add(r), r.usedTimes++), o.has(s) === !1 && (o.add(s), s.usedTimes++), this;
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && (n = new Qu(t), e.set(t, n)), n;
  }
}
class Qu {
  constructor(t) {
    this.id = ju++, this.code = t, this.usedTimes = 0;
  }
}
function tf(i, t, e, n, r, s, o) {
  const a = new ls(), l = new $u(), c = [], h = r.isWebGL2, f = r.logarithmicDepthBuffer, p = r.vertexTextures;
  let m = r.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function _(M) {
    return M === 0 ? "uv" : `uv${M}`;
  }
  function d(M, S, U, N, Y) {
    const P = N.fog, B = Y.geometry, H = M.isMeshStandardMaterial ? N.environment : null, J = (M.isMeshStandardMaterial ? e : t).get(M.envMap || H), X = J && J.mapping === 306 ? J.image.height : null, W = g[M.type];
    M.precision !== null && (m = r.getMaxPrecision(M.precision), m !== M.precision && console.warn("THREE.WebGLProgram.getParameters:", M.precision, "not supported, using", m, "instead."));
    const tt = B.morphAttributes.position || B.morphAttributes.normal || B.morphAttributes.color, et = tt !== void 0 ? tt.length : 0;
    let ut = 0;
    B.morphAttributes.position !== void 0 && (ut = 1), B.morphAttributes.normal !== void 0 && (ut = 2), B.morphAttributes.color !== void 0 && (ut = 3);
    let k, j, ft, xt;
    if (W) {
      const Ee = He[W];
      k = Ee.vertexShader, j = Ee.fragmentShader;
    } else
      k = M.vertexShader, j = M.fragmentShader, l.update(M), ft = l.getVertexShaderID(M), xt = l.getFragmentShaderID(M);
    const mt = i.getRenderTarget(), wt = Y.isInstancedMesh === !0, Dt = Y.isBatchedMesh === !0, Mt = !!M.map, Pt = !!M.matcap, C = !!J, st = !!M.aoMap, Z = !!M.lightMap, it = !!M.bumpMap, q = !!M.normalMap, yt = !!M.displacementMap, dt = !!M.emissiveMap, y = !!M.metalnessMap, x = !!M.roughnessMap, F = M.anisotropy > 0, nt = M.clearcoat > 0, $ = M.iridescence > 0, K = M.sheen > 0, vt = M.transmission > 0, lt = F && !!M.anisotropyMap, gt = nt && !!M.clearcoatMap, Tt = nt && !!M.clearcoatNormalMap, It = nt && !!M.clearcoatRoughnessMap, Q = $ && !!M.iridescenceMap, Wt = $ && !!M.iridescenceThicknessMap, kt = K && !!M.sheenColorMap, Lt = K && !!M.sheenRoughnessMap, Et = !!M.specularMap, _t = !!M.specularColorMap, Ft = !!M.specularIntensityMap, Xt = vt && !!M.transmissionMap, re = vt && !!M.thicknessMap, Gt = !!M.gradientMap, at = !!M.alphaMap, D = M.alphaTest > 0, ct = !!M.alphaHash, ht = !!M.extensions, Rt = !!B.attributes.uv1, bt = !!B.attributes.uv2, Zt = !!B.attributes.uv3;
    let Jt = 0;
    return M.toneMapped && (mt === null || mt.isXRRenderTarget === !0) && (Jt = i.toneMapping), {
      isWebGL2: h,
      shaderID: W,
      shaderType: M.type,
      shaderName: M.name,
      vertexShader: k,
      fragmentShader: j,
      defines: M.defines,
      customVertexShaderID: ft,
      customFragmentShaderID: xt,
      isRawShaderMaterial: M.isRawShaderMaterial === !0,
      glslVersion: M.glslVersion,
      precision: m,
      batching: Dt,
      instancing: wt,
      instancingColor: wt && Y.instanceColor !== null,
      supportsVertexTextures: p,
      outputColorSpace: mt === null ? i.outputColorSpace : mt.isXRRenderTarget === !0 ? mt.texture.colorSpace : $e,
      map: Mt,
      matcap: Pt,
      envMap: C,
      envMapMode: C && J.mapping,
      envMapCubeUVHeight: X,
      aoMap: st,
      lightMap: Z,
      bumpMap: it,
      normalMap: q,
      displacementMap: p && yt,
      emissiveMap: dt,
      normalMapObjectSpace: q && M.normalMapType === 1,
      normalMapTangentSpace: q && M.normalMapType === 0,
      metalnessMap: y,
      roughnessMap: x,
      anisotropy: F,
      anisotropyMap: lt,
      clearcoat: nt,
      clearcoatMap: gt,
      clearcoatNormalMap: Tt,
      clearcoatRoughnessMap: It,
      iridescence: $,
      iridescenceMap: Q,
      iridescenceThicknessMap: Wt,
      sheen: K,
      sheenColorMap: kt,
      sheenRoughnessMap: Lt,
      specularMap: Et,
      specularColorMap: _t,
      specularIntensityMap: Ft,
      transmission: vt,
      transmissionMap: Xt,
      thicknessMap: re,
      gradientMap: Gt,
      opaque: M.transparent === !1 && M.blending === 1,
      alphaMap: at,
      alphaTest: D,
      alphaHash: ct,
      combine: M.combine,
      //
      mapUv: Mt && _(M.map.channel),
      aoMapUv: st && _(M.aoMap.channel),
      lightMapUv: Z && _(M.lightMap.channel),
      bumpMapUv: it && _(M.bumpMap.channel),
      normalMapUv: q && _(M.normalMap.channel),
      displacementMapUv: yt && _(M.displacementMap.channel),
      emissiveMapUv: dt && _(M.emissiveMap.channel),
      metalnessMapUv: y && _(M.metalnessMap.channel),
      roughnessMapUv: x && _(M.roughnessMap.channel),
      anisotropyMapUv: lt && _(M.anisotropyMap.channel),
      clearcoatMapUv: gt && _(M.clearcoatMap.channel),
      clearcoatNormalMapUv: Tt && _(M.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: It && _(M.clearcoatRoughnessMap.channel),
      iridescenceMapUv: Q && _(M.iridescenceMap.channel),
      iridescenceThicknessMapUv: Wt && _(M.iridescenceThicknessMap.channel),
      sheenColorMapUv: kt && _(M.sheenColorMap.channel),
      sheenRoughnessMapUv: Lt && _(M.sheenRoughnessMap.channel),
      specularMapUv: Et && _(M.specularMap.channel),
      specularColorMapUv: _t && _(M.specularColorMap.channel),
      specularIntensityMapUv: Ft && _(M.specularIntensityMap.channel),
      transmissionMapUv: Xt && _(M.transmissionMap.channel),
      thicknessMapUv: re && _(M.thicknessMap.channel),
      alphaMapUv: at && _(M.alphaMap.channel),
      //
      vertexTangents: !!B.attributes.tangent && (q || F),
      vertexColors: M.vertexColors,
      vertexAlphas: M.vertexColors === !0 && !!B.attributes.color && B.attributes.color.itemSize === 4,
      vertexUv1s: Rt,
      vertexUv2s: bt,
      vertexUv3s: Zt,
      pointsUvs: Y.isPoints === !0 && !!B.attributes.uv && (Mt || at),
      fog: !!P,
      useFog: M.fog === !0,
      fogExp2: P && P.isFogExp2,
      flatShading: M.flatShading === !0,
      sizeAttenuation: M.sizeAttenuation === !0,
      logarithmicDepthBuffer: f,
      skinning: Y.isSkinnedMesh === !0,
      morphTargets: B.morphAttributes.position !== void 0,
      morphNormals: B.morphAttributes.normal !== void 0,
      morphColors: B.morphAttributes.color !== void 0,
      morphTargetsCount: et,
      morphTextureStride: ut,
      numDirLights: S.directional.length,
      numPointLights: S.point.length,
      numSpotLights: S.spot.length,
      numSpotLightMaps: S.spotLightMap.length,
      numRectAreaLights: S.rectArea.length,
      numHemiLights: S.hemi.length,
      numDirLightShadows: S.directionalShadowMap.length,
      numPointLightShadows: S.pointShadowMap.length,
      numSpotLightShadows: S.spotShadowMap.length,
      numSpotLightShadowsWithMaps: S.numSpotLightShadowsWithMaps,
      numLightProbes: S.numLightProbes,
      numClippingPlanes: o.numPlanes,
      numClipIntersection: o.numIntersection,
      dithering: M.dithering,
      shadowMapEnabled: i.shadowMap.enabled && U.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: Jt,
      useLegacyLights: i._useLegacyLights,
      decodeVideoTexture: Mt && M.map.isVideoTexture === !0 && qt.getTransfer(M.map.colorSpace) === $t,
      premultipliedAlpha: M.premultipliedAlpha,
      doubleSided: M.side === 2,
      flipSided: M.side === 1,
      useDepthPacking: M.depthPacking >= 0,
      depthPacking: M.depthPacking || 0,
      index0AttributeName: M.index0AttributeName,
      extensionDerivatives: ht && M.extensions.derivatives === !0,
      extensionFragDepth: ht && M.extensions.fragDepth === !0,
      extensionDrawBuffers: ht && M.extensions.drawBuffers === !0,
      extensionShaderTextureLOD: ht && M.extensions.shaderTextureLOD === !0,
      extensionClipCullDistance: ht && M.extensions.clipCullDistance && n.has("WEBGL_clip_cull_distance"),
      rendererExtensionFragDepth: h || n.has("EXT_frag_depth"),
      rendererExtensionDrawBuffers: h || n.has("WEBGL_draw_buffers"),
      rendererExtensionShaderTextureLod: h || n.has("EXT_shader_texture_lod"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: M.customProgramCacheKey()
    };
  }
  function u(M) {
    const S = [];
    if (M.shaderID ? S.push(M.shaderID) : (S.push(M.customVertexShaderID), S.push(M.customFragmentShaderID)), M.defines !== void 0)
      for (const U in M.defines)
        S.push(U), S.push(M.defines[U]);
    return M.isRawShaderMaterial === !1 && (T(S, M), v(S, M), S.push(i.outputColorSpace)), S.push(M.customProgramCacheKey), S.join();
  }
  function T(M, S) {
    M.push(S.precision), M.push(S.outputColorSpace), M.push(S.envMapMode), M.push(S.envMapCubeUVHeight), M.push(S.mapUv), M.push(S.alphaMapUv), M.push(S.lightMapUv), M.push(S.aoMapUv), M.push(S.bumpMapUv), M.push(S.normalMapUv), M.push(S.displacementMapUv), M.push(S.emissiveMapUv), M.push(S.metalnessMapUv), M.push(S.roughnessMapUv), M.push(S.anisotropyMapUv), M.push(S.clearcoatMapUv), M.push(S.clearcoatNormalMapUv), M.push(S.clearcoatRoughnessMapUv), M.push(S.iridescenceMapUv), M.push(S.iridescenceThicknessMapUv), M.push(S.sheenColorMapUv), M.push(S.sheenRoughnessMapUv), M.push(S.specularMapUv), M.push(S.specularColorMapUv), M.push(S.specularIntensityMapUv), M.push(S.transmissionMapUv), M.push(S.thicknessMapUv), M.push(S.combine), M.push(S.fogExp2), M.push(S.sizeAttenuation), M.push(S.morphTargetsCount), M.push(S.morphAttributeCount), M.push(S.numDirLights), M.push(S.numPointLights), M.push(S.numSpotLights), M.push(S.numSpotLightMaps), M.push(S.numHemiLights), M.push(S.numRectAreaLights), M.push(S.numDirLightShadows), M.push(S.numPointLightShadows), M.push(S.numSpotLightShadows), M.push(S.numSpotLightShadowsWithMaps), M.push(S.numLightProbes), M.push(S.shadowMapType), M.push(S.toneMapping), M.push(S.numClippingPlanes), M.push(S.numClipIntersection), M.push(S.depthPacking);
  }
  function v(M, S) {
    a.disableAll(), S.isWebGL2 && a.enable(0), S.supportsVertexTextures && a.enable(1), S.instancing && a.enable(2), S.instancingColor && a.enable(3), S.matcap && a.enable(4), S.envMap && a.enable(5), S.normalMapObjectSpace && a.enable(6), S.normalMapTangentSpace && a.enable(7), S.clearcoat && a.enable(8), S.iridescence && a.enable(9), S.alphaTest && a.enable(10), S.vertexColors && a.enable(11), S.vertexAlphas && a.enable(12), S.vertexUv1s && a.enable(13), S.vertexUv2s && a.enable(14), S.vertexUv3s && a.enable(15), S.vertexTangents && a.enable(16), S.anisotropy && a.enable(17), S.alphaHash && a.enable(18), S.batching && a.enable(19), M.push(a.mask), a.disableAll(), S.fog && a.enable(0), S.useFog && a.enable(1), S.flatShading && a.enable(2), S.logarithmicDepthBuffer && a.enable(3), S.skinning && a.enable(4), S.morphTargets && a.enable(5), S.morphNormals && a.enable(6), S.morphColors && a.enable(7), S.premultipliedAlpha && a.enable(8), S.shadowMapEnabled && a.enable(9), S.useLegacyLights && a.enable(10), S.doubleSided && a.enable(11), S.flipSided && a.enable(12), S.useDepthPacking && a.enable(13), S.dithering && a.enable(14), S.transmission && a.enable(15), S.sheen && a.enable(16), S.opaque && a.enable(17), S.pointsUvs && a.enable(18), S.decodeVideoTexture && a.enable(19), M.push(a.mask);
  }
  function b(M) {
    const S = g[M.type];
    let U;
    if (S) {
      const N = He[S];
      U = Ha.clone(N.uniforms);
    } else
      U = M.uniforms;
    return U;
  }
  function R(M, S) {
    let U;
    for (let N = 0, Y = c.length; N < Y; N++) {
      const P = c[N];
      if (P.cacheKey === S) {
        U = P, ++U.usedTimes;
        break;
      }
    }
    return U === void 0 && (U = new Ku(i, S, M, s), c.push(U)), U;
  }
  function A(M) {
    if (--M.usedTimes === 0) {
      const S = c.indexOf(M);
      c[S] = c[c.length - 1], c.pop(), M.destroy();
    }
  }
  function w(M) {
    l.remove(M);
  }
  function O() {
    l.dispose();
  }
  return {
    getParameters: d,
    getProgramCacheKey: u,
    getUniforms: b,
    acquireProgram: R,
    releaseProgram: A,
    releaseShaderCache: w,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: c,
    dispose: O
  };
}
function ef() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(s) {
    let o = i.get(s);
    return o === void 0 && (o = {}, i.set(s, o)), o;
  }
  function e(s) {
    i.delete(s);
  }
  function n(s, o, a) {
    i.get(s)[o] = a;
  }
  function r() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    remove: e,
    update: n,
    dispose: r
  };
}
function nf(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.material.id !== t.material.id ? i.material.id - t.material.id : i.z !== t.z ? i.z - t.z : i.id - t.id;
}
function ha(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.z !== t.z ? t.z - i.z : i.id - t.id;
}
function ua() {
  const i = [];
  let t = 0;
  const e = [], n = [], r = [];
  function s() {
    t = 0, e.length = 0, n.length = 0, r.length = 0;
  }
  function o(f, p, m, g, _, d) {
    let u = i[t];
    return u === void 0 ? (u = {
      id: f.id,
      object: f,
      geometry: p,
      material: m,
      groupOrder: g,
      renderOrder: f.renderOrder,
      z: _,
      group: d
    }, i[t] = u) : (u.id = f.id, u.object = f, u.geometry = p, u.material = m, u.groupOrder = g, u.renderOrder = f.renderOrder, u.z = _, u.group = d), t++, u;
  }
  function a(f, p, m, g, _, d) {
    const u = o(f, p, m, g, _, d);
    m.transmission > 0 ? n.push(u) : m.transparent === !0 ? r.push(u) : e.push(u);
  }
  function l(f, p, m, g, _, d) {
    const u = o(f, p, m, g, _, d);
    m.transmission > 0 ? n.unshift(u) : m.transparent === !0 ? r.unshift(u) : e.unshift(u);
  }
  function c(f, p) {
    e.length > 1 && e.sort(f || nf), n.length > 1 && n.sort(p || ha), r.length > 1 && r.sort(p || ha);
  }
  function h() {
    for (let f = t, p = i.length; f < p; f++) {
      const m = i[f];
      if (m.id === null) break;
      m.id = null, m.object = null, m.geometry = null, m.material = null, m.group = null;
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: r,
    init: s,
    push: a,
    unshift: l,
    finish: h,
    sort: c
  };
}
function rf() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(n, r) {
    const s = i.get(n);
    let o;
    return s === void 0 ? (o = new ua(), i.set(n, [o])) : r >= s.length ? (o = new ua(), s.push(o)) : o = s[r], o;
  }
  function e() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: e
  };
}
function sf() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            direction: new L(),
            color: new Bt()
          };
          break;
        case "SpotLight":
          e = {
            position: new L(),
            direction: new L(),
            color: new Bt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          e = {
            position: new L(),
            color: new Bt(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          e = {
            direction: new L(),
            skyColor: new Bt(),
            groundColor: new Bt()
          };
          break;
        case "RectAreaLight":
          e = {
            color: new Bt(),
            position: new L(),
            halfWidth: new L(),
            halfHeight: new L()
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
function af() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new rt()
          };
          break;
        case "SpotLight":
          e = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new rt()
          };
          break;
        case "PointLight":
          e = {
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new rt(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
let of = 0;
function lf(i, t) {
  return (t.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (i.map ? 1 : 0);
}
function cf(i, t) {
  const e = new sf(), n = af(), r = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let h = 0; h < 9; h++) r.probe.push(new L());
  const s = new L(), o = new te(), a = new te();
  function l(h, f) {
    let p = 0, m = 0, g = 0;
    for (let N = 0; N < 9; N++) r.probe[N].set(0, 0, 0);
    let _ = 0, d = 0, u = 0, T = 0, v = 0, b = 0, R = 0, A = 0, w = 0, O = 0, M = 0;
    h.sort(lf);
    const S = f === !0 ? Math.PI : 1;
    for (let N = 0, Y = h.length; N < Y; N++) {
      const P = h[N], B = P.color, H = P.intensity, J = P.distance, X = P.shadow && P.shadow.map ? P.shadow.map.texture : null;
      if (P.isAmbientLight)
        p += B.r * H * S, m += B.g * H * S, g += B.b * H * S;
      else if (P.isLightProbe) {
        for (let W = 0; W < 9; W++)
          r.probe[W].addScaledVector(P.sh.coefficients[W], H);
        M++;
      } else if (P.isDirectionalLight) {
        const W = e.get(P);
        if (W.color.copy(P.color).multiplyScalar(P.intensity * S), P.castShadow) {
          const tt = P.shadow, et = n.get(P);
          et.shadowBias = tt.bias, et.shadowNormalBias = tt.normalBias, et.shadowRadius = tt.radius, et.shadowMapSize = tt.mapSize, r.directionalShadow[_] = et, r.directionalShadowMap[_] = X, r.directionalShadowMatrix[_] = P.shadow.matrix, b++;
        }
        r.directional[_] = W, _++;
      } else if (P.isSpotLight) {
        const W = e.get(P);
        W.position.setFromMatrixPosition(P.matrixWorld), W.color.copy(B).multiplyScalar(H * S), W.distance = J, W.coneCos = Math.cos(P.angle), W.penumbraCos = Math.cos(P.angle * (1 - P.penumbra)), W.decay = P.decay, r.spot[u] = W;
        const tt = P.shadow;
        if (P.map && (r.spotLightMap[w] = P.map, w++, tt.updateMatrices(P), P.castShadow && O++), r.spotLightMatrix[u] = tt.matrix, P.castShadow) {
          const et = n.get(P);
          et.shadowBias = tt.bias, et.shadowNormalBias = tt.normalBias, et.shadowRadius = tt.radius, et.shadowMapSize = tt.mapSize, r.spotShadow[u] = et, r.spotShadowMap[u] = X, A++;
        }
        u++;
      } else if (P.isRectAreaLight) {
        const W = e.get(P);
        W.color.copy(B).multiplyScalar(H), W.halfWidth.set(P.width * 0.5, 0, 0), W.halfHeight.set(0, P.height * 0.5, 0), r.rectArea[T] = W, T++;
      } else if (P.isPointLight) {
        const W = e.get(P);
        if (W.color.copy(P.color).multiplyScalar(P.intensity * S), W.distance = P.distance, W.decay = P.decay, P.castShadow) {
          const tt = P.shadow, et = n.get(P);
          et.shadowBias = tt.bias, et.shadowNormalBias = tt.normalBias, et.shadowRadius = tt.radius, et.shadowMapSize = tt.mapSize, et.shadowCameraNear = tt.camera.near, et.shadowCameraFar = tt.camera.far, r.pointShadow[d] = et, r.pointShadowMap[d] = X, r.pointShadowMatrix[d] = P.shadow.matrix, R++;
        }
        r.point[d] = W, d++;
      } else if (P.isHemisphereLight) {
        const W = e.get(P);
        W.skyColor.copy(P.color).multiplyScalar(H * S), W.groundColor.copy(P.groundColor).multiplyScalar(H * S), r.hemi[v] = W, v++;
      }
    }
    T > 0 && (t.isWebGL2 ? i.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = ot.LTC_FLOAT_1, r.rectAreaLTC2 = ot.LTC_FLOAT_2) : (r.rectAreaLTC1 = ot.LTC_HALF_1, r.rectAreaLTC2 = ot.LTC_HALF_2) : i.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = ot.LTC_FLOAT_1, r.rectAreaLTC2 = ot.LTC_FLOAT_2) : i.has("OES_texture_half_float_linear") === !0 ? (r.rectAreaLTC1 = ot.LTC_HALF_1, r.rectAreaLTC2 = ot.LTC_HALF_2) : console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")), r.ambient[0] = p, r.ambient[1] = m, r.ambient[2] = g;
    const U = r.hash;
    (U.directionalLength !== _ || U.pointLength !== d || U.spotLength !== u || U.rectAreaLength !== T || U.hemiLength !== v || U.numDirectionalShadows !== b || U.numPointShadows !== R || U.numSpotShadows !== A || U.numSpotMaps !== w || U.numLightProbes !== M) && (r.directional.length = _, r.spot.length = u, r.rectArea.length = T, r.point.length = d, r.hemi.length = v, r.directionalShadow.length = b, r.directionalShadowMap.length = b, r.pointShadow.length = R, r.pointShadowMap.length = R, r.spotShadow.length = A, r.spotShadowMap.length = A, r.directionalShadowMatrix.length = b, r.pointShadowMatrix.length = R, r.spotLightMatrix.length = A + w - O, r.spotLightMap.length = w, r.numSpotLightShadowsWithMaps = O, r.numLightProbes = M, U.directionalLength = _, U.pointLength = d, U.spotLength = u, U.rectAreaLength = T, U.hemiLength = v, U.numDirectionalShadows = b, U.numPointShadows = R, U.numSpotShadows = A, U.numSpotMaps = w, U.numLightProbes = M, r.version = of++);
  }
  function c(h, f) {
    let p = 0, m = 0, g = 0, _ = 0, d = 0;
    const u = f.matrixWorldInverse;
    for (let T = 0, v = h.length; T < v; T++) {
      const b = h[T];
      if (b.isDirectionalLight) {
        const R = r.directional[p];
        R.direction.setFromMatrixPosition(b.matrixWorld), s.setFromMatrixPosition(b.target.matrixWorld), R.direction.sub(s), R.direction.transformDirection(u), p++;
      } else if (b.isSpotLight) {
        const R = r.spot[g];
        R.position.setFromMatrixPosition(b.matrixWorld), R.position.applyMatrix4(u), R.direction.setFromMatrixPosition(b.matrixWorld), s.setFromMatrixPosition(b.target.matrixWorld), R.direction.sub(s), R.direction.transformDirection(u), g++;
      } else if (b.isRectAreaLight) {
        const R = r.rectArea[_];
        R.position.setFromMatrixPosition(b.matrixWorld), R.position.applyMatrix4(u), a.identity(), o.copy(b.matrixWorld), o.premultiply(u), a.extractRotation(o), R.halfWidth.set(b.width * 0.5, 0, 0), R.halfHeight.set(0, b.height * 0.5, 0), R.halfWidth.applyMatrix4(a), R.halfHeight.applyMatrix4(a), _++;
      } else if (b.isPointLight) {
        const R = r.point[m];
        R.position.setFromMatrixPosition(b.matrixWorld), R.position.applyMatrix4(u), m++;
      } else if (b.isHemisphereLight) {
        const R = r.hemi[d];
        R.direction.setFromMatrixPosition(b.matrixWorld), R.direction.transformDirection(u), d++;
      }
    }
  }
  return {
    setup: l,
    setupView: c,
    state: r
  };
}
function fa(i, t) {
  const e = new cf(i, t), n = [], r = [];
  function s() {
    n.length = 0, r.length = 0;
  }
  function o(f) {
    n.push(f);
  }
  function a(f) {
    r.push(f);
  }
  function l(f) {
    e.setup(n, f);
  }
  function c(f) {
    e.setupView(n, f);
  }
  return {
    init: s,
    state: {
      lightsArray: n,
      shadowsArray: r,
      lights: e
    },
    setupLights: l,
    setupLightsView: c,
    pushLight: o,
    pushShadow: a
  };
}
function hf(i, t) {
  let e = /* @__PURE__ */ new WeakMap();
  function n(s, o = 0) {
    const a = e.get(s);
    let l;
    return a === void 0 ? (l = new fa(i, t), e.set(s, [l])) : o >= a.length ? (l = new fa(i, t), a.push(l)) : l = a[o], l;
  }
  function r() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: r
  };
}
class uf extends ln {
  constructor(t) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = 3200, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class ff extends ln {
  constructor(t) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
const df = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, pf = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function mf(i, t, e) {
  let n = new cs();
  const r = new rt(), s = new rt(), o = new Qt(), a = new uf({ depthPacking: 3201 }), l = new ff(), c = {}, h = e.maxTextureSize, f = { 0: 1, 1: 0, 2: 2 }, p = new Re({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new rt() },
      radius: { value: 4 }
    },
    vertexShader: df,
    fragmentShader: pf
  }), m = p.clone();
  m.defines.HORIZONTAL_PASS = 1;
  const g = new ce();
  g.setAttribute(
    "position",
    new ae(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const _ = new ie(g, p), d = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
  let u = this.type;
  this.render = function(A, w, O) {
    if (d.enabled === !1 || d.autoUpdate === !1 && d.needsUpdate === !1 || A.length === 0) return;
    const M = i.getRenderTarget(), S = i.getActiveCubeFace(), U = i.getActiveMipmapLevel(), N = i.state;
    N.setBlending(0), N.buffers.color.setClear(1, 1, 1, 1), N.buffers.depth.setTest(!0), N.setScissorTest(!1);
    const Y = u !== 3 && this.type === 3, P = u === 3 && this.type !== 3;
    for (let B = 0, H = A.length; B < H; B++) {
      const J = A[B], X = J.shadow;
      if (X === void 0) {
        console.warn("THREE.WebGLShadowMap:", J, "has no shadow.");
        continue;
      }
      if (X.autoUpdate === !1 && X.needsUpdate === !1) continue;
      r.copy(X.mapSize);
      const W = X.getFrameExtents();
      if (r.multiply(W), s.copy(X.mapSize), (r.x > h || r.y > h) && (r.x > h && (s.x = Math.floor(h / W.x), r.x = s.x * W.x, X.mapSize.x = s.x), r.y > h && (s.y = Math.floor(h / W.y), r.y = s.y * W.y, X.mapSize.y = s.y)), X.map === null || Y === !0 || P === !0) {
        const et = this.type !== 3 ? { minFilter: 1003, magFilter: 1003 } : {};
        X.map !== null && X.map.dispose(), X.map = new on(r.x, r.y, et), X.map.texture.name = J.name + ".shadowMap", X.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(X.map), i.clear();
      const tt = X.getViewportCount();
      for (let et = 0; et < tt; et++) {
        const ut = X.getViewport(et);
        o.set(
          s.x * ut.x,
          s.y * ut.y,
          s.x * ut.z,
          s.y * ut.w
        ), N.viewport(o), X.updateMatrices(J, et), n = X.getFrustum(), b(w, O, X.camera, J, this.type);
      }
      X.isPointLightShadow !== !0 && this.type === 3 && T(X, O), X.needsUpdate = !1;
    }
    u = this.type, d.needsUpdate = !1, i.setRenderTarget(M, S, U);
  };
  function T(A, w) {
    const O = t.update(_);
    p.defines.VSM_SAMPLES !== A.blurSamples && (p.defines.VSM_SAMPLES = A.blurSamples, m.defines.VSM_SAMPLES = A.blurSamples, p.needsUpdate = !0, m.needsUpdate = !0), A.mapPass === null && (A.mapPass = new on(r.x, r.y)), p.uniforms.shadow_pass.value = A.map.texture, p.uniforms.resolution.value = A.mapSize, p.uniforms.radius.value = A.radius, i.setRenderTarget(A.mapPass), i.clear(), i.renderBufferDirect(w, null, O, p, _, null), m.uniforms.shadow_pass.value = A.mapPass.texture, m.uniforms.resolution.value = A.mapSize, m.uniforms.radius.value = A.radius, i.setRenderTarget(A.map), i.clear(), i.renderBufferDirect(w, null, O, m, _, null);
  }
  function v(A, w, O, M) {
    let S = null;
    const U = O.isPointLight === !0 ? A.customDistanceMaterial : A.customDepthMaterial;
    if (U !== void 0)
      S = U;
    else if (S = O.isPointLight === !0 ? l : a, i.localClippingEnabled && w.clipShadows === !0 && Array.isArray(w.clippingPlanes) && w.clippingPlanes.length !== 0 || w.displacementMap && w.displacementScale !== 0 || w.alphaMap && w.alphaTest > 0 || w.map && w.alphaTest > 0) {
      const N = S.uuid, Y = w.uuid;
      let P = c[N];
      P === void 0 && (P = {}, c[N] = P);
      let B = P[Y];
      B === void 0 && (B = S.clone(), P[Y] = B, w.addEventListener("dispose", R)), S = B;
    }
    if (S.visible = w.visible, S.wireframe = w.wireframe, M === 3 ? S.side = w.shadowSide !== null ? w.shadowSide : w.side : S.side = w.shadowSide !== null ? w.shadowSide : f[w.side], S.alphaMap = w.alphaMap, S.alphaTest = w.alphaTest, S.map = w.map, S.clipShadows = w.clipShadows, S.clippingPlanes = w.clippingPlanes, S.clipIntersection = w.clipIntersection, S.displacementMap = w.displacementMap, S.displacementScale = w.displacementScale, S.displacementBias = w.displacementBias, S.wireframeLinewidth = w.wireframeLinewidth, S.linewidth = w.linewidth, O.isPointLight === !0 && S.isMeshDistanceMaterial === !0) {
      const N = i.properties.get(S);
      N.light = O;
    }
    return S;
  }
  function b(A, w, O, M, S) {
    if (A.visible === !1) return;
    if (A.layers.test(w.layers) && (A.isMesh || A.isLine || A.isPoints) && (A.castShadow || A.receiveShadow && S === 3) && (!A.frustumCulled || n.intersectsObject(A))) {
      A.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse, A.matrixWorld);
      const Y = t.update(A), P = A.material;
      if (Array.isArray(P)) {
        const B = Y.groups;
        for (let H = 0, J = B.length; H < J; H++) {
          const X = B[H], W = P[X.materialIndex];
          if (W && W.visible) {
            const tt = v(A, W, M, S);
            A.onBeforeShadow(i, A, w, O, Y, tt, X), i.renderBufferDirect(O, null, Y, tt, A, X), A.onAfterShadow(i, A, w, O, Y, tt, X);
          }
        }
      } else if (P.visible) {
        const B = v(A, P, M, S);
        A.onBeforeShadow(i, A, w, O, Y, B, null), i.renderBufferDirect(O, null, Y, B, A, null), A.onAfterShadow(i, A, w, O, Y, B, null);
      }
    }
    const N = A.children;
    for (let Y = 0, P = N.length; Y < P; Y++)
      b(N[Y], w, O, M, S);
  }
  function R(A) {
    A.target.removeEventListener("dispose", R);
    for (const O in c) {
      const M = c[O], S = A.target.uuid;
      S in M && (M[S].dispose(), delete M[S]);
    }
  }
}
function gf(i, t, e) {
  const n = e.isWebGL2;
  function r() {
    let D = !1;
    const ct = new Qt();
    let ht = null;
    const Rt = new Qt(0, 0, 0, 0);
    return {
      setMask: function(bt) {
        ht !== bt && !D && (i.colorMask(bt, bt, bt, bt), ht = bt);
      },
      setLocked: function(bt) {
        D = bt;
      },
      setClear: function(bt, Zt, Jt, pe, Ee) {
        Ee === !0 && (bt *= pe, Zt *= pe, Jt *= pe), ct.set(bt, Zt, Jt, pe), Rt.equals(ct) === !1 && (i.clearColor(bt, Zt, Jt, pe), Rt.copy(ct));
      },
      reset: function() {
        D = !1, ht = null, Rt.set(-1, 0, 0, 0);
      }
    };
  }
  function s() {
    let D = !1, ct = null, ht = null, Rt = null;
    return {
      setTest: function(bt) {
        bt ? Dt(i.DEPTH_TEST) : Mt(i.DEPTH_TEST);
      },
      setMask: function(bt) {
        ct !== bt && !D && (i.depthMask(bt), ct = bt);
      },
      setFunc: function(bt) {
        if (ht !== bt) {
          switch (bt) {
            case 0:
              i.depthFunc(i.NEVER);
              break;
            case 1:
              i.depthFunc(i.ALWAYS);
              break;
            case 2:
              i.depthFunc(i.LESS);
              break;
            case 3:
              i.depthFunc(i.LEQUAL);
              break;
            case 4:
              i.depthFunc(i.EQUAL);
              break;
            case 5:
              i.depthFunc(i.GEQUAL);
              break;
            case 6:
              i.depthFunc(i.GREATER);
              break;
            case 7:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          ht = bt;
        }
      },
      setLocked: function(bt) {
        D = bt;
      },
      setClear: function(bt) {
        Rt !== bt && (i.clearDepth(bt), Rt = bt);
      },
      reset: function() {
        D = !1, ct = null, ht = null, Rt = null;
      }
    };
  }
  function o() {
    let D = !1, ct = null, ht = null, Rt = null, bt = null, Zt = null, Jt = null, pe = null, Ee = null;
    return {
      setTest: function(Kt) {
        D || (Kt ? Dt(i.STENCIL_TEST) : Mt(i.STENCIL_TEST));
      },
      setMask: function(Kt) {
        ct !== Kt && !D && (i.stencilMask(Kt), ct = Kt);
      },
      setFunc: function(Kt, Te, Ge) {
        (ht !== Kt || Rt !== Te || bt !== Ge) && (i.stencilFunc(Kt, Te, Ge), ht = Kt, Rt = Te, bt = Ge);
      },
      setOp: function(Kt, Te, Ge) {
        (Zt !== Kt || Jt !== Te || pe !== Ge) && (i.stencilOp(Kt, Te, Ge), Zt = Kt, Jt = Te, pe = Ge);
      },
      setLocked: function(Kt) {
        D = Kt;
      },
      setClear: function(Kt) {
        Ee !== Kt && (i.clearStencil(Kt), Ee = Kt);
      },
      reset: function() {
        D = !1, ct = null, ht = null, Rt = null, bt = null, Zt = null, Jt = null, pe = null, Ee = null;
      }
    };
  }
  const a = new r(), l = new s(), c = new o(), h = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap();
  let p = {}, m = {}, g = /* @__PURE__ */ new WeakMap(), _ = [], d = null, u = !1, T = null, v = null, b = null, R = null, A = null, w = null, O = null, M = new Bt(0, 0, 0), S = 0, U = !1, N = null, Y = null, P = null, B = null, H = null;
  const J = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let X = !1, W = 0;
  const tt = i.getParameter(i.VERSION);
  tt.indexOf("WebGL") !== -1 ? (W = parseFloat(/^WebGL (\d)/.exec(tt)[1]), X = W >= 1) : tt.indexOf("OpenGL ES") !== -1 && (W = parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]), X = W >= 2);
  let et = null, ut = {};
  const k = i.getParameter(i.SCISSOR_BOX), j = i.getParameter(i.VIEWPORT), ft = new Qt().fromArray(k), xt = new Qt().fromArray(j);
  function mt(D, ct, ht, Rt) {
    const bt = new Uint8Array(4), Zt = i.createTexture();
    i.bindTexture(D, Zt), i.texParameteri(D, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(D, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let Jt = 0; Jt < ht; Jt++)
      n && (D === i.TEXTURE_3D || D === i.TEXTURE_2D_ARRAY) ? i.texImage3D(ct, 0, i.RGBA, 1, 1, Rt, 0, i.RGBA, i.UNSIGNED_BYTE, bt) : i.texImage2D(ct + Jt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, bt);
    return Zt;
  }
  const wt = {};
  wt[i.TEXTURE_2D] = mt(i.TEXTURE_2D, i.TEXTURE_2D, 1), wt[i.TEXTURE_CUBE_MAP] = mt(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), n && (wt[i.TEXTURE_2D_ARRAY] = mt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), wt[i.TEXTURE_3D] = mt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)), a.setClear(0, 0, 0, 1), l.setClear(1), c.setClear(0), Dt(i.DEPTH_TEST), l.setFunc(3), dt(!1), y(1), Dt(i.CULL_FACE), q(0);
  function Dt(D) {
    p[D] !== !0 && (i.enable(D), p[D] = !0);
  }
  function Mt(D) {
    p[D] !== !1 && (i.disable(D), p[D] = !1);
  }
  function Pt(D, ct) {
    return m[D] !== ct ? (i.bindFramebuffer(D, ct), m[D] = ct, n && (D === i.DRAW_FRAMEBUFFER && (m[i.FRAMEBUFFER] = ct), D === i.FRAMEBUFFER && (m[i.DRAW_FRAMEBUFFER] = ct)), !0) : !1;
  }
  function C(D, ct) {
    let ht = _, Rt = !1;
    if (D)
      if (ht = g.get(ct), ht === void 0 && (ht = [], g.set(ct, ht)), D.isWebGLMultipleRenderTargets) {
        const bt = D.texture;
        if (ht.length !== bt.length || ht[0] !== i.COLOR_ATTACHMENT0) {
          for (let Zt = 0, Jt = bt.length; Zt < Jt; Zt++)
            ht[Zt] = i.COLOR_ATTACHMENT0 + Zt;
          ht.length = bt.length, Rt = !0;
        }
      } else
        ht[0] !== i.COLOR_ATTACHMENT0 && (ht[0] = i.COLOR_ATTACHMENT0, Rt = !0);
    else
      ht[0] !== i.BACK && (ht[0] = i.BACK, Rt = !0);
    Rt && (e.isWebGL2 ? i.drawBuffers(ht) : t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ht));
  }
  function st(D) {
    return d !== D ? (i.useProgram(D), d = D, !0) : !1;
  }
  const Z = {
    100: i.FUNC_ADD,
    101: i.FUNC_SUBTRACT,
    102: i.FUNC_REVERSE_SUBTRACT
  };
  if (n)
    Z[103] = i.MIN, Z[104] = i.MAX;
  else {
    const D = t.get("EXT_blend_minmax");
    D !== null && (Z[103] = D.MIN_EXT, Z[104] = D.MAX_EXT);
  }
  const it = {
    200: i.ZERO,
    201: i.ONE,
    202: i.SRC_COLOR,
    204: i.SRC_ALPHA,
    210: i.SRC_ALPHA_SATURATE,
    208: i.DST_COLOR,
    206: i.DST_ALPHA,
    203: i.ONE_MINUS_SRC_COLOR,
    205: i.ONE_MINUS_SRC_ALPHA,
    209: i.ONE_MINUS_DST_COLOR,
    207: i.ONE_MINUS_DST_ALPHA,
    211: i.CONSTANT_COLOR,
    212: i.ONE_MINUS_CONSTANT_COLOR,
    213: i.CONSTANT_ALPHA,
    214: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function q(D, ct, ht, Rt, bt, Zt, Jt, pe, Ee, Kt) {
    if (D === 0) {
      u === !0 && (Mt(i.BLEND), u = !1);
      return;
    }
    if (u === !1 && (Dt(i.BLEND), u = !0), D !== 5) {
      if (D !== T || Kt !== U) {
        if ((v !== 100 || A !== 100) && (i.blendEquation(i.FUNC_ADD), v = 100, A = 100), Kt)
          switch (D) {
            case 1:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case 3:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case 4:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        else
          switch (D) {
            case 1:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case 3:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case 4:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        b = null, R = null, w = null, O = null, M.set(0, 0, 0), S = 0, T = D, U = Kt;
      }
      return;
    }
    bt = bt || ct, Zt = Zt || ht, Jt = Jt || Rt, (ct !== v || bt !== A) && (i.blendEquationSeparate(Z[ct], Z[bt]), v = ct, A = bt), (ht !== b || Rt !== R || Zt !== w || Jt !== O) && (i.blendFuncSeparate(it[ht], it[Rt], it[Zt], it[Jt]), b = ht, R = Rt, w = Zt, O = Jt), (pe.equals(M) === !1 || Ee !== S) && (i.blendColor(pe.r, pe.g, pe.b, Ee), M.copy(pe), S = Ee), T = D, U = !1;
  }
  function yt(D, ct) {
    D.side === 2 ? Mt(i.CULL_FACE) : Dt(i.CULL_FACE);
    let ht = D.side === 1;
    ct && (ht = !ht), dt(ht), D.blending === 1 && D.transparent === !1 ? q(0) : q(D.blending, D.blendEquation, D.blendSrc, D.blendDst, D.blendEquationAlpha, D.blendSrcAlpha, D.blendDstAlpha, D.blendColor, D.blendAlpha, D.premultipliedAlpha), l.setFunc(D.depthFunc), l.setTest(D.depthTest), l.setMask(D.depthWrite), a.setMask(D.colorWrite);
    const Rt = D.stencilWrite;
    c.setTest(Rt), Rt && (c.setMask(D.stencilWriteMask), c.setFunc(D.stencilFunc, D.stencilRef, D.stencilFuncMask), c.setOp(D.stencilFail, D.stencilZFail, D.stencilZPass)), F(D.polygonOffset, D.polygonOffsetFactor, D.polygonOffsetUnits), D.alphaToCoverage === !0 ? Dt(i.SAMPLE_ALPHA_TO_COVERAGE) : Mt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function dt(D) {
    N !== D && (D ? i.frontFace(i.CW) : i.frontFace(i.CCW), N = D);
  }
  function y(D) {
    D !== 0 ? (Dt(i.CULL_FACE), D !== Y && (D === 1 ? i.cullFace(i.BACK) : D === 2 ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Mt(i.CULL_FACE), Y = D;
  }
  function x(D) {
    D !== P && (X && i.lineWidth(D), P = D);
  }
  function F(D, ct, ht) {
    D ? (Dt(i.POLYGON_OFFSET_FILL), (B !== ct || H !== ht) && (i.polygonOffset(ct, ht), B = ct, H = ht)) : Mt(i.POLYGON_OFFSET_FILL);
  }
  function nt(D) {
    D ? Dt(i.SCISSOR_TEST) : Mt(i.SCISSOR_TEST);
  }
  function $(D) {
    D === void 0 && (D = i.TEXTURE0 + J - 1), et !== D && (i.activeTexture(D), et = D);
  }
  function K(D, ct, ht) {
    ht === void 0 && (et === null ? ht = i.TEXTURE0 + J - 1 : ht = et);
    let Rt = ut[ht];
    Rt === void 0 && (Rt = { type: void 0, texture: void 0 }, ut[ht] = Rt), (Rt.type !== D || Rt.texture !== ct) && (et !== ht && (i.activeTexture(ht), et = ht), i.bindTexture(D, ct || wt[D]), Rt.type = D, Rt.texture = ct);
  }
  function vt() {
    const D = ut[et];
    D !== void 0 && D.type !== void 0 && (i.bindTexture(D.type, null), D.type = void 0, D.texture = void 0);
  }
  function lt() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function gt() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Tt() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function It() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Q() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Wt() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function kt() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Lt() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Et() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function _t() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Ft(D) {
    ft.equals(D) === !1 && (i.scissor(D.x, D.y, D.z, D.w), ft.copy(D));
  }
  function Xt(D) {
    xt.equals(D) === !1 && (i.viewport(D.x, D.y, D.z, D.w), xt.copy(D));
  }
  function re(D, ct) {
    let ht = f.get(ct);
    ht === void 0 && (ht = /* @__PURE__ */ new WeakMap(), f.set(ct, ht));
    let Rt = ht.get(D);
    Rt === void 0 && (Rt = i.getUniformBlockIndex(ct, D.name), ht.set(D, Rt));
  }
  function Gt(D, ct) {
    const Rt = f.get(ct).get(D);
    h.get(ct) !== Rt && (i.uniformBlockBinding(ct, Rt, D.__bindingPointIndex), h.set(ct, Rt));
  }
  function at() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), n === !0 && (i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null)), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), p = {}, et = null, ut = {}, m = {}, g = /* @__PURE__ */ new WeakMap(), _ = [], d = null, u = !1, T = null, v = null, b = null, R = null, A = null, w = null, O = null, M = new Bt(0, 0, 0), S = 0, U = !1, N = null, Y = null, P = null, B = null, H = null, ft.set(0, 0, i.canvas.width, i.canvas.height), xt.set(0, 0, i.canvas.width, i.canvas.height), a.reset(), l.reset(), c.reset();
  }
  return {
    buffers: {
      color: a,
      depth: l,
      stencil: c
    },
    enable: Dt,
    disable: Mt,
    bindFramebuffer: Pt,
    drawBuffers: C,
    useProgram: st,
    setBlending: q,
    setMaterial: yt,
    setFlipSided: dt,
    setCullFace: y,
    setLineWidth: x,
    setPolygonOffset: F,
    setScissorTest: nt,
    activeTexture: $,
    bindTexture: K,
    unbindTexture: vt,
    compressedTexImage2D: lt,
    compressedTexImage3D: gt,
    texImage2D: Et,
    texImage3D: _t,
    updateUBOMapping: re,
    uniformBlockBinding: Gt,
    texStorage2D: kt,
    texStorage3D: Lt,
    texSubImage2D: Tt,
    texSubImage3D: It,
    compressedTexSubImage2D: Q,
    compressedTexSubImage3D: Wt,
    scissor: Ft,
    viewport: Xt,
    reset: at
  };
}
function _f(i, t, e, n, r, s, o) {
  const a = r.isWebGL2, l = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), h = /* @__PURE__ */ new WeakMap();
  let f;
  const p = /* @__PURE__ */ new WeakMap();
  let m = !1;
  try {
    m = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(y, x) {
    return m ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(y, x)
    ) : li("canvas");
  }
  function _(y, x, F, nt) {
    let $ = 1;
    if ((y.width > nt || y.height > nt) && ($ = nt / Math.max(y.width, y.height)), $ < 1 || x === !0)
      if (typeof HTMLImageElement < "u" && y instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && y instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && y instanceof ImageBitmap) {
        const K = x ? Jr : Math.floor, vt = K($ * y.width), lt = K($ * y.height);
        f === void 0 && (f = g(vt, lt));
        const gt = F ? g(vt, lt) : f;
        return gt.width = vt, gt.height = lt, gt.getContext("2d").drawImage(y, 0, 0, vt, lt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + y.width + "x" + y.height + ") to (" + vt + "x" + lt + ")."), gt;
      } else
        return "data" in y && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + y.width + "x" + y.height + ")."), y;
    return y;
  }
  function d(y) {
    return Rs(y.width) && Rs(y.height);
  }
  function u(y) {
    return a ? !1 : y.wrapS !== 1001 || y.wrapT !== 1001 || y.minFilter !== 1003 && y.minFilter !== 1006;
  }
  function T(y, x) {
    return y.generateMipmaps && x && y.minFilter !== 1003 && y.minFilter !== 1006;
  }
  function v(y) {
    i.generateMipmap(y);
  }
  function b(y, x, F, nt, $ = !1) {
    if (a === !1) return x;
    if (y !== null) {
      if (i[y] !== void 0) return i[y];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + y + "'");
    }
    let K = x;
    if (x === i.RED && (F === i.FLOAT && (K = i.R32F), F === i.HALF_FLOAT && (K = i.R16F), F === i.UNSIGNED_BYTE && (K = i.R8)), x === i.RED_INTEGER && (F === i.UNSIGNED_BYTE && (K = i.R8UI), F === i.UNSIGNED_SHORT && (K = i.R16UI), F === i.UNSIGNED_INT && (K = i.R32UI), F === i.BYTE && (K = i.R8I), F === i.SHORT && (K = i.R16I), F === i.INT && (K = i.R32I)), x === i.RG && (F === i.FLOAT && (K = i.RG32F), F === i.HALF_FLOAT && (K = i.RG16F), F === i.UNSIGNED_BYTE && (K = i.RG8)), x === i.RGBA) {
      const vt = $ ? $i : qt.getTransfer(nt);
      F === i.FLOAT && (K = i.RGBA32F), F === i.HALF_FLOAT && (K = i.RGBA16F), F === i.UNSIGNED_BYTE && (K = vt === $t ? i.SRGB8_ALPHA8 : i.RGBA8), F === i.UNSIGNED_SHORT_4_4_4_4 && (K = i.RGBA4), F === i.UNSIGNED_SHORT_5_5_5_1 && (K = i.RGB5_A1);
    }
    return (K === i.R16F || K === i.R32F || K === i.RG16F || K === i.RG32F || K === i.RGBA16F || K === i.RGBA32F) && t.get("EXT_color_buffer_float"), K;
  }
  function R(y, x, F) {
    return T(y, F) === !0 || y.isFramebufferTexture && y.minFilter !== 1003 && y.minFilter !== 1006 ? Math.log2(Math.max(x.width, x.height)) + 1 : y.mipmaps !== void 0 && y.mipmaps.length > 0 ? y.mipmaps.length : y.isCompressedTexture && Array.isArray(y.image) ? x.mipmaps.length : 1;
  }
  function A(y) {
    return y === 1003 || y === 1004 || y === 1005 ? i.NEAREST : i.LINEAR;
  }
  function w(y) {
    const x = y.target;
    x.removeEventListener("dispose", w), M(x), x.isVideoTexture && h.delete(x);
  }
  function O(y) {
    const x = y.target;
    x.removeEventListener("dispose", O), U(x);
  }
  function M(y) {
    const x = n.get(y);
    if (x.__webglInit === void 0) return;
    const F = y.source, nt = p.get(F);
    if (nt) {
      const $ = nt[x.__cacheKey];
      $.usedTimes--, $.usedTimes === 0 && S(y), Object.keys(nt).length === 0 && p.delete(F);
    }
    n.remove(y);
  }
  function S(y) {
    const x = n.get(y);
    i.deleteTexture(x.__webglTexture);
    const F = y.source, nt = p.get(F);
    delete nt[x.__cacheKey], o.memory.textures--;
  }
  function U(y) {
    const x = y.texture, F = n.get(y), nt = n.get(x);
    if (nt.__webglTexture !== void 0 && (i.deleteTexture(nt.__webglTexture), o.memory.textures--), y.depthTexture && y.depthTexture.dispose(), y.isWebGLCubeRenderTarget)
      for (let $ = 0; $ < 6; $++) {
        if (Array.isArray(F.__webglFramebuffer[$]))
          for (let K = 0; K < F.__webglFramebuffer[$].length; K++) i.deleteFramebuffer(F.__webglFramebuffer[$][K]);
        else
          i.deleteFramebuffer(F.__webglFramebuffer[$]);
        F.__webglDepthbuffer && i.deleteRenderbuffer(F.__webglDepthbuffer[$]);
      }
    else {
      if (Array.isArray(F.__webglFramebuffer))
        for (let $ = 0; $ < F.__webglFramebuffer.length; $++) i.deleteFramebuffer(F.__webglFramebuffer[$]);
      else
        i.deleteFramebuffer(F.__webglFramebuffer);
      if (F.__webglDepthbuffer && i.deleteRenderbuffer(F.__webglDepthbuffer), F.__webglMultisampledFramebuffer && i.deleteFramebuffer(F.__webglMultisampledFramebuffer), F.__webglColorRenderbuffer)
        for (let $ = 0; $ < F.__webglColorRenderbuffer.length; $++)
          F.__webglColorRenderbuffer[$] && i.deleteRenderbuffer(F.__webglColorRenderbuffer[$]);
      F.__webglDepthRenderbuffer && i.deleteRenderbuffer(F.__webglDepthRenderbuffer);
    }
    if (y.isWebGLMultipleRenderTargets)
      for (let $ = 0, K = x.length; $ < K; $++) {
        const vt = n.get(x[$]);
        vt.__webglTexture && (i.deleteTexture(vt.__webglTexture), o.memory.textures--), n.remove(x[$]);
      }
    n.remove(x), n.remove(y);
  }
  let N = 0;
  function Y() {
    N = 0;
  }
  function P() {
    const y = N;
    return y >= r.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + y + " texture units while this GPU supports only " + r.maxTextures), N += 1, y;
  }
  function B(y) {
    const x = [];
    return x.push(y.wrapS), x.push(y.wrapT), x.push(y.wrapR || 0), x.push(y.magFilter), x.push(y.minFilter), x.push(y.anisotropy), x.push(y.internalFormat), x.push(y.format), x.push(y.type), x.push(y.generateMipmaps), x.push(y.premultiplyAlpha), x.push(y.flipY), x.push(y.unpackAlignment), x.push(y.colorSpace), x.join();
  }
  function H(y, x) {
    const F = n.get(y);
    if (y.isVideoTexture && yt(y), y.isRenderTargetTexture === !1 && y.version > 0 && F.__version !== y.version) {
      const nt = y.image;
      if (nt === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (nt.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        ft(F, y, x);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + x);
  }
  function J(y, x) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      ft(F, y, x);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + x);
  }
  function X(y, x) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      ft(F, y, x);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + x);
  }
  function W(y, x) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      xt(F, y, x);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + x);
  }
  const tt = {
    1e3: i.REPEAT,
    1001: i.CLAMP_TO_EDGE,
    1002: i.MIRRORED_REPEAT
  }, et = {
    1003: i.NEAREST,
    1004: i.NEAREST_MIPMAP_NEAREST,
    1005: i.NEAREST_MIPMAP_LINEAR,
    1006: i.LINEAR,
    1007: i.LINEAR_MIPMAP_NEAREST,
    1008: i.LINEAR_MIPMAP_LINEAR
  }, ut = {
    512: i.NEVER,
    519: i.ALWAYS,
    513: i.LESS,
    515: i.LEQUAL,
    514: i.EQUAL,
    518: i.GEQUAL,
    516: i.GREATER,
    517: i.NOTEQUAL
  };
  function k(y, x, F) {
    if (F ? (i.texParameteri(y, i.TEXTURE_WRAP_S, tt[x.wrapS]), i.texParameteri(y, i.TEXTURE_WRAP_T, tt[x.wrapT]), (y === i.TEXTURE_3D || y === i.TEXTURE_2D_ARRAY) && i.texParameteri(y, i.TEXTURE_WRAP_R, tt[x.wrapR]), i.texParameteri(y, i.TEXTURE_MAG_FILTER, et[x.magFilter]), i.texParameteri(y, i.TEXTURE_MIN_FILTER, et[x.minFilter])) : (i.texParameteri(y, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(y, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), (y === i.TEXTURE_3D || y === i.TEXTURE_2D_ARRAY) && i.texParameteri(y, i.TEXTURE_WRAP_R, i.CLAMP_TO_EDGE), (x.wrapS !== 1001 || x.wrapT !== 1001) && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."), i.texParameteri(y, i.TEXTURE_MAG_FILTER, A(x.magFilter)), i.texParameteri(y, i.TEXTURE_MIN_FILTER, A(x.minFilter)), x.minFilter !== 1003 && x.minFilter !== 1006 && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")), x.compareFunction && (i.texParameteri(y, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(y, i.TEXTURE_COMPARE_FUNC, ut[x.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      const nt = t.get("EXT_texture_filter_anisotropic");
      if (x.magFilter === 1003 || x.minFilter !== 1005 && x.minFilter !== 1008 || x.type === 1015 && t.has("OES_texture_float_linear") === !1 || a === !1 && x.type === 1016 && t.has("OES_texture_half_float_linear") === !1) return;
      (x.anisotropy > 1 || n.get(x).__currentAnisotropy) && (i.texParameterf(y, nt.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(x.anisotropy, r.getMaxAnisotropy())), n.get(x).__currentAnisotropy = x.anisotropy);
    }
  }
  function j(y, x) {
    let F = !1;
    y.__webglInit === void 0 && (y.__webglInit = !0, x.addEventListener("dispose", w));
    const nt = x.source;
    let $ = p.get(nt);
    $ === void 0 && ($ = {}, p.set(nt, $));
    const K = B(x);
    if (K !== y.__cacheKey) {
      $[K] === void 0 && ($[K] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, o.memory.textures++, F = !0), $[K].usedTimes++;
      const vt = $[y.__cacheKey];
      vt !== void 0 && ($[y.__cacheKey].usedTimes--, vt.usedTimes === 0 && S(x)), y.__cacheKey = K, y.__webglTexture = $[K].texture;
    }
    return F;
  }
  function ft(y, x, F) {
    let nt = i.TEXTURE_2D;
    (x.isDataArrayTexture || x.isCompressedArrayTexture) && (nt = i.TEXTURE_2D_ARRAY), x.isData3DTexture && (nt = i.TEXTURE_3D);
    const $ = j(y, x), K = x.source;
    e.bindTexture(nt, y.__webglTexture, i.TEXTURE0 + F);
    const vt = n.get(K);
    if (K.version !== vt.__version || $ === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const lt = qt.getPrimaries(qt.workingColorSpace), gt = x.colorSpace === Fe ? null : qt.getPrimaries(x.colorSpace), Tt = x.colorSpace === Fe || lt === gt ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Tt);
      const It = u(x) && d(x.image) === !1;
      let Q = _(x.image, It, !1, r.maxTextureSize);
      Q = dt(x, Q);
      const Wt = d(Q) || a, kt = s.convert(x.format, x.colorSpace);
      let Lt = s.convert(x.type), Et = b(x.internalFormat, kt, Lt, x.colorSpace, x.isVideoTexture);
      k(nt, x, Wt);
      let _t;
      const Ft = x.mipmaps, Xt = a && x.isVideoTexture !== !0 && Et !== 36196, re = vt.__version === void 0 || $ === !0, Gt = R(x, Q, Wt);
      if (x.isDepthTexture)
        Et = i.DEPTH_COMPONENT, a ? x.type === 1015 ? Et = i.DEPTH_COMPONENT32F : x.type === 1014 ? Et = i.DEPTH_COMPONENT24 : x.type === 1020 ? Et = i.DEPTH24_STENCIL8 : Et = i.DEPTH_COMPONENT16 : x.type === 1015 && console.error("WebGLRenderer: Floating point depth texture requires WebGL2."), x.format === 1026 && Et === i.DEPTH_COMPONENT && x.type !== 1012 && x.type !== 1014 && (console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."), x.type = 1014, Lt = s.convert(x.type)), x.format === 1027 && Et === i.DEPTH_COMPONENT && (Et = i.DEPTH_STENCIL, x.type !== 1020 && (console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."), x.type = 1020, Lt = s.convert(x.type))), re && (Xt ? e.texStorage2D(i.TEXTURE_2D, 1, Et, Q.width, Q.height) : e.texImage2D(i.TEXTURE_2D, 0, Et, Q.width, Q.height, 0, kt, Lt, null));
      else if (x.isDataTexture)
        if (Ft.length > 0 && Wt) {
          Xt && re && e.texStorage2D(i.TEXTURE_2D, Gt, Et, Ft[0].width, Ft[0].height);
          for (let at = 0, D = Ft.length; at < D; at++)
            _t = Ft[at], Xt ? e.texSubImage2D(i.TEXTURE_2D, at, 0, 0, _t.width, _t.height, kt, Lt, _t.data) : e.texImage2D(i.TEXTURE_2D, at, Et, _t.width, _t.height, 0, kt, Lt, _t.data);
          x.generateMipmaps = !1;
        } else
          Xt ? (re && e.texStorage2D(i.TEXTURE_2D, Gt, Et, Q.width, Q.height), e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, Q.width, Q.height, kt, Lt, Q.data)) : e.texImage2D(i.TEXTURE_2D, 0, Et, Q.width, Q.height, 0, kt, Lt, Q.data);
      else if (x.isCompressedTexture)
        if (x.isCompressedArrayTexture) {
          Xt && re && e.texStorage3D(i.TEXTURE_2D_ARRAY, Gt, Et, Ft[0].width, Ft[0].height, Q.depth);
          for (let at = 0, D = Ft.length; at < D; at++)
            _t = Ft[at], x.format !== 1023 ? kt !== null ? Xt ? e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, at, 0, 0, 0, _t.width, _t.height, Q.depth, kt, _t.data, 0, 0) : e.compressedTexImage3D(i.TEXTURE_2D_ARRAY, at, Et, _t.width, _t.height, Q.depth, 0, _t.data, 0, 0) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Xt ? e.texSubImage3D(i.TEXTURE_2D_ARRAY, at, 0, 0, 0, _t.width, _t.height, Q.depth, kt, Lt, _t.data) : e.texImage3D(i.TEXTURE_2D_ARRAY, at, Et, _t.width, _t.height, Q.depth, 0, kt, Lt, _t.data);
        } else {
          Xt && re && e.texStorage2D(i.TEXTURE_2D, Gt, Et, Ft[0].width, Ft[0].height);
          for (let at = 0, D = Ft.length; at < D; at++)
            _t = Ft[at], x.format !== 1023 ? kt !== null ? Xt ? e.compressedTexSubImage2D(i.TEXTURE_2D, at, 0, 0, _t.width, _t.height, kt, _t.data) : e.compressedTexImage2D(i.TEXTURE_2D, at, Et, _t.width, _t.height, 0, _t.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Xt ? e.texSubImage2D(i.TEXTURE_2D, at, 0, 0, _t.width, _t.height, kt, Lt, _t.data) : e.texImage2D(i.TEXTURE_2D, at, Et, _t.width, _t.height, 0, kt, Lt, _t.data);
        }
      else if (x.isDataArrayTexture)
        Xt ? (re && e.texStorage3D(i.TEXTURE_2D_ARRAY, Gt, Et, Q.width, Q.height, Q.depth), e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, Q.width, Q.height, Q.depth, kt, Lt, Q.data)) : e.texImage3D(i.TEXTURE_2D_ARRAY, 0, Et, Q.width, Q.height, Q.depth, 0, kt, Lt, Q.data);
      else if (x.isData3DTexture)
        Xt ? (re && e.texStorage3D(i.TEXTURE_3D, Gt, Et, Q.width, Q.height, Q.depth), e.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, Q.width, Q.height, Q.depth, kt, Lt, Q.data)) : e.texImage3D(i.TEXTURE_3D, 0, Et, Q.width, Q.height, Q.depth, 0, kt, Lt, Q.data);
      else if (x.isFramebufferTexture) {
        if (re)
          if (Xt)
            e.texStorage2D(i.TEXTURE_2D, Gt, Et, Q.width, Q.height);
          else {
            let at = Q.width, D = Q.height;
            for (let ct = 0; ct < Gt; ct++)
              e.texImage2D(i.TEXTURE_2D, ct, Et, at, D, 0, kt, Lt, null), at >>= 1, D >>= 1;
          }
      } else if (Ft.length > 0 && Wt) {
        Xt && re && e.texStorage2D(i.TEXTURE_2D, Gt, Et, Ft[0].width, Ft[0].height);
        for (let at = 0, D = Ft.length; at < D; at++)
          _t = Ft[at], Xt ? e.texSubImage2D(i.TEXTURE_2D, at, 0, 0, kt, Lt, _t) : e.texImage2D(i.TEXTURE_2D, at, Et, kt, Lt, _t);
        x.generateMipmaps = !1;
      } else
        Xt ? (re && e.texStorage2D(i.TEXTURE_2D, Gt, Et, Q.width, Q.height), e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, kt, Lt, Q)) : e.texImage2D(i.TEXTURE_2D, 0, Et, kt, Lt, Q);
      T(x, Wt) && v(nt), vt.__version = K.version, x.onUpdate && x.onUpdate(x);
    }
    y.__version = x.version;
  }
  function xt(y, x, F) {
    if (x.image.length !== 6) return;
    const nt = j(y, x), $ = x.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, y.__webglTexture, i.TEXTURE0 + F);
    const K = n.get($);
    if ($.version !== K.__version || nt === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const vt = qt.getPrimaries(qt.workingColorSpace), lt = x.colorSpace === Fe ? null : qt.getPrimaries(x.colorSpace), gt = x.colorSpace === Fe || vt === lt ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, gt);
      const Tt = x.isCompressedTexture || x.image[0].isCompressedTexture, It = x.image[0] && x.image[0].isDataTexture, Q = [];
      for (let at = 0; at < 6; at++)
        !Tt && !It ? Q[at] = _(x.image[at], !1, !0, r.maxCubemapSize) : Q[at] = It ? x.image[at].image : x.image[at], Q[at] = dt(x, Q[at]);
      const Wt = Q[0], kt = d(Wt) || a, Lt = s.convert(x.format, x.colorSpace), Et = s.convert(x.type), _t = b(x.internalFormat, Lt, Et, x.colorSpace), Ft = a && x.isVideoTexture !== !0, Xt = K.__version === void 0 || nt === !0;
      let re = R(x, Wt, kt);
      k(i.TEXTURE_CUBE_MAP, x, kt);
      let Gt;
      if (Tt) {
        Ft && Xt && e.texStorage2D(i.TEXTURE_CUBE_MAP, re, _t, Wt.width, Wt.height);
        for (let at = 0; at < 6; at++) {
          Gt = Q[at].mipmaps;
          for (let D = 0; D < Gt.length; D++) {
            const ct = Gt[D];
            x.format !== 1023 ? Lt !== null ? Ft ? e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D, 0, 0, ct.width, ct.height, Lt, ct.data) : e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D, _t, ct.width, ct.height, 0, ct.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Ft ? e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D, 0, 0, ct.width, ct.height, Lt, Et, ct.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D, _t, ct.width, ct.height, 0, Lt, Et, ct.data);
          }
        }
      } else {
        Gt = x.mipmaps, Ft && Xt && (Gt.length > 0 && re++, e.texStorage2D(i.TEXTURE_CUBE_MAP, re, _t, Q[0].width, Q[0].height));
        for (let at = 0; at < 6; at++)
          if (It) {
            Ft ? e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0, 0, 0, Q[at].width, Q[at].height, Lt, Et, Q[at].data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0, _t, Q[at].width, Q[at].height, 0, Lt, Et, Q[at].data);
            for (let D = 0; D < Gt.length; D++) {
              const ht = Gt[D].image[at].image;
              Ft ? e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D + 1, 0, 0, ht.width, ht.height, Lt, Et, ht.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D + 1, _t, ht.width, ht.height, 0, Lt, Et, ht.data);
            }
          } else {
            Ft ? e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0, 0, 0, Lt, Et, Q[at]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0, _t, Lt, Et, Q[at]);
            for (let D = 0; D < Gt.length; D++) {
              const ct = Gt[D];
              Ft ? e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D + 1, 0, 0, Lt, Et, ct.image[at]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + at, D + 1, _t, Lt, Et, ct.image[at]);
            }
          }
      }
      T(x, kt) && v(i.TEXTURE_CUBE_MAP), K.__version = $.version, x.onUpdate && x.onUpdate(x);
    }
    y.__version = x.version;
  }
  function mt(y, x, F, nt, $, K) {
    const vt = s.convert(F.format, F.colorSpace), lt = s.convert(F.type), gt = b(F.internalFormat, vt, lt, F.colorSpace);
    if (!n.get(x).__hasExternalTextures) {
      const It = Math.max(1, x.width >> K), Q = Math.max(1, x.height >> K);
      $ === i.TEXTURE_3D || $ === i.TEXTURE_2D_ARRAY ? e.texImage3D($, K, gt, It, Q, x.depth, 0, vt, lt, null) : e.texImage2D($, K, gt, It, Q, 0, vt, lt, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, y), q(x) ? l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, nt, $, n.get(F).__webglTexture, 0, it(x)) : ($ === i.TEXTURE_2D || $ >= i.TEXTURE_CUBE_MAP_POSITIVE_X && $ <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, nt, $, n.get(F).__webglTexture, K), e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function wt(y, x, F) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, y), x.depthBuffer && !x.stencilBuffer) {
      let nt = a === !0 ? i.DEPTH_COMPONENT24 : i.DEPTH_COMPONENT16;
      if (F || q(x)) {
        const $ = x.depthTexture;
        $ && $.isDepthTexture && ($.type === 1015 ? nt = i.DEPTH_COMPONENT32F : $.type === 1014 && (nt = i.DEPTH_COMPONENT24));
        const K = it(x);
        q(x) ? l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, K, nt, x.width, x.height) : i.renderbufferStorageMultisample(i.RENDERBUFFER, K, nt, x.width, x.height);
      } else
        i.renderbufferStorage(i.RENDERBUFFER, nt, x.width, x.height);
      i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.RENDERBUFFER, y);
    } else if (x.depthBuffer && x.stencilBuffer) {
      const nt = it(x);
      F && q(x) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, nt, i.DEPTH24_STENCIL8, x.width, x.height) : q(x) ? l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, nt, i.DEPTH24_STENCIL8, x.width, x.height) : i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, x.width, x.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.RENDERBUFFER, y);
    } else {
      const nt = x.isWebGLMultipleRenderTargets === !0 ? x.texture : [x.texture];
      for (let $ = 0; $ < nt.length; $++) {
        const K = nt[$], vt = s.convert(K.format, K.colorSpace), lt = s.convert(K.type), gt = b(K.internalFormat, vt, lt, K.colorSpace), Tt = it(x);
        F && q(x) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, Tt, gt, x.width, x.height) : q(x) ? l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, Tt, gt, x.width, x.height) : i.renderbufferStorage(i.RENDERBUFFER, gt, x.width, x.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Dt(y, x) {
    if (x && x.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(i.FRAMEBUFFER, y), !(x.depthTexture && x.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    (!n.get(x.depthTexture).__webglTexture || x.depthTexture.image.width !== x.width || x.depthTexture.image.height !== x.height) && (x.depthTexture.image.width = x.width, x.depthTexture.image.height = x.height, x.depthTexture.needsUpdate = !0), H(x.depthTexture, 0);
    const nt = n.get(x.depthTexture).__webglTexture, $ = it(x);
    if (x.depthTexture.format === 1026)
      q(x) ? l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, nt, 0, $) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, nt, 0);
    else if (x.depthTexture.format === 1027)
      q(x) ? l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, nt, 0, $) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, nt, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function Mt(y) {
    const x = n.get(y), F = y.isWebGLCubeRenderTarget === !0;
    if (y.depthTexture && !x.__autoAllocateDepthBuffer) {
      if (F) throw new Error("target.depthTexture not supported in Cube render targets");
      Dt(x.__webglFramebuffer, y);
    } else if (F) {
      x.__webglDepthbuffer = [];
      for (let nt = 0; nt < 6; nt++)
        e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[nt]), x.__webglDepthbuffer[nt] = i.createRenderbuffer(), wt(x.__webglDepthbuffer[nt], y, !1);
    } else
      e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer), x.__webglDepthbuffer = i.createRenderbuffer(), wt(x.__webglDepthbuffer, y, !1);
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Pt(y, x, F) {
    const nt = n.get(y);
    x !== void 0 && mt(nt.__webglFramebuffer, y, y.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), F !== void 0 && Mt(y);
  }
  function C(y) {
    const x = y.texture, F = n.get(y), nt = n.get(x);
    y.addEventListener("dispose", O), y.isWebGLMultipleRenderTargets !== !0 && (nt.__webglTexture === void 0 && (nt.__webglTexture = i.createTexture()), nt.__version = x.version, o.memory.textures++);
    const $ = y.isWebGLCubeRenderTarget === !0, K = y.isWebGLMultipleRenderTargets === !0, vt = d(y) || a;
    if ($) {
      F.__webglFramebuffer = [];
      for (let lt = 0; lt < 6; lt++)
        if (a && x.mipmaps && x.mipmaps.length > 0) {
          F.__webglFramebuffer[lt] = [];
          for (let gt = 0; gt < x.mipmaps.length; gt++)
            F.__webglFramebuffer[lt][gt] = i.createFramebuffer();
        } else
          F.__webglFramebuffer[lt] = i.createFramebuffer();
    } else {
      if (a && x.mipmaps && x.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let lt = 0; lt < x.mipmaps.length; lt++)
          F.__webglFramebuffer[lt] = i.createFramebuffer();
      } else
        F.__webglFramebuffer = i.createFramebuffer();
      if (K)
        if (r.drawBuffers) {
          const lt = y.texture;
          for (let gt = 0, Tt = lt.length; gt < Tt; gt++) {
            const It = n.get(lt[gt]);
            It.__webglTexture === void 0 && (It.__webglTexture = i.createTexture(), o.memory.textures++);
          }
        } else
          console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");
      if (a && y.samples > 0 && q(y) === !1) {
        const lt = K ? x : [x];
        F.__webglMultisampledFramebuffer = i.createFramebuffer(), F.__webglColorRenderbuffer = [], e.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer);
        for (let gt = 0; gt < lt.length; gt++) {
          const Tt = lt[gt];
          F.__webglColorRenderbuffer[gt] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[gt]);
          const It = s.convert(Tt.format, Tt.colorSpace), Q = s.convert(Tt.type), Wt = b(Tt.internalFormat, It, Q, Tt.colorSpace, y.isXRRenderTarget === !0), kt = it(y);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, kt, Wt, y.width, y.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + gt, i.RENDERBUFFER, F.__webglColorRenderbuffer[gt]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), y.depthBuffer && (F.__webglDepthRenderbuffer = i.createRenderbuffer(), wt(F.__webglDepthRenderbuffer, y, !0)), e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if ($) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, nt.__webglTexture), k(i.TEXTURE_CUBE_MAP, x, vt);
      for (let lt = 0; lt < 6; lt++)
        if (a && x.mipmaps && x.mipmaps.length > 0)
          for (let gt = 0; gt < x.mipmaps.length; gt++)
            mt(F.__webglFramebuffer[lt][gt], y, x, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + lt, gt);
        else
          mt(F.__webglFramebuffer[lt], y, x, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + lt, 0);
      T(x, vt) && v(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (K) {
      const lt = y.texture;
      for (let gt = 0, Tt = lt.length; gt < Tt; gt++) {
        const It = lt[gt], Q = n.get(It);
        e.bindTexture(i.TEXTURE_2D, Q.__webglTexture), k(i.TEXTURE_2D, It, vt), mt(F.__webglFramebuffer, y, It, i.COLOR_ATTACHMENT0 + gt, i.TEXTURE_2D, 0), T(It, vt) && v(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let lt = i.TEXTURE_2D;
      if ((y.isWebGL3DRenderTarget || y.isWebGLArrayRenderTarget) && (a ? lt = y.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY : console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")), e.bindTexture(lt, nt.__webglTexture), k(lt, x, vt), a && x.mipmaps && x.mipmaps.length > 0)
        for (let gt = 0; gt < x.mipmaps.length; gt++)
          mt(F.__webglFramebuffer[gt], y, x, i.COLOR_ATTACHMENT0, lt, gt);
      else
        mt(F.__webglFramebuffer, y, x, i.COLOR_ATTACHMENT0, lt, 0);
      T(x, vt) && v(lt), e.unbindTexture();
    }
    y.depthBuffer && Mt(y);
  }
  function st(y) {
    const x = d(y) || a, F = y.isWebGLMultipleRenderTargets === !0 ? y.texture : [y.texture];
    for (let nt = 0, $ = F.length; nt < $; nt++) {
      const K = F[nt];
      if (T(K, x)) {
        const vt = y.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : i.TEXTURE_2D, lt = n.get(K).__webglTexture;
        e.bindTexture(vt, lt), v(vt), e.unbindTexture();
      }
    }
  }
  function Z(y) {
    if (a && y.samples > 0 && q(y) === !1) {
      const x = y.isWebGLMultipleRenderTargets ? y.texture : [y.texture], F = y.width, nt = y.height;
      let $ = i.COLOR_BUFFER_BIT;
      const K = [], vt = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, lt = n.get(y), gt = y.isWebGLMultipleRenderTargets === !0;
      if (gt)
        for (let Tt = 0; Tt < x.length; Tt++)
          e.bindFramebuffer(i.FRAMEBUFFER, lt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.RENDERBUFFER, null), e.bindFramebuffer(i.FRAMEBUFFER, lt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.TEXTURE_2D, null, 0);
      e.bindFramebuffer(i.READ_FRAMEBUFFER, lt.__webglMultisampledFramebuffer), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, lt.__webglFramebuffer);
      for (let Tt = 0; Tt < x.length; Tt++) {
        K.push(i.COLOR_ATTACHMENT0 + Tt), y.depthBuffer && K.push(vt);
        const It = lt.__ignoreDepthValues !== void 0 ? lt.__ignoreDepthValues : !1;
        if (It === !1 && (y.depthBuffer && ($ |= i.DEPTH_BUFFER_BIT), y.stencilBuffer && ($ |= i.STENCIL_BUFFER_BIT)), gt && i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, lt.__webglColorRenderbuffer[Tt]), It === !0 && (i.invalidateFramebuffer(i.READ_FRAMEBUFFER, [vt]), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [vt])), gt) {
          const Q = n.get(x[Tt]).__webglTexture;
          i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, Q, 0);
        }
        i.blitFramebuffer(0, 0, F, nt, 0, 0, F, nt, $, i.NEAREST), c && i.invalidateFramebuffer(i.READ_FRAMEBUFFER, K);
      }
      if (e.bindFramebuffer(i.READ_FRAMEBUFFER, null), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), gt)
        for (let Tt = 0; Tt < x.length; Tt++) {
          e.bindFramebuffer(i.FRAMEBUFFER, lt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.RENDERBUFFER, lt.__webglColorRenderbuffer[Tt]);
          const It = n.get(x[Tt]).__webglTexture;
          e.bindFramebuffer(i.FRAMEBUFFER, lt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.TEXTURE_2D, It, 0);
        }
      e.bindFramebuffer(i.DRAW_FRAMEBUFFER, lt.__webglMultisampledFramebuffer);
    }
  }
  function it(y) {
    return Math.min(r.maxSamples, y.samples);
  }
  function q(y) {
    const x = n.get(y);
    return a && y.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && x.__useRenderToTexture !== !1;
  }
  function yt(y) {
    const x = o.render.frame;
    h.get(y) !== x && (h.set(y, x), y.update());
  }
  function dt(y, x) {
    const F = y.colorSpace, nt = y.format, $ = y.type;
    return y.isCompressedTexture === !0 || y.isVideoTexture === !0 || y.format === 1035 || F !== $e && F !== Fe && (qt.getTransfer(F) === $t ? a === !1 ? t.has("EXT_sRGB") === !0 && nt === 1023 ? (y.format = 1035, y.minFilter = 1006, y.generateMipmaps = !1) : x = Ia.sRGBToLinear(x) : (nt !== 1023 || $ !== 1009) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", F)), x;
  }
  this.allocateTextureUnit = P, this.resetTextureUnits = Y, this.setTexture2D = H, this.setTexture2DArray = J, this.setTexture3D = X, this.setTextureCube = W, this.rebindTextures = Pt, this.setupRenderTarget = C, this.updateRenderTargetMipmap = st, this.updateMultisampleRenderTarget = Z, this.setupDepthRenderbuffer = Mt, this.setupFrameBufferTexture = mt, this.useMultisampledRTT = q;
}
function vf(i, t, e) {
  const n = e.isWebGL2;
  function r(s, o = Fe) {
    let a;
    const l = qt.getTransfer(o);
    if (s === 1009) return i.UNSIGNED_BYTE;
    if (s === 1017) return i.UNSIGNED_SHORT_4_4_4_4;
    if (s === 1018) return i.UNSIGNED_SHORT_5_5_5_1;
    if (s === 1010) return i.BYTE;
    if (s === 1011) return i.SHORT;
    if (s === 1012) return i.UNSIGNED_SHORT;
    if (s === 1013) return i.INT;
    if (s === 1014) return i.UNSIGNED_INT;
    if (s === 1015) return i.FLOAT;
    if (s === 1016)
      return n ? i.HALF_FLOAT : (a = t.get("OES_texture_half_float"), a !== null ? a.HALF_FLOAT_OES : null);
    if (s === 1021) return i.ALPHA;
    if (s === 1023) return i.RGBA;
    if (s === 1024) return i.LUMINANCE;
    if (s === 1025) return i.LUMINANCE_ALPHA;
    if (s === 1026) return i.DEPTH_COMPONENT;
    if (s === 1027) return i.DEPTH_STENCIL;
    if (s === 1035)
      return a = t.get("EXT_sRGB"), a !== null ? a.SRGB_ALPHA_EXT : null;
    if (s === 1028) return i.RED;
    if (s === 1029) return i.RED_INTEGER;
    if (s === 1030) return i.RG;
    if (s === 1031) return i.RG_INTEGER;
    if (s === 1033) return i.RGBA_INTEGER;
    if (s === 33776 || s === 33777 || s === 33778 || s === 33779)
      if (l === $t)
        if (a = t.get("WEBGL_compressed_texture_s3tc_srgb"), a !== null) {
          if (s === 33776) return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (s === 33777) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (s === 33778) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (s === 33779) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (a = t.get("WEBGL_compressed_texture_s3tc"), a !== null) {
        if (s === 33776) return a.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (s === 33777) return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (s === 33778) return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (s === 33779) return a.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (s === 35840 || s === 35841 || s === 35842 || s === 35843)
      if (a = t.get("WEBGL_compressed_texture_pvrtc"), a !== null) {
        if (s === 35840) return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (s === 35841) return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (s === 35842) return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (s === 35843) return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (s === 36196)
      return a = t.get("WEBGL_compressed_texture_etc1"), a !== null ? a.COMPRESSED_RGB_ETC1_WEBGL : null;
    if (s === 37492 || s === 37496)
      if (a = t.get("WEBGL_compressed_texture_etc"), a !== null) {
        if (s === 37492) return l === $t ? a.COMPRESSED_SRGB8_ETC2 : a.COMPRESSED_RGB8_ETC2;
        if (s === 37496) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : a.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (s === 37808 || s === 37809 || s === 37810 || s === 37811 || s === 37812 || s === 37813 || s === 37814 || s === 37815 || s === 37816 || s === 37817 || s === 37818 || s === 37819 || s === 37820 || s === 37821)
      if (a = t.get("WEBGL_compressed_texture_astc"), a !== null) {
        if (s === 37808) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : a.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (s === 37809) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : a.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (s === 37810) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : a.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (s === 37811) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : a.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (s === 37812) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : a.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (s === 37813) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : a.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (s === 37814) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : a.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (s === 37815) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : a.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (s === 37816) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : a.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (s === 37817) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : a.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (s === 37818) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : a.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (s === 37819) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : a.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (s === 37820) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : a.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (s === 37821) return l === $t ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : a.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (s === 36492 || s === 36494 || s === 36495)
      if (a = t.get("EXT_texture_compression_bptc"), a !== null) {
        if (s === 36492) return l === $t ? a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : a.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (s === 36494) return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (s === 36495) return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (s === 36283 || s === 36284 || s === 36285 || s === 36286)
      if (a = t.get("EXT_texture_compression_rgtc"), a !== null) {
        if (s === 36492) return a.COMPRESSED_RED_RGTC1_EXT;
        if (s === 36284) return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (s === 36285) return a.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (s === 36286) return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return s === 1020 ? n ? i.UNSIGNED_INT_24_8 : (a = t.get("WEBGL_depth_texture"), a !== null ? a.UNSIGNED_INT_24_8_WEBGL : null) : i[s] !== void 0 ? i[s] : null;
  }
  return { convert: r };
}
class xf extends De {
  constructor(t = []) {
    super(), this.isArrayCamera = !0, this.cameras = t;
  }
}
class sn extends ue {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const Mf = { type: "move" };
class Br {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new sn(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new sn(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new L(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new L()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new sn(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new L(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new L()), this._grip;
  }
  dispatchEvent(t) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e)
        for (const n of t.hand.values())
          this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  disconnect(t) {
    return this.dispatchEvent({ type: "disconnected", data: t }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(t, e, n) {
    let r = null, s = null, o = null;
    const a = this._targetRay, l = this._grip, c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        o = !0;
        for (const _ of t.hand.values()) {
          const d = e.getJointPose(_, n), u = this._getHandJoint(c, _);
          d !== null && (u.matrix.fromArray(d.transform.matrix), u.matrix.decompose(u.position, u.rotation, u.scale), u.matrixWorldNeedsUpdate = !0, u.jointRadius = d.radius), u.visible = d !== null;
        }
        const h = c.joints["index-finger-tip"], f = c.joints["thumb-tip"], p = h.position.distanceTo(f.position), m = 0.02, g = 5e-3;
        c.inputState.pinching && p > m + g ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: t.handedness,
          target: this
        })) : !c.inputState.pinching && p <= m - g && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: t.handedness,
          target: this
        }));
      } else
        l !== null && t.gripSpace && (s = e.getPose(t.gripSpace, n), s !== null && (l.matrix.fromArray(s.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(s.linearVelocity)) : l.hasLinearVelocity = !1, s.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(s.angularVelocity)) : l.hasAngularVelocity = !1));
      a !== null && (r = e.getPose(t.targetRaySpace, n), r === null && s !== null && (r = s), r !== null && (a.matrix.fromArray(r.transform.matrix), a.matrix.decompose(a.position, a.rotation, a.scale), a.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (a.hasLinearVelocity = !0, a.linearVelocity.copy(r.linearVelocity)) : a.hasLinearVelocity = !1, r.angularVelocity ? (a.hasAngularVelocity = !0, a.angularVelocity.copy(r.angularVelocity)) : a.hasAngularVelocity = !1, this.dispatchEvent(Mf)));
    }
    return a !== null && (a.visible = r !== null), l !== null && (l.visible = s !== null), c !== null && (c.visible = o !== null), this;
  }
  // private method
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new sn();
      n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
class Sf extends qn {
  constructor(t, e) {
    super();
    const n = this;
    let r = null, s = 1, o = null, a = "local-floor", l = 1, c = null, h = null, f = null, p = null, m = null, g = null;
    const _ = e.getContextAttributes();
    let d = null, u = null;
    const T = [], v = [], b = new rt();
    let R = null;
    const A = new De();
    A.layers.enable(1), A.viewport = new Qt();
    const w = new De();
    w.layers.enable(2), w.viewport = new Qt();
    const O = [A, w], M = new xf();
    M.layers.enable(1), M.layers.enable(2);
    let S = null, U = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(k) {
      let j = T[k];
      return j === void 0 && (j = new Br(), T[k] = j), j.getTargetRaySpace();
    }, this.getControllerGrip = function(k) {
      let j = T[k];
      return j === void 0 && (j = new Br(), T[k] = j), j.getGripSpace();
    }, this.getHand = function(k) {
      let j = T[k];
      return j === void 0 && (j = new Br(), T[k] = j), j.getHandSpace();
    };
    function N(k) {
      const j = v.indexOf(k.inputSource);
      if (j === -1)
        return;
      const ft = T[j];
      ft !== void 0 && (ft.update(k.inputSource, k.frame, c || o), ft.dispatchEvent({ type: k.type, data: k.inputSource }));
    }
    function Y() {
      r.removeEventListener("select", N), r.removeEventListener("selectstart", N), r.removeEventListener("selectend", N), r.removeEventListener("squeeze", N), r.removeEventListener("squeezestart", N), r.removeEventListener("squeezeend", N), r.removeEventListener("end", Y), r.removeEventListener("inputsourceschange", P);
      for (let k = 0; k < T.length; k++) {
        const j = v[k];
        j !== null && (v[k] = null, T[k].disconnect(j));
      }
      S = null, U = null, t.setRenderTarget(d), m = null, p = null, f = null, r = null, u = null, ut.stop(), n.isPresenting = !1, t.setPixelRatio(R), t.setSize(b.width, b.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(k) {
      s = k, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(k) {
      a = k, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || o;
    }, this.setReferenceSpace = function(k) {
      c = k;
    }, this.getBaseLayer = function() {
      return p !== null ? p : m;
    }, this.getBinding = function() {
      return f;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return r;
    }, this.setSession = async function(k) {
      if (r = k, r !== null) {
        if (d = t.getRenderTarget(), r.addEventListener("select", N), r.addEventListener("selectstart", N), r.addEventListener("selectend", N), r.addEventListener("squeeze", N), r.addEventListener("squeezestart", N), r.addEventListener("squeezeend", N), r.addEventListener("end", Y), r.addEventListener("inputsourceschange", P), _.xrCompatible !== !0 && await e.makeXRCompatible(), R = t.getPixelRatio(), t.getSize(b), r.renderState.layers === void 0 || t.capabilities.isWebGL2 === !1) {
          const j = {
            antialias: r.renderState.layers === void 0 ? _.antialias : !0,
            alpha: !0,
            depth: _.depth,
            stencil: _.stencil,
            framebufferScaleFactor: s
          };
          m = new XRWebGLLayer(r, e, j), r.updateRenderState({ baseLayer: m }), t.setPixelRatio(1), t.setSize(m.framebufferWidth, m.framebufferHeight, !1), u = new on(
            m.framebufferWidth,
            m.framebufferHeight,
            {
              format: 1023,
              type: 1009,
              colorSpace: t.outputColorSpace,
              stencilBuffer: _.stencil
            }
          );
        } else {
          let j = null, ft = null, xt = null;
          _.depth && (xt = _.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, j = _.stencil ? 1027 : 1026, ft = _.stencil ? 1020 : 1014);
          const mt = {
            colorFormat: e.RGBA8,
            depthFormat: xt,
            scaleFactor: s
          };
          f = new XRWebGLBinding(r, e), p = f.createProjectionLayer(mt), r.updateRenderState({ layers: [p] }), t.setPixelRatio(1), t.setSize(p.textureWidth, p.textureHeight, !1), u = new on(
            p.textureWidth,
            p.textureHeight,
            {
              format: 1023,
              type: 1009,
              depthTexture: new Xa(p.textureWidth, p.textureHeight, ft, void 0, void 0, void 0, void 0, void 0, void 0, j),
              stencilBuffer: _.stencil,
              colorSpace: t.outputColorSpace,
              samples: _.antialias ? 4 : 0
            }
          );
          const wt = t.properties.get(u);
          wt.__ignoreDepthValues = p.ignoreDepthValues;
        }
        u.isXRRenderTarget = !0, this.setFoveation(l), c = null, o = await r.requestReferenceSpace(a), ut.setContext(r), ut.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (r !== null)
        return r.environmentBlendMode;
    };
    function P(k) {
      for (let j = 0; j < k.removed.length; j++) {
        const ft = k.removed[j], xt = v.indexOf(ft);
        xt >= 0 && (v[xt] = null, T[xt].disconnect(ft));
      }
      for (let j = 0; j < k.added.length; j++) {
        const ft = k.added[j];
        let xt = v.indexOf(ft);
        if (xt === -1) {
          for (let wt = 0; wt < T.length; wt++)
            if (wt >= v.length) {
              v.push(ft), xt = wt;
              break;
            } else if (v[wt] === null) {
              v[wt] = ft, xt = wt;
              break;
            }
          if (xt === -1) break;
        }
        const mt = T[xt];
        mt && mt.connect(ft);
      }
    }
    const B = new L(), H = new L();
    function J(k, j, ft) {
      B.setFromMatrixPosition(j.matrixWorld), H.setFromMatrixPosition(ft.matrixWorld);
      const xt = B.distanceTo(H), mt = j.projectionMatrix.elements, wt = ft.projectionMatrix.elements, Dt = mt[14] / (mt[10] - 1), Mt = mt[14] / (mt[10] + 1), Pt = (mt[9] + 1) / mt[5], C = (mt[9] - 1) / mt[5], st = (mt[8] - 1) / mt[0], Z = (wt[8] + 1) / wt[0], it = Dt * st, q = Dt * Z, yt = xt / (-st + Z), dt = yt * -st;
      j.matrixWorld.decompose(k.position, k.quaternion, k.scale), k.translateX(dt), k.translateZ(yt), k.matrixWorld.compose(k.position, k.quaternion, k.scale), k.matrixWorldInverse.copy(k.matrixWorld).invert();
      const y = Dt + yt, x = Mt + yt, F = it - dt, nt = q + (xt - dt), $ = Pt * Mt / x * y, K = C * Mt / x * y;
      k.projectionMatrix.makePerspective(F, nt, $, K, y, x), k.projectionMatrixInverse.copy(k.projectionMatrix).invert();
    }
    function X(k, j) {
      j === null ? k.matrixWorld.copy(k.matrix) : k.matrixWorld.multiplyMatrices(j.matrixWorld, k.matrix), k.matrixWorldInverse.copy(k.matrixWorld).invert();
    }
    this.updateCamera = function(k) {
      if (r === null) return;
      M.near = w.near = A.near = k.near, M.far = w.far = A.far = k.far, (S !== M.near || U !== M.far) && (r.updateRenderState({
        depthNear: M.near,
        depthFar: M.far
      }), S = M.near, U = M.far);
      const j = k.parent, ft = M.cameras;
      X(M, j);
      for (let xt = 0; xt < ft.length; xt++)
        X(ft[xt], j);
      ft.length === 2 ? J(M, A, w) : M.projectionMatrix.copy(A.projectionMatrix), W(k, M, j);
    };
    function W(k, j, ft) {
      ft === null ? k.matrix.copy(j.matrixWorld) : (k.matrix.copy(ft.matrixWorld), k.matrix.invert(), k.matrix.multiply(j.matrixWorld)), k.matrix.decompose(k.position, k.quaternion, k.scale), k.updateMatrixWorld(!0), k.projectionMatrix.copy(j.projectionMatrix), k.projectionMatrixInverse.copy(j.projectionMatrixInverse), k.isPerspectiveCamera && (k.fov = Zr * 2 * Math.atan(1 / k.projectionMatrix.elements[5]), k.zoom = 1);
    }
    this.getCamera = function() {
      return M;
    }, this.getFoveation = function() {
      if (!(p === null && m === null))
        return l;
    }, this.setFoveation = function(k) {
      l = k, p !== null && (p.fixedFoveation = k), m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = k);
    };
    let tt = null;
    function et(k, j) {
      if (h = j.getViewerPose(c || o), g = j, h !== null) {
        const ft = h.views;
        m !== null && (t.setRenderTargetFramebuffer(u, m.framebuffer), t.setRenderTarget(u));
        let xt = !1;
        ft.length !== M.cameras.length && (M.cameras.length = 0, xt = !0);
        for (let mt = 0; mt < ft.length; mt++) {
          const wt = ft[mt];
          let Dt = null;
          if (m !== null)
            Dt = m.getViewport(wt);
          else {
            const Pt = f.getViewSubImage(p, wt);
            Dt = Pt.viewport, mt === 0 && (t.setRenderTargetTextures(
              u,
              Pt.colorTexture,
              p.ignoreDepthValues ? void 0 : Pt.depthStencilTexture
            ), t.setRenderTarget(u));
          }
          let Mt = O[mt];
          Mt === void 0 && (Mt = new De(), Mt.layers.enable(mt), Mt.viewport = new Qt(), O[mt] = Mt), Mt.matrix.fromArray(wt.transform.matrix), Mt.matrix.decompose(Mt.position, Mt.quaternion, Mt.scale), Mt.projectionMatrix.fromArray(wt.projectionMatrix), Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(), Mt.viewport.set(Dt.x, Dt.y, Dt.width, Dt.height), mt === 0 && (M.matrix.copy(Mt.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), xt === !0 && M.cameras.push(Mt);
        }
      }
      for (let ft = 0; ft < T.length; ft++) {
        const xt = v[ft], mt = T[ft];
        xt !== null && mt !== void 0 && mt.update(xt, j, c || o);
      }
      tt && tt(k, j), j.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: j }), g = null;
    }
    const ut = new Wa();
    ut.setAnimationLoop(et), this.setAnimationLoop = function(k) {
      tt = k;
    }, this.dispose = function() {
    };
  }
}
function yf(i, t) {
  function e(d, u) {
    d.matrixAutoUpdate === !0 && d.updateMatrix(), u.value.copy(d.matrix);
  }
  function n(d, u) {
    u.color.getRGB(d.fogColor.value, Ga(i)), u.isFog ? (d.fogNear.value = u.near, d.fogFar.value = u.far) : u.isFogExp2 && (d.fogDensity.value = u.density);
  }
  function r(d, u, T, v, b) {
    u.isMeshBasicMaterial || u.isMeshLambertMaterial ? s(d, u) : u.isMeshToonMaterial ? (s(d, u), f(d, u)) : u.isMeshPhongMaterial ? (s(d, u), h(d, u)) : u.isMeshStandardMaterial ? (s(d, u), p(d, u), u.isMeshPhysicalMaterial && m(d, u, b)) : u.isMeshMatcapMaterial ? (s(d, u), g(d, u)) : u.isMeshDepthMaterial ? s(d, u) : u.isMeshDistanceMaterial ? (s(d, u), _(d, u)) : u.isMeshNormalMaterial ? s(d, u) : u.isLineBasicMaterial ? (o(d, u), u.isLineDashedMaterial && a(d, u)) : u.isPointsMaterial ? l(d, u, T, v) : u.isSpriteMaterial ? c(d, u) : u.isShadowMaterial ? (d.color.value.copy(u.color), d.opacity.value = u.opacity) : u.isShaderMaterial && (u.uniformsNeedUpdate = !1);
  }
  function s(d, u) {
    d.opacity.value = u.opacity, u.color && d.diffuse.value.copy(u.color), u.emissive && d.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity), u.map && (d.map.value = u.map, e(u.map, d.mapTransform)), u.alphaMap && (d.alphaMap.value = u.alphaMap, e(u.alphaMap, d.alphaMapTransform)), u.bumpMap && (d.bumpMap.value = u.bumpMap, e(u.bumpMap, d.bumpMapTransform), d.bumpScale.value = u.bumpScale, u.side === 1 && (d.bumpScale.value *= -1)), u.normalMap && (d.normalMap.value = u.normalMap, e(u.normalMap, d.normalMapTransform), d.normalScale.value.copy(u.normalScale), u.side === 1 && d.normalScale.value.negate()), u.displacementMap && (d.displacementMap.value = u.displacementMap, e(u.displacementMap, d.displacementMapTransform), d.displacementScale.value = u.displacementScale, d.displacementBias.value = u.displacementBias), u.emissiveMap && (d.emissiveMap.value = u.emissiveMap, e(u.emissiveMap, d.emissiveMapTransform)), u.specularMap && (d.specularMap.value = u.specularMap, e(u.specularMap, d.specularMapTransform)), u.alphaTest > 0 && (d.alphaTest.value = u.alphaTest);
    const T = t.get(u).envMap;
    if (T && (d.envMap.value = T, d.flipEnvMap.value = T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1, d.reflectivity.value = u.reflectivity, d.ior.value = u.ior, d.refractionRatio.value = u.refractionRatio), u.lightMap) {
      d.lightMap.value = u.lightMap;
      const v = i._useLegacyLights === !0 ? Math.PI : 1;
      d.lightMapIntensity.value = u.lightMapIntensity * v, e(u.lightMap, d.lightMapTransform);
    }
    u.aoMap && (d.aoMap.value = u.aoMap, d.aoMapIntensity.value = u.aoMapIntensity, e(u.aoMap, d.aoMapTransform));
  }
  function o(d, u) {
    d.diffuse.value.copy(u.color), d.opacity.value = u.opacity, u.map && (d.map.value = u.map, e(u.map, d.mapTransform));
  }
  function a(d, u) {
    d.dashSize.value = u.dashSize, d.totalSize.value = u.dashSize + u.gapSize, d.scale.value = u.scale;
  }
  function l(d, u, T, v) {
    d.diffuse.value.copy(u.color), d.opacity.value = u.opacity, d.size.value = u.size * T, d.scale.value = v * 0.5, u.map && (d.map.value = u.map, e(u.map, d.uvTransform)), u.alphaMap && (d.alphaMap.value = u.alphaMap, e(u.alphaMap, d.alphaMapTransform)), u.alphaTest > 0 && (d.alphaTest.value = u.alphaTest);
  }
  function c(d, u) {
    d.diffuse.value.copy(u.color), d.opacity.value = u.opacity, d.rotation.value = u.rotation, u.map && (d.map.value = u.map, e(u.map, d.mapTransform)), u.alphaMap && (d.alphaMap.value = u.alphaMap, e(u.alphaMap, d.alphaMapTransform)), u.alphaTest > 0 && (d.alphaTest.value = u.alphaTest);
  }
  function h(d, u) {
    d.specular.value.copy(u.specular), d.shininess.value = Math.max(u.shininess, 1e-4);
  }
  function f(d, u) {
    u.gradientMap && (d.gradientMap.value = u.gradientMap);
  }
  function p(d, u) {
    d.metalness.value = u.metalness, u.metalnessMap && (d.metalnessMap.value = u.metalnessMap, e(u.metalnessMap, d.metalnessMapTransform)), d.roughness.value = u.roughness, u.roughnessMap && (d.roughnessMap.value = u.roughnessMap, e(u.roughnessMap, d.roughnessMapTransform)), t.get(u).envMap && (d.envMapIntensity.value = u.envMapIntensity);
  }
  function m(d, u, T) {
    d.ior.value = u.ior, u.sheen > 0 && (d.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen), d.sheenRoughness.value = u.sheenRoughness, u.sheenColorMap && (d.sheenColorMap.value = u.sheenColorMap, e(u.sheenColorMap, d.sheenColorMapTransform)), u.sheenRoughnessMap && (d.sheenRoughnessMap.value = u.sheenRoughnessMap, e(u.sheenRoughnessMap, d.sheenRoughnessMapTransform))), u.clearcoat > 0 && (d.clearcoat.value = u.clearcoat, d.clearcoatRoughness.value = u.clearcoatRoughness, u.clearcoatMap && (d.clearcoatMap.value = u.clearcoatMap, e(u.clearcoatMap, d.clearcoatMapTransform)), u.clearcoatRoughnessMap && (d.clearcoatRoughnessMap.value = u.clearcoatRoughnessMap, e(u.clearcoatRoughnessMap, d.clearcoatRoughnessMapTransform)), u.clearcoatNormalMap && (d.clearcoatNormalMap.value = u.clearcoatNormalMap, e(u.clearcoatNormalMap, d.clearcoatNormalMapTransform), d.clearcoatNormalScale.value.copy(u.clearcoatNormalScale), u.side === 1 && d.clearcoatNormalScale.value.negate())), u.iridescence > 0 && (d.iridescence.value = u.iridescence, d.iridescenceIOR.value = u.iridescenceIOR, d.iridescenceThicknessMinimum.value = u.iridescenceThicknessRange[0], d.iridescenceThicknessMaximum.value = u.iridescenceThicknessRange[1], u.iridescenceMap && (d.iridescenceMap.value = u.iridescenceMap, e(u.iridescenceMap, d.iridescenceMapTransform)), u.iridescenceThicknessMap && (d.iridescenceThicknessMap.value = u.iridescenceThicknessMap, e(u.iridescenceThicknessMap, d.iridescenceThicknessMapTransform))), u.transmission > 0 && (d.transmission.value = u.transmission, d.transmissionSamplerMap.value = T.texture, d.transmissionSamplerSize.value.set(T.width, T.height), u.transmissionMap && (d.transmissionMap.value = u.transmissionMap, e(u.transmissionMap, d.transmissionMapTransform)), d.thickness.value = u.thickness, u.thicknessMap && (d.thicknessMap.value = u.thicknessMap, e(u.thicknessMap, d.thicknessMapTransform)), d.attenuationDistance.value = u.attenuationDistance, d.attenuationColor.value.copy(u.attenuationColor)), u.anisotropy > 0 && (d.anisotropyVector.value.set(u.anisotropy * Math.cos(u.anisotropyRotation), u.anisotropy * Math.sin(u.anisotropyRotation)), u.anisotropyMap && (d.anisotropyMap.value = u.anisotropyMap, e(u.anisotropyMap, d.anisotropyMapTransform))), d.specularIntensity.value = u.specularIntensity, d.specularColor.value.copy(u.specularColor), u.specularColorMap && (d.specularColorMap.value = u.specularColorMap, e(u.specularColorMap, d.specularColorMapTransform)), u.specularIntensityMap && (d.specularIntensityMap.value = u.specularIntensityMap, e(u.specularIntensityMap, d.specularIntensityMapTransform));
  }
  function g(d, u) {
    u.matcap && (d.matcap.value = u.matcap);
  }
  function _(d, u) {
    const T = t.get(u).light;
    d.referencePosition.value.setFromMatrixPosition(T.matrixWorld), d.nearDistance.value = T.shadow.camera.near, d.farDistance.value = T.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: r
  };
}
function Ef(i, t, e, n) {
  let r = {}, s = {}, o = [];
  const a = e.isWebGL2 ? i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS) : 0;
  function l(T, v) {
    const b = v.program;
    n.uniformBlockBinding(T, b);
  }
  function c(T, v) {
    let b = r[T.id];
    b === void 0 && (g(T), b = h(T), r[T.id] = b, T.addEventListener("dispose", d));
    const R = v.program;
    n.updateUBOMapping(T, R);
    const A = t.render.frame;
    s[T.id] !== A && (p(T), s[T.id] = A);
  }
  function h(T) {
    const v = f();
    T.__bindingPointIndex = v;
    const b = i.createBuffer(), R = T.__size, A = T.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, b), i.bufferData(i.UNIFORM_BUFFER, R, A), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, v, b), b;
  }
  function f() {
    for (let T = 0; T < a; T++)
      if (o.indexOf(T) === -1)
        return o.push(T), T;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function p(T) {
    const v = r[T.id], b = T.uniforms, R = T.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, v);
    for (let A = 0, w = b.length; A < w; A++) {
      const O = Array.isArray(b[A]) ? b[A] : [b[A]];
      for (let M = 0, S = O.length; M < S; M++) {
        const U = O[M];
        if (m(U, A, M, R) === !0) {
          const N = U.__offset, Y = Array.isArray(U.value) ? U.value : [U.value];
          let P = 0;
          for (let B = 0; B < Y.length; B++) {
            const H = Y[B], J = _(H);
            typeof H == "number" || typeof H == "boolean" ? (U.__data[0] = H, i.bufferSubData(i.UNIFORM_BUFFER, N + P, U.__data)) : H.isMatrix3 ? (U.__data[0] = H.elements[0], U.__data[1] = H.elements[1], U.__data[2] = H.elements[2], U.__data[3] = 0, U.__data[4] = H.elements[3], U.__data[5] = H.elements[4], U.__data[6] = H.elements[5], U.__data[7] = 0, U.__data[8] = H.elements[6], U.__data[9] = H.elements[7], U.__data[10] = H.elements[8], U.__data[11] = 0) : (H.toArray(U.__data, P), P += J.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, N, U.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function m(T, v, b, R) {
    const A = T.value, w = v + "_" + b;
    if (R[w] === void 0)
      return typeof A == "number" || typeof A == "boolean" ? R[w] = A : R[w] = A.clone(), !0;
    {
      const O = R[w];
      if (typeof A == "number" || typeof A == "boolean") {
        if (O !== A)
          return R[w] = A, !0;
      } else if (O.equals(A) === !1)
        return O.copy(A), !0;
    }
    return !1;
  }
  function g(T) {
    const v = T.uniforms;
    let b = 0;
    const R = 16;
    for (let w = 0, O = v.length; w < O; w++) {
      const M = Array.isArray(v[w]) ? v[w] : [v[w]];
      for (let S = 0, U = M.length; S < U; S++) {
        const N = M[S], Y = Array.isArray(N.value) ? N.value : [N.value];
        for (let P = 0, B = Y.length; P < B; P++) {
          const H = Y[P], J = _(H), X = b % R;
          X !== 0 && R - X < J.boundary && (b += R - X), N.__data = new Float32Array(J.storage / Float32Array.BYTES_PER_ELEMENT), N.__offset = b, b += J.storage;
        }
      }
    }
    const A = b % R;
    return A > 0 && (b += R - A), T.__size = b, T.__cache = {}, this;
  }
  function _(T) {
    const v = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof T == "number" || typeof T == "boolean" ? (v.boundary = 4, v.storage = 4) : T.isVector2 ? (v.boundary = 8, v.storage = 8) : T.isVector3 || T.isColor ? (v.boundary = 16, v.storage = 12) : T.isVector4 ? (v.boundary = 16, v.storage = 16) : T.isMatrix3 ? (v.boundary = 48, v.storage = 48) : T.isMatrix4 ? (v.boundary = 64, v.storage = 64) : T.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", T), v;
  }
  function d(T) {
    const v = T.target;
    v.removeEventListener("dispose", d);
    const b = o.indexOf(v.__bindingPointIndex);
    o.splice(b, 1), i.deleteBuffer(r[v.id]), delete r[v.id], delete s[v.id];
  }
  function u() {
    for (const T in r)
      i.deleteBuffer(r[T]);
    o = [], r = {}, s = {};
  }
  return {
    bind: l,
    update: c,
    dispose: u
  };
}
class ja {
  constructor(t = {}) {
    const {
      canvas: e = xo(),
      context: n = null,
      depth: r = !0,
      stencil: s = !0,
      alpha: o = !1,
      antialias: a = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: f = !1
    } = t;
    this.isWebGLRenderer = !0;
    let p;
    n !== null ? p = n.getContextAttributes().alpha : p = o;
    const m = new Uint32Array(4), g = new Int32Array(4);
    let _ = null, d = null;
    const u = [], T = [];
    this.domElement = e, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = _e, this._useLegacyLights = !1, this.toneMapping = 0, this.toneMappingExposure = 1;
    const v = this;
    let b = !1, R = 0, A = 0, w = null, O = -1, M = null;
    const S = new Qt(), U = new Qt();
    let N = null;
    const Y = new Bt(0);
    let P = 0, B = e.width, H = e.height, J = 1, X = null, W = null;
    const tt = new Qt(0, 0, B, H), et = new Qt(0, 0, B, H);
    let ut = !1;
    const k = new cs();
    let j = !1, ft = !1, xt = null;
    const mt = new te(), wt = new rt(), Dt = new L(), Mt = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    function Pt() {
      return w === null ? J : 1;
    }
    let C = n;
    function st(E, I) {
      for (let G = 0; G < E.length; G++) {
        const V = E[G], z = e.getContext(V, I);
        if (z !== null) return z;
      }
      return null;
    }
    try {
      const E = {
        alpha: !0,
        depth: r,
        stencil: s,
        antialias: a,
        premultipliedAlpha: l,
        preserveDrawingBuffer: c,
        powerPreference: h,
        failIfMajorPerformanceCaveat: f
      };
      if ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${as}`), e.addEventListener("webglcontextlost", at, !1), e.addEventListener("webglcontextrestored", D, !1), e.addEventListener("webglcontextcreationerror", ct, !1), C === null) {
        const I = ["webgl2", "webgl", "experimental-webgl"];
        if (v.isWebGL1Renderer === !0 && I.shift(), C = st(I, E), C === null)
          throw st(I) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
      typeof WebGLRenderingContext < "u" && C instanceof WebGLRenderingContext && console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."), C.getShaderPrecisionFormat === void 0 && (C.getShaderPrecisionFormat = function() {
        return { rangeMin: 1, rangeMax: 1, precision: 1 };
      });
    } catch (E) {
      throw console.error("THREE.WebGLRenderer: " + E.message), E;
    }
    let Z, it, q, yt, dt, y, x, F, nt, $, K, vt, lt, gt, Tt, It, Q, Wt, kt, Lt, Et, _t, Ft, Xt;
    function re() {
      Z = new Dh(C), it = new Ah(C, Z, t), Z.init(it), _t = new vf(C, Z, it), q = new gf(C, Z, it), yt = new Nh(C), dt = new ef(), y = new _f(C, Z, q, dt, it, _t, yt), x = new Rh(v), F = new Lh(v), nt = new ko(C, it), Ft = new Th(C, Z, nt, it), $ = new Uh(C, nt, yt, Ft), K = new zh(C, $, nt, yt), kt = new Bh(C, it, y), It = new wh(dt), vt = new tf(v, x, F, Z, it, Ft, It), lt = new yf(v, dt), gt = new rf(), Tt = new hf(Z, it), Wt = new Eh(v, x, F, q, K, p, l), Q = new mf(v, K, it), Xt = new Ef(C, yt, it, q), Lt = new bh(C, Z, yt, it), Et = new Ih(C, Z, yt, it), yt.programs = vt.programs, v.capabilities = it, v.extensions = Z, v.properties = dt, v.renderLists = gt, v.shadowMap = Q, v.state = q, v.info = yt;
    }
    re();
    const Gt = new Sf(v, C);
    this.xr = Gt, this.getContext = function() {
      return C;
    }, this.getContextAttributes = function() {
      return C.getContextAttributes();
    }, this.forceContextLoss = function() {
      const E = Z.get("WEBGL_lose_context");
      E && E.loseContext();
    }, this.forceContextRestore = function() {
      const E = Z.get("WEBGL_lose_context");
      E && E.restoreContext();
    }, this.getPixelRatio = function() {
      return J;
    }, this.setPixelRatio = function(E) {
      E !== void 0 && (J = E, this.setSize(B, H, !1));
    }, this.getSize = function(E) {
      return E.set(B, H);
    }, this.setSize = function(E, I, G = !0) {
      if (Gt.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      B = E, H = I, e.width = Math.floor(E * J), e.height = Math.floor(I * J), G === !0 && (e.style.width = E + "px", e.style.height = I + "px"), this.setViewport(0, 0, E, I);
    }, this.getDrawingBufferSize = function(E) {
      return E.set(B * J, H * J).floor();
    }, this.setDrawingBufferSize = function(E, I, G) {
      B = E, H = I, J = G, e.width = Math.floor(E * G), e.height = Math.floor(I * G), this.setViewport(0, 0, E, I);
    }, this.getCurrentViewport = function(E) {
      return E.copy(S);
    }, this.getViewport = function(E) {
      return E.copy(tt);
    }, this.setViewport = function(E, I, G, V) {
      E.isVector4 ? tt.set(E.x, E.y, E.z, E.w) : tt.set(E, I, G, V), q.viewport(S.copy(tt).multiplyScalar(J).floor());
    }, this.getScissor = function(E) {
      return E.copy(et);
    }, this.setScissor = function(E, I, G, V) {
      E.isVector4 ? et.set(E.x, E.y, E.z, E.w) : et.set(E, I, G, V), q.scissor(U.copy(et).multiplyScalar(J).floor());
    }, this.getScissorTest = function() {
      return ut;
    }, this.setScissorTest = function(E) {
      q.setScissorTest(ut = E);
    }, this.setOpaqueSort = function(E) {
      X = E;
    }, this.setTransparentSort = function(E) {
      W = E;
    }, this.getClearColor = function(E) {
      return E.copy(Wt.getClearColor());
    }, this.setClearColor = function() {
      Wt.setClearColor.apply(Wt, arguments);
    }, this.getClearAlpha = function() {
      return Wt.getClearAlpha();
    }, this.setClearAlpha = function() {
      Wt.setClearAlpha.apply(Wt, arguments);
    }, this.clear = function(E = !0, I = !0, G = !0) {
      let V = 0;
      if (E) {
        let z = !1;
        if (w !== null) {
          const pt = w.texture.format;
          z = pt === 1033 || pt === 1031 || pt === 1029;
        }
        if (z) {
          const pt = w.texture.type, St = pt === 1009 || pt === 1014 || pt === 1012 || pt === 1020 || pt === 1017 || pt === 1018, At = Wt.getClearColor(), Ct = Wt.getClearAlpha(), zt = At.r, Ut = At.g, Nt = At.b;
          St ? (m[0] = zt, m[1] = Ut, m[2] = Nt, m[3] = Ct, C.clearBufferuiv(C.COLOR, 0, m)) : (g[0] = zt, g[1] = Ut, g[2] = Nt, g[3] = Ct, C.clearBufferiv(C.COLOR, 0, g));
        } else
          V |= C.COLOR_BUFFER_BIT;
      }
      I && (V |= C.DEPTH_BUFFER_BIT), G && (V |= C.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), C.clear(V);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", at, !1), e.removeEventListener("webglcontextrestored", D, !1), e.removeEventListener("webglcontextcreationerror", ct, !1), gt.dispose(), Tt.dispose(), dt.dispose(), x.dispose(), F.dispose(), K.dispose(), Ft.dispose(), Xt.dispose(), vt.dispose(), Gt.dispose(), Gt.removeEventListener("sessionstart", Ee), Gt.removeEventListener("sessionend", Kt), xt && (xt.dispose(), xt = null), Te.stop();
    };
    function at(E) {
      E.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), b = !0;
    }
    function D() {
      console.log("THREE.WebGLRenderer: Context Restored."), b = !1;
      const E = yt.autoReset, I = Q.enabled, G = Q.autoUpdate, V = Q.needsUpdate, z = Q.type;
      re(), yt.autoReset = E, Q.enabled = I, Q.autoUpdate = G, Q.needsUpdate = V, Q.type = z;
    }
    function ct(E) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", E.statusMessage);
    }
    function ht(E) {
      const I = E.target;
      I.removeEventListener("dispose", ht), Rt(I);
    }
    function Rt(E) {
      bt(E), dt.remove(E);
    }
    function bt(E) {
      const I = dt.get(E).programs;
      I !== void 0 && (I.forEach(function(G) {
        vt.releaseProgram(G);
      }), E.isShaderMaterial && vt.releaseShaderCache(E));
    }
    this.renderBufferDirect = function(E, I, G, V, z, pt) {
      I === null && (I = Mt);
      const St = z.isMesh && z.matrixWorld.determinant() < 0, At = po(E, I, G, V, z);
      q.setMaterial(V, St);
      let Ct = G.index, zt = 1;
      if (V.wireframe === !0) {
        if (Ct = $.getWireframeAttribute(G), Ct === void 0) return;
        zt = 2;
      }
      const Ut = G.drawRange, Nt = G.attributes.position;
      let oe = Ut.start * zt, Ce = (Ut.start + Ut.count) * zt;
      pt !== null && (oe = Math.max(oe, pt.start * zt), Ce = Math.min(Ce, (pt.start + pt.count) * zt)), Ct !== null ? (oe = Math.max(oe, 0), Ce = Math.min(Ce, Ct.count)) : Nt != null && (oe = Math.max(oe, 0), Ce = Math.min(Ce, Nt.count));
      const me = Ce - oe;
      if (me < 0 || me === 1 / 0) return;
      Ft.setup(z, V, At, G, Ct);
      let ke, ee = Lt;
      if (Ct !== null && (ke = nt.get(Ct), ee = Et, ee.setIndex(ke)), z.isMesh)
        V.wireframe === !0 ? (q.setLineWidth(V.wireframeLinewidth * Pt()), ee.setMode(C.LINES)) : ee.setMode(C.TRIANGLES);
      else if (z.isLine) {
        let Ht = V.linewidth;
        Ht === void 0 && (Ht = 1), q.setLineWidth(Ht * Pt()), z.isLineSegments ? ee.setMode(C.LINES) : z.isLineLoop ? ee.setMode(C.LINE_LOOP) : ee.setMode(C.LINE_STRIP);
      } else z.isPoints ? ee.setMode(C.POINTS) : z.isSprite && ee.setMode(C.TRIANGLES);
      if (z.isBatchedMesh)
        ee.renderMultiDraw(z._multiDrawStarts, z._multiDrawCounts, z._multiDrawCount);
      else if (z.isInstancedMesh)
        ee.renderInstances(oe, me, z.count);
      else if (G.isInstancedBufferGeometry) {
        const Ht = G._maxInstanceCount !== void 0 ? G._maxInstanceCount : 1 / 0, hr = Math.min(G.instanceCount, Ht);
        ee.renderInstances(oe, me, hr);
      } else
        ee.render(oe, me);
    };
    function Zt(E, I, G) {
      E.transparent === !0 && E.side === 2 && E.forceSinglePass === !1 ? (E.side = 1, E.needsUpdate = !0, xi(E, I, G), E.side = 0, E.needsUpdate = !0, xi(E, I, G), E.side = 2) : xi(E, I, G);
    }
    this.compile = function(E, I, G = null) {
      G === null && (G = E), d = Tt.get(G), d.init(), T.push(d), G.traverseVisible(function(z) {
        z.isLight && z.layers.test(I.layers) && (d.pushLight(z), z.castShadow && d.pushShadow(z));
      }), E !== G && E.traverseVisible(function(z) {
        z.isLight && z.layers.test(I.layers) && (d.pushLight(z), z.castShadow && d.pushShadow(z));
      }), d.setupLights(v._useLegacyLights);
      const V = /* @__PURE__ */ new Set();
      return E.traverse(function(z) {
        const pt = z.material;
        if (pt)
          if (Array.isArray(pt))
            for (let St = 0; St < pt.length; St++) {
              const At = pt[St];
              Zt(At, G, z), V.add(At);
            }
          else
            Zt(pt, G, z), V.add(pt);
      }), T.pop(), d = null, V;
    }, this.compileAsync = function(E, I, G = null) {
      const V = this.compile(E, I, G);
      return new Promise((z) => {
        function pt() {
          if (V.forEach(function(St) {
            dt.get(St).currentProgram.isReady() && V.delete(St);
          }), V.size === 0) {
            z(E);
            return;
          }
          setTimeout(pt, 10);
        }
        Z.get("KHR_parallel_shader_compile") !== null ? pt() : setTimeout(pt, 10);
      });
    };
    let Jt = null;
    function pe(E) {
      Jt && Jt(E);
    }
    function Ee() {
      Te.stop();
    }
    function Kt() {
      Te.start();
    }
    const Te = new Wa();
    Te.setAnimationLoop(pe), typeof self < "u" && Te.setContext(self), this.setAnimationLoop = function(E) {
      Jt = E, Gt.setAnimationLoop(E), E === null ? Te.stop() : Te.start();
    }, Gt.addEventListener("sessionstart", Ee), Gt.addEventListener("sessionend", Kt), this.render = function(E, I) {
      if (I !== void 0 && I.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (b === !0) return;
      E.matrixWorldAutoUpdate === !0 && E.updateMatrixWorld(), I.parent === null && I.matrixWorldAutoUpdate === !0 && I.updateMatrixWorld(), Gt.enabled === !0 && Gt.isPresenting === !0 && (Gt.cameraAutoUpdate === !0 && Gt.updateCamera(I), I = Gt.getCamera()), E.isScene === !0 && E.onBeforeRender(v, E, I, w), d = Tt.get(E, T.length), d.init(), T.push(d), mt.multiplyMatrices(I.projectionMatrix, I.matrixWorldInverse), k.setFromProjectionMatrix(mt), ft = this.localClippingEnabled, j = It.init(this.clippingPlanes, ft), _ = gt.get(E, u.length), _.init(), u.push(_), Ge(E, I, 0, v.sortObjects), _.finish(), v.sortObjects === !0 && _.sort(X, W), this.info.render.frame++, j === !0 && It.beginShadows();
      const G = d.state.shadowsArray;
      if (Q.render(G, E, I), j === !0 && It.endShadows(), this.info.autoReset === !0 && this.info.reset(), Wt.render(_, E), d.setupLights(v._useLegacyLights), I.isArrayCamera) {
        const V = I.cameras;
        for (let z = 0, pt = V.length; z < pt; z++) {
          const St = V[z];
          Ss(_, E, St, St.viewport);
        }
      } else
        Ss(_, E, I);
      w !== null && (y.updateMultisampleRenderTarget(w), y.updateRenderTargetMipmap(w)), E.isScene === !0 && E.onAfterRender(v, E, I), Ft.resetDefaultState(), O = -1, M = null, T.pop(), T.length > 0 ? d = T[T.length - 1] : d = null, u.pop(), u.length > 0 ? _ = u[u.length - 1] : _ = null;
    };
    function Ge(E, I, G, V) {
      if (E.visible === !1) return;
      if (E.layers.test(I.layers)) {
        if (E.isGroup)
          G = E.renderOrder;
        else if (E.isLOD)
          E.autoUpdate === !0 && E.update(I);
        else if (E.isLight)
          d.pushLight(E), E.castShadow && d.pushShadow(E);
        else if (E.isSprite) {
          if (!E.frustumCulled || k.intersectsSprite(E)) {
            V && Dt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(mt);
            const St = K.update(E), At = E.material;
            At.visible && _.push(E, St, At, G, Dt.z, null);
          }
        } else if ((E.isMesh || E.isLine || E.isPoints) && (!E.frustumCulled || k.intersectsObject(E))) {
          const St = K.update(E), At = E.material;
          if (V && (E.boundingSphere !== void 0 ? (E.boundingSphere === null && E.computeBoundingSphere(), Dt.copy(E.boundingSphere.center)) : (St.boundingSphere === null && St.computeBoundingSphere(), Dt.copy(St.boundingSphere.center)), Dt.applyMatrix4(E.matrixWorld).applyMatrix4(mt)), Array.isArray(At)) {
            const Ct = St.groups;
            for (let zt = 0, Ut = Ct.length; zt < Ut; zt++) {
              const Nt = Ct[zt], oe = At[Nt.materialIndex];
              oe && oe.visible && _.push(E, St, oe, G, Dt.z, Nt);
            }
          } else At.visible && _.push(E, St, At, G, Dt.z, null);
        }
      }
      const pt = E.children;
      for (let St = 0, At = pt.length; St < At; St++)
        Ge(pt[St], I, G, V);
    }
    function Ss(E, I, G, V) {
      const z = E.opaque, pt = E.transmissive, St = E.transparent;
      d.setupLightsView(G), j === !0 && It.setGlobalState(v.clippingPlanes, G), pt.length > 0 && fo(z, pt, I, G), V && q.viewport(S.copy(V)), z.length > 0 && vi(z, I, G), pt.length > 0 && vi(pt, I, G), St.length > 0 && vi(St, I, G), q.buffers.depth.setTest(!0), q.buffers.depth.setMask(!0), q.buffers.color.setMask(!0), q.setPolygonOffset(!1);
    }
    function fo(E, I, G, V) {
      if ((G.isScene === !0 ? G.overrideMaterial : null) !== null)
        return;
      const pt = it.isWebGL2;
      xt === null && (xt = new on(1, 1, {
        generateMipmaps: !0,
        type: Z.has("EXT_color_buffer_half_float") ? 1016 : 1009,
        minFilter: 1008,
        samples: pt ? 4 : 0
      })), v.getDrawingBufferSize(wt), pt ? xt.setSize(wt.x, wt.y) : xt.setSize(Jr(wt.x), Jr(wt.y));
      const St = v.getRenderTarget();
      v.setRenderTarget(xt), v.getClearColor(Y), P = v.getClearAlpha(), P < 1 && v.setClearColor(16777215, 0.5), v.clear();
      const At = v.toneMapping;
      v.toneMapping = 0, vi(E, G, V), y.updateMultisampleRenderTarget(xt), y.updateRenderTargetMipmap(xt);
      let Ct = !1;
      for (let zt = 0, Ut = I.length; zt < Ut; zt++) {
        const Nt = I[zt], oe = Nt.object, Ce = Nt.geometry, me = Nt.material, ke = Nt.group;
        if (me.side === 2 && oe.layers.test(V.layers)) {
          const ee = me.side;
          me.side = 1, me.needsUpdate = !0, ys(oe, G, V, Ce, me, ke), me.side = ee, me.needsUpdate = !0, Ct = !0;
        }
      }
      Ct === !0 && (y.updateMultisampleRenderTarget(xt), y.updateRenderTargetMipmap(xt)), v.setRenderTarget(St), v.setClearColor(Y, P), v.toneMapping = At;
    }
    function vi(E, I, G) {
      const V = I.isScene === !0 ? I.overrideMaterial : null;
      for (let z = 0, pt = E.length; z < pt; z++) {
        const St = E[z], At = St.object, Ct = St.geometry, zt = V === null ? St.material : V, Ut = St.group;
        At.layers.test(G.layers) && ys(At, I, G, Ct, zt, Ut);
      }
    }
    function ys(E, I, G, V, z, pt) {
      E.onBeforeRender(v, I, G, V, z, pt), E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse, E.matrixWorld), E.normalMatrix.getNormalMatrix(E.modelViewMatrix), z.onBeforeRender(v, I, G, V, E, pt), z.transparent === !0 && z.side === 2 && z.forceSinglePass === !1 ? (z.side = 1, z.needsUpdate = !0, v.renderBufferDirect(G, I, V, z, E, pt), z.side = 0, z.needsUpdate = !0, v.renderBufferDirect(G, I, V, z, E, pt), z.side = 2) : v.renderBufferDirect(G, I, V, z, E, pt), E.onAfterRender(v, I, G, V, z, pt);
    }
    function xi(E, I, G) {
      I.isScene !== !0 && (I = Mt);
      const V = dt.get(E), z = d.state.lights, pt = d.state.shadowsArray, St = z.state.version, At = vt.getParameters(E, z.state, pt, I, G), Ct = vt.getProgramCacheKey(At);
      let zt = V.programs;
      V.environment = E.isMeshStandardMaterial ? I.environment : null, V.fog = I.fog, V.envMap = (E.isMeshStandardMaterial ? F : x).get(E.envMap || V.environment), zt === void 0 && (E.addEventListener("dispose", ht), zt = /* @__PURE__ */ new Map(), V.programs = zt);
      let Ut = zt.get(Ct);
      if (Ut !== void 0) {
        if (V.currentProgram === Ut && V.lightsStateVersion === St)
          return Ts(E, At), Ut;
      } else
        At.uniforms = vt.getUniforms(E), E.onBuild(G, At, v), E.onBeforeCompile(At, v), Ut = vt.acquireProgram(At, Ct), zt.set(Ct, Ut), V.uniforms = At.uniforms;
      const Nt = V.uniforms;
      return (!E.isShaderMaterial && !E.isRawShaderMaterial || E.clipping === !0) && (Nt.clippingPlanes = It.uniform), Ts(E, At), V.needsLights = go(E), V.lightsStateVersion = St, V.needsLights && (Nt.ambientLightColor.value = z.state.ambient, Nt.lightProbe.value = z.state.probe, Nt.directionalLights.value = z.state.directional, Nt.directionalLightShadows.value = z.state.directionalShadow, Nt.spotLights.value = z.state.spot, Nt.spotLightShadows.value = z.state.spotShadow, Nt.rectAreaLights.value = z.state.rectArea, Nt.ltc_1.value = z.state.rectAreaLTC1, Nt.ltc_2.value = z.state.rectAreaLTC2, Nt.pointLights.value = z.state.point, Nt.pointLightShadows.value = z.state.pointShadow, Nt.hemisphereLights.value = z.state.hemi, Nt.directionalShadowMap.value = z.state.directionalShadowMap, Nt.directionalShadowMatrix.value = z.state.directionalShadowMatrix, Nt.spotShadowMap.value = z.state.spotShadowMap, Nt.spotLightMatrix.value = z.state.spotLightMatrix, Nt.spotLightMap.value = z.state.spotLightMap, Nt.pointShadowMap.value = z.state.pointShadowMap, Nt.pointShadowMatrix.value = z.state.pointShadowMatrix), V.currentProgram = Ut, V.uniformsList = null, Ut;
    }
    function Es(E) {
      if (E.uniformsList === null) {
        const I = E.currentProgram.getUniforms();
        E.uniformsList = ji.seqWithValue(I.seq, E.uniforms);
      }
      return E.uniformsList;
    }
    function Ts(E, I) {
      const G = dt.get(E);
      G.outputColorSpace = I.outputColorSpace, G.batching = I.batching, G.instancing = I.instancing, G.instancingColor = I.instancingColor, G.skinning = I.skinning, G.morphTargets = I.morphTargets, G.morphNormals = I.morphNormals, G.morphColors = I.morphColors, G.morphTargetsCount = I.morphTargetsCount, G.numClippingPlanes = I.numClippingPlanes, G.numIntersection = I.numClipIntersection, G.vertexAlphas = I.vertexAlphas, G.vertexTangents = I.vertexTangents, G.toneMapping = I.toneMapping;
    }
    function po(E, I, G, V, z) {
      I.isScene !== !0 && (I = Mt), y.resetTextureUnits();
      const pt = I.fog, St = V.isMeshStandardMaterial ? I.environment : null, At = w === null ? v.outputColorSpace : w.isXRRenderTarget === !0 ? w.texture.colorSpace : $e, Ct = (V.isMeshStandardMaterial ? F : x).get(V.envMap || St), zt = V.vertexColors === !0 && !!G.attributes.color && G.attributes.color.itemSize === 4, Ut = !!G.attributes.tangent && (!!V.normalMap || V.anisotropy > 0), Nt = !!G.morphAttributes.position, oe = !!G.morphAttributes.normal, Ce = !!G.morphAttributes.color;
      let me = 0;
      V.toneMapped && (w === null || w.isXRRenderTarget === !0) && (me = v.toneMapping);
      const ke = G.morphAttributes.position || G.morphAttributes.normal || G.morphAttributes.color, ee = ke !== void 0 ? ke.length : 0, Ht = dt.get(V), hr = d.state.lights;
      if (j === !0 && (ft === !0 || E !== M)) {
        const Ue = E === M && V.id === O;
        It.setState(V, E, Ue);
      }
      let se = !1;
      V.version === Ht.__version ? (Ht.needsLights && Ht.lightsStateVersion !== hr.state.version || Ht.outputColorSpace !== At || z.isBatchedMesh && Ht.batching === !1 || !z.isBatchedMesh && Ht.batching === !0 || z.isInstancedMesh && Ht.instancing === !1 || !z.isInstancedMesh && Ht.instancing === !0 || z.isSkinnedMesh && Ht.skinning === !1 || !z.isSkinnedMesh && Ht.skinning === !0 || z.isInstancedMesh && Ht.instancingColor === !0 && z.instanceColor === null || z.isInstancedMesh && Ht.instancingColor === !1 && z.instanceColor !== null || Ht.envMap !== Ct || V.fog === !0 && Ht.fog !== pt || Ht.numClippingPlanes !== void 0 && (Ht.numClippingPlanes !== It.numPlanes || Ht.numIntersection !== It.numIntersection) || Ht.vertexAlphas !== zt || Ht.vertexTangents !== Ut || Ht.morphTargets !== Nt || Ht.morphNormals !== oe || Ht.morphColors !== Ce || Ht.toneMapping !== me || it.isWebGL2 === !0 && Ht.morphTargetsCount !== ee) && (se = !0) : (se = !0, Ht.__version = V.version);
      let cn = Ht.currentProgram;
      se === !0 && (cn = xi(V, I, z));
      let bs = !1, Zn = !1, ur = !1;
      const xe = cn.getUniforms(), hn = Ht.uniforms;
      if (q.useProgram(cn.program) && (bs = !0, Zn = !0, ur = !0), V.id !== O && (O = V.id, Zn = !0), bs || M !== E) {
        xe.setValue(C, "projectionMatrix", E.projectionMatrix), xe.setValue(C, "viewMatrix", E.matrixWorldInverse);
        const Ue = xe.map.cameraPosition;
        Ue !== void 0 && Ue.setValue(C, Dt.setFromMatrixPosition(E.matrixWorld)), it.logarithmicDepthBuffer && xe.setValue(
          C,
          "logDepthBufFC",
          2 / (Math.log(E.far + 1) / Math.LN2)
        ), (V.isMeshPhongMaterial || V.isMeshToonMaterial || V.isMeshLambertMaterial || V.isMeshBasicMaterial || V.isMeshStandardMaterial || V.isShaderMaterial) && xe.setValue(C, "isOrthographic", E.isOrthographicCamera === !0), M !== E && (M = E, Zn = !0, ur = !0);
      }
      if (z.isSkinnedMesh) {
        xe.setOptional(C, z, "bindMatrix"), xe.setOptional(C, z, "bindMatrixInverse");
        const Ue = z.skeleton;
        Ue && (it.floatVertexTextures ? (Ue.boneTexture === null && Ue.computeBoneTexture(), xe.setValue(C, "boneTexture", Ue.boneTexture, y)) : console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."));
      }
      z.isBatchedMesh && (xe.setOptional(C, z, "batchingTexture"), xe.setValue(C, "batchingTexture", z._matricesTexture, y));
      const fr = G.morphAttributes;
      if ((fr.position !== void 0 || fr.normal !== void 0 || fr.color !== void 0 && it.isWebGL2 === !0) && kt.update(z, G, cn), (Zn || Ht.receiveShadow !== z.receiveShadow) && (Ht.receiveShadow = z.receiveShadow, xe.setValue(C, "receiveShadow", z.receiveShadow)), V.isMeshGouraudMaterial && V.envMap !== null && (hn.envMap.value = Ct, hn.flipEnvMap.value = Ct.isCubeTexture && Ct.isRenderTargetTexture === !1 ? -1 : 1), Zn && (xe.setValue(C, "toneMappingExposure", v.toneMappingExposure), Ht.needsLights && mo(hn, ur), pt && V.fog === !0 && lt.refreshFogUniforms(hn, pt), lt.refreshMaterialUniforms(hn, V, J, H, xt), ji.upload(C, Es(Ht), hn, y)), V.isShaderMaterial && V.uniformsNeedUpdate === !0 && (ji.upload(C, Es(Ht), hn, y), V.uniformsNeedUpdate = !1), V.isSpriteMaterial && xe.setValue(C, "center", z.center), xe.setValue(C, "modelViewMatrix", z.modelViewMatrix), xe.setValue(C, "normalMatrix", z.normalMatrix), xe.setValue(C, "modelMatrix", z.matrixWorld), V.isShaderMaterial || V.isRawShaderMaterial) {
        const Ue = V.uniformsGroups;
        for (let dr = 0, _o = Ue.length; dr < _o; dr++)
          if (it.isWebGL2) {
            const As = Ue[dr];
            Xt.update(As, cn), Xt.bind(As, cn);
          } else
            console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.");
      }
      return cn;
    }
    function mo(E, I) {
      E.ambientLightColor.needsUpdate = I, E.lightProbe.needsUpdate = I, E.directionalLights.needsUpdate = I, E.directionalLightShadows.needsUpdate = I, E.pointLights.needsUpdate = I, E.pointLightShadows.needsUpdate = I, E.spotLights.needsUpdate = I, E.spotLightShadows.needsUpdate = I, E.rectAreaLights.needsUpdate = I, E.hemisphereLights.needsUpdate = I;
    }
    function go(E) {
      return E.isMeshLambertMaterial || E.isMeshToonMaterial || E.isMeshPhongMaterial || E.isMeshStandardMaterial || E.isShadowMaterial || E.isShaderMaterial && E.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return R;
    }, this.getActiveMipmapLevel = function() {
      return A;
    }, this.getRenderTarget = function() {
      return w;
    }, this.setRenderTargetTextures = function(E, I, G) {
      dt.get(E.texture).__webglTexture = I, dt.get(E.depthTexture).__webglTexture = G;
      const V = dt.get(E);
      V.__hasExternalTextures = !0, V.__hasExternalTextures && (V.__autoAllocateDepthBuffer = G === void 0, V.__autoAllocateDepthBuffer || Z.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), V.__useRenderToTexture = !1));
    }, this.setRenderTargetFramebuffer = function(E, I) {
      const G = dt.get(E);
      G.__webglFramebuffer = I, G.__useDefaultFramebuffer = I === void 0;
    }, this.setRenderTarget = function(E, I = 0, G = 0) {
      w = E, R = I, A = G;
      let V = !0, z = null, pt = !1, St = !1;
      if (E) {
        const Ct = dt.get(E);
        Ct.__useDefaultFramebuffer !== void 0 ? (q.bindFramebuffer(C.FRAMEBUFFER, null), V = !1) : Ct.__webglFramebuffer === void 0 ? y.setupRenderTarget(E) : Ct.__hasExternalTextures && y.rebindTextures(E, dt.get(E.texture).__webglTexture, dt.get(E.depthTexture).__webglTexture);
        const zt = E.texture;
        (zt.isData3DTexture || zt.isDataArrayTexture || zt.isCompressedArrayTexture) && (St = !0);
        const Ut = dt.get(E).__webglFramebuffer;
        E.isWebGLCubeRenderTarget ? (Array.isArray(Ut[I]) ? z = Ut[I][G] : z = Ut[I], pt = !0) : it.isWebGL2 && E.samples > 0 && y.useMultisampledRTT(E) === !1 ? z = dt.get(E).__webglMultisampledFramebuffer : Array.isArray(Ut) ? z = Ut[G] : z = Ut, S.copy(E.viewport), U.copy(E.scissor), N = E.scissorTest;
      } else
        S.copy(tt).multiplyScalar(J).floor(), U.copy(et).multiplyScalar(J).floor(), N = ut;
      if (q.bindFramebuffer(C.FRAMEBUFFER, z) && it.drawBuffers && V && q.drawBuffers(E, z), q.viewport(S), q.scissor(U), q.setScissorTest(N), pt) {
        const Ct = dt.get(E.texture);
        C.framebufferTexture2D(C.FRAMEBUFFER, C.COLOR_ATTACHMENT0, C.TEXTURE_CUBE_MAP_POSITIVE_X + I, Ct.__webglTexture, G);
      } else if (St) {
        const Ct = dt.get(E.texture), zt = I || 0;
        C.framebufferTextureLayer(C.FRAMEBUFFER, C.COLOR_ATTACHMENT0, Ct.__webglTexture, G || 0, zt);
      }
      O = -1;
    }, this.readRenderTargetPixels = function(E, I, G, V, z, pt, St) {
      if (!(E && E.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let At = dt.get(E).__webglFramebuffer;
      if (E.isWebGLCubeRenderTarget && St !== void 0 && (At = At[St]), At) {
        q.bindFramebuffer(C.FRAMEBUFFER, At);
        try {
          const Ct = E.texture, zt = Ct.format, Ut = Ct.type;
          if (zt !== 1023 && _t.convert(zt) !== C.getParameter(C.IMPLEMENTATION_COLOR_READ_FORMAT)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          const Nt = Ut === 1016 && (Z.has("EXT_color_buffer_half_float") || it.isWebGL2 && Z.has("EXT_color_buffer_float"));
          if (Ut !== 1009 && _t.convert(Ut) !== C.getParameter(C.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
          !(Ut === 1015 && (it.isWebGL2 || Z.has("OES_texture_float") || Z.has("WEBGL_color_buffer_float"))) && // Chrome Mac >= 52 and Firefox
          !Nt) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          I >= 0 && I <= E.width - V && G >= 0 && G <= E.height - z && C.readPixels(I, G, V, z, _t.convert(zt), _t.convert(Ut), pt);
        } finally {
          const Ct = w !== null ? dt.get(w).__webglFramebuffer : null;
          q.bindFramebuffer(C.FRAMEBUFFER, Ct);
        }
      }
    }, this.copyFramebufferToTexture = function(E, I, G = 0) {
      const V = Math.pow(2, -G), z = Math.floor(I.image.width * V), pt = Math.floor(I.image.height * V);
      y.setTexture2D(I, 0), C.copyTexSubImage2D(C.TEXTURE_2D, G, 0, 0, E.x, E.y, z, pt), q.unbindTexture();
    }, this.copyTextureToTexture = function(E, I, G, V = 0) {
      const z = I.image.width, pt = I.image.height, St = _t.convert(G.format), At = _t.convert(G.type);
      y.setTexture2D(G, 0), C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL, G.flipY), C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL, G.premultiplyAlpha), C.pixelStorei(C.UNPACK_ALIGNMENT, G.unpackAlignment), I.isDataTexture ? C.texSubImage2D(C.TEXTURE_2D, V, E.x, E.y, z, pt, St, At, I.image.data) : I.isCompressedTexture ? C.compressedTexSubImage2D(C.TEXTURE_2D, V, E.x, E.y, I.mipmaps[0].width, I.mipmaps[0].height, St, I.mipmaps[0].data) : C.texSubImage2D(C.TEXTURE_2D, V, E.x, E.y, St, At, I.image), V === 0 && G.generateMipmaps && C.generateMipmap(C.TEXTURE_2D), q.unbindTexture();
    }, this.copyTextureToTexture3D = function(E, I, G, V, z = 0) {
      if (v.isWebGL1Renderer) {
        console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");
        return;
      }
      const pt = E.max.x - E.min.x + 1, St = E.max.y - E.min.y + 1, At = E.max.z - E.min.z + 1, Ct = _t.convert(V.format), zt = _t.convert(V.type);
      let Ut;
      if (V.isData3DTexture)
        y.setTexture3D(V, 0), Ut = C.TEXTURE_3D;
      else if (V.isDataArrayTexture || V.isCompressedArrayTexture)
        y.setTexture2DArray(V, 0), Ut = C.TEXTURE_2D_ARRAY;
      else {
        console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
        return;
      }
      C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL, V.flipY), C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL, V.premultiplyAlpha), C.pixelStorei(C.UNPACK_ALIGNMENT, V.unpackAlignment);
      const Nt = C.getParameter(C.UNPACK_ROW_LENGTH), oe = C.getParameter(C.UNPACK_IMAGE_HEIGHT), Ce = C.getParameter(C.UNPACK_SKIP_PIXELS), me = C.getParameter(C.UNPACK_SKIP_ROWS), ke = C.getParameter(C.UNPACK_SKIP_IMAGES), ee = G.isCompressedTexture ? G.mipmaps[z] : G.image;
      C.pixelStorei(C.UNPACK_ROW_LENGTH, ee.width), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, ee.height), C.pixelStorei(C.UNPACK_SKIP_PIXELS, E.min.x), C.pixelStorei(C.UNPACK_SKIP_ROWS, E.min.y), C.pixelStorei(C.UNPACK_SKIP_IMAGES, E.min.z), G.isDataTexture || G.isData3DTexture ? C.texSubImage3D(Ut, z, I.x, I.y, I.z, pt, St, At, Ct, zt, ee.data) : G.isCompressedArrayTexture ? (console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."), C.compressedTexSubImage3D(Ut, z, I.x, I.y, I.z, pt, St, At, Ct, ee.data)) : C.texSubImage3D(Ut, z, I.x, I.y, I.z, pt, St, At, Ct, zt, ee), C.pixelStorei(C.UNPACK_ROW_LENGTH, Nt), C.pixelStorei(C.UNPACK_IMAGE_HEIGHT, oe), C.pixelStorei(C.UNPACK_SKIP_PIXELS, Ce), C.pixelStorei(C.UNPACK_SKIP_ROWS, me), C.pixelStorei(C.UNPACK_SKIP_IMAGES, ke), z === 0 && V.generateMipmaps && C.generateMipmap(Ut), q.unbindTexture();
    }, this.initTexture = function(E) {
      E.isCubeTexture ? y.setTextureCube(E, 0) : E.isData3DTexture ? y.setTexture3D(E, 0) : E.isDataArrayTexture || E.isCompressedArrayTexture ? y.setTexture2DArray(E, 0) : y.setTexture2D(E, 0), q.unbindTexture();
    }, this.resetState = function() {
      R = 0, A = 0, w = null, q.reset(), Ft.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return 2e3;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorSpace = t === os ? "display-p3" : "srgb", e.unpackColorSpace = qt.workingColorSpace === nr ? "display-p3" : "srgb";
  }
  get outputEncoding() {
    return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace === _e ? 3001 : 3e3;
  }
  set outputEncoding(t) {
    console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace = t === 3001 ? _e : $e;
  }
  get useLegacyLights() {
    return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights;
  }
  set useLegacyLights(t) {
    console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights = t;
  }
}
class Tf extends ja {
}
Tf.prototype.isWebGL1Renderer = !0;
class bf extends ue {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e;
  }
}
class Af {
  constructor(t, e) {
    this.isInterleavedBuffer = !0, this.array = t, this.stride = e, this.count = t !== void 0 ? t.length / e : 0, this.usage = 35044, this._updateRange = { offset: 0, count: -1 }, this.updateRanges = [], this.version = 0, this.uuid = je();
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  get updateRange() {
    return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.array = new t.array.constructor(t.array), this.count = t.count, this.stride = t.stride, this.usage = t.usage, this;
  }
  copyAt(t, e, n) {
    t *= this.stride, n *= e.stride;
    for (let r = 0, s = this.stride; r < s; r++)
      this.array[t + r] = e.array[n + r];
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  clone(t) {
    t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = je()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const e = new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(e, this.stride);
    return n.setUsage(this.usage), n;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  toJSON(t) {
    return t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = je()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const be = /* @__PURE__ */ new L();
class er {
  constructor(t, e, n, r = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = t, this.itemSize = e, this.offset = n, this.normalized = r;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(t) {
    this.data.needsUpdate = t;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.data.count; e < n; e++)
      be.fromBufferAttribute(this, e), be.applyMatrix4(t), this.setXYZ(e, be.x, be.y, be.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      be.fromBufferAttribute(this, e), be.applyNormalMatrix(t), this.setXYZ(e, be.x, be.y, be.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      be.fromBufferAttribute(this, e), be.transformDirection(t), this.setXYZ(e, be.x, be.y, be.z);
    return this;
  }
  setX(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.data.array[t * this.data.stride + this.offset] = e, this;
  }
  setY(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 1] = e, this;
  }
  setZ(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 2] = e, this;
  }
  setW(t, e) {
    return this.normalized && (e = Yt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 3] = e, this;
  }
  getX(t) {
    let e = this.data.array[t * this.data.stride + this.offset];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  getY(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 1];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  getZ(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 2];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  getW(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 3];
    return this.normalized && (e = Ke(e, this.array)), e;
  }
  setXY(t, e, n) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, r) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array), r = Yt(r, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = r, this;
  }
  setXYZW(t, e, n, r, s) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = Yt(e, this.array), n = Yt(n, this.array), r = Yt(r, this.array), s = Yt(s, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = r, this.data.array[t + 3] = s, this;
  }
  clone(t) {
    if (t === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const e = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++)
          e.push(this.data.array[r + s]);
      }
      return new ae(new this.array.constructor(e), this.itemSize, this.normalized);
    } else
      return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new er(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(t) {
    if (t === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const e = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++)
          e.push(this.data.array[r + s]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: e,
        normalized: this.normalized
      };
    } else
      return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.toJSON(t)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
class _i extends ln {
  constructor(t) {
    super(), this.isSpriteMaterial = !0, this.type = "SpriteMaterial", this.color = new Bt(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = !0, this.transparent = !0, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.rotation = t.rotation, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
  }
}
let Nn;
const Qn = /* @__PURE__ */ new L(), Fn = /* @__PURE__ */ new L(), On = /* @__PURE__ */ new L(), Bn = /* @__PURE__ */ new rt(), ti = /* @__PURE__ */ new rt(), $a = /* @__PURE__ */ new te(), Vi = /* @__PURE__ */ new L(), ei = /* @__PURE__ */ new L(), ki = /* @__PURE__ */ new L(), da = /* @__PURE__ */ new rt(), zr = /* @__PURE__ */ new rt(), pa = /* @__PURE__ */ new rt();
class ar extends ue {
  constructor(t = new _i()) {
    if (super(), this.isSprite = !0, this.type = "Sprite", Nn === void 0) {
      Nn = new ce();
      const e = new Float32Array([
        -0.5,
        -0.5,
        0,
        0,
        0,
        0.5,
        -0.5,
        0,
        1,
        0,
        0.5,
        0.5,
        0,
        1,
        1,
        -0.5,
        0.5,
        0,
        0,
        1
      ]), n = new Af(e, 5);
      Nn.setIndex([0, 1, 2, 0, 2, 3]), Nn.setAttribute("position", new er(n, 3, 0, !1)), Nn.setAttribute("uv", new er(n, 2, 3, !1));
    }
    this.geometry = Nn, this.material = t, this.center = new rt(0.5, 0.5);
  }
  raycast(t, e) {
    t.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Fn.setFromMatrixScale(this.matrixWorld), $a.copy(t.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse, this.matrixWorld), On.setFromMatrixPosition(this.modelViewMatrix), t.camera.isPerspectiveCamera && this.material.sizeAttenuation === !1 && Fn.multiplyScalar(-On.z);
    const n = this.material.rotation;
    let r, s;
    n !== 0 && (s = Math.cos(n), r = Math.sin(n));
    const o = this.center;
    Wi(Vi.set(-0.5, -0.5, 0), On, o, Fn, r, s), Wi(ei.set(0.5, -0.5, 0), On, o, Fn, r, s), Wi(ki.set(0.5, 0.5, 0), On, o, Fn, r, s), da.set(0, 0), zr.set(1, 0), pa.set(1, 1);
    let a = t.ray.intersectTriangle(Vi, ei, ki, !1, Qn);
    if (a === null && (Wi(ei.set(-0.5, 0.5, 0), On, o, Fn, r, s), zr.set(0, 1), a = t.ray.intersectTriangle(Vi, ki, ei, !1, Qn), a === null))
      return;
    const l = t.ray.origin.distanceTo(Qn);
    l < t.near || l > t.far || e.push({
      distance: l,
      point: Qn.clone(),
      uv: Ne.getInterpolation(Qn, Vi, ei, ki, da, zr, pa, new rt()),
      face: null,
      object: this
    });
  }
  copy(t, e) {
    return super.copy(t, e), t.center !== void 0 && this.center.copy(t.center), this.material = t.material, this;
  }
}
function Wi(i, t, e, n, r, s) {
  Bn.subVectors(i, e).addScalar(0.5).multiply(n), r !== void 0 ? (ti.x = s * Bn.x - r * Bn.y, ti.y = r * Bn.x + s * Bn.y) : ti.copy(Bn), i.copy(t), i.x += ti.x, i.y += ti.y, i.applyMatrix4($a);
}
class fs extends ln {
  constructor(t) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Bt(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
  }
}
const ma = /* @__PURE__ */ new L(), ga = /* @__PURE__ */ new L(), _a = /* @__PURE__ */ new te(), Gr = /* @__PURE__ */ new ir(), Xi = /* @__PURE__ */ new pi();
class jr extends ue {
  constructor(t = new ce(), e = new fs()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [0];
      for (let r = 1, s = e.count; r < s; r++)
        ma.fromBufferAttribute(e, r - 1), ga.fromBufferAttribute(e, r), n[r] = n[r - 1], n[r] += ma.distanceTo(ga);
      t.setAttribute("lineDistance", new ve(n, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(t, e) {
    const n = this.geometry, r = this.matrixWorld, s = t.params.Line.threshold, o = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Xi.copy(n.boundingSphere), Xi.applyMatrix4(r), Xi.radius += s, t.ray.intersectsSphere(Xi) === !1) return;
    _a.copy(r).invert(), Gr.copy(t.ray).applyMatrix4(_a);
    const a = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = a * a, c = new L(), h = new L(), f = new L(), p = new L(), m = this.isLineSegments ? 2 : 1, g = n.index, d = n.attributes.position;
    if (g !== null) {
      const u = Math.max(0, o.start), T = Math.min(g.count, o.start + o.count);
      for (let v = u, b = T - 1; v < b; v += m) {
        const R = g.getX(v), A = g.getX(v + 1);
        if (c.fromBufferAttribute(d, R), h.fromBufferAttribute(d, A), Gr.distanceSqToSegment(c, h, p, f) > l) continue;
        p.applyMatrix4(this.matrixWorld);
        const O = t.ray.origin.distanceTo(p);
        O < t.near || O > t.far || e.push({
          distance: O,
          // What do we want? intersection point on the ray or on the segment??
          // point: raycaster.ray.at( distance ),
          point: f.clone().applyMatrix4(this.matrixWorld),
          index: v,
          face: null,
          faceIndex: null,
          object: this
        });
      }
    } else {
      const u = Math.max(0, o.start), T = Math.min(d.count, o.start + o.count);
      for (let v = u, b = T - 1; v < b; v += m) {
        if (c.fromBufferAttribute(d, v), h.fromBufferAttribute(d, v + 1), Gr.distanceSqToSegment(c, h, p, f) > l) continue;
        p.applyMatrix4(this.matrixWorld);
        const A = t.ray.origin.distanceTo(p);
        A < t.near || A > t.far || e.push({
          distance: A,
          // What do we want? intersection point on the ray or on the segment??
          // point: raycaster.ray.at( distance ),
          point: f.clone().applyMatrix4(this.matrixWorld),
          index: v,
          face: null,
          faceIndex: null,
          object: this
        });
      }
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const r = e[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, o = r.length; s < o; s++) {
          const a = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
        }
      }
    }
  }
}
class Qa extends ln {
  constructor(t) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new Bt(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.size = t.size, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
  }
}
const va = /* @__PURE__ */ new te(), $r = /* @__PURE__ */ new ir(), qi = /* @__PURE__ */ new pi(), Yi = /* @__PURE__ */ new L();
class ds extends ue {
  constructor(t = new ce(), e = new Qa()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  raycast(t, e) {
    const n = this.geometry, r = this.matrixWorld, s = t.params.Points.threshold, o = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), qi.copy(n.boundingSphere), qi.applyMatrix4(r), qi.radius += s, t.ray.intersectsSphere(qi) === !1) return;
    va.copy(r).invert(), $r.copy(t.ray).applyMatrix4(va);
    const a = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = a * a, c = n.index, f = n.attributes.position;
    if (c !== null) {
      const p = Math.max(0, o.start), m = Math.min(c.count, o.start + o.count);
      for (let g = p, _ = m; g < _; g++) {
        const d = c.getX(g);
        Yi.fromBufferAttribute(f, d), xa(Yi, d, l, r, t, e, this);
      }
    } else {
      const p = Math.max(0, o.start), m = Math.min(f.count, o.start + o.count);
      for (let g = p, _ = m; g < _; g++)
        Yi.fromBufferAttribute(f, g), xa(Yi, g, l, r, t, e, this);
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const r = e[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, o = r.length; s < o; s++) {
          const a = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
        }
      }
    }
  }
}
function xa(i, t, e, n, r, s, o) {
  const a = $r.distanceSqToPoint(i);
  if (a < e) {
    const l = new L();
    $r.closestPointToPoint(i, l), l.applyMatrix4(n);
    const c = r.ray.origin.distanceTo(l);
    if (c < r.near || c > r.far) return;
    s.push({
      distance: c,
      distanceToRay: Math.sqrt(a),
      point: l,
      index: t,
      face: null,
      object: o
    });
  }
}
class or extends we {
  constructor(t, e, n, r, s, o, a, l, c) {
    super(t, e, n, r, s, o, a, l, c), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class Ve {
  constructor() {
    this.type = "Curve", this.arcLengthDivisions = 200;
  }
  // Virtual base class method to overwrite and implement in subclasses
  //	- t [0 .. 1]
  getPoint() {
    return console.warn("THREE.Curve: .getPoint() not implemented."), null;
  }
  // Get point at relative position in curve according to arc length
  // - u [0 .. 1]
  getPointAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getPoint(n, e);
  }
  // Get sequence of points using getPoint( t )
  getPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPoint(n / t));
    return e;
  }
  // Get sequence of points using getPointAt( u )
  getSpacedPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPointAt(n / t));
    return e;
  }
  // Get total curve arc length
  getLength() {
    const t = this.getLengths();
    return t[t.length - 1];
  }
  // Get list of cumulative segment lengths
  getLengths(t = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === t + 1 && !this.needsUpdate)
      return this.cacheArcLengths;
    this.needsUpdate = !1;
    const e = [];
    let n, r = this.getPoint(0), s = 0;
    e.push(0);
    for (let o = 1; o <= t; o++)
      n = this.getPoint(o / t), s += n.distanceTo(r), e.push(s), r = n;
    return this.cacheArcLengths = e, e;
  }
  updateArcLengths() {
    this.needsUpdate = !0, this.getLengths();
  }
  // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant
  getUtoTmapping(t, e) {
    const n = this.getLengths();
    let r = 0;
    const s = n.length;
    let o;
    e ? o = e : o = t * n[s - 1];
    let a = 0, l = s - 1, c;
    for (; a <= l; )
      if (r = Math.floor(a + (l - a) / 2), c = n[r] - o, c < 0)
        a = r + 1;
      else if (c > 0)
        l = r - 1;
      else {
        l = r;
        break;
      }
    if (r = l, n[r] === o)
      return r / (s - 1);
    const h = n[r], p = n[r + 1] - h, m = (o - h) / p;
    return (r + m) / (s - 1);
  }
  // Returns a unit vector tangent at t
  // In case any sub curve does not implement its tangent derivation,
  // 2 points a small delta apart will be used to find its gradient
  // which seems to give a reasonable approximation
  getTangent(t, e) {
    let r = t - 1e-4, s = t + 1e-4;
    r < 0 && (r = 0), s > 1 && (s = 1);
    const o = this.getPoint(r), a = this.getPoint(s), l = e || (o.isVector2 ? new rt() : new L());
    return l.copy(a).sub(o).normalize(), l;
  }
  getTangentAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getTangent(n, e);
  }
  computeFrenetFrames(t, e) {
    const n = new L(), r = [], s = [], o = [], a = new L(), l = new te();
    for (let m = 0; m <= t; m++) {
      const g = m / t;
      r[m] = this.getTangentAt(g, new L());
    }
    s[0] = new L(), o[0] = new L();
    let c = Number.MAX_VALUE;
    const h = Math.abs(r[0].x), f = Math.abs(r[0].y), p = Math.abs(r[0].z);
    h <= c && (c = h, n.set(1, 0, 0)), f <= c && (c = f, n.set(0, 1, 0)), p <= c && n.set(0, 0, 1), a.crossVectors(r[0], n).normalize(), s[0].crossVectors(r[0], a), o[0].crossVectors(r[0], s[0]);
    for (let m = 1; m <= t; m++) {
      if (s[m] = s[m - 1].clone(), o[m] = o[m - 1].clone(), a.crossVectors(r[m - 1], r[m]), a.length() > Number.EPSILON) {
        a.normalize();
        const g = Math.acos(ye(r[m - 1].dot(r[m]), -1, 1));
        s[m].applyMatrix4(l.makeRotationAxis(a, g));
      }
      o[m].crossVectors(r[m], s[m]);
    }
    if (e === !0) {
      let m = Math.acos(ye(s[0].dot(s[t]), -1, 1));
      m /= t, r[0].dot(a.crossVectors(s[0], s[t])) > 0 && (m = -m);
      for (let g = 1; g <= t; g++)
        s[g].applyMatrix4(l.makeRotationAxis(r[g], m * g)), o[g].crossVectors(r[g], s[g]);
    }
    return {
      tangents: r,
      normals: s,
      binormals: o
    };
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "Curve",
        generator: "Curve.toJSON"
      }
    };
    return t.arcLengthDivisions = this.arcLengthDivisions, t.type = this.type, t;
  }
  fromJSON(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
}
class ps extends Ve {
  constructor(t = 0, e = 0, n = 1, r = 1, s = 0, o = Math.PI * 2, a = !1, l = 0) {
    super(), this.isEllipseCurve = !0, this.type = "EllipseCurve", this.aX = t, this.aY = e, this.xRadius = n, this.yRadius = r, this.aStartAngle = s, this.aEndAngle = o, this.aClockwise = a, this.aRotation = l;
  }
  getPoint(t, e) {
    const n = e || new rt(), r = Math.PI * 2;
    let s = this.aEndAngle - this.aStartAngle;
    const o = Math.abs(s) < Number.EPSILON;
    for (; s < 0; ) s += r;
    for (; s > r; ) s -= r;
    s < Number.EPSILON && (o ? s = 0 : s = r), this.aClockwise === !0 && !o && (s === r ? s = -r : s = s - r);
    const a = this.aStartAngle + t * s;
    let l = this.aX + this.xRadius * Math.cos(a), c = this.aY + this.yRadius * Math.sin(a);
    if (this.aRotation !== 0) {
      const h = Math.cos(this.aRotation), f = Math.sin(this.aRotation), p = l - this.aX, m = c - this.aY;
      l = p * h - m * f + this.aX, c = p * f + m * h + this.aY;
    }
    return n.set(l, c);
  }
  copy(t) {
    return super.copy(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.aX = this.aX, t.aY = this.aY, t.xRadius = this.xRadius, t.yRadius = this.yRadius, t.aStartAngle = this.aStartAngle, t.aEndAngle = this.aEndAngle, t.aClockwise = this.aClockwise, t.aRotation = this.aRotation, t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
}
class wf extends ps {
  constructor(t, e, n, r, s, o) {
    super(t, e, n, n, r, s, o), this.isArcCurve = !0, this.type = "ArcCurve";
  }
}
function ms() {
  let i = 0, t = 0, e = 0, n = 0;
  function r(s, o, a, l) {
    i = s, t = a, e = -3 * s + 3 * o - 2 * a - l, n = 2 * s - 2 * o + a + l;
  }
  return {
    initCatmullRom: function(s, o, a, l, c) {
      r(o, a, c * (a - s), c * (l - o));
    },
    initNonuniformCatmullRom: function(s, o, a, l, c, h, f) {
      let p = (o - s) / c - (a - s) / (c + h) + (a - o) / h, m = (a - o) / h - (l - o) / (h + f) + (l - a) / f;
      p *= h, m *= h, r(o, a, p, m);
    },
    calc: function(s) {
      const o = s * s, a = o * s;
      return i + t * s + e * o + n * a;
    }
  };
}
const Zi = /* @__PURE__ */ new L(), Hr = /* @__PURE__ */ new ms(), Vr = /* @__PURE__ */ new ms(), kr = /* @__PURE__ */ new ms();
class Rf extends Ve {
  constructor(t = [], e = !1, n = "centripetal", r = 0.5) {
    super(), this.isCatmullRomCurve3 = !0, this.type = "CatmullRomCurve3", this.points = t, this.closed = e, this.curveType = n, this.tension = r;
  }
  getPoint(t, e = new L()) {
    const n = e, r = this.points, s = r.length, o = (s - (this.closed ? 0 : 1)) * t;
    let a = Math.floor(o), l = o - a;
    this.closed ? a += a > 0 ? 0 : (Math.floor(Math.abs(a) / s) + 1) * s : l === 0 && a === s - 1 && (a = s - 2, l = 1);
    let c, h;
    this.closed || a > 0 ? c = r[(a - 1) % s] : (Zi.subVectors(r[0], r[1]).add(r[0]), c = Zi);
    const f = r[a % s], p = r[(a + 1) % s];
    if (this.closed || a + 2 < s ? h = r[(a + 2) % s] : (Zi.subVectors(r[s - 1], r[s - 2]).add(r[s - 1]), h = Zi), this.curveType === "centripetal" || this.curveType === "chordal") {
      const m = this.curveType === "chordal" ? 0.5 : 0.25;
      let g = Math.pow(c.distanceToSquared(f), m), _ = Math.pow(f.distanceToSquared(p), m), d = Math.pow(p.distanceToSquared(h), m);
      _ < 1e-4 && (_ = 1), g < 1e-4 && (g = _), d < 1e-4 && (d = _), Hr.initNonuniformCatmullRom(c.x, f.x, p.x, h.x, g, _, d), Vr.initNonuniformCatmullRom(c.y, f.y, p.y, h.y, g, _, d), kr.initNonuniformCatmullRom(c.z, f.z, p.z, h.z, g, _, d);
    } else this.curveType === "catmullrom" && (Hr.initCatmullRom(c.x, f.x, p.x, h.x, this.tension), Vr.initCatmullRom(c.y, f.y, p.y, h.y, this.tension), kr.initCatmullRom(c.z, f.z, p.z, h.z, this.tension));
    return n.set(
      Hr.calc(l),
      Vr.calc(l),
      kr.calc(l)
    ), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(r.clone());
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const r = this.points[e];
      t.points.push(r.toArray());
    }
    return t.closed = this.closed, t.curveType = this.curveType, t.tension = this.tension, t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(new L().fromArray(r));
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
}
function Ma(i, t, e, n, r) {
  const s = (n - t) * 0.5, o = (r - e) * 0.5, a = i * i, l = i * a;
  return (2 * e - 2 * n + s + o) * l + (-3 * e + 3 * n - 2 * s - o) * a + s * i + e;
}
function Cf(i, t) {
  const e = 1 - i;
  return e * e * t;
}
function Pf(i, t) {
  return 2 * (1 - i) * i * t;
}
function Lf(i, t) {
  return i * i * t;
}
function ri(i, t, e, n) {
  return Cf(i, t) + Pf(i, e) + Lf(i, n);
}
function Df(i, t) {
  const e = 1 - i;
  return e * e * e * t;
}
function Uf(i, t) {
  const e = 1 - i;
  return 3 * e * e * i * t;
}
function If(i, t) {
  return 3 * (1 - i) * i * i * t;
}
function Nf(i, t) {
  return i * i * i * t;
}
function si(i, t, e, n, r) {
  return Df(i, t) + Uf(i, e) + If(i, n) + Nf(i, r);
}
class to extends Ve {
  constructor(t = new rt(), e = new rt(), n = new rt(), r = new rt()) {
    super(), this.isCubicBezierCurve = !0, this.type = "CubicBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = r;
  }
  getPoint(t, e = new rt()) {
    const n = e, r = this.v0, s = this.v1, o = this.v2, a = this.v3;
    return n.set(
      si(t, r.x, s.x, o.x, a.x),
      si(t, r.y, s.y, o.y, a.y)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class Ff extends Ve {
  constructor(t = new L(), e = new L(), n = new L(), r = new L()) {
    super(), this.isCubicBezierCurve3 = !0, this.type = "CubicBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = r;
  }
  getPoint(t, e = new L()) {
    const n = e, r = this.v0, s = this.v1, o = this.v2, a = this.v3;
    return n.set(
      si(t, r.x, s.x, o.x, a.x),
      si(t, r.y, s.y, o.y, a.y),
      si(t, r.z, s.z, o.z, a.z)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class eo extends Ve {
  constructor(t = new rt(), e = new rt()) {
    super(), this.isLineCurve = !0, this.type = "LineCurve", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new rt()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new rt()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Of extends Ve {
  constructor(t = new L(), e = new L()) {
    super(), this.isLineCurve3 = !0, this.type = "LineCurve3", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new L()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new L()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class no extends Ve {
  constructor(t = new rt(), e = new rt(), n = new rt()) {
    super(), this.isQuadraticBezierCurve = !0, this.type = "QuadraticBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  getPoint(t, e = new rt()) {
    const n = e, r = this.v0, s = this.v1, o = this.v2;
    return n.set(
      ri(t, r.x, s.x, o.x),
      ri(t, r.y, s.y, o.y)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Bf extends Ve {
  constructor(t = new L(), e = new L(), n = new L()) {
    super(), this.isQuadraticBezierCurve3 = !0, this.type = "QuadraticBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  getPoint(t, e = new L()) {
    const n = e, r = this.v0, s = this.v1, o = this.v2;
    return n.set(
      ri(t, r.x, s.x, o.x),
      ri(t, r.y, s.y, o.y),
      ri(t, r.z, s.z, o.z)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class io extends Ve {
  constructor(t = []) {
    super(), this.isSplineCurve = !0, this.type = "SplineCurve", this.points = t;
  }
  getPoint(t, e = new rt()) {
    const n = e, r = this.points, s = (r.length - 1) * t, o = Math.floor(s), a = s - o, l = r[o === 0 ? o : o - 1], c = r[o], h = r[o > r.length - 2 ? r.length - 1 : o + 1], f = r[o > r.length - 3 ? r.length - 1 : o + 2];
    return n.set(
      Ma(a, l.x, c.x, h.x, f.x),
      Ma(a, l.y, c.y, h.y, f.y)
    ), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(r.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const r = this.points[e];
      t.points.push(r.toArray());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(new rt().fromArray(r));
    }
    return this;
  }
}
var Qr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcCurve: wf,
  CatmullRomCurve3: Rf,
  CubicBezierCurve: to,
  CubicBezierCurve3: Ff,
  EllipseCurve: ps,
  LineCurve: eo,
  LineCurve3: Of,
  QuadraticBezierCurve: no,
  QuadraticBezierCurve3: Bf,
  SplineCurve: io
});
class zf extends Ve {
  constructor() {
    super(), this.type = "CurvePath", this.curves = [], this.autoClose = !1;
  }
  add(t) {
    this.curves.push(t);
  }
  closePath() {
    const t = this.curves[0].getPoint(0), e = this.curves[this.curves.length - 1].getPoint(1);
    if (!t.equals(e)) {
      const n = t.isVector2 === !0 ? "LineCurve" : "LineCurve3";
      this.curves.push(new Qr[n](e, t));
    }
    return this;
  }
  // To get accurate point with reference to
  // entire path distance at time t,
  // following has to be done:
  // 1. Length of each sub path have to be known
  // 2. Locate and identify type of curve
  // 3. Get t for the curve
  // 4. Return curve.getPointAt(t')
  getPoint(t, e) {
    const n = t * this.getLength(), r = this.getCurveLengths();
    let s = 0;
    for (; s < r.length; ) {
      if (r[s] >= n) {
        const o = r[s] - n, a = this.curves[s], l = a.getLength(), c = l === 0 ? 0 : 1 - o / l;
        return a.getPointAt(c, e);
      }
      s++;
    }
    return null;
  }
  // We cannot use the default THREE.Curve getPoint() with getLength() because in
  // THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
  // getPoint() depends on getLength
  getLength() {
    const t = this.getCurveLengths();
    return t[t.length - 1];
  }
  // cacheLengths must be recalculated.
  updateArcLengths() {
    this.needsUpdate = !0, this.cacheLengths = null, this.getCurveLengths();
  }
  // Compute lengths and cache them
  // We cannot overwrite getLengths() because UtoT mapping uses it.
  getCurveLengths() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length)
      return this.cacheLengths;
    const t = [];
    let e = 0;
    for (let n = 0, r = this.curves.length; n < r; n++)
      e += this.curves[n].getLength(), t.push(e);
    return this.cacheLengths = t, t;
  }
  getSpacedPoints(t = 40) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPoint(n / t));
    return this.autoClose && e.push(e[0]), e;
  }
  getPoints(t = 12) {
    const e = [];
    let n;
    for (let r = 0, s = this.curves; r < s.length; r++) {
      const o = s[r], a = o.isEllipseCurve ? t * 2 : o.isLineCurve || o.isLineCurve3 ? 1 : o.isSplineCurve ? t * o.points.length : t, l = o.getPoints(a);
      for (let c = 0; c < l.length; c++) {
        const h = l[c];
        n && n.equals(h) || (e.push(h), n = h);
      }
    }
    return this.autoClose && e.length > 1 && !e[e.length - 1].equals(e[0]) && e.push(e[0]), e;
  }
  copy(t) {
    super.copy(t), this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const r = t.curves[e];
      this.curves.push(r.clone());
    }
    return this.autoClose = t.autoClose, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.autoClose = this.autoClose, t.curves = [];
    for (let e = 0, n = this.curves.length; e < n; e++) {
      const r = this.curves[e];
      t.curves.push(r.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.autoClose = t.autoClose, this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const r = t.curves[e];
      this.curves.push(new Qr[r.type]().fromJSON(r));
    }
    return this;
  }
}
class Sa extends zf {
  constructor(t) {
    super(), this.type = "Path", this.currentPoint = new rt(), t && this.setFromPoints(t);
  }
  setFromPoints(t) {
    this.moveTo(t[0].x, t[0].y);
    for (let e = 1, n = t.length; e < n; e++)
      this.lineTo(t[e].x, t[e].y);
    return this;
  }
  moveTo(t, e) {
    return this.currentPoint.set(t, e), this;
  }
  lineTo(t, e) {
    const n = new eo(this.currentPoint.clone(), new rt(t, e));
    return this.curves.push(n), this.currentPoint.set(t, e), this;
  }
  quadraticCurveTo(t, e, n, r) {
    const s = new no(
      this.currentPoint.clone(),
      new rt(t, e),
      new rt(n, r)
    );
    return this.curves.push(s), this.currentPoint.set(n, r), this;
  }
  bezierCurveTo(t, e, n, r, s, o) {
    const a = new to(
      this.currentPoint.clone(),
      new rt(t, e),
      new rt(n, r),
      new rt(s, o)
    );
    return this.curves.push(a), this.currentPoint.set(s, o), this;
  }
  splineThru(t) {
    const e = [this.currentPoint.clone()].concat(t), n = new io(e);
    return this.curves.push(n), this.currentPoint.copy(t[t.length - 1]), this;
  }
  arc(t, e, n, r, s, o) {
    const a = this.currentPoint.x, l = this.currentPoint.y;
    return this.absarc(
      t + a,
      e + l,
      n,
      r,
      s,
      o
    ), this;
  }
  absarc(t, e, n, r, s, o) {
    return this.absellipse(t, e, n, n, r, s, o), this;
  }
  ellipse(t, e, n, r, s, o, a, l) {
    const c = this.currentPoint.x, h = this.currentPoint.y;
    return this.absellipse(t + c, e + h, n, r, s, o, a, l), this;
  }
  absellipse(t, e, n, r, s, o, a, l) {
    const c = new ps(t, e, n, r, s, o, a, l);
    if (this.curves.length > 0) {
      const f = c.getPoint(0);
      f.equals(this.currentPoint) || this.lineTo(f.x, f.y);
    }
    this.curves.push(c);
    const h = c.getPoint(1);
    return this.currentPoint.copy(h), this;
  }
  copy(t) {
    return super.copy(t), this.currentPoint.copy(t.currentPoint), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.currentPoint = this.currentPoint.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.currentPoint.fromArray(t.currentPoint), this;
  }
}
class vn extends ce {
  constructor(t = 1, e = 1, n = 1, r = 32, s = 1, o = !1, a = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: t,
      radiusBottom: e,
      height: n,
      radialSegments: r,
      heightSegments: s,
      openEnded: o,
      thetaStart: a,
      thetaLength: l
    };
    const c = this;
    r = Math.floor(r), s = Math.floor(s);
    const h = [], f = [], p = [], m = [];
    let g = 0;
    const _ = [], d = n / 2;
    let u = 0;
    T(), o === !1 && (t > 0 && v(!0), e > 0 && v(!1)), this.setIndex(h), this.setAttribute("position", new ve(f, 3)), this.setAttribute("normal", new ve(p, 3)), this.setAttribute("uv", new ve(m, 2));
    function T() {
      const b = new L(), R = new L();
      let A = 0;
      const w = (e - t) / n;
      for (let O = 0; O <= s; O++) {
        const M = [], S = O / s, U = S * (e - t) + t;
        for (let N = 0; N <= r; N++) {
          const Y = N / r, P = Y * l + a, B = Math.sin(P), H = Math.cos(P);
          R.x = U * B, R.y = -S * n + d, R.z = U * H, f.push(R.x, R.y, R.z), b.set(B, w, H).normalize(), p.push(b.x, b.y, b.z), m.push(Y, 1 - S), M.push(g++);
        }
        _.push(M);
      }
      for (let O = 0; O < r; O++)
        for (let M = 0; M < s; M++) {
          const S = _[M][O], U = _[M + 1][O], N = _[M + 1][O + 1], Y = _[M][O + 1];
          h.push(S, U, Y), h.push(U, N, Y), A += 6;
        }
      c.addGroup(u, A, 0), u += A;
    }
    function v(b) {
      const R = g, A = new rt(), w = new L();
      let O = 0;
      const M = b === !0 ? t : e, S = b === !0 ? 1 : -1;
      for (let N = 1; N <= r; N++)
        f.push(0, d * S, 0), p.push(0, S, 0), m.push(0.5, 0.5), g++;
      const U = g;
      for (let N = 0; N <= r; N++) {
        const P = N / r * l + a, B = Math.cos(P), H = Math.sin(P);
        w.x = M * H, w.y = d * S, w.z = M * B, f.push(w.x, w.y, w.z), p.push(0, S, 0), A.x = B * 0.5 + 0.5, A.y = H * 0.5 * S + 0.5, m.push(A.x, A.y), g++;
      }
      for (let N = 0; N < r; N++) {
        const Y = R + N, P = U + N;
        b === !0 ? h.push(P, P + 1, Y) : h.push(P + 1, P, Y), O += 3;
      }
      c.addGroup(u, O, b === !0 ? 1 : 2), u += O;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new vn(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class gs extends vn {
  constructor(t = 1, e = 1, n = 32, r = 1, s = !1, o = 0, a = Math.PI * 2) {
    super(0, t, e, n, r, s, o, a), this.type = "ConeGeometry", this.parameters = {
      radius: t,
      height: e,
      radialSegments: n,
      heightSegments: r,
      openEnded: s,
      thetaStart: o,
      thetaLength: a
    };
  }
  static fromJSON(t) {
    return new gs(t.radius, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class ro extends Sa {
  constructor(t) {
    super(t), this.uuid = je(), this.type = "Shape", this.holes = [];
  }
  getPointsHoles(t) {
    const e = [];
    for (let n = 0, r = this.holes.length; n < r; n++)
      e[n] = this.holes[n].getPoints(t);
    return e;
  }
  // get points of shape and holes (keypoints based on segments parameter)
  extractPoints(t) {
    return {
      shape: this.getPoints(t),
      holes: this.getPointsHoles(t)
    };
  }
  copy(t) {
    super.copy(t), this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const r = t.holes[e];
      this.holes.push(r.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.uuid = this.uuid, t.holes = [];
    for (let e = 0, n = this.holes.length; e < n; e++) {
      const r = this.holes[e];
      t.holes.push(r.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.uuid = t.uuid, this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const r = t.holes[e];
      this.holes.push(new Sa().fromJSON(r));
    }
    return this;
  }
}
const Gf = {
  triangulate: function(i, t, e = 2) {
    const n = t && t.length, r = n ? t[0] * e : i.length;
    let s = so(i, 0, r, e, !0);
    const o = [];
    if (!s || s.next === s.prev) return o;
    let a, l, c, h, f, p, m;
    if (n && (s = Xf(i, t, s, e)), i.length > 80 * e) {
      a = c = i[0], l = h = i[1];
      for (let g = e; g < r; g += e)
        f = i[g], p = i[g + 1], f < a && (a = f), p < l && (l = p), f > c && (c = f), p > h && (h = p);
      m = Math.max(c - a, h - l), m = m !== 0 ? 32767 / m : 0;
    }
    return ci(s, o, e, a, l, m, 0), o;
  }
};
function so(i, t, e, n, r) {
  let s, o;
  if (r === nd(i, t, e, n) > 0)
    for (s = t; s < e; s += n) o = ya(s, i[s], i[s + 1], o);
  else
    for (s = e - n; s >= t; s -= n) o = ya(s, i[s], i[s + 1], o);
  return o && lr(o, o.next) && (ui(o), o = o.next), o;
}
function xn(i, t) {
  if (!i) return i;
  t || (t = i);
  let e = i, n;
  do
    if (n = !1, !e.steiner && (lr(e, e.next) || ne(e.prev, e, e.next) === 0)) {
      if (ui(e), e = t = e.prev, e === e.next) break;
      n = !0;
    } else
      e = e.next;
  while (n || e !== t);
  return t;
}
function ci(i, t, e, n, r, s, o) {
  if (!i) return;
  !o && s && Kf(i, n, r, s);
  let a = i, l, c;
  for (; i.prev !== i.next; ) {
    if (l = i.prev, c = i.next, s ? Vf(i, n, r, s) : Hf(i)) {
      t.push(l.i / e | 0), t.push(i.i / e | 0), t.push(c.i / e | 0), ui(i), i = c.next, a = c.next;
      continue;
    }
    if (i = c, i === a) {
      o ? o === 1 ? (i = kf(xn(i), t, e), ci(i, t, e, n, r, s, 2)) : o === 2 && Wf(i, t, e, n, r, s) : ci(xn(i), t, e, n, r, s, 1);
      break;
    }
  }
}
function Hf(i) {
  const t = i.prev, e = i, n = i.next;
  if (ne(t, e, n) >= 0) return !1;
  const r = t.x, s = e.x, o = n.x, a = t.y, l = e.y, c = n.y, h = r < s ? r < o ? r : o : s < o ? s : o, f = a < l ? a < c ? a : c : l < c ? l : c, p = r > s ? r > o ? r : o : s > o ? s : o, m = a > l ? a > c ? a : c : l > c ? l : c;
  let g = n.next;
  for (; g !== t; ) {
    if (g.x >= h && g.x <= p && g.y >= f && g.y <= m && Vn(r, a, s, l, o, c, g.x, g.y) && ne(g.prev, g, g.next) >= 0) return !1;
    g = g.next;
  }
  return !0;
}
function Vf(i, t, e, n) {
  const r = i.prev, s = i, o = i.next;
  if (ne(r, s, o) >= 0) return !1;
  const a = r.x, l = s.x, c = o.x, h = r.y, f = s.y, p = o.y, m = a < l ? a < c ? a : c : l < c ? l : c, g = h < f ? h < p ? h : p : f < p ? f : p, _ = a > l ? a > c ? a : c : l > c ? l : c, d = h > f ? h > p ? h : p : f > p ? f : p, u = ts(m, g, t, e, n), T = ts(_, d, t, e, n);
  let v = i.prevZ, b = i.nextZ;
  for (; v && v.z >= u && b && b.z <= T; ) {
    if (v.x >= m && v.x <= _ && v.y >= g && v.y <= d && v !== r && v !== o && Vn(a, h, l, f, c, p, v.x, v.y) && ne(v.prev, v, v.next) >= 0 || (v = v.prevZ, b.x >= m && b.x <= _ && b.y >= g && b.y <= d && b !== r && b !== o && Vn(a, h, l, f, c, p, b.x, b.y) && ne(b.prev, b, b.next) >= 0)) return !1;
    b = b.nextZ;
  }
  for (; v && v.z >= u; ) {
    if (v.x >= m && v.x <= _ && v.y >= g && v.y <= d && v !== r && v !== o && Vn(a, h, l, f, c, p, v.x, v.y) && ne(v.prev, v, v.next) >= 0) return !1;
    v = v.prevZ;
  }
  for (; b && b.z <= T; ) {
    if (b.x >= m && b.x <= _ && b.y >= g && b.y <= d && b !== r && b !== o && Vn(a, h, l, f, c, p, b.x, b.y) && ne(b.prev, b, b.next) >= 0) return !1;
    b = b.nextZ;
  }
  return !0;
}
function kf(i, t, e) {
  let n = i;
  do {
    const r = n.prev, s = n.next.next;
    !lr(r, s) && ao(r, n, n.next, s) && hi(r, s) && hi(s, r) && (t.push(r.i / e | 0), t.push(n.i / e | 0), t.push(s.i / e | 0), ui(n), ui(n.next), n = i = s), n = n.next;
  } while (n !== i);
  return xn(n);
}
function Wf(i, t, e, n, r, s) {
  let o = i;
  do {
    let a = o.next.next;
    for (; a !== o.prev; ) {
      if (o.i !== a.i && Qf(o, a)) {
        let l = oo(o, a);
        o = xn(o, o.next), l = xn(l, l.next), ci(o, t, e, n, r, s, 0), ci(l, t, e, n, r, s, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== i);
}
function Xf(i, t, e, n) {
  const r = [];
  let s, o, a, l, c;
  for (s = 0, o = t.length; s < o; s++)
    a = t[s] * n, l = s < o - 1 ? t[s + 1] * n : i.length, c = so(i, a, l, n, !1), c === c.next && (c.steiner = !0), r.push($f(c));
  for (r.sort(qf), s = 0; s < r.length; s++)
    e = Yf(r[s], e);
  return e;
}
function qf(i, t) {
  return i.x - t.x;
}
function Yf(i, t) {
  const e = Zf(i, t);
  if (!e)
    return t;
  const n = oo(e, i);
  return xn(n, n.next), xn(e, e.next);
}
function Zf(i, t) {
  let e = t, n = -1 / 0, r;
  const s = i.x, o = i.y;
  do {
    if (o <= e.y && o >= e.next.y && e.next.y !== e.y) {
      const p = e.x + (o - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (p <= s && p > n && (n = p, r = e.x < e.next.x ? e : e.next, p === s))
        return r;
    }
    e = e.next;
  } while (e !== t);
  if (!r) return null;
  const a = r, l = r.x, c = r.y;
  let h = 1 / 0, f;
  e = r;
  do
    s >= e.x && e.x >= l && s !== e.x && Vn(o < c ? s : n, o, l, c, o < c ? n : s, o, e.x, e.y) && (f = Math.abs(o - e.y) / (s - e.x), hi(e, i) && (f < h || f === h && (e.x > r.x || e.x === r.x && Jf(r, e))) && (r = e, h = f)), e = e.next;
  while (e !== a);
  return r;
}
function Jf(i, t) {
  return ne(i.prev, i, t.prev) < 0 && ne(t.next, i, i.next) < 0;
}
function Kf(i, t, e, n) {
  let r = i;
  do
    r.z === 0 && (r.z = ts(r.x, r.y, t, e, n)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== i);
  r.prevZ.nextZ = null, r.prevZ = null, jf(r);
}
function jf(i) {
  let t, e, n, r, s, o, a, l, c = 1;
  do {
    for (e = i, i = null, s = null, o = 0; e; ) {
      for (o++, n = e, a = 0, t = 0; t < c && (a++, n = n.nextZ, !!n); t++)
        ;
      for (l = c; a > 0 || l > 0 && n; )
        a !== 0 && (l === 0 || !n || e.z <= n.z) ? (r = e, e = e.nextZ, a--) : (r = n, n = n.nextZ, l--), s ? s.nextZ = r : i = r, r.prevZ = s, s = r;
      e = n;
    }
    s.nextZ = null, c *= 2;
  } while (o > 1);
  return i;
}
function ts(i, t, e, n, r) {
  return i = (i - e) * r | 0, t = (t - n) * r | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
}
function $f(i) {
  let t = i, e = i;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== i);
  return e;
}
function Vn(i, t, e, n, r, s, o, a) {
  return (r - o) * (t - a) >= (i - o) * (s - a) && (i - o) * (n - a) >= (e - o) * (t - a) && (e - o) * (s - a) >= (r - o) * (n - a);
}
function Qf(i, t) {
  return i.next.i !== t.i && i.prev.i !== t.i && !td(i, t) && // dones't intersect other edges
  (hi(i, t) && hi(t, i) && ed(i, t) && // locally visible
  (ne(i.prev, i, t.prev) || ne(i, t.prev, t)) || // does not create opposite-facing sectors
  lr(i, t) && ne(i.prev, i, i.next) > 0 && ne(t.prev, t, t.next) > 0);
}
function ne(i, t, e) {
  return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
}
function lr(i, t) {
  return i.x === t.x && i.y === t.y;
}
function ao(i, t, e, n) {
  const r = Ki(ne(i, t, e)), s = Ki(ne(i, t, n)), o = Ki(ne(e, n, i)), a = Ki(ne(e, n, t));
  return !!(r !== s && o !== a || r === 0 && Ji(i, e, t) || s === 0 && Ji(i, n, t) || o === 0 && Ji(e, i, n) || a === 0 && Ji(e, t, n));
}
function Ji(i, t, e) {
  return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
}
function Ki(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function td(i, t) {
  let e = i;
  do {
    if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && ao(e, e.next, i, t)) return !0;
    e = e.next;
  } while (e !== i);
  return !1;
}
function hi(i, t) {
  return ne(i.prev, i, i.next) < 0 ? ne(i, t, i.next) >= 0 && ne(i, i.prev, t) >= 0 : ne(i, t, i.prev) < 0 || ne(i, i.next, t) < 0;
}
function ed(i, t) {
  let e = i, n = !1;
  const r = (i.x + t.x) / 2, s = (i.y + t.y) / 2;
  do
    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
  while (e !== i);
  return n;
}
function oo(i, t) {
  const e = new es(i.i, i.x, i.y), n = new es(t.i, t.x, t.y), r = i.next, s = t.prev;
  return i.next = t, t.prev = i, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, n.prev = s, n;
}
function ya(i, t, e, n) {
  const r = new es(i, t, e);
  return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, r.next = r), r;
}
function ui(i) {
  i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
}
function es(i, t, e) {
  this.i = i, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
function nd(i, t, e, n) {
  let r = 0;
  for (let s = t, o = e - n; s < e; s += n)
    r += (i[o] - i[s]) * (i[s + 1] + i[o + 1]), o = s;
  return r;
}
class ai {
  // calculate area of the contour polygon
  static area(t) {
    const e = t.length;
    let n = 0;
    for (let r = e - 1, s = 0; s < e; r = s++)
      n += t[r].x * t[s].y - t[s].x * t[r].y;
    return n * 0.5;
  }
  static isClockWise(t) {
    return ai.area(t) < 0;
  }
  static triangulateShape(t, e) {
    const n = [], r = [], s = [];
    Ea(t), Ta(n, t);
    let o = t.length;
    e.forEach(Ea);
    for (let l = 0; l < e.length; l++)
      r.push(o), o += e[l].length, Ta(n, e[l]);
    const a = Gf.triangulate(n, r);
    for (let l = 0; l < a.length; l += 3)
      s.push(a.slice(l, l + 3));
    return s;
  }
}
function Ea(i) {
  const t = i.length;
  t > 2 && i[t - 1].equals(i[0]) && i.pop();
}
function Ta(i, t) {
  for (let e = 0; e < t.length; e++)
    i.push(t[e].x), i.push(t[e].y);
}
class _s extends ce {
  constructor(t = new ro([new rt(0.5, 0.5), new rt(-0.5, 0.5), new rt(-0.5, -0.5), new rt(0.5, -0.5)]), e = {}) {
    super(), this.type = "ExtrudeGeometry", this.parameters = {
      shapes: t,
      options: e
    }, t = Array.isArray(t) ? t : [t];
    const n = this, r = [], s = [];
    for (let a = 0, l = t.length; a < l; a++) {
      const c = t[a];
      o(c);
    }
    this.setAttribute("position", new ve(r, 3)), this.setAttribute("uv", new ve(s, 2)), this.computeVertexNormals();
    function o(a) {
      const l = [], c = e.curveSegments !== void 0 ? e.curveSegments : 12, h = e.steps !== void 0 ? e.steps : 1, f = e.depth !== void 0 ? e.depth : 1;
      let p = e.bevelEnabled !== void 0 ? e.bevelEnabled : !0, m = e.bevelThickness !== void 0 ? e.bevelThickness : 0.2, g = e.bevelSize !== void 0 ? e.bevelSize : m - 0.1, _ = e.bevelOffset !== void 0 ? e.bevelOffset : 0, d = e.bevelSegments !== void 0 ? e.bevelSegments : 3;
      const u = e.extrudePath, T = e.UVGenerator !== void 0 ? e.UVGenerator : id;
      let v, b = !1, R, A, w, O;
      u && (v = u.getSpacedPoints(h), b = !0, p = !1, R = u.computeFrenetFrames(h, !1), A = new L(), w = new L(), O = new L()), p || (d = 0, m = 0, g = 0, _ = 0);
      const M = a.extractPoints(c);
      let S = M.shape;
      const U = M.holes;
      if (!ai.isClockWise(S)) {
        S = S.reverse();
        for (let C = 0, st = U.length; C < st; C++) {
          const Z = U[C];
          ai.isClockWise(Z) && (U[C] = Z.reverse());
        }
      }
      const Y = ai.triangulateShape(S, U), P = S;
      for (let C = 0, st = U.length; C < st; C++) {
        const Z = U[C];
        S = S.concat(Z);
      }
      function B(C, st, Z) {
        return st || console.error("THREE.ExtrudeGeometry: vec does not exist"), C.clone().addScaledVector(st, Z);
      }
      const H = S.length, J = Y.length;
      function X(C, st, Z) {
        let it, q, yt;
        const dt = C.x - st.x, y = C.y - st.y, x = Z.x - C.x, F = Z.y - C.y, nt = dt * dt + y * y, $ = dt * F - y * x;
        if (Math.abs($) > Number.EPSILON) {
          const K = Math.sqrt(nt), vt = Math.sqrt(x * x + F * F), lt = st.x - y / K, gt = st.y + dt / K, Tt = Z.x - F / vt, It = Z.y + x / vt, Q = ((Tt - lt) * F - (It - gt) * x) / (dt * F - y * x);
          it = lt + dt * Q - C.x, q = gt + y * Q - C.y;
          const Wt = it * it + q * q;
          if (Wt <= 2)
            return new rt(it, q);
          yt = Math.sqrt(Wt / 2);
        } else {
          let K = !1;
          dt > Number.EPSILON ? x > Number.EPSILON && (K = !0) : dt < -Number.EPSILON ? x < -Number.EPSILON && (K = !0) : Math.sign(y) === Math.sign(F) && (K = !0), K ? (it = -y, q = dt, yt = Math.sqrt(nt)) : (it = dt, q = y, yt = Math.sqrt(nt / 2));
        }
        return new rt(it / yt, q / yt);
      }
      const W = [];
      for (let C = 0, st = P.length, Z = st - 1, it = C + 1; C < st; C++, Z++, it++)
        Z === st && (Z = 0), it === st && (it = 0), W[C] = X(P[C], P[Z], P[it]);
      const tt = [];
      let et, ut = W.concat();
      for (let C = 0, st = U.length; C < st; C++) {
        const Z = U[C];
        et = [];
        for (let it = 0, q = Z.length, yt = q - 1, dt = it + 1; it < q; it++, yt++, dt++)
          yt === q && (yt = 0), dt === q && (dt = 0), et[it] = X(Z[it], Z[yt], Z[dt]);
        tt.push(et), ut = ut.concat(et);
      }
      for (let C = 0; C < d; C++) {
        const st = C / d, Z = m * Math.cos(st * Math.PI / 2), it = g * Math.sin(st * Math.PI / 2) + _;
        for (let q = 0, yt = P.length; q < yt; q++) {
          const dt = B(P[q], W[q], it);
          mt(dt.x, dt.y, -Z);
        }
        for (let q = 0, yt = U.length; q < yt; q++) {
          const dt = U[q];
          et = tt[q];
          for (let y = 0, x = dt.length; y < x; y++) {
            const F = B(dt[y], et[y], it);
            mt(F.x, F.y, -Z);
          }
        }
      }
      const k = g + _;
      for (let C = 0; C < H; C++) {
        const st = p ? B(S[C], ut[C], k) : S[C];
        b ? (w.copy(R.normals[0]).multiplyScalar(st.x), A.copy(R.binormals[0]).multiplyScalar(st.y), O.copy(v[0]).add(w).add(A), mt(O.x, O.y, O.z)) : mt(st.x, st.y, 0);
      }
      for (let C = 1; C <= h; C++)
        for (let st = 0; st < H; st++) {
          const Z = p ? B(S[st], ut[st], k) : S[st];
          b ? (w.copy(R.normals[C]).multiplyScalar(Z.x), A.copy(R.binormals[C]).multiplyScalar(Z.y), O.copy(v[C]).add(w).add(A), mt(O.x, O.y, O.z)) : mt(Z.x, Z.y, f / h * C);
        }
      for (let C = d - 1; C >= 0; C--) {
        const st = C / d, Z = m * Math.cos(st * Math.PI / 2), it = g * Math.sin(st * Math.PI / 2) + _;
        for (let q = 0, yt = P.length; q < yt; q++) {
          const dt = B(P[q], W[q], it);
          mt(dt.x, dt.y, f + Z);
        }
        for (let q = 0, yt = U.length; q < yt; q++) {
          const dt = U[q];
          et = tt[q];
          for (let y = 0, x = dt.length; y < x; y++) {
            const F = B(dt[y], et[y], it);
            b ? mt(F.x, F.y + v[h - 1].y, v[h - 1].x + Z) : mt(F.x, F.y, f + Z);
          }
        }
      }
      j(), ft();
      function j() {
        const C = r.length / 3;
        if (p) {
          let st = 0, Z = H * st;
          for (let it = 0; it < J; it++) {
            const q = Y[it];
            wt(q[2] + Z, q[1] + Z, q[0] + Z);
          }
          st = h + d * 2, Z = H * st;
          for (let it = 0; it < J; it++) {
            const q = Y[it];
            wt(q[0] + Z, q[1] + Z, q[2] + Z);
          }
        } else {
          for (let st = 0; st < J; st++) {
            const Z = Y[st];
            wt(Z[2], Z[1], Z[0]);
          }
          for (let st = 0; st < J; st++) {
            const Z = Y[st];
            wt(Z[0] + H * h, Z[1] + H * h, Z[2] + H * h);
          }
        }
        n.addGroup(C, r.length / 3 - C, 0);
      }
      function ft() {
        const C = r.length / 3;
        let st = 0;
        xt(P, st), st += P.length;
        for (let Z = 0, it = U.length; Z < it; Z++) {
          const q = U[Z];
          xt(q, st), st += q.length;
        }
        n.addGroup(C, r.length / 3 - C, 1);
      }
      function xt(C, st) {
        let Z = C.length;
        for (; --Z >= 0; ) {
          const it = Z;
          let q = Z - 1;
          q < 0 && (q = C.length - 1);
          for (let yt = 0, dt = h + d * 2; yt < dt; yt++) {
            const y = H * yt, x = H * (yt + 1), F = st + it + y, nt = st + q + y, $ = st + q + x, K = st + it + x;
            Dt(F, nt, $, K);
          }
        }
      }
      function mt(C, st, Z) {
        l.push(C), l.push(st), l.push(Z);
      }
      function wt(C, st, Z) {
        Mt(C), Mt(st), Mt(Z);
        const it = r.length / 3, q = T.generateTopUV(n, r, it - 3, it - 2, it - 1);
        Pt(q[0]), Pt(q[1]), Pt(q[2]);
      }
      function Dt(C, st, Z, it) {
        Mt(C), Mt(st), Mt(it), Mt(st), Mt(Z), Mt(it);
        const q = r.length / 3, yt = T.generateSideWallUV(n, r, q - 6, q - 3, q - 2, q - 1);
        Pt(yt[0]), Pt(yt[1]), Pt(yt[3]), Pt(yt[1]), Pt(yt[2]), Pt(yt[3]);
      }
      function Mt(C) {
        r.push(l[C * 3 + 0]), r.push(l[C * 3 + 1]), r.push(l[C * 3 + 2]);
      }
      function Pt(C) {
        s.push(C.x), s.push(C.y);
      }
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON(), e = this.parameters.shapes, n = this.parameters.options;
    return rd(e, n, t);
  }
  static fromJSON(t, e) {
    const n = [];
    for (let s = 0, o = t.shapes.length; s < o; s++) {
      const a = e[t.shapes[s]];
      n.push(a);
    }
    const r = t.options.extrudePath;
    return r !== void 0 && (t.options.extrudePath = new Qr[r.type]().fromJSON(r)), new _s(n, t.options);
  }
}
const id = {
  generateTopUV: function(i, t, e, n, r) {
    const s = t[e * 3], o = t[e * 3 + 1], a = t[n * 3], l = t[n * 3 + 1], c = t[r * 3], h = t[r * 3 + 1];
    return [
      new rt(s, o),
      new rt(a, l),
      new rt(c, h)
    ];
  },
  generateSideWallUV: function(i, t, e, n, r, s) {
    const o = t[e * 3], a = t[e * 3 + 1], l = t[e * 3 + 2], c = t[n * 3], h = t[n * 3 + 1], f = t[n * 3 + 2], p = t[r * 3], m = t[r * 3 + 1], g = t[r * 3 + 2], _ = t[s * 3], d = t[s * 3 + 1], u = t[s * 3 + 2];
    return Math.abs(a - h) < Math.abs(o - c) ? [
      new rt(o, 1 - l),
      new rt(c, 1 - f),
      new rt(p, 1 - g),
      new rt(_, 1 - u)
    ] : [
      new rt(a, 1 - l),
      new rt(h, 1 - f),
      new rt(m, 1 - g),
      new rt(d, 1 - u)
    ];
  }
};
function rd(i, t, e) {
  if (e.shapes = [], Array.isArray(i))
    for (let n = 0, r = i.length; n < r; n++) {
      const s = i[n];
      e.shapes.push(s.uuid);
    }
  else
    e.shapes.push(i.uuid);
  return e.options = Object.assign({}, t), t.extrudePath !== void 0 && (e.options.extrudePath = t.extrudePath.toJSON()), e;
}
class an extends ce {
  constructor(t = 1, e = 32, n = 16, r = 0, s = Math.PI * 2, o = 0, a = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = {
      radius: t,
      widthSegments: e,
      heightSegments: n,
      phiStart: r,
      phiLength: s,
      thetaStart: o,
      thetaLength: a
    }, e = Math.max(3, Math.floor(e)), n = Math.max(2, Math.floor(n));
    const l = Math.min(o + a, Math.PI);
    let c = 0;
    const h = [], f = new L(), p = new L(), m = [], g = [], _ = [], d = [];
    for (let u = 0; u <= n; u++) {
      const T = [], v = u / n;
      let b = 0;
      u === 0 && o === 0 ? b = 0.5 / e : u === n && l === Math.PI && (b = -0.5 / e);
      for (let R = 0; R <= e; R++) {
        const A = R / e;
        f.x = -t * Math.cos(r + A * s) * Math.sin(o + v * a), f.y = t * Math.cos(o + v * a), f.z = t * Math.sin(r + A * s) * Math.sin(o + v * a), g.push(f.x, f.y, f.z), p.copy(f).normalize(), _.push(p.x, p.y, p.z), d.push(A + b, 1 - v), T.push(c++);
      }
      h.push(T);
    }
    for (let u = 0; u < n; u++)
      for (let T = 0; T < e; T++) {
        const v = h[u][T + 1], b = h[u][T], R = h[u + 1][T], A = h[u + 1][T + 1];
        (u !== 0 || o > 0) && m.push(v, b, A), (u !== n - 1 || l < Math.PI) && m.push(b, R, A);
      }
    this.setIndex(m), this.setAttribute("position", new ve(g, 3)), this.setAttribute("normal", new ve(_, 3)), this.setAttribute("uv", new ve(d, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new an(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
  }
}
class oi extends ln {
  constructor(t) {
    super(), this.isMeshStandardMaterial = !0, this.defines = { STANDARD: "" }, this.type = "MeshStandardMaterial", this.color = new Bt(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Bt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new rt(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "" }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
const ba = {
  enabled: !1,
  files: {},
  add: function(i, t) {
    this.enabled !== !1 && (this.files[i] = t);
  },
  get: function(i) {
    if (this.enabled !== !1)
      return this.files[i];
  },
  remove: function(i) {
    delete this.files[i];
  },
  clear: function() {
    this.files = {};
  }
};
class sd {
  constructor(t, e, n) {
    const r = this;
    let s = !1, o = 0, a = 0, l;
    const c = [];
    this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = n, this.itemStart = function(h) {
      a++, s === !1 && r.onStart !== void 0 && r.onStart(h, o, a), s = !0;
    }, this.itemEnd = function(h) {
      o++, r.onProgress !== void 0 && r.onProgress(h, o, a), o === a && (s = !1, r.onLoad !== void 0 && r.onLoad());
    }, this.itemError = function(h) {
      r.onError !== void 0 && r.onError(h);
    }, this.resolveURL = function(h) {
      return l ? l(h) : h;
    }, this.setURLModifier = function(h) {
      return l = h, this;
    }, this.addHandler = function(h, f) {
      return c.push(h, f), this;
    }, this.removeHandler = function(h) {
      const f = c.indexOf(h);
      return f !== -1 && c.splice(f, 2), this;
    }, this.getHandler = function(h) {
      for (let f = 0, p = c.length; f < p; f += 2) {
        const m = c[f], g = c[f + 1];
        if (m.global && (m.lastIndex = 0), m.test(h))
          return g;
      }
      return null;
    };
  }
}
const ad = /* @__PURE__ */ new sd();
class vs {
  constructor(t) {
    this.manager = t !== void 0 ? t : ad, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(t, e) {
    const n = this;
    return new Promise(function(r, s) {
      n.load(t, r, e, s);
    });
  }
  parse() {
  }
  setCrossOrigin(t) {
    return this.crossOrigin = t, this;
  }
  setWithCredentials(t) {
    return this.withCredentials = t, this;
  }
  setPath(t) {
    return this.path = t, this;
  }
  setResourcePath(t) {
    return this.resourcePath = t, this;
  }
  setRequestHeader(t) {
    return this.requestHeader = t, this;
  }
}
vs.DEFAULT_MATERIAL_NAME = "__DEFAULT";
class od extends vs {
  constructor(t) {
    super(t);
  }
  load(t, e, n, r) {
    this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const s = this, o = ba.get(t);
    if (o !== void 0)
      return s.manager.itemStart(t), setTimeout(function() {
        e && e(o), s.manager.itemEnd(t);
      }, 0), o;
    const a = li("img");
    function l() {
      h(), ba.add(t, this), e && e(this), s.manager.itemEnd(t);
    }
    function c(f) {
      h(), r && r(f), s.manager.itemError(t), s.manager.itemEnd(t);
    }
    function h() {
      a.removeEventListener("load", l, !1), a.removeEventListener("error", c, !1);
    }
    return a.addEventListener("load", l, !1), a.addEventListener("error", c, !1), t.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (a.crossOrigin = this.crossOrigin), s.manager.itemStart(t), a.src = t, a;
  }
}
class ld extends vs {
  constructor(t) {
    super(t);
  }
  load(t, e, n, r) {
    const s = new we(), o = new od(this.manager);
    return o.setCrossOrigin(this.crossOrigin), o.setPath(this.path), o.load(t, function(a) {
      s.image = a, s.needsUpdate = !0, e !== void 0 && e(s);
    }, n, r), s;
  }
}
class xs extends ue {
  constructor(t, e = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Bt(t), this.intensity = e;
  }
  dispose() {
  }
  copy(t, e) {
    return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), e;
  }
}
const Wr = /* @__PURE__ */ new te(), Aa = /* @__PURE__ */ new L(), wa = /* @__PURE__ */ new L();
class lo {
  constructor(t) {
    this.camera = t, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new rt(512, 512), this.map = null, this.mapPass = null, this.matrix = new te(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new cs(), this._frameExtents = new rt(1, 1), this._viewportCount = 1, this._viewports = [
      new Qt(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(t) {
    const e = this.camera, n = this.matrix;
    Aa.setFromMatrixPosition(t.matrixWorld), e.position.copy(Aa), wa.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(wa), e.updateMatrixWorld(), Wr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Wr), n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(Wr);
  }
  getViewport(t) {
    return this._viewports[t];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(t) {
    return this.camera = t.camera.clone(), this.bias = t.bias, this.radius = t.radius, this.mapSize.copy(t.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const t = {};
    return this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(!1).object, delete t.camera.matrix, t;
  }
}
const Ra = /* @__PURE__ */ new te(), ni = /* @__PURE__ */ new L(), Xr = /* @__PURE__ */ new L();
class cd extends lo {
  constructor() {
    super(new De(90, 1, 0.5, 500)), this.isPointLightShadow = !0, this._frameExtents = new rt(4, 2), this._viewportCount = 6, this._viewports = [
      // These viewports map a cube-map onto a 2D texture with the
      // following orientation:
      //
      //  xzXZ
      //   y Y
      //
      // X - Positive x direction
      // x - Negative x direction
      // Y - Positive y direction
      // y - Negative y direction
      // Z - Positive z direction
      // z - Negative z direction
      // positive X
      new Qt(2, 1, 1, 1),
      // negative X
      new Qt(0, 1, 1, 1),
      // positive Z
      new Qt(3, 1, 1, 1),
      // negative Z
      new Qt(1, 1, 1, 1),
      // positive Y
      new Qt(3, 0, 1, 1),
      // negative Y
      new Qt(1, 0, 1, 1)
    ], this._cubeDirections = [
      new L(1, 0, 0),
      new L(-1, 0, 0),
      new L(0, 0, 1),
      new L(0, 0, -1),
      new L(0, 1, 0),
      new L(0, -1, 0)
    ], this._cubeUps = [
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 1, 0),
      new L(0, 0, 1),
      new L(0, 0, -1)
    ];
  }
  updateMatrices(t, e = 0) {
    const n = this.camera, r = this.matrix, s = t.distance || n.far;
    s !== n.far && (n.far = s, n.updateProjectionMatrix()), ni.setFromMatrixPosition(t.matrixWorld), n.position.copy(ni), Xr.copy(n.position), Xr.add(this._cubeDirections[e]), n.up.copy(this._cubeUps[e]), n.lookAt(Xr), n.updateMatrixWorld(), r.makeTranslation(-ni.x, -ni.y, -ni.z), Ra.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Ra);
  }
}
class co extends xs {
  constructor(t, e, n = 0, r = 2) {
    super(t, e), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = r, this.shadow = new cd();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(t) {
    this.intensity = t / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t, e) {
    return super.copy(t, e), this.distance = t.distance, this.decay = t.decay, this.shadow = t.shadow.clone(), this;
  }
}
class hd extends lo {
  constructor() {
    super(new hs(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class ud extends xs {
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(ue.DEFAULT_UP), this.updateMatrix(), this.target = new ue(), this.shadow = new hd();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
class fd extends xs {
  constructor(t, e) {
    super(t, e), this.isAmbientLight = !0, this.type = "AmbientLight";
  }
}
class ho {
  constructor(t = !0) {
    this.autoStart = t, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1;
  }
  start() {
    this.startTime = Ca(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }
  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let t = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const e = Ca();
      t = (e - this.oldTime) / 1e3, this.oldTime = e, this.elapsedTime += t;
    }
    return t;
  }
}
function Ca() {
  return (typeof performance > "u" ? Date : performance).now();
}
class dd {
  constructor(t, e, n = 0, r = 1 / 0) {
    this.ray = new ir(t, e), this.near = n, this.far = r, this.camera = null, this.layers = new ls(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  set(t, e) {
    this.ray.set(t, e);
  }
  setFromCamera(t, e) {
    e.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(t.x, t.y, 0.5).unproject(e).sub(this.ray.origin).normalize(), this.camera = e) : e.isOrthographicCamera ? (this.ray.origin.set(t.x, t.y, (e.near + e.far) / (e.near - e.far)).unproject(e), this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld), this.camera = e) : console.error("THREE.Raycaster: Unsupported camera type: " + e.type);
  }
  intersectObject(t, e = !0, n = []) {
    return ns(t, this, n, e), n.sort(Pa), n;
  }
  intersectObjects(t, e = !0, n = []) {
    for (let r = 0, s = t.length; r < s; r++)
      ns(t[r], this, n, e);
    return n.sort(Pa), n;
  }
}
function Pa(i, t) {
  return i.distance - t.distance;
}
function ns(i, t, e, n) {
  if (i.layers.test(t.layers) && i.raycast(t, e), n === !0) {
    const r = i.children;
    for (let s = 0, o = r.length; s < o; s++)
      ns(r[s], t, e, !0);
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: as
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = as);
const pd = {
  name: "CopyShader",
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
  )
};
class cr {
  constructor() {
    this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
  }
  setSize() {
  }
  render() {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {
  }
}
const md = new hs(-1, 1, 1, -1, 0, 1);
class gd extends ce {
  constructor() {
    super(), this.setAttribute("position", new ve([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new ve([0, 2, 0, 0, 2, 0], 2));
  }
}
const _d = new gd();
class vd {
  constructor(t) {
    this._mesh = new ie(_d, t);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(t) {
    t.render(this._mesh, md);
  }
  get material() {
    return this._mesh.material;
  }
  set material(t) {
    this._mesh.material = t;
  }
}
class is extends cr {
  constructor(t, e) {
    super(), this.textureID = e !== void 0 ? e : "tDiffuse", t instanceof Re ? (this.uniforms = t.uniforms, this.material = t) : t && (this.uniforms = Ha.clone(t.uniforms), this.material = new Re({
      name: t.name !== void 0 ? t.name : "unspecified",
      defines: Object.assign({}, t.defines),
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    })), this.fsQuad = new vd(this.material);
  }
  render(t, e, n) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture), this.fsQuad.material = this.material, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(e), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class La extends cr {
  constructor(t, e) {
    super(), this.scene = t, this.camera = e, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(t, e, n) {
    const r = t.getContext(), s = t.state;
    s.buffers.color.setMask(!1), s.buffers.depth.setMask(!1), s.buffers.color.setLocked(!0), s.buffers.depth.setLocked(!0);
    let o, a;
    this.inverse ? (o = 0, a = 1) : (o = 1, a = 0), s.buffers.stencil.setTest(!0), s.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE), s.buffers.stencil.setFunc(r.ALWAYS, o, 4294967295), s.buffers.stencil.setClear(a), s.buffers.stencil.setLocked(!0), t.setRenderTarget(n), this.clear && t.clear(), t.render(this.scene, this.camera), t.setRenderTarget(e), this.clear && t.clear(), t.render(this.scene, this.camera), s.buffers.color.setLocked(!1), s.buffers.depth.setLocked(!1), s.buffers.color.setMask(!0), s.buffers.depth.setMask(!0), s.buffers.stencil.setLocked(!1), s.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295), s.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP), s.buffers.stencil.setLocked(!0);
  }
}
class xd extends cr {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(t) {
    t.state.buffers.stencil.setLocked(!1), t.state.buffers.stencil.setTest(!1);
  }
}
class Md {
  constructor(t, e) {
    if (this.renderer = t, this._pixelRatio = t.getPixelRatio(), e === void 0) {
      const n = t.getSize(new rt());
      this._width = n.width, this._height = n.height, e = new on(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: 1016 }), e.texture.name = "EffectComposer.rt1";
    } else
      this._width = e.width, this._height = e.height;
    this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new is(pd), this.copyPass.material.blending = 0, this.clock = new ho();
  }
  swapBuffers() {
    const t = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = t;
  }
  addPass(t) {
    this.passes.push(t), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(t, e) {
    this.passes.splice(e, 0, t), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(t) {
    const e = this.passes.indexOf(t);
    e !== -1 && this.passes.splice(e, 1);
  }
  isLastEnabledPass(t) {
    for (let e = t + 1; e < this.passes.length; e++)
      if (this.passes[e].enabled)
        return !1;
    return !0;
  }
  render(t) {
    t === void 0 && (t = this.clock.getDelta());
    const e = this.renderer.getRenderTarget();
    let n = !1;
    for (let r = 0, s = this.passes.length; r < s; r++) {
      const o = this.passes[r];
      if (o.enabled !== !1) {
        if (o.renderToScreen = this.renderToScreen && this.isLastEnabledPass(r), o.render(this.renderer, this.writeBuffer, this.readBuffer, t, n), o.needsSwap) {
          if (n) {
            const a = this.renderer.getContext(), l = this.renderer.state.buffers.stencil;
            l.setFunc(a.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, t), l.setFunc(a.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        La !== void 0 && (o instanceof La ? n = !0 : o instanceof xd && (n = !1));
      }
    }
    this.renderer.setRenderTarget(e);
  }
  reset(t) {
    if (t === void 0) {
      const e = this.renderer.getSize(new rt());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = e.width, this._height = e.height, t = this.renderTarget1.clone(), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(t, e) {
    this._width = t, this._height = e;
    const n = this._width * this._pixelRatio, r = this._height * this._pixelRatio;
    this.renderTarget1.setSize(n, r), this.renderTarget2.setSize(n, r);
    for (let s = 0; s < this.passes.length; s++)
      this.passes[s].setSize(n, r);
  }
  setPixelRatio(t) {
    this._pixelRatio = t, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
class Sd extends cr {
  constructor(t, e, n = null, r = null, s = null) {
    super(), this.scene = t, this.camera = e, this.overrideMaterial = n, this.clearColor = r, this.clearAlpha = s, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new Bt();
  }
  render(t, e, n) {
    const r = t.autoClear;
    t.autoClear = !1;
    let s, o;
    this.overrideMaterial !== null && (o = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (t.getClearColor(this._oldClearColor), t.setClearColor(this.clearColor)), this.clearAlpha !== null && (s = t.getClearAlpha(), t.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && t.clearDepth(), t.setRenderTarget(this.renderToScreen ? null : n), this.clear === !0 && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), t.render(this.scene, this.camera), this.clearColor !== null && t.setClearColor(this._oldClearColor), this.clearAlpha !== null && t.setClearAlpha(s), this.overrideMaterial !== null && (this.scene.overrideMaterial = o), t.autoClear = r;
  }
}
var yd = "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}", Ed = "uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrokeDensity;uniform float uSwirlFrequency;uniform float uColorIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}void main(){vec2 uv=vUv;float strokeAngle=noise(uv*uStrokeDensity+uTime*0.05)*6.28318;vec2 strokeDir=vec2(cos(strokeAngle),sin(strokeAngle));float strokeDist=noise(uv*uStrokeDensity*2.0+strokeDir*0.5+uTime*0.03);vec2 center=vec2(0.5);vec2 delta=uv-center;float dist=length(delta);float angle=atan(delta.y,delta.x);float swirl=sin(dist*uSwirlFrequency-uTime*0.5)*0.008;angle+=swirl;vec2 swirled=center+dist*vec2(cos(angle),sin(angle));vec2 distortedUV=mix(swirled,uv+strokeDir*strokeDist*0.008,0.5);distortedUV=clamp(distortedUV,0.0,1.0);vec4 color;color.r=texture2D(tDiffuse,distortedUV+vec2(0.001,0.0)).r;color.g=texture2D(tDiffuse,distortedUV).g;color.b=texture2D(tDiffuse,distortedUV-vec2(0.001,0.0)).b;color.a=1.0;float gray=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(gray),color.rgb,uColorIntensity);float vignette=1.0-smoothstep(0.4,1.4,dist*1.2);color.rgb*=vignette;gl_FragColor=color;}", Td = "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}", bd = `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co){ return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = vUv;
  float scanline = sin(uv.y * 400.0 + uTime * 8.0) * 0.012;
  float aberr = 0.003 + sin(uTime * 0.7) * 0.0015;
  float r = texture2D(tDiffuse, uv + vec2( aberr, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2( aberr, 0.0)).b;
  float glitchLine = step(0.98, rand(vec2(floor(uv.y * 20.0), floor(uTime * 2.0))));
  float glitchShift = glitchLine * (rand(vec2(uTime, uv.y)) - 0.5) * 0.04;
  if (glitchLine > 0.0) {
    r = texture2D(tDiffuse, uv + vec2(aberr + glitchShift, 0.0)).b;
    b = texture2D(tDiffuse, uv - vec2(aberr - glitchShift, 0.0)).r;
  }
  vec3 col = vec3(r, g, b);
  col += scanline * 0.15;
  gl_FragColor = vec4(col, 1.0);
}`, Ad = `
attribute float size;attribute float brightness;attribute float twinkleSpeed;attribute float twinklePhase;attribute vec3 customColor;
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
uniform float uTime;
void main(){
  float twinkle=0.5+0.5*sin(uTime*twinkleSpeed+twinklePhase);
  vBrightness=brightness*(0.4+0.6*twinkle);vColor=customColor;vTwinkle=twinkle;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  float sizeMult=0.4+0.6*twinkle;
  gl_PointSize=size*sizeMult*(250.0/-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}`, wd = `
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
void main(){
  float dist=length(gl_PointCoord-vec2(0.5));
  if(dist>0.5)discard;
  float alpha=smoothstep(0.5,0.0,dist)*vBrightness;
  float glow=exp(-dist*3.0)*0.6;
  vec3 color=vColor+vec3(glow*0.8,glow*0.5,glow*0.2);
  gl_FragColor=vec4(color,alpha);
}`, Rd = "uniform float uTime;uniform float uWaveHeight;uniform float uWaveFrequency;varying vec2 vUv;varying float vElevation;void main(){vUv=uv;vec3 pos=position;float w1=sin(pos.x*uWaveFrequency+uTime)*uWaveHeight;float w2=sin(pos.z*uWaveFrequency*0.7+uTime*1.3)*uWaveHeight*0.5;pos.y+=w1+w2;vElevation=w1+w2;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}", Cd = "uniform vec3 uColor1;uniform vec3 uColor2;uniform vec3 uColor3;varying vec2 vUv;varying float vElevation;void main(){float f=(vElevation+1.0)*0.5;vec3 color=mix(uColor1,uColor2,f);color=mix(color,uColor3,smoothstep(0.6,1.0,f));gl_FragColor=vec4(color,0.85);}", Pd = `
attribute float phase; attribute float pulseSpeed;
uniform float uTime; uniform float uSize;
varying float vPulse;
void main() {
  float pulse = 0.4 + 0.6 * sin(uTime * pulseSpeed + phase);
  vPulse = pulse;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * pulse * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}`, Ld = `
varying float vPulse;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float core = smoothstep(0.15, 0.0, dist);
  float glow = exp(-dist * 4.0) * 0.5;
  vec3 color = vec3(1.0, 0.85, 0.4);
  float alpha = (core + glow) * vPulse * 0.7;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}`, Dd = `
varying vec2 vUv;
varying float vWorldY;
void main() {
  vUv = uv;
  vWorldY = (modelMatrix * vec4(position, 1.0)).y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`, Ud = `
uniform sampler2D uTexture;
uniform float uRevealProgress;
varying vec2 vUv;
void main() {
  float band = floor(vUv.y * 20.0);
  float bandThreshold = (band + 1.0) / 20.0;
  float noiseOffset = sin(vUv.x * 50.0 + band * 3.7) * 0.03;
  float reveal = smoothstep(bandThreshold + noiseOffset - 0.05, bandThreshold + noiseOffset, uRevealProgress);
  vec4 texColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(texColor.rgb, texColor.a * reveal);
}`;
function Id(i) {
  const t = new sn();
  t.position.set(0, 0.5, -5), i.add(t), i.userData._moonGroup = t, i.userData._moonBaseY = 0.5;
  const e = new an(1.5, 64, 64), n = e.attributes.position;
  for (let d = 0; d < n.count; d++) {
    const u = n.getX(d), T = n.getY(d), v = n.getZ(d);
    let b = Math.sin(u * 8) * Math.cos(T * 6) * 0.04 + Math.sin(v * 12) * 0.025;
    const R = [
      { cx: 0.6, cy: 0.3, cz: 1.2, r: 0.35, d: 0.12 },
      { cx: -0.8, cy: -0.2, cz: 0.9, r: 0.25, d: 0.08 },
      { cx: 0.2, cy: -0.7, cz: 1.1, r: 0.2, d: 0.06 },
      { cx: -0.3, cy: 0.8, cz: 0.8, r: 0.18, d: 0.05 },
      { cx: 0.9, cy: 0.5, cz: 0.6, r: 0.15, d: 0.04 },
      { cx: -0.5, cy: -0.6, cz: 0.7, r: 0.22, d: 0.07 },
      { cx: 0.1, cy: 0.1, cz: 1.35, r: 0.28, d: 0.09 }
    ];
    for (let A = 0; A < R.length; A++) {
      const w = R[A], O = u - w.cx, M = T - w.cy, S = v - w.cz, U = Math.sqrt(O * O + M * M + S * S);
      if (U < w.r) {
        const N = U / w.r, Y = -w.d * (1 - N * N) + w.d * 0.3 * Math.exp(-((N - 0.85) * (N - 0.85)) * 50);
        b += Y;
      }
    }
    n.setXYZ(d, u * (1 + b), T * (1 + b), v * (1 + b));
  }
  e.computeVertexNormals();
  const r = new oi({
    color: 16775400,
    roughness: 0.6,
    metalness: 0,
    emissive: 3351057,
    emissiveIntensity: 0.06
  }), s = new ie(e, r);
  s.userData.animate = function(d, u) {
    d.position.x = Math.sin(u * 0.15) * 4, d.position.z = Math.cos(u * 0.15) * 2, d.position.y = Math.sin(u * 0.2) * 0.5, d.rotation.y = u * 0.2, d.rotation.x = Math.sin(u * 0.08) * 0.05;
    const T = 1 + Math.sin(u * 0.3) * 0.015;
    d.scale.setScalar(T);
  }, t.add(s);
  const o = new an(1.62, 32, 32), a = new Wn({
    color: 16773312,
    transparent: !0,
    opacity: 0.08,
    side: 1,
    depthWrite: !1
  }), l = new ie(o, a);
  l.userData.animate = function(d, u) {
    d.position.x = Math.sin(u * 0.08) * 4, d.position.z = Math.cos(u * 0.08) * 2, d.position.y = Math.sin(u * 0.12) * 0.5, d.scale.setScalar(1 + Math.sin(u * 0.4) * 0.04), d.material.opacity = 0.06 + Math.sin(u * 0.5) * 0.02;
  }, t.add(l);
  const c = new an(2, 24, 24), h = new Wn({
    color: 16775392,
    transparent: !0,
    opacity: 0.035,
    side: 1,
    depthWrite: !1
  }), f = new ie(c, h);
  f.userData.animate = function(d, u) {
    d.position.x = Math.sin(u * 0.08) * 4, d.position.z = Math.cos(u * 0.08) * 2, d.position.y = Math.sin(u * 0.12) * 0.5, d.scale.setScalar(1 + Math.sin(u * 0.25) * 0.06), d.material.opacity = 0.025 + Math.sin(u * 0.35) * 0.01;
  }, t.add(f);
  const p = new an(2.8, 20, 20), m = new Wn({
    color: 16772829,
    transparent: !0,
    opacity: 0.012,
    side: 1,
    depthWrite: !1
  }), g = new ie(p, m);
  g.userData.animate = function(d, u) {
    d.position.x = Math.sin(u * 0.06) * 4, d.position.z = Math.cos(u * 0.06) * 2, d.position.y = Math.sin(u * 0.1) * 0.5, d.scale.setScalar(1 + Math.sin(u * 0.18) * 0.08), d.material.opacity = 8e-3 + Math.sin(u * 0.22) * 6e-3;
  }, t.add(g);
  const _ = new co(16774608, 1.2, 25, 1.5);
  _.position.set(0, 0, 0), _.userData.animate = function(d, u) {
    d.intensity = 1.2 + Math.sin(u * 0.7) * 0.15 + Math.sin(u * 1.3) * 0.08;
  }, t.add(_);
}
function Nd(i) {
  i = i || /* @__PURE__ */ new Date();
  var t = i.getFullYear(), e = i.getMonth() + 1, n = i.getDate(), r = Math.floor((14 - e) / 12), s = t + 4800 - r, o = e + 12 * r - 3, a = n + Math.floor((153 * o + 2) / 5) + 365 * s + Math.floor(s / 4) - Math.floor(s / 100) + Math.floor(s / 400) - 32045, l = a - 24515495e-1, c = 29.53058868, h = (l % c + c) % c, f = h / c;
  return {
    phase: h,
    fraction: f,
    age: h,
    illumination: (1 - Math.cos(f * 2 * Math.PI)) / 2
  };
}
function Fd(i) {
  return i < 0.0625 ? "New Moon" : i < 0.1875 ? "Waxing Crescent" : i < 0.3125 ? "First Quarter" : i < 0.4375 ? "Waxing Gibbous" : i < 0.5625 ? "Full Moon" : i < 0.6875 ? "Waning Gibbous" : i < 0.8125 ? "Last Quarter" : i < 0.9375 ? "Waning Crescent" : "New Moon";
}
function Od(i) {
  return i < 0.0625 ? "🌑" : i < 0.1875 ? "🌒" : i < 0.3125 ? "🌓" : i < 0.4375 ? "🌔" : i < 0.5625 ? "🌕" : i < 0.6875 ? "🌖" : i < 0.8125 ? "🌗" : i < 0.9375 ? "🌘" : "🌑";
}
function Bd(i) {
  var t = i;
  return function() {
    return t = (t * 16807 + 7) % 2147483647, (t - 1) / 2147483646;
  };
}
function zd(i) {
  try {
    for (var t = [], e = 0; e < i.length; e++) {
      var n = i[e].geometry.attributes.position.array;
      t.push({
        x1: n[0],
        y1: n[1],
        z1: n[2],
        x2: n[3],
        y2: n[4],
        z2: n[5]
      });
    }
    localStorage.setItem("atrija-constellations", JSON.stringify(t));
  } catch {
  }
}
function Gd() {
  try {
    return JSON.parse(localStorage.getItem("atrija-constellations") || "[]");
  } catch {
    return [];
  }
}
function Hd(i, t, e, n, r, s) {
  i.strokeStyle = "#2d5a1e", i.lineWidth = e * 0.018, i.lineCap = "round", i.lineJoin = "round", i.beginPath(), i.moveTo(t, e * 0.95), i.bezierCurveTo(
    t + e * 0.015,
    e * 0.8,
    t - e * 0.01,
    e * 0.66,
    t + e * 3e-3,
    n
  ), i.stroke(), i.strokeStyle = "rgba(120,180,60,0.18)", i.lineWidth = e * 8e-3, i.beginPath(), i.moveTo(t - e * 5e-3, e * 0.93), i.bezierCurveTo(
    t - e * 3e-3,
    e * 0.79,
    t - e * 6e-3,
    e * 0.65,
    t - e * 2e-3,
    n
  ), i.stroke();
  for (var o = -1; o <= 1; o += 2) {
    var a = r + s * 0.4, l = a + e * 0.15, c = e * 0.05;
    i.save();
    var h = i.createLinearGradient(
      t,
      a,
      t + o * c,
      l
    );
    h.addColorStop(0, "#2d6a1e"), h.addColorStop(0.5, "#3a7a28"), h.addColorStop(1, "#4a8a30"), i.fillStyle = h, i.beginPath(), i.moveTo(t, a), i.bezierCurveTo(
      t + o * c,
      a + e * 0.03,
      t + o * c * 0.7,
      l - e * 0.03,
      t + o * e * 3e-3,
      l
    ), i.bezierCurveTo(
      t - o * e * 2e-3,
      l - e * 0.015,
      t - o * e * 3e-3,
      a + e * 0.03,
      t,
      a
    ), i.fill(), i.strokeStyle = "rgba(80,140,40,0.2)", i.lineWidth = e * 3e-3, i.beginPath(), i.moveTo(t, a + e * 8e-3), i.quadraticCurveTo(
      t + o * c * 0.4,
      (a + l) * 0.5,
      t + o * e * 3e-3,
      l - e * 0.015
    ), i.stroke(), i.restore();
  }
}
function Vd(i, t, e, n, r, s, o, a, l, c) {
  var h = Bd(c), f = a.replace("#", ""), p = parseInt(f.substring(0, 2), 16), m = parseInt(f.substring(2, 4), 16), g = parseInt(f.substring(4, 6), 16), _ = Math.max(0, p - 50), d = Math.max(0, m - 40), u = Math.max(0, g - 30), T = Math.min(255, p + 40), v = Math.min(255, m + 30), b = Math.min(255, g + 20);
  i.save(), i.beginPath(), i.moveTo(t - s * 0.5, n), i.bezierCurveTo(
    t - s * 0.7,
    r + o * 0.1,
    t - s * 0.55,
    r - o * 0.35,
    t,
    r - o * 0.55
  ), i.bezierCurveTo(
    t + s * 0.55,
    r - o * 0.35,
    t + s * 0.7,
    r + o * 0.1,
    t + s * 0.5,
    n
  ), i.closePath();
  var R = i.createLinearGradient(t, n, t, r - o * 0.55);
  R.addColorStop(
    0,
    "rgba(" + Math.round(p * 0.8) + "," + Math.round(m * 0.8) + "," + Math.round(g * 0.8) + ",1)"
  ), R.addColorStop(1, "rgba(" + T + "," + v + "," + b + ",1)"), i.fillStyle = R, i.fill(), i.restore();
  for (var A = 0; A < 2; A++)
    for (var w = 0; w < 3; w++) {
      var O = w / 3 * Math.PI - Math.PI / 2 + A * Math.PI / 3, M = t + Math.cos(O) * s * 0.35, S = r + Math.sin(O) * o * 0.25, U = s * (0.42 + h() * 0.06), N = o * (0.5 + h() * 0.08);
      i.save(), i.translate(M, S);
      var Y = (M - t) / s * 0.3;
      i.rotate(Y), i.beginPath(), i.moveTo(0, N * 0.35), i.bezierCurveTo(
        -U * 0.8,
        N * 0.2,
        -U * 0.9,
        -N * 0.25,
        -U * 0.3,
        -N * 0.45
      ), i.bezierCurveTo(
        -U * 0.1,
        -N * 0.55,
        U * 0.1,
        -N * 0.55,
        U * 0.3,
        -N * 0.45
      ), i.bezierCurveTo(U * 0.9, -N * 0.25, U * 0.8, N * 0.2, 0, N * 0.35), i.closePath();
      var P = i.createLinearGradient(0, -N * 0.5, 0, N * 0.35);
      A === 0 ? (P.addColorStop(
        0,
        "rgba(" + Math.round(p * 0.85) + "," + Math.round(m * 0.85) + "," + Math.round(g * 0.85) + ",0.95)"
      ), P.addColorStop(
        0.5,
        "rgba(" + Math.round(p * 0.75) + "," + Math.round(m * 0.75) + "," + Math.round(g * 0.75) + ",0.9)"
      ), P.addColorStop(1, "rgba(" + _ + "," + d + "," + u + ",0.85)")) : (P.addColorStop(0, "rgba(" + T + "," + v + "," + b + ",0.95)"), P.addColorStop(0.4, "rgba(" + p + "," + m + "," + g + ",1)"), P.addColorStop(
        0.8,
        "rgba(" + Math.round(p * 0.9) + "," + Math.round(m * 0.9) + "," + Math.round(g * 0.9) + ",0.95)"
      ), P.addColorStop(1, "rgba(" + _ + "," + d + "," + u + ",0.8)")), i.fillStyle = P, i.fill(), i.strokeStyle = "rgba(" + T + "," + v + "," + b + ",0.15)", i.lineWidth = e * 4e-3, i.stroke(), i.restore();
    }
  if (i.save(), i.beginPath(), i.ellipse(
    t,
    r - o * 0.05,
    s * 0.25,
    o * 0.12,
    0,
    0,
    Math.PI * 2
  ), i.fillStyle = "rgba(20,40,10,0.25)", i.fill(), i.restore(), l > 0.3)
    for (var B = 0; B < 6; B++) {
      var H = B / 6 * Math.PI * 2, J = o * (0.08 + h() * 0.06), X = t + Math.cos(H) * s * 0.15, W = r - o * 0.1;
      i.strokeStyle = "#5a7a3a", i.lineWidth = e * 5e-3, i.beginPath(), i.moveTo(X, W), i.lineTo(
        X + Math.cos(H) * J,
        W - Math.abs(Math.sin(H)) * J * 0.5
      ), i.stroke(), i.fillStyle = "#c8a040", i.beginPath(), i.arc(
        X + Math.cos(H) * J,
        W - Math.abs(Math.sin(H)) * J * 0.5,
        e * 8e-3,
        0,
        Math.PI * 2
      ), i.fill();
    }
}
function kd(i, t, e, n) {
  i = i || 256, e = e || 0.6, n = n || 42;
  var r = document.createElement("canvas");
  r.width = i, r.height = i;
  var s = r.getContext("2d"), o = i / 2;
  s.clearRect(0, 0, i, i);
  var a = i * 0.3, l = i * 0.28, c = i * 0.52, h = c - a * 0.45, f = h, p = l * 0.5;
  return Hd(s, o, i, c, f, p), Vd(
    s,
    o,
    i,
    c,
    h,
    l,
    a,
    t,
    e,
    n
  ), r;
}
function Wd(i, t, e) {
  i = i || 160;
  var n = document.createElement("canvas");
  n.width = i, n.height = i;
  var r = n.getContext("2d"), s = i / 2, o = i * 0.38, a = i * 0.24, l = t.replace("#", ""), c = parseInt(l.substring(0, 2), 16), h = parseInt(l.substring(2, 4), 16), f = parseInt(l.substring(4, 6), 16);
  r.strokeStyle = "#2d6a1e", r.lineWidth = i * 0.035, r.lineCap = "round", r.lineJoin = "round", r.beginPath(), r.moveTo(s, o + a * 0.7), r.bezierCurveTo(
    s + i * 0.04,
    o + a * 1.4,
    s - i * 0.03,
    o + a * 2,
    s + i * 0.01,
    i
  ), r.stroke(), r.fillStyle = "#3a7a2e";
  for (var p = -1; p <= 1; p += 2) {
    r.save();
    var m = s + p * i * 0.03, g = o + a * 1.5;
    r.beginPath(), r.moveTo(m, g), r.bezierCurveTo(
      m + p * i * 0.14,
      g - i * 0.04,
      m + p * i * 0.18,
      g - i * 0.12,
      m + p * i * 0.1,
      g - i * 0.18
    ), r.bezierCurveTo(
      m + p * i * 0.06,
      g - i * 0.14,
      m + p * i * 0.03,
      g - i * 0.08,
      m,
      g
    ), r.fill(), r.restore();
  }
  for (var _ = 6, d = e === 0 ? 0.05 : e === 1 ? 0.15 : 0.3, u = 0; u < _; u++) {
    var T = u / _ * Math.PI * 2 - Math.PI / 2, v = -2 + Math.floor(Math.random() * 5), b = a * (e === 0 ? 1.1 : e === 1 ? 0.8 : 0.7) * (0.9 + Math.random() * 0.2), R = a * (e === 0 ? 0.18 : e === 1 ? 0.25 : 0.32) * (0.85 + Math.random() * 0.3), A = Math.min(255, Math.max(0, c + v * 8)), w = Math.min(255, Math.max(0, h + v * 4)), O = Math.min(255, Math.max(0, f + v * 2));
    r.save(), r.translate(
      s + Math.cos(T) * d * a,
      o + Math.sin(T) * d * a * 0.5
    ), r.rotate(
      T + Math.PI / 2 + (e === 0 ? 0.1 : e === 1 ? 0.3 : 0.6)
    );
    var M = R * 1.3;
    r.beginPath(), r.moveTo(0, b * 0.25), r.bezierCurveTo(
      -R * 0.4,
      b * 0.1,
      -M * 0.6,
      -b * 0.5,
      0,
      -b
    ), r.bezierCurveTo(
      M * 0.6,
      -b * 0.5,
      R * 0.4,
      b * 0.1,
      0,
      b * 0.25
    );
    var S = r.createLinearGradient(0, -b, 0, b * 0.3);
    S.addColorStop(
      0,
      "rgba(" + Math.min(255, A + 40) + "," + Math.min(255, w + 10) + "," + Math.min(255, O + 10) + ",0.97)"
    ), S.addColorStop(0.4, "rgba(" + A + "," + w + "," + O + ",0.92)"), S.addColorStop(
      1,
      "rgba(" + Math.max(0, A - 50) + "," + Math.max(0, w - 30) + "," + Math.max(0, O - 20) + ",0.78)"
    ), r.fillStyle = S, r.fill(), r.strokeStyle = "rgba(" + Math.max(0, A - 30) + "," + Math.max(0, w - 20) + "," + Math.max(0, O - 15) + ",0.15)", r.lineWidth = 0.8, r.beginPath(), r.moveTo(0, b * 0.2), r.quadraticCurveTo(R * 0.05, 0, 0, -b * 0.4), r.stroke(), r.restore();
  }
  for (var U = 0; U < 6; U++) {
    var N = U / 6 * Math.PI * 2 - Math.PI / 2, Y = a * (0.45 + Math.random() * 0.15);
    r.strokeStyle = "#5a7a3a", r.lineWidth = i * 0.012, r.beginPath(), r.moveTo(s, o), r.quadraticCurveTo(
      s + Math.cos(N) * Y * 0.5,
      o + Math.sin(N) * Y * 0.5,
      s + Math.cos(N) * Y,
      o + Math.sin(N) * Y
    ), r.stroke();
    var P = s + Math.cos(N) * Y, B = o + Math.sin(N) * Y;
    r.fillStyle = "#c8a040", r.beginPath(), r.arc(P, B, i * 0.018, 0, Math.PI * 2), r.fill();
  }
  var H = a * 0.65;
  r.strokeStyle = "#6a9a4a", r.lineWidth = i * 0.018, r.beginPath(), r.moveTo(s, o), r.lineTo(s, o - H), r.stroke(), r.fillStyle = "#7aaa5a", r.beginPath(), r.arc(s, o - H, i * 0.022, 0, Math.PI * 2), r.fill();
  for (var J = 0; J < 8; J++) {
    var X = s + (Math.random() - 0.5) * a * 0.4, W = o + (Math.random() - 0.5) * a * 0.4;
    r.fillStyle = "rgba(80, 40, 20, " + (0.2 + Math.random() * 0.3) + ")", r.beginPath(), r.arc(X, W, i * (6e-3 + Math.random() * 8e-3), 0, Math.PI * 2), r.fill();
  }
  return n;
}
const Xd = typeof window < "u";
let jt = !1, he = !1;
const Je = { current: 0, target: 0, smooth: 0.05 };
let rs = 0;
function qd(i) {
  rs = i;
}
const zn = Object.freeze({
  cameraRotationZ: 0.03,
  starsNearRotationY: 0.02,
  starsMidRotationY: 0.01,
  starsFarRotationY: 5e-3,
  moonVerticalOffset: 0.5,
  mobileIntensityMultiplier: 0.6
});
let uo = !0, ss;
Xd && (jt = window.innerWidth < 768, he = jt || navigator.hardwareConcurrency <= 4, rs = document.body.scrollHeight - window.innerHeight, typeof IntersectionObserver < "u" && (ss = new IntersectionObserver(
  function(i) {
    uo = i[0].isIntersecting;
  },
  { threshold: 0 }
)), window.addEventListener(
  "scroll",
  function() {
    Je.target = Math.min(1, Math.max(0, window.scrollY / rs));
  },
  { passive: !0 }
));
function Ms(i, t) {
  const e = i.position.y, n = i.position.x, r = 0.3 + Math.random() * 0.3;
  i.userData.animate = function(s, o) {
    s.position.x = n + Math.sin(o * r + t) * 0.05, s.position.y = e + Math.sin(o * r * 1.4 + t) * 0.06, s.material.rotation = Math.sin(o * r * 0.7 + t) * 0.08 + Math.sin(o * r * 2 + t * 2) * 0.03;
  };
}
function Yd(i, t) {
  const e = [
    "#e74c3c",
    "#d63031",
    "#d81b60",
    "#e91e63",
    "#f06292",
    "#ec407a",
    "#ad1457",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#ee9836",
    "#ff8a65",
    "#8b0000",
    "#9b3676",
    "#7b1fa2",
    "#9c27b0",
    "#5e27a1",
    "#dc143c",
    "#c71585",
    "#b33939",
    "#cd5c5c",
    "#b97455",
    "#fa8072",
    "#e9967a",
    "#ff6347",
    "#ff4500"
  ];
  for (let n = 0; n < t; n++) {
    const r = e[Math.floor(Math.random() * e.length)], s = 0.3 + Math.random() * 0.65, o = Math.floor(Math.random() * 1e4), a = jt ? 1.2 + Math.random() * 0.6 : 1 + Math.random() * 1, l = jt ? 10 : 14, c = new or(kd(256, r, s, o));
    c.minFilter = 1006;
    const h = new ar(
      new _i({
        map: c,
        transparent: !0,
        depthWrite: !1
      })
    ), f = 0.5 * a, p = 1.4 * a;
    h.scale.set(f, p, 1);
    const m = 2, g = jt ? 7 : 8;
    h.position.set(
      (Math.random() - 0.5) * l,
      -0.3 + a * 0.12,
      // Y: slightly below center
      m + Math.random() * (g - m)
    ), Ms(h, Math.random() * Math.PI * 2), i.add(h);
  }
}
function Zd(i, t) {
  const e = [
    "#c8920a",
    "#e8a020",
    "#d4a030",
    "#f0b040",
    "#c08020",
    "#b8860b",
    "#daa520",
    "#cd853f",
    "#d2691e",
    "#e6be44"
  ];
  for (let n = 0; n < t; n++) {
    const r = e[Math.floor(Math.random() * e.length)], s = jt ? 1 + Math.random() * 0.6 : 1.2 + Math.random() * 1, o = jt ? 12 : 16, a = 256, l = document.createElement("canvas");
    l.width = a, l.height = a;
    const c = l.getContext("2d"), h = a / 2, f = a * 0.35, p = a * 0.28;
    c.clearRect(0, 0, a, a), c.strokeStyle = "#2d5a1e", c.lineWidth = a * 0.04, c.lineCap = "round", c.beginPath(), c.moveTo(h, f + p * 0.8), c.bezierCurveTo(
      h + a * 0.03,
      f + p * 1.5,
      h - a * 0.02,
      f + p * 2.2,
      h,
      a
    ), c.stroke(), c.fillStyle = "#3a7a2e";
    for (let S = -1; S <= 1; S += 2)
      c.save(), c.translate(h + S * a * 0.02, f + p * 1.6), c.rotate(S * 0.4), c.beginPath(), c.ellipse(S * a * 0.08, 0, a * 0.1, a * 0.04, 0, 0, Math.PI * 2), c.fill(), c.restore();
    const m = r.replace("#", ""), g = parseInt(m.substring(0, 2), 16), _ = parseInt(m.substring(2, 4), 16), d = parseInt(m.substring(4, 6), 16), u = 18;
    c.fillStyle = r;
    for (let S = 0; S < u; S++) {
      const U = S / u * Math.PI * 2;
      c.save(), c.translate(h, f), c.rotate(U), c.beginPath(), c.ellipse(0, -53.760000000000005, p * 0.13, p * 0.45, 0, 0, Math.PI * 2), c.fill(), c.restore();
    }
    const T = Math.min(255, g + 40), v = Math.min(255, _ + 30), b = Math.min(255, d + 20);
    c.fillStyle = `rgb(${T},${v},${b})`;
    for (let S = 0; S < u; S++) {
      const U = S / u * Math.PI * 2 + Math.PI / u * 0.5;
      c.save(), c.translate(h, f), c.rotate(U), c.beginPath(), c.ellipse(0, -48.74240000000001, p * 0.12, p * 0.38, 0, 0, Math.PI * 2), c.fill(), c.restore();
    }
    const R = c.createRadialGradient(h, f, 0, h, f, p * 0.3);
    R.addColorStop(0, "#3a1a00"), R.addColorStop(0.6, "#2a1200"), R.addColorStop(1, "#1a0a00"), c.fillStyle = R, c.beginPath(), c.arc(h, f, p * 0.3, 0, Math.PI * 2), c.fill(), c.fillStyle = "#5a3010";
    for (let S = 0; S < 20; S++) {
      const U = S * 2.399963, N = p * 0.26 * Math.sqrt(S / 20);
      c.beginPath(), c.arc(
        h + Math.cos(U) * N,
        f + Math.sin(U) * N,
        a * 0.015,
        0,
        Math.PI * 2
      ), c.fill();
    }
    const A = new or(l);
    A.minFilter = 1006;
    const w = new ar(
      new _i({
        map: A,
        transparent: !0,
        depthWrite: !1
      })
    );
    w.scale.set(1.2 * s, 1.2 * s, 1);
    const O = 2, M = jt ? 7 : 8;
    w.position.set(
      (Math.random() - 0.5) * o,
      -0.3 + s * 0.15,
      O + Math.random() * (M - O)
    ), Ms(w, Math.random() * Math.PI * 2), i.add(w);
  }
}
function Jd(i, t) {
  const e = [
    "#f05090",
    "#d03070",
    "#e87020",
    "#f06030",
    "#f0a080",
    "#f08080",
    "#e8a0c0",
    "#d05080",
    "#e07050",
    "#c0a080"
  ];
  for (let n = 0; n < t; n++) {
    const r = e[Math.floor(Math.random() * e.length)], s = Math.floor(Math.random() * 3), o = jt ? 0.7 + Math.random() * 0.5 : 0.5 + Math.random() * 0.5, a = jt ? 8 : 12, l = new or(Wd(160, r, s));
    l.minFilter = 1006;
    const c = new ar(
      new _i({
        map: l,
        transparent: !0,
        depthWrite: !1
      })
    );
    c.scale.set(1 * o, 1.6 * o, 1);
    const h = 3, f = jt ? 7 : 8;
    c.position.set(
      (Math.random() - 0.5) * a,
      -0.3 + o * 0.15,
      h + Math.random() * (f - h)
    ), Ms(c, Math.random() * Math.PI * 2), i.add(c);
  }
}
function qr(i, t, e, n, r) {
  const s = new Float32Array(t * 3), o = new Float32Array(t), a = new Float32Array(t), l = new Float32Array(t), c = new Float32Array(t), h = new Float32Array(t * 3);
  for (let g = 0; g < t; g++) {
    const _ = g * 3, d = Math.random() * Math.PI * 2, u = Math.acos(2 * Math.random() - 1), T = 40 + Math.random() * 20;
    s[_] = T * Math.sin(u) * Math.cos(d), s[_ + 1] = T * Math.sin(u) * Math.sin(d), s[_ + 2] = T * Math.cos(u), o[g] = (0.8 + Math.random() * 2.5) * e, a[g] = (0.3 + Math.random() * 0.7) * n, l[g] = 0.8 + Math.random() * 4, c[g] = Math.random() * Math.PI * 2;
    const v = Math.random();
    v < 0.3 ? (h[_] = 1, h[_ + 1] = 0.95, h[_ + 2] = 0.7) : v < 0.6 ? (h[_] = 0.7, h[_ + 1] = 0.8, h[_ + 2] = 1) : (h[_] = 1, h[_ + 1] = 0.6, h[_ + 2] = 0.3);
  }
  const f = new ce();
  f.setAttribute("position", new ae(s, 3)), f.setAttribute("size", new ae(o, 1)), f.setAttribute("brightness", new ae(a, 1)), f.setAttribute("twinkleSpeed", new ae(l, 1)), f.setAttribute("twinklePhase", new ae(c, 1)), f.setAttribute("customColor", new ae(h, 3));
  const p = new Re({
    uniforms: { uTime: { value: 0 } },
    vertexShader: Ad,
    fragmentShader: wd,
    transparent: !0,
    depthWrite: !1,
    blending: 2
  }), m = new ds(f, p);
  return m.userData.animate = function(g, _) {
    g.material.uniforms.uTime.value = _, g.rotation.y = _ * 8e-3, g.rotation.x = Math.sin(_ * 0.015) * 0.04 * r, g.rotation.z = Math.cos(_ * 0.012) * 0.02 * r;
  }, i.add(m), m;
}
function Kd(i, t) {
  const e = jt ? 0.7 : 1, n = Math.floor(t * 0.3 * e), r = Math.floor(t * 0.4 * e), s = Math.floor(t * 0.3 * e);
  i.userData._starsNear = qr(i, n, 2.5, 1, 1), i.userData._starsMid = qr(i, r, 1.8, 0.7, 0.7), i.userData._starsFar = qr(i, s, 1.2, 0.4, 0.4);
}
function Da(i) {
  const t = [
    {
      points: [
        [-2, 5, -30],
        [0, 6, -30],
        [2, 5, -30],
        [-3, 8, -30],
        [3, 8, -30],
        [-2, 2, -30],
        [2, 2, -30]
      ]
    },
    {
      points: [
        [-10, 10, -35],
        [-8, 11, -35],
        [-6, 10.5, -35],
        [-5, 9, -35],
        [-6, 7, -35],
        [-8, 7.5, -35],
        [-9, 8.5, -35]
      ]
    }
  ], e = new fs({
    color: 6719692,
    transparent: !0,
    opacity: 0.3
  });
  t.forEach((n) => {
    const r = n.points.map((s) => new L(s[0], s[1], s[2]));
    i.add(
      new jr(
        new ce().setFromPoints(r),
        e
      )
    );
  });
}
function jd(i, t) {
  t = t || (jt ? 1 : 2);
  const e = [];
  let n = 3 + Math.random() * 4;
  function r() {
    const s = jt ? 12 : 20, o = new Float32Array(s * 3), a = new Float32Array(s), l = 35 + Math.random() * 10, c = Math.random() * Math.PI * 2, h = Math.random() * Math.PI * 0.4, f = l * Math.sin(h) * Math.cos(c), p = l * Math.sin(h) * Math.sin(c) + 5, m = l * Math.cos(h), g = 0.15 + Math.random() * 0.15, _ = {
      active: !0,
      life: 0,
      maxLife: 1.5 + Math.random() * 0.8,
      sx: f,
      sy: p,
      sz: m,
      dx: (Math.random() - 0.5) * 0.8 * g,
      dy: (-0.3 - Math.random() * 0.5) * g,
      dz: (Math.random() - 0.5) * 0.8 * g,
      positions: o,
      opacities: a,
      trailLength: s,
      headSize: jt ? 3 : 4,
      headColor: new Bt().setHSL(
        0.12 + Math.random() * 0.05,
        0.8,
        0.9
      )
    }, d = new ce();
    d.setAttribute("position", new ae(o, 3)), d.setAttribute("opacity", new ae(a, 1));
    const u = new Qa({
      color: _.headColor,
      size: _.headSize,
      transparent: !0,
      opacity: 1,
      depthWrite: !1,
      blending: 2,
      sizeAttenuation: !0
    }), T = new ds(d, u);
    T.userData.shootingStar = _, T.userData.animate = function(v, b) {
      const R = v.userData.shootingStar;
      if (!R.active) return;
      if (R.life += b, R.life >= R.maxLife) {
        v.visible = !1, R.active = !1;
        return;
      }
      R.sx += R.dx, R.sy += R.dy, R.sz += R.dz;
      for (let O = R.trailLength - 1; O > 0; O--)
        R.positions[O * 3] = R.positions[(O - 1) * 3], R.positions[O * 3 + 1] = R.positions[(O - 1) * 3 + 1], R.positions[O * 3 + 2] = R.positions[(O - 1) * 3 + 2], R.opacities[O] = R.opacities[O - 1] * 0.85;
      R.positions[0] = R.sx, R.positions[1] = R.sy, R.positions[2] = R.sz, R.opacities[0] = 1;
      const A = R.life / R.maxLife, w = A < 0.7 ? 1 : 1 - (A - 0.7) / 0.3;
      v.material.opacity = w, v.material.size = R.headSize * (0.5 + w * 0.5), v.geometry.attributes.position.needsUpdate = !0;
    }, i.add(T), e.push({ points: T, star: _ });
  }
  return {
    update(s, o) {
      if (n -= o, n <= 0) {
        let a = !1;
        for (let l = 0; l < e.length; l++)
          if (!e[l].star.active) {
            const c = e[l].star;
            c.active = !0, c.life = 0, c.maxLife = 1.5 + Math.random() * 0.8;
            const h = 35 + Math.random() * 10, f = Math.random() * Math.PI * 2, p = Math.random() * Math.PI * 0.4;
            c.sx = h * Math.sin(p) * Math.cos(f), c.sy = h * Math.sin(p) * Math.sin(f) + 5, c.sz = h * Math.cos(p);
            const m = 0.15 + Math.random() * 0.15;
            c.dx = (Math.random() - 0.5) * 0.8 * m, c.dy = (-0.3 - Math.random() * 0.5) * m, c.dz = (Math.random() - 0.5) * 0.8 * m, e[l].points.visible = !0, e[l].points.material.opacity = 1, a = !0;
            break;
          }
        !a && e.length < t && r(), n = 3 + Math.random() * 4;
      }
    }
  };
}
function $d(i) {
  const t = new sn(), e = new oi({
    color: 13936691,
    roughness: 0.3,
    metalness: 0.6
  }), n = new ie(
    new vn(0.06, 0.06, 2.5, 12),
    e
  );
  n.rotation.z = Math.PI * 0.15, t.add(n);
  for (let s = 0; s < 6; s++) {
    const o = new ie(
      new vn(0.025, 0.025, 0.07, 6),
      new oi({ color: 1710618 })
    );
    o.rotation.x = Math.PI / 2, o.position.set(0, 0.03, -0.8 + s * 0.25), t.add(o);
  }
  const r = new ie(
    new vn(0.05, 0.06, 0.3, 12),
    new oi({
      color: 12884019,
      roughness: 0.2,
      metalness: 0.7
    })
  );
  r.position.set(0, 1.35, 0), t.add(r), t.position.set(3, 1, -2), t.rotation.y = -0.3, t.userData.animate = function(s, o) {
    s.rotation.z = Math.sin(o * 0.2) * 0.05, s.position.y = 1 + Math.sin(o * 0.4) * 0.1;
  }, i.add(t);
}
function Qd(i, t) {
  const e = new sn(), n = [16766287, 16747109, 5227511, 11766015, 8440772];
  for (let r = 0; r < t; r++) {
    const s = n[r % n.length], o = new oi({
      color: s,
      emissive: s,
      emissiveIntensity: 0.4,
      transparent: !0,
      opacity: 0.7,
      roughness: 0.3,
      metalness: 0.1,
      blending: 2,
      depthWrite: !1
    }), a = new sn(), l = new ie(new an(0.06, 8, 8), o);
    l.position.set(0.04, 0, 0), l.rotation.z = -0.3, a.add(l);
    const c = new ie(
      new vn(8e-3, 8e-3, 0.2, 4),
      o
    );
    c.position.set(-0.02, 0.1, 0), a.add(c);
    const h = new ie(new gs(0.04, 0.08, 4), o);
    h.position.set(0.02, 0.18, 0), h.rotation.z = -0.5, a.add(h), a.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 14
    );
    const f = jt ? 1.2 : 0.6;
    a.scale.setScalar(f);
    const p = 0.03 + Math.random() * 0.04, m = 0.5 + Math.random() * 1.5, g = Math.random() * Math.PI * 2, _ = 5e-3 + Math.random() * 0.01, d = 0.4 + Math.random() * 0.8, u = Math.random() * Math.PI * 2, T = 5 + Math.random() * 4, v = a.position.x;
    (function(b, R, A, w, O, M, S, U) {
      a.userData.animate = function(N, Y) {
        N.position.y += b, N.position.x = U + Math.sin(Y * O + M) * w, N.rotation.y = Math.sin(Y * R + A) * 0.5, N.rotation.z = Math.sin(Y * R * 0.7 + A) * 0.3, N.material.opacity = 0.3 + Math.sin(Y * 2 + A) * 0.35, N.position.y > S && (N.position.y = -4 - Math.random() * 4, N.position.x = (Math.random() - 0.5) * 18, N.position.z = (Math.random() - 0.5) * 14);
      };
    })(
      p,
      m,
      g,
      _,
      d,
      u,
      T,
      v
    ), e.add(a);
  }
  i.add(e);
}
function tp(i, t, e = 6) {
  const n = ["♪", "♫", "♩", "♬", "♭", "♮", "♯"], r = [
    "#ffd54f",
    "#ff8a65",
    "#4fc3f7",
    "#b388ff",
    "#80cbc4",
    "#fff8e1",
    "#ffcc80"
  ], s = document.createElement("div");
  s.innerHTML = '<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;"><defs><linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#d4a843;stop-opacity:1"/><stop offset="45%" style="stop-color:#c49833;stop-opacity:1"/><stop offset="55%" style="stop-color:#b88820;stop-opacity:1"/><stop offset="100%" style="stop-color:#a67810;stop-opacity:1"/></linearGradient><linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f5d870;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#e8c060;stop-opacity:0.3"/></linearGradient></defs><rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/><rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/><rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/><ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/><ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/><rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="28" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="30" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="36" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="38" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/></svg>', s.style.cssText = "position:fixed;z-index:9998;pointer-events:none;left:" + (i - 90) + "px;top:" + (t - 24) + "px;opacity:0;transform:scale(0.5) rotate(-8deg);transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);will-change:transform,opacity;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))", document.body.appendChild(s), requestAnimationFrame(() => {
    s.style.opacity = "1", s.style.transform = "scale(1) rotate(-2deg)";
  });
  for (let o = 0; o < e; o++)
    setTimeout(() => {
      const a = document.createElement("div");
      a.textContent = n[Math.floor(Math.random() * n.length)];
      const l = (1 + Math.random() * 0.8).toFixed(2), c = r[Math.floor(Math.random() * r.length)], h = 80 + (Math.random() - 0.2) * 110, f = (Math.random() - 0.5) * 70 - 35;
      a.style.cssText = "position:fixed;z-index:9999;pointer-events:none;font-family:serif;font-size:" + l + "rem;color:" + c + ";left:" + (i + h) + "px;top:" + (t + f) + "px;animation:noteFloat 2s ease-out forwards;will-change:transform,opacity", document.body.appendChild(a), setTimeout(() => {
        a.parentNode && a.parentNode.removeChild(a);
      }, 2100);
    }, o * 70);
  setTimeout(() => {
    s.style.opacity = "0", s.style.transform = "scale(0.85) rotate(5deg)", setTimeout(() => {
      s.parentNode && s.parentNode.removeChild(s);
    }, 350);
  }, 1500);
}
function ep(i, t) {
  t = t || (he ? 32 : 64);
  const e = new gi(30, 20, t, t);
  e.rotateX(-Math.PI * 0.45);
  const n = new Re({
    uniforms: {
      uTime: { value: 0 },
      uWaveHeight: { value: 0.3 },
      uWaveFrequency: { value: 2 },
      uColor1: { value: new L(0.02, 0.05, 0.15) },
      uColor2: { value: new L(0.05, 0.1, 0.3) },
      uColor3: { value: new L(0.1, 0.2, 0.4) }
    },
    vertexShader: Rd,
    fragmentShader: Cd,
    transparent: !0,
    side: 2
  }), r = new ie(e, n);
  r.position.set(0, -2, 5), r.userData.animate = function(s, o) {
    s.material.uniforms.uTime.value = o;
  }, i.add(r);
}
function np() {
  const i = new ro();
  return i.moveTo(0, 0), i.bezierCurveTo(0.25, 0.3, 0.3, 0.8, 0.2, 1.5), i.bezierCurveTo(0.35, 2, 0.3, 2.8, 0.15, 3.5), i.bezierCurveTo(0.2, 4, 0.1, 4.5, 0, 5), i.bezierCurveTo(-0.1, 4.5, -0.2, 4, -0.15, 3.5), i.bezierCurveTo(-0.3, 2.8, -0.35, 2, -0.2, 1.5), i.bezierCurveTo(-0.3, 0.8, -0.25, 0.3, 0, 0), i;
}
function ip(i, t) {
  const e = np(), n = {
    depth: 0.15,
    bevelEnabled: !0,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: he ? 1 : 2
  }, r = new _s(e, n), s = new Wn({
    color: 657938,
    side: 2,
    depthWrite: !1
  }), o = [
    { x: -10, z: 2, s: 1.3 },
    { x: -8, z: -1, s: 1 },
    { x: 10, z: 2, s: 1.2 },
    { x: 8, z: -1, s: 0.9 },
    { x: -4, z: -3, s: 1.1 }
  ], a = [];
  for (let l = 0; l < t && l < o.length; l++) {
    const c = o[l], h = new ie(r, s);
    h.position.set(c.x, -1.5, c.z), h.scale.setScalar(c.s), h.renderOrder = -1;
    const f = Math.random() * Math.PI * 2, p = (Math.random() - 0.5) * 0.04;
    (function(m, g) {
      h.userData.animate = function(_, d) {
        if (_.rotation.z = g + Math.sin(d * 0.3 + m) * 0.03, _.rotation.y = Je.current * 5e-3, !he) {
          const u = _.geometry.attributes.position;
          if (u && !_.userData._basePos && (_.userData._basePos = new Float32Array(u.array)), u && _.userData._basePos) {
            const T = _.userData._basePos;
            for (let v = 0; v < u.count; v += 5) {
              const b = T[v * 3 + 1];
              b > 1 && (u.array[v * 3] = T[v * 3] + Math.sin(d * 0.5 + T[v * 3] * 2) * 0.02 * (b / 5));
            }
            u.needsUpdate = !0;
          }
        }
      };
    })(f, p), i.add(h), a.push(h);
  }
  i.userData._cypressTrees = a;
}
function rp(i, t) {
  const e = new Float32Array(t * 3), n = new Float32Array(t), r = new Float32Array(t), s = new Float32Array(t * 3), o = [];
  for (let f = 0; f < t; f++) {
    const p = (Math.random() - 0.5) * 24, m = -1 + Math.random() * 7, g = -5 + Math.random() * 13;
    e[f * 3] = p, e[f * 3 + 1] = m, e[f * 3 + 2] = g, s[f * 3] = p, s[f * 3 + 1] = m, s[f * 3 + 2] = g, n[f] = Math.random() * Math.PI * 2, r[f] = 1 + Math.random() * 2, o.push({ x: 0, y: 0, z: 0 });
  }
  const a = new ce();
  a.setAttribute("position", new ae(e, 3)), a.setAttribute("phase", new ae(n, 1)), a.setAttribute("pulseSpeed", new ae(r, 1));
  const l = jt ? 5 : 8, c = new Re({
    uniforms: { uTime: { value: 0 }, uSize: { value: l } },
    vertexShader: Pd,
    fragmentShader: Ld,
    transparent: !0,
    depthWrite: !1,
    blending: 2
  }), h = new ds(a, c);
  h.userData._fireflyData = {
    count: t,
    basePositions: s,
    velocities: o,
    mouseNDC: { x: 999, y: 999 }
  }, h.userData.animate = function(f, p) {
    const m = f.userData._fireflyData, g = f.geometry.attributes.position.array, _ = i.userData._mouseNDC || { x: 999, y: 999 };
    for (let d = 0; d < m.count; d++) {
      if (jt && d % 2 === p % 2) continue;
      const u = m.velocities[d];
      u.x += (Math.random() - 0.5) * 2e-3, u.y += (Math.random() - 0.5) * 1e-3, u.z += (Math.random() - 0.5) * 2e-3, u.x *= 0.98, u.y *= 0.98, u.z *= 0.98, g[d * 3] += u.x, g[d * 3 + 1] += u.y, g[d * 3 + 2] += u.z;
      const T = m.basePositions[d * 3], v = m.basePositions[d * 3 + 1], b = m.basePositions[d * 3 + 2], R = g[d * 3] - T, A = g[d * 3 + 1] - v, w = g[d * 3 + 2] - b;
      if (Math.sqrt(R * R + A * A + w * w) > 5 && (g[d * 3] = T, g[d * 3 + 1] = v, g[d * 3 + 2] = b, u.x = 0, u.y = 0, u.z = 0), _.x < 900) {
        const M = g[d * 3], S = g[d * 3 + 1], U = M - _.x * 10, N = S - _.y * 8, Y = Math.sqrt(U * U + N * N);
        Y < 3 && Y > 0.01 && (u.x += U / Y * 0.05, u.y += N / Y * 0.05);
      }
    }
    f.geometry.attributes.position.needsUpdate = !0, f.material.uniforms.uTime.value = p;
  }, i.add(h), i.userData._fireflies = h;
}
function sp(i) {
  const t = jt ? 10 : 14, e = jt ? 7 : 10, n = he ? 10 : 20, r = new gi(t, e, 1, n), s = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/" + (jt ? "800" : "1280") + "px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", o = new ld().load(s);
  o.colorSpace = _e, o.minFilter = 1006;
  const a = new Re({
    uniforms: { uTexture: { value: o }, uRevealProgress: { value: 0 } },
    vertexShader: Dd,
    fragmentShader: Ud,
    transparent: !0,
    depthWrite: !1
  }), l = new ie(r, a);
  l.position.set(0, 1.5, -15), l.visible = !0, i.add(l), i.userData._paintingPlane = l, i.userData._paintingRevealState = { section: null, progress: 0 };
}
function ap(i) {
  if (!i.userData._paintingRevealState) return;
  const t = i.userData._paintingRevealState;
  if (!t.section && (t.section = document.getElementById("painting-reveal"), !t.section))
    return;
  const e = t.section.getBoundingClientRect(), n = window.innerHeight;
  let r = (n - e.top) / (n + e.height);
  r = Math.max(0, Math.min(1, r)), r = r * r * (3 - 2 * r), t.progress = r;
  const s = i.userData._paintingPlane;
  s && s.material.uniforms && (s.material.uniforms.uRevealProgress.value = r);
}
function op(i) {
  const t = i.scene, e = i.camera, n = i.renderer, r = new dd();
  r.params.Points.threshold = 2;
  const s = new rt();
  let o = [], a = [];
  const l = new fs({
    color: 8956671,
    transparent: !0,
    opacity: 0.6,
    blending: 2
  }), c = document.createElement("div");
  c.id = "constellation-hint", c.textContent = "✦ Tap stars to connect them", c.style.cssText = "position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.4);font-family:Inter,sans-serif;font-size:0.8rem;letter-spacing:0.05em;pointer-events:none;transition:opacity 1s;white-space:nowrap;", document.body.appendChild(c);
  function h() {
    c.style.opacity = "0", setTimeout(() => c.remove(), 1e3);
  }
  function f() {
    const d = document.createElement("canvas");
    d.width = 32, d.height = 32;
    const u = d.getContext("2d"), T = u.createRadialGradient(16, 16, 0, 16, 16, 16);
    return T.addColorStop(0, "rgba(255,220,100,1)"), T.addColorStop(0.5, "rgba(255,200,80,0.4)"), T.addColorStop(1, "rgba(255,180,50,0)"), u.fillStyle = T, u.fillRect(0, 0, 32, 32), new or(d);
  }
  const p = f();
  function m(d) {
    const u = d.clientX || d.touches && d.touches[0].clientX, T = d.clientY || d.touches && d.touches[0].clientY;
    if (u == null || T == null) return;
    s.x = u / window.innerWidth * 2 - 1, s.y = -(T / window.innerHeight) * 2 + 1, r.setFromCamera(s, e);
    const v = [];
    t.traverse((M) => {
      M.isPoints && M.geometry && M.geometry.attributes.size && v.push(M);
    });
    const b = r.intersectObjects(v);
    if (!b.length) return;
    const A = b[0].point.clone();
    let w = !1;
    for (let M = 0; M < o.length; M++)
      if (o[M].distanceTo(A) < 1.5) {
        w = !0;
        break;
      }
    if (w) return;
    o.push(A);
    const O = new ar(
      new _i({
        color: 16768392,
        transparent: !0,
        opacity: 0.8,
        map: p,
        depthWrite: !1
      })
    );
    if (O.position.copy(A), O.scale.set(2, 2, 1), O.userData.isHighlight = !0, t.add(O), o.length >= 2) {
      const M = new ce().setFromPoints([
        o[o.length - 2],
        o[o.length - 1]
      ]), S = new jr(M, l.clone());
      S.userData.isUserLine = !0, S.userData.createdAt = Date.now(), t.add(S), a.push(S), S.material.opacity = 0;
      const U = Date.now();
      S.userData.animate = function(N) {
        const Y = (Date.now() - U) / 1e3;
        N.material.opacity = Math.min(0.6, Y * 2), Date.now() - N.userData.createdAt > 3e4 && (N.material.opacity = Math.max(
          0,
          0.6 - (Date.now() - N.userData.createdAt - 3e4) / 5e3
        ));
      }, zd(a);
    }
    o.length === 2 && h(), o.length >= 6 && setTimeout(g, 5e3);
  }
  function g() {
    for (let u = a.length - 1; u >= 0; u--)
      t.remove(a[u]), a[u].geometry.dispose(), a[u].material.dispose();
    a = [], o = [];
    const d = [];
    t.traverse((u) => {
      u.userData.isHighlight && d.push(u);
    }), d.forEach((u) => t.remove(u)), localStorage.removeItem("atrija-constellations");
  }
  n.domElement.addEventListener("pointerdown", m), n.domElement.addEventListener("touchstart", m, {
    passive: !0
  });
  const _ = Gd();
  _ && _.length > 0 && t.userData._cypressTrees && _.forEach((d) => {
    const u = new ce().setFromPoints([
      new L(d.x1, d.y1, d.z1),
      new L(d.x2, d.y2, d.z2)
    ]), T = new jr(u, l.clone());
    T.userData.isUserLine = !0, T.userData.createdAt = Date.now() - 1e4, t.add(T), a.push(T);
  });
}
function lp(i) {
  var t = `
    uniform float uTime;
    uniform float uSwirlSpeed;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    // Simple 3D noise approximation using sin-based hash
    float _hash(vec3 p) {
      float n = sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453;
      return fract(n);
    }

    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n000 = _hash(i);
      float n100 = _hash(i + vec3(1, 0, 0));
      float n010 = _hash(i + vec3(0, 1, 0));
      float n110 = _hash(i + vec3(1, 1, 0));
      float n001 = _hash(i + vec3(0, 0, 1));
      float n101 = _hash(i + vec3(1, 0, 1));
      float n011 = _hash(i + vec3(0, 1, 1));
      float n111 = _hash(i + vec3(1, 1, 1));
      float nx00 = mix(n000, n100, f.x);
      float nx10 = mix(n010, n110, f.x);
      float nx01 = mix(n001, n101, f.x);
      float nx11 = mix(n011, n111, f.x);
      float nxy0 = mix(nx00, nx10, f.y);
      float nxy1 = mix(nx01, nx11, f.y);
      return mix(nxy0, nxy1, f.z);
    }

    void main() {
      vec3 pos = position;
      vec3 normalizedPos = normalize(position);

      // Compute swirl: rotate around Y axis based on height and time
      float elevation = normalizedPos.y;
      float swirlAngle = uTime * uSwirlSpeed * (0.3 + elevation * 0.7);
      float cosS = cos(swirlAngle);
      float sinS = sin(swirlAngle);
      vec3 swirledPos = vec3(
        pos.x * cosS - pos.z * sinS,
        pos.y,
        pos.x * sinS + pos.z * cosS
      );

      // Multi-octave noise for organic displacement
      float displacement = 0.0;
      // Large-scale swirl patterns
      displacement += noise3D(swirledPos * 0.08 + vec3(uTime * 0.02, 0.0, uTime * 0.01)) * 1.8;
      // Medium-scale undulation
      displacement += noise3D(swirledPos * 0.15 + vec3(0.0, uTime * 0.015, uTime * 0.025)) * 1.0;
      // Small-scale texture
      displacement += noise3D(swirledPos * 0.3 + vec3(uTime * 0.03, uTime * 0.02, 0.0)) * 0.4;

      // Bias displacement: poles move less, equator moves more (banded effect)
      float bandFactor = 0.5 + 0.5 * sin(elevation * 3.14159 * 4.0 + uTime * 0.1);
      displacement *= bandFactor * 0.6;

      // Apply displacement along the normal (inward for inverted sphere)
      vec3 displaced = pos - normalizedPos * displacement;

      vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `, e = `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uHighlightColor;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    float _hash(vec3 p) {
      float n = sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453;
      return fract(n);
    }

    void main() {
      // Gradient from deep blue at horizon to darker at zenith
      float elevation = normalize(vWorldPos).y;
      float gradient = smoothstep(-0.3, 0.6, elevation);

      // Mix base color with highlight based on displacement
      vec3 color = mix(uBaseColor, uHighlightColor, gradient * 0.3);

      // Subtle warm glow variation
      float warmNoise = _hash(floor(vWorldPos * 3.0));
      color += vec3(0.01, 0.005, 0.0) * warmNoise;

      // Slow pulsing brightness
      color *= 1.0 + 0.03 * sin(uTime * 0.15);

      gl_FragColor = vec4(color, 1.0);
    }
  `, n = new an(80, 48, 48), r = {
    uTime: { value: 0 },
    uSwirlSpeed: { value: 0.08 },
    uBaseColor: { value: new Bt(657950) },
    uHighlightColor: { value: new Bt(856104) }
  }, s = new Re({
    uniforms: r,
    vertexShader: t,
    fragmentShader: e,
    side: 1,
    depthWrite: !1
  }), o = new ie(n, s);
  return o.renderOrder = -999, o.frustumCulled = !1, o.userData.animate = function(a, l) {
    a.material.uniforms.uTime.value = l;
  }, i.add(o), { mesh: o, material: s };
}
class cp {
  constructor(t) {
    this.scene = new bf(), this.clock = new ho(), this.objects = [], this.container = t, this.renderer = new ja({
      antialias: !he,
      alpha: !0,
      powerPreference: "low-power"
    });
    const e = window.innerHeight;
    this.renderer.setSize(t.clientWidth, e), this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, he ? 1 : 1.5)
    ), this.renderer.setClearColor(657946, 1), t.appendChild(this.renderer.domElement), this.camera = new De(
      75,
      t.clientWidth / e,
      0.1,
      200
    ), this.camera.position.set(0, 1.5, 10), this.composer = new Md(this.renderer), this.composer.addPass(new Sd(this.scene, this.camera));
    const n = he ? 0.85 : 1, r = he ? 4 : 6, s = he ? 6 : 8;
    this.vgPass = new is({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uStrokeDensity: { value: r },
        uSwirlFrequency: { value: s },
        uColorIntensity: { value: n }
      },
      vertexShader: yd,
      fragmentShader: Ed
    }), this.composer.addPass(this.vgPass), this.glitchPass = new is({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
      vertexShader: Td,
      fragmentShader: bd
    }), this.composer.addPass(this.glitchPass), this.swirlSky = lp(this.scene), this.scene.add(new fd(16774624, 0.7));
    const o = new ud(16775399, 1.4);
    o.position.set(5, 10, 5), this.scene.add(o);
    const a = new co(16772829, 0.4, 50);
    a.position.set(-5, 3, -5), this.scene.add(a), window.addEventListener("resize", () => this.onResize()), this.animate();
  }
  add(t) {
    return this.scene.add(t), this.objects.push(t), t;
  }
  updateUniforms(t) {
    this.vgPass && (t.strokeDensity !== void 0 && (this.vgPass.uniforms.uStrokeDensity.value = t.strokeDensity), t.swirlFrequency !== void 0 && (this.vgPass.uniforms.uSwirlFrequency.value = t.swirlFrequency), t.colorIntensity !== void 0 && (this.vgPass.uniforms.uColorIntensity.value = t.colorIntensity));
  }
  onResize() {
    const t = this.container.clientWidth, e = window.innerHeight;
    this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.renderer.setSize(t, e), this.composer.setSize(t, e), qd(document.body.scrollHeight - window.innerHeight);
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime(), e = this.clock.getDelta();
    this.vgPass && (this.vgPass.uniforms.uTime.value = t), this.glitchPass.uniforms.uTime.value = t, uo && Math.abs(Je.target - Je.current) > 1e-3 && (Je.current += (Je.target - Je.current) * Je.smooth);
    const n = jt ? zn.mobileIntensityMultiplier : 1, r = Je.current;
    this.camera.position.x = Math.sin(t * 0.15) * 0.6, this.camera.position.y = 2 + Math.sin(t * 0.1) * 0.35, this.camera.rotation.z = r * zn.cameraRotationZ * n, this.camera.lookAt(0, 1.5, 0);
    const s = this.scene.userData._starsNear, o = this.scene.userData._starsMid, a = this.scene.userData._starsFar;
    if (s && (s.rotation.y = r * zn.starsNearRotationY * n), o && (o.rotation.y = r * zn.starsMidRotationY * n), a && (a.rotation.y = r * zn.starsFarRotationY * n), this.scene.userData._moonGroup) {
      const l = this.scene.userData._moonBaseY || 3;
      this.scene.userData._moonGroup.position.y = l + r * zn.moonVerticalOffset * n;
    }
    if (!jt) {
      const l = new Bt(526351), c = new Bt(855322);
      this.scene.background = l.clone().lerp(c, r);
    }
    for (let l = 0; l < this.objects.length; l++) {
      const c = this.objects[l];
      c.userData.animate && c.userData.animate(c, t, e);
    }
    this.shootingStarManager && this.shootingStarManager.update(t, e), ap(this.scene), this.composer.render();
  }
}
function Yr() {
  try {
    const i = document.getElementById("canvas-container");
    if (!i) return;
    ss && ss.observe(i);
    const t = new cp(i);
    t.scene.userData._camera = t.camera, window.__sceneLoadingStarted && window.__sceneLoadingStarted();
    const e = he ? 750 : 2500, n = he ? 15 : 18, r = he ? 5 : 10, s = he ? 2 : 4, o = he ? 15 : 20, a = he ? 18 : 32;
    window.__updateLoaderProgress && window.__updateLoaderProgress(30), Kd(t.scene, e), Id(t.scene), ep(t.scene, a), ip(t.scene, he ? 2 : 5), sp(t.scene), window.__updateLoaderProgress && window.__updateLoaderProgress(60), requestAnimationFrame(() => {
      window.__updateLoaderProgress && window.__updateLoaderProgress(90);
      const c = document.getElementById("loader");
      c && c.classList.add("hidden"), window.__updateLoaderProgress && window.__updateLoaderProgress(100), window.__sceneReady && window.__sceneReady();
    }), setTimeout(() => {
      Zd(t.scene, r), Jd(t.scene, s), Yd(t.scene, o), $d(t.scene), Qd(t.scene, n), rp(t.scene, he ? 15 : jt ? 20 : 40);
    }, 300), setTimeout(he ? () => {
      Da(t.scene);
    } : () => {
      Da(t.scene), t.shootingStarManager = jd(
        t.scene,
        jt ? 1 : 2
      ), op(t);
    }, 800);
    const l = document.getElementById("moon-phase-label");
    if (l) {
      const c = Nd();
      l.innerHTML = Od(c.fraction) + " " + Fd(c.fraction) + " · " + Math.round(c.illumination * 100) + "% illuminated";
    }
    t.scene.userData._mouseNDC = { x: 999, y: 999 }, window.addEventListener("mousemove", (c) => {
      t.scene.userData._mouseNDC.x = c.clientX / window.innerWidth * 2 - 1, t.scene.userData._mouseNDC.y = -(c.clientY / window.innerHeight) * 2 + 1;
    }), window.addEventListener(
      "touchmove",
      (c) => {
        c.touches && c.touches[0] && (t.scene.userData._mouseNDC.x = c.touches[0].clientX / window.innerWidth * 2 - 1, t.scene.userData._mouseNDC.y = -(c.touches[0].clientY / window.innerHeight) * 2 + 1);
      },
      { passive: !0 }
    ), document.addEventListener("click", (c) => {
      const h = c.target && c.target.tagName ? c.target.tagName.toLowerCase() : "";
      ["a", "button", "input", "textarea", "select"].includes(h) || c.target.closest && c.target.closest("#flute-container") || tp(c.clientX, c.clientY, jt ? 8 : 6);
    }), window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        t.onResize();
      }, 200);
    });
  } catch (i) {
    console.error("Scene init error:", i), window.__sceneFailed && window.__sceneFailed(i.message || String(i));
  }
}
typeof window < "u" && (window.bootScene = Yr, document.readyState !== "loading" ? Promise.resolve().then(() => Yr()) : document.addEventListener("DOMContentLoaded", () => Yr()));
export {
  Yr as bootScene
};
