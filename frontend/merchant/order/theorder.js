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

function theData(d) {
    
}



})();

<tbody>
                        <tr>
                            <td>#100000</td>
                            <td>2021.01.01</td>
                            <td>未发</td>
                            <td><button> <a href="info/">查看</a></button></td>
                        </tr>
                    </tbody>