/**
 * Created by stefano on 05/03/17.
 */

var indexModule = angular.module('index', ['ui.router','todoModule','loginModule','insideModule','registerModule','authService']);

indexModule.controller('mainController',['$scope','$http','AuthService',function($scope, $http,AuthService) {
    $scope.formData = {};

    $scope.isAuthenticated = function() {
        return AuthService.isAuthenticated();
    }
}]);



var dataModel = angular.module('dataModel',[]);

dataModel.factory('dataModelService',function(){
    return {
        loggedUser: ''
    };
});

