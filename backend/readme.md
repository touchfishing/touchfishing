# 接口文档



[toc]



## 用户认证

#### 验证码

接口地址：/api/user/captcha

请求方式：GET

说明：用户提交注册登录以及重置密码前，需要获取验证码。验证码只能使用一次，刷新验证码即重新获取

返回内容：image/png，cookie

#### 登录

接口地址：/api/user/login

请求方式：POST

请求参数：

| 名称                                    | 类型   | 必填 | 说明                    |
| --------------------------------------- | ------ | ---- | ----------------------- |
| (user)或(uid,uname,phone,email)其中一项 | string | 是   | 传入user则自动判断类型  |
| password                                | string | 是   | 用户密码                |
| captcha                                 | string | 是   | 验证码                  |
| no_captcha                              | bool   | 否   | 是否关闭验证码（debug） |

返回参数：

| HTTP状态码 | 返回json中，msg的值                                          | 说明                                |
| ---------- | ------------------------------------------------------------ | ----------------------------------- |
| 200        | 登录成功                                                     | 在cookie中返回session，存储登录信息 |
| 403        | 请使用 POST 请求\|无效参数\|无此用户\|密码错误\|请输入验证码\|验证码过期\|验证码错误 |                                     |
| 500        | 服务器错误                                                   | 下同                                |

登录成功时，返回json信息

| 名称   | 说明                                      |
| ------ | ----------------------------------------- |
| uid    | 用户ID                                    |
| uname  | 用户名                                    |
| phone  | 手机号                                    |
| email  | 邮箱                                      |
| gender | 0未设置 1男 2女                           |
| intro  | 个人介绍                                  |
| avatar | 用户头像文件相对于根目录的地址，或完整url |

```json
{
    "code": 200,
    "msg": "获取成功",
    "data": {
        "uid": 1,
        "uname": "ning",
        "phone": null,
        "email": "test@mrning.com",
        "gender": 0,
        "intro": "",
        "avatar": "/media/users/default.jpg"
    }
}
```



#### 登出

接口地址：/api/user/logout

请求方式：GET / POST

请求参数：无，从session中获取用户信息

返回参数：

| HTTP状态码 | 返回json中，msg的值 | 说明                                |
| ---------- | ------------------- | ----------------------------------- |
| 200        | 已清除登录信息      | 服务器已清除session中存储的登录信息 |

```json
{
    "code": 200,
    "msg": "已清除登录信息"
}
```



#### 注册

接口地址：/api/user/register

请求方式：POST

请求参数：

| 名称         | 类型   | 必填 | 说明                                     |
| ------------ | ------ | ---- | ---------------------------------------- |
| uname        | string | 是   | 用户名                                   |
| phone或email | string | 是   | 手机和邮箱中的至少一项                   |
| password     | string | 是   | 用户密码                                 |
| intro        | string | 否   | 个人介绍                                 |
| address      | string | 否   | 收货地址                                 |
| pay_pwd      | string | 否   | 支付密码                                 |
| avatar_name  | string | 否   | 要修改的默认头像文件名                   |
| no_captcha   | bool   | 否   | 是否关闭验证码（debug）                  |
| captcha      | string | 是   | 密码先在前端加密一次，头像这里不用上传。 |

返回参数：

| HTTP状态码 | 返回json中，msg的值                                          | 说明              |
| ---------- | ------------------------------------------------------------ | ----------------- |
| 200        | 注册成功                                                     |                   |
| 403        | 无效参数：缺少用户名或密码\|无效参数：缺少手机或邮箱\|用户ID已存在\|用户名已存在\|注册错误\|请输入验证码\|验证码错误\|用户名不能全为数字\|手机号格式不正确\|用户名包含特殊字符 | uname不能为纯数字 |

```json
{
    "code": 200,
    "msg": "注册成功"
}
```



#### 修改密码

接口地址：/api/user/password

请求方式：POST

