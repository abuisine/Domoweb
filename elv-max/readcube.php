<HTML>
<?
$hostname = "192.168.0.23";
$port = 80;

$cube = array();
$config = array();
$devices= array();

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
	$message = bin2hex($message);
	$pack = str_split($message, 32);
	$d = array();
	foreach($pack as $line) {
		print("DDD|".$line."|DDD");
		if (strlen($line) == 16) {
			print($line);
			sscanf($line, "%2s%6s%2s%2s%2s%2s%2s%4s%2s",
				$d['A'],
				$d['rf_address'],
				$d['B'],
				$d['return_code'],
				$d['status'],
				$d['current_temp'],
				$d['set_temp'],
				$d['date_until'],
				$d['time_until']);
			//$d['current_temp'] = hexdec($d['current_temp'])/2;
			//$d['set_temp'] = hexdec($d['set_temp'])/2;
			$devices[$d['rf_address']] = $d;
		}
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
print_r($devices);
socket_close($s);
?>
</HTML>
