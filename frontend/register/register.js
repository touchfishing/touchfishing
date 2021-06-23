var username = document.getElementById("username");
var unamecheck = document.getElementById("checkuname").children; /* [0, 1] */

var email = document.getElementById("email");
var emailcheck = document.getElementById("checkemail").children; /* [0] */

var phone = document.getElementById("phone");

var psw = document.getElementById("psw");
var pswcheck = document.getElementById("checkpsw").children; /* [0, 1, 2] */

var bio = document.getElementById("bio");

var storeEle = document.getElementsByClassName("store");
var bioText = document.getElementById("bioText");

var captchaval = document.getElementById("captcha");

/* event listener to hide them */
document.getElementById("reg_info").addEventListener('click', function(){
	if (unamecheck[0].children[0].checked == true &&
		unamecheck[1].children[0].checked == true) {
		hideCheckUname();
	}
	else {
		showCheckUname();
	}

	if (emailcheck[0].children[0].checked == true || email.value == "") {
		hideCheckEmail();
	}
	else {
		showCheckEmail();
	}
	if (email.value != "" || phone.value != "") {
		document.getElementById("mp").checked = true;
	}
	else {
		document.getElementById("mp").checked = false;
	}
})

function showCheckUname() {
	var schun = document.getElementById("checkuname");
	if (schun.style.display == "none" || schun.style.display == "")
		schun.style.display = "block";
}
function hideCheckUname() {
	var schun = document.getElementById("checkuname");
	schun.style.display = "none";
}

function showCheckEmail() {
	var schem = document.getElementById("checkemail");
	if (schem.style.display == "none" || schem.style.display == "")
		schem.style.display = "block";
}
function hideCheckEmail() {
	var schem = document.getElementById("checkemail");
	schem.style.display = "none";
}

function showCheckPsw() {
	var schpsw = document.getElementById("checkpsw");
	schpsw.style.display = "block";
}



/* personal info and store info switcher
   not used currently, ignore it
*/
function switchReg() {
	if (isBuyer.checked == true) {
		bioText.innerText = "个人简介";
		for (var i = 0; i < storeEle.length; i++) {
			storeEle[i].style.display = "none";
		}
	}
	else {
		bioText.innerText = "店铺简介";
		for (var i = 0; i < storeEle.length; i++) {
			storeEle[i].style.display = "table-row";
		}
	}
}


/* check if username is valid */
function checkUname() {
	showCheckUname();
	var thename = username.value;
	if (/^\d+$/.test(thename)) { // only number
		//console.log("username cannot contain only digits");
		unamecheck[0].children[0].checked = false;
	}
	else {
		unamecheck[0].children[0].checked = true;
	}
	var isValid = true;
	var invalidstring = [' ', '$', '#', '@', "!", ',', '.', '*', '/', '\\','&','\'','\"'];
	for (var i in invalidstring) {
		if (thename.indexOf(invalidstring[i]) >= 0) {
			isValid = false;
			break;
		}
	}
	if (isValid) {
		unamecheck[1].children[0].checked = true;
	}
	else {
		unamecheck[1].children[0].checked = false;
	}
	if (thename == "") {
		unamecheck[0].children[0].checked = false;
		unamecheck[1].children[0].checked = false;
	}
}

/* check if email is valid */
function checkEmail() {
	showCheckEmail();
	var theemail = email.value;
	var hasLetter = /[A-Za-z]/;
	if (theemail.indexOf('@') >= 0 && theemail.indexOf('.') > theemail.indexOf('@') + 1
		&& hasLetter.test(theemail.substr(theemail.length-1)) && theemail.substr(0, 1) != '@') {
		emailcheck[0].children[0].checked = true;
	}
	else {
		emailcheck[0].children[0].checked = false;
	}
}

/* check if password is valid */
function checkPSW() {
	var thepsw = psw.value;
	var hasNumber = /\d/, hasLetter = /[A-Za-z]/;
	if (thepsw.indexOf(' ') < 0 && thepsw.length >= 8 && thepsw.length <= 16) {
		pswcheck[0].children[0].checked = true;
	}
	else {
		pswcheck[0].children[0].checked = false;
	}
	if (hasNumber.test(thepsw) == true && hasLetter.test(thepsw) == true) {
		pswcheck[1].children[0].checked = true;
	}
	else {
		pswcheck[1].children[0].checked = false;
	}
}

/* press Register button */
function confirm() {
	if (unamecheck[0].children[0].checked == true && 
		unamecheck[1].children[0].checked == true) {
		if ((email.value != "" && emailcheck[0].children[0].checked == true)
			|| email.value == "" && phone.value != "") {
			if (pswcheck[0].children[0].checked == true && 
				pswcheck[1].children[0].checked == true) {
				// if captcha
				buyerRegister();
			}
			else {
				alert("invalid password");
			}
		}
		else {
			alert("invalid email");
		}
	}
	else {
		alert("invalid username");
	}
}


