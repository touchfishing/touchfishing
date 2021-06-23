(function() {
    'use strict';
$.get("/api/user/shop", function( data ) {
	if (data.code !== 200) {
		window.location.href = "/";
	}
    else {
        $("#shopname").text(data.data.sname);
        theData(data.data.sid);
    }
})

function theData(id) {
    $.get(`/api/shop/${id}/list`, function( data ) {
        if (data.code !== 200) {
            alert("sorry, 404 not found");
        }
        else {
            var the_data = data.data.items;
            for (let i of the_data) {
                createLI(i);
            }
        }
            
    })
}

function createLI(s) {
    var str = `<li><div class="jItem"><div class="jPic">
            <a href="#"><img src="/api${s.cover}" alt=""></a>
        </div>

        <div class="jInfo">
            <div class="jPrice">￥${s.prices[0]}</div>
            <div class="jDesc">
                <a href="#">${s.pname}</a>
            </div>
        </div>
    </div>
    </li>`
    $(".store_nav ul").append(str);
}

var jsData;

getJSON("d.json", function(err, data) {
	if (err !== null) {
		alert('Sorry, something went wrong: ' + err);
	} else {
		//console.log("the province data", data);
		jsData = data;
        //console.log(jsData);
	}
});

$("#hhhh").change(function(e) {
    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
        //console.log(e);
        var file = e.originalEvent.srcElement.files[i];
        //console.log(file);
        addITEM(jsData.filter((e)=> e.cover === file.name)[0], file)
    }
});

function addITEM(item, imgURL) {
    var formData = new FormData();
        formData.append('pname', item.pname);
        //formData.append('price', 100); // ???
        formData.append('info', item.info);
        formData.append('tag', item.tag);
        formData.append('cover', imgURL);
        formData.append('specs', item.specs);
        formData.append('prices', item.prices);
        formData.append('stocks', item.stocks);
        formData.append('shipping_region', item.shipping_region);//
    $.ajax({
        type: "POST",
        url: "/api/product/new",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: formData,
        contentType: false,
        processData: false
    }).done(function(data, status) {
        console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
        if (status == "success") {
            if (data.code == 200){
                console.log("ok");
                //
            }
        }
    });
}


})();



