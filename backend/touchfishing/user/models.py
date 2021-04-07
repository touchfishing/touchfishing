from django.db import models

class User(models.Model):
    uid = models.AutoField(verbose_name='用户编号',primary_key=True)
    uname = models.CharField(verbose_name='用户名',unique=True,max_length=50)
    pwd = models.CharField(verbose_name='密码',max_length=100)
    phone = models.CharField(verbose_name='手机号',max_length=20,null=True)
    email = models.CharField(verbose_name='邮箱',max_length=200,null=True)
    gender = models.SmallIntegerField(
        choices=((0,'未设置'),(1,"男"),(2,"女")),
        default=0,
        verbose_name="性别",
    )
    avatar = models.FileField(verbose_name='头像',upload_to='avatars/',default='avatars/default.jpg')
    intro = models.CharField(verbose_name='简介',max_length=500,blank=True)
    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户表'
    def __str__(self):
        return "%s(%s)"% (self.uname,self.uid)
 