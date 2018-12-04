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
		//					console.log(data);
		var usn = Cookie.getCookie("usn");
		if(usn) {
			$("#header .tips").addClass("login");
			$("#header .tips").removeClass("logout");
			$("#header").find(".panel").html(`Hi,${usn}`);
			$(".sidebar .rtbar-mbrcenter").addClass("login");
			$(".sidebar .rtbar-mbrcenter").removeClass("logout");
			$(".rtbar-mbrcenter").find(".name").html(`${usn}<small>个人</small>`);
			$(".rtbar-mycart").find("#amount").html(`${data}`);
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

	//参数：最外层容器,单张图片宽度,运动的元素,切图间隔,左按钮,右按钮
	slide_2(".swiper-container", 277, ".swiper-wrapper", 4000, "#swiper-button-prev", "#swiper-button-next");

	update();

	function update(del) {
		$.ajax({
			type: "get",
			url: `../api/getCar.php?time=${new Date}`,
			async: true,
			success: (str) => {
				var data = JSON.parse(str);
				if(del) {
					$(".cartmain .top-tips").html(`全部商品（${data.length}）`);
				} else {
					var Sarr = [];
					data.map(function(item) {
						return Sarr.push(item.store);
					});
					Sarr = new Set(Sarr);
					Sarr = Array.from(Sarr);
					//							console.log(data);
					createCartbox(Sarr);
					getCartItem(Sarr, data);
					$(".cartmain .top-tips").html(`全部商品（${data.length}）`);
				}

			}
		});
	}

	function getCartItem(Sarr, data) {
		var all = data;
		for(var i = 0; i < Sarr.length; i++) {
			$.ajax({
				type: "get",
				url: "../api/getCartlist.php",
				async: true,
				data: {
					"store": Sarr[i]
				},
				success: (str) => {
					var data = JSON.parse(str);
					//								console.log(data);
					createCartItem(data, all);
				}
			});
		}
	}

	function createCartItem(data, all) {
		//					console.log(data);
		var str = ``;
		for(var i = 0; i < data.length; i++) {
			str += `<div class="full-gift-item" data-id="${data[i].gid}">
						<table border="0">
							<tbody>
								<tr>
									<td width="40%" align="left">
										<a href="#" class="onlylist-parent td_1">
											<img src="${data[i].imgurl}" />
										</a>
										<a href="#" class="td_2">
											${data[i].name}											
										</a>
										<div class="td_3">
											<div class="td_text">${data[i].color},${data[i].size}</div>
										</div>
									</td>
									<td width="15%" align="right">
										<span class="price">￥${data[i].price}</span>
									</td>
									<td width="10%" align="right">

									</td>
									<td width="12%">
										<div class="quantity-form">
											<input type="button" class="decrement fl" datainfo="" value="-">
											<input type="text" class="itxt" datainfo="" value="${data[i].qty}">
											<input type="button" class="increment fr" datainfo="" value="+">
										</div>
									</td>
									<td width="12%" align="right" class="color-red">
										<div class="price1">
											<span class="color-red cost">￥${data[i].total}</span>
										</div>
									</td>
									<td width="12%">
										<span><i datainfo="" class="cancel icon">cancel</i></span>
									</td>
								</tr>
							</tbody>
						</table>
						<div class="item-checkbox">
							<span><input type="checkbox" class="son_check cart_item_selector"/></span>
						</div>
						<div class="item-line-small"></div>

					</div>`;
		}
		$(`.cartBox[data-store=${data[0].store}]`).find(".full-gift").prepend(str);

		if($(".full-gift-item").size() == all.length) {
			Cart();
		}
	}

	function createCartbox(Sarr) {
		var Sstr = ``;
		var res = Sarr.map(function(item) {
			return `<div class="cart-item-list cartBox" data-store="${item}">
				<div class="shop-name clearfix">
					<div class="name-left">
						<div>
							<span>
								<input type="checkbox" value="" class="shopChoice">
							</span>
							<span>${item}</span>
						</div>
					</div>
				</div>
				<div class="blue-line"></div>
				<div class="full-gift">
					
				</div>
				<div class="item-table-line"></div>
			</div>`;
		}).join("");
		$(".cart-bottom-select").before(res);
	}

	function bg(son_check) {
		//              	console.log(son_check.is(":checked"));
		son_check.each(function() {
			if($(this).is(":checked")) {
				$(this).parents(".full-gift-item").css("background", "#FFF4E8");
			} else {
				$(this).parents(".full-gift-item").css("background", "#fff");
			}
		});
	}

	/*---------加减更新数据库------*/
	function cut(mthod, gid) {
		$.ajax({
			type: "get",
			url: "../api/Update.php",
			async: true,
			data: {
				"gid": gid,
				"mth": mthod,
				"time": new Date
			},
			success: (str) => {
				//							console.log(str);
			}
		});
	}

	/*---------------------------删除商品------------------------------*/
	function del(gid) {
		//					console.log(gid);
		$.ajax({
			type: "get",
			url: `../api/DeleteCart.php?time=${new Date}`,
			async: true,
			data: {
				"gid": gid
			},
			success: (str) => {
				console.log(str);
				var del = true;
				update(del);
			}
		});
	}

	function Cart() {
		//全局的checkbox选中和未选中的样式
		var $allCheckbox = $('input[type="checkbox"]'), //全局的全部checkbox
			$wholeChexbox = $('.whole_check'),
			$cartBox = $('.cartBox'), //每个商铺盒子
			$shopCheckbox = $('.shopChoice'), //每个商铺的checkbox
			$sonCheckBox = $('.son_check'); //每个商铺下的商品的checkbox				

		//===============================================全局全选与单个商品的关系================================
		$wholeChexbox.click(function() {
			var $checkboxs = $cartBox.parent().find('input[type="checkbox"]');
			if($(this).is(':checked')) {
				$checkboxs.prop("checked", true);
			} else {
				$checkboxs.prop("checked", false);
			}
			bg($(".son_check"));
			totalMoney();
		});

		$sonCheckBox.each(function() {
			$(this).click(function() {
				bg($(".son_check"));
				if($(this).is(':checked')) {
					//判断：所有单个商品是否勾选
					var len = $sonCheckBox.length;
					console.log(len);
					var num = 0;
					$sonCheckBox.each(function() {
						if($(this).is(':checked')) {
							num++;
						}
					});
					if(num == len) {
						$wholeChexbox.prop("checked", true);
					}
				} else {
					//单个商品取消勾选，全局全选取消勾选
					$wholeChexbox.prop("checked", false);
				}
			})
		})

		//======每个店铺checkbox与全选checkbox的关系/每个店铺与其下商品样式的变化=====================
		//店铺有一个未选中，全局全选按钮取消对勾，若店铺全选中，则全局全选按钮打对勾。
		$shopCheckbox.each(function() {
			$(this).click(function() {
				if($(this).is(':checked')) {
					//判断：店铺全选中，则全局全选按钮打对勾。
					var len = $shopCheckbox.length;
					var num = 0;
					$shopCheckbox.each(function() {
						if($(this).is(':checked')) {
							num++;
						}
					});
					if(num == len) {
						$wholeChexbox.prop("checked", true);
					}

					//店铺下的checkbox选中状态
					$(this).parents('.cartBox').find('.son_check').prop("checked", true);
				} else {
					//否则，全局全选按钮取消对勾
					$wholeChexbox.prop("checked", false);

					//店铺下的checkbox选中状态
					$(this).parents('.cartBox').find('.son_check').prop("checked", false);
				}
				totalMoney();
				bg($(".son_check"));
			});
		});

		//========================================每个店铺checkbox与其下商品的checkbox的关系======================================================

		//店铺$sonChecks有一个未选中，店铺全选按钮取消选中，若全都选中，则全选打对勾
		$cartBox.each(function() {
			var $this = $(this);
			var $sonChecks = $this.find('.son_check');
			$sonChecks.each(function() {
				$(this).click(function() {
					if($(this).is(':checked')) {
						//判断：如果所有的$sonChecks都选中则店铺全选打对勾！
						var len = $sonChecks.length;
						var num = 0;
						$sonChecks.each(function() {
							if($(this).is(':checked')) {
								num++;
							}
						});
						if(num == len) {
							$(this).parents('.cartBox').find('.shopChoice').prop("checked", true);
						}

					} else {
						//否则，店铺全选取消
						$(this).parents('.cartBox').find('.shopChoice').prop("checked", false);
					}
					totalMoney();
					bg($(".son_check"));
				});
			});
		});

		//======================商品数量===================
		var $plus = $('.increment'),
			$reduce = $('.decrement'),
			$all_sum = $('.itxt');
		$plus.click(function() {
			var gid = $(this).parents('.full-gift-item').attr("data-id");
			cut("add", gid);
			var $inputVal = $(this).prev('input'),
				$count = parseInt($inputVal.val()) + 1,
				$obj = $(this).parents('.quantity-form').find('.decrement'),
				$priceTotalObj = $(this).parents('.full-gift-item').find('.cost'),
				$price = $(this).parents('.full-gift-item').find('.price').html(), //单价
				$priceTotal = $count * parseInt($price.substring(1));
			$inputVal.val($count);
			$priceTotalObj.html('￥' + $priceTotal);
			if($inputVal.val() > 1 && $obj.hasClass('reSty')) {
				$obj.removeClass('reSty');
			}
			totalMoney();
		});

		$reduce.click(function() {
			var $inputVal = $(this).next('input'),
				$count = parseInt($inputVal.val()) - 1,
				$priceTotalObj = $(this).parents('.full-gift-item').find('.cost'),
				$price = $(this).parents('.full-gift-item').find('.price').html(), //单价
				$priceTotal = $count * parseInt($price.substring(1));
			if($inputVal.val() > 1) {
				var gid = $(this).parents('.full-gift-item').attr("data-id");
				cut("cut", gid);
				$inputVal.val($count);
				$priceTotalObj.html('￥' + $priceTotal);
			}
			if($inputVal.val() == 1 && !$(this).hasClass('reSty')) {
				$(this).addClass('reSty');
			}
			totalMoney();
		});

		$all_sum.keyup(function() {
			var $count = 0,
				$priceTotalObj = $(this).parents('.full-gift-item').find('.cost'),
				$price = $(this).parents('.full-gift-item').find('.price').html(), //单价
				$priceTotal = 0;
			if($(this).val() == '') {
				$(this).val('1');
			}
			$(this).val($(this).val().replace(/\D|^0/g, ''));
			$count = $(this).val();
			$priceTotal = $count * parseInt($price.substring(1));
			$(this).attr('value', $count);
			$priceTotalObj.html('￥' + $priceTotal);
			totalMoney();
		})

		//======================================移除商品========================================

		var $order_lists = null;
		var $order_content = '';
		$('.cancel').click(function() {
			$order_lists = $(this).parents('.full-gift-item');
			$order_content = $order_lists.parents('.full-gift');
			$('.model_bg').fadeIn(300);
			$('.my_model').fadeIn(300);
		});

		//关闭模态框
		$('.closeModel').click(function() {
			closeM();
		});
		$('.dialog-close').click(function() {
			closeM();
		});

		function closeM() {
			$('.model_bg').fadeOut(300);
			$('.my_model').fadeOut(300);
		}
		//确定按钮，移除商品
		$('.dialog-sure').click(function() {
			$gid = $order_lists.attr("data-id");
			del($gid);
			$order_lists.remove();
			if($order_content.html().trim() == null || $order_content.html().trim().length == 0) {
				del($gid);
				$order_content.parents('.cartBox').remove();
			}
			closeM();
			$sonCheckBox = $('.son_check');
			totalMoney();
		})

		//=========================总计================================

		function totalMoney() {
			var total_money = 0;
			var total_count = 0;
			var calBtn = $('#account');
			$sonCheckBox.each(function() {
				if($(this).is(':checked')) {
					var goods = parseInt($(this).parents('.full-gift-item').find('.cost').html().substring(1));
					var num = parseInt($(this).parents('.full-gift-item').find('.itxt').val());
					total_money += goods;
					total_count += num;
				}
			});
			$('.total_text').html('￥' + total_money);
			$('.piece_num').html(total_count);
			if(total_money != 0 && total_count != 0) {
				if(!calBtn.hasClass('btn_sty')) {
					calBtn.addClass('btn_sty');
				}
			} else {
				if(calBtn.hasClass('btn_sty')) {
					calBtn.removeClass('btn_sty');
				}
			}
		}
	}

});