from django.shortcuts import render
import os
from user.models import User
from django.http import HttpResponse
from mall.models import Shop,Product,Order
import threading
import random
import json

lock = threading.Lock()

def newProduct(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    shop_obj = Shop.objects.filter(user=user_obj).first()
    if not shop_obj:
        return return403('用户尚无店铺')
    pname = request.POST.get("pname")
    info = request.POST.get("info")
    tag = request.POST.get("tag")
    cover = request.FILES.get('cover',None)
    specs = request.POST.get("specs")
    prices = request.POST.get("prices")
    stocks = request.POST.get("stocks")

    spec_list = specs.split(',')
    price_list = list(map(float,prices.split(','))),
    stock_list = list(map(int,stocks.split(','))),

    tmpLen = len(spec_list)
    if((tmpLen!=len(price_list)) or (tmpLen!=len(stock_list))):
        return return403('spec_list, price_list, stock_list长度不一致')

    shipping_region = request.POST.get("shipping_region")
    if not (pname and prices and info and tag and specs and stocks):
        return return403('缺少参数')
    
    product_obj = Product(pname=pname,shop=shop_obj,prices=prices,info=info,tag=tag,specs=specs,stocks=stocks)
    if cover:
        f, e = os.path.splitext(cover.name)
        imgName=str(product_obj.sid)+e
        cover.name = imgName
        product_obj.cover = cover
    product_obj.save()
    return_data = {
        'pid' : product_obj.pid,
        'pname' : product_obj.pname,
        'sid' : product_obj.shop.sid,
        'sname' : product_obj.shop.sname,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'specs' : product_obj.specs.split(','),
        'prices' : list(map(float,product_obj.prices.split(','))),
        'stocks' : list(map(int,product_obj.stocks.split(','))),
        'shipping_region' : product_obj.shipping_region,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.update_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    return returnList(return_data)

def getProduct(request,pid):
    product_obj = Product.objects.filter(pid=pid).first()
    if not product_obj:
        return return403('找不到产品')
    return_data = {
        'pid' : product_obj.pid,
        'pname' : product_obj.pname,
        'sid' : product_obj.shop.sid,
        'sname' : product_obj.shop.sname,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'specs' : product_obj.specs.split(','),
        'prices' : list(map(float,product_obj.prices.split(','))),
        'stocks' : list(map(int,product_obj.stocks.split(','))),
        'shipping_region' : product_obj.shipping_region,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.update_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    return returnList(return_data)

def editProduct(request,pid):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    shop_obj = Shop.objects.filter(user=user_obj).first()
    if not shop_obj:
        return return403('用户尚无店铺')
    product_obj = Product.objects.filter(pid=pid,shop=shop_obj).first()
    if not product_obj:
        return return403('用户店铺内找不到该商品')
    pname = request.POST.get("pname")
    prices = request.POST.get("prices")
    info = request.POST.get("info")
    tag = request.POST.get("tag")
    cover = request.FILES.get('cover',None)
    stocks = request.POST.get("stocks")
    specs = request.POST.get("specs")
    shipping_region = request.POST.get("shipping_region")
    if pname:
        product_obj.pname=pname
    if prices:
        product_obj.prices=prices
    if info:
        product_obj.info=info
    if tag:
        product_obj.tag=tag
    if stocks:
        product_obj.stocks=stocks
    if specs:
        product_obj.specs=specs
    if shipping_region:
        product_obj.shipping_region=shipping_region
    if cover:
        f, e = os.path.splitext(cover.name)
        imgName=str(product_obj.sid)+e
        cover.name = imgName
        if os.path.isfile(product_obj.cover.path): #删除已经存在的图片
            if 'default' not in product_obj.cover.path:
                os.remove(product_obj.cover.path)
        product_obj.cover = cover
    product_obj.save()
    return_data = {
        'pid' : product_obj.pid,
        'pname' : product_obj.pname,
        'sid' : product_obj.shop.sid,
        'sname' : product_obj.shop.sname,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'specs' : product_obj.specs.split(','),
        'prices' : list(map(float,product_obj.prices.split(','))),
        'stocks' : list(map(int,product_obj.stocks.split(','))),
        'shipping_region' : product_obj.shipping_region,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.update_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    return returnList(return_data)

def placeOrder(request,pid):
    uid = request.session.get('uid',None)
    address = request.POST.get("address")
    quantity = request.POST.get("quantity")
    spec = request.POST.get("spec")
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    if not(address and quantity and spec):
        return return403('缺少address或quantity或spec')
    product_obj = Product.objects.filter(pid=pid).first()
    if not product_obj:
        return return403('无此商品')
    with lock:
        stock_list = product_obj.stocks.split(",")
        spec_list = product_obj.specs.split(",")
        price_list = product_obj.prices.split(",")
        total_price = price_list[int(spec)] * int(spec)
        remains_num = int(stock_list[int(spec)])
        if remains_num < int(quantity):
            return return403('商品购买数量超过限制')
        order_obj=Order(user=user_obj,product=product_obj,quantity=int(quantity),spec = spec_list[int(spec)],price = total_price)
        order_obj.save()
        stock_list[int(spec)] = str(stock_list[int(spec)] - int(quantity))
        product_obj.stocks = ','.join(str(i) for i in stock_list)
        product_obj.volume = product_obj.volume + 1
        product_obj.save()
    return_data = {
        'oid' : order_obj.oid,
        'status' : order_obj.status,
    }
    return returnList(return_data)

def search_by_name(request,keyword):
    address = request.GET.get("address")
    products = Product.objects.filter(pname__contains=keyword)
    if address:
        products = products.filter(shop__address__contains=address)
    return_data = {
        'keyword' : keyword,
        'item_num' : products.count(),
        'items' : []
    }
    for i in products:
        return_data['items'].append({
            'pid' : i.pid,
            'pname' : i.pname,
            'sid' : i.shop.sid,
            'sname' : i.shop.sname,
            'specs' : i.specs.split(','),
            'prices' : list(map(float,i.prices.split(','))),
            'stocks' : list(map(int,i.stocks.split(','))),
            'volume' : i.volume,
            'tag' : i.tag,
            'shipping_region' : i.shipping_region,
            'cover' : '/media/'+i.cover.name,
            'create_time' : i.create_time.strftime("%Y-%m-%d %H:%M:%S"),
            'update_time' : i.update_time.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return returnList(return_data)

def search_shop(request,keyword):
    address = request.GET.get("address")
    shops = Shop.objects.filter(sname__contains=keyword)
    if address:
        shops = shops.filter(address__contains=address)
    return_data = {
        'keyword' : keyword,
        'item_num' : shops.count(),
        'items' : []
    }
    for i in shops:
        return_data['items'].append({
            'sid' : i.sid,
            'sname' : i.sname,
            'avatar' : i.avatar,
            'uid' : i.user.uid,
            'uname' : i.user.uname,
        })
    return returnList(return_data)

def getClassOfProduct(request,tag):
    products = Product.objects.filter(tag__contains=tag)
    return_data = {
        'tag' : tag,
        'item_num' : products.count(),
        'items' : []
    }
    for i in products:
        return_data['items'].append({
            'pid' : i.pid,
            'pname' : i.pname,
            'sid' : i.shop.sid,
            'sname' : i.shop.sname,
            'specs' : i.specs.split(','),
            'prices' : list(map(float,i.prices.split(','))),
            'stocks' : list(map(int,i.stocks.split(','))),
            'volume' : i.volume,
            'tag' : i.tag,
            'shipping_region' : i.shipping_region,
            'cover' : '/media/'+i.cover.name,
            'create_time' : i.create_time.strftime("%Y-%m-%d %H:%M:%S"),
            'update_time' : i.update_time.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return returnList(return_data)


def return403(str):
    return HttpResponse('{"code":403,"msg":"%s"}' % str, content_type='application/json')
def return200(str):
    return HttpResponse('{"code":200,"msg":"%s"}' % str, content_type='application/json')
def returnList(list):
    return_data = {
        'code' : 200,
        'msg' : '获取成功',
        'data' : list
    }
    return HttpResponse(json.dumps(return_data,ensure_ascii=False), content_type='application/json')
