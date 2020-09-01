"use strict";

/**
* Permet de paramétrer la recherche d'adresse <br/>
* Créé un geocoder pour cesium qui uilise adict.strasbourg.eu
*/
class Geocoder {

  /**
  * constructeur de la classe Geocoder
  *
  * @param  {String} url le lien vers le géocoder à utiliser
  */
  constructor(url){
    this.url = url;
    this.viewer = Globe.viewer;

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

    return resource.fetchJson().then(function (results) {
      console.log(results);
      console.log(resource);
      return results.features.map(function (resultObject) {
        console.log(results.features);
        console.log(resultObject);

        /*var lonOuest = Cesium.Math.toRadians(resultObject.geometry.coordinates[0] - 0.0001);
        var latSud = Cesium.Math.toRadians(resultObject.geometry.coordinates[1] - 0.0001);
        var lonEst = Cesium.Math.toRadians(resultObject.geometry.coordinates[0] + 0.0001);
        var latNord = Cesium.Math.toRadians(resultObject.geometry.coordinates[1] + 0.0001);
        var zoom = new Cesium.Rectangle(lonOuest, latNord, lonEst, latSud);*/

        // on ajoute un billboard loupe à chaque résultat de recherche
        var adresse = [];
        var sol = Cesium.Cartesian3.fromDegrees(resultObject.geometry.coordinates[0], resultObject.geometry.coordinates[1], 0);
        var position = Cesium.Cartesian3.fromDegrees(resultObject.geometry.coordinates[0], resultObject.geometry.coordinates[1], 250);
        adresse.push(globe.createBillboard(position, 'src/img/billboard/icons8-chercher.png', false));

        // on trace une ligne jusqu'au sol
        var coordLigne = [sol, position];
        var lineAdresse = [];
        lineAdresse.push(globe.drawLine(coordLigne, 2, '#e0730d', 1, false));

        // on recentre le zoom empiriquement pour se rapprocher du photomaillage
        var cartesian = Cesium.Cartesian3.fromDegrees(resultObject.geometry.coordinates[0], resultObject.geometry.coordinates[1], 200);
        cartesian.x -= 600;
        cartesian.y -= 75;
        cartesian.z -= 700;

        // l'évènement qui supprime les loupes lorsqu'on appuie sur la recherche
        globe.viewer.geocoder.viewModel.search.afterExecute.addEventListener(function () {
          for(var i = 0; i < adresse.length; i++){
            globe.viewer.entities.remove(adresse[i]);
            globe.viewer.entities.remove(lineAdresse[i]);
          }
          for(var j = 0; j <= adresse.length+1; j++){
            adresse.pop();
            lineAdresse.pop();
          }
          globe.viewer.scene.requestRender();
        });


        return {
          displayName: resultObject.properties.label,
          destination: cartesian
        };

      });
    });

  }

}
