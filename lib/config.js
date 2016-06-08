'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.run = run;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _yargs = require('yargs');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var behaviours = {
    set: function set(values, prop, val) {
        values[prop] = val;
    },
    unset: function unset(values, prop, val) {
        delete values[prop];
    }
};

function run(cb) {
    var _argv$_ = _slicedToArray(_yargs.argv._, 4);

    var _ = _argv$_[0];
    var subcmd = _argv$_[1];
    var prop = _argv$_[2];
    var val = _argv$_[3];


    if (!subcmd) {
        (0, _log.fatal)('A sub-command should be provided for ' + _colors2.default.green('config') + '.');
    }

    if (!behaviours[subcmd]) {
        (0, _log.fatal)('There is no config sub-command for: ' + _colors2.default.green(subcmd));
    }

    if (!prop) {
        (0, _log.fatal)('A property name should be provided.');
    }

    var values = _const2.default.cfgFile.defaults;
    behaviours[subcmd](values, prop, val);
}