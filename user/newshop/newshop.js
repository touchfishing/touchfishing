(function() {
    'use strict';

if (getCookie("uid") == "") {
	alert("请先登录");
	window.location.href = "../../";
}
// if (has store) jump
})();


(function() {
    'use strict';

    $("#region_select").click(function(){openRegion();});

    $(".citySelect > label").text("市/区");

    $("#upload_img").change(function(e) {
        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            var file = e.originalEvent.srcElement.files[i];
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
        }
        else {
            $("#checkvalid").css("display","block");
        }
    })
})();