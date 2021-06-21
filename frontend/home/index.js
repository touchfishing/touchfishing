window.addEventListener('load', function() {
    var focus = document.querySelector('.imgBox');
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    var length = ul.children.length;
    // console.log(ul.children.length);
    for (let i = 0; i < length; i++) {
        var li = document.createElement('li');
        li.setAttribute('index',i);
        ol.appendChild(li);
        li.addEventListener('click',function() {
            for(var j=0; j<ol.children.length; j++) {
                ol.children[j].className="";
            }
            this.className="current";
            //move
            var index=this.getAttribute('index');
            var focusWidth = focus.offsetWidth;
            animate(ul, -index*focusWidth);
            // change the background img
            changeBG(i);
        })
    }
    ol.children[0].className = "current";
    ol.children[0].click();
})

function animate(obj, target, callback) {
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        // 步长值写到定时器的里面
        // 把我们步长值改为整数 不要出现小数的问题
        // var step = Math.ceil((target - obj.offsetLeft) / 10);
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            // 停止动画 本质是停止定时器
            clearInterval(obj.timer);
            callback && callback();
        }
        // 把每次加1 这个步长值改为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}

function changeBG(idx) {
    var theBG = document.getElementsByClassName("bgIMG")[0];
    if (1000 * window.innerHeight < 815 * window.innerWidth) {
        var theOne = document.getElementsByClassName("imgBox")[0].children[0].children[idx];
        theBG.style["background-image"] = `url(${theOne.children[0].children[0].src})`;
    }
    else {
        theBG.style["background-image"] = "none";
    }
}

var click_I = 0;
var click_million_seconds = 5000;

setInterval(function () {clickCircle();}, click_million_seconds);

async function clickCircle() {
    document.getElementsByClassName("circle")[0].children[click_I].click();
    click_I = (click_I + 1) % document.getElementsByClassName("circle")[0].children.length;
}

document.getElementById("searchButton").addEventListener("click", searchItem);

document.getElementById("searchInput").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchItem();
    }
});

function searchItem() {
    var thekeyword = document.getElementById("searchInput").value;
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set("kw", thekeyword);
    history.pushState(null, null, "/search/?"+queryParams.toString());
    //console.log("/search/?"+queryParams.toString());
	window.open("/search/?"+queryParams.toString(), '_blank');
}




function windowResize() {
    var win = $(window);
    
    if (1000 * win.height() >= 815 * win.width()) { 
        phDisplay();
    }
    else {
        pcDisplay();
    }
    document.getElementsByClassName("circle")[0].children[click_I].click();
}

$(window).on('resize', windowResize);

windowResize();

function pcDisplay() {
    $(".nav").css("height", $(window).height()-200);
    $(".nav").css("flex-direction", "row");
    $(".search_logo").css("display", "inline-block");
    $(".search_box").css("margin-bottom", "100px");
    $(".search").css("height", "150px");
    $(".commodity_pic").css({"height": "80px", "width": "80px"});
    $(".dropdown").css({"width": "30%", "margin": "10px 10px 10px 30px"});
    $(".imgBox").css({"width": "55%", "margin-top": "10px", "margin-right": "5%"});
    $(".imgBox ul").css("transform", "translateY(50px)");
}

function phDisplay() {
    $(".nav").css("height", $(window).height()-150);
    $(".nav").css("flex-direction", "column");
    $(".dropdown").css("width", "90%");
    $(".search_logo").css("display", "none");
    $(".search_box").css("margin-bottom", "0");
    $(".search").css("height", "100px");
    $(".commodity_pic").css({"height": "50px", "width": "50px"});
    $(".dropdown").css({"width": "100%", "margin": "0"});
    $(".imgBox").css({"width": "100%", "margin-top": "0", "margin-right": "0"});
    $(".imgBox ul").css("transform", "translateY(0px)");
}