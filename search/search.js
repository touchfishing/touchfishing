var thelist = document.getElementById("lists");

var searchInput = document.getElementById("searchInput");
var keyword = searchInput.value;

// product list json
var list;


/* only test */
var JSONurl = "https://raw.githubusercontent.com/Co10/temp_json/main/product.json";
//var JSONurl = "test/product.json";
getJSON(JSONurl, function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		console.log("the data", data);
		list = data;
		appendList();
	}
});

/* only test */

function appendList() {
	for (var i in list) {
		var picDiv = document.createElement("div");
		picDiv.setAttribute("class", "picDiv");
		var proName = document.createElement("div");
		proName.setAttribute("class", "proName");
		var sameLine = document.createElement("div");
		sameLine.setAttribute("class", "sameLine");
		var proPrice = document.createElement("div");
		proPrice.setAttribute("class", "proPrice");
		var proSellVol = document.createElement("div");
		proSellVol.setAttribute("class", "proSellVol");
		var proStore = document.createElement("div");
		proStore.setAttribute("class", "proStore");

		// pic
		var pic = document.createElement("img");
		pic.src = "test/" + list[i].picture;//or something //////////////
		picDiv.appendChild(pic);
		// product name
		var proname = document.createElement("a");
		proname.innerText = list[i].product;//or something
		var pronameTooltip = document.createElement("span");
		pronameTooltip.innerText = proname.innerText;
		pronameTooltip.setAttribute("class", "tooltiptext");
		proName.appendChild(proname);
		proName.appendChild(pronameTooltip);
		// price
		var proprice = document.createElement("label");
		proprice.innerText = "￥ " + list[i].price;//or something
		proPrice.appendChild(proprice);
		// volume
		var provolume = document.createElement("label");
		provolume.innerText = "销量: " + list[i].volume;//or something
		proSellVol.appendChild(provolume);
		// store name
		var storename = document.createElement("a");
		storename.innerText = list[i].storename;//or something
		var storeICON = document.createElement("img");
		storeICON.src = "../media/store_icon.svg";
		proStore.appendChild(storeICON);
		proStore.appendChild(storename);

		var proLi = document.createElement("li");
		proLi.appendChild(picDiv);
		proLi.appendChild(proName);
		sameLine.appendChild(proPrice);
		sameLine.appendChild(proSellVol);
		proLi.appendChild(sameLine);
		proLi.appendChild(proStore);

		thelist.appendChild(proLi);
	}
}

/* region */
function clearRegion() {
	var regionS = document.getElementById("region_select");
	var regionC = document.getElementById("region_clear");
	regionS.value = "全国境内";
}