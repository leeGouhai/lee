


/*-------------------------不要使用整理代码格式功能,不然会使代码出错------------*/
/*
		步骤：一定要掌握的版本
			1.把所有的图片放在右侧，第一个图片放到可视区
			2.开定时器：每次轮播一个图
			3.焦点跟随
			4.点击上下按钮可以切图
			5.点击焦点可以跳转
	
	 */

//1.把所有的图片放在右侧，第一个图片放到可视区
//获取图片宽度
//---------------------------轮播图——1------------------------------------------------------
/*---一图一屏,一次移一图*/
//参数：最外层容器,单张图片的宽度,图片容器,焦点容器,切图间隔,左按钮,右按钮
function slide_1(container, iw, wraper, point, interval, btnL, btnR) {
	var iW = iw; //JS offsetwidth
	$(wraper).css('left', iW);
	$(wraper).eq(0).css('left', 0);

	//2.开定时器：每次轮播一个图
	var timer = null;
	clearInterval(timer);
	var now = 0;

	timer = setInterval(next, interval); //每隔2秒钟切换一个图

	function next() {
		//旧的挪走
		$(wraper).eq(now).animate({
			'left': -iW
		}, 1000);
		now = ++now >= $(wraper).size() ? 0 : now;
		//新的快速放在右侧，再挪进可视区
		$(wraper).eq(now).css('left', iW);
		$(wraper).eq(now).animate({
			'left': 0
		}, 1000);
		light();
	}

	//3.焦点跟随
	function light() {
		$(point).removeClass('active');
		$(point).eq(now).addClass('active');
	}

	function prev() {
		//从左侧切入到可视区
		//旧的挪到右侧
		$(wraper).eq(now).animate({
			'left': iW
		}, 1000);
		//新的
		now = --now < 0 ? $(wraper).size() - 1 : now;
		$(wraper).eq(now).css('left', -iW);
		$(wraper).eq(now).animate({
			'left': 0
		}, 1000);
		light();
	}

	//4.点击上下按钮可以切图:如果是渲染出来的数据，记得用事件委托来绑定

	//鼠标经过停止，鼠标离开继续运动
	$(container).hover(function() {
		clearInterval(timer);
	}, function() {
		clearInterval(timer);
		timer = setInterval(next, interval);
	});

	//点击切换到上一张
	$(btnL).click(function() {
		prev();
	});

	//点击切换到下一张
	$(btnR).click(function() {
		//下一张
		next();
	});

	//5.点击焦点可以跳转

	$(point).click(function() {
		//旧 ：now
		//新：index() 新的
		var index = $(this).index();
		if(index > now) {
			//从右边切入
			//旧 now：挪到左边
			$(wraper).eq(now).animate({
				'left': -iW
			}, 1000);
			//新的
			$(wraper).eq(index).css('left', iW);
			$(wraper).eq(index).animate({
				'left': 0
			}, 1000);
			now = index; //最新的一张变成index

		}
		if(index < now) {
			//从左边切入
			//旧 now：挪到左边
			$(wraper).eq(now).animate({
				'left': iW
			}, 1000);
			//新的
			$(wraper).eq(index).css('left', -iW);
			$(wraper).eq(index).animate({
				'left': 0
			}, 1000);
			now = index; //最新的一张变成index
		}

		light();
	});
}

//---------------------------轮播图——2------------------------------------------------------
/*
	原理：出去一张，减掉拼接到尾部(核心)
	
	1.开启定时器，让ul往左边运动
	2.出去一张，就快速减掉拼接到尾部，ul归位
	3.点击上下按钮可以切换
*/
/*---四图一屏,一次移一图---*/
//参数：最外层容器,单张图片宽度,运动的元素,切图间隔,左按钮,右按钮
function slide_2(container, iw, move, interval, btnL, btnR) {
	var iW = iw;

	//1.开启定时器，让ul往左边运动
	var timer = null;
	clearInterval(timer);
	timer = setInterval(next, interval); //间隔2秒切一个图

	function next() {
		//ul往左边运动一个图片距离：1000毫秒运动时间，匀速的
		$(move).animate({
			'left': -iW
		}, 500, 'linear', function() {
			//回调：出去一张，就快速减掉拼接到尾部
			$(move + ' li:first').insertAfter($(move + ' li:last'));
			//ul归位
			$(move).css('left', 0);
		});
	}

	function prev() {
		//把最后一张剪切作为ul的第一张
		$(move + ' li:last').insertBefore($(move + ' li:first'));
		//ul要给最后一张预留位置：隐藏在左侧 -iW
		$(move).css('left', -iW);
		//把最后一张挪进可视区
		$(move).animate({
			'left': 0
		}, 500, 'linear');
	}

	//3.点击上下按钮可以切换

	$(container).hover(function() {
		clearInterval(timer);
	}, function() {
		clearInterval(timer);
		timer = setInterval(next, interval); //间隔2秒切一个图
	});

	//点击下一张
	$(btnR).click(function() {
		next();
	});

	//点击上一张
	$(btnL).click(function() {
		prev();
	});
}

