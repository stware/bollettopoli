/**
 * Created by stefano on 05/03/17.
 */
// public/core.js
var indexModule = angular.module('index', ['ui.router','todoModule','todoService','loginModule','authService','insideModule']);

indexModule.controller('mainController',['$scope','$http',function($scope, $http) {
    $scope.formData = {};

}]);



