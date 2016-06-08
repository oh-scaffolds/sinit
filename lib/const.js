'use strict';

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfgDir = '.tinit';
var cfgFile = 'config.js';
var scaffoldDir = 'scaffolds';
var ignoreFile = '.gitignore';

var fpath = _path2.default.join(_osenv2.default.home(), cfgDir, cfgFile);

var cfgObj = {};
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
            get: function get(scaffold, prop) {
                var obj = cfgObj[scaffold];
                if (obj) {
                    return obj[prop];
                }
            },
            set: function set(scaffold, prop, val) {
                var obj = cfgObj[scaffold] = cfgObj[scaffold] || {};
                obj[prop] = val;
            },
            del: function del(scaffold, prop) {
                var obj = cfgObj[scaffold];
                if (obj && prop) {
                    delete obj[prop];
                }

                if (!prop || !obj || obj.keys().length == 0) {
                    delete cfgObj[scaffold];
                }
            },
            flush: function flush() {
                _fs2.default.writeFileSync(fpath, JSON.stringify(cfgObj, null, 2), 'utf8');
            }
        };
    },
    get scaffoldDir() {
        return _path2.default.join(_osenv2.default.home(), cfgDir, scaffoldDir);
    },
    ignoreFile: '.gitignore'
};