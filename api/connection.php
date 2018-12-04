<?php
//这是一个公共php文件(因为各接口创建连接的代码都是一样的)
$servername = 'localhost';
$username = 'root';
$password = '';
$dbaname = 'testbase';

//创建连接
$conn = new mysqli($servername,$username,$password,$dbaname);

//检测连接
if($conn->connect_error){
	die("连接失败:".$conn->connect_error);
}

 //查询前设置编码，防止输出乱码
    $conn->set_charset('utf8');
//echo '连接成功';
?>