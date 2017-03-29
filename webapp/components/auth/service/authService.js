/**
 * Created by stefano on 07/03/17.
 */
angular.module('authService', ['dataModel'])
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated'
    })

    .constant('API_ENDPOINT', {
        url: '/api'
        //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    })
    .service('AuthService', function($q, $http, API_ENDPOINT,dataModelService) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var isAuthenticated = false;
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            var user = dataModelService.loggedUser;
            console.log('user',user);
            if (token && user) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            console.log('use credentials');
            isAuthenticated = true;
            authToken = token;

            // Set the token as header for your requests!
            $http.defaults.headers.common.Authorization = 'JWT '+authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            isAuthenticated = false;
            $http.defaults.headers.common.Authorization = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var register = function(user) {
            return $q(function(resolve, reject) {
                $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
                    if (result.data.success) {
                        resolve(result.data.message);
                    } else {
                        reject(result.data.message);
                    }
                });
            });
        };

        var login = function(user) {
            return $q(function(resolve, reject) {
                $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
                    console.log(result.data);
                    if (result.data.success) {
                        storeUserCredentials(result.data.token);

                        resolve(result.data.message);
                    } else {
                        reject(result.data.message);
                    }
                });
            });
        };

        var saveProfile = function(user) {
            return $q(function(resolve, reject) {
                $http.put(API_ENDPOINT.url + '/users/'+ angular.toJson(user)).then(function(result) {
                    console.log(result.data);
                    if (result.data.success) {

                        /**
                         * TODO
                         */

                        resolve(result.data.message);
                    } else {
                        reject(result.data.message);
                    }
                });
            });
        };

        var getUserInfo = function(user) {
            console.log('usr to search (frontend):',user);
            return $q(function(resolve, reject) {
                $http.get(API_ENDPOINT.url + '/users/'+ angular.toJson(user)).then(function(result) {
                    console.log(result.data);
                    if (result.data.success) {
                        console.log('before:',dataModelService.loggedUser);
                        console.log('user to datamodel:',result.data.user.data);
                        dataModelService.loggedUser = result.data.user.data;

                        resolve(result.data.message);
                    } else {
                        reject(result.data.message);
                    }
                });
            });
        };

        var logout = function() {
            destroyUserCredentials();
        };

        loadUserCredentials();

        return {
            login: login,
            register: register,
            logout: logout,
            getUserInfo: getUserInfo,
            saveProfile: saveProfile,
            isAuthenticated: function() {
                console.log('isAuthenticated:',isAuthenticated);
                return isAuthenticated;
            }
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });