window.addEventListener('load',function() {
    var focus = document.querySelector('.imgBox');
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    var length = ul.children.length;
    // console.log(ul.children.length);
    for(var i = 0; i < length; i++) {
        var li = document.createElement('li');
        li.setAttribute('index',i);
        ol.appendChild(li);
        li.addEventListener('click',function() {
            for(var i=0; i<ol.children.length; i++) {
                ol.children[i].className="";
            }
            this.className="current";
            //move
            var index=this.getAttribute('index');
            var focusWidth = focus.offsetWidth;
            animate(ul, -index*focusWidth);
        })
    }
    ol.children[0].className = "current";
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