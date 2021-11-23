// Main
app.controller('mainCtrl', function ($scope, $http)
{
    $scope.initMap = function ()
    {
        $scope.map = L.map('map').setView([44.980039, -122.781830], 10);
        $scope.sidebar = L.control.sidebar('sidebar').addTo($scope.map);
        $scope.sidebar.open("home");

        $scope.OR911_MAP = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

	$scope.OR911_MAP.addTo($scope.map);
    };

    $scope.init = function (standalone)
    {
	$scope.initMap();
    };
});
