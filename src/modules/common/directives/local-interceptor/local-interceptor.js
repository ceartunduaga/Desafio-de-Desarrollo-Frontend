export default class localInterceptor {
  constructor ($q, $timeout, $location, $injector, $sessionStorage, $state){
    'ngInject';
      
    var vm = this;
    vm.$q =$q;
    vm.$timeout = $timeout;
    vm.$location = $location;
    vm.$injector = $injector;
    vm.$sessionStorage = $sessionStorage; 
    vm.$state = $state;
    
    vm.token = null;
    vm.clientid = null;
    vm.rut = null;
    vm.token = null;
    vm.requestId = null;
    vm.statusTrue = false;

    return {
      getResponse: getResponse,
    }
    
    function  getResponse(data, Service) {
      //console.log(data)
      return new Promise(function (resolve, reject) {
        var result = data;
        result.$status = data.status;
        result.$error = data.statusText;
        var style, message;
        var descripcion, codigo;
        //PRIMERA VALIDACIÓN
        if (data.$status === 204 || data.$status === 404 || data.$status === 500 || data.$status === 504) {
          return reject({
            status: data.$status,
            error: data.$error
          });
        } else if (!angular.isUndefined(data.dtoresponseCodigosEstadoHttp)) {

          var codError = data.dtoresponseCodigosEstadoHttp.codigo;

          if (codError == '101' || codError == '401' || codError == '500') {
            console.log('401');
            descripcion = data.dtoresponseCodigosEstadoHttp.descripcion;
            codigo = data.dtoresponseCodigosEstadoHttp.codigo;
            if (codError == '101') {
              vm.statusTrue = true;
              style = 'warning';
              message = 'Por seguridad tu sesión a finalizado.';
              $timeout(function () {
                $location.path('/inactivity-logout');
              }, 1500);
            } else if (codError == '401') {
              console.log('401 again');
              vm.statusTrue = true;
              style = 'warning';
              message = 'No tiene permisos para esta acción.';
            } else if (codError = '500') {
              style = 'danger';
              message = 'Ha ocurrido un problema, refresque la página o intentelo más tarde.';
            }
            $timeout(function () {
              //Redireccionar Al dashboard_productividad
              if (vm.statusTrue == true) {
                $location.path('/inactivity-logout');
              }
            }, 1500);

            vm.statusTrue == false;
            return reject({
              style: style,
              message: message,
              status: codigo,
            });
          }
        }
        //SEGUNDA VALIDACIÓN

        if (data.dtoResponseCodigosEstadoHttp && data.dtoResponseCodigosEstadoHttp.codigo !== '200' && data.dtoResponseCodigosEstadoHttp.codigo !== 200 )  {
          
          descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
          codigo = data.dtoResponseCodigosEstadoHttp.codigo;

          if (Service == 'Servipag' || Service == 'Tarjeta-Act-Des') {
            if(Service == 'Servipag'){
                if (data.dtoResponseCodigosEstadoHttp.codigo == '101') { //Error Servipag
                  descripcion = data.dtoResponseCodigosEstadoHttp.descripcion ;
                  codigo = data.dtoResponseCodigosEstadoHttp.codigo;
      
                  return reject({
                    style: 'warning',
                    message: descripcion,
                    timeout: 3000,
                    status: codigo,
                  });

                } else if (data.dtoResponseCodigosEstadoHttp.codigo == '-2') {
                  descripcion = data.DtoResponseModificaCuenta.mensajeError;// data.dtoResponseCodigosEstadoHttp.descripcion ;
                  codigo = data.dtoResponseCodigosEstadoHttp.codigo;                  
                  return reject({
                    style: 'warning',
                    message: descripcion,
                    timeout: 3000,
                    status: codigo,
                  });
                  
                }else{

                  descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
                  codigo = data.dtoResponseCodigosEstadoHttp.codigo;
  
                  return reject({
                    style: 'warning',
                    message: descripcion,
                    timeout: 3000,
                    status: codigo,
                  });
                }
            } 

            if (Service == 'Tarjeta-Act-Des') { //No Cambiar Seguridad  !! A.G
              if (data.dtoTarjetasResponseSetResultados.dtoResultadoTarjeta.codigo == '902') { //Error Activar/Desactivar Tarjeta
                descripcion = data.dtoTarjetasResponseSetResultados.dtoResultadoTarjeta.mensaje;
                codigo = data.dtoTarjetasResponseSetResultados.dtoResultadoTarjeta.codigo;

                return reject({
                  style: 'warning',
                  message: descripcion,
                  timeout: 3000,
                  status: codigo,
                });

              }else{

                descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
                codigo = data.dtoResponseCodigosEstadoHttp.codigo;

                return reject({
                  style: 'warning',
                  message: descripcion,
                  timeout: 3000,
                  status: codigo,
                });
              }
            }
            
          }else{

            if (data.dtoResponseCodigosEstadoHttp.codigo === '400') {
              descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '500' || data.dtoResponseCodigosEstadoHttp.codigo === '504') {
              descripcion = data.dtoResponseCodigosEstadoHttp.mensaje ? 
                    data.dtoResponseCodigosEstadoHttp.mensaje :  
                    'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              return reject({
                style: 'warning',
                message: descripcion,
                timeout: 3000,
                status: codigo,
              });
              
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '401') {
              var resultados = data.dtoResponseSetResultados;

              if (resultados === null) {
                descripcion = 'CLAVE Y/O RUT INCORRECTO(S)';
                codigo = data.dtoResponseCodigosEstadoHttp.codigo;
                message = descripcion;
                style = 'warning';
              } else {
                /*if ( (data.dtoResponseSetResultados && data.dtoResponseSetResultados.codigoError ==='104') ||
                     (data.dtoResponseDatosEstadoProxyBanco && data.dtoResponseDatosEstadoProxyBanco.codigo === '101') ) {
                      descripcion = data.dtoResponseSetResultados ? 'CLAVE Y/O RUT INCORRECTO(S)' :
                                    data.dtoResponseDatosEstadoProxyBanco ? 
                                    data.dtoResponseDatosEstadoProxyBanco.descripcion : 'Error Inesperado'; 

                      codigo = data.dtoResponseCodigosEstadoHttp ? data.dtoResponseCodigosEstadoHttp.codigo :
                               data.dtoResponseDatosEstadoProxyBanco ? data.dtoResponseDatosEstadoProxyBanco.codigo : 'xxx';
                      message = descripcion;
                      style = 'warning';
                      
                      $timeout(function () {
                        $location.path('/inactivity-logout');
                      }, 1500);
                }*/
                
                if(!angular.isUndefined(data.dtoResponseSetResultados)){
                  if(data.dtoResponseSetResultados.codigoError ==='104'){
                    $timeout(function () {
                      location.path('/inactivity-logout');
                    }, 1500);
                  }
                }
                if(!angular.isUndefined(data.dtoResponseSetParametros)){
                  if(data.dtoResponseSetParametros.codigoError ==='104'){
                    style = 'warning';
                    message = data.dtoResponseSetParametros.msjError;
                  }
                }
              }

              if (!angular.isUndefined(data.dtoResponseSetResultados) && (data.dtoResponseSetResultados != null)) {

                if (data.dtoResponseSetResultados.codigoError === '104') {//Token Invalido
                  vm.statusTrue = true;
                  style = 'warning';
                  message = 'Por seguridad tu sesión a finalizado.';
                  $timeout(function () {
                    if (vm.statusTrue === true) {
                      $location.path('/inactivity-logout');
                    }
                  }, 1500);
                }
              }
              //history.back();
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '409') {
              descripcion = 'Envío de datos mal formateados'
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo == '423') {
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo == '500') {
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo == '204') {
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
              vm.statusTrue = false;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo == '101') {

              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              vm.statusTrue = true;
              style = 'warning';
              message = 'Por seguridad tu sesión a finalizado.';
              $timeout(function () {
                $location.path('/inactivity-logout');
              }, 1500);
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo == '202') {
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              message = data.dtoResponseCodigosEstadoHttp.mensaje;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              style = 'info';
              vm.statusTrue = false;
            }

            //trans
            if (data.dtoResponseCodigosEstadoHttp.codigo === '102') {
              //codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
              vm.statusTrue = false;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '103') {
              descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '106') {
              descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '107') {
              //descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              //message = data.dtoResponseCodigosEstadoHttp.mensaje;
              //codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
              vm.statusTrue = false;
            }

            if (data.dtoResponseCodigosEstadoHttp.codigo === '301') {
              /*descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;*/
              descripcion = data.dtoResponseCodigosEstadoHttp.descripcion;
              codigo = data.dtoResponseCodigosEstadoHttp.codigo;
              message = descripcion;
              style = 'warning';
              vm.statusTrue = false;
            }


            $timeout(function () {
              if (vm.statusTrue === true) {
                $location.path('/inactivity-logout');
              }
            }, 1500);

            vm.statusTrue = false;
            return reject({
              style: style,
              message: message,
              status: codigo,
            });
          }
        }

        if (data.dtoResponseCodigosEstado && data.dtoResponseCodigosEstado.codigo !== '0' && data.dtoResponseCodigosEstado.codigo  !=="200") {

          descripcion = 'Servicio no disponible. Intenta en algunos minutos más. Gracias';
          codigo = data.dtoResponseCodigosEstado.codigo;
          return reject({
            style: 'danger',
            message: descripcion,
            timeout: 5000,
            status: data.dtoResponseCodigosEstado.codigo,
          });
        }

        if (data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco &&
          data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco.codigoError &&
          data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco.codigoError !== '0') {
          descripcion = data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco.codigoError + ':';
          descripcion += data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco.descripcionError;
          codigo = data.dtoResponseDatosEstadoTransaccionesNoFacturadasBanco.codigoError;
          return reject({
            style: 'danger',
            message: descripcion,
            timeout: 5000,
            status: codigo,
          });
        }

        if (data.dtoResponseDatosEstadoProxyBanco &&
          data.dtoResponseDatosEstadoProxyBanco.codigo &&
          data.dtoResponseDatosEstadoProxyBanco.codigo !== '0') {
          codigo = data.dtoResponseDatosEstadoProxyBanco.codigo;
          descripcion = data.dtoResponseDatosEstadoProxyBanco.descripcionError ?
                        data.dtoResponseDatosEstadoProxyBanco.descripcionError : 'Error Inesperado';

          return reject({
            style: 'danger',
            message: descripcion,
            timeout: 5000,
            status: codigo,
          });
        }


        if (data.dtoResponseSetResultados && data.dtoResponseSetResultados.codigoError === '100') {// NO DATA
          descripcion = data.dtoResponseSetResultados.mensajeError;
          codigo = data.dtoResponseSetResultados.codigoError;
          if (angular.isUndefined(descripcion)) {
            descripcion = data.dtoResponseSetResultados.msjError;
          }
          return reject({
            style: 'info',
            message: descripcion,
            timeout: 3000,
            status: codigo,
          });
        }

        return resolve(data);
      
      })
    };
  }
   
}