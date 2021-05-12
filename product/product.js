(function(){
    'use strict';
    windowSizeStyle();

    $(window).resize(windowSizeStyle);

    function windowSizeStyle() {
        var displayType = false;
        if ($(window).width() <= $(window).height())
            displayType = true;
        if ($(window).width() < 600)
            displayType = true;

        if (displayType == false) {
            desktopDisplay();
        }
        else {
            mobileDisplay();
        }
    }

    function desktopDisplay() {
        $("body").css('margin', '8px');
        $(".top_box2").css('flex-direction', 'row');
        $(".left_box1").css('width', '40%');
        $(".right_box1").css('width', '50%');
        $("#product_detail_box").css('margin-top', '60px');
        $("#top_pane").css('display', 'block');
    }

    function mobileDisplay() {
        $("body").css('margin', '0');
        $(".top_box2").css('flex-direction', 'column');
        $(".left_box1").css('width', '100%');
        $(".right_box1").css('width', '100%');
        $("#product_detail_box").css('margin-top', '0');
        $("#top_pane").css('display', 'none');
    }
})();


var rootlink = "../search/test/";

$.getJSON("../search/test/product.json", function(data) {
    var item = data[0];
    
    $(".big_pic img").attr("src", rootlink + item.picture);
    $(".product_header span").text(item.product);
    $(".product_price span").text("￥ " + item.price);
    $(".product_volume span").text("销量: " + item.volume);
    $(".product_from span").text("发货地: ");
    $(".product_express span").text("快递: ");
    $(".product_store span").text("店铺: " + item.storename);
    $(".product_format span").text("规格: ");
    $(".product_stock span").text("库存: ");


    $(".product_numbers button:nth-child(3)").click(function() {
        $(".product_numbers input").val(function() {
            if (+(this.value) >= 1000000) { // should change
                return 1000000; // shou change
            }
            return +(this.value)+1;
        });
    })
    $(".product_numbers button:nth-child(1)").click(function() {
        $(".product_numbers input").val(function() {
            if (+(this.value) <= 1)
                return 1;
            return +(this.value)-1;
        });
    })

    $(".product_click_buy button:first-child").click(function() {
        alert("目前买不了");
    })
});