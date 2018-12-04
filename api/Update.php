<?php
	include "connection.php";
	
	$gid = isset($_GET["gid"])?$_GET["gid"]:"";
	$mth = isset($_GET["mth"])?$_GET["mth"]:"";
	
	if($mth == "cut"){
		$sql = "UPDATE form SET qty=(qty-1),total=(qty*price) WHERE gid='$gid'";
	}
	if($mth == "add"){
		$sql = "UPDATE form SET qty=(qty+1),total=(qty*price) WHERE gid='$gid'";
	}
	
	//执行语句
	$result = $conn->query($sql);//返回布尔值，插入成功返回true，否则返回false
	
	if($result){
		//更新成功返回yes否则返回no
		echo 'yes';
	}else{
		echo 'no';
	}
    
   //关闭数据库,避免浪费
    $conn->close();
?>