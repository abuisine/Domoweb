<?
$hostname = '192.168.0.200';
$port = 502;

if (! (isset($_REQUEST["id"]) and isset($_REQUEST["value"]))) {
	exit("Missing parameters: id or value");
}
$transaction_id = 0x0000;

function PDUWriteSingleRegister($reference_number, $data) {
	$function_code = 0x06;
	$pdu = pack("Cnn",
		$function_code,
		$reference_number,
		$data);
	return $pdu;
}

function PackAdu($transaction_id, $protocol_id, $unit_id, $pdu) {
	$adu = pack("nnnC",
		$transaction_id,
		$protocol_id,
		strlen($pdu) + 1,
		$unit_id);
	return $adu.$pdu;
}

$array = explode(".", $_REQUEST["id"]);
$id = array_pop($array);

$pdu = PDUWriteSingleRegister(0x8880 + intval($id), intval($_REQUEST["value"]));
$adu = PackAdu($transaction_id++, 0x0000, 0x00, $pdu);

//print_r(unpack("ntransaction_id/nprotocol_id/nlength/Cunit_id/Cfunction_id/nreference_number/nword_count/", $adu));
//print_r(unpack("H*", $adu));
//print("Go<BR>");

$s = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_connect($s, $hostname, $port);

socket_write($s, $adu, strlen($adu)); 

$header = socket_read($s, 7, PHP_BINARY_READ);
$array = unpack("ntransaction_id/nproto_id/nlength/Cunit_id/", $header);
$pdu = socket_read($s, $array["length"] - 1, PHP_BINARY_READ);
$array = unpack("Hfunction_id/nreference_number/n*data/",$pdu);
$dump [] = array('id' => $_REQUEST["id"], 'value' => $array['data1']);
print(json_encode(array('Registers' => $dump)));
socket_close($s);
?>
