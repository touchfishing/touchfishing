(function() {
    'use strict';

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".dark_login{background-color:#4742428f;width:100%;height:100%;position:fixed;top:0;left:0;z-index:101}.login_border{z-index:102;position:fixed;left:50%;top:50%;background-color:#fff;transform:translate(-50%,-50%);min-height:100px;min-width:350px;max-width:90%;text-align:center;border-radius:5px;box-shadow:0 0 11px 4px #6c686885}.login_goback_button{border-radius:50%;border:none;float:right;font-size:24px;background-color:#fff;margin-right:-15px;margin-top:-15px;box-shadow:-3px 3px 6px 0 #554f4fb3;width:30px;height:30px;cursor:pointer}.fillin_login{display:block;text-align:center;position:relative;margin-top:40px}.login_infoinput{display:block;margin:auto;border:none;box-shadow:0 0 8px 2px #cacacab3;line-height:32px;border-radius:25px;margin-bottom:30px;min-width:300px;max-width:95%;padding-left:10px;font-size:18px}.login_infoinput:focus{outline-width:0}.forget_psw_login{display:block;margin-top:-15px;text-align:right;padding-right:20px;font-size:16px;cursor:pointer}.click_confirm_login{margin-top:20px;margin-bottom:20px}.login_click_button{font-size:18px;border:none;border-radius:15px;padding:5px 10px;cursor:pointer}#login_clicklogin{background-color:#ffb193c7}#login_clicklogin:hover{background-color:#ff4629c7;color:#fff}#signup_clicklogin{background-color:#92c5f09e}#signup_clicklogin:hover{background-color:#2d9eeeb8;color:#fff}";
document.head.appendChild(style);

var the_big_login_back = document.createElement("div");
the_big_login_back.setAttribute("id", "the_big_login_back");
the_big_login_back.setAttribute("class", "dark_login");

var login_border = document.createElement("div");
login_border.setAttribute("id", "login_border");
login_border.setAttribute("class", "login_border");

var login_goback_button = document.createElement("button");
login_goback_button.setAttribute("id", "login_goback_button");
login_goback_button.setAttribute("class", "login_goback_button");
login_goback_button.innerText = "↺";
login_goback_button.addEventListener("click", function(){
	the_big_login_back.style.display = "none";
})

var fillin_login = document.createElement("div");
fillin_login.setAttribute("id", "fillin_login");
fillin_login.setAttribute("class", "fillin_login");

var click_confirm_login = document.createElement("div");
click_confirm_login.setAttribute("id", "click_confirm_login");
click_confirm_login.setAttribute("class", "click_confirm_login");

var login_info_input = document.createElement("input");
login_info_input.setAttribute("id", "login_info_input");
login_info_input.setAttribute("class", "login_infoinput");
login_info_input.setAttribute("type", "text");
login_info_input.setAttribute("placeholder", "用户名/邮箱/手机号");

var login_psw_input = document.createElement("input");
login_psw_input.setAttribute("id", "login_psw_input");
login_psw_input.setAttribute("class", "login_infoinput");
login_psw_input.setAttribute("type", "password");
login_psw_input.setAttribute("placeholder", "密码");

var forget_psw_login = document.createElement("a");
forget_psw_login.setAttribute("class", "forget_psw_login");
forget_psw_login.innerText = "忘记密码?";
forget_psw_login.addEventListener("click", function(){ window.open('../forgetpsw.html', '_blank'); });

var login_clicklogin = document.createElement("button");
login_clicklogin.setAttribute("id", "login_clicklogin");
login_clicklogin.setAttribute("class", "login_click_button");
login_clicklogin.innerText = "登录"

var signup_clicklogin = document.createElement("button");
signup_clicklogin.setAttribute("id", "signup_clicklogin");
signup_clicklogin.setAttribute("class", "login_click_button");
signup_clicklogin.innerText = "注册";
signup_clicklogin.addEventListener("click", function(){ window.open('../register/', '_blank'); })

fillin_login.appendChild(login_info_input);
fillin_login.appendChild(login_psw_input);
fillin_login.appendChild(forget_psw_login);

click_confirm_login.appendChild(login_clicklogin);
click_confirm_login.appendChild(signup_clicklogin);

login_border.appendChild(login_goback_button);
login_border.appendChild(fillin_login);
login_border.appendChild(click_confirm_login);

the_big_login_back.appendChild(login_border);

document.body.appendChild(the_big_login_back);

})();

