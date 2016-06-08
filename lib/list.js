'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
    _fs2.default.readdir(_const2.default.scaffoldDir, function (err, items) {
        if (err) console.error(_colors2.default.red('ERROR\t') + err);else items.map(function (item) {
            console.log('\t' + item);
        });
    });
}