#!/bin/bash
if [ x$1 != x ]
then
    dir=$1
else
    dir=..
fi
cd $dir
find . -name "*.pyc" | xargs rm