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
            templateUrl: "/home/home.html"
        }).state('todo', {
            url: "/todo",
            templateUrl: "/todo/todo.html",
            controller: 'todoController'
        }).state('about', {
            url: "/about",
            templateUrl: "/about/about.html"

        }).state('login', {
            url: "/login",
            templateUrl: "/auth/login.html",
            controller: 'loginController'
        }).state('inside', {
            url: '/inside',
            templateUrl: 'auth/profile.html',
            controller: 'insideController'
        })/*.state('outside', {
            url: '/outside',
            abstract: true,
            templateUrl: '/auth/outside.html'
        })
        .state('outside.login', {
            url: '/login',
            templateUrl: 'auth/login.html',
            controller: 'loginController'
        })
        .state('outside.register', {
            url: '/register',
            templateUrl: 'auth/register.html',
            controller: 'registerController'
        })
        .state('inside', {
            url: '/inside',
            templateUrl: 'auth/profile.html',
            controller: 'insideController'
        })*/;
})
    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
            if (!AuthService.isAuthenticated()) {
                console.log(next.name);
               /* if (next.name !== 'outside.login' && next.name !== 'outside.register') {
                    event.preventDefault();
                    $state.go('index');
                }*/
            }
        });
    });
