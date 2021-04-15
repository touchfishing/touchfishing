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