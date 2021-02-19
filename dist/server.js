"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var axios_1 = __importDefault(require("axios"));
var db_1 = __importDefault(require("./db"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var Server = /** @class */ (function () {
    function Server(options) {
        var _this = this;
        var app = new koa_1.default();
        this.app = app;
        this.options = options;
        this.db = db_1.default(options.apiBaseUrl);
        app.use(koa_bodyparser_1.default());
        app.use(function (_a, next) {
            var request = _a.request, response = _a.response;
            return __awaiter(_this, void 0, void 0, function () {
                var body, headersConfig_1, e_1, rspData, sourceData;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, next()];
                        case 1:
                            _c.sent();
                            if (!request.path.includes(options.apiBaseUrl)) return [3 /*break*/, 6];
                            body = { data: __assign({ code: '0', msg: '' }, options.rightDataTemplate) };
                            headersConfig_1 = {};
                            (_b = options.headerConfig) === null || _b === void 0 ? void 0 : _b.forEach(function (c) {
                                request.header[c] && (headersConfig_1[c] = request.header[c]);
                            });
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, axios_1.default.request({
                                    url: options.apiDomain + request.url,
                                    method: request.method,
                                    timeout: options.timeout || 3000,
                                    headers: __assign({ cookie: request.header.cookie }, headersConfig_1),
                                    data: __assign({}, request.body)
                                })];
                        case 3:
                            body = _c.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _c.sent();
                            console.log(e_1);
                            body = {
                                data: {
                                    code: '99999',
                                    msg: e_1
                                }
                            };
                            return [3 /*break*/, 5];
                        case 5:
                            rspData = body.data;
                            sourceData = body.data;
                            if (this.checkBodyRight(body.data, options.rightDataTemplate)) {
                                this.db.push(request.path, body.data);
                            }
                            else {
                                try {
                                    rspData = this.db.getData(request.path) || sourceData;
                                }
                                catch (_d) {
                                    rspData = sourceData;
                                }
                            }
                            response.body = __assign(__assign({}, rspData), { sourceData: sourceData });
                            return [3 /*break*/, 7];
                        case 6:
                            response.body = '接口不支持，请确认接口url';
                            _c.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        });
        app.listen(options.port || 3000);
    }
    Server.prototype.checkBodyRight = function (data, rightData) {
        if (Array.isArray(rightData)) {
            return rightData.some(function (r) {
                return Object.keys(r).every(function (key) {
                    return r[key] === data[key];
                });
            });
        }
        else {
            return Object.keys(rightData).every(function (key) {
                return rightData[key] === data[key];
            });
        }
    };
    return Server;
}());
exports.default = Server;
