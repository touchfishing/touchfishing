addDom();

/* in seller register, the region selection */
var provinceUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/province.json";
var cityUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/city.json";
var countyUrl = "https://raw.githubusercontent.com/wecatch/china_regions/master/src/county.json";

var provinceData, cityData;

getJSON(provinceUrl, function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		//console.log("the province data", data);
		provinceData = data;
		addProvince();
	}
});

getJSON(cityUrl, function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		//console.log("the city data", data);
		cityData = data;
	}
});

var provinceID = [];

function addDom() {
	var selectRegion = document.createElement("div");
	selectRegion.setAttribute("class", "selectRegion");
	selectRegion.setAttribute("id", "selectRegion");

	var addrBorder = document.createElement("addrBorder");
	addrBorder.setAttribute("class","addrBorder");

	var provinceSelect = document.createElement("provinceSelect");
	provinceSelect.setAttribute("class","provinceSelect");
	var labelforprovinces = document.createElement("label");
	labelforprovinces.setAttribute("for","provinces");
	labelforprovinces.setAttribute("class","titleSelect");
	labelforprovinces.innerText="(大陆地区)省/直辖市";
	var provinces__div = document.createElement("div");
	provinces__div.setAttribute("id", "provinces");
	provinceSelect.appendChild(labelforprovinces);
	provinceSelect.appendChild(provinces__div);

	var citySelect = document.createElement("citySelect");
	citySelect.setAttribute("class","citySelect");
	var labelforcities = document.createElement("label");
	labelforcities.setAttribute("for","provinces");
	labelforcities.setAttribute("class","titleSelect");
	labelforcities.innerText="市/区(可不选)";
	var cities__div = document.createElement("div");
	cities__div.setAttribute("id","cities");
	citySelect.appendChild(labelforcities);
	citySelect.appendChild(cities__div);

	var confirmRegion = document.createElement("confirmRegion");
	confirmRegion.setAttribute("class","confirmRegion");
	var buttonS = document.createElement("button");
	var buttonC = document.createElement("button");
	buttonS.innerText="确定";
	buttonC.innerText="取消";
	buttonS.addEventListener("click", selectCity);
	buttonC.addEventListener("click", closeRegion);
	confirmRegion.appendChild(buttonS);
	confirmRegion.appendChild(buttonC);

	addrBorder.appendChild(provinceSelect);
	addrBorder.appendChild(citySelect);
	addrBorder.appendChild(confirmRegion);

	selectRegion.appendChild(addrBorder);

	document.body.appendChild(selectRegion);
}

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
	var pro_name = "", city_name = "";
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

    //console.log(pro_name, city_name);
    var nameoftheapply = pro_name;
    if (city_name != "") {
		nameoftheapply += (" " + city_name);
    }

    var applyCity = document.getElementById("region_select");
    applyCity.value = nameoftheapply;

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