'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*jslint esversion:6 */


var _validate = require('validate.io');

var _validate2 = _interopRequireDefault(_validate);

var _pathParser = require('path-parser');

var _pathParser2 = _interopRequireDefault(_pathParser);

var _parseUrl = require('parse-url');

var _parseUrl2 = _interopRequireDefault(_parseUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 工蜂负责处理爬虫下载的资源
 */
var Drone = function () {
    function Drone() {
        _classCallCheck(this, Drone);

        this.overlord = null;
        this.callbacks = {};
        this._host = null;
    }

    _createClass(Drone, [{
        key: 'host',
        value: function host() {
            var a = arguments;
            if (0 == a.length) {
                return this._host ? this._host.href : null;
            } else if (1 == a.length && _validate2.default.isString()) {
                this._host = (0, _parseUrl2.default)(a[0]);
            } else {
                throw new Error('invalid arguments: ' + arguments);
            }
        }

        /**
         * 抓取目标
         * crwal(url)
         * crawl(request)
         */

    }, {
        key: 'crawl',
        value: function crawl() {
            var a = arguments;
            if (1 == a.length && (_validate2.default.isURI(a[0]) || _validate2.default.isObject(a[0]))) {
                this.overlord.submit(a[0]);
            } else {
                throw new Error('invalid arguments: ' + arguments);
            }
        }

        /**
         * 处理抓取目标的反馈
         */

    }, {
        key: 'catch',
        value: function _catch(pattern, callback) {
            if (_validate2.default.isString(pattern) && _validate2.default.isFunction(callback)) {
                var list = this.callbacks[pattern] || [];
                list.push(callback);
                this.callbacks[pattern] = list;
            } else {
                throw new Error('invalid arguments ' + arguments);
            }
        }
    }, {
        key: 'feed',
        value: function feed(url, payload) {
            console.dir('feed ' + url + ': ' + payload);
            var parsedURL = (0, _parseUrl2.default)(url);
            if (parsedURL && (null == this._host || this._host.resource == parsedURL.resource)) {
                for (var pattern in this.callbacks) {
                    var parser = new _pathParser2.default(pattern);
                    console.log('url: ' + url + ' -> path: ' + parsedURL.pathname);
                    console.log('parser.test(\'' + pattern + '\', \'' + url + '\') = ' + parser.test(parsedURL.pathname));

                    if (parser.test(parsedURL.pathname)) {
                        var callbacks = this.callbacks[pattern];
                        callbacks.forEach(function (elem) {
                            elem(url, payload);
                        });
                    }
                }
            }
        }

        /**
         * 抛出生成的数据
         */

    }, {
        key: 'dump',
        value: function dump(id, entry) {
            this.overlord.put(id, entry);
        }

        /**
         * 载入生成的数据
         */

    }, {
        key: 'grab',
        value: function grab(id) {
            this.overlord.get(id, entry);
        }
    }]);

    return Drone;
}();

exports.default = Drone;