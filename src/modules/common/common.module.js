import RouterHelperService from './router-helper/router-helper.service';

import CurrencyFilter from './filters/currency.filter';

import AccountService from './services/account.service';

import AccountEllipseDirective from './directives/account-ellipse/account-ellipse.directive';


import accountsRestFul from './servicesRest/restful.accounts';

const commonModule = angular.module('app.common', [
	'ui.router',
]);

// inject services, config, filters and re-usable code
// which can be shared via all modules
commonModule.config(RouterHelperService);

commonModule.filter('currency', CurrencyFilter);

commonModule.service('AccountService', AccountService);
commonModule.directive('accountEllipse', AccountEllipseDirective);
commonModule.factory('accountsRestFul',['$resource', ( $resource) => new accountsRestFul($resource)]);


export default commonModule;