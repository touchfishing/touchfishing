#!/bin/bash
if [ x$1 != x ]
then
    dir=$1
else
    dir=..
fi
cd $dir
/usr/bin/python3 manage.py makemigrations
/usr/bin/python3 manage.py migrate
wait
