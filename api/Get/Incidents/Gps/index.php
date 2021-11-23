<?PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once("../../../../config.php");

$con = pg_connect("host=$hostname dbname=$database user=$username password=$password") or die ("Could not connect to server\n");

$query = "SELECT latitude, longitude FROM public.incident";

$ret = pg_query($con, $query) or die("Cannot execute query: $query\n");
$myarray = pg_fetch_all($ret);

print(json_encode($myarray));
exit();
?>
