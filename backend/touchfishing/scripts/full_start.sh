#!/bin/bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py makemigrations user
python manage.py makemigrations forum
python manage.py makemigrations api
python manage.py makemigrations movie
python manage.py migrate
export DJANGO_SUPERUSER_PASSWORD='travel123'
set DJANGO_SUPERUSER_PASSWORD='travel123'
python manage.py createsuperuser --noinput --username travel --email travel@mrning.com
python manage.py runserver 0.0.0.0:8000
celery -A travel worker  -c 4  -l INFO 
