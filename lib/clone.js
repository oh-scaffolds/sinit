'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.builder = builder;
exports.handler = handler;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _util = require('./util');

var _create = require('./create');

var _list = require('./list');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function builder(yargs) {
    return yargs.usage('Usage: $0 clone <new-scaffold> <origin-scaffold>').demand(3).showHelpOnFail(true, "Specify --help for available options");
}

function handler(argv) {
    var _argv$_ = _slicedToArray(argv._, 3);

    var _ = _argv$_[0];
    var newscaffold = _argv$_[1];
    var oldscaffold = _argv$_[2];


    (0, _list.listScaffolds)(function (err, scaffolds) {
        if (err) return (0, _log.fatal)(err);
        if (scaffolds.indexOf(oldscaffold) < 0) {
            return (0, _log.error)('Old scaffold must be provided.');
        }

        var dest = _path2.default.join(_const2.default.scaffoldDir, newscaffold);

        (0, _util.fsoverride)(dest, 'Scaffold ' + _colors2.default.green(newscaffold) + ' is already exist. Do override?').then(function (dest, isOverride) {
            var src = _path2.default.join(_const2.default.scaffoldDir, oldscaffold);
            var encoding = _const2.default.cfgFile.get(oldscaffold, 'encoding');
            // it's a local folder
            (0, _create.copyScaffold)(src, dest, {
                scaffold: newscaffold,
                encoding: encoding
            }, function (err) {
                if (err) (0, _log.error)(err);else {

                    _const2.default.cfgFile.set(newscaffold, 'source', oldscaffold);
                    if (encoding) _const2.default.cfgFile.set(newscaffold, 'encoding', encoding);
                    (0, _log.info)('Scaffold ' + _colors2.default.green(newscaffold) + ' is created.');
                }
            });
        });
    });
}