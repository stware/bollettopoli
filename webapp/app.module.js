/**
 * Created by stefano on 05/03/17.
 */

var indexModule = angular.module('index', ['ui.router','todoModule','loginModule','insideModule','registerModule']);

indexModule.controller('mainController',['$scope','$http',function($scope, $http) {
    $scope.formData = {};

}]);

var dataModel = angular.module('dataModel',[]);

dataModel.factory('dataModelService',function(){
    return {
        loggedUser: ''
    };
});