(function() {
    'use strict';

var login_info = document.getElementById("login_info_input");
var login_psw = document.getElementById("login_psw_input");
var login_btn = document.getElementById("login_clicklogin");

document.getElementById("login_border").addEventListener('keypress', function(e){
	if(e.keyCode == 13){
		click_login();
	}
})

function click_login() {
	if (login_info.value == "" || login_psw.value == "") {
		alert("请输入信息! ");
	}
	else {
		// ----------------
		/*var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://tf.mrning.com/user/login", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.onreadystatechange = function() {
   			if (this.readyState == 4 && this.status == 200) {
     			var response = JSON.parse(this.responseText);
     			console.log(response);
     			if (response.code == 403 || response.code == 500)
     				alert(response.msg);
     			else {
     				console.log(response);
     			}
   			}
		};
		var senddata = JSON.stringify({ user: login_info.value, password: login_psw.value, captcha: '', no_captcha: true });
		console.log(senddata);
		xhttp.send(senddata);*/

		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://tf.mrning.com/api/user/login", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.onreadystatechange = function() {
   			if (this.readyState == 4 && this.status == 200) {
     			var response = JSON.parse(this.responseText);
     			//console.log(response);
     			if (response.code == 403 || response.code == 500)
     				alert(response.msg);
     			else {
     				//console.log(response);
     				setCookie('uid', response.data.uid, default_expire_date);
	    			setCookie('uname', response.data.uname, default_expire_date);
	    			setCookie('email', response.data.email, default_expire_date);
	    			setCookie('phone', response.data.phone, default_expire_date);
	    			setCookie('gender', response.data.gender, default_expire_date);
	    			setCookie('intro', response.data.intro, default_expire_date);
					setCookie('avatar', response.data.avatar, default_expire_date);
					setCookie('createTime', response.data.create_time, default_expire_date);
	    			//console.log(data);
	    			//console.log(getCookie('uid'));
	    			//console.log(document.cookie);
	    			location.reload();
     			}
   			}
		};
		var senddata = "user="+login_info.value+"&password="+login_psw.value+"&captcha=''&no_captcha="+true;
		//console.log(senddata);
		xhttp.send(senddata);
		// -------------
/*
		$.post("https://tf.mrning.com/user/login", 
	{
		user: login_info.value,
		password: login_psw.value,
		captcha: "",
		no_captcha: true
  	},
	function(data, status) {
    	console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
    	if (status == "success") {
    		if (data.code == 403 || data.code == 500)
    			alert(data.msg);
    		else if (data.code == 200) {
    			// page location
    			//window.location.href = "index.html";
    			
    			setCookie('uid', data.data.uid, default_expire_date);
    			setCookie('uname', data.data.uname, default_expire_date);
    			setCookie('email', data.data.email, default_expire_date);
    			setCookie('phone', data.data.email, default_expire_date);
    			setCookie('gender', data.data.gender, default_expire_date);
    			setCookie('intro', data.data.intro, default_expire_date);
				setCookie('avatar', data.data.avatar, default_expire_date);
    			//console.log(data);
    			console.log(getCookie('uid'));
    			console.log(document.cookie);
    			location.reload();
    		}
    	}
	});
*/


	}


}

login_btn.addEventListener("click", click_login);

})();


(function() {
	'use strict';

	var login_dis = document.getElementById("the_big_login_back");
	if (login_dis != null) {
		login_dis.style.display = "none";
	}

	var user_ = document.getElementById("user");
	var order_list = document.getElementById("order_list");
	var signup_bar = document.getElementById("signup_bar");
	var signin_bar = document.getElementById("signin_bar");
	if (user_!=null&&order_list!=null&&signin_bar!=null&&signup_bar!=null) {
		if (getCookie('uid') == "") { // not signed in
			user_.style.display = "none";
			order_list.style.display = "none";
			signup_bar.style.display = "inline-block";
			signin_bar.style.display = "inline-block";

			signup_bar.children[0].href = "../register";
			signin_bar.children[0].addEventListener("click", function(){
				if (login_dis != null) {
					login_dis.style.display = "block";
				}
			})

		}
		else { // signed in
			user_.style.display = "inline-block";
			order_list.style.display = "inline-block";
			signup_bar.style.display = "none";
			signin_bar.style.display = "none";

			user.children[1].innerText = getCookie('uname');
			user.style.cursor = "pointer";
			user.children[0].style["max-width"] = "26px";
			user.children[0].style["max-height"] = "26px";
			user.children[0].style["vertical-align"] = "middle";
			user.children[0].src = "https://tf.mrning.com" + getCookie('avatar');

			
		}
	}


})();

/*
(function() {
	//hideDropDown();
	document.getElementById("user").addEventListener("mouseover", showDropDown);
	//document.getElementById("user").addEventListener("mouseout", hideDropDown);
	//document.getElementById("dddopdown").addEventListener("mouseover", showDropDown);
	document.getElementById("dddopdown").addEventListener("mouseout", hideDropDown);
	//document.getElementById("user").addEventListener("touchstart", showDropDown);

	function showDropDown() {
		//document.getElementById("dddopdown").style.display = "block";
		document.getElementById("dddopdown").style.visibility = "visible";
	}
	function hideDropDown() {
		//document.getElementById("dddopdown").style.display = "none";
		document.getElementById("dddopdown").style.visibility = "hidden";
	}


})();
*/
(function() {
	'use strict';
	document.getElementById("llllllogout").addEventListener('click', logout);

	function logout(){
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "https://tf.mrning.com/api/user/logout", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.onreadystatechange = function() {
   			if (this.readyState == 4 && this.status == 200) {
     			var response = JSON.parse(this.responseText);
     			//console.log(response);
     			if (response.code == 403 || response.code == 500)
     				alert(response.msg);
     			else {
     				console.log(response);
     				var xremove = ["uid","uname","email","phone","gender","intro","avatar","createTime"];
     				removeCookies(xremove);
	    			window.location.href = "/";
     			}
   			}
		};
		//var senddata = "user="+login_info.value+"&password="+login_psw.value+"&captcha=''&no_captcha="+true;
		//console.log(senddata);
		xhttp.send();
	}
})();