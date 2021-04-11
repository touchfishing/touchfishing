#!/bin/bash
if [ x$1 != x ]
then
    dir=$1
else
    dir=..
fi
cd $dir
rm ./media/log.txt &
/usr/bin/python3 manage.py runserver 0.0.0.0:8010 &
wait
