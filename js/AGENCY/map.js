// Main
app.controller('mainCtrl', function ($scope, $http, table) {
	$scope.TableHeaders = ["Date", "Call Number", "Address"];
	$scope.currentPage = 0;
    $scope.pageSize = 19;


	$scope.initMap = function () {
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

	$scope.UpdateCircle = function () {
		$scope.ApplyRangeFilter();
		$scope.$apply();
	}

	$scope.PlaceRadiusMarker = function () {
		var latlng = $scope.map.getCenter();
		if ($scope.CircleFilter === undefined) {
			// initialize circle with 5 mile radius (in meters)
			$scope.CircleFilter = L.circle(latlng, { radius: 8046 });

			// initializes circle radius and binds radius info tooltip to center.
			$scope.CircleFilter.editing.enable();
			$scope.CircleFilter.addTo($scope.map);
			$scope.ApplyRangeFilter();

			// when the circle filter is present, this ensures the current lat,lng are updated when it moves
			$scope.map.on('draw:editmove', $scope.UpdateCircle);

			// when the circle filter is present, this ensures radius size of bound tooltip is accurate when resized
			$scope.map.on('draw:editresize', $scope.UpdateCircle);
		}
		else {
			$scope.ApplyRangeFilter();
		}
	}

	$scope.RemoveRadiusMarker = function () {
		if ($scope.CircleFilter !== undefined) {
			$scope.map.removeLayer($scope.CircleFilter);
			$scope.CircleFilter = undefined;
			$scope.buildGPSDataFromArray($scope.RawData);
		}
	}

	$scope.FilterByDistance = function (array, latLng, radius) {
		const filteredArray = [];

		for (var i = 0; i < array.length; i++) {
			var coords = L.latLng(array[i].lat, array[i].lng);
			if (latLng.distanceTo(coords) <= radius) {
				let dist = latLng.distanceTo(coords);
				filteredArray.push(array[i]);
			}
		}

		return filteredArray;
	}

	$scope.ApplyRangeFilter = function () {
		if ($scope.CircleFilter !== undefined) {
			var circleCenterCoords = $scope.CircleFilter.getLatLng();
			var circleRadiusMeters = $scope.CircleFilter.getRadius();

			var array = $scope.RawData;
			$scope.SetCurrentData($scope.FilterByDistance(array, circleCenterCoords, circleRadiusMeters));
		}
		else {
			console.log("Error no marker defined");
		}
	}

	$scope.HeatUpTheMap = function () {
		var heatMapData = {
			data: $scope.GPSData
		};

		$scope.heatmapLayer.setData(heatMapData);
	}

	$scope.InitHeatMap = function () {
		if ($scope.heatmapLayer !== undefined) {
			$scope.map.removeLayer($scope.heatmapLayer);
		}
		$scope.heatmapLayer = new HeatmapOverlay($scope.cfg);
		$scope.map.addLayer($scope.heatmapLayer);
		$scope.HeatUpTheMap();
	}

	$scope.ApplyCfg = function () {
		$scope.InitHeatMap();
	}

	class knottyClass {
		constructor(_lat, _lng, _count) {
			this.lat = _lat;
			this.lng = _lng;
			this.count = _count;
		}
	}

	// Inital load processing.
	$scope.buildGPSDataFromArray = function(arr)
	{
		var temp = new Map();
		var temp2 = [];

		for (var i = 0; i < arr.length; i++) {
			var lat = arr[i].lat;
			var lng = arr[i].lng;

			if (!temp.has(lat))
			{
				temp.set(lat, new Map());
			}
			
			var currentLatMapThing = temp.get(lat);

			if (!currentLatMapThing.has(lng))
			{
				currentLatMapThing.set(lng, 1);
			}
			else
			{
				currentLatMapThing.set(lng, currentLatMapThing.get(lng) + 1);
			}
		}

		for (const [lat_v, lat_o] of temp) {
			for (const [lng_v, count] of lat_o) {
				temp2.push(new knottyClass(lat_v, lng_v, count));
			}
		}

		$scope.GPSData = temp2;

		$scope.InitHeatMap();
	}

	$scope.SetCurrentData = function($arr)
	{
			$scope.CurrentData = [];
			$scope.currentPage = 0;
			$scope.CurrentData = $arr;
			$scope.buildGPSDataFromArray($arr);
			table.initialize($scope, $arr);
	}

	$scope.init = function (standalone) {
		$scope.initMap();

		// Let's download the GPS data from our api.
		$http.get("./api/Get/Incidents/Gps/", { timeout: 5000 }).then(function (response) {
			$scope.RawData = response.data;
			$scope.SetCurrentData($scope.RawData);
		});

		$scope.distance = 0;
		$scope.DateFrom = new Date();
		$scope.DateTo = new Date();
		$scope.CurrentData = [];
	};
});

