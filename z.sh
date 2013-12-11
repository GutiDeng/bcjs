#!/bin/bash

script_dir=`cd "$(dirname "${BASH_SOURCE[0]}")"; pwd`

cd $script_dir/src

cat \
    core.js \
    loader.js \
    layout.js \
    frame.js \
    app.js \
    ua.js \
    ui.js \
    cookie.js \
> ../build/bcjs.js
    
cd -
