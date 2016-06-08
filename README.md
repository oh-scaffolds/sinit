# Tinit - A tool to init your projects from template

Tinit is a tool that help you to create new project with templates across programming languages. It's not bind to any language specified structure, but all based on templates. You can create your own templates or using any existing project as templates.


# Usage

## Operate on templates locally

```
# from git repository
$ tinit add node https://github.com/test/test.git

# from local directly
$ tinit add node ./path/to/local/project

# remove templates
$ tinit remove node
or 
$ tinit rm node

# rename oldname newname
$ tinit rename node mynodeproj
```


## Use template to create new project

```
# preferred, use configured template name
$ tinit new node myproject

$ tinit new ./path/to/local/template myproject
```


# Configuration

Tinit will setup a configuration folder in your home directory with js/json format

```
+ /home/{user}/.tinit/
    + config.json // or config.js
    + templates/
        + node/
        + java/
        + go/
    + engines/
```

`config.json` will be looked like following:

```
module.exports = 
{
    prompt: "",
    escape: ""
};
```

And also you can put `.tinitrc` in your template folder, which will overwrite the configures globally.


# Why node

Many create templating packages, a great developer community to reuse the wonderful packages that already available in npm, which make me build tinit so fast. And also with better cli and cross-platform supports.


# License
Copyright © 2016-2018 Villadora Released under the MIT license.
