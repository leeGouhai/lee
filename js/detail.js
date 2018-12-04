$(function() {

	/*----------------检测登陆状态-------------------------*/
	getCart();

	function getCart() {
		$.ajax({
			type: "get",
			url: "../api/getCar.php",
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
		console.log(data);
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
			//						console.log(usn);
			Cookie.setCookie("usn", usn, -1, "/");
			sign();
		});
	}

	function toCart() {
		$(".rtbar-mycart").click(function() {
			console.log("sss");
			window.open("Cart.html", "_blank");
		});
	}

	/*-------------接收网址参数gid,加载数据-------------*/
	$gid = location.search.slice(5); //?gid=g001
	//				console.log($gid);
	$.ajax({
		type: "get",
		url: "../api/getDetail.php",
		async: true,
		data: {
			"gid": $gid
		},
		success: (str) => {
			var data = JSON.parse(str);
			//						console.log(data);
			create(data);
			magnif();
			buyNum(data);
			btnPick($(".product_pick .size_box"), $(".product_pick .color_box"));
			insertData(data[0], $gid);
		}
	});

	/*---------------创建节点、渲染数据---------------------*/
	function create(data) {
		var Istr = ``;
		var Cstr = ``;
		var Sstr = ``;
		var Tstr = `<b>${data[0].title}</b>`;
		var Pstr = `${data[0].price}`;
		var Pdstr = `${data[0].price_del}`;
		var tip = `<li>
						            <a href="#">${data[0].store}</a>
						            <i class="icon iconfont icon-chevronright"></i>
					           </li>
					           <li>
						            <a href="">${data[0].title}</a>
					           </li>`;
		for(var i = 0; i < data.length; i++) {
			if(data[i].imgurl) {
				Istr += `<li>
								        <div class="small-img">
									        <img src="${data[i].imgurl}" />
								        </div>
							        </li>`;
			}
			if(data[i].color) {
				Cstr += `<dd type="color">${data[i].color}</dd>`;
			}
			if(data[i].size) {
				Sstr += `<dd type="size">${data[i].size}</dd>`;
			}
		}
		$(".search_head>ul").append(tip);
		$(".inf h1 .title").append(Tstr);
		$(".info-count .price").append(Pstr);
		$(".info-count #info_market_price").append(Pdstr);
		$(".magnifier-line>ul").append(Istr);
		$(".product_pick .color_box dl").append(Cstr);
		$(".product_pick .size_box dl").append(Sstr);
	}

	/*-----------------------放大镜-------------------------*/
	function magnif() {
		var magnifierConfig = {
			magnifier: "#magnifier1", //最外层的大容器
			width: 370, //承载容器宽
			height: 370, //承载容器高
			moveWidth: null, //如果设置了移动盒子的宽度，则不计算缩放比例
			zoom: 3 //缩放比例
		};
		var _magnifier = magnifier(magnifierConfig);
	}

	/*----------------------增减数量----------------------------*/
	function buyNum(data) {
		$num = $(".buy_number").val();
		$(".decrease_num").click(() => {
			if($num > 1) {
				$num--;
				$(".buy_number").val($num);
			}
		});
		$(".increase_num").click(() => {
			if($num < data[0].stock) {
				$num++;
				$(".buy_number").val($num);
			}
		});
	}
	/*---------------------点击加入购物车--------------------------*/
	//插入数据
	function insertData(data, $gid) {
		//					console.log($gid);
		$(".btn-addcart").click(() => {
			$imgurl = data.imgurl;
			$price = data.price;
			$price_del = data.price_del;
			$stock = data.stock;
			$store = data.store;
			$name = data.title;
			$size = $(".color_box dl .select").html();
			$color = $(".size_box dl .select").html();
			$qty = $(".num_box .buy_number").val();
			$.ajax({
				type: "get",
				url: "../api/insertCart.php",
				async: true,
				data: {
					"gid": $gid,
					"qty": $qty,
					"store": $store,
					"price": $price,
					"price_del": $price_del,
					"imgurl": $imgurl,
					"stock": $stock,
					"name": $name,
					"size": $size,
					"color": $color
				},
				success: (str) => {
					//								console.log(str);
					getCart();
				}
			});
		});
	}

	//放入购物车特效			
	//结束的地方的元素
	var offset = $("#mycart").offset();
	//是$(".addcar")这个元素点击促发的 开始动画的位置就是这个元素的位置为起点
	$(".btn-addcart").click(function(event) {
		//					console.log("ss");
		//					console.log(event.pageX);
		//					console.log(event.pageY);
		var addcar = $(this);
		var img = addcar.parent().find('img').attr('src');
		var flyer = $('<img class="u-flyer" src="../img/lazy.gif">');
		flyer.fly({
			start: {
				left: event.pageX,
				top: event.pageY
			},
			end: {
				left: offset.left + 30,
				top: offset.top + 30,
				width: 0,
				height: 0
			},
			onEnd: function() {
				$("#flymsg").show().fadeOut(1000);
				//							addcar.css("cursor", "default").removeClass('orange').unbind('click');
				this.destory();
			}
		});
	});

});