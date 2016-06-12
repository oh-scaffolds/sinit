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

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function builder(yargs) {
    return yargs.usage('Usage: $0 delete <scaffold>').boolean('force').alias('f', 'force').describe('f', 'Force delete the scaffold').showHelpOnFail(true, "Specify --help for available options");
};

function handler(argv) {
    var cwd = process.cwd();

    var _argv$_ = _slicedToArray(argv._, 2);

    var _ = _argv$_[0];
    var scaffold = _argv$_[1];
    var _argv$force = argv.force;
    var force = _argv$force === undefined ? false : _argv$force;

    var dir = _path2.default.join(_const2.default.scaffoldDir, scaffold);
    var stat = void 0;
    try {
        stat = _fs2.default.statSync(dir);
    } catch (e) {
        if (e.code != 'ENOENT') {
            (0, _log.fatal)(e);
        }
    }

    if (stat) {
        if (force) {
            (0, _rimraf2.default)(dir, function (err) {
                if (err) (0, _log.fatal)(err);
            });
        } else {
            _inquirer2.default.prompt([{
                type: 'confirm',
                name: 'doDelete',
                message: 'You are deleting ' + _colors2.default.green(scaffold) + '. Are you sure?',
                default: true
            }]).then(function (answers) {
                var doDelete = answers.doDelete;

                if (doDelete) {
                    (0, _rimraf2.default)(dir, function (err) {
                        if (err) (0, _log.fatal)(err);else {
                            _const2.default.cfgFile.del(scaffold);
                        }
                    });
                }
            });
        }
    } else {
        (0, _log.warn)('Can not found scaffold: ' + _colors2.default.green(scaffold));
    }
}