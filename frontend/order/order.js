(function() {
    'use strict';

if (getCookie("uid") == "") {
	alert("请先登录");
	window.location.href = "../";
}
})();

(function() {
	'use strict';

var topasskey = ["pid", "quantity", "pname", "price", "express", "format", "pic", "f_index"];
var theVal = new Map();
for (var i = 0; i < topasskey.length; i++) {
	let a = sessionStorage.getItem(topasskey[i]);
	if (a === undefined || a === null) {
		alert("非法操作");
		window.location.href = "../";
		return;
	}
	theVal.set(topasskey[i], a)
}
console.log(theVal);

$(".p__img").attr("src", "https://tf.mrning.com/api/" + theVal.get("pic"))
$(".p__name").text(theVal.get("pname"));
$(".p__format").text(theVal.get("format"));

var per_price = theVal.get("price");
var quan = theVal.get("quantity");
var express = theVal.get("express");
var sum0 = per_price*quan;

$(".p__per").text(per_price);
$(".p__quantity").text(quan)
$(".p__sum").text(sum0);

$(".p__express").text(express);

$(".p__p_sum").text(sum0);
$(".p__e_sum").text(express);
$(".p__total").text(+sum0 + +express);

var payingResult = false;
$("#submit_order__").click(function() {
	// check valid

	// show paying page
	showOrHidePaying("block");
	paying_text("支付中，请不要离开");
	// then send
	timing(0, makeorder);
	//timing(10, function(){ console.log(payingResult);} )
	timing(200, paying_text, "你不会在等待输入密码吧");
})

function failureOrder() {
	timing(3000, paying_text, "经系统检测，下次见面你会变得更加帅气");
	timing(4000, paying_text, "下单失败");
	timing(6000, clearNjump, true);
}
function successOrder() {
	timing(4000, paying_text, "经系统检测，你很帅");
	timing(5000, showOrHideEatbean, "none");
	timing(5100, showOrHideSuccess, "block");
	timing(6000, paying_text, "支付成功");
	timing(8500, showOrHidePaying, "none");
	timing(8510, clearNjump);
}

async function makeorder() {
	$.ajax({
		type: "POST",
		url: `https://tf.mrning.com/api/product/${theVal.get("pid")}/order`,
		xhrFields: { withCredentials: true },
		crossDomain: true,
		data: {
			pid: theVal.get("pid"), 
			address: "aaaaaa", 
			quantity: theVal.get("quantity"),
			spec: theVal.get("f_index")
		},
		dataType: 'json'
	}).done(function(data, status) {
		//console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
		if (status == "success") {
			if (data.code == 200){
				payingResult = data;
				successOrder();
				return;
			}
		}
		failureOrder();
	});
}

window.onbeforeunload = onbeforeunload_handler;

function onbeforeunload_handler() {  
	var yesOrNo = confirm("Do you really want to leave?\nAll changes won't be saved!");
	if (yesOrNo === true)
		clearSession();
	return "all clear???";
}

/*window.addEventListener("beforeunload", function(){
	var yesOrNo = confirm("Do you really want to leave?\nAll changes won't be saved!");
	if (yesOrNo === true)
		clearSession();
	return confirm("n");
});*/
/*$(window).on("beforeunload", function() {
	var yesOrNo = confirm("Do you really want to leave?\nAll changes won't be saved!");
	if (yesOrNo === true)
		clearSession();
	return 'Are you sure you want to leave?';
})*/

function clearSession() {
	for (var i of topasskey) {
		sessionStorage.removeItem(i);
	}
}

// functions in paying
async function showOrHidePaying(st) {
	$(".whenyoupay").css("display", st);
}

async function paying_text(te) {
	$(".ppay_after span").text(te);
}

async function showOrHideEatbean(st) {
	$(".pac-man").css("display", st);
}

async function showOrHideSuccess(st) {
	$(".success-animation").css("display", st);
}

async function clearNjump(where) {
	// clear all session storage
	clearSession();
	// jump
	window.onbeforeunload = function() {
		return null;
	};
	if (where)	window.location.href = "/";
	else	window.location.href = "/orderlist/";
}

function timing(t, func, p) {
	setTimeout(func, t, p);
}

})();