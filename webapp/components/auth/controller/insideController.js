/**
 * Created by sturrini on 13/03/2017.
 */

var insideModule = angular.module('insideModule',['ui.router']);

insideModule.controller('insideController',[ '$scope', 'AuthService','API_ENDPOINT', '$http', '$state',function($scope, AuthService, API_ENDPOINT, $http, $state) {

    console.log($scope.user);
    $scope.destroySession = function() {
        AuthService.logout();
    };

    $scope.getInfo = function() {
        $http.get(API_ENDPOINT.url + '/users').then(function(result) {
            $scope.memberinfo = result.data.msg;
        });
    };

    $scope.logout = function() {
        AuthService.logout();
        $state.go('home');
    };

    return {

    }
}]);