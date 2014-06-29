#!/usr/bin/env python

import sys, os

src = os.path.realpath(sys.argv[1])
dst = os.path.realpath(sys.argv[2])

basedir = os.path.dirname(src)
path = os.path.basename(src)

mode = 'browser'

outputFile = open(dst, 'w')

def mount(mountpath, filepath=None):
    parents = mountpath[:-1]
    current = mountpath[-1]
    if mode == 'browser':
        parents.insert(0, 'window')
    print parents, current
    outputFile.write(';(function(%s) {\n' % ', '.join(parents))
    if filepath:
        with open(filepath, 'r') as f:
            for line in f.readlines():
                outputFile.write('  ' + line)
    else:
        outputFile.write('  var %s = {}\n' % current)
    outputFile.write('  %s.%s = %s\n' % (parents[-1], current, current))
    outputFile.write('})(%s);\n\n' % ', '.join(parents))

def doPath(path):
    abspath = os.path.join(basedir, path)
    mountpath = path.split('/')
    if os.path.isdir(path):
        mount(mountpath)
        for child in os.listdir(path):
            doPath(os.path.join(path, child))
    else:
        if not abspath.endswith('.js'):
            return
        mountpath[-1] = mountpath[-1][:-3]
        mount(mountpath, abspath)
        
        
doPath(path)

