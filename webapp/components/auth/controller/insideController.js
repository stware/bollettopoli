/**
 * Created by sturrini on 13/03/2017.
 */

var insideModule = angular.module('insideModule',['ui.router','dataModel','ngToast']);

insideModule.controller('insideController',[ '$scope', 'AuthService','API_ENDPOINT', '$http', '$state','dataModelService','ngToast',function($scope, AuthService, API_ENDPOINT, $http, $state,dataModelService,ngToast) {


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

    $scope.save = function() {
        AuthService.saveProfile($scope.loggedUser).then(function(msg){
            // Success
            ngToast.create({
                className: 'info',
                content: 'Profile saved'
            });
        },function (msg) {
            // Fail
            ngToast.create({
                className: 'error',
                content: 'Error saving profile'
            });
        });
    };
}]);