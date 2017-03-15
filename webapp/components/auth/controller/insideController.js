/**
 * Created by sturrini on 13/03/2017.
 */

var insideModule = angular.module('insideModule',['ui.router','dataModel']);

insideModule.controller('insideController',[ '$scope', 'AuthService','API_ENDPOINT', '$http', '$state','dataModelService',function($scope, AuthService, API_ENDPOINT, $http, $state,dataModelService) {


    $scope.loggedUser = dataModelService.loggedUser;
    console.log($scope.loggedUser);

    $scope.destroySession = function() {
        AuthService.logout();
    };

    $scope.getInfo = function() {
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
            $scope.memberinfo = result.data.msg;
        });
    };

    $scope.logout = function() {
        AuthService.logout();
        $state.go('home');
    };
}]);