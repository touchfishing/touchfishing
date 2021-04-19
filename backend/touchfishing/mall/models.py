from django.db import models
from user.models import User
from django.utils import timezone
class Shop(models.Model):
    sid = models.AutoField(verbose_name='店铺编号',primary_key=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name='用户')
    sname = models.CharField(verbose_name='店铺名',unique=True,max_length=50)
    saddr = models.CharField(verbose_name='店铺地址',unique=True,max_length=200)
    avatar = models.FileField(verbose_name='店铺头像',upload_to='shops/',default='shops/default.jpg')
    create_time = models.DateTimeField(verbose_name='创建时间',default=timezone.now)
    update_time = models.DateTimeField(verbose_name='更新时间',auto_now=True)
    class Meta:
        verbose_name = '店铺'
        verbose_name_plural = '店铺表'
    def __str__(self):
        return "%s(%s)"% (self.sid,self.sname)

class Product(models.Model):
    pid = models.AutoField(verbose_name='商品编号',primary_key=True)
    pname = models.CharField(verbose_name='商品名',unique=True,max_length=50)
    shop = models.ForeignKey(Shop,on_delete=models.CASCADE,verbose_name='店铺')
    price = models.FloatField(verbose_name='价格',default=0)
    info = models.TextField(verbose_name='商品信息',default='')
    volume = models.IntegerField(verbose_name='销量',default='')
    tag = models.TextField(verbose_name='分类',default='')
    cover = models.FileField(verbose_name='封面',upload_to='products/',default='products/default.jpg')
    status = models.IntegerField(verbose_name='余量',default=0)
    create_time = models.DateTimeField(verbose_name='创建时间',default=timezone.now)
    update_time = models.DateTimeField(verbose_name='更新时间',auto_now=True)
    class Meta:
        verbose_name = '商品'
        verbose_name_plural = '商品表'
    def __str__(self):
        return "%s(%s)"% (self.pid,self.pname)

class Order(models.Model):
    oid = models.AutoField(verbose_name='订单号',primary_key=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name='用户')
    product = models.ForeignKey(Product,on_delete=models.CASCADE,verbose_name='商品')
    quantity = models.IntegerField(verbose_name='商品数量',default=0)
    status = models.SmallIntegerField(
        choices=((0,'等待确认'),(1,"等待发货"),(2,"等待买方确认"),(3,"已完成")),
        default=0,
        verbose_name="订单状态",
    )
    address = models.CharField(verbose_name='地址',null=True,max_length=200)
    deliverer = models.CharField(verbose_name='承运人',null=True,max_length=50)
    delivery_number = models.CharField(verbose_name='运单号',null=True,max_length=100)
    create_time = models.DateTimeField(verbose_name='创建时间',default=timezone.now)
    update_time = models.DateTimeField(verbose_name='更新时间',auto_now=True)
    class Meta:
        verbose_name = '订单'
        verbose_name_plural = '订单表'
    def __str__(self):
        return "%s(%s)"% (self.oid,self.product.pname)
    