# Sinit - A tool to initialize your projects from scaffold

`Sinit` is a tool that help you to create new project with scaffolds across programming languages. It's not bind to any language specified structure, but all based on scaffolds. You can create your own scaffolds or using any existing projects.


# Install

```
npm install -g sinit
```


# Usage

## Operate on scaffolds locally

```
# from git repository
$ sinit add node https://github.com/test/test.git

# from local directly
$ sinit add node ./path/to/local/project

# remove scaffolds
$ sinit remove node
or 
$ sinit rm node

# rename oldname newname
$ sinit rename node mynodeproj
```


## Use scaffold to create new project

```
# preferred, use configured template name
$ sinit new node myproject

```


## Config variables

```
# add new global variable
$ sinit config set user.name yourname

# remove variable
$ sinit config unset user.name
```



# Template

*Sinit* uses mustache as template engine with some new formats. All variables with '.' seperated style will be translated into question messages. 
Also you can put your custom prompts with '|' splitted, `{prop.name}|prompt text` like `user.email|Provide user's email`.
For example:

```
Hello, {{user.name}}
# will ask user with prompt message: User name:

My email is {{user.email|Provide user's email}}
# will ask user with prompt message: Provide user's email
```



# Configuration

Sinit will setup a configuration folder in your home directory with js/json format

```
+ /home/{user}/.sinit/
    + config.json // or config.js
    + scaffolds/
        + node/
        + java/
        + go/
    + engines/
```

`config.json` contains global default values and settings that differed in scaffolds. It will be looked like following:

```
module.exports = 
{
    defaults: {
        'user.name': 'yourname'
    },
    scaffolds: {
        someScaffold: {
            encoding: 'gbk'
        }
    }
};
```


# Why node

Many create templating packages, a great developer community to reuse the wonderful packages that already available in npm, which make me build sinit so fast. And also with better cli and cross-platform supports.


# License
Copyright © 2016-2018 Villadora Released under the MIT license.