请求参数：

| 名称         | 类型   | 必填 | 说明   |
| ------------ | ------ | ---- | ------ |
| old_password | string | 是   | 旧密码 |
| new_password | string | 是   | 新密码 |

返回参数：

| HTTP状态码 | 返回json中，msg的值                                          | 说明 |
| ---------- | ------------------------------------------------------------ | ---- |
| 200        | 成功地修改了密码                                             |      |
| 403        | 请使用 POST 请求\|无效参数\|未登录或登录超时\|无此用户\|旧密码错误 |      |



#### 上传头像

接口地址：/api/user/avatar

请求方式：POST

请求参数：

| 名称   | 类型 | 必填 | 说明                                 |
| ------ | ---- | ---- | ------------------------------------ |
| avatar | file | 是   | 用户要求的新头像，建议前端先压缩以下 |

返回参数：

| HTTP状态码 | 返回json中，msg的值              | 说明 |
| ---------- | -------------------------------- | ---- |
| 200        | 成功地修改了头像                 |      |
| 403        | 未登录或登录超时\|未获取到avatar |      |



#### 用户信息

接口地址：/api/user/info

请求方式：GET，查询用户信息

请求方式：POST，修改用户信息，提交啥修改啥

请求参数：

| 名称   | 类型   | 必填 | 说明             |
| ------ | ------ | ---- | ---------------- |
| gender | string | 否   | 要修改的性别     |
| phone  | string | 否   | 要修改的手机号   |
| email  | string | 否   | 要修改的邮箱     |
| intro  | string | 否   | 要修改的个人介绍 |
| address | string | 否   | 要修改的收货地址     |
| avatar_name | string | 否 | 要修改的默认头像文件名 |
| pay_pwd  | string | 否   | 要修改的支付密码   |

返回参数：

| 名称   | 说明                                      |
| ------ | ----------------------------------------- |
| uid    | 用户ID                                    |
| uname  | 用户名                                    |
| phone  | 手机号                                    |
| email  | 邮箱                                      |
| gender | 0未设置 1男 2女                           |
| intro  | 个人介绍                                  |
| avatar | 用户头像文件相对于根目录的地址，或完整url |

```json
{
    "code": 200,
    "msg": "获取成功",
    "data": {
        "uid": 1,
        "uname": "ning",
        "phone": null,
        "email": "test@mrning.com",
        "gender": 0,
        "intro": "",
        "address": null,
        "avatar": "/media/users/default.jpg"
    }
}
```



#### 忘记密码（暂仅允许邮件找回）

接口地址：/api/user/reset

请求方式：POST

第一次请求：

| 名称         | 类型   | 必填 | 说明                    |
| ------------ | ------ | ---- | ----------------------- |
| email或phone | string | 是   | 恢复凭证                |
| captcha      | string | 是   | 验证码                  |
| no_captcha   | bool   | 否   | 是否关闭验证码（debug） |

返回参数：

| HTTP状态码 | 返回json中，msg的值                                | 说明                                                    |
| ---------- | -------------------------------------------------- | ------------------------------------------------------- |
| 200        | 已发送恢复码至邮箱\|已发送恢复码至手机             |                                                         |
| 403        | 验证码错误\|找不到用户\|发送邮件失败\|发送短信失败 | 输入错误会使CAPTCHA失效；发送邮件失败时，返回错误类型。 |

```json
{"code":403,"data":"发送邮件失败：SMTPRecipientsRefused({'example@example.example': (550, b'Mailbox not found or access denied')})"}
```

第二次及以后的请求：

| 名称         | 类型   | 必填 | 说明                     |
| ------------ | ------ | ---- | ------------------------ |
| code         | string | 是   | 向密保方式中发送的恢复码 |
| captcha      | string | 是   | 验证码                   |
| new_password | string | 是   | 新密码                   |

返回参数：

