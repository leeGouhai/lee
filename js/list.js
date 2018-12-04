$(function() {
	/*接收首页传过来的参数,加载数据库中对应类目的商品*/
	$category = location.search;

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
			//						insertData();
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

	/*-------------数据加载、节点创建完成之后的特效---------------*/
	function hover() {
		$(".products_wrap .item").hover(function() {
			btnthumb($(this).find(".cs_list"), $(this).find(".pic"));
			$(this).addClass("hover");
			$(this).find(".item_wrap_left").css("display", "block");

		}, function() {
			$(this).removeClass("hover");
			$(this).find(".item_wrap_left").css("display", "none");

		});
	}

	/*--------------单击商品,网址传参,跳转详情页------------------*/
	function toDetail() {
		$(".products_wrap ul").on("click", ".item .pic a", function() {
			console.log($(this).attr("data-id"));
			$gid = $(this).parents(".item").attr("data-id"); //新版JQ用prop获取自定义属性
			window.open("Detail.html?gid=" + $gid, "_blank");
		});
	}
	toDetail();

	/*-----------------------插入数据--------------------------*/
	function insertData() {
		$(".products_wrap ul li").on("click", ".btn_addcart", function() {
			var wrap = $(this).parents(".item");
			$gid = wrap.attr("data-id");
			$imgurl = wrap.find(".pic img:first").attr("src");
			$price = wrap.find(".price .now").html().slice(1);
			$price_del = wrap.find(".price .old").html();
			$stock = wrap.find(".store a:last").html().slice(-3);
			$store = wrap.find(".store a:first").html();
			$name = wrap.find(".title").html();
			$size = "default";
			$color = "default";
			var iqty = 1;
			$.ajax({
				type: "get",
				url: "../api/insertCart.php",
				async: true,
				data: {
					"gid": $gid,
					"qty": iqty,
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
					console.log(str);
					getCart();
				}
			});
		});
	}
	/*----------------加载数据,创建、渲染节点--------------*/
	//初始化数据(初始化为第一页,一页有十张图),全局变量
	$page = 1;
	$qty = 10;
	var mthod = '';
	var flag = false;
	getMain(mthod, flag);

	function getMain(mthod, flag) {
		$.ajax({
			type: "get",
			url: "../api/getGoodsList.php",
			async: true,
			data: {
				"page": $page,
				"qty": $qty,
				"mth": mthod,
				"srt": flag
			},
			success: (str) => {
				$data = JSON.parse(str);
				createPag($data.total, $page - 1);
				createMain($data.limit, ".search_list_wrap .products_wrap"); //框架							
				getImg($data.limit, ".search_list_wrap .products_wrap"); //图片							
				hover(); //事件
				insertData();
				//							console.log($data.limit);
			}
		});
	}

	/*点击页码*/
	$(".pager").on("click", ".btn", function() {
		//					console.log($(this).html());
		$page = $(this).html();
		console.log(mthod, flag);
		getMain(mthod, flag);
	});
	/*点击确定按钮跳转*/
	$(".pager").on("click", ".btn_page", function() {
		$num = $(this).parent().find(".skip_page").val();
		if($num >= 0 && $num && $num <= $("#total_page").html()) {
			$page = $(this).parent().find(".skip_page").val();
			getMain(mthod, flag);
		}
	});
	/*上方翻页面板*/
	function trunPage(index, pages) {
		var str = `<a class="prev" href="javascript:void(0)">上一页 </a>
							   <a class="next" href="javascript:void(0)">下一页 </a>`;
		$(".head_pagebtn").html(str);
		if(index == 0) {
			$(".head_pagebtn .prev").addClass("dis");
		} else if(index + 1 >= pages) {
			$(".head_pagebtn .next").addClass("dis");
		} else {
			$(".head_pagebtn a").addClass("enable");
		}

		$(".prev").click(function() {
			if($page > 1) {
				$page--;
				getMain(mthod, flag);
			}
		});
		$(".next").click(function() {
			if($page < pages) {
				$page++;
				getMain(mthod, flag);
			}
		});
	}

	/*点击首尾页*/
	function skip(pages) {
		$(".pager .first").click(function() {
			$page = 1;
			getMain(mthod, flag);
		});
		$(".pager .last").click(function() {
			console.log(pages);
			$page = pages;
			getMain(mthod, flag);
		});
	}

	/*创建、渲染下方页码节点*/
	function createPag(data, index) {
		//					console.log(index);
		//					console.log(data);
		$(".head_pagecount span").html(`${data}`); //显示商品总数
		var pages = Math.ceil(data / $qty);
		var str = ``;
		for(var i = 0; i < pages; i++) {
			str += `<a href="javascript:void(0)" class="btn" data-type="num">${i+1}</a>`;
		}
		if(pages >= 2) { //如果页码超过2
			trunPage(index, pages); //创建上下翻页
			$(".head_pageInfo .inf").html(`${index+1}/${pages}`); //当前页码状态
			$(".pager").get(0).innerHTML = `<a href="javascript:void(0)" class="first">首页</a>
						                               ${str}
						                               <a href="javascript:void(0)" class="last">尾页</a>
							                           <span class="page_amount">
								                       共<b id="total_page">${pages}</b>页
							                           </span>
							                           <input type="text" class="skip_page" /><span>页</span>
							                           <a href="javascript:void(0)" class="btn_page">确定</a>`;
		} else {
			$(".pager").get(0).innerHTML = str;
		}
		$(".pager .btn").eq(index).addClass("currentpage");
		skip(pages); //首尾页
	}

	/*----------------点击排序--------------------*/
	$(".search_list_pind .fl dd").click(function() {
		$(".search_list_pind .fl dd").removeClass("select");
		$(this).addClass("select");
		if($(this).hasClass("price")) {
			flag = !flag;
			mthod = "price";
			getMain(mthod, flag);
		}
		if($(this).hasClass("sales")) {
			flag = !flag;
			mthod = "sales";
			getMain(mthod, flag);
		}
		if($(this).hasClass("visit")) {
			flag = !flag;
			mthod = "support";
			getMain(mthod, flag);
		}
		if($(this).hasClass("default")) {
			flag = false;
			mthod = "";
			getMain(mthod, flag);
		}
	});

	/*待创建框架后加载图片数据,创建、渲染节点*/
	function getImg(data, parentBox) {
		for(let i = 0; i < data.length; i++) {
			$.ajax({
				type: "get",
				url: "../api/getListImg.php",
				async: true,
				data: {
					"gid": data[i].gid
				},
				success: (str) => {
					var dataimg = JSON.parse(str);
					createImg(dataimg, parentBox);
				}
			});
		}
	}

	//把图片挂载在对应的容器
	function createImg(data, parentBox) {
		//					var index = data[0].gid.slice(3); //g001=>1;g011=>1,每一页都是新节点,容器的下标不会超过qty
		var index = data[0].gid;
		var str1 = ``;
		var str2 = ``;
		for(var i = 0; i < data.length; i++) {
			str1 += `<li>
									<img src="${data[i].m_img}" />
								</li>`;
			str2 += `<a href="javascript:void(0)" style="position:absolute;">
									<img src="${data[i].m_img}" />
								</a>`;
		}
		//					$("li[data-name='d']")
		$(parentBox).find("li[data-id=" + index + "]").find(".item_wrap_left .cs_list").html(str1);
		//					$(".search_list_wrap li[data-id=" + index + "]").find(".item_wrap_left .cs_list").html(str1);
		$(parentBox).find("li[data-id=" + index + "]").find(".item_wrap_right .pic").html(str2);
		//					$(".search_list_wrap li[data-id=" + index + "]").find(".item_wrap_right .pic").html(str2);
	};

	//创建
	function createMain(data, parentBox) {
		var str = ``;
		for(var i = 0; i < data.length; i++) {
			var row = (i % 5 == 0) ? "firstrow" : "ml20";
			str += `<li class="item ${row}" data-id="${data[i].gid}">
									<div class="item_wrap">
										<!--隐藏部分-->
										<div class="item_wrap_left">
											<div class="cs_wrapper">
												<ul class="cs_list">
												
												</ul>
											</div>
										</div>
										<!--显示部分-->
										<div class="item_wrap_right">
											<div class="pic">
											
											</div>
											<p class="title">${data[i].title}</p>
											<p class="name">
												<a href="#">${data[i].name}</a>
											</p>
											<p class="price">
												<span class="now">¥${data[i].price}</span>
												<del class="old">${data[i].price_del}</del>
											</p>
											<p class="store">
												<a href="#">${data[i].store}</a>
											    <a href="#">&nbsp;库存:${data[i].stock}</a>
											</p>
											<div class="list_button">
												<a href="javascript:void(0)" class="btn_addcart">
													<i class="icon iconfont icon-shoppingcart"></i> 加入购物车
												</a>
												<a href="javascript:void(0)" class="btn_fav">
													<i class="icon iconfont icon-starempty"></i> 关注商品
												</a>
											</div>
										</div>
									</div>
								</li>`;
		}
		$(parentBox).find("ul").html(str);
		//					$(".search_list_wrap .products_wrap ul").html(str);
	}
	/*---------------------------热销商品加载--------------------------------*/
	hotSale();

	function hotSale() {
		$.ajax({
			type: "get",
			url: "../api/getGoodsList.php",
			async: true,
			data: {
				"page": 1,
				"qty": 5,
				"mth": "sales",
				"srt": false
			},
			success: (str) => {
				//得到销量前五的商品                      	   
				var data = JSON.parse(str);
				//                          console.log(data.limit);  														
				createMain(data.limit, "#hot .products_wrap");
				getImg(data.limit, "#hot .products_wrap"); //图片							
				hover(); //事件
				insertData();
			}
		});
	}

});