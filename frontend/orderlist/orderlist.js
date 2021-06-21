


(function(){
    'use strict';

$.get("/api/user/orders", function(data) {
	if (data.code != 200) {
		alert("sorry, 404 not found");
	}
	else {
		//console.log(data.data);
		// user id
        //console.log(data.data.uid);
        // total order nums
        //console.log(data.data.order_num);
		var list = data.data.orders;
        //console.log(list);
        list.reverse();
        for (var i of list) {
            createOrder(i);
        }
	}
})


function createOrder(d) {
    var toAppend = `<div class="order_groups">
        <div class="outer_box_order">
            <div class="order_top_pane">
                <div class="order_date"><span>${d.create_time}</span></div>
                <div class="order_id_num"><span>${d.oid}</span></div>
            </div>
            <div class="order_item">
                <div class="item_detail">
                    <div class="item_pic"><img src="../media/bank_card.png"></div>
                    <div class="item_text"><span>${d.pname}</span>
                    <br><span>${d.spec}</span><br><span>×${d.quantity}</span></div>
                </div>
                <div class="order_cost"><span>￥ ${d.price}</span></div>
            </div>
        </div>
        <div class="order_operation">
            <div class="lookfor"><button>查看物流</button></div>
            <div class="evaluate"><button>评价</button></div>
            <div class="withdraw_item"><button>退货</button></div>
            <div class="confirm_item"><button>确认收货</button></div>
        </div></div>`

    $("#one_order_02").append(toAppend);
}





})();