| HTTP状态码 | 返回json中，msg的值                                    | 说明                    |
| ---------- | ------------------------------------------------------ | ----------------------- |
| 200        | 修改成功                                               |                         |
| 403        | 验证码错误\|未获取恢复码或已失效\|恢复码错误\|参数错误 | 输入错误会使CAPTCHA失效 |



## 店铺管理

#### 我的店铺

接口地址：/api/user/shop

请求方式：GET

返回参数：

| 名称        | 说明         |
| ----------- | ------------ |
| sid         | 店铺ID       |
| uid         | 用户ID       |
| sname       | 店铺名       |
| saddr       | 店铺物理地址 |
| avatar      | 店铺头像     |
| create_time | 创建时间     |
| update_time | 更新时间     |



#### 开设店铺

接口地址：/api/user/shop/new

请求方式：POST

请求参数：

| 名称        | 类型   | 必填 | 说明                 |
| ----------- | ------ | ---- | -------------------- |
| sname       | string | 是   | 店铺名               |
| saddr       | string | 是   | 店铺地址             |
| avatar      | file   | 否   | 店铺头像             |
| avatar_name | string | 否   | 店铺使用的默认头像名 |

返回参数：

| 名称        | 说明     |
| ----------- | -------- |
| sid         | 店铺ID   |
| uid         | 用户ID   |
| sname       | 店铺名   |
| saddr       | 店铺地址 |
| avatar      | 店铺头像 |
| create_time | 创建时间 |
| update_time | 更新时间 |



#### 修改店铺信息

接口地址：/api/user/shop/edit

请求方式：POST

请求参数：

| 名称        | 类型     | 必填 | 说明                 |
| ----------- | -------- | ---- | -------------------- |
| sname       | string否 | 否   | 店铺名               |
| saddr       | string   | 否   | 店铺地址             |
| avatar      | file     | 否   | 店铺头像             |
| avatar_name | string   | 否   | 店铺使用的默认头像名 |

返回参数：

| 名称        | 说明     |
| ----------- | -------- |
| sid         | 店铺ID   |
| uid         | 用户ID   |
| sname       | 店铺名   |
| saddr       | 店铺地址 |
| avatar      | 店铺头像 |
| create_time | 创建时间 |
| update_time | 更新时间 |



#### 店铺商品列表

接口地址：/api/shop/\<int:sid\>/list

请求方式：GET

请求参数：

| 名称 | 类型 | 必填 | 说明   |
| ---- | ---- | ---- | ------ |
| sid  | int  | 是   | 店铺ID |

返回参数：

| 名称     | 说明         |
| -------- | ------------ |
| sid      | 店铺ID       |
| item_num | 搜索结果数量 |
| items    | 搜索结果数组 |

其中，items中每个项目：

| 名称            | 说明       |
| --------------- | ---------- |
| pid             | 商品ID     |
| pname           | 商品名     |
| sid             | 店铺ID     |
| sname           | 店铺名     |
| specs           | 规格       |
| prices          | 价格       |
| stocks          | 库存       |
| volume          | 销量       |
| tag             | 分类标签   |
| shipping_region | 发货地     |
| cover           | 商品封面图 |
| create_time     | 创建时间   |
| update_time     | 更新时间   |

## 订单管理

#### 我的订单

接口地址：/api/user/orders

请求方式：GET

返回参数：

| 名称      | 说明                     |
| --------- | ------------------------ |
| uid       | 用户ID                   |
| order_num | 订单总数                 |
| orders    | 订单数组，字段如下表所示 |

| 名称            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| oid             | 店铺ID                                                       |
| pid             | 用户ID                                                       |
| pname           | 商品名                                                       |
| spec           | 购买规格                                                     |
| quantity           | 数量                                                     |
| price           | 总价                                                     |
| sid             | 店铺ID                                                       |
| sname           | 店铺名                                                       |
| status          | 状态(0,'等待确认'),(1,"等待发货"),(2,"等待买房确认"),(3,"已完成") |
| deliverer       | 承运人                                                       |
| delivery_number | 运单号                                                       |
| create_time     | 创建时间                                                     |
| update_time     | 更新时间                                                     |