//-------------------------------轮播图——3------------------------------------
/*---四图一屏,一次移四图---*/
/*
 	原理：每次运动4个图距离，运动出去的图片，剪切拼接到末尾
 	
 	1、ul的宽度：图片的宽度*图片个数
 	2、开定时器，每次运动4个图距离，往左边运动：-4*iW
 	3、出去的图片剪切拼接到后面
 	4、上下按钮可以点击切换
 	
 */

//1、ul的宽度：图片的宽度*图片个数
//参数：最外层容器,运动元素,单张图片的宽度,每次移动的图片数量,切图间隔,左按钮,右按钮
function slide_3(container, move, liW, imgNum, interval, btnL, btnR) {
	var wNum = $(move + ' li').size() * $(move + ' li').eq(0).outerWidth();
	$(move).css('width', wNum);
	var iW = liW * imgNum; //运动距离

	//2、开定时器，每次运动4个图距离，往左边运动：-4*iW
	var timer = null;
	clearInterval(timer);
	timer = setInterval(next, interval); //间隔时间

	function next() { //动画时间间隔：5000-2000
		$(move).animate({
			'left': -iW
		}, 2000, function() {
			//出去的图片，剪切放到末尾
			$(move+' li:lt('+imgNum+')').insertAfter($(move+' li:last'));
			//ul归位
			$(move).css('left', 0);
		});
	}

	function prev() {
		//先剪切最后的四个图插入到ul首位
		for(var i = 0; i < imgNum; i++) {
			$(move+' li:last').insertBefore($(move+' li:first'));
		}
		//预留4个图位置
		$(move).css('left', -iW);
		//挪到可视区
		$(move).animate({
			'left': 0
		}, 2000);
	}

	//3、上下按钮可以点击切换
	$(container).hover(function() {
		clearInterval(timer);
	}, function() {
		clearInterval(timer);
		timer = setInterval(next, 2000); //间隔2秒切一个图
	});

	//点击切换下一页：四张图
	$(btnR).click(function() {
		next();
	});

	$(btnL).click(function() {
		prev();
	});
}

