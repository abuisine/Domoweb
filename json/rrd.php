<?php
$rows = array();
$row = array();
$rooms = split(',', $_REQUEST['fields']);
$morerooms = array_merge($rooms, array('request', 'heatermode'));
$roomid = 0;

function start($parser, $name, $attrs) {
	global $row, $roomid;
	switch ($name) {
		case "DATA":
			xml_set_character_data_handler($parser, "char");
			break;
		case "ROW":
			$row = array();
			$roomid = 0;
			break;
	}
}
function char($parser, $character) {
	global $char;
	$char = $character;
} 
function stop($parser, $name) {
	global $char, $rows, $row, $rooms, $morerooms, $roomid; 
	switch ($name) {
		case "DATA":
			xml_set_character_data_handler($parser, FALSE);
			break;
		case "T":
			$row = array_merge($row, array("name" => date("D H:m", $char)));
			break;
		case "V":
			if ($char == "NaN")
				$value = array("dataNULL" => $char);
			else {
				$value = array($morerooms[$roomid] => floatval($char));
			}
			$row = array_merge($row, $value);
			$roomid++;
			break;
		case "ROW":
			array_push($rows, $row);
			break;
	}
}

$parser = xml_parser_create("UTF-8");
xml_set_element_handler($parser,"start","stop");

foreach($rooms as $room) {
	$DEFS .= " DEF:".$room."=/volume1/web/domoweb/rrd/alias/".$room."/temp.rrd:temp:AVERAGE";
	$XPORTS .= " XPORT:".$room;
}
$DEFS .= " DEF:mode=/volume1/web/domoweb/rrd/src/heater/thermostat.rrd:mode:MAX DEF:request=/volume1/web/domoweb/rrd/src/heater/thermostat.rrd:request:AVERAGE";
$CDEFS = " CDEF:heatermode=mode,10,*";
$XPORTS .= " XPORT:request XPORT:heatermode";
exec("/usr/syno/bin/rrdtool xport --start now-1".$_REQUEST['backlog']." --end now --step ".$_REQUEST['step'].$DEFS.$CDEFS.$XPORTS, $data);
for($i = 0; $i < count($morerooms) + 1; $i++) {
	array_shift($data);
}
foreach($data as $line) {
	if (!xml_parse($parser, $line, FALSE)) {
	        die(sprintf("XML error: %s at line %d",
	            xml_error_string(xml_get_error_code($parser)),
	            xml_get_current_line_number($parser)));
	}
}
xml_parse($parser, "", TRUE);
xml_parser_free($parser);

print_r(json_encode($rows));

?>
