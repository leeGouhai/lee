<?php
	include "connection.php";
	
	$phone = isset($_POST['phone'])?$_POST['phone']:'';
	$psw = isset($_POST['psw'])?$_POST['psw']:'';
//	echo $psw;
   $sql = "select * from user_inf where u_phone='$phone' and password='$psw'";
   //获取查询结果集
   $result = $conn->query($sql);

   //通过判断结果集中的数量，是否查询到结果
   if($result->num_rows>0){
  //如果结果集数量大于0,则证明在数据库查询到了这条数据
	echo 1;//密码正确
    }else{
	echo 0;//密码不正确
}
?>