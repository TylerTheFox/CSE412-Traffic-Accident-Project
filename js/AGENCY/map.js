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
	  "radius": 0.004,
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
	if ($scope.CircleFilter === undefined)
	{
		$scope.CircleFilter = L.circle(latlng, {radius: 10000});
		//$scope.CircleText = L.tooltip({permanent:true,direction:'bottom',opacity:0.9,className:'text'});
		var radius = Math.floor($scope.CircleFilter.getRadius()*0.000621371);
		var radiusText = `${radius} miles`;
		//var bounds = $scope.CircleFilter.getBounds().getCenter();
		//var lat = $scope.CircleFilter.getLatLng().lat-10;
		//var lon = $scope.CircleFilter.getLatLng().lng-10;
		var point = L.point([0,8]);
		$scope.CircleText = L.tooltip({permanent:true,direction:'bottom',offset:point,opacity:0.9,className:'text'});
		$scope.CircleText.setContent(radiusText);
		$scope.CircleFilter.bindTooltip($scope.CircleText);
		$scope.CircleFilter.editing.enable();
		$scope.CircleFilter.addTo($scope.map);

		/*
		$scope.map.on('draw:editmove', function(event) {
		    	var layer = event.layer;
			layer.setStyle({color: 'DarkRed'});
			
			//var radius = layer.getRadius();
			//$scope.CircleText.setContent(radius);
			//layer.bindTooltip($scope.CircleText);
		 	console.log(layer.getRadius());
			//$scope.CircleText.setContent(layer.getRadius());
		});
		*/
		$scope.map.on('draw:editresize', function(event) {
			var layer = event.layer;
			var radius = Math.floor(layer.getRadius()*0.000621371);
			var radiusText = `${radius} miles`
			$scope.CircleText.setContent(radiusText);
			layer.bindTooltip($scope.CircleText);
		});
		/*
		$scope.map.on('editable:dragend', function(event) {
			var layer = event.layer;
			console.log(layer.getRadius());
			//$scope.CircleText.setContent(layer.getRadius());
		});*/
        }
	else
	{

		//var radius = $scope.CircleFilter.getRadius();
                //var radiusText = `Radius = ${radius}`;
		$scope.CircleFilter.editing.disable();
		$scope.CircleFilter.setLatLng(latlng);
		$scope.CircleFilter.editing.enable();
		//$scope.CircleText.setContent(radiusText);
	}
    }

    $scope.RemoveRadiusMarker = function()
    {
	if($scope.CircleFilter !== undefined)
	{
		$scope.map.removeLayer($scope.CircleFilter);
		$scope.CircleFilter = undefined;
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

    $scope.InitHeatMap = function()
    {
        if ($scope.heatmapLayer !== undefined)
        {
                $scope.map.removeLayer($scope.heatmapLayer);
        }
        $scope.heatmapLayer = new HeatmapOverlay($scope.cfg);
        $scope.map.addLayer($scope.heatmapLayer);
        $scope.HeatUpTheMap();
    }

    $scope.ApplyCfg = function()
    {
	$scope.InitHeatMap();
    }

    $scope.init = function (standalone)
    {
	$scope.initMap();

	// Let's download the GPS data from our api.
        $http.get("./api/Get/Incidents/Gps/", {timeout: 5000}).then(function (response)
        {
		$scope.GPSData = response.data;
		$scope.InitHeatMap();
	});
	$scope.distance = 0;
    };
});

