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

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

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

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _util = require('./util');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var valFmts = {};
for (var key in _validator2.default) {
    if (/^is(\w)+/.test(key)) {
        var fn = _validator2.default[key];
        if (_underscore2.default.isFunction(fn)) {
            valFmts[key.replace(/^is/, '').toLowerCase()] = fn.bind(_validator2.default);
        }
    }
}

function builder(yargs) {
    return yargs.usage('Usage: $0 new <scaffold> [project]').demand(2).showHelpOnFail(true, "Specify --help for available options");
};

function handler(argv) {
    var _argv$_ = _slicedToArray(argv._, 3);

    var _ = _argv$_[0];
    var scaffold = _argv$_[1];
    var dest = _argv$_[2];

    if (!scaffold) {
        (0, _log.fatal)('A scaffold name must be provided.');
    }

    var scDir = _path2.default.join(_const2.default.scaffoldDir, scaffold);
    _fs2.default.stat(scDir, function (e, stat) {
        if (e) {
            if (e.code != 'ENOENT') {
                (0, _log.error)(e);
            } else {
                (0, _log.error)('There is no scaffold named: ' + scaffold);
            }
            process.exit(1);
        } else if (stat) {
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

                    initScaffold(scaffold, pname, _log.error);
                });
            } else {
                initScaffold(scaffold, dest, _log.error);
            }
        }
    });
}

function initScaffold(scaffold, dest, callback) {
    var scDir = _path2.default.join(_const2.default.scaffoldDir, scaffold);
    var ig = (0, _ignore2.default)().add(['.git', _const2.default.localRcFile, _const2.default.skipRenderFile]);
    var encoding = _const2.default.cfgFile.get(scaffold, 'encoding');
    var skipRender = (0, _ignore2.default)().add(((0, _util.readFileNoErr)(_path2.default.join(scDir, _const2.default.skipRenderFile), encoding) || '').split('\n').map(function (p) {
        return p.trim().replace(/\/$/, '');
    }));

    dest = _path2.default.join(process.cwd(), dest);

    var sink = [];
    var record = {};
    var phantom = new _mustache2.default.Context(record);
    var rc = _dotObject2.default.object(_const2.default.loadRcCfg(scaffold));
    phantom.lookup = function (name) {
        var _name$split$map = name.split('|').map(function (str) {
            return (str || '').trim();
        });

        var _name$split$map2 = _slicedToArray(_name$split$map, 3);

        var vname = _name$split$map2[0];
        var desc = _name$split$map2[1];
        var vfmt = _name$split$map2[2];

        if (/\s/.test(vname)) {
            // ignore invalid vname
            return '';
        }

        var val = _dotObject2.default.pick(vname, rc);
        if (val) {
            return '';
        }

        if (vname) {
            var rec = record[vname];
            if (!rec) {
                rec = record[vname] = {
                    name: vname,
                    message: desc,
                    type: 'input',
                    validate: function validate(input) {
                        if (!input) return false;
                        return true;
                    }
                };
            }

            if (!rec.desc && desc) rec.desc = desc;

            if (vfmt) {
                rec.validate = function (input) {
                    if (!input) return false;
                    if (valFmts[vfmt]) {
                        return valFmts[vfmt](input);
                    }
                    return true;
                };
            }
        } else {
            (0, _log.warn)('Can not parse name from ' + _colors2.default.green(name));
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
                    file.encoding = enc;
                    file.content = content;
                    cb(null, file, enc);
                }
            });
        })).pipe(_through2.default.obj(function (file, enc, cb) {
            // phantom render
            _mustache2.default.render(file.filepath, phantom);
            _mustache2.default.render(file.content, phantom);
            sink.push(file);
            cb();
        })).on('finish', function () {
            var defaults = _dotObject2.default.dot(_const2.default.cfgFile.defaults);
            var questions = _underscore2.default.omit(record, _underscore2.default.keys(defaults).concat('project.name'));
            _inquirer2.default.prompt(_underscore2.default.values(questions).map(function (qs) {
                if (!qs.message) qs.message = (0, _util.toDesc)(qs.name);
                qs.message = qs.message + ':';
                return qs;
            })).then(function (answers) {
                var values = _underscore2.default.extend({}, answers, defaults, {
                    'project.name': _path2.default.basename(dest)
                });

                var context = new _mustache2.default.Context(values);
                context.lookup = function (name) {
                    var _name$split$map3 = name.split('|').map(function (str) {
                        return (str || '').trim();
                    });

                    var _name$split$map4 = _slicedToArray(_name$split$map3, 3);

                    var vname = _name$split$map4[0];
                    var desc = _name$split$map4[1];
                    var vfmt = _name$split$map4[2];

                    if (vname) {
                        var val = _dotObject2.default.pick(vname, rc);
                        if (val) {
                            if ((0, _util.isFunction)(val)) val = val.call(values);
                            return val;
                        }
                        return values[vname];
                    }
                    return name;
                };

                // do real render
                _async2.default.each(sink, function (file, cb) {
                    var target = _mustache2.default.render(file.filepath, context);
                    var filetarget = _path2.default.join(dest, target);
                    var dirtarget = _path2.default.dirname(filetarget);
                    (0, _mkdirp2.default)(dirtarget, function (err) {
                        if (err) cb(err);else {
                            var content = file.content;
                            if (skipRender.filter([file.path]).length > 0) {
                                // skip template render this file
                                content = _mustache2.default.render(file.content, context);
                            }

                            _fs2.default.writeFile(filetarget, content, file.encoding, function (err) {
                                cb(err);
                            });
                        }
                    });
                }, function (err) {
                    callback(err);
                });
            });
        }).on('error', function (err) {
            callback(err);
        });
    }, function (e) {
        if (e) (0, _log.error)(e);
    });
}