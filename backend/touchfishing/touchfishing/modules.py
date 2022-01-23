


import smtplib
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr

from .secert import *

def sendMail(target_addr,title,content):

    msg = MIMEText(content, 'html', 'utf-8')
    msg['From']=formataddr(["TravelLog",smtp_from_addr])
    msg['To']=formataddr(["User",target_addr]) 
    msg['Subject'] = Header(title, 'utf-8').encode()
    #server.starttls()
    server=smtplib.SMTP_SSL(smtp_server, 465)
    try:
        server.login(smtp_from_addr, smtp_password)
        server.sendmail(smtp_from_addr, [target_addr], msg.as_string())
        server.quit()
    except Exception as e:
        return repr(e)
    return 'OK'

def sendSMS(phone,content):
    return False
