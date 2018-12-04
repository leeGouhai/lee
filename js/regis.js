$(function() {

	/*------------(先)正则验证——>(后)数据库验证--------------------*/
	//触发(多个事件绑定同一个函数)
	$("#phone").on("keyup blur", () => {
		RegName();
	});
	//账号正则验证函数
	var isok1 = false;

	function RegName() {
		$val = $("#phone").val().trim();
		$(".tip_phone").css("display", "block");
		if(checkReg.tel($val)) { //不为空且符合正则
			VerifyName($val);
		} else {
			isok1 = false;
			tip(".tip_phone", 0);
		}
	}
	//api接口(是否可注册)函数				
	function VerifyName(value) {
		$.ajax({
			type: "post",
			url: "../api/VerifyName.php",
			async: true,
			data: {
				"phone": value,
			},
			success: (str) => {
				if(str * 1) {
					isok1 = true;
					tip(".tip_phone", 1);
					$(".warn_word").html("该手机号可以注册");
				} else {
					isok1 = false;
					tip(".tip_phone", 0);
					$(".warn_word").html("该手机号已被注册");
				}
			}
		});
	}
	/*-------------------------校验码---------------------------*/
	//生成随机数
	Random();
	$(".code").click(Random);

	function Random() {
		$rndNum = parseInt(Math.random().toFixed(4) * 9000 + 1000);
		$(".code").html($rndNum);
	}
	//触发
	var isok2 = false;
	$("#code").keyup(checkRnd);

	function checkRnd() {
		$(".tip_code").css("display", "block");
		$num = $("#code").val().trim();
		$rnd = $(".code").html();
		if($num == $rnd) {
			isok2 = true;
			tip(".tip_code", 1);
		} else {
			isok2 = false;
			tip(".tip_code", 0);
		}
	}

	/*--------------------密码、确认密码--------------------------*/

	$("#psw").on("blur keyup", () => {
		checkPsw();
	});
	var isok3 = false;

	function checkPsw() {
		$(".tip_psw").css("display", "block");
		$psw = $("#psw").val().trim();
		if(checkReg.pwd_easy($psw)) { //如果密码符合正则,才会执行确认密码部分
			isok3 = true;
			tip(".tip_psw", 1);
			$("#confirm").on("blur keyup", () => {
				confirmPsw($psw);
			});
		} else {
			isok3 = false;
			tip(".tip_psw", 0);
		}
	}
	var isok4 = false;

	function confirmPsw(psw) { //确认密码
		$(".tip_conf").css("display", "block");
		$pswAgain = $("#confirm").val().trim(); //变量名最好不要有重复
		if($pswAgain === psw) { //如果确认密码成功
			isok4 = true;
			tip(".tip_conf", 1);
		} else {
			isok4 = false;
			tip(".tip_conf", 0);
		}
	}
	/*------------------------注册------------------------------*/
	$(".submit_button").click(Reg);

	function Reg() {
		RegName();
		checkRnd();
		checkPsw();
		var arr = [isok1, isok2, isok3, isok4];
		var bln = arr.every(function(item) {
			return item == true;
		});
		if(bln) { //如果全部通过验证,就可以插入数据
			//						console.log($val,$pswAgain);
			insert($val, $pswAgain);
		} else {
			$(".warn_word").html("请注意输入格式");
		}
	}
	//插入数据接口
	function insert(phone, psw) {
		$.ajax({
			type: "post",
			url: "../api/Register.php",
			async: true,
			data: {
				"phone": phone,
				"psw": psw,
				"time": new Date
			},
			success: (str) => {
				if(str * 1) {
					$("#phone").val(""); //时间参数清空缓存不能百分百确保避免两次插入同样数据
					$(".warn_word").html("注册成功");
				} else {
					$(".warn_word").html("注册失败");
				}

			}
		});
	}

	/*---------------------------------------------------------*/
	//提示函数
	function tip(tipName, flag) {
		if(flag) {
			$(tipName).attr("src", "../img/Register/right_tag.png");
		} else {
			$(tipName).attr("src", "../img/Register/error_tag.png");
		}
	}

});