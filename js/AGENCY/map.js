// Main
app.controller('mainCtrl', function ($scope, $http, table) {
	$scope.TableHeaders = ["Date", "Call Num.", "Description", "Address"];
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
			"radius": 30,
			"maxOpacity": .8,
			// scales the radius based on map zoom
			"scaleRadius": false,
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
			$scope.SetCurrentData($scope.FilteredDate);
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

			var array = $scope.FilteredDate;
			$scope.SetCurrentData($scope.FilterByDistance(array, circleCenterCoords, circleRadiusMeters));
		}
	}

	$scope.ApplyDateFilter = function () {
		$scope.FilteredDate = [];

		for (var i = 0; i < $scope.RawData.length; i++) {
			var currentDate = Date.parse($scope.RawData[i].received);

			if (currentDate < Date.parse($scope.DateTo) && currentDate > Date.parse($scope.DateFrom)) {
				$scope.FilteredDate.push($scope.RawData[i]);
			}
		}

		$scope.SetCurrentData($scope.FilteredDate);
		$scope.ApplyRangeFilter();
	}

	$scope.ResetDateFilter = function () {
		$scope.DateFrom = $scope.MinDate;
		$scope.DateTo = $scope.MaxDate;
		$scope.ApplyDateFilter();
	}

	$scope.GetCallData = function (MyCall) {
		if (MyCall === $scope.CurrentlySelectedCall) {
			$scope.CurrentlySelectedCall = -1;
		}
		else {
			$http.get("./api/Get/Incidents/Unit/?incident=" + MyCall, { timeout: 5000 }).then(function (response) {
				$scope.CurrentlySelectedCall = MyCall;
				$scope.RawUnitData = response.data;
			});
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
	$scope.buildGPSDataFromArray = function (arr) {
		var temp = new Map();
		var temp2 = [];

		for (var i = 0; i < arr.length; i++) {
			var lat = arr[i].lat;
			var lng = arr[i].lng;

			if (!temp.has(lat)) {
				temp.set(lat, new Map());
			}

			var currentLatMapThing = temp.get(lat);

			if (!currentLatMapThing.has(lng)) {
				currentLatMapThing.set(lng, 1);
			}
			else {
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

	$scope.SetCurrentData = function ($arr) {
		$scope.CurrentData = [];
		$scope.currentPage = 0;
		$scope.CurrentlySelectedCall = -1;
		$scope.CurrentData = $arr;
		$scope.buildGPSDataFromArray($arr);
		table.initialize($scope, $arr);
	}

	$scope.InitFireStations = function () {
		for (const station of $scope.Stations) {
			var MarkerLatLng = new L.LatLng(station.latitude, station.longitude);
			var MarkerIcon = L.icon({
				iconUrl: "./images/firedept.png",
				iconSize: [10, 10]
			});
			var Marker = L.marker(MarkerLatLng, { icon: MarkerIcon });
			Marker.addTo($scope.map);
		}
	}

	$scope.init = function (standalone) {
		$scope.initMap();

		// Let's download the GPS data from our api.
		$http.get("./api/Get/Incidents/Gps/", { timeout: 5000 }).then(function (response) {
			$scope.RawData = response.data;
			$scope.MinDate = new Date(Date.parse($scope.RawData[0].received));
			$scope.MaxDate = new Date(Date.parse($scope.RawData[$scope.RawData.length - 1].received));
			$scope.DateFrom = $scope.MinDate;
			$scope.DateTo = $scope.MaxDate;
			$scope.SetCurrentData($scope.RawData);
			$scope.ApplyDateFilter();
		});


		$http.get("./api/Get/Stations/", { timeout: 5000 }).then(function (response) {
			$scope.Stations = response.data;
			$scope.InitFireStations();
		});

		$scope.distance = 0;
		$scope.DateFrom = new Date();
		$scope.DateTo = new Date();
		$scope.CurrentData = [];
		$scope.CurrentlySelectedCall = -1;
	};
});
