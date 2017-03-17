/**
 * Created by sturrini on 13/03/2017.
 */

var loginModule = angular.module('loginModule',['ui.router','authService','dataModel']);

loginModule.controller('loginController',['$scope', 'AuthService', '$state','dataModelService', function($scope, AuthService, $state, dataModelService) {
    $scope.user = {
        username: '',
        password: ''
    };

    $scope.login = function() {

        AuthService.login($scope.user).then(function(msg) {
            AuthService.getUserInfo($scope.user).then(function(msg) {

                $state.go('inside');
            }, function(errMsg) {
                console.log('Get user data failed! ',errMsg);
                $scope.errMsg=errMsg;
            });
           }, function(errMsg) {
            console.log('Login Failed! ',errMsg);
            $scope.errMsg=errMsg;
        });


    };
}]);
