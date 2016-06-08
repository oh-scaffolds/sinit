'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gs = gs;
exports.toDesc = toDesc;
exports.capitalize = capitalize;
exports.fsoverride = fsoverride;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function gs(g, opt) {
    var cwd = opt.cwd,
        enc = opt.encoding || 'utf8',
        stream = _through2.default.obj({ objectMode: true }, function (filepath, encoding, cb) {
        this.push({
            cwd: cwd,
            filepath: filepath,
            path: _path2.default.resolve(cwd, filepath)
        });
        cb();
    });
    var globber = new _glob2.default.Glob(g, opt);
    globber.on('error', stream.emit.bind(stream, 'error'));
    globber.on('end', function () {
        stream.end();
    });
    globber.on('match', function (filename) {
        stream.write(_path2.default.normalize(filename), enc);
    });
    return stream;
}

function toDesc(str) {
    return capitalize((str || '').replace(/\./g, ' '));
}

function capitalize(str) {
    str = (str || '').trim();
    return str[0] ? str[0].toUpperCase() + str.substr(1).toLowerCase() : strl;
}

function fsoverride(path, msg) {
    return new Promise(function (resolve, reject) {
        _fs2.default.stat(path, function (e, stat) {
            if (e) {
                if (e.code != 'ENOENT') {
                    reject(e);
                } else {
                    resolve(path);
                }
            } else {
                _inquirer2.default.prompt([{
                    type: 'confirm',
                    name: 'isOverride',
                    message: msg,
                    default: true
                }]).then(function (answers) {
                    var isOverride = answers.isOverride;

                    if (isOverride) {
                        (0, _rimraf2.default)(path, function (err) {
                            if (err) {
                                reject(err);
                            } else resolve(path, isOverride);
                        });
                    } else {
                        reject();
                    }
                });
            }
        });
    });
}