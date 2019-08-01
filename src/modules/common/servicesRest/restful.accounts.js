export default class accountsRestFul {
    constructor ($resource){
      'ngInject';

        this.$resource = $resource;
        
        return $resource(null,null,{
          //nuevo
            Get_Data:{
                method      :'GET',
                isArray     : true,
                url         : "https://demo.medinet.cl/api/dashboard/productividad/?format=json",
            },
      });
    }
}