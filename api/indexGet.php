<?php
	include "connection.php";
	
	$imgtype = isset($_GET["imgtype"])?$_GET["imgtype"]:"";
//	echo $imgtype;
	$sql = "SELECT * FROM indexlist WHERE imgtype='$imgtype'";
	
	$result = $conn->query($sql);
    
    //把查询结果集转换为数组
    $arr = $result->fetch_all(MYSQLI_ASSOC);
    
  //释放查询结果集,避免资源浪费
    $result->close();
      
  //把结果数组转为字符串输出到前台
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

  
  //关闭数据库,避免浪费
    $conn->close();
?>