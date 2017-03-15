/**
 * Created by sturrini on 13/03/2017.
 */

var registerModule = angular.module('registerModule',['ui.router','authService','dataModel']);

registerModule.controller('registerController', ['$scope', 'AuthService', '$state',function($scope, AuthService, $state) {
    $scope.user = {
        name: '',
        password: '',
        username:''
    };

    $scope.signup = function() {
        console.log('User to be registered:',$scope.user);
        AuthService.register($scope.user).then(function(msg) {
            console.log(msg);
            $scope.successMsg = msg;
        }, function(errMsg) {
            $scope.errMsg = errMsg;
        });
    };
}]);