#### 订单详情

接口地址：/api/user/order/\<oid\>

请求方式：GET

请求参数：

| 名称 | 说明   |
| ---- | ------ |
| oid  | 订单ID |

返回参数：

| 名称            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| uid             | 用户ID                                                       |
| oid             | 店铺ID                                                       |
| pid             | 用户ID                                                       |
| pname           | 商品名                                                       |
| spec           | 购买规格                                                     |
| quantity           | 数量                                                     |
| price           | 总价                                                     |
| sid             | 店铺ID                                                       |
| sname           | 店铺名                                                       |
| status          | 状态(0,'等待确认'),(1,"等待发货"),(2,"等待买房确认"),(3,"已完成") |
| deliverer       | 承运人                                                       |
| delivery_number | 运单号                                                       |
| address             | 收获地址                                                       |
| create_time     | 创建时间                                                     |
| update_time     | 更新时间                                                     |



## 商品管理

#### 新建商品

接口地址：/api/product/new

请求方式：POST

请求参数：

| 名称            | 类型   | 必填 | 说明     |
| --------------- | ------ | ---- | -------- |
| pname           | string | 是   | 商品标题 |
| price           | float  | 是   | 价格     |
| info            | string | 是   | 描述     |
| tag             | string | 是   | 分类标签 |
| cover           | file   | 否   | 商品图   |
| specs          | string |   是  | 规格     |
| prices          | string |  是   | 价格     |
| stocks           | string |  是   | 库存     |
| shipping_region | string |  是   | 发货地   |

specs prices prices 为逗号分隔字符串，其数组长度应一致。

返回参数：

| 名称        | 说明       |
| ----------- | ---------- |
| pid         | 商品ID     |
| pname       | 商品名     |
| sid         | 店铺ID     |
| sname       | 店铺名     |
| info        | 商品详情   |
| volume       | 商品销量   |
| tag       | 商品标签   |
| specs      | 规格       |
| prices         | 价格   |
| stocks         | 库存   |
| shipping_region         | 发货地   |
| cover       | 商品封面图 |
| create_time |  创建时间      |
| update_time |  更新时间    |



#### 查看商品

接口地址：/api/product/\<int:pid\>

请求方式：GET

请求参数：

| 名称 | 说明   |
| ---- | ------ |
| pid  | 商品ID |

返回参数：

| 名称            | 说明         |
| --------------- | ------------ |
| pid             | 商品ID       |
| pname           | 商品名       |
| sid             | 店铺ID       |
| sname           | 店铺名       |
| info            | 商品描述信息 |
| volume          | 销量         |
| tag             | 分类标签     |
| specs      | 规格       |
| prices         | 价格   |
| stocks         | 库存   |
| shipping_region         | 发货地   |
| cover           | 商品封面图   |
| create_time |  创建时间      |
| update_time |  更新时间    |



#### 修改信息

接口地址：/api/product/\<int:pid\>/edit

请求方式：POST

请求参数：

| 名称            | 类型   | 必填 | 说明     |
| --------------- | ------ | ---- | -------- |
| pname           | string | 否   | 商品标题 |
| info            | string | 否   | 描述     |
| tag             | string | 否   | 分类标签 |
| cover           | file   | 否   | 商品图   |
| specs          | string |   是  | 规格     |
| prices          | string |  是   | 价格     |
| stocks           | string |  是   | 库存     |
| shipping_region | string | 否   | 发货地   |

specs prices prices 为逗号分隔字符串，其数组长度应一致。

返回参数：

