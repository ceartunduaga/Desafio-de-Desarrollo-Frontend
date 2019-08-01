export default function dashboard_productividadController($scope, $timeout,$state,$http, $location, $uibModal,AccountService,) {
	'ngInject';
	
	$scope.saving = false;
	$scope.showRut = 0;
	$scope.data = [
		{
			"datas" : [],
			"tipo"  : "",
			"total"  : 0,
			"totalI"  : 0,
			"totalF"  : 0
		},
		{
			"datas" : [],
			"tipo"  : "",
			"total"  : 0,
			"cantidad"  : 0		
		},
		{
			"datas" : [],
			"tipo"  : "",
			"total"  : 0,
			"cantidad"  : 0		
		},
		{
			"datas" : [],
			"tipo"  : "",
			"total"  : 0,
			"cantidad"  : 0		
		}
	];
 	$scope.total = 0;
	$scope.totalrow = 0;
	$scope.sucursal =[];
	$scope.periodo =[];
	$scope.mes =[];

	activate();
	
		
	Array.prototype.unique=function(a){
		return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
	  });
	function activate() {
		AccountService.getAccountSummary()
		.then(function(data){
			var i = 0;
			data.forEach(item => {
				i++;
				if(item.tipo == 'Citas ambulatorias'){
					$scope.data[0].datas.push(item);
					$scope.data[0].tipo=item.tipo;
					$scope.data[0].total = parseInt($scope.data[0].total) + parseInt(item.total);
					if(item.prevision=="Fonasa"){
						$scope.data[0].totalF = parseInt($scope.data[0].totalF) + parseInt(item.cantidad);
					}
					else{
						$scope.data[0].totalI = parseInt($scope.data[0].totalI) + parseInt(item.cantidad);
					}
				}
				else if(item.tipo == 'Exámenes'){
					$scope.data[1].datas.push(item);
					$scope.data[1].tipo=item.tipo;
					$scope.data[1].total = parseInt($scope.data[1].total) + parseInt(item.total);
					$scope.data[1].cantidad = parseInt($scope.data[1].cantidad) + parseInt(item.cantidad);

				}
				else if(item.tipo == 'Cirugías'){
					$scope.data[2].datas.push(item);
					$scope.data[2].tipo=item.tipo;
					$scope.data[2].total = parseInt($scope.data[2].total) + parseInt(item.total);
					$scope.data[2].cantidad = parseInt($scope.data[2].cantidad) + parseInt(item.cantidad);

				}
				else if(item.tipo == 'Derivaciones'){
					$scope.data[3].datas.push(item);
					$scope.data[3].tipo=item.tipo;
					$scope.data[3].total = parseInt($scope.data[3].total) + parseInt(item.total);
					$scope.data[3].cantidad = parseInt($scope.data[3].cantidad) + parseInt(item.cantidad);

				}
 				$scope.total = parseInt($scope.total) + parseInt(item.total);
				 $scope.sucursal.push(item.sucursal);
				 $scope.periodo.push(item.anio);
				 $scope.mes.push(item.mes);
				
				 if(data.length == i ){
					$scope.sucursal = $scope.sucursal.unique();
					$scope.periodo = $scope.periodo.unique();
					$scope.mes = $scope.mes.unique();
					$scope.sucursal = $scope.sucursal.sort();
					$scope.periodo = $scope.periodo.sort();
					$scope.mes = $scope.mes.sort(function(a, b) {
						return a - b;
					  });
					
				 }
				
			});
			$scope.$apply();
		})
		.catch(function(err){				
			console.log(err);
		});
		

	}

	$scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

	
}
