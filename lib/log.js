'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.fatal = fatal;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info() {
    console.log.apply(console, arguments);
};

function warn(msg) {
    console.warn(_colors2.default.yellow('WARN\t'), msg);
};

function error(e) {
    console.error(_colors2.default.red('ERROR\t'), e);
};

function fatal(e) {
    console.error(_colors2.default.magenta('FATAL\t'), e);
    process.exit(1);
}