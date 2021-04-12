var isBuyer = document.getElementById("buyer_tag");
var isSeller = document.getElementById("seller_tag");

var username = document.getElementById("username");
var email = document.getElementById("email");
var psw = document.getElementById("psw");
var pswcheck = document.getElementById("checkpsw").children; /* [0, 1, 2] */

var bio = document.getElementById("bio");

var storeEle = document.getElementsByClassName("store");
var bioText = document.getElementById("bioText");

switchReg();

/* personal info and store info switcher */
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
			storeEle[i].style.display = "block";
		}
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
	var res = [];
	res.push(isBuyer.checked);
	res.push(isSeller.checked);
	res.push(username.value);
	res.push(email.value);
	res.push(psw.value);
	res.push(bio.value);
	console.log(res);

	buyerRegister();
}


/* avatar */
var ava = document.getElementById("avatar");
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
	avat.style.width = "50px";
	ava.appendChild(avat);
	/////////////////////
}



var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};


/* in seller register, the region selection */
var provinceUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/province.json";
var cityUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/city.json";
var countyUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/county.json";

var provinceData, cityData;

getJSON(provinceUrl, function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		console.log("the province data", data);
		provinceData = data;
		addProvince();
	}
});

getJSON(cityUrl, function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		console.log("the city data", data);
		cityData = data;
	}
});

var provinceID = [];

function addProvince() {
	var provinces = document.getElementById("provinces");

	for (var i = 0; i < provinceData.length; i++) {

		var p_li = document.createElement("li");

		var radioInput = document.createElement('input');
		radioInput.setAttribute('type', 'radio');
		radioInput.setAttribute('name', 'pro');
		radioInput.setAttribute('class', 'radioAddr');
		radioInput.setAttribute('id', 'pro_'+ i);
		radioInput.setAttribute('onclick', 'addCity()');

		var radioLabel = document.createElement('label');
		radioLabel.setAttribute('for', 'pro_'+ i);
		radioLabel.setAttribute('class', 'radioAddrL');
		radioLabel.innerText = provinceData[i].name;

		p_li.appendChild(radioInput);
		p_li.appendChild(radioLabel);

		provinces.appendChild(p_li);

		var proString = provinceData[i].url;
		provinceID.push(proString.substring(proString.length-7, proString.length-5))
	}
}

function addCity() {
	var cities = document.getElementById("cities");
	while (cities.firstChild) {
        cities.removeChild(cities.firstChild);
    }

	var provinces = document.getElementById("provinces");
    var checkedNum;
    for (var i = 0; i < provinces.childElementCount; i++) {
    	if (provinces.children[i].firstChild.checked == true) {
    		checkedNum = i;
    		break;
    	}
    }

    for (var i = 0; i < cityData.length; i++) {
    	if (cityData[i].id.startsWith(provinceID[checkedNum])) {
    		var p_li = document.createElement("li");

			var radioInput = document.createElement('input');
			radioInput.setAttribute('type', 'radio');
			radioInput.setAttribute('name', 'cit');
			radioInput.setAttribute('class', 'radioAddr');
			radioInput.setAttribute('id', 'city_'+ i);

			var radioLabel = document.createElement('label');
			radioLabel.setAttribute('for', 'city_'+ i);
			radioLabel.setAttribute('class', 'radioAddrL');
			radioLabel.innerText = cityData[i].name;

			p_li.appendChild(radioInput);
			p_li.appendChild(radioLabel);

			cities.appendChild(p_li);
    	}
    	
    }
}

function selectCity() {
	var provinces = document.getElementById("provinces");
	var cities = document.getElementById("cities");
	var pro_name, city_name;
	for (var i = 0; i < provinces.childElementCount; i++) {
    	if (provinces.children[i].firstChild.checked == true) {
    		pro_name = provinces.children[i].children[1].innerText;
    		break;
    	}
    }
    for (var i = 0; i < cities.childElementCount; i++) {
    	if (cities.children[i].firstChild.checked == true) {
    		city_name = cities.children[i].children[1].innerText;
    		break;
    	}
    }

    console.log(pro_name, city_name);

    var applyCity = document.getElementById("storecity");
    applyCity.value = pro_name + " " + city_name;

    closeRegion();
}

function openRegion() {
	var regionSelect = document.getElementById("selectRegion");
	regionSelect.style.display = "block";
}

function closeRegion() {
	var regionSelect = document.getElementById("selectRegion");
	regionSelect.style.display = "none";
}



/* buyer click register 
 first check if all info valid
 undone currently
*/
function buyerRegister() {
	/*$.ajax({
		type: "POST",
		url: "https://tf.mrning.com/user/register",
		data: {
			uname: username.value, 
			email: email.value, 
			password: psw.value, 
			no_captcha: true
		},
		dataType: 'json'
}).done(function( msg ) {
    alert( "registered: " + msg );
  });*/
    $.post("https://tf.mrning.com/user/register", 
	{
		uname: username.value, 
		email: email.value, 
		password: psw.value, 
		no_captcha: true
  	},
	function(data, status) {
    	alert("Data: " + data + "\nStatus: " + status);
	});


}