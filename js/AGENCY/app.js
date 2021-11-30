// Angular JS stuff
var app = angular.module('myApp', ['ngMaterial', 'ngMessages']);
app.factory('AppData', function () {
    return {AppData: []};
});

app.filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start; //parse to int
        return input.slice(start);
    };
});

app.factory('table', function ($rootScope) {
    function initialize($scope, datamember)
    {
        console.log("penis");
        
        $scope.currentPage = 0;
        $scope.pageSize = 15;
        $scope.isAllSelected = false;
        $scope.query = {};
        $scope.queryBy = '$';
        $scope.sortType = 0; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order

        $scope.changeSortType = function (idx)
        {
            $scope.sortType = idx;
            $scope.sortReverse = !$scope.sortReverse;
        };

        $scope.numberOfPages = function ()
        {
            if ($scope.query[$scope.queryBy] !== undefined &&
                    $scope.MainDataTable !== undefined &&
                    $scope.query[$scope.queryBy].length &&
                    $scope.MainDataTable.length)
            {
                return Math.ceil($scope.MainDataTable.length / $scope.pageSize);
            } else
            {
                if (datamember !== undefined)
                {

                    return Math.ceil(datamember.length / $scope.pageSize);
                }
            }
            return 0;
        };

        $scope.searchInit = function ()
        {
            if ($scope.currentPage > 0)
            {
                var len = $scope.numberOfPages();
                if ($scope.currentPage >= len)
                {
                    $scope.currentPage = len - 1;
                }
            } else
            {
                $scope.currentPage = 0;
            }
        };

        $scope.pageNums = function ()
        {
            var pages = [];
            for (var i = 1; i <= $scope.numberOfPages(); i++)
            {
                pages.push(i);
            }
            return pages;
        };

        $scope.Next = function ()
        {
            var maxNum = $scope.numberOfPages();
            if (($scope.currentPage + 1) < maxNum)
            {
                $scope.currentPage++;
            }
        };

        $scope.Prev = function ()
        {
            $scope.currentPage--;
            if ($scope.currentPage < 0)
            {
                $scope.currentPage = 0;
            }
        };

        $scope.SetPage = function (pg)
        {
            $scope.currentPage = pg;
        };

        $scope.PageNumClass = function (pg)
        {
            if (pg === $scope.currentPage)
            {
                return "page-item active";
            }
            return "page-item";
        };

        $scope.toggleAll = function ()
        {
            var toggleStatus = $scope.isAllSelected;
            angular.forEach(datamember, function (itm) {
                itm.selected = toggleStatus;
            });
        };

        $scope.optionToggled = function (x)
        {
            $scope.isAllSelected = datamember.every(function (itm) {
                return itm.selected;
            });
        };

        $scope.isAnythingSelected = function ()
        {
            var selected = false;
            angular.forEach(datamember, function (itm) {
                if (itm.selected) {
                    selected = true;
                }
            });
            return selected;
        };
    }

    return {
        initialize: initialize
    };
});

app.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, ele, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                return parseInt(viewValue, 10);
            });
        }
    };
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});
