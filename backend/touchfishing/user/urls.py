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
    path('reset',views.resetPwd),
    path('shop',views.myShop),
    path('shop/new',views.openShop),
    path('shop/edit',views.editShop),
    path('orders',views.myOrders),
    path('order/<int:oid>',views.getOrder),
]