| 名称        | 说明       |
| ----------- | ---------- |
| pid         | 商品ID     |
| pname       | 商品名     |
| sid         | 店铺ID     |
| sname       | 店铺名     |
| info        | 商品数量   |
| volume      | 销量       |
| tag         | 分类标签   |
| specs      | 规格       |
| prices         | 价格   |
| stocks         | 库存   |
| shipping_region         | 发货地   |
| cover           | 商品封面图   |
| create_time |  创建时间      |
| update_time |  更新时间    |



## 订单相关

#### 购买产品

接口地址：/api/product/\<int:pid\>/order

请求方式：POST

请求参数：

| 名称     | 类型   | 必填 | 说明            |
| -------- | ------ | ---- | --------------- |
| pid      | int    | 是   | 商品ID (In URL) |
| address  | string | 是   | 收货地址        |
| quantity | string | 是   | 商品数量        |
| spec     | int    | 是   | 商品规格(index) |

返回参数：

| 名称   | 说明     |
| ------ | -------- |
| oid    | 订单号   |
| status | 订单状态 |



## 搜索相关

#### 按标题

接口地址：/api/search/name/\<str:keyword\>

请求方式：GET

请求参数：

| 名称    | 类型   | 必填 | 说明     |
| ------- | ------ | ---- | -------- |
| keyword | string | 是   | 关键词   |
| address | string | 否   | 地域筛选 |

返回参数：

| 名称     | 说明         |
| -------- | ------------ |
| keyword  | 关键词       |
| item_num | 搜索结果数量 |
| items    | 搜索结果数组 |

其中，items中每个项目：

| 名称            | 说明       |
| --------------- | ---------- |
| pid             | 商品ID     |
| pname           | 商品名     |
| sid             | 店铺ID     |
| sname           | 店铺名     |
| specs      | 规格       |
| prices         | 价格   |
| stocks         | 库存   |
| volume      | 销量       |
| tag         | 分类标签   |
| shipping_region         | 发货地   |
| cover           | 商品封面图   |
| create_time |  创建时间      |
| update_time |  更新时间    |



#### 搜店铺

接口地址：/api/search/shop/\<str:keyword\>

请求方式：GET

请求参数：

| 名称    | 类型   | 必填 | 说明     |
| ------- | ------ | ---- | -------- |
| keyword | string | 是   | 关键词   |
| address | string | 否   | 地域筛选 |

返回参数：

| 名称     | 说明         |
| -------- | ------------ |
| keyword  | 关键词       |
| item_num | 搜索结果数量 |
| items    | 搜索结果数组 |

其中，items中每个项目：

| 名称   | 说明       |
| ------ | ---------- |
| sid    | 店铺ID     |
| sname  | 店铺名     |
| avatar | 店铺头像   |
| uid    | 老板ID     |
| uname  | 老板用户名 |



#### 根据标签查看商品

接口地址：/api/product/tag/\<str:tag\>

请求方式：GET

请求参数：

| 名称 | 类型   | 必填 | 说明 |
| ---- | ------ | ---- | ---- |
| tag  | string | 是   | 标签 |

返回参数：

| 名称     | 说明         |
| -------- | ------------ |
| tag      | 标签         |
| item_num | 搜索结果数量 |
| items    | 搜索结果数组 |

其中，items中每个项目：

| 名称            | 说明       |
| --------------- | ---------- |
| pid             | 商品ID     |
| pname           | 商品名     |
| sid             | 店铺ID     |
| sname           | 店铺名     |
| specs      | 规格       |
| prices         | 价格   |
| stocks         | 库存   |
| volume      | 销量       |
| tag         | 分类标签   |
| shipping_region         | 发货地   |
| cover           | 商品封面图   |
| create_time |  创建时间      |
| update_time |  更新时间    |


# 服务器信息

https://tf.mrning.com/

前端首页 https://tf.mrning.com/
后端首页 https://tf.mrning.com/api/

 # 管理后台信息

后端管理 https://tf.mrning.com/api/admin 

前端FTP [tf.mrning.com](ftp://tf.mrning.com) 

