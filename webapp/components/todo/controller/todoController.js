/**
 * Created by stefano on 05/03/17.
 */
var todo = angular.module('todoController',['ui.router']);

todo.controller('todoMainController',['$scope','$http','Todos',function($scope, $http,Todos) {
    $scope.formData = {};
    console.log('todoController registered');
    // when landing on the page, get all todos and show them


   Todos.get().then(function(response) {
        $scope.todos = response.data.rows;
        console.log(response.data.rows);
    },function(response) {
        console.log('Error: ' + response);
    });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        Todos.create($scope.formData)
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
         Todos.delete(id)
            .then(function(response) {
                $scope.todos = response.data.rows;
                console.log(response.data.rows);
            },function(response) {
                console.log('Error: ' + response);
            });
    };

}]);

