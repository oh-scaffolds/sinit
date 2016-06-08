# Pinit - A tool to init your projects from scaffold

`Pinit`` is a tool that help you to create new project with scaffolds across programming languages. It's not bind to any language specified structure, but all based on scaffolds. You can create your own scaffolds or using any existing projects.


# Usage

## Operate on scaffolds locally

```
# from git repository
$ pinit add node https://github.com/test/test.git

# from local directly
$ pinit add node ./path/to/local/project

# remove scaffolds
$ pinit remove node
or 
$ pinit rm node

# rename oldname newname
$ pinit rename node mynodeproj
```


## Use scaffold to create new project

```
# preferred, use configured template name
$ pinit new node myproject

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

And also you can put `.sinitrc` in your template folder, which will overwrite the configures globally.


# Why node

Many create templating packages, a great developer community to reuse the wonderful packages that already available in npm, which make me build sinit so fast. And also with better cli and cross-platform supports.


# License
Copyright © 2016-2018 Villadora Released under the MIT license.
