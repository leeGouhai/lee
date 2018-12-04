<?php
	include "connection.php";
	
	$phone = isset($_POST['phone'])?$_POST['phone']:'';
	$password = isset($_POST['psw'])?$_POST['psw']:'';
//	echo $mth;
    
    $sql = "INSERT INTO user_inf(u_phone,`password`) VALUES('$phone','$password');";
    $result = $conn->query($sql);//返回布尔值，插入成功返回true，否则返回false
    if($result){
		echo 1;//插入成功
	}else{
		echo 0;
	}
	
//	$result->close();//没有打开结果集 所以不用关闭
    //关闭数据库
	$conn->close();
?>