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
    price = request.POST.get("price")
    info = request.POST.get("info")
    tag = request.POST.get("tag")
    cover = request.FILES.get('cover',None)
    status = request.POST.get("status")
    if not (pname and price and info and tag and status):
        return return403('缺少参数')
    product_obj = Product(pname=pname,shop=shop_obj,price=price,info=info,tag=tag,status=status)
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
        'price' : product_obj.price,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S")
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
        'price' : product_obj.price,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S")
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
    price = request.POST.get("price")
    info = request.POST.get("info")
    tag = request.POST.get("tag")
    cover = request.FILES.get('cover',None)
    status = request.POST.get("status")
    if pname:
        product_obj.pname=pname
    if price:
        product_obj.price=price
    if info:
        product_obj.info=info
    if tag:
        product_obj.tag=tag
    if status:
        product_obj.status=status
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
        'price' : product_obj.price,
        'info' : product_obj.info,
        'volume' : product_obj.volume,
        'tag' : product_obj.tag,
        'cover' : '/media/'+product_obj.cover.name,
        'create_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : product_obj.strftime("%Y-%m-%d %H:%M:%S")
    }
    return returnList(return_data)

def placeOrder(request,pid):
    uid = request.session.get('uid',None)
    address = request.POST.get("address")
    quantity = request.POST.get("quantity")
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    if not(address and quantity):
        return return403('缺少address或quantity')
    product_obj = Product.objects.filter(pid=pid).first()
    if not product_obj:
        return return403('无此商品')
    with lock:
        remains_num = product_obj.status
        if product_obj.status < int(quantity):
            return return403('商品购买数量超过限制')
        order_obj=Order(user=user_obj,product=product_obj,quantity=int(quantity))
        order_obj.save()
        product_obj.status=remains_num-int(quantity)
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
            'price' : i.price,
            'volume' : i.volume,
            'tag' : i.tag,
            'cover' : '/media/'+i.cover.name,
            'create_time' : i.create_time.strftime("%Y-%m-%d %H:%M:%S"),
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
            'price' : i.price,
            'volume' : i.volume,
            'tag' : i.tag,
            'cover' : '/media/'+i.cover.name,
            'create_time' : i.create_time.strftime("%Y-%m-%d %H:%M:%S"),
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
