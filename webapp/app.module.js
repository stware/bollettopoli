/**
 * Created by stefano on 05/03/17.
 */
// public/core.js
var indexModule = angular.module('index', ['ui.router','todoController','todoService']);

indexModule.controller('mainController',['$scope','$http',function($scope, $http) {
    $scope.formData = {};
/*
    // when landing on the page, get all todos and show them
    $http.get('../api/contacts').then(function(response) {
            $scope.todos = response.data.rows;
            console.log(response.data.rows);
        },function(response) {
            console.log('Error: ' + response);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('../api/contacts', $scope.formData)
            .then(function(response) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = response.data.rows;
                console.log(response.data.rows);
            },function(response) {
                console.log('Error: ' + response);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('../api/contacts/' + id)
            .then(function(response) {
                $scope.todos = response.data.rows;
                console.log(response.data.rows);
            },function(response) {
                console.log('Error: ' + response);
            });
    };
*/
}]);

