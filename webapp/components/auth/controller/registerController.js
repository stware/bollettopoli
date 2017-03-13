/**
 * Created by sturrini on 13/03/2017.
 */

/*var registerModule = angular.module('registerModule',['ui.router']);

registerModule.controller('registerController', function($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
        name: '',
        password: ''
    };

    $scope.signup = function() {
        AuthService.register($scope.user).then(function(msg) {
            $state.go('outside.login');
            var alertPopup = $ionicPopup.alert({
                title: 'Register success!',
                template: msg
            });
        }, function(errMsg) {
            var alertPopup = $ionicPopup.alert({
                title: 'Register failed!',
                template: errMsg
            });
        });
    };
});
*/