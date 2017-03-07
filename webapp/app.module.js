/**
 * Created by stefano on 05/03/17.
 */
// public/core.js
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('../api/contacts')
        .success(function(data) {
            $scope.todos = data.rows;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('../api/contacts', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data.rows;
                console.log(data.rows);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('../api/contacts/' + id)
            .success(function(data) {
                $scope.todos = data.rows;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
