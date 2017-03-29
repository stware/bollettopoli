/**
 * Created by sturrini on 13/03/2017.
 */

var loginModule = angular.module('loginModule',['ui.router','authService','dataModel','ngToast']);

loginModule.controller('loginController',['$scope', 'AuthService', '$state','dataModelService','ngToast', function($scope, AuthService, $state, dataModelService,ngToast) {
    $scope.user = {
        username: '',
        password: ''
    };

    $scope.login = function() {

        AuthService.login($scope.user).then(function(msg) {
            AuthService.getUserInfo($scope.user).then(function(msg) {
                ngToast.create({
                    className: 'info',
                    content: 'Login successful'
                });
                $state.go('inside');
            }, function(errMsg) {
                console.log('Get user data failed! ',errMsg);
                ngToast.create({
                    className: 'error',
                    content: 'Login failed'
                });
                $scope.errMsg=errMsg;
            });
           }, function(errMsg) {
            console.log('Login Failed! ',errMsg);
            $scope.errMsg=errMsg;
        });


    };


}]);
