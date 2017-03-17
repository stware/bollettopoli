/**
 * Created by stefano on 05/03/17.
 */
var todo = angular.module('todoModule',['ui.router','todoService','dataModel']);

todo.controller('todoController',['$scope','$http','Todos','dataModelService',function($scope, $http,Todos,dataModelService) {
    $scope.formData = {
        id: '',
        idUser: '',
        text: '',
        order:''
    };
    console.log('todoController registered');
    // when landing on the page, get all todos and show them


   Todos.get(dataModelService.loggedUser.id).then(function(response) {
        $scope.todos = response.data;
        console.log(response.data);
    },function(response) {
        console.log('Error: ' + response);
    });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $scope.formData.idUser = dataModelService.loggedUser.id;
        $scope.formData.order = 1;
        console.log('To be created (frontend):',$scope.formData);
        Todos.create($scope.formData)
            .then(function(response) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = response.data;
                console.log(response.data);
            },function(response) {
                console.log('Error: ' + response);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        console.log('to be deleted:',id);
         Todos.delete(id)
            .then(function(response) {
                Todos.get(dataModelService.loggedUser.id).then(function(response){
                    $scope.todos = response.data;
                    console.log('returned after delete:',response.data);
                },function(response) {
                    console.log('Error: ' + response);
                });

            },function(response) {
                console.log('Error: ' + response);
            });
    };

}]);

