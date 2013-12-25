#!/bin/bash

script_dir=`cd "$(dirname "${BASH_SOURCE[0]}")"; pwd`

cd $script_dir/src

cat \
    core.js \
    dom.js \
    loader.js \
    layout.js \
    group.js \
    app.js \
    ua.js \
    ui.js \
    cookie.js \
    ajax.js \
> ../build/bcjs.js
    
cd -

#    frame.js \
