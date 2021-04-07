from django.contrib import admin
from user.models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('uid','uname','phone','email','gender')
 

# Register your models here.
