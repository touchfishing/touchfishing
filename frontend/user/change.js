$("#box_cancel").click(closePop);

$(".basic_info span").click(popUp);

function popUp() {
    $(".all_bg").css("display","block");
    $("#box_text").text($(this).children(":first").text());
    $("#box_ori").text($(this).children().eq(1).text())
    
    var typethis = $(this).parent().attr("id");
    
    if (typethis == "basic_photo") { // avatar
        $("#box_new").val("noted,changed later");
    }
}

function closePop() {
    $(".all_bg").css("display","none");
    $("#box_new").val("");
}