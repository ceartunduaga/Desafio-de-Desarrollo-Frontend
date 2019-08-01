export default class AccountService {
    
    constructor($resource, $http, $q,accountsRestFul,$filter) {
		'ngInject';

        this.$resource = $resource;
        this.$http = $http;
        this.$q = $q;

        this.getAccountSummary = function(){
            return new Promise(function (resolve, reject) {
				accountsRestFul.Get_Data().$promise.then(function(result){
					return result;
				})
				.then(function(data) {
					   resolve(data);
				  })
				.catch(function(err){
					reject(err);
				});
			});
        }

    }
    
}