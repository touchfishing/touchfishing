from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('login', views.login),
    path('logout', views.logout),
    path('register', views.register),
    path('password', views.modPwd),
    path('avatar', views.uploadAvatar),
    path('captcha', views.getCAPTCHA),
    path('info', views.updateInfo),
    path('reset',views.resetPwd)
]
