/**
 * Created by stefano on 05/03/17.
 */
angular.module('index').config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/home");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "/home/home.html",
            controller: 'todoMainController'
        }).state('todo', {
        url: "/todo",
        templateUrl: "/todo/todo.html"
        }).state('about', {
            url: "/about",
            templateUrl: "/about/about.html"

        });
});