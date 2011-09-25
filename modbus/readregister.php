<?
// E4200 = 0x8880 length 80
// E1212 = 0x0011 length 16
$hostname = '192.168.0.200';
$port = 502;

if (! (
	isset($_REQUEST["ip"])
	and isset($_REQUEST["function"])
	and isset($_REQUEST["base"])
	and isset($_REQUEST["offset"])
	and isset($_REQUEST["length"])
)) {
	exit("Missing parameters, you must provide : ip, function, base, offset, length"); 
}

$transaction_id = 0x0000;

function PDUReadMultipleRegisters($reference_number, $word_count) {
	$function_code = hexdec($_REQUEST["function"]);
	$pdu = pack("Cnn",
		$function_code,
		$reference_number,
		$word_count);
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

$pdu = PDUReadMultipleRegisters(hexdec($_REQUEST["base"]) + intval($_REQUEST["offset"]), intval($_REQUEST["length"]));
$adu = PackAdu($transaction_id++, 0x0000, 0x00, $pdu);

#print_r(unpack("ntransaction_id/nprotocol_id/nlength/Cunit_id/Cfunction_id/nreference_number/nword_count/", $adu));
#print_r(unpack("H*", $adu));
#print("Go<BR>");
$s = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_connect($s, $_REQUEST["ip"], $port);

socket_write($s, $adu, strlen($adu)); 
$header = socket_read($s, 7, PHP_BINARY_READ);
$array = unpack("ntransaction_id/nproto_id/nlength/Cunit_id/", $header);
$pdu = socket_read($s, $array["length"] - 1, PHP_BINARY_READ);
$array = unpack("Hfunction_id/Clength/n*modbus./",$pdu);
for($i = 1; $i <= ($array['length'] / 2); $i++) {
	$dump [] = array('id' => 'modbus.'.($i - 1 + $_REQUEST["offset"]), 'value' => $array['modbus.'.$i]);	
}
print(json_encode($dump));
socket_close($s);
?>