/*--------------------------正则、cookie封装----------------------------*/
/*正则封装*/
var checkReg = {
	trim: function(str) { //剪掉前后空格
		var reg = /^\s*|\s*$/g; //空格
		return str.replace(reg, ''); //返回字符串
	},
	username: function(str) { //账号正则验证
		//字母开头，允许5-16字节，允许字母数字下划线
		var reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
		return reg.test(str); //返回布尔值
	},
	chinese: function(str) { //中文
		var reg = /^[\u2E80-\u9FFF]+$/;
		return reg.test(str);
	},
	email: function(str) { //邮箱
		var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		return reg.test(str);
	},
	identity: function(str) { //身份证
		var reg = /^(\d{17}|\d{14})[\dX]$/;
		return reg.test(str);
	},
	tel: function(str) { //手机号码
		var reg = /^1[3-9]\d{9}$/;
		return reg.test(str);
	},
	birthday: function(str) { //生日
		var reg = /^\d{4}-\d{1,2}-\d{1,2}/;
		return reg.test(str);
	},
	pwd_easy: function(str) { //弱密码
		//以字母开头，长度在6~10之间，只能包含字母、数字和下划线
		var reg = /^[a-zA-Z]\w{5,9}$/;
		return reg.test(str);
	},
	pwd_strong: function(str) { //强密码
		//必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间
		var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
		return reg.test(str);
	},
	confirm_pwd: function(str1, str2) { //确认密码
		return(str1 === str2);
	}
};
/*CooKie封装*/
var Cookie = {
	setCookie: function(cookieName, cookieValue, date, path) {
		// 包装数据
		var data = {
			"val": cookieValue
		}
		// 编码
		//		var str = cookieName + "=" + encodeURIComponent(JSON.stringify(data));
		var str = cookieName + "=" + cookieValue;
		if(date) {
			var dt = new Date();
			dt.setDate(dt.getDate() + date);
			str += ";expires=" + dt.toGMTString();
		}
		if(path) {
			str += ";path=" + path;
		}
		return(document.cookie = str);
	},
	getCookie: function(cookieName) {
		//		var str = decodeURIComponent(document.cookie);//str="b={"val":2}; c=3; a=1"
		var str = document.cookie; // str = "name=leeGouhai; psw=lee123"
		var arr = str.split("; "); // arr = ["b=2","c=3","a=1"]
		var len = arr.length;
		for(var i = 0; i < len; i++) {
			var str = arr[i]; //str = "name=leeGouhai"
			var ind = str.indexOf("=");
			var _name = str.substring(0, ind); // 获取 name
			var _value = str.substring(ind + 1); //获取leeGouhai;
			if(cookieName == _name) {
				//				return JSON.parse(_value).val;
				return _value; //leeGouhai
			}
		}
	}
}

/*---------------------------------------------------------*/
function btnthumb(parentThumb, parentMain) {
	var thumbs = parentThumb.find('li');
	var mains = parentMain.find('a');
	/*console.log(thumbs);//获取节点要在生成节点之后*/
//	thumbs[0].classList.add('active');
//	mains[0].classList.add('active');
	for(let i = 0; i < mains.length; i++) {
		thumbs[i].onmouseover = function() {
			for(var j = 0; j < mains.length; j++) {
				thumbs[j].classList.remove('active');
				mains[j].classList.remove('active');
			}
			thumbs[i].classList.add('active');
			mains[i].classList.add('active');
//			now = i;
		}
	}
}

function btn_thumb(parentThumb, parentMain) {
	var thumbs = parentThumb.find('li');
	var mains = parentMain.find('a');
	/*console.log(thumbs);//获取节点要在生成节点之后*/
	thumbs[0].classList.add('active');
	mains[0].classList.add('active');
	
		for(let i = 0; i < mains.length; i++) {
			thumbs[i].onmouseover = function() {
				for(var j = 0; j < mains.length; j++) {
					thumbs[j].classList.remove('active');
					mains[j].classList.remove('active');
				}
				thumbs[i].classList.add('active');
				mains[i].classList.add('active');
				now = i;
			}
		}
		//点击左右按钮
	var btnL = document.getElementById('toleft');
	var btnR = document.getElementById('toright');
	var now = 0;

	function next() {
		for(var j = 0; j < mains.length; j++) {
			thumbs[j].classList.remove('active');
			mains[j].classList.remove('active');
		}
		thumbs[now].classList.add('active');
		mains[now].classList.add('active');
	}
	btnR.onclick = () => {
		now++;
		if(now > mains.length - 1) {
			now = 0;
		}
		next();
	}
	btnL.onclick = () => {
		now--;
		if(now < 0) {
			now = mains.length - 1;
		}
		next();
	}
}

//选择尺码、颜色
function btnPick(parentSize, parentColor) {
	var sizes = parentSize.find('dd');
	var colors = parentColor.find('dd');
	//					console.log(sizes);
	sizes[0].classList.add('select');
	colors[0].classList.add('select');
	for(let i = 0; i < sizes.length; i++) {
		sizes[i].onclick = function() {
			for(var j = 0; j < sizes.length; j++) {
				sizes[j].classList.remove('select');
			}
			sizes[i].classList.add('select');
		}
	}

	for(let i = 0; i < colors.length; i++) {
		colors[i].onclick = function() {
			for(var j = 0; j < colors.length; j++) {
				colors[j].classList.remove('select');
			}
			colors[i].classList.add('select');
		}
	}
}



