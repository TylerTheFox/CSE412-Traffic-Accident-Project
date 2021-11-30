<?PHP
require_once("../../../config.php");

$con = pg_connect("host=$hostname dbname=$database user=$username password=$password") or die ("Could not connect to server\n");

$query = "SELECT latitude, longitude FROM public.station WHERE county != 'M'";

$ret = pg_query($con, $query) or die("Cannot execute query: $query\n");
$myarray = pg_fetch_all($ret);

print(json_encode($myarray, JSON_NUMERIC_CHECK));
exit();
?>
