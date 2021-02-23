/**
  * La classe Tableau regroupe les fonctions qui permettent de charger les tableaux d'attributs spécifiques à chaque couche de donnée <br/>
  * Une fois créees ici, les fonctions sont appelées automatiquement dans la fonction load associée (sans devoir modifier la classe Globe),
  * à condition de définir l'attribut "choiceTableau" comme suivant: nom de la fonction = createTableau + 'choiceTableau' <br/>
  * Exemple pour les limites de communes, on a défini dans le json l'attribut choiceTableau = Communes, la fonction doit donc s'appeler createTableauCommunes
  * (attention aux majuscules) <br/>
  * Attention à respecter les paramètres en fonction des différentes fonction load
  *
  */


class TableauAttribut {

  //--------------------------------------------------------------------------------------------------------------------------
  // Les fonctions appelées dans la fonction loadPolygon
  // Note: les fonctions pour la fonction loadPolyline prennent les mêmes arguments

  /**
  *
  * Afficher le tableau d'attributs de la donnée Stationnement payant avec le bon format <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauStatpayant(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Tarif</td><td>' + String(entity.properties['libelle']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/stationnement-payant/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
  }
  
  /**
  *
  * Afficher le tableau d'attributs de la donnée Trafic_routier_Eurométropole avec le bon format <br/>
  * Utilisée dans loadPolyline
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolyline
  */
  createTableauTrafic(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
    entity.description += '<tr><td>Etat du trafic</td><td>' + String(entity.properties['etat']) + '</td></tr>';
    entity.description += '<tr><td>Date/heure de mise à jour</td><td>' + String(entity.properties['dmajetatexp']) + '</td></tr>';
    entity.description += '<tr><td>tauxlisse</td><td>' + String(entity.properties['tauxlisse']) + '</td></tr>';
    entity.description += '<tr><td>debitlisse</td><td>' + String(entity.properties['debitlisse']) + '</td></tr>';
    entity.description += '<tr><td>vitessebrp</td><td>' + String(entity.properties['vitessebrp']) + '</td></tr>';
    entity.description += '<tr><td>debit</td><td>' + String(entity.properties['debit']) + '</td></tr>';
    entity.description += '<tr><td>ident</td><td>' + String(entity.properties['ident']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/sirac_flux_trafic/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
  }

  
  createTableauParc(billboard, entity){
    // on nettoie les textes d'affichage des attributs (beaucoup de caractères parasites)
    var images = String(entity.properties['images']);
    var copy = [];
    if(images != undefined) {
      var subimages = images.split('{"imageURL": "');
      subimages.shift();
      for(let i=0;i<subimages.length;i++) {
        copy.push(subimages[i].split('"imageCopyright"'));
      }
      for(let i=0;i<copy.length;i++) {
        for(let j=1;j<copy[i].length;j=+2) {
          copy[i][j] = copy[i][j].replace(': "','Copyright photographie : © ');
          copy[i][j] = copy[i][j].replace('"},','');
          copy[i][j] = copy[i][j].replace('"}]','');
        }
      }
    }
    var name = String(entity.properties['name']);
    name = name.replace('"en_US": "Parc du Contades", "fr_FR": "', '');
    name = name.replace('", "de_DE": "Garten - Parc du Contades', '');
    name = name.replace('"en_US": "Botanical garden", "fr_FR": "', '');
    name = name.replace('", "de_DE": "Botanischer Garten', '');
    name = name.replace('"en_US": "Parc de la citadelle (Citadelle park)", "fr_FR": "', '');
    name = name.replace('", "de_DE": "Park der Zitadelle', '');
    var description = String(entity.properties['description']);
    description = description.replace('{"de_DE": "', '');
    description = description.replace('{"en_US": "', '');
    description = description.replace('{"fr_FR": "', '');
    description = description.replace('", "en_US": "', '');
    description = description.replace('", "de_DE": "', '');
    description = description.replace('", "fr_FR": "', '');
    description = description.replace(/\\n/g,'');
    description = description.replace('"}','');
    description = description.replace('{}','');
    description = description.replace(/\\"/g,'"');
    var acces = String(entity.properties['access']);
    acces = acces.replace('{"de_DE": "', '');
    acces = acces.replace('{"fr_FR": "', '');
    acces = acces.replace('{"en_US": "', '');
    acces = acces.replace('", "en_US": "', '');
    acces = acces.replace('", "fr_FR": "', '');
    acces = acces.replace('", "de_DE": "', '');
    acces = acces.replace(/\\n/g,'');
    acces = acces.replace(/\\t/g,'');
    acces = acces.replace('"}','');
    var serviceandactivities = String(entity.properties['serviceandactivities']);
    serviceandactivities = serviceandactivities.replace('{"de_DE": "', '');
    serviceandactivities = serviceandactivities.replace('{"fr_FR": "', '');
    serviceandactivities = serviceandactivities.replace('{"en_US": "', '');
    serviceandactivities = serviceandactivities.replace('", "en_US": "', '');
    serviceandactivities = serviceandactivities.replace('", "fr_FR": "', '');
    serviceandactivities = serviceandactivities.replace('", "de_DE": "', '');
    serviceandactivities = serviceandactivities.replace(/\\n/g,'');
    serviceandactivities = serviceandactivities.replace(/\\t/g,'');
    serviceandactivities = serviceandactivities.replace('"}','');

    //Renseignement des éléments de la boite d'information
    billboard.name = name ;
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['images'])) {
      for(let i=0;i<copy.length;i=+10) {
        for(let j=0;j<copy[i].length;j=+2) {
          billboard.description += '<figure><img src="' + copy[i][j] + '" align="center" width="99%"> <figcaption> ' + copy[i][j+1] + '</figcaption></figure>';
        }
      }
    }
    billboard.description += '<p>' + description + '</p>';
    billboard.description += '<tr><td>Nom</td><td>' + name + '</td></tr>';
    if (Cesium.defined(entity.properties['address'])) {
      billboard.description += '<tr><td>Adresse</td><td>' + String(entity.properties['address']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['access'])) {
      billboard.description += '<tr><td>Accès</td><td>' + acces + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['friendlyurl'])) {
      billboard.description += '<tr><td>Lien vers le site du parc</td><td> <a href="' + String(entity.properties['friendlyurl']) + '"target="_blank">Lien</a></td></tr>';
    }
    if (Cesium.defined(entity.properties['serviceandactivities'])) {
      billboard.description += '<tr><td>Services et activités</td><td>' + serviceandactivities + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['documents'])) {
      billboard.description += '<tr><td>Documents</td><td> <a href="' + String(entity.properties['documents']) + '"target="_blank">Lien vers la présentation</a></td></tr>';
    }
    billboard.description +='</tbody></table><br/>';

    if (Cesium.defined(entity.properties['images'])) {
      for(let i=1;i<copy.length;i++) {
        for(let j=0;j<copy[i].length;j+=2) {
          billboard.description += '<figure><img src="' + copy[i][j] + '" align="center" width="99%"> <figcaption> ' + copy[i][j+1] + '</figcaption></figure>';
          billboard.description += '<br/><br/>';
        }
      }
    }

    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_parcs/information/" target="_blank">Informations sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs de la donnée Vitaboucle avec le bon format <br/>
  * Utilisée dans loadPolyline
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolyline
  */
  createTableauVitaboucle(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Commune</td><td>' + String(entity.properties['commune']) + '</td></tr>';
    entity.description += '<tr><td>Distance</td><td>' + String(entity.properties['distance']) + '</td></tr>';
    entity.description += '<tr><td>Difficulté</td><td>' + String(entity.properties['difficulte']) + '</td></tr>';
    entity.description += '<tr><td>Numéro</td><td>' + String(entity.properties['numero']) + '</td></tr>';
    entity.description += '<tr><td>Longueur du parcours</td><td>' + String(entity.properties['long_km']) + '</td></tr>';
    entity.description += '<tr><td>Nom</td><td>' + String(entity.properties['nom']) + '</td></tr>';
    entity.description += '<tr><td>Identifiant</td><td>' + String(entity.properties['id']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/boucles_sportives_vitaboucle/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs de la donnée fréquentation en temps réel des piscines avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {json} jsonAttribut l'objet Json attributaire qu'on charge par dessus le GeoJson
  * @param  {Array} billboard le tableau qui sert à stocker le CustomDataSource dans lequel on range les billboardData
  * @param  {Cartesian3} coordLabel les coordonnées du label
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  *
  */
  createTableauPiscine(entity, jsonAttribut, billboard, coordLabel, dataSource) {
    // on nettoie les textes d'affichage des attributs (beaucoup de caractères parasites)
    var acces = String(entity.properties['access']);
    acces = acces.replace('{"fr_FR": "', '');
    acces = acces.replace(/\\n/g,'');
    acces = acces.replace(/\\t/g,'');
    acces = acces.replace(/\\/g,'');
    acces = acces.replace('"}','');
    var service = String(entity.properties['serviceandactivities']);
    service = service.replace('{"fr_FR": "', '');
    service = service.replace(/\\n/g,'');
    service = service.replace(/\\t/g,'');
    service = service.replace('"}','');
    var caracteristique = String(entity.properties['characteristics']);
    caracteristique = caracteristique.replace('{"fr_FR": "', '');
    caracteristique = caracteristique.replace(/\\n/g,'');
    caracteristique = caracteristique.replace(/\\t/g,'');
    caracteristique = caracteristique.replace(/\\/g,'');
    caracteristique = caracteristique.replace('"}','');
    var exception = String(entity.properties['exceptionalschedule']);
    exception = exception.replace('{"fr_FR": "', '');
    exception = exception.replace(/\\n/g,'');
    exception = exception.replace(/\\/g,'');
    exception = exception.replace('"}','');
    var description = String(entity.properties['description']);
    description = description.replace('{"fr_FR": "', '');
    // pour que les liens dans la description fonctionnent
    description = description.replace(/href=\\"/g, 'href=https://www.strasbourg.eu');
    description = description.replace(/src=\\"/g,'src=https://www.strasbourg.eu');
    description = description.replace(/<a/g,'<a target=_blank');
    description = description.replace(/style=\\"width: 300px;/g,'style=\\"align: center; width: 99%;');
    description = description.replace(/\\n/g,'');
    description = description.replace(/\\t/g,'');
    description = description.replace('"}','');
    description = description.replace('{}','');
    var info = String(entity.properties['additionalinformation']);
    info = info.replace('{"fr_FR": "', '');
    info = info.replace(/href=\\"/g, 'href="https://www.strasbourg.eu');
    info = info.replace(/src=\\"/g,'src=https://www.strasbourg.eu');
    info = info.replace(/<a/g,'<a target=_blank');
    info = info.replace('"}','');

    // Renseignement des éléments de la boite d'information
    billboard.name = String(entity.properties['name']);
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['imageurl'])) {
      billboard.description += '<img src="' + String(entity.properties['imageurl']) + '"align="center" width="99%">';
    }

    billboard.description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
    billboard.description += '<tr><td>Mail</td><td>' + String(entity.properties['mail']) + '</td></tr>';
    billboard.description += '<tr><td>Téléphone </td><td>' + String(entity.properties['phone']) + '</td></tr>';
    billboard.description += '<tr><td>Adresse </td><td>' + String(entity.properties['address']) + '</td></tr>';
    billboard.description += '<tr><td>Accès </td><td>' + acces + '</td></tr>';
    billboard.description += '<tr><td>Lien vers le site de la piscine</td><td>' + '<a href= "' + String(entity.properties['friendlyurl']) + '" target="_blank"> '+ String(entity.properties['friendlyurl']) +' </a></td></tr>';

    // on rentre dans le fichier json chargé pour récupérer les attributs
    for(let j = 0; j < jsonAttribut.length; j++) {
      if(entity.name == jsonAttribut[j].fields.name) {
        billboard.description += '<tr><td>Statut</td><td>' + String(jsonAttribut[j].fields.realtimestatus) + '</td></tr>';
        billboard.description += '<tr><td>Occupation </td><td>' + String(jsonAttribut[j].fields.occupation) + '</td></tr>';
        billboard.description += '<tr><td>Heure de mise à jour </td><td>' + String(jsonAttribut[j].fields.updatedate) + '</td></tr>';

        // on définit le texte à afficher sur le label, soit le chiffre d'occupation soit 'closed'
        if(Cesium.defined(jsonAttribut[j].fields.occupation)) {
          var occupation = (jsonAttribut[j].fields.occupation).toString();
        } else {
          var occupation = 'CLOSED';
        }

        // on ajoute le label
        var statut = dataSource.entities.add({
          position : coordLabel,
          label : {
            text : occupation,
            font : '24px Helvetica',
            outlineColor: Cesium.Color.fromCssColorString('#666a70'),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            style : Cesium.LabelStyle.FILL_AND_OUTLINE,
            scaleByDistance : new Cesium.NearFarScalar(10000, 1, 150000, 0),
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#a4a7ab')
          }
        });

        // classification du label en différentes couleurs en fonction de la fréquentation
        if(jsonAttribut[j].fields.realtimestatus === 'GREEN') {
          statut.label.fillColor = Cesium.Color.fromCssColorString('#1d9c1a');
        } else if(jsonAttribut[j].fields.realtimestatus === 'ORANGE') {
          statut.label.fillColor = Cesium.Color.fromCssColorString('#d47808');
        } else if(jsonAttribut[j].fields.realtimestatus === 'RED') {
          statut.label.fillColor = Cesium.Color.fromCssColorString('#e61207');
        } else if(jsonAttribut[j].fields.realtimestatus === 'BLACK') {
          statut.label.fillColor = Cesium.Color.fromCssColorString('#1a1515');
        } else if(jsonAttribut[j].fields.realtimestatus === 'CLOSED') {
          statut.label.fillColor = Cesium.Color.fromCssColorString('#FFFFFF');
        }

      }
    }

    // le reste du tableau d'attributs
    if (Cesium.defined(entity.properties['serviceandactivities'])) {
      billboard.description += '<tr><td>Services et activités </td><td>' + service + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['characteristics'])) {
      billboard.description += '<tr><td>Caractéristiques </td><td>' + caracteristique + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['exceptionalschedule'])) {
      billboard.description += '<tr><td>Mesures exceptionnelles </td><td>' + exception + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['additionalinformation'])) {
      billboard.description += '<tr><td>Informations supplémentaires </td><td>' + info + '</td></tr>';
    }

    billboard.description +='</tbody></table><br/>';
    billboard.description += '<p>' + description + '</p>';
    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_piscines/information/" target="_blank">Informations sur les données</a><br/><br/>';

  }
/**
*
* Afficher le tableau d'attributs de la donnée Qualite_Air_Eurométropole avec le bon format <br/>
* Utilisée dans loadTimeSurf
*
* @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
*/
createTableauQualiteAir(entity){
    //Renseignement des éléments de la boite d'information
    entity.name = 'Qualité air communes Eurométropole'
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Date d\'échéance (AAAA/MM/JJ)</td><td>' + String(entity.properties['date_echeance']) + '</td></tr>';
    entity.description += '<tr><td>Qualificatif</td><td>' + String(entity.properties['qualificatif']) + '</td></tr>';
    entity.description += '<tr><td>Valeur</td><td>' + String(entity.properties['valeur']) + '</td></tr>';
    entity.description += '<tr><td>Commune</td><td>' + String(entity.properties['lib_zone']) + '</td></tr>';
    entity.description += '<tr><td>Code zone</td><td>' + String(entity.properties['code_zone']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/qualite-de-lair-communes-eurometropole/information/" target="_blank" rel="noopener">Informations sur les données</a><br/><br/>';
  }





}

