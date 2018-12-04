<?php
	include "connection.php";
	
	/*各种数据升降序的接口*/
	/*$sort表明查询方式是以降序还是升序*/
	/*$mth表明查询哪个字段*/
	$mth = isset($_GET['mth'])?$_GET['mth']:'';
	$sort = isset($_GET['srt'])?$_GET['srt']:'';
//	echo $sort;
    if($sort == 'true'){
	    $sql = "SELECT * FROM goodslist ORDER BY $mth";
    }
    if($sort == 'false'){
	    $sql = "SELECT * FROM goodslist ORDER BY $mth DESC";
    }
    
    //获取查询结果集
    $result = $conn->query($sql);
    //把查询结果集转换为数组
    $arr = $result->fetch_all(MYSQLI_ASSOC);
//  var_dump($arr);
//释放查询结果集,避免资源浪费
    $result->close();
   
//  //把结果数组转为字符串输出到前台
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

//  //关闭数据库,避免浪费
    $conn->close();
?>