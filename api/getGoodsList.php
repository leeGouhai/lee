<?php
	include "Connection.php";
	$page = isset($_GET['page'])?$_GET['page']:'';
	$qty = isset($_GET['qty'])?$_GET['qty']:'';
	$mth = isset($_GET['mth'])?$_GET['mth']:'';
	$sort = isset($_GET['srt'])?$_GET['srt']:'';
//	echo $page;
    $page = ($page - 1)*$qty;
    if($mth && $sort){//如果为真,即表示是排序操作
    	if($sort == 'true'){
	        $lmt_sql = "SELECT * FROM goodslist ORDER BY $mth LIMIT $page,$qty";
        }
       if($sort == 'false'){
	        $lmt_sql = "SELECT * FROM goodslist ORDER BY $mth DESC LIMIT $page,$qty";
        }
    }else{
    	$lmt_sql = "SELECT * FROM goodslist LIMIT $page,$qty";//查询特定范围的数据
    }
    
    $ttl_sql = "SELECT * FROM goodslist";//查询所有数据,后面要用到由此计算出的数据总长度 count($total)
   
    //执行语句
    $ttl_res = $conn->query($ttl_sql);
    $lmt_res = $conn->query($lmt_sql);
    //把查询结果集转换为数组
    $ttl_arr = $ttl_res->fetch_all(MYSQLI_ASSOC);
    $lmt_arr = $lmt_res->fetch_all(MYSQLI_ASSOC);
    
    $ttl_res->close();
    $lmt_res->close();
    
    $alldata = array(
        "total" => count($ttl_arr),
        "limit" => $lmt_arr
    );
    echo json_encode($alldata,JSON_UNESCAPED_UNICODE);
    //关闭数据库,避免浪费
    $conn->close();
?>