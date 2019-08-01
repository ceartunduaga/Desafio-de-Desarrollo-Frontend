// for loading styles we need to load main scss file
import styles from './assets/styles.scss';

// loading shared module
import './modules/common/common.module';
import './modules/dashboard_productividad/dashboard_productividad.module';

// loading all module components

const appModule = angular
	.module('app', [
		'ngMaterial',
		'mgo-angular-wizard',
		'md-steppers',
		'ui.bootstrap',
		'ngResource',
		'ui.knob',
		'ngMask',
		// shared module
		'app.common',
		// 3rd party modules
		'ui.router',
		// application specific modules
		'app.dashboard_productividad',
		'angularUtils.directives.dirPagination'
		
	])
export default appModule;
