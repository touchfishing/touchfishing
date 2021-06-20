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

(function(){
'use strict';

function not_found() {
    alert("sorry, 404 not found");
    window.location.href = "../";
}

var urlParams = new URLSearchParams(window.location.search); // the url parameter
var the_pid = urlParams.get('pid');
if (the_pid === null || !the_pid) {
    not_found();
}

$.get( "https://tf.mrning.com/api/product/" + the_pid, function( data ) {
	if (data.code != 200) {
		not_found();
	}
	else {
		showDetails(data.data);
	}
})

const rootlink = "https://tf.mrning.com/api/";

function createFormat(w, idx, st) {
    let c_id = 'o_format_' + idx;
    let c_string = '<li><input type=\"radio\" id=\"' + c_id + '\"class=\"format_radio\" name=\"p_format\"';
    c_string += ('value=\"'+idx +'\"> <label for=\"'+c_id+'\"class="format_label">');
    c_string += (w + '</label></li>');
    $('#product_format').append(c_string);
    $("#"+c_id).click(function() {
        $(".product_stock span:eq(1)").text(st);
        $("#stocknum").prop('max', +st);
    })
}

function divideByComma(s) {
    var sArr = s.split(',');
    return sArr;
}

function showDetails(data) {
    $(".big_pic img").attr("src", rootlink + data.cover);
    $(".product_header span").text(data.pname);
    $(".product_price span:eq(1)").text(data.price);
    $(".product_volume span:eq(1)").text(data.volume);
    $(".product_from span:eq(1)").text(data.shipping_region);
    var express_p = Math.floor(Math.random()*12);
    $(".product_express span:eq(1)").text(express_p + " CNY");
    $(".product_store span:eq(1)").text(data.sname);

    var format_arr = ["默认规格"], stock_arr = [];
    stock_arr.push(+data.status);
    if (data.specs !== "") {
        format_arr = divideByComma(data.specs);
        stock_arr = divideByComma(data.volume.toString()); // !!!! change volume to status
    }
    for (var i = 0; i < format_arr.length; i++) {
        createFormat(format_arr[i], i, stock_arr[i]);
    }
    $('#o_format_0').click(); // click default

    //$(".product_stock span:eq(1)").text(data.status); // product remains

    //;

    $('#stocknum').on('input', function() {
        if (+$(this).val() > +$(".product_stock span:eq(1)").text()) {
            $(this).val(+$(".product_stock span:eq(1)").text());
        }
        if (+$(this).val() === 0) {
            $(".product_click_buy button:first-child").css('background-color', "#979797");
        }
        else {
            $(".product_click_buy button:first-child").css('background-color', "#ff4063");
        }
    });



    $(".product_numbers button:nth-child(3)").click(function() {
        $(".product_numbers input").val(function() {
            $(".product_click_buy button:first-child").css('background-color', "#ff4063");
            if (+(this.value) >= +data.status) { // should change
                return +data.status; // shou change
            }
            return +(this.value)+1;
        });
    })
    $(".product_numbers button:nth-child(1)").click(function() {
        $(".product_numbers input").val(function() {
            if (+(this.value)-1 <= 0) {
                $(".product_click_buy button:first-child").css('background-color', "#979797");
                return 0;
            }
            $(".product_click_buy button:first-child").css('background-color', "#ff4063");
            return +(this.value)-1;
        });
    })
    
    $(".product_click_buy button:first-child").click(function() {
        var buy_num = +$('#stocknum').val();
        if (buy_num === 0) return;
        if (getCookie("uid") == "") {
            alert("请先登录");
            document.getElementById("signin_bar").children[0].click();
        }
        else { // open the make-order page
            var topasskey = ["pid", "quantity", "pname", "price", "express", "format", "pic"];
            var topassval = [data.pid, $("#stocknum").val(), data.pname, data.price, express_p, format_arr[$(".format_radio:checked").val()], data.cover];
            for (var i = 0; i < topasskey.length; i++) {
                setSession(topasskey[i], topassval[i]);
            }
            window.open("../order/");
        }
    })

    function setSession(item, val) {
        sessionStorage.setItem(item, val);
    }
}


})();
