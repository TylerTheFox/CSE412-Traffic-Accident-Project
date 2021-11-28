<?php
$files = array
    (
    './js/jquery-3.6.0.min.js',
    './js/angular.min.js',
    './js/angular-animate.min.js',
    './js/angular-aria.min.js',
    './js/angular-messages.min.js',
    './js/angular-material.min.js',
    './js/heatmap.js',
    './js/leaflet.js',
    './js/sidebar/leaflet-sidebar.js',
    './js/leaflet.draw.js',
    './js/L.Popup.Angular.js',
    './js/leaflet-heatmap.js',
    './js/AGENCY/app.js',
    './js/AGENCY/map.js'
);

// Cache control, find newest file.
$newestFile = 0;
$curr;
foreach ($files as &$file) {
    $curr = filemtime($file);
    if ($curr > $newestFile) {
        $newestFile = $curr;
    }
}

// Lets try and not load the stuff into memory.
header("Cache-Control: must-revalidate");
$tsstring = gmdate('D, d M Y H:i:s ', $newestFile) . 'GMT';
$if_modified_since = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false;
$if_none_match = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? $_SERVER['HTTP_IF_NONE_MATCH'] : false;


if ($if_modified_since) {
    if ($if_modified_since == $tsstring) {
        // Good we're in date.
        header('HTTP/1.1 304 Not Modified');
        exit;
    }
}

// We're either not in date or the date isn't set.
// So we need to load the files into memory to checksum them.

$bin = "";
// Load files in memory.
foreach ($files as &$file) {
    $bin .= file_get_contents($file) . "\n";
}

// Get MD5 from string, and check if we match.
$etag = md5($bin);
if ($if_none_match == $etag) {
    header('HTTP/1.1 304 Not Modified');
    exit;
}

// Well nothing seems to be cached, so lets send all the raw data.
header("Last-Modified: " . $tsstring);
header("Etag: $etag");
header('Content-Type: application/javascript');
header('Content-Encoding: gzip');
$gzipoutput = gzencode($bin, 9);
header('Content-Length: ' . strlen($gzipoutput));
echo($gzipoutput);
exit;
