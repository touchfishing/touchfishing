from django.shortcuts import render

def index(request):
    return True

def open_shop(request):
    return True

def mod_shop(request):
    return True

def get_my_shop_list(request):
    return True

def close_shop(request):
    return False

def new_product(request):
    return True

def mod_product(request):
    return True

def new_order(request):
    return True

def mod_order(request):
    return True

def search_by_name(request):
    return True

def search_by_shop(request):
    return True

def my_order(request):
    return True

def product_by_class(request):
    return True
