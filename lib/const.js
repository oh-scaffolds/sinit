'use strict';

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('./util');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfgDir = '.sinit';
var cfgFile = 'config.js';
var scaffoldDir = 'scaffolds';
var ignoreFile = '.gitignore';

var fpath = _path2.default.join(_osenv2.default.home(), cfgDir, cfgFile);

var cfgObj = {
    defautls: {},
    scaffolds: {}
};
try {
    cfgObj = JSON.parse(_fs2.default.readFileSync(fpath, 'utf8'));
} catch (e) {
    if (e.code == 'ENOENT') {
        (0, _log.info)('Initial config.js');
    } else {
        (0, _log.error)(e);
    }
}

process.on('exit', function () {
    _fs2.default.writeFileSync(fpath, JSON.stringify(cfgObj, null, 2), 'utf8');
});

module.exports = {
    get cfgDir() {
        return _path2.default.join(_osenv2.default.home(), cfgDir);
    },
    get cfgFile() {
        return {
            get defaults() {
                cfgObj.defaults = cfgObj.defaults || {};
                return cfgObj.defaults;
            },
            get: function get(scaffold, prop) {
                var obj = cfgObj.scaffolds[scaffold];
                if (obj) {
                    return obj[prop];
                }
            },
            set: function set(scaffold, prop, val) {
                var obj = cfgObj.scaffolds[scaffold] = cfgObj.scaffolds[scaffold] || {};
                obj[prop] = val;
            },
            del: function del(scaffold, prop) {
                var obj = cfgObj.scaffolds[scaffold];
                if (obj && prop) {
                    delete obj[prop];
                }
            },
            flush: function flush() {
                _fs2.default.writeFileSync(fpath, JSON.stringify((0, _util.clsObj)(cfgObj), null, 2), 'utf8');
            }
        };
    },
    get scaffoldDir() {
        return _path2.default.join(_osenv2.default.home(), cfgDir, scaffoldDir);
    },
    ignoreFile: '.gitignore'
};