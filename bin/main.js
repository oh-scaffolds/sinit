#!/usr/bin/env node

var colors = require('colors');
var path = require('path');
var fs = require('fs');
var args = process.argv.slice(2);
var log = require('../lib/log');


var subcmd = args.shift();
var fpath = path.join('../lib', subcmd + '.js');


fs.stat(path.join(__dirname, fpath), function(e, stat) {
    if (e) {
        if (e.code == 'ENOENT') {
            log.error('There is no command: ' + subcmd);
        }else {
            log.error(e);
        }
    }else if (stat){

        var cmd = require('../lib/'+ subcmd);
        if (!cmd.run) {
            log.error('There is no command: ' + subcmd);
        }else
            require('../lib/'+ subcmd).run(function(err) {
                if (err)
                    log.fatal(err);
            });
    }
});
