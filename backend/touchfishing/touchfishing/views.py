from django.http import HttpResponse
from django.shortcuts import render
import datetime

def index(request):
    info="User IP "
    if 'X-Forwarded-For' in request.headers:
        info=info+request.headers['X-Forwarded-For']+' Forwarded by '+request.META['REMOTE_ADDR']
    else:
        info=info+request.META['REMOTE_ADDR']
    context={'info':info,'time':datetime.datetime.now(),'tag': 'X-Forwarded-For' in request.META}
    return render(request,'index.html',context)

def page_not_found(request, exception):
    return render(request, '404.html')
def permission_denied(request, exception):
    return render(request, '403.html')
def server_error(request):
    return render(request, '500.html')
