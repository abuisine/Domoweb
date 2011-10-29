<HTML>
<?
$hostname = "192.168.0.23";
$port = 80;

$cube = array();
$config = array();
$devices= array();

function array_print($array) {
	print("<TABLE BORDER=1><TR>\n");
	foreach($array as $k => $v) {
		if (is_array($v)) {
			print("<TD><TABLE BORDER=1><TR><TD ROWSPAN=".(count($v)+1).">".$k."</TD></TR>\n");
			foreach($v as $vk => $vv) {
				print("\t<TR><TD>".$vk."</TD><TD>".$vv."</TD></TR>\n");	
			}	
			print("</TR></TABLE>");
		} else 
			print("</TR><TD>".$k."</TD><TD>".$v."</TD><TR>\n");	
	}
	print("</TR></TABLE></BR>\n");
} 

function elv_message_parse($message) {
	$pack = split(":", $message, 2);
	switch ($pack[0]) {
		case 'H':
			elv_mp_H($pack[1]);
			break;
		case 'M':
			elv_mp($pack);
			break;
		case 'C':
			elv_mp_C($pack[1]);
			break;
		case 'L':
			elv_mp_L($pack[1]);
			break;
	};
}

function elv_mp_H($message) {
	global $cube;
	list($cube['serial'], $cube['rf_address'], $cube['version'], $cube['A'], $cube['B'], $cube['C'], $cube['D']) = split(",", $message, 7);
}

function elv_mp_L($message) {
	global $devices;
	$pack = str_split(bin2hex(base64_decode($message)), 24);
	$d = array();
	foreach($pack as $line) {
		sscanf($line, "%2s%6s%2s%2s%2s%2s%2s%4s%2s",
			$d['A'],
			$d['rf_address'],
			$d['B'],
			$d['return_code'],
			$d['status'],
			$d['valve_percent'],
			$d['set_temp'],
			$d['date_until'],
			$d['time_until']);
		$d['valve_percent'] = hexdec($d['valve_percent']);
		$d['set_temp'] = hexdec($d['set_temp']) / 2.0;
		$devices[$d['rf_address']] = $d;
	}
}

function elv_mp_C($message) {
	global $config;
	$dp = array();
	list($address, $payload) = split(",", $message, 2);
	$pack = bin2hex(base64_decode($payload));
	sscanf($pack,
		"%2s%6s%1s%20s%s",
		$dp['A'],
		$dp['rf_address'],
		$dp['type'],
		$dp['serial'],
		$null);
	$config[$address] = $dp;
}

function elv_mp($message) {
	//print_r($message);
	//print("<BR>");
}

$s = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_connect($s, $hostname, $port);

$count = 0;
while(TRUE) {
	$buf = socket_read($s, 4096, PHP_NORMAL_READ);
	elv_message_parse($buf);
	$count++;
	if ($buf[0] == "L")
		break;
}
array_print($cube);
array_print($devices);
socket_close($s);
?>
</HTML>
