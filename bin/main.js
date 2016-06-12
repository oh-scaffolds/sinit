#!/usr/bin/env node

var colors = require('colors');
var path = require('path');
var fs = require('fs');
var args = process.argv.slice(2);
var log = require('../lib/log');
var yargs = require('yargs');

var argv = yargs.usage("$0 command")
        .command("create", "create new scaffold", require('../lib/create'))
        .command("add", "alias to create", require('../lib/create'))
        .command("delete", "remove one scaffold", require('../lib/delete'))
        .command("rm", "alias to delete", require('../lib/delete'))
        .command("new", "new project with scaffold", require('../lib/new'))
        .command("list", "list scaffolds that available", require('../lib/list'))
        .command("ls", "alias to list", require('../lib/list'))
        .command("clone", "clone a scaffold to a new one", require('../lib/clone'))
        .help("h")
        .alias("h", "help")
        .argv;

var subcmds = ['create', 'add', 'delete', 'rm', 'new', 'list', 'ls', 'clone'];
if(subcmds.indexOf(argv._[0]) < 0) {
    log.fatal('No sub-command: ' + colors.green(argv._[0]));
}
