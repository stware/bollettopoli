/**
 * Created by stefano on 07/03/17.
 */
angular.module('todoService', [])

// super simple service
// each function returns a promise object
    .factory('Todos', function($http) {
        return {
            get : function(id) {
                console.log('Authorization?',$http.defaults.headers.common.Authorization);
                return $http.get('/api/todos/'+id);
            },
            create : function(todoData) {
                return $http.post('/api/todos', todoData);
            },
            delete : function(id) {
                return $http.delete('/api/todos/' + id);
            }
        }
    });