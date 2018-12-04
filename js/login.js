$(function() {
	//记住密码,自动获取存在cookie里的账户
	$usn = Cookie.getCookie("usn");
	$(".ipt_text").val($usn);

	$(".ipt_text").on({
		focus: () => {
			$(".ipt_text_img").attr("src", "../img/Login/user_focus.png");
		},
		blur: () => {
			$(".ipt_text_img").attr("src", "../img/Login/user_blur.png");
		}
	});
	$(".ipt_password").on({
		focus: () => {
			$(".ipt_password_img").attr("src", "../img/Login/psw_focus.png");
		},
		blur: () => {
			$(".ipt_password_img").attr("src", "../img/Login/psw_blur.png");
		}
	});

	$(".ipt_btn").click(() => {
		$txtVal = $(".ipt_text").val().trim();
		$pswVal = $(".ipt_password").val().trim();
		//					console.log($txtVal, $pswVal);
		if($txtVal && $pswVal) {
			$.ajax({
				type: "post",
				url: "../api/Login.php",
				async: true,
				data: {
					"phone": $txtVal,
					"psw": $pswVal
				},
				success: (str) => {
					if(str * 1) { //账户密码正确
						check_box($txtVal);
						$("#msg").html("");
						location.href = "../index.html";
					} else {
						$("#msg").html("用户名或密码错误");
					}
				}
			});
		}
	});
	/*记住用户名*/
	function check_box(phone) {
		if($("#remember").prop('checked')) { //如果是选中状态,
			Cookie.setCookie('usn', phone, 7, '/'); //存放7天
		} else {
			Cookie.setCookie('usn', phone, -1, '/');
		}
	}

});