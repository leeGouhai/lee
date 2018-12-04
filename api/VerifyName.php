<?php
	include "connection.php";
	$phone = isset($_POST['phone'])?$_POST['phone']:'';
	
	$sql = "SELECT * FROM user_inf WHERE u_phone = '$phone'";
	
    $result = $conn->query($sql);//结果集
    
    if($result->num_rows>0){//num_rows存记录的条数，所有超过0就意味着存在
	//数据库存在该用户名
		echo 0;//用户名已被占用
	}else{
		echo 1;
	}
	//关闭结果集和数据库
	$result->close();
	$conn->close();
?>