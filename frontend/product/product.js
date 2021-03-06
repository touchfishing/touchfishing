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
        $(".right_box1").css('height', '400px');
        $(".bottom_action_box1").css({"position": "absolute", "margin-bottom": "0", "padding": "10px"});
    }

    function mobileDisplay() {
        $("body").css('margin', '0');
        $(".top_box2").css('flex-direction', 'column');
        $(".left_box1").css('width', '100%');
        $(".right_box1").css('width', '100%');
        $("#product_detail_box").css('margin-top', '0');
        $("#top_pane").css('display', 'none');
        $(".right_box1").css('height', 'auto');
        $(".bottom_action_box1").css({"position": "relative", "margin-bottom": "15px", "padding": "0"});
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

function createFormat(w, idx, st, pr) {
    let c_id = 'o_format_' + idx;
    let c_string = '<li><input type=\"radio\" id=\"' + c_id + '\"class=\"format_radio\" name=\"p_format\"';
    c_string += ('value=\"'+idx +'\"> <label for=\"'+c_id+'\"class="format_label">');
    c_string += (w + '</label></li>');
    $('#product_format').append(c_string);
    $("#"+c_id).click(function() {
        $(".product_stock span:eq(1)").text(st);
        $("#stocknum").prop('max', +st);
        $("#stocknum").val(0)
        $(".product_price span:eq(1)").text(pr);
        $(".product_numbers button:nth-child(3)").click();
    })
}

function divideByComma(s) {
    var sArr = s.split(',');
    return sArr;
}

function showDetails(data) {
    $(".big_pic img").attr("src", rootlink + data.cover);
    $(".product_header span").text(data.pname);
    //$(".product_price span:eq(1)").text(data.price);
    $(".product_volume span:eq(1)").text(data.volume);
    $(".product_from span:eq(1)").text(data.shipping_region);
    var express_p = Math.floor(Math.random()*12);
    $(".product_express span:eq(1)").text(express_p + " CNY");
    $(".product_store span:eq(1)").text(data.sname);

    var format_arr = data.specs, stock_arr = data.stocks, price_arr = data.prices;
    if (format_arr.length === 1 && format_arr[0] === "")    format_arr[0] = "????????????";
    /*var format_arr = ["????????????"], stock_arr = [];
    stock_arr.push(+data.status);
    if (data.specs !== "") {
        format_arr = divideByComma(data.specs);
        stock_arr = divideByComma(data.volume.toString()); // !!!! change volume to status
    }*/
    for (var i = 0; i < format_arr.length; i++) {
        createFormat(format_arr[i], i, stock_arr[i], price_arr[i]);
    }
    $('#o_format_0').click(); // click default

    //$(".product_stock span:eq(1)").text(data.status); // product remains

    //;

    function stockNum() {
        var tIDX = +$(".format_radio:checked").val();
        if (+$('#stocknum').val() > stock_arr[tIDX]) {
            $('#stocknum').val(stock_arr[tIDX]);
        }
        if (+$('#stocknum').val() === 0) {
            $(".product_click_buy button:first-child").css('background-color', "#979797");
        }
        else {
            $(".product_click_buy button:first-child").css('background-color', "#ff4063");
        }
    }

    $('#stocknum').on('input', stockNum);



    $(".product_numbers button:nth-child(3)").click(function() {
        $(".product_numbers input").val(function() {
            $(".product_click_buy button:first-child").css('background-color', "#ff4063");
            if (+(this.value) >= +data.status) { // should change
                return +data.status; // shou change
            }
            return +(this.value)+1;
        });
        stockNum();
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
        var theIDX = +$(".format_radio:checked").val();
        var buy_num = +$('#stocknum').val();
        if (buy_num === 0) return;
        if (buy_num > stock_arr[theIDX]) return;
        if (getCookie("uid") == "") {
            alert("????????????");
            document.getElementById("signin_bar").children[0].click();
        }
        else { // open the make-order page
            var topasskey = ["pid", "quantity", "pname", "price", "express", "format", "pic", "f_index"];
            
            var topassval = [data.pid, $("#stocknum").val(), data.pname, data.prices[theIDX], express_p, format_arr[theIDX], data.cover, theIDX];
            for (var i = 0; i < topasskey.length; i++) {
                setSession(topasskey[i], topassval[i]);
            }
            window.open("/order/");
        }
    })

    function setSession(item, val) {
        sessionStorage.setItem(item, val);
    }
}


})();