/* avatar */
var ava = document.getElementById("avatar");
var ava0 = document.getElementById("avatar0");
var ava1 = document.getElementById("avatar1");
var ava_num = 10;
var avaname = [];
for(var i = 1; i <= ava_num/2; i++) {
	avaname.push("male_0"+i+".png");
}
for(var i = 1; i <= ava_num/2; i++) {
	avaname.push("female_0"+i+".png");
}
var avapath = "../avatar/";
for(var i = 0; i < ava_num; i++) {
	var avat = document.createElement("img");
	avat.src = avapath + avaname[i];
	avat.setAttribute("class", "avatarimg");
	avat.style.width = "45px";

	var avadiv = document.createElement("div");
	avadiv.setAttribute("class", "avaSwitch");

	var radioavatar = document.createElement("input");
	radioavatar.setAttribute("type", "radio");
	radioavatar.setAttribute("class", "avatarradio");
	radioavatar.setAttribute("id", avaname[i]);
	radioavatar.setAttribute("value", avaname[i]);
	radioavatar.setAttribute("name", "ava");

	var labelavatar = document.createElement("label");
	labelavatar.setAttribute("for", avaname[i]);
	labelavatar.appendChild(avat);

	avadiv.appendChild(radioavatar);
	avadiv.appendChild(labelavatar);

	if(i < 5) {
		ava0.appendChild(avadiv);
	}
	else
		ava1.appendChild(avadiv);
	/////////////////////
}


var captchadiv = document.getElementById("captchaget");
var captchapic = document.createElement("img");
captchadiv.style.cursor = "pointer";
captchadiv.addEventListener("click", getcaptcha);
getcaptcha();
function getcaptcha() {
	//captchapic.innerHTML = "";
	//captchapic.src = "https://tf.mrning.com/user/captcha?time=" + new Date().getTime();
	/*var oReq = new XMLHttpRequest();
	oReq.open("GET", "https://tf.mrning.com/user/captcha", true);
	//oReq.setRequestHeader("Set-Cookie", "sessionid");
	oReq.responseType = "arraybuffer";
	oReq.onload = function (oEvent) {
		var arrayBuffer = oReq.response; // Note: not oReq.responseText
		console.log("buff", arrayBuffer);
		if (arrayBuffer) {
		    var u8 = new Uint8Array(arrayBuffer);
		    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
		    var mimetype="image/png"; // or whatever your image mime type is
		    captchapic.src="data:"+mimetype+";base64,"+b64encoded;
		    console.log("b64",b64encoded);
		}
	};
	oReq.send(null);*/
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.withCredentials = true;
	xhr.onreadystatechange = function () {
	    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
	    	console.log(xhr);
	    	console.log(this.getAllResponseHeaders());
	    	//console.log("i",xhr.response.data[0].img);
	        captchapic.src = "data:image/png;base64," + xhr.response.data[0].img; //create <img> with src set to the blob
	    }
	};
	xhr.open('GET', 'https://tf.mrning.com/api/user/captcha', true);
	xhr.setRequestHeader('Authorization', 'sessionid');
	xhr.send();
}
captchadiv.appendChild(captchapic);


/* buyer click register 
 first check if all info valid
 undone currently
*/
function buyerRegister() {
	var gendertag = 0;
	if (document.getElementById("male_tag").checked == true) {
		gendertag = 1;
	}
	if (document.getElementById("female_tag").checked == true) {
		gendertag = 2;
	}
	var avaselected = document.getElementsByClassName("avatarradio");
	var avaname = "male_01.png";
	for (var i in avaselected) {
		if (avaselected[i].checked == true) {
			avaname = avaselected[i].id;
			break;
		}
	}
	$.support.cors = true;
	$.ajax({
		type: "POST",
		url: "https://tf.mrning.com/api/user/register",
		xhrFields: { withCredentials: true },
     	crossDomain: true,
		data: {
			uname: username.value, 
			email: email.value, 
			phone: phone.value, 
			password: psw.value, 
			intro: bio.value,
			gender: gendertag, 
			avatar_name: avaname,
			no_captcha: false,
			captcha: captchaval.value
		},
		dataType: 'json'
		}).done(function(data, status) {
    		console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
	    	if (status == "success") {
	    		alert(data.msg);
	    		if (data.code == 200){
	    			alert("注册成功");
					window.location.href = "/";
	    		}
	    	}
		});
    /*$.post("https://tf.mrning.com/user/register", 
	{
		uname: username.value, 
		email: email.value, 
		phone: phone.value, 
		password: psw.value, 
		intro: bio.value,
		gender: gendertag, 
		avatar_name: avaname,
		no_captcha: false,
		captcha: captchaval.value
  	},
	function(data, status) {
    	console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
    	if (status == "success") {
    		alert(data.msg);
    		if (data.code == 200){
    			// page location
    			//window.location.href = "index.html";
    			alert("跳转页面\n现在先不给你跳哈哈哈");
    		}
    	}
	});*/


}