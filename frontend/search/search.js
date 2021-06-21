function searchItem() {
	var thekeyword = document.getElementById("searchInput").value;
	var queryParams = new URLSearchParams(window.location.search);
	queryParams.set("kw", thekeyword);
	history.pushState(null, null, "?"+queryParams.toString());
	showResult();
}

var list;

var thelist = document.getElementById("lists");

showResult();

function showResult() {
	var keyword = new URL(window.location.href).searchParams.get('kw');

	var searchInput = document.getElementById("searchInput");
	searchInput.value = keyword;

	// product list json

	$.get("https://tf.mrning.com/api/search/name/" + keyword, function( data ) {
		if (data.code != 200 || data.data.item_num <= 0) {
			alert("sorry, 404 not found");
			
		}
		else {
			console.log(data.data.item_num);
			console.log(data.data.items);
			list = data.data.items;
			appendList();
		}
		
	})

	/* only test */
	/*var JSONurl = "https://raw.githubusercontent.com/Co10/temp_json/main/product.json";
	//var JSONurl = "test/product.json";
	getJSON(JSONurl, function(err, data) {
		if (err !== null) {
			alert('Sorry, something went wrong: ' + err);
		} else {
			console.log("the data", data);
			list = data;
			appendList();
		}
	});*/
	/* only test */
}

function appendList() {
	thelist.innerHTML = "";
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
		var picA = document.createElement("a");
		pic.alt = list[i].pname;
		pic.src = "https://tf.mrning.com/api" + list[i].cover;
		var pronameTooltip = document.createElement("span");
		pronameTooltip.innerText = list[i].pname;
		pronameTooltip.setAttribute("class", "tooltiptext");
		picDiv.appendChild(picA);
		picA.appendChild(pic);
		picA.appendChild(pronameTooltip);
		picA.href = "../product?pid=" + list[i].pid;
		// product name
		var proname = document.createElement("a");
		proname.innerText = list[i].pname;
		proname.href = "../product?pid=" + list[i].pid;
		proName.appendChild(proname);
		//proName.appendChild(pronameTooltip);
		
		// price
		var proprice = document.createElement("label");
		proprice.innerText = "￥ " + list[i].prices[0];
		proPrice.appendChild(proprice);
		// volume
		var provolume = document.createElement("label");
		provolume.innerText = "销量: " + list[i].volume;
		proSellVol.appendChild(provolume);
		// store name
		var storename = document.createElement("a");
		storename.innerText = list[i].sname;
		var storeICON = document.createElement("img");
		storeICON.src = "/media/store_icon.svg";
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