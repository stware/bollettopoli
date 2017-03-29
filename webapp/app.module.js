/**
 * Created by stefano on 05/03/17.
 */

var indexModule = angular.module('index', ['ui.router','todoModule','loginModule','insideModule','registerModule','authService','ngToast']);

indexModule.controller('mainController',['$scope','$http','AuthService','ngToast',function($scope, $http,AuthService,ngToast) {
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

