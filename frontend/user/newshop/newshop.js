(function() {
    'use strict';

if (getCookie("uid") == "") {
	alert("请先登录");
	window.location.href = "/";
}
$.get("/api/user/shop", function( data ) {
	if (data.code === 200) {
		alert("听闻你的店铺昨日经营的很好哦!");
        window.location.href = "/merchant/";
	}
})
})();


(function() {
    'use strict';

    $("#region_select").click(function(){openRegion();});
    var file
    $(".citySelect > label").text("市/区");
    $("#upload_img").change(function(e) {
        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            //console.log(e);
            file = e.originalEvent.srcElement.files[i];
            var reader = new FileReader();
            reader.onloadend = function() {
                $("#display_img img").attr("src", reader.result);
                $("#upload_img + label").text(file.name);
            }
            reader.readAsDataURL(file);
        }
    });

    $("input").click(function(){$("#checkvalid").css("display","none");})
    $("input").change(function(){$("#checkvalid").css("display","none");})

    

    $(".submit_store").click(()=>{
        var sname_in = $("#sname_input").val();
        var region = $("#region_select").val();
        var sadd_in = $("#sadd_input").val();
        var img_se = $("#upload_img + label").text();
        if (sname_in !== "" && region !== ""
            && sadd_in !== "" && img_se !== "") {
            $("#checkvalid").css("display","none");
            console.log(sname_in,region,sadd_in,img_se);
            // not sent yet
            // send to backend
            var formData = new FormData()
            formData.append('sname', sname_in)
            formData.append('saddr', region+sadd_in)
            formData.append('avatar', file)
            formData.append('avatar_name', img_se)
            $.ajax({
                type: "POST",
                url: "/api/user/shop/new",
                xhrFields: { withCredentials: true },
                crossDomain: true,
                data: formData,
                contentType: false,
                processData: false
            }).done(function(data, status) {
                console.log("Data: " + data.msg + data.code + "\nStatus: " + status);
                if (status == "success") {
                    if (data.code == 200){
                        alert("申请成功");
                        window.location.href = "/merchant/";
                    }
                }
            });
            
        }
        else {
            $("#checkvalid").css("display","block");
        }
    })
})();