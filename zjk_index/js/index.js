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
