from django.shortcuts import render
import os
import hashlib
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from user.models import User
from django.http import HttpResponse
from mall.models import Shop,Product,Order
import random
import base64

font_size=35
font = ImageFont.truetype('touchfishing/resources/kumo.ttf', 35)

# Create your views here.
def index(request):
    return render(request,'user.html')

def login(request,use_captcha=1):
    no_captcha = request.POST.get("no_captcha")
    if(no_captcha):
        use_captcha=0
    if request.method == "GET":
        return return403('请使用 POST 请求')
    uid = request.POST.get("uid")
    uname = request.POST.get("uname")
    phone = request.POST.get("phone")
    user = request.POST.get("user")
    email = request.POST.get("email")
    password = request.POST.get("password")
    captcha = request.POST.get("captcha")
    session_captcha=request.session.get('captcha',None)
    #print('session:'+request.session.session_key+' ,login:'+captcha)
    if not password:
        return return403('无效参数')
    if(use_captcha):
        if not captcha:
            return return403('请输入验证码')
        if not session_captcha:
            return ('未获取验证码')
        if request.session["captcha"]=='':
            return return403('验证码过期')
        if captcha.lower()!=session_captcha:
            return return403('验证码错误')
        request.session["captcha"]=""
    if uid:
        user_obj = User.objects.filter(uid=uid).first()
    elif uname:
        user_obj = User.objects.filter(uname=uname).first()
    elif phone:
        user_obj = User.objects.filter(phone=phone).first()
    elif email :
        user_obj = User.objects.filter(email=email).first()
    elif user:
        if "@" in user:
            user_obj = User.objects.filter(email=user).first()
        elif (user.isdigit() and len(user)<10):
            user_obj = User.objects.filter(uid=user).first()
        elif (user.isdigit() and len(user)>=10):
            user_obj = User.objects.filter(phone=user).first()
        else:
            user_obj = User.objects.filter(uname=user).first()
    else:
        return return403('无效参数')
    if not user_obj:
        return return403('无此用户')
    if not user_obj.pwd == hashlib.md5(password.encode(encoding='UTF-8')).hexdigest():
        #print(user_obj.pwd)
        return return403('密码错误')
    request.session["uid"] = user_obj.uid
    request.session["uname"] = user_obj.uname

    return_data = {
        'uid' : user_obj.uid,
        'uname' : user_obj.uname,
        'phone' : user_obj.phone,
        'email' : user_obj.email,
        'gender' : user_obj.gender,
        'intro' : user_obj.intro,
        'avatar' : '/media/'+user_obj.avatar.name
    }

    return returnList(return_data)


def logout(request):
    request.session.flush()
    return return200('已清除登录信息')

def register(request,use_captcha=1):
    no_captcha = request.POST.get("no_captcha")
    if(no_captcha):
        use_captcha=0
    uname = request.POST.get("uname")
    phone = request.POST.get("phone")
    email = request.POST.get("email")
    password = request.POST.get("password")
    captcha = request.POST.get("captcha")
    session_captcha=request.session.get('captcha',None)
    if(use_captcha):
        if not captcha:
            return return403('请输入验证码')
        if not session_captcha:
            return return403('未获取验证码')
        if session_captcha=='':
            return return403('验证码过期')
        if captcha.lower()!=session_captcha:
            return return403('验证码错误')
        request.session["captcha"] = ''
    if not (uname and password):
        return return403('无效参数：缺少用户名或密码')
    if uname.isdigit():
        return return403('用户名不能全为数字')
    if (phone and len(phone)<10):
        return return403('手机号格式不正确')
    string = "~!@#$%^&*()_+-*/<>,.[]\/"
    for i in string:
        if i in uname:
            return return403('用户名包含特殊字符')
    if User.objects.filter(uname=uname).first():
        return return403('用户名已存在')
    if phone:
        if User.objects.filter(phone=phone).first():
            return return403('手机号已存在')
    if email:
        if User.objects.filter(email=email).first():
            return return403('邮箱已存在')
    else:
        return return403('无效参数：缺少手机或邮箱')
    user_obj = User(uname=uname,pwd=hashlib.md5(password.encode(encoding='UTF-8')).hexdigest(),email=email,phone=phone)
    gender = request.POST.get("gender")
    intro = request.POST.get("intro")
    address = request.POST.get("address")
    pay_pwd = request.POST.get("pay_pwd")
    avatar_name = request.POST.get("avatar_name")
    if gender:
        user_obj.gender=gender
    if intro:
        user_obj.intro=intro
    if address:
        user_obj.address=address
    if pay_pwd:
        user_obj.pay_pwd=pay_pwd
    if avatar_name:
        user_obj.avatar.name='users/'+avatar_name
    user_obj.save()
    return return200('注册成功')

