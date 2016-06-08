'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.run = run;

var _isUrl = require('is-url');

var _isUrl2 = _interopRequireDefault(_isUrl);

var _gitUrlParse = require('git-url-parse');

var _gitUrlParse2 = _interopRequireDefault(_gitUrlParse);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _yargs = require('yargs');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _ignore = require('ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _child_process = require('child_process');

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _util = require('./util');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
    var _argv$_ = _slicedToArray(_yargs.argv._, 3);

    var _ = _argv$_[0];
    var scaffold = _argv$_[1];
    var source = _argv$_[2];
    var encoding = _yargs.argv.encoding;


    var dest = _path2.default.join(_const2.default.scaffoldDir, scaffold);
    (0, _util.fsoverride)(dest, 'Scaffold ' + _colors2.default.green(scaffold) + ' is already exist. Do override?').then(function (dest, isOverride) {
        if ((0, _isUrl2.default)(source)) {
            // it should be a git url
            var parsed = (0, _gitUrlParse2.default)(source);
            cloneGitScaffold(source, dest, {
                scaffold: scaffold,
                cleanOnError: !isOverride
            }, function (err) {
                if (err) {
                    (0, _log.error)(err);
                } else {
                    if (encoding) {
                        _const2.default.cfgFile.set(scaffold, 'encoding', encoding);
                    }
                    (0, _log.info)('Scaffold ' + _colors2.default.green(scaffold) + ' is created.');
                }
            });
        } else {
            var src = _path2.default.join(process.cwd(), source);
            // it's a local folder
            copyScaffold(src, dest, {
                scaffold: scaffold,
                encoding: encoding
            }, function (err) {
                if (err) (0, _log.error)(err);else {
                    if (encoding) _const2.default.cfgFile.set(scaffold, 'encoding', encoding);
                    (0, _log.info)('Scaffold ' + _colors2.default.green(scaffold) + ' is created.');
                }
            });
        }
    }, function (e) {
        (0, _log.error)(err);
    });
}

function cloneGitScaffold(gitUrl, dest, opt, callback) {
    var _ref = opt || {};

    var _ref$scaffold = _ref.scaffold;
    var scaffold = _ref$scaffold === undefined ? 'default' : _ref$scaffold;
    var _ref$cleanOnError = _ref.cleanOnError;
    var cleanOnError = _ref$cleanOnError === undefined ? false : _ref$cleanOnError;

    var execCmd = 'git clone --depth 1 ' + gitUrl + ' ' + dest;
    (0, _child_process.exec)(execCmd, function (err, stdout, stderr) {
        if (err) {
            (0, _log.error)(err);
            if (cleanOnError) {
                (0, _rimraf2.default)(dest, function (err) {
                    if (err) (0, _log.error)(err);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        } else {
            callback();
        }
    });
}

function copyScaffold(src, dest, opt, callback) {
    var _ref2 = opt || {};

    var _ref2$encoding = _ref2.encoding;
    var encoding = _ref2$encoding === undefined ? 'utf8' : _ref2$encoding;
    var _ref2$scaffold = _ref2.scaffold;
    var scaffold = _ref2$scaffold === undefined ? 'default' : _ref2$scaffold;

    var ignores = (_fs2.default.readFileSync(_path2.default.join(src, _const2.default.ignoreFile), encoding) || '').split('\n').map(function (p) {
        return p.replace(/\/$/, '');
    }).concat('.git');
    var ig = (0, _ignore2.default)().add(ignores);

    (0, _util.gs)("*", { dot: true, matchBase: true, cwd: src }).pipe(_through2.default.obj(function (file, encoding, cb) {
        if (ig.filter([file.path]).length > 0) {
            cb(null, file, encoding);
        } else cb();
    })).pipe(_through2.default.obj(function (file, enncoding, cb) {
        // read
        _fs2.default.stat(file.path, function (err, fstat) {
            if (!err && fstat.isFile()) {
                file.content = _fs2.default.readFileSync(file.path, encoding);
                cb(null, file, encoding);
            } else cb(err);
        });
    })).pipe(_through2.default.obj(function (file, encoding, cb) {
        // write
        var fpath = _path2.default.join(dest, file.filepath);
        var dir = _path2.default.dirname(fpath);
        _fs2.default.stat(dir, function (err, stat) {
            if (err) {
                // directory is not existed
                try {
                    _mkdirp2.default.sync(dir);
                } catch (e) {
                    cb(e);
                    return;
                }
            }

            _fs2.default.writeFile(fpath, file.content, encoding, function (err) {
                if (!err) {
                    file.done = true;
                    cb(null, file);
                } else cb(err);
            });
        });
    })).on('finish', function () {
        callback();
    }).on('error', function (error) {
        callback(error);
    });
}