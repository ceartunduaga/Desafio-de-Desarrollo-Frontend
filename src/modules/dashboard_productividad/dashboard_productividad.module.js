import dashboard_productividadController from './controller/dashboard_productividad.controller';

const dashboard_productividadModule = angular.module('app.dashboard_productividad', []);

dashboard_productividadModule.controller('dashboard_productividadController', dashboard_productividadController);

// export this module
export default dashboard_productividadModule;
