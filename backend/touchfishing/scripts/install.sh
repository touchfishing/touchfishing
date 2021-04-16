#!/bin/bash
echo "超级管理员设置"
read -p "用户名：" superuser
read -p "密码：" superpass
read -p "邮箱：" supermail
#apt install python3 python3-pip  build-essential -y
pip3 install -r requirements.txt
cd ..
python3 manage.py makemigrations
python3 manage.py makemigrations user
python3 manage.py makemigrations mall
python3 manage.py migrate
export DJANGO_SUPERUSER_PASSWORD=$superpass
python3 manage.py createsuperuser --noinput --username $superuser --email $supermail
unset DJANGO_SUPERUSER_PASSWORD
echo "完成"
