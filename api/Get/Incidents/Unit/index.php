<?PHP
require_once("../../../../config.php");

$con = pg_connect("host=$hostname dbname=$database user=$username password=$password") or die ("Could not connect to server\n");

if (!isset($_GET['incident']))
{
    exit("[]");
}

$myIncident = $_GET['incident'];
$result = pg_prepare($con, "myIncidentStmt", 'SELECT dispatched, enroute, onscene, clear FROM public.incidentunit WHERE fk_incidentid = $1');
$result = pg_execute($con, "myIncidentStmt", array($myIncident));
$myarray = pg_fetch_all($result);
print(json_encode($myarray, JSON_NUMERIC_CHECK));
exit();
?>
