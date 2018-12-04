<?php
	include "connection.php";
	
    $gid = isset($_GET["gid"])?$_GET["gid"]:"";
    $store = isset($_GET["store"])?$_GET["store"]:"";
	$qty = isset($_GET["qty"])?$_GET["qty"]:"";
	$imgurl = isset($_GET["imgurl"])?$_GET["imgurl"]:"";
	$price = isset($_GET["price"])?$_GET["price"]:"";
	$price_del = isset($_GET["price_del"])?$_GET["price_del"]:"";	
	$stock = isset($_GET["stock"])?$_GET["stock"]:"";
	$name = isset($_GET["name"])?$_GET["name"]:"";
	$size = isset($_GET["size"])?$_GET["size"]:"";
	$color = isset($_GET["color"])?$_GET["color"]:"";	
	
	$total = $qty*$price; 
	
	$sql1 = "SELECT * FROM form WHERE gid = '$gid'";
	
	$res1 = $conn->query($sql1);//结果集
	if($res1->num_rows>0){//num_rows存记录的条数，所有超过0就意味着存在
	    $sql = "UPDATE form SET qty=(qty+$qty),total=(total+$total) WHERE gid='$gid'";
	}else{
		$sql = "INSERT INTO form(gid,store,qty,imgurl,price,price_del,stock,name,size,color,total) VALUES('$gid','$store','$qty','$imgurl','$price','$price_del','$stock','$name','$size','$color','$total')"; 
	}
//	echo $gid;//g001       
	//执行语句
	$res=$conn->query($sql);//返回布尔值，插入成功返回true，否则返回false
	if($res){
		//注册成功返回yes否则返回no
		echo 'yes';
	}else{
		echo 'no';
	}
    
   //关闭结果集和数据库
	$res1->close();
    $conn->close();
	
?>