/**
 * Created by sturrini on 13/03/2017.
 */

var loginModule = angular.module('loginModule',['ui.router']);

loginModule.controller('loginController', function($scope, AuthService, $state) {
    $scope.user = {
        name: '',
        password: ''
    };

    $scope.login = function() {
        AuthService.login($scope.user).then(function(msg) {
            $state.go('inside');
        }, function(errMsg) {
            console.log('Login Failed! ',errMsg);

        });
    };
})
