export default [
  {
    settings: {
      menu: {
        language: {
          title: "语言",
        },
        theme: {
          title: "主题",
          values: ["自动", "浅色", "深色"],
        },
      },
    },
    bigsearch: {
      placeholder: "搜索你想要摸出的氵鱼灬",
      selectMenu: ["商品", "店铺"],
    },
    appBar: {
      btns: {
        home: "摸渔",
        cart: "购物车",
        me: "我的",
      },
    },
    navBar: {
      barInfo: {
        title: "摸渔",
        language: "语言",
        login: "登录",
        signup: "注册",
        cart: "购物车",
        order: "我的订单",
      },
    },
    pages: {
      cart: {
        title: "购物车",
        welcome: (a) => `一共有${a}件商品`,
        stock: (a) => `库存: ${a}`,
        selected: "选中: ",
        total: "小计: ",
        remove: "删除",
        wishlist: "加入愿望单",
        checkout: "立即结算",
      },
      checkout: {
        back: "返回",
        check: "结算",
        address: "收货地址",
        shipping: "配送方式",
        payment: "支付方式",
        checkout: "结算",
        ship: ["快递1", "快递2", "快递3"],
        pay: {
          creditcard: "信用卡",
          others: "其他",
        },
        detail: {
          cost: "商品金额",
          discount: "优惠",
          shipping: "运费",
          tax: "税",
          total: "总金额",
        },
      },
      order: {
        checkOrderStatus: [
          "待商家确认",
          "待发货",
          "待收货",
          "已完成",
          "已完成(退换货)",
        ],
        btns: {
          detail: "查看详情",
          delivery: "查看物流",
          confirm: "确认收货",
        },
        empty: "空空如也",
      },
      product: {
        tabs: {
          description: { title: "简介", detail: "" },
          coupon: { title: "优惠", detail: "假设这是一张0元优惠券" },
          comment: { title: "评价", detail: "据说是好评" },
        },
        subtitle: {
          ship: "见结算页面",
          region: "全国",
        },
        lWord: {
          loading: "加载中",
          no: "",
          notfound: "没有找到相关结果，换个id试试",
          servererror: "服务器出错",
          networkerror: "好像网络不太行",
        },
        stock: (a) => `库存: ${a}`,
        bottomBtns: {
          cart: "加入购物车",
          wishlist: "加入愿望单",
          purchase: "立即购买",
        },
      },
      register: {
        register: "注册",
        next: "下一步",
        begin: "开始你的摸🐟之旅吧",
        success: "注册成功",
        successmsg: "即刻开始🐟<。)#)))≦",
        refresh: "点击图片可刷新",
        w0: {
          welcome: "首先取个独一无二的用户名吧",
          uname: "用户名",
          validation: [
            "不能是纯数字",
            "长度不超过20",
            "不能含有空格及其他特殊字符",
          ],
          alert: "用户名已被使用，建议换个试试",
        },
        w1: {
          welcome: () => "请问阁下倾向于以下哪种注册方式",
          email: {
            name: "邮箱",
            validation: ["正确的邮箱格式: something@something.something"],
            alert: "该邮箱已被使用，建议换个试试",
          },
          phone: {
            name: "手机号",
            validation: ["正确的格式..."],
            alert: "该手机号已被使用，建议…………别用了",
          },
          both: "二者得兼",
        },
        w2: {
          welcome: "🔑，摸鱼之际一定要记住的事",
          password: "密码",
          validation: [
            "长度介于8位至32位",
            "至少是数字和英文字符的组合",
            "不能有特殊字符",
          ],
        },
        w3: {
          welcome: "以下内容可在之后更改哦",
          sex: {
            name: "性别",
            male: "男",
            female: "女",
            other: "其他",
            secret: "保密",
          },
          avatar: {
            name: "头像",
          },
          info: {
            name: "个人简介",
          },
        },
        w4: {
          welcome: "为了检测阁下是否恶意摸鱼，抱歉如此繁琐。\n但就差一步啦",
          captcha: "验证码",
          agreements: "我已阅读并同意《用户隐私协议》和《使用条款》",
        },
      },
      search: {
        rec: {
          logo: "推荐·商标占位符",
          title: "标题，躺平，不想了，广而告之",
          subtitle: "次标题，任尔摸，水中无鱼，心中有渔",
          pic: "热销广告图",
          name0: "这好像是个商品名字",
          name1: "这好像也是个商品名字",
          name2: "我不妨把商品名字弄得老长老长的测试一下看看折叠效果",
        },
        lWords: [
          "加载中",
          "",
          "没有找到相关结果，换个关键词试试",
          "服务器出错",
          "好像网络不太行",
        ],
        filterList: {
          sort: {
            name: "排序",
            conditions: [
              ["价格", "销量", "更新时间", "创建时间"],
              ["升序", "降序"],
            ],
          },
          price: {
            name: "价格区间",
          },
          tag: {
            name: "标签筛选",
          },
          region: {
            name: "发货地",
            values: ["不限"],
          },
        },
      },
    },
    widgets: {
      login: {
        account: "用户名/邮箱/手机号",
        password: "密码",
        login: "登录",
        register: "注册",
        forget: "忘记密码",
      },
    },
  },
  {
    settings: {
      menu: {
        language: {
          title: "Language",
        },
        theme: {
          title: "Theme",
          values: ["Auto", "Light", "Dark"],
        },
      },
    },
    bigsearch: {
      placeholder: "Search the fish you want to touch",
      selectMenu: ["Product", "Store"],
    },
    appBar: {
      btns: {
        home: "Touchfishing",
        cart: "Cart",
        me: "Me",
      },
    },
    navBar: {
      barInfo: {
        title: "Touch Fishing",
        language: "Language",
        login: "Login",
        signup: "Sign up",
        cart: "Cart",
        order: "My Order",
      },
    },
    pages: {
      cart: {
        title: "Cart",
        welcome: (a) =>
          a === 1 ? `${a} product in total` : `${a} products in total`,
        stock: (a) => `${a} in stock`,
        selected: "Selected: ",
        total: "Total: ",
        remove: "Remove",
        wishlist: "Wish it",
        checkout: "Check out",
      },
      checkout: {
        back: "Go back",
        check: "Check Out",
        address: "Address",
        shipping: "Shipping",
        payment: "Payment method",
        checkout: "Checkout",
        ship: ["SHIP1", "SHIP2", "SHIP3"],
        pay: {
          creditcard: "Credit card",
          others: "Others",
        },
        detail: {
          cost: "SUBTOTAL",
          discount: "DISCOUNT",
          shipping: "SHIPPING",
          tax: "TAX",
          total: "TOTAL",
        },
      },
      order: {
        checkOrderStatus: [
          "To be confirmed",
          "To be delivered",
          "To be received",
          "Done",
          "Return",
        ],
        btns: {
          detail: "Details",
          delivery: "Delivery",
          confirm: "Received",
        },
        empty: "Oopps, it's empty here! ",
      },
      product: {
        tabs: {
          description: { title: "Desc.", detail: "" },
          coupon: { title: "Coupon", detail: "Suppose here it isn't" },
          comment: { title: "Comment", detail: "Heard that praise" },
        },
        subtitle: {
          ship: "Ship: See checkout-page",
          region: "Region: Anywhere",
        },
        lWord: {
          loading: "Loading...",
          no: "",
          notfound: "No result, maybe change another product id",
          servererror: "Server error",
          networkerror: "Network error",
        },
        stock: (a) => `${a} in stock`,
        bottomBtns: {
          cart: "Add to Cart",
          wishlist: "Add to Wishlist",
          purchase: "Purchase",
        },
      },
      register: {
        register: "Sign up",
        next: "Next",
        begin: "Begin your trip of touch-fishing!",
        success: "Success",
        successmsg: "Now 🐟<。)#)))≦",
        refresh: "Click to refresh",
        w0: {
          welcome: "A unique user name is a good start",
          uname: "Username",
          validation: [
            "Should be more than Number",
            "The length should be less than 20",
            "Please exclude space or other special characters",
          ],
          alert: "Sorry but this username is taken. Try another one?",
        },
        w1: {
          welcome: (a) => `Dear ${a}, which method do you prefer?`,
          email: {
            name: "Email",
            validation: [
              "It should be something like something@something.something",
            ],
            alert: "The address is already taken. Try another one.",
          },
          phone: {
            name: "Phone",
            validation: ["The right format..."],
            alert: "Taken... Suggest don't use this method",
          },
          both: "Both",
        },
        w2: {
          welcome: "🔑, the very thing should be remembered",
          password: "Password",
          validation: [
            "The length should be no less than 8 and no greater than 32",
            "At least it'd be the combination of number and letter",
            "Please exclude special characters",
          ],
        },
        w3: {
          welcome: "You can change below later",
          sex: {
            name: "Gender",
            male: "Male",
            female: "Female",
            other: "Other",
            secret: "Secret",
          },
          avatar: {
            name: "Avatar",
          },
          info: {
            name: "Introduction",
          },
        },
        w4: {
          welcome: "Sorry to trouble you but it's the last step! ",
          captcha: "Captcha",
          agreements:
            "By registering means you agree to the Terms and Policies agreement as well as the Privacy Policy",
        },
      },
      search: {
        rec: {
          logo: "Recommendation",
          title: "Title, something like?",
          subtitle: "Subtitle, touchfishing!",
          pic: "Advertisement?",
          name0: "A product name",
          name1: "Another product name",
          name2:
            "Another very very very utra extra long long-long product name",
        },
        lWords: [
          "Loading...",
          "",
          "No result. Please try another one.",
          "Server error",
          "Network issue",
        ],
        filterList: {
          sort: {
            name: "Sort by",
            conditions: [
              ["Price", "Volumn", "Update", "Creation"],
              ["Insc.", "Desc."],
            ],
          },
          price: {
            name: "Price Range",
          },
          tag: {
            name: "Tags",
          },
          region: {
            name: "Region",
            values: ["Unlimited"],
          },
        },
      },
    },
    widgets: {
      login: {
        account: "Username/Email/Phone",
        password: "Password",
        login: "Login",
        register: "Register",
        forget: "Forget password",
      },
    },
  },
];
