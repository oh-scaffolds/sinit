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

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _yargs = require('yargs');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _ignore = require('ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _util = require('./util');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(cb) {
    var _argv$_ = _slicedToArray(_yargs.argv._, 3);

    var _ = _argv$_[0];
    var scaffold = _argv$_[1];
    var dest = _argv$_[2];


    if (!scaffold) {
        cb('A scaffold name must be provided.');
        return;
    }

    if (!dest) {
        _inquirer2.default.prompt([{
            type: 'input',
            name: 'pname',
            message: 'Please enter project name:'
        }]).then(function (answers) {
            var pname = answers.pname;

            if (!pname) {
                (0, _log.fatal)('A project name must be provided!');
            }

            initScaffold(scaffold, pname, cb);
        });
    } else {
        initScaffold(scaffold, dest, cb);
    }
}

function initScaffold(scaffold, dest, callback) {
    var scDir = _path2.default.join(_const2.default.scaffoldDir, scaffold);
    var ig = (0, _ignore2.default)().add(['.git']);

    _fs2.default.stat(scDir, function (e, stat) {
        if (e) {
            if (e.code != 'ENOENT') {
                (0, _log.error)(e);
            } else {
                (0, _log.error)('There is no scaffold named: ' + scaffold);
            }
            process.exit(1);
        } else if (stat) {
            (function () {
                var encoding = _const2.default.cfgFile.get(scaffold, 'encoding');
                dest = _path2.default.join(process.cwd(), dest);

                var record = {};
                var phantom = new _mustache2.default.Context(record);
                phantom.lookup = function (name) {
                    var _name$split$map = name.split('|').map(function (str) {
                        return (str || '').trim();
                    });

                    var _name$split$map2 = _slicedToArray(_name$split$map, 3);

                    var vname = _name$split$map2[0];
                    var desc = _name$split$map2[1];
                    var _name$split$map2$ = _name$split$map2[2];
                    var type = _name$split$map2$ === undefined ? 'input' : _name$split$map2$;

                    if (vname) {
                        console.log('lookup', vname, desc || (0, _util.toDesc)(vname));
                        record[vname] = {
                            name: vname,
                            desc: desc,
                            type: type
                        };
                    }
                };

                (0, _util.fsoverride)(dest, 'Folder ' + _path2.default.basename(dest) + ' already exists. Override?').then(function (dest, isOverride) {
                    (0, _util.gs)("*", { dot: true, matchBase: true, cwd: scDir, encoding: encoding }).pipe(_through2.default.obj(function (file, enc, cb) {
                        if (ig.filter([file.path]).length > 0) {
                            _fs2.default.stat(file.path, function (err, stat) {
                                if (!err && stat && stat.isFile()) {
                                    cb(null, file, enc);
                                } else {
                                    cb(err);
                                }
                            });
                        } else cb();
                    })).pipe(_through2.default.obj(function (file, enc, cb) {
                        _fs2.default.readFile(file.path, enc, function (err, content) {
                            if (err) {
                                cb(err);
                            } else {
                                file.content = content;
                                cb(null, file, enc);
                            }
                        });
                    })).pipe(_through2.default.obj(function (file, enc, cb) {
                        // phantom render
                        _mustache2.default.render(file.filepath, phantom);
                        _mustache2.default.render(file.content, phantom);
                        cb(null, file);
                    })).pipe(_through2.default.obj(function (file, enc, cb) {
                        // ask variables

                        cb();
                    })).on('finish', function () {}).on('error', function (err) {
                        callback(err);
                    });
                });
            })();
        }
    }, function (e) {
        (0, _log.error)(e);
    });
}