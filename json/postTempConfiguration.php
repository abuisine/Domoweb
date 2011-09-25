<?php
$file = "TempConfiguration.json";
header('Content-Type: application/json');

$general = array();
$rooms = array();
foreach($_REQUEST as $key => $value) {
	list($cat, $id) = explode('_', $key, 2);
	if ($cat == "general")
		$general[$id] = $value;
	if ($cat == "rooms") {
		array_push($rooms,array('id' => $id, 'status' => $value));
	}
}
$conf = array();
$conf["general"] = array($general);
$conf["rooms"] = $rooms;
$f = fopen($file, 'w');
fwrite($f, json_encode($conf));
fclose($f);
echo json_encode(array("success" => true, "msg" => 'This User is authorized'));
?>
