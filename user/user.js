(function() {
    'use strict';

if (getCookie("uid") == "") {
	alert("请先登录");
	//window.location.href = "../";
}
})();

(function() {
    'use strict';
    //const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

    function clear_selection() {
    	$("#left_pane li").css({"color": "black", "background-color": "white"});
    }

    function homeClick(){
    	clear_selection();
    	$("#left_pane li").first().css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	showByKEY("home");
    }
    function personalClick() {
    	clear_selection();
    	$(this).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	showByKEY("personal");
    }
    function paymentClick(){
    	clear_selection();
    	$(this).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	showByKEY("payment");
    }
    function runshopClick(){
    	clear_selection();
    	$(this).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	showByKEY("store");
    }

    $("#left_pane li").first().click(homeClick);
    $("#left_pane li").eq(1).click(personalClick);
    $("#left_pane li").eq(2).click(paymentClick);
    $("#left_pane li").eq(3).click(runshopClick);

    function showByKEY(key) {
    	var queryParams = new URLSearchParams(window.location.search);
    	queryParams.set("page", key);
    	history.pushState(null, null, "?"+queryParams.toString());
    	showDirect();
    }

    function showDirect() {
    	var genderarr = ["保密", "男", "女"];
    	var the_uid = getCookie('uid');
    	var the_uname = getCookie('uname');
    	var the_email = getCookie('email');
    	var the_phone = getCookie('phone');
    	var the_gender = genderarr[getCookie('gender')];
    	var the_intro = getCookie('intro');
		var the_avatar = getCookie('avatar');
        var create_time = getCookie('createTime');
        var create_till = new Date(Date.parse(new Date()) - Date.parse(create_time)).getDate();

    	var keyword = new URL(window.location.href).searchParams.get('page');

    	if(keyword == "personal") {
    		$("#user_home").css("display","none");
    		$("#payment_info").css("display","none");
    		$("#run_a_shop").css("display","none");
    		$("#personal_info").css("display","block");
    		$("#left_pane li").eq(1).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});

    		$("#basic_photo :first-child :first-child").attr("src", "https://tf.mrning.com/api" + the_avatar).css({"height": "70px","vertical-align": "middle"});
    		$("#basic_uname :first-child :first-child").text(the_uname);
    		$("#basic_gender :first-child :first-child").text(the_gender);
    		$("#basic_intro :first-child :first-child").text(the_intro);

    		$("#basic_real_name :first-child :first-child").text("...");
    		$("#basic_email :first-child :first-child").text(the_email);
    		$("#basic_phone :first-child :first-child").text(the_phone);
			$("#basic_psw :first-child :first-child").text("\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}");
    	}
    	else if(keyword == "payment") {
    		$("#user_home").css("display","none");
    		$("#personal_info").css("display","none");
    		$("#run_a_shop").css("display","none");
    		$("#payment_info").css("display","block");
    		$("#left_pane li").eq(2).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	
    		$("#address_").click(openRegion);
    	}
    	else if(keyword == "store") {
    		$("#user_home").css("display","none");
    		$("#personal_info").css("display","none");
    		$("#payment_info").css("display","none");
    		$("#run_a_shop").css("display","block");
    		$("#left_pane li").eq(3).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});
    	}
    	else {
    		$("#personal_info").css("display","none");
    		$("#payment_info").css("display","none");
    		$("#run_a_shop").css("display","none");
    		$("#user_home").css("display","block");
    		$("#left_pane li").eq(0).css({"color": "#1a73e8;", "background-color": "#e8f0fe"});

    		$("#user_home :first-child :first-child").attr("src", "https://tf.mrning.com/api" + the_avatar);
    		$("#welcome_user :first-child").text("你好，" + the_uname);
    		$("#suggestions :first-child").text("这是你来到摸渔的第"+create_till+"天");
    	}
    }
   	showDirect();

	// for mobile swipe

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};                                                

function handleTouchMove(evt, typ) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            if(typ==0)
            	personalClick();
            if(typ==1)
            	paymentClick();
            if(typ==2)
            	runshopClick();
            if(typ==3)
            	homeClick();
        } else {
            /* right swipe */
            if(typ==0)
            	runshopClick();
            if(typ==1)
            	homeClick();
            if(typ==2)
            	personalClick();
            if(typ==3)
            	paymentClick();
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};
	var bindID = ["user_home","personal_info","payment_info","run_a_shop"];
	for(var i in bindID) {
		document.getElementById(bindID[i]).addEventListener('touchstart', handleTouchStart, false);
	}
	document.getElementById(bindID[0]).addEventListener('touchmove', function(e){ handleTouchMove(e,0); }, false);
	document.getElementById(bindID[1]).addEventListener('touchmove', function(e){ handleTouchMove(e,1); }, false);
	document.getElementById(bindID[2]).addEventListener('touchmove', function(e){ handleTouchMove(e,2); }, false);
	document.getElementById(bindID[3]).addEventListener('touchmove', function(e){ handleTouchMove(e,3); }, false);
	
    

})();

(function() {
    'use strict';

function windowResize() {
    var win = $(window);
    if (9 * win.height() > 10 * win.width()) { 
        phoneDisplay();
    }
    else {
        pcDisplay();
    }
}

$(window).on('resize', windowResize);

windowResize();

function phoneDisplay() {
    $("#left_pane").css({"display": "block", "position": "relative", "width": "100%", "padding-top": "0", "margin-bottom": "20px"});
    $("#left_pane").children().css({"line-height": "40px", "border-radius": "30px", "padding-left": "10px", "padding-right": "10px", "display": "inline-flex"});
    $("#user_area").css("margin-left","0");
    $(".basic_info").css("width","94%");
}

function pcDisplay() {
    $("#left_pane").css({"display": "block", "position": "absolute", "left": "0", "width": "150px", "padding-top": "20px", "margin-top": "-20px", "margin-bottom": "0"});
    $("#left_pane").children().css({"line-height": "50px", "border-radius": "0 30px 30px 0", "padding-left": "10px", "padding-right": "10px", "display": "block"});
    $("#user_area").css("margin-left","150px");
    $(".basic_info").css("width","80%");
}

})();