def modPwd(request):
    if request.method == "GET":
        return return403('请使用 POST 请求')
    oldPwd = request.POST.get("old_password")
    newPwd = request.POST.get("new_password")
    if not (oldPwd and newPwd):
        return return403('无效参数')
    uid=request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户') #待测试
    checkOldPwd=hashlib.md5(oldPwd.encode(encoding='UTF-8')).hexdigest()
    if(checkOldPwd != user_obj.pwd):
        return return403('旧密码错误')
    user_obj.pwd = hashlib.md5(newPwd.encode(encoding='UTF-8')).hexdigest()
    user_obj.save()
    return return200('成功地修改了密码')

def updateInfo(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    
    if request.method == "POST":
        gender = request.POST.get("gender")
        intro = request.POST.get("intro")
        phone = request.POST.get("phone")
        email = request.POST.get("phone")
        address = request.POST.get("address")
        intro = request.POST.get("intro")
        pay_pwd = request.POST.get("pay_pwd")
        avatar_name = request.POST.get("avatar_name")
        if gender:
            user_obj.gender=gender
        if intro:
            user_obj.intro=intro
        if phone:
            user_obj.phone=phone
        if email:
            user_obj.email=email
        if address:
            user_obj.address=address
        if intro:
            user_obj.intro=intro
        if pay_pwd:
            user_obj.pay_pwd=pay_pwd
        if avatar_name:
            user_obj.avatar.name='users/'+avatar_name
        user_obj.save()
    
    return_data = {
        'uid' : user_obj.uid,
        'uname' : user_obj.uname,
        'phone' : user_obj.phone,
        'email' : user_obj.email,
        'gender' : user_obj.gender,
        'intro' : user_obj.intro,
        'address' : user_obj.address,
        'avatar' : '/media/'+user_obj.avatar.name
    }
    return returnList(return_data)
    
def uploadAvatar(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')

    avatar = request.FILES.get('avatar',None)
    if not avatar:
        return return403('未获取到avatar')
    f, e = os.path.splitext(avatar.name)
    imgName=str(uid)+e
    avatar.name = imgName
    ''' # 图片规整化
    if e!='.jpg':
        return return403('仅接受.JPG')
    avatar.name = imgName
    im = Image.open(avatar)
    width, height = im.size
    if width>512 or height>512 :
        if width>512:
            rate=128/width
            height=int(height*rate)
            width=128
        if height>512:
            rate=128/height
            width=int(width*rate)
            height=128
        im = im.resize((width,height),Image.ANTIALIAS)
    #image.save()
    '''
    user_obj = User.objects.filter(uid = uid).first()
    if os.path.isfile(user_obj.avatar.path): #删除已经存在的图片
        if ('default' not in user_obj.avatar.path) and ('male' not in user_obj.avatar.path) :
            os.remove(user_obj.avatar.path)
    user_obj.avatar = avatar
    user_obj.save()
    return return200('成功地修改了头像')

def check_code(width=90, height=40, char_length=4):  
    #print(os.path.isfile('kumo.tff'))
    code = []
    img = Image.new(mode='RGB', size=(width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img, mode='RGB')

    def rndChar():
        # 生成随机字符（包括大小写字母和数字）
        ranNum = str(random.randint(0, 9))
        #ranLower = chr(random.randint(65, 90))
        #ranUpper = chr(random.randint(97, 120))
        #return random.choice([ranNum, ranLower, ranUpper])
        return ranNum

    def rndColor():
        # 生成随机颜色
        return (random.randint(0, 200), random.randint(10, 200), random.randint(64, 200))

    # 写文字
    for i in range(char_length):
        char = rndChar()
        code.append(char)
        h = ( height - font_size ) / 2
        draw.text([i * width / char_length, h], char, font=font, fill=rndColor())

    # 写干扰点
    for i in range(40):
        draw.point([random.randint(0, width), random.randint(0, height)], fill=rndColor())

    # 写干扰圆圈
    for i in range(40):
        draw.point([random.randint(0, width), random.randint(0, height)], fill=rndColor())
        x = random.randint(0, width)
        y = random.randint(0, height)
        draw.arc((x, y, x + 4, y + 4), 0, 90, fill=rndColor())

    # 画干扰线
    for i in range(5):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)
        draw.line((x1, y1, x2, y2), fill=rndColor())

    # 对图像加滤波 - 深度边缘增强滤波
    img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)  
    return img, ''.join(code)

def getCAPTCHA(request):
    if not request.session.session_key:
        request.session.create()
    #print(os.getcwd())
    img,captcha = check_code()
    stream = BytesIO()
    img.save(stream, 'png')
    base64_img = base64.b64encode(stream.getvalue()).decode()
    request.session["captcha"] = captcha.lower()
    return_data = [
        {
            'img' : base64_img
        }
    ]
    return returnList(return_data)
   

def sendCodeMail(target_addr,code):
    title='摸渔密码重置验证码'
    content='您好！<br>请使用以下代码完成验证：<b>%s</b><br>TouchFishing'% code
    return sendMail(target_addr,title,content)

def sendCodePhone(target_addr,code):
    content='您的摸渔密码重置验证码为：%s。'% code
    return sendSMS(target_addr,content)


def resetPwd(request,use_captcha=1):
    no_captcha = request.POST.get("no_captcha")
    if(no_captcha):
        use_captcha=0
    email = request.POST.get("email")
    phone = request.POST.get("phone")
    code = request.POST.get("code")
    captcha = request.POST.get("captcha")
    newPwd = request.POST.get("new_password")
    session_captcha=request.session.get('captcha',None)
    if(use_captcha):
        if not captcha:
            return return403('请输入验证码')
        if not session_captcha:
            return return403('未获取验证码')
        if session_captcha=='':
            return return403('验证码过期')
        if captcha.lower()!=session_captcha:
            return return403('验证码错误')
    if (email or phone):  #步骤1：获取密保恢复码
        
        code = str(int(random.random()*1000000)).rjust(6,'0')
        #搜索用户
        if email:
            request.session['rec_method']='email'
            user_obj = User.objects.filter(email=email).first()
            if not user_obj:
                if use_captcha:
                    request.session["captcha"]='' #清除CAPTCHA
                return return403('找不到用户')
            request.session['rec_user']=email
            sendMailReturnCode=sendCodeMail(email,code)
            if sendMailReturnCode!='OK':
                return return403('发送邮件失败：'+sendMailReturnCode)
            request.session['code']=code
            return return200('已发送恢复码至邮箱')
        if phone:
            request.session['rec_method']='phone'
            user_obj = User.objects.filter(phone=phone).first()
            if not user_obj:
                if use_captcha:
                    request.session["captcha"]='' #清除CAPTCHA
                return return403('找不到用户')
            request.session['rec_user']=phone
            if not sendCodePhone(phone,code):
                return return403('发送短信失败')
            request.session['code']=code
            return return200('已发送恢复码至手机')
        
    elif code:    #步骤2：验证验证码
        session_code=request.session.get('code',None)
        if not session_code:
            return return403('未获取恢复码或已失效')
        if not (newPwd and code):
            return return403('参数错误')
        if code!=request.session['code']:
            if use_captcha:
                request.session["captcha"]='' #清除CAPTCHA
            return return403('恢复码错误')
        if request.session['rec_method']=='email':
            user_obj = User.objects.filter(email=request.session['rec_user']).first()
            user_obj.pwd = hashlib.md5(newPwd.encode(encoding='UTF-8')).hexdigest()
            user_obj.save()
        if request.session['rec_method']=='phone':
            user_obj = User.objects.filter(phone=request.session['rec_user']).first()
            user_obj.pwd = hashlib.md5(newPwd.encode(encoding='UTF-8')).hexdigest()
            user_obj.save()
        request.session['code']=''
        return return200('修改成功')
    else:
        return return403('参数错误')

import json

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

import smtplib
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr

def sendMail(target_addr,title,content):
    smtp_server = 'smtp.exmail.qq.com'
    from_addr = 'send@mrning.com'
    password = 'zsMM2!'
    msg = MIMEText(content, 'html', 'utf-8')
    msg['From']=formataddr(["TravelLog",from_addr])
    msg['To']=formataddr(["User",target_addr]) 
    msg['Subject'] = Header(title, 'utf-8').encode()
    #server.starttls()
    server=smtplib.SMTP_SSL(smtp_server, 465)
    try:
        server.login(from_addr, password)
        server.sendmail(from_addr, [target_addr], msg.as_string())
        server.quit()
    except Exception as e:
        return repr(e)
    return 'OK'

def sendSMS(phone,content):
    return False


def myShop(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    shop_obj = Shop.objects.filter(user=user_obj).first()
    if not shop_obj:
        return return403('尚未开店')
    return_data = {
        'sid' : shop_obj.sid,
        'uid' : shop_obj.user.uid,
        'sname' : shop_obj.sname,
        'saddr' : shop_obj.saddr,
        'avatar' : shop_obj.avatar,
        'create_time' : shop_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : shop_obj.update_time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    return returnList(return_data)

def openShop(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    shop_obj = Shop.objects.filter(user=user_obj).first()
    if shop_obj:
        return return403('已经有店铺啦')
    sname = request.POST.get("sname")
    saddr = request.POST.get("saddr")
    if not (sname and saddr):
        return403("缺少sname或saddr")
    shop_obj=Shop(user=user_obj,sname=sname,saddr=saddr)
    avatar = request.FILES.get('avatar',None)
    avatar_name = request.POST.get("avatar_name")
    if avatar_name:
        shop_obj.avatar.name='shops/'+avatar_name
    if avatar:
        f, e = os.path.splitext(avatar.name)
        imgName=str(shop_obj.sid)+e
        avatar.name = imgName
        if os.path.isfile(shop_obj.avatar.path): #删除已经存在的图片
            if 'default' not in shop_obj.avatar.path:
                os.remove(shop_obj.avatar.path)
        shop_obj.avatar = avatar
    shop_obj.save()

    return_data = {
        'sid' : shop_obj.sid,
        'uid' : shop_obj.user.uid,
        'sname' : shop_obj.sname,
        'saddr' : shop_obj.saddr,
        'avatar' : shop_obj.avatar,
        'create_time' : shop_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : shop_obj.update_time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    return returnList(return_data)

def editShop(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')
    shop_obj = Shop.objects.filter(user=user_obj).first()
    if not shop_obj:
        return return403('用户尚无店铺')
    sname = request.POST.get("sname")
    saddr = request.POST.get("saddr")
    avatar = request.FILES.get('avatar',None)
    avatar_name = request.POST.get("avatar_name")

    if sname:
        shop_obj.sname=sname
    if saddr:
        shop_obj.saddr=saddr
    if avatar_name:
        shop_obj.avatar.name='shops/'+avatar_name
    if avatar:
        f, e = os.path.splitext(avatar.name)
        imgName=str(shop_obj.sid)+e
        avatar.name = imgName
        if os.path.isfile(shop_obj.avatar.path): #删除已经存在的图片
            if 'default' not in shop_obj.avatar.path:
                os.remove(shop_obj.avatar.path)
        shop_obj.avatar = avatar
    shop_obj.save()
    return_data = {
        'sid' : shop_obj.sid,
        'uid' : shop_obj.user.uid,
        'sname' : shop_obj.sname,
        'saddr' : shop_obj.saddr,
        'avatar' : shop_obj.avatar,
        'create_time' : shop_obj.create_time.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : shop_obj.update_time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    return returnList(return_data)

def myOrders(request):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')    
    orders = Order.objects.filter(user=user_obj)
    return_data = {
        'uid' : user_obj.uid,
        'order_num' : orders.count(),
        'orders' : []
    }
    for i in orders:
        return_data['orders'].append({
            'oid' : i.oid,
            'pid' : i.product.pid,
            'pname' : i.product.pname,
            'price' : i.product.price,
            'product_num' : i.product_num,
            'sid' : i.product.shop.sid,
            'sname' : i.product.shop.sname,
            'status' : i.status,
            'deliverer' : i.deliverer,
            'delivery_number' : i.delivery_number,
            'create_time' : i.strftime("%Y-%m-%d %H:%M:%S"),
            'update_time' : i.strftime("%Y-%m-%d %H:%M:%S")
        })
    return returnList(return_data)

def getOrder(request,oid):
    uid = request.session.get('uid',None)
    if not uid:
        return return403('未登录或登录超时')
    user_obj = User.objects.filter(uid=uid).first()
    if not user_obj:
        return return403('无此用户')    
    order_obj = Order.objects.filter(user=user_obj,oid=oid).first()
    if not order_obj:
        return return403('找不到订单')
    return_data = {
        'uid' : user_obj.uid,
        'oid' : user_obj.oid,
        'pid' : user_obj.product.pid,
        'pname' : user_obj.product.pname,
        'price' : user_obj.product.price,
        'product_num' : user_obj.product_num,
        'sid' : user_obj.product.shop.sid,
        'sname' : user_obj.product.shop.sname,
        'status' : user_obj.status,
        'deliverer' : user_obj.deliverer,
        'delivery_number' : user_obj.delivery_number,
        'address' : user_obj.address,
        'create_time' : user_obj.strftime("%Y-%m-%d %H:%M:%S"),
        'update_time' : user_obj.strftime("%Y-%m-%d %H:%M:%S")
    }
    return returnList(return_data)
