"use strict";

/* Créé un geocoder pour cesium qui uilise adict.strasbourg.eu */
class Geocoder {

  /**
  * constructeur de la classe Geocoder
  *
  * @param  {String} url le lien vers le géocoder à utiliser
  */
    constructor(url){
        this.url = url;
    }

    /**
    * Fonction appelée automatiquement par cesium dans laquelle on reçoit ce que l’utilisateur a entré dans la barre de recherche
    *
    * @param  {Object} input le résultat de la recherche de l'utilisateur
    */
    geocode(input){
        let resource = new Cesium.Resource({
            url: this.url,
            queryParameters: {
                q: input
            }
        });

        return resource.fetchJson()
            .then(function (results) {
                return results.features.map(function (resultObject) {
                    return {
                        displayName: resultObject.properties.label,
                        destination: Cesium.Cartesian3.fromDegrees(resultObject.geometry.coordinates[0], resultObject.geometry.coordinates[1], 1)
                    };
                });
            });
    }

}
