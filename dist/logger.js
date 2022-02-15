var Logger = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __restKey = (key) => typeof key === "symbol" ? key : key + "";
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/.pnpm/serialize-error@8.1.0/node_modules/serialize-error/index.js
  var require_serialize_error = __commonJS({
    "node_modules/.pnpm/serialize-error@8.1.0/node_modules/serialize-error/index.js"(exports, module) {
      "use strict";
      var NonError = class extends Error {
        constructor(message) {
          super(NonError._prepareSuperMessage(message));
          Object.defineProperty(this, "name", {
            value: "NonError",
            configurable: true,
            writable: true
          });
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NonError);
          }
        }
        static _prepareSuperMessage(message) {
          try {
            return JSON.stringify(message);
          } catch (e) {
            return String(message);
          }
        }
      };
      var commonProperties = [
        { property: "name", enumerable: false },
        { property: "message", enumerable: false },
        { property: "stack", enumerable: false },
        { property: "code", enumerable: true }
      ];
      var isCalled = Symbol(".toJSON called");
      var toJSON = (from) => {
        from[isCalled] = true;
        const json = from.toJSON();
        delete from[isCalled];
        return json;
      };
      var destroyCircular = ({
        from,
        seen,
        to_,
        forceEnumerable,
        maxDepth,
        depth
      }) => {
        const to = to_ || (Array.isArray(from) ? [] : {});
        seen.push(from);
        if (depth >= maxDepth) {
          return to;
        }
        if (typeof from.toJSON === "function" && from[isCalled] !== true) {
          return toJSON(from);
        }
        for (const [key, value] of Object.entries(from)) {
          if (typeof Buffer === "function" && Buffer.isBuffer(value)) {
            to[key] = "[object Buffer]";
            continue;
          }
          if (typeof value === "function") {
            continue;
          }
          if (!value || typeof value !== "object") {
            to[key] = value;
            continue;
          }
          if (!seen.includes(from[key])) {
            depth++;
            to[key] = destroyCircular({
              from: from[key],
              seen: seen.slice(),
              forceEnumerable,
              maxDepth,
              depth
            });
            continue;
          }
          to[key] = "[Circular]";
        }
        for (const { property, enumerable } of commonProperties) {
          if (typeof from[property] === "string") {
            Object.defineProperty(to, property, {
              value: from[property],
              enumerable: forceEnumerable ? true : enumerable,
              configurable: true,
              writable: true
            });
          }
        }
        return to;
      };
      var serializeError2 = (value, options = {}) => {
        const { maxDepth = Number.POSITIVE_INFINITY } = options;
        if (typeof value === "object" && value !== null) {
          return destroyCircular({
            from: value,
            seen: [],
            forceEnumerable: true,
            maxDepth,
            depth: 0
          });
        }
        if (typeof value === "function") {
          return `[Function: ${value.name || "anonymous"}]`;
        }
        return value;
      };
      var deserializeError = (value, options = {}) => {
        const { maxDepth = Number.POSITIVE_INFINITY } = options;
        if (value instanceof Error) {
          return value;
        }
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          const newError = new Error();
          destroyCircular({
            from: value,
            seen: [],
            to_: newError,
            maxDepth,
            depth: 0
          });
          return newError;
        }
        return new NonError(value);
      };
      module.exports = {
        serializeError: serializeError2,
        deserializeError
      };
    }
  });

  // node_modules/.pnpm/ansicolor@1.1.95/node_modules/ansicolor/build/ansicolor.js
  var require_ansicolor = __commonJS({
    "node_modules/.pnpm/ansicolor@1.1.95/node_modules/ansicolor/build/ansicolor.js"(exports, module) {
      "use strict";
      var _slicedToArray = function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        } else {
          return Array.from(arr);
        }
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var O = Object;
      var colorCodes = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "lightGray", "", "default"];
      var colorCodesLight = ["darkGray", "lightRed", "lightGreen", "lightYellow", "lightBlue", "lightMagenta", "lightCyan", "white", ""];
      var styleCodes = ["", "bright", "dim", "italic", "underline", "", "", "inverse"];
      var asBright = {
        "red": "lightRed",
        "green": "lightGreen",
        "yellow": "lightYellow",
        "blue": "lightBlue",
        "magenta": "lightMagenta",
        "cyan": "lightCyan",
        "black": "darkGray",
        "lightGray": "white"
      };
      var types = {
        0: "style",
        2: "unstyle",
        3: "color",
        9: "colorLight",
        4: "bgColor",
        10: "bgColorLight"
      };
      var subtypes = {
        color: colorCodes,
        colorLight: colorCodesLight,
        bgColor: colorCodes,
        bgColorLight: colorCodesLight,
        style: styleCodes,
        unstyle: styleCodes
      };
      var clean = function clean2(obj) {
        for (var k in obj) {
          if (!obj[k]) {
            delete obj[k];
          }
        }
        return O.keys(obj).length === 0 ? void 0 : obj;
      };
      var Color = function() {
        function Color2(background, name, brightness) {
          _classCallCheck(this, Color2);
          this.background = background;
          this.name = name;
          this.brightness = brightness;
        }
        _createClass(Color2, [{
          key: "defaultBrightness",
          value: function defaultBrightness(value) {
            return new Color2(this.background, this.name, this.brightness || value);
          }
        }, {
          key: "css",
          value: function css(inverted) {
            var color = inverted ? this.inverse : this;
            var rgbName = color.brightness === Code.bright && asBright[color.name] || color.name;
            var prop = color.background ? "background:" : "color:", rgb2 = Colors2.rgb[rgbName], alpha = this.brightness === Code.dim ? 0.5 : 1;
            return rgb2 ? prop + "rgba(" + [].concat(_toConsumableArray(rgb2), [alpha]).join(",") + ");" : !color.background && alpha < 1 ? "color:rgba(0,0,0,0.5);" : "";
          }
        }, {
          key: "inverse",
          get: function get() {
            return new Color2(!this.background, this.name || (this.background ? "black" : "white"), this.brightness);
          }
        }, {
          key: "clean",
          get: function get() {
            return clean({
              name: this.name === "default" ? "" : this.name,
              bright: this.brightness === Code.bright,
              dim: this.brightness === Code.dim
            });
          }
        }]);
        return Color2;
      }();
      var Code = function() {
        function Code2(n) {
          _classCallCheck(this, Code2);
          if (n !== void 0) {
            this.value = Number(n);
          }
        }
        _createClass(Code2, [{
          key: "type",
          get: function get() {
            return types[Math.floor(this.value / 10)];
          }
        }, {
          key: "subtype",
          get: function get() {
            return subtypes[this.type][this.value % 10];
          }
        }, {
          key: "str",
          get: function get() {
            return this.value ? "[" + this.value + "m" : "";
          }
        }, {
          key: "isBrightness",
          get: function get() {
            return this.value === Code2.noBrightness || this.value === Code2.bright || this.value === Code2.dim;
          }
        }], [{
          key: "str",
          value: function str(x) {
            return new Code2(x).str;
          }
        }]);
        return Code2;
      }();
      O.assign(Code, {
        reset: 0,
        bright: 1,
        dim: 2,
        inverse: 7,
        noBrightness: 22,
        noItalic: 23,
        noUnderline: 24,
        noInverse: 27,
        noColor: 39,
        noBgColor: 49
      });
      var replaceAll = function replaceAll2(str, a, b) {
        return str.split(a).join(b);
      };
      var denormalizeBrightness = function denormalizeBrightness2(s) {
        return s.replace(/(\u001b\[(1|2)m)/g, "[22m$1");
      };
      var normalizeBrightness = function normalizeBrightness2(s) {
        return s.replace(/\u001b\[22m(\u001b\[(1|2)m)/g, "$1");
      };
      var wrap = function wrap2(x, openCode, closeCode) {
        var open = Code.str(openCode), close = Code.str(closeCode);
        return String(x).split("\n").map(function(line) {
          return denormalizeBrightness(open + replaceAll(normalizeBrightness(line), close, open) + close);
        }).join("\n");
      };
      var camel = function camel2(a, b) {
        return a + b.charAt(0).toUpperCase() + b.slice(1);
      };
      var stringWrappingMethods = function() {
        return [].concat(_toConsumableArray(colorCodes.map(function(k, i) {
          return !k ? [] : [
            [k, 30 + i, Code.noColor],
            [camel("bg", k), 40 + i, Code.noBgColor]
          ];
        })), _toConsumableArray(colorCodesLight.map(function(k, i) {
          return !k ? [] : [
            [k, 90 + i, Code.noColor],
            [camel("bg", k), 100 + i, Code.noBgColor]
          ];
        })), _toConsumableArray(["", "BrightRed", "BrightGreen", "BrightYellow", "BrightBlue", "BrightMagenta", "BrightCyan"].map(function(k, i) {
          return !k ? [] : [["bg" + k, 100 + i, Code.noBgColor]];
        })), _toConsumableArray(styleCodes.map(function(k, i) {
          return !k ? [] : [
            [k, i, k === "bright" || k === "dim" ? Code.noBrightness : 20 + i]
          ];
        }))).reduce(function(a, b) {
          return a.concat(b);
        });
      }();
      var assignStringWrappingAPI = function assignStringWrappingAPI2(target) {
        var wrapBefore = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : target;
        return stringWrappingMethods.reduce(function(memo, _ref) {
          var _ref2 = _slicedToArray(_ref, 3), k = _ref2[0], open = _ref2[1], close = _ref2[2];
          return O.defineProperty(memo, k, {
            get: function get() {
              return assignStringWrappingAPI2(function(str) {
                return wrapBefore(wrap(str, open, close));
              });
            }
          });
        }, target);
      };
      var TEXT = 0;
      var BRACKET = 1;
      var CODE = 2;
      function rawParse(s) {
        var state = TEXT, buffer = "", text = "", code = "", codes = [];
        var spans = [];
        for (var i = 0, n = s.length; i < n; i++) {
          var c = s[i];
          buffer += c;
          switch (state) {
            case TEXT:
              if (c === "") {
                state = BRACKET;
                buffer = c;
              } else {
                text += c;
              }
              break;
            case BRACKET:
              if (c === "[") {
                state = CODE;
                code = "";
                codes = [];
              } else {
                state = TEXT;
                text += buffer;
              }
              break;
            case CODE:
              if (c >= "0" && c <= "9") {
                code += c;
              } else if (c === ";") {
                codes.push(new Code(code));
                code = "";
              } else if (c === "m") {
                code = code || "0";
                codes.push(new Code(code));
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = void 0;
                try {
                  for (var _iterator = codes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _code = _step.value;
                    spans.push({ text, code: _code });
                    text = "";
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
                state = TEXT;
              } else {
                state = TEXT;
                text += buffer;
              }
          }
        }
        if (state !== TEXT)
          text += buffer;
        if (text)
          spans.push({ text, code: new Code() });
        return spans;
      }
      var Colors2 = function() {
        function Colors3(s) {
          _classCallCheck(this, Colors3);
          this.spans = s ? rawParse(s) : [];
        }
        _createClass(Colors3, [{
          key: Symbol.iterator,
          value: function value() {
            return this.spans[Symbol.iterator]();
          }
        }, {
          key: "str",
          get: function get() {
            return this.spans.reduce(function(str, p) {
              return str + p.text + p.code.str;
            }, "");
          }
        }, {
          key: "parsed",
          get: function get() {
            var color = void 0, bgColor = void 0, brightness = void 0, styles = void 0;
            function reset() {
              color = new Color(), bgColor = new Color(true), brightness = void 0, styles = new Set();
            }
            reset();
            return O.assign(new Colors3(), {
              spans: this.spans.map(function(span) {
                var c = span.code;
                var inverted = styles.has("inverse"), underline2 = styles.has("underline") ? "text-decoration: underline;" : "", italic2 = styles.has("italic") ? "font-style: italic;" : "", bold = brightness === Code.bright ? "font-weight: bold;" : "";
                var foreColor = color.defaultBrightness(brightness);
                var styledSpan = O.assign({ css: bold + italic2 + underline2 + foreColor.css(inverted) + bgColor.css(inverted) }, clean({ bold: !!bold, color: foreColor.clean, bgColor: bgColor.clean }), span);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = void 0;
                try {
                  for (var _iterator2 = styles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var k = _step2.value;
                    styledSpan[k] = true;
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
                if (c.isBrightness) {
                  brightness = c.value;
                } else if (span.code.value !== void 0) {
                  if (span.code.value === Code.reset) {
                    reset();
                  } else {
                    switch (span.code.type) {
                      case "color":
                      case "colorLight":
                        color = new Color(false, c.subtype);
                        break;
                      case "bgColor":
                      case "bgColorLight":
                        bgColor = new Color(true, c.subtype);
                        break;
                      case "style":
                        styles.add(c.subtype);
                        break;
                      case "unstyle":
                        styles.delete(c.subtype);
                        break;
                    }
                  }
                }
                return styledSpan;
              }).filter(function(s) {
                return s.text.length > 0;
              })
            });
          }
        }, {
          key: "asChromeConsoleLogArguments",
          get: function get() {
            var spans = this.parsed.spans;
            return [spans.map(function(s) {
              return "%c" + s.text;
            }).join("")].concat(_toConsumableArray(spans.map(function(s) {
              return s.css;
            })));
          }
        }, {
          key: "browserConsoleArguments",
          get: function get() {
            return this.asChromeConsoleLogArguments;
          }
        }], [{
          key: "parse",
          value: function parse2(s) {
            return new Colors3(s).parsed;
          }
        }, {
          key: "strip",
          value: function strip2(s) {
            return s.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g, "");
          }
        }, {
          key: "nice",
          get: function get() {
            Colors3.names.forEach(function(k) {
              if (!(k in String.prototype)) {
                O.defineProperty(String.prototype, k, { get: function get2() {
                  return Colors3[k](this);
                } });
              }
            });
            return Colors3;
          }
        }, {
          key: "ansicolor",
          get: function get() {
            return Colors3;
          }
        }]);
        return Colors3;
      }();
      assignStringWrappingAPI(Colors2, function(str) {
        return str;
      });
      Colors2.names = stringWrappingMethods.map(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1), k = _ref4[0];
        return k;
      });
      Colors2.rgb = {
        black: [0, 0, 0],
        darkGray: [100, 100, 100],
        lightGray: [200, 200, 200],
        white: [255, 255, 255],
        red: [204, 0, 0],
        lightRed: [255, 51, 0],
        green: [0, 204, 0],
        lightGreen: [51, 204, 51],
        yellow: [204, 102, 0],
        lightYellow: [255, 153, 51],
        blue: [0, 0, 255],
        lightBlue: [26, 140, 255],
        magenta: [204, 0, 204],
        lightMagenta: [255, 0, 255],
        cyan: [0, 153, 255],
        lightCyan: [0, 204, 255]
      };
      module.exports = Colors2;
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    LogLevels: () => LogLevels2,
    LogLevelsEnum: () => LogLevelsEnum,
    LoggerTransport: () => LoggerTransport,
    LoggerTransportName: () => LoggerTransportName,
    LoggerTransportNameEnum: () => LoggerTransportNameEnum,
    default: () => Logger
  });

  // package.json
  var version = "2.1.0";

  // src/interfaces.ts
  var LogLevelsEnum;
  (function(LogLevelsEnum2) {
    LogLevelsEnum2["DEBUG"] = "debug";
    LogLevelsEnum2["INFO"] = "info";
    LogLevelsEnum2["WARN"] = "warn";
    LogLevelsEnum2["ERROR"] = "error";
    LogLevelsEnum2["FATAL"] = "fatal";
    LogLevelsEnum2["ALL"] = "all";
    LogLevelsEnum2["RAW"] = "raw";
  })(LogLevelsEnum || (LogLevelsEnum = {}));
  var LoggerTransportNameEnum;
  (function(LoggerTransportNameEnum2) {
    LoggerTransportNameEnum2["CONSOLE"] = "console";
    LoggerTransportNameEnum2["SLACK"] = "slack";
    LoggerTransportNameEnum2["DISCORD"] = "discord";
    LoggerTransportNameEnum2["EMAIL"] = "email";
    LoggerTransportNameEnum2["SMS"] = "sms";
    LoggerTransportNameEnum2["SOCKET"] = "socket";
  })(LoggerTransportNameEnum || (LoggerTransportNameEnum = {}));

  // src/transports/base.ts
  var import_serialize_error = __toModule(require_serialize_error());
  var XXH;
  if (typeof window !== "undefined") {
    XXH = window.XXH;
  } else {
    XXH = __require("xxhashjs");
  }
  var stringify = (obj) => {
    let cache = [];
    const result = typeof obj === "string" ? obj : JSON.stringify(obj, (_key, value) => {
      if (value instanceof Error)
        return (0, import_serialize_error.serializeError)(value);
      if (typeof value === "object" && value !== null) {
        if (cache.includes(value))
          return void 0;
        cache.push(value);
      }
      return value;
    }, 2);
    cache = [];
    return result;
  };
  var _LoggerTransport = class {
    async debug(..._message) {
      return {};
    }
    async info(..._message) {
      return {};
    }
    async warn(..._message) {
      return {};
    }
    async error(..._message) {
      return {};
    }
    async fatal(..._message) {
      return {};
    }
    async all(..._message) {
      return {};
    }
    async raw(..._message) {
      return {};
    }
    format(message) {
      return message.map(stringify).join(" ").replace(/\n (\S)/g, "\n$1");
    }
    constructor({ r, destination, channelName }) {
      this._id = XXH.h32(destination, 43981).toString(16);
      this._r = r;
      this._isBrowser = process.env.IS_BROWSER && process.env.IS_BROWSER === "TRUE";
      this.channelName = channelName || "-";
      if (_LoggerTransport.instances[this._id]) {
        return _LoggerTransport.instances[this._id];
      }
      _LoggerTransport.instances[this._id] = this;
    }
  };
  var LoggerTransport = _LoggerTransport;
  LoggerTransport.instances = {};

  // node_modules/.pnpm/ansicolor@1.1.95/node_modules/ansicolor/build/ansicolor.mjs
  var import_ansicolor = __toModule(require_ansicolor());
  var nice = import_ansicolor.default.nice;
  var parse = import_ansicolor.default.parse;
  var strip = import_ansicolor.default.strip;
  var ansicolor = import_ansicolor.default.ansicolor;
  var black = import_ansicolor.default.black;
  var bgBlack = import_ansicolor.default.bgBlack;
  var red = import_ansicolor.default.red;
  var bgRed = import_ansicolor.default.bgRed;
  var green = import_ansicolor.default.green;
  var bgGreen = import_ansicolor.default.bgGreen;
  var yellow = import_ansicolor.default.yellow;
  var bgYellow = import_ansicolor.default.bgYellow;
  var blue = import_ansicolor.default.blue;
  var bgBlue = import_ansicolor.default.bgBlue;
  var magenta = import_ansicolor.default.magenta;
  var bgMagenta = import_ansicolor.default.bgMagenta;
  var cyan = import_ansicolor.default.cyan;
  var bgCyan = import_ansicolor.default.bgCyan;
  var lightGray = import_ansicolor.default.lightGray;
  var bgLightGray = import_ansicolor.default.bgLightGray;
  var bgDefault = import_ansicolor.default.bgDefault;
  var darkGray = import_ansicolor.default.darkGray;
  var bgDarkGray = import_ansicolor.default.bgDarkGray;
  var lightRed = import_ansicolor.default.lightRed;
  var bgLightRed = import_ansicolor.default.bgLightRed;
  var lightGreen = import_ansicolor.default.lightGreen;
  var bgLightGreen = import_ansicolor.default.bgLightGreen;
  var lightYellow = import_ansicolor.default.lightYellow;
  var bgLightYellow = import_ansicolor.default.bgLightYellow;
  var lightBlue = import_ansicolor.default.lightBlue;
  var bgLightBlue = import_ansicolor.default.bgLightBlue;
  var lightMagenta = import_ansicolor.default.lightMagenta;
  var bgLightMagenta = import_ansicolor.default.bgLightMagenta;
  var lightCyan = import_ansicolor.default.lightCyan;
  var bgLightCyan = import_ansicolor.default.bgLightCyan;
  var white = import_ansicolor.default.white;
  var bgWhite = import_ansicolor.default.bgWhite;
  var bgBrightRed = import_ansicolor.default.bgBrightRed;
  var bgBrightGreen = import_ansicolor.default.bgBrightGreen;
  var bgBrightYellow = import_ansicolor.default.bgBrightYellow;
  var bgBrightBlue = import_ansicolor.default.bgBrightBlue;
  var bgBrightMagenta = import_ansicolor.default.bgBrightMagenta;
  var bgBrightCyan = import_ansicolor.default.bgBrightCyan;
  var bright = import_ansicolor.default.bright;
  var dim = import_ansicolor.default.dim;
  var italic = import_ansicolor.default.italic;
  var underline = import_ansicolor.default.underline;
  var inverse = import_ansicolor.default.inverse;
  var names = import_ansicolor.default.names;
  var rgb = import_ansicolor.default.rgb;

  // src/transports/console.ts
  var LogLevels = __spreadValues({}, LogLevelsEnum);
  var ConsoleTransport = class extends LoggerTransport {
    constructor(options) {
      const r = Math.random().toString(36).substring(7);
      super(__spreadProps(__spreadValues({}, options), { r }));
      this.destination = options.destination;
      if (r !== this._r) {
        return this;
      }
    }
    async debug([prefixes, ...message]) {
      console.log(...this.recolor(lightMagenta(this.format([
        prefixes,
        LogLevels.DEBUG.toUpperCase(),
        "\u{1F41E}\uFE0F:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async info([prefixes, ...message]) {
      console.log(...this.recolor(green(this.format([
        prefixes,
        LogLevels.INFO.toUpperCase(),
        "\u2705\uFE0F:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async warn([prefixes, ...message]) {
      console.log(...this.recolor(yellow(this.format([
        prefixes,
        LogLevels.WARN.toUpperCase(),
        "\u{1F7E1}:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async error([prefixes, ...message]) {
      console.log(...this.recolor(red(this.format([
        prefixes,
        LogLevels.ERROR.toUpperCase(),
        "\u{1F6A8}\uFE0F:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async fatal([prefixes, ...message]) {
      console.log(...this.recolor(bgRed(this.format([
        prefixes,
        LogLevels.FATAL.toUpperCase(),
        "\u{1F480}:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async all([prefixes, ...message]) {
      console.log(...this.recolor(lightCyan(this.format([
        prefixes,
        LogLevels.ALL.toUpperCase(),
        "\u{1F4DD}:\n\n",
        ...message,
        "\n"
      ]).replace(/\n/g, "\n	"))));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    async raw([prefixes, ...message]) {
      console.log(this.format(message));
      return {
        destination: this.destination,
        channelName: this.channelName,
        result: true
      };
    }
    recolor(formattedMessage) {
      if (this._isBrowser) {
        return parse(formattedMessage).asChromeConsoleLogArguments;
      }
      return [formattedMessage];
    }
  };

  // src/transports/undefined.ts
  var UndefinedTransportError = class extends Error {
    constructor(message, transportResult) {
      super(message);
      this.transportResult = transportResult;
    }
  };
  var errorString = `LOGGER ERROR: transport "TRANSPORT_NAME" is NOT available, it was not defined in the logger options!`;
  var UndefinedTransport = class extends LoggerTransport {
    constructor(options) {
      const r = Math.random().toString(36).substring(7);
      super(__spreadProps(__spreadValues({}, options), { r }));
      console.log(...this.recolor(yellow(new Date().toISOString())), ...this.recolor(yellow(`WARN \u{1F7E1}:

	Logger transport "${options.name}" is NOT defined!
`)));
      this.destination = options.destination;
      this.transportName = options.name;
    }
    async debug(message) {
      this.throwDefault();
      return {};
    }
    async info(message) {
      this.throwDefault();
      return {};
    }
    async warn(message) {
      this.throwDefault();
      return {};
    }
    async error(message) {
      this.throwDefault();
      return {};
    }
    async fatal(message) {
      this.throwDefault();
      return {};
    }
    async all(message) {
      this.throwDefault();
      return {};
    }
    async raw(message) {
      this.throwDefault();
      return {};
    }
    throwDefault() {
      const errorMessage = errorString.replace("TRANSPORT_NAME", this.transportName || "undefined");
      const error = new UndefinedTransportError(errorMessage, {
        destination: this.destination,
        channelName: this.channelName,
        error: new Error(errorMessage)
      });
      throw error;
    }
    recolor(formattedMessage) {
      if (this._isBrowser) {
        return parse(formattedMessage).asChromeConsoleLogArguments;
      }
      return [formattedMessage];
    }
  };

  // src/index.ts
  var LoggerTransportName = __spreadValues({}, LoggerTransportNameEnum);
  var LogLevels2 = __spreadValues({}, LogLevelsEnum);
  var performanceShim;
  if (typeof window === "undefined" || !window.performance) {
    performanceShim = __require("perf_hooks").performance;
  } else {
    performanceShim = window.performance;
  }
  var LOG_LEVELS = {
    debug: 0,
    info: 10,
    warn: 20,
    error: 30,
    fatal: 40,
    all: 100,
    raw: 110
  };
  var defaultLoggerTransportOptions = {
    transport: LoggerTransportName.CONSOLE,
    options: {
      destination: LoggerTransportName.CONSOLE,
      channelName: LoggerTransportName.CONSOLE
    }
  };
  var defaultOptionsByLevel = {
    debug: [defaultLoggerTransportOptions],
    info: [defaultLoggerTransportOptions],
    warn: [defaultLoggerTransportOptions],
    error: [defaultLoggerTransportOptions],
    fatal: [defaultLoggerTransportOptions],
    all: [defaultLoggerTransportOptions],
    raw: [defaultLoggerTransportOptions]
  };
  var initialTransportInstances = {
    debug: [],
    info: [],
    warn: [],
    error: [],
    fatal: [],
    all: [],
    raw: []
  };
  var defaultTransports = {
    [LoggerTransportName.CONSOLE]: ConsoleTransport,
    [LoggerTransportName.SLACK]: UndefinedTransport,
    [LoggerTransportName.DISCORD]: UndefinedTransport,
    [LoggerTransportName.EMAIL]: UndefinedTransport,
    [LoggerTransportName.SMS]: UndefinedTransport,
    [LoggerTransportName.SOCKET]: UndefinedTransport
  };
  var _Logger = class {
    constructor({
      optionsByLevel,
      transports,
      singleton = true,
      logLevel,
      catchTransportErrors,
      fallbackTransport,
      appIdentifiers
    }) {
      this._timers = {};
      this.transportInstances = JSON.parse(JSON.stringify(initialTransportInstances));
      this.appIdentifiers = {};
      this.catchTransportErrors = false;
      this.optionsByLevel = __spreadValues(__spreadValues({}, defaultOptionsByLevel), optionsByLevel);
      this.availableTransports = __spreadValues(__spreadValues({}, defaultTransports), transports);
      this.appIdentifiers = appIdentifiers || {};
      const {
        LOG_LEVEL,
        LOGGER_CATCH_TRANSPORT_ERRORS
      } = process.env;
      this.catchTransportErrors = (LOGGER_CATCH_TRANSPORT_ERRORS || "").toLowerCase() === "true" || catchTransportErrors || this.catchTransportErrors;
      if (singleton && _Logger.instance)
        return _Logger.instance;
      if (singleton && !_Logger.instance)
        _Logger.instance = this;
      if (this.catchTransportErrors) {
        if (fallbackTransport) {
          this.fallbackTransport = new fallbackTransport({
            destination: `Logger:Fallback(${fallbackTransport.name})`
          });
        } else {
          this.fallbackTransport = new ConsoleTransport({ destination: "Logger:Fallback" });
        }
      }
      const envLogLevel = LOG_LEVELS[LOG_LEVEL];
      const destinations = [];
      const transportInstanceMap = {};
      Object.entries(LOG_LEVELS).forEach(([k, v]) => {
        this.broadcast;
        if (v >= (envLogLevel || (logLevel ? LOG_LEVELS[logLevel] : LOG_LEVELS[LogLevels2.DEBUG])) || k === LogLevels2.ALL) {
          let lvlOptions = this.optionsByLevel[k];
          if (lvlOptions.length === 0) {
            lvlOptions = defaultOptionsByLevel[k];
          }
          lvlOptions.forEach(({ transport, options }) => {
            const { destination } = options;
            const TransportClass = this.availableTransports[transport] || UndefinedTransport;
            if (!destinations.includes(destination)) {
              destinations.push(destination);
              transportInstanceMap[destination] = new TransportClass(__spreadValues({
                name: transport
              }, options));
            }
            this.transportInstances[k].push(transportInstanceMap[destination]);
          });
        }
      });
    }
    static hrTime() {
      return performanceShim.timeOrigin + performanceShim.now();
    }
    appIdString() {
      const {
        region,
        clusterType,
        cluster,
        hostname,
        ip,
        app
      } = this.appIdentifiers;
      const result = [
        region,
        clusterType,
        cluster,
        hostname,
        ip,
        app
      ].filter((i) => i).join(" > ");
      return result ? `[${result}]` : "";
    }
    time(operationIdentifier) {
      this._timers[operationIdentifier] = _Logger.hrTime();
    }
    async timeEnd(operationIdentifier) {
      var _a;
      const _b = this._timers, {
        [_a = `${operationIdentifier}`]: time
      } = _b, rest = __objRest(_b, [
        __restKey(_a)
      ]);
      if (!time) {
        await this.channel(LoggerTransportName.CONSOLE).warn(`Timer '${operationIdentifier}' does not exist`);
        return -1;
      }
      this._timers = rest;
      const result = _Logger.hrTime() - time;
      await this.raw(`${operationIdentifier}: ${result} ms`);
      return result;
    }
    cleanupTimers() {
      this._timers = {};
    }
    async debug(...message) {
      return await this.broadcast(message, LogLevels2.DEBUG);
    }
    async info(...message) {
      return await this.broadcast(message, LogLevels2.INFO);
    }
    async warn(...message) {
      return await this.broadcast(message, LogLevels2.WARN);
    }
    async error(...message) {
      return await this.broadcast(message, LogLevels2.ERROR);
    }
    async fatal(...message) {
      return await this.broadcast(message, LogLevels2.FATAL);
    }
    async all(...message) {
      return await this.broadcast(message, LogLevels2.ALL);
    }
    async log(...message) {
      return await this.broadcast(message, LogLevels2.ALL);
    }
    async raw(...message) {
      return await this.broadcast(message, LogLevels2.RAW);
    }
    channel(channelName) {
      return {
        [LogLevels2.DEBUG]: async (...message) => {
          return await this.broadcast(message, LogLevels2.DEBUG, channelName);
        },
        [LogLevels2.INFO]: async (...message) => {
          return await this.broadcast(message, LogLevels2.INFO, channelName);
        },
        [LogLevels2.WARN]: async (...message) => {
          return await this.broadcast(message, LogLevels2.WARN, channelName);
        },
        [LogLevels2.ERROR]: async (...message) => {
          return await this.broadcast(message, LogLevels2.ERROR, channelName);
        },
        [LogLevels2.FATAL]: async (...message) => {
          return await this.broadcast(message, LogLevels2.FATAL, channelName);
        },
        [LogLevels2.ALL]: async (...message) => {
          return await this.broadcast(message, LogLevels2.ALL, channelName);
        },
        [LogLevels2.RAW]: async (...message) => {
          return await this.broadcast(message, LogLevels2.RAW, channelName);
        }
      };
    }
    async broadcast(message, level, channelName = "-") {
      const results = [];
      await this.transportInstances[level].reduce(async (a, transport) => {
        await a;
        if (channelName === "-" || transport.channelName === channelName) {
          const result = transport[level]([
            [
              this.appIdString(),
              `[${new Date().toISOString()}]`
            ].join(" "),
            ...message
          ].filter((m) => m)).catch((e) => {
            if (!this.catchTransportErrors) {
              throw e;
            }
            ;
            const fallbackResult = this.fallbackTransport.error([
              [
                this.appIdString(),
                `[${new Date().toISOString()}]`
              ].join(" "),
              e
            ]).then((r) => __spreadValues(__spreadValues({}, e.transportResult || {}), r));
            return fallbackResult;
          });
          results.push(result);
          return result;
        }
        return Promise.resolve();
      }, Promise.resolve());
      return await Promise.all(results);
    }
  };
  var Logger = _Logger;
  Logger.version = version;
  Logger.LoggerTransportName = LoggerTransportName;
  Logger.LogLevels = LogLevels2;
  Logger.LoggerTransport = LoggerTransport;
  return src_exports;
})();
//# sourceMappingURL=logger.js.map
'undefined'!=typeof module&&(module.exports=Logger.default),'undefined'!=typeof window&&(Logger=Logger.default);