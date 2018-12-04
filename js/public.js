/*------------------------------页面公共部分代码----------------------------------------------*/
$(function() {
	/*------------------侧边栏点击回到顶部--------------------------------*/
	$(".rtbar-rocket").click(function() {
		var timer = setInterval(function() {
			var scrollTop = window.scrollY; //实时获取参数
			if(scrollTop > 0) { //还没回到顶部
				window.scrollTo(0, scrollTop - 120);
			} else {
				clearInterval(timer);
			}
		}, 30);
	});

	/*---------------顶部状态栏下拉菜单-------------*/
	$(".dropdown").on("click", "a", function(event) {
		$(this).parent().siblings().filter(".dropdown").children().filter(".dropdown-menu").hide();
		$(this).next().toggle("normal");
		$(document).on("click", function(event) {
			$(".dropdown-menu").hide();
		});
		event.stopPropagation();
	});
	/*-------------------商品分类下拉菜单----------------------*/
	$(".nav .category").click(function() {
		$(".category-dropdown ").slideToggle("slow");
	});

	//二级菜单
	$(".category-menus ul li").hover(function() {
		$index = $(this).index();
		$(this).addClass("selected");
		$(this).find(".pannel").css("display", "block");
		$(this).find(".pannel").css("top", function() {
			return(-$index * 40);
		});
	}, function() {
		$(this).removeClass("selected");
		$(this).find(".pannel").css("display", "none");
	});

	/*-------------------鼠标滑过侧边栏--------------------------------*/
	//登陆状态栏
	$(".rtbar-avatar").hover(function() {
		$(this).find(".rtbar-mbrcenter").toggle();
	});

	//各项功能提示栏
	$(".rtbar-tab").hover(function() {
		$(this).find(".rtbar-hint").css("display", "block");
		$(this).find(".rtbar-hint").stop().animate({
			right: "35px",
			opacity: "1"
		});
	}, function() {
		$(this).find(".rtbar-hint").stop().animate({
			right: "75px",
			opacity: "0"
		});
		$(this).find(".rtbar-hint").css("display", "none");
	});
	
	
	
	

});