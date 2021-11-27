// Main
app.controller('mainCtrl', function ($scope, $http)
{
    $scope.initMap = function ()
    {
        $scope.map = L.map('map').setView([45.39172297076271, -122.8101657981665], 11);
        $scope.sidebar = L.control.sidebar('sidebar').addTo($scope.map);
        $scope.sidebar.open("home");

        $scope.OR911_MAP = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
	$scope.OR911_MAP.addTo($scope.map);

	$scope.cfg = {
	  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
	  // if scaleRadius is false it will be the constant radius used in pixels
	  "radius": 0.008,
	  "maxOpacity": .8,
	  // scales the radius based on map zoom
	  "scaleRadius": true,
	  // if set to false the heatmap uses the global maximum for colorization
	  // if activated: uses the data maximum within the current map boundaries
	  //   (there will always be a red spot with useLocalExtremas true)
	  "useLocalExtrema": true,
	  // which field name in your data represents the latitude - default "lat"
	  latField: 'lat',
	  // which field name in your data represents the longitude - default "lng"
	  lngField: 'lng',
	  // which field name in your data represents the data value - default "value"
	  valueField: 'count'
	};

	$scope.heatmapLayer = new HeatmapOverlay($scope.cfg);
	$scope.map.addLayer($scope.heatmapLayer);
    };

    $scope.HeatUpTheMap = function()
    {
	var heatMapData = {
  		data: $scope.GPSData
	};

	$scope.heatmapLayer.setData(heatMapData);
    }

    $scope.AddRadiusMarker = function()
    {
	var latlng = $scope.map.getCenter();
	if ($scope.MarkerFilter === undefined)
	{
        	$scope.MarkerFilter = new L.marker(latlng, {draggable:'true'});
        	$scope.map.addLayer($scope.MarkerFilter);
        }
	else
	{
		$scope.MarkerFilter.setLatLng(latlng);
	}
    }

    $scope.ApplyRangeFilter = function()
    {
	if ($scope.MarkerFilter !== undefined)
	{
		var currentMarkerLatLng = $scope.MarkerFilter.getLatLng();
		var currentRadiusInMiles = $scope.distance;

		console.log(currentMarkerLatLng);
		console.log(currentRadiusInMiles);
    	}
	else
	{
		console.log("Error no marker defined");
	}
     }

    $scope.init = function (standalone)
    {
	$scope.initMap();

	// Let's download the GPS data from our api.
        $http.get("./api/Get/Incidents/Gps/", {timeout: 5000}).then(function (response)
        {
		$scope.GPSData = response.data;
		$scope.HeatUpTheMap();
	});
	$scope.distance = 0;
    };
});

