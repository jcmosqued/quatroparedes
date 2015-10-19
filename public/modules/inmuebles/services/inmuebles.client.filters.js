(function () {
    'use strict';

    var filterModule = angular.module('cmFilter', []);
    
    filterModule.filter('MayorX', function () {
        return function (inmuebles, precio) {
            var result = [];
            if (!precio) precio = 0;

            if (inmuebles) {
                inmuebles.forEach(function (inmueble) {
                    if (inmueble.Edad > precio) {
                        result.push(inmueble);
                    }
                });
            }

            return result;
        }
    });
}());