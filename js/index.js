document.addEventListener("DOMContentLoaded", () => {

	/*----------------检测登陆状态-------------------------*/
	getCart();

	function getCart() {
		$.ajax({
			type: "get",
			url: "api/getCar.php",
			async: true,
			success: (str) => {
				var data = JSON.parse(str);
				var sum = 0;
				data.map(function(item) {
					return sum += (item.qty) * 1;
				});
				sign(sum);
			}
		});
	}
	sign();

	function sign(data) {
		var usn = Cookie.getCookie("usn");
		if(usn) {
			$("#header .tips").addClass("login");
			$("#header .tips").removeClass("logout");
			$("#header").find(".panel").html(`Hi,${usn}`);
			$(".sidebar .rtbar-mbrcenter").addClass("login");
			$(".sidebar .rtbar-mbrcenter").removeClass("logout");
			$(".rtbar-mbrcenter").find(".name").html(`${usn}<small>个人</small>`);
			$(".rtbar-mycart").find("#amount").html(`${data}`);
			toCart();
		} else {
			$("#header .tips").addClass("logout");
			$("#header .tips").removeClass("login");
			$("#header").find(".panel").html(`Hi,欢迎来到如此生活`);
			$(".sidebar .rtbar-mbrcenter").addClass("logout");
			$(".sidebar .rtbar-mbrcenter").removeClass("login");
			$(".rtbar-mbrcenter").find(".name").html(`${usn}<small>个人</small>`);
			$(".rtbar-mycart").find("#amount").html(`0`);
		}
		/*退出登陆状态*/
		$("#header").find(".out").click(function() {
			console.log(usn);
			Cookie.setCookie("usn", usn, -1, "/");
			sign();
		});
	}

	function toCart() {
		$(".rtbar-mycart").click(function() {
			console.log("sss");
			window.open("html/Cart.html", "_blank");
		});
	}
	/*---------------------轮播图------------------------*/
	//参数：最外层容器,单张图片的宽度,图片容器,焦点容器,切图间隔,左按钮,右按钮
	slide_1('.carousel', 1200, '.carousel-inner li', '.carousel-indicators li', 3000, '#prev', '#next');

	/*-------------------鼠标滑过move类运动----------------------------*/

	$(".move").hover(function() {
		$(this).stop().animate({
			left: "-6px"
		}, "fast");
	}, function() {
		$(this).stop().animate({
			left: "0px"
		}, "fast");
	});

	/*----------------加载渲染move类图片数据------------------------*/
	getMove();

	function getMove() {
		$.ajax({
			type: "get",
			url: "api/indexGet.php",
			async: true,
			data: {
				"imgtype": "move",
			},
			success: function(str) {
				$data = JSON.parse(str);
				//						    console.log($data);
				move($data);
			}
		});

		function move(data) {
			var str = ``;
			for(var i = 0; i < data.length; i++) {
				str = `<a href="#">
									<img src="${data[i].imgurl}" title="${data[i].title}" />
								   </a>`;
				$(".move").eq(i).html(str);
			}
		}
	}

	/*----------------加载渲染通栏类图片数据------------------------*/
	getFooter();

	function getFooter() {
		$.ajax({
			type: "get",
			url: "api/indexGet.php",
			async: true,
			data: {
				"imgtype": "footer",
			},
			success: function(str) {
				$data = JSON.parse(str);
				//							console.log($data);
				footer($data);
			}
		});

		function footer(data) {
			var str = ``;
			for(var i = 0; i < data.length; i++) {
				str = `<a href="#" title="${data[i].title}">
							<img src="${data[i].imgurl}" title="${data[i].title}">
							</a>`;
				$(".full-column").eq(i).html(str);
			}
		}
	}
});