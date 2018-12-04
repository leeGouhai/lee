<?php
	include "connection.php";
	$gid = isset($_GET["gid"])?$_GET["gid"]:"";
	
	$sql = "DELETE FROM form WHERE gid='$gid'";
	
	$res=$conn->query($sql);//返回布尔值，插入成功返回true，否则返回false
	if($res){
		//注册成功返回yes否则返回no
		echo 'yes';
	}else{
		echo 'no';
	}
	
	$conn->close();
?>