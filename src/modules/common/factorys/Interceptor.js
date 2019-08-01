export default class Interceptor {
    constructor ($resource, $http,$q,$mdThemingProvider, $mdDateLocaleProvider, $httpProvider, $mdAriaProvider){
      'ngInject';
        this.$resource = $resource;
        this.$http = $http;
        this.$q = $q;
        
        return {
          request: function(config) {
            
              
              return config;
            },
          response: function(config) {
            return new Promise(function (resolve, reject) {
              resolve(config);
            })
            return config;
          },
          responseError: function(response) {
            return new Promise(function (resolve, reject) {
              if(response.status!=null || response.status!=undefined){
                if (response.status==-1){
                  reject('danger', 'Estamos trabajando para brindarte un mejor servicio, por favor intenta más tarde', {timeout:3000});
                  $timeout(function () {
                    if (vm.statusTrue === true) {
                      $location.path('/dashboard');
                    }
                  }, 1500);
                } 
              }
            })
    
            
            console.warn(response.status);
          }, 
          requestError: function(response){
            console.warn(response)
          }
        }
        
    }
}