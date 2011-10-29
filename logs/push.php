<?php
$file = "logs.pjson";

$log = array('id' => uniqid(), 'category_id' => $_REQUEST['id'], 'utc' => gmdate('U'), 'category' => $_REQUEST['category'], 'desc' => $_REQUEST['desc']);
$f = fopen($file, 'r+');
$ret = fread($f, filesize($file));
$logs = json_decode($ret);
if ($logs == null)
	$logs = array($log);
else
	array_push($logs,$log);
$json = json_encode($logs);
rewind($f);
ftruncate($f, 0);
fwrite($f, $json);
fclose($f);
echo $json;
?>
