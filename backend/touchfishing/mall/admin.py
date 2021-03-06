from django.contrib import admin
from mall.models import Shop,Product,Order
from user.models import User

class ShopAdmin(admin.ModelAdmin):
    list_display = ('sid','user','sname','saddr','update_time')
 
class ProductAdmin(admin.ModelAdmin):
    list_display = ('pid','pname','shop','info','volume','tag','cover','specs','prices','stocks','shipping_region','update_time')
 
class OrderAdmin(admin.ModelAdmin):
    list_display = ('oid','user','product','quantity','status','spec','quantity','price','address','deliverer','delivery_number','update_time')
 

admin.site.register(Shop,ShopAdmin)
admin.site.register(Product,ProductAdmin)
admin.site.register(Order,OrderAdmin)
