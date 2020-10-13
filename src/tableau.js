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
  * Afficher le tableau d'attributs de la donnée PLUi_Plan_de_zonage avec le bon format <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauPLU(entity, dataSource) {
    //Renseignement des éléments de la boite d'information
    entity.description ='<br/><table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['photo'])) {
      entity.description += '<img src="https://sig.strasbourg.eu/datastrasbourg/plu_media/ims_zone/' + String(entity.properties['photo']) + '" align="center" width="99%">';
    }
    if (Cesium.defined(entity.properties['paraph01'])) {
      entity.description += '<p>' + String(entity.properties['paraph01']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph02'])) {
      entity.description += '<p>' + String(entity.properties['paraph02']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph03'])) {
      entity.description += '<p>' + String(entity.properties['paraph03']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph04'])) {
      entity.description += '<p>' + String(entity.properties['paraph04']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph05'])) {
      entity.description += '<p>' + String(entity.properties['paraph05']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph06'])) {
      entity.description += '<p>' + String(entity.properties['paraph06']) + '</p>';
    }
    if (Cesium.defined(entity.properties['paraph07'])) {
      entity.description += '<p>' + String(entity.properties['paraph07']) + '</p><br/><br/>';
    }
    entity.description += '<tr><td>Commune </td><td>' + String(entity.properties['commune']) + '</td></tr>';
    entity.description += '<tr><td>Zone </td><td>' + String(entity.properties['main_type']) + '</td></tr>';
    entity.description += '<tr><td>Secteur </td><td>' + String(entity.properties['type']) + '</td></tr>';
    entity.description += '<tr><td>Hauteur maximale </td><td>' + String(entity.properties['ht_aff']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';

    if (Cesium.defined(entity.properties['page'])) {
      entity.description += '<a href="https://sig.strasbourg.eu/datastrasbourg/plu_media/reglement_actuel.pdf#page=' + String(entity.properties['page']) + '" target="_blank">Lien vers le règlement de la zone</a><br/><br/>';
    }
    if (Cesium.defined(entity.properties['commune'])) {
      entity.description += '<a href="https://sig.strasbourg.eu/datastrasbourg/plu_media/pdf_commune/' + String(entity.properties['commune']) + '.pdf" target="_blank">Lien vers la présentation de la commune</a><br/><br/>';
    }
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/plu_zone_urba/information/" target="_blank" rel="noopener">Informations sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs de la donnée Limites_de_communes avec le bon format <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauCommunes(entity, dataSource) {

    let longitudeNom = entity._properties.geo_point_2d._value[1];
    let latitudeNom = entity._properties.geo_point_2d._value[0];

    // on positionne le texte des communes (car en plusieurs morceaux)
    if (entity._properties.nom._value == 'Schiltigheim') {
      latitudeNom = latitudeNom - 0.0055;
    };
    if (entity._properties.nom._value == 'Bischheim') {
      latitudeNom = latitudeNom - 0.0055;
    };

    // on ajoute une étiquette avec le nom de la commune
    dataSource.entities.add({
      name : entity._properties.nom._value + '_' + entity._properties.num_com._value,
      position : Cesium.Cartesian3.fromDegrees(longitudeNom,latitudeNom,280),
      label : {
        text : entity._properties.nom._value,
        font : '24px Helvetica',
        fillColor : Cesium.Color.WHITE,
        outlineColor : Cesium.Color.BLACK,
        outlineWidth : 2,
        style : Cesium.LabelStyle.FILL_AND_OUTLINE,
        scaleByDistance : new Cesium.NearFarScalar(10000, 1, 150000, 0),
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM
      }
    });

    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Département </td><td>' + String(entity.properties['num_dept']) + '</td></tr>';
    entity.description += '<tr><td>Commune </td><td>' + String(entity.properties['nom']) + '</td></tr>';
    entity.description += '<tr><td>Code INSEE </td><td>' + String(entity.properties['num_com']) + '</td></tr>';
    entity.description += '<tr><td>Source </td><td>' + String(entity.properties['source']) + '</td></tr>';
    entity.description += '<tr><td>Date export </td><td>' + String(entity.properties['date_exprt']) + '</td></tr>';
    entity.description += '<tr><td>Code précision </td><td>' + String(entity.properties['code_preci']) + '</td></tr>';
    entity.description += '<tr><td>Licence </td><td>' + String(entity.properties['licence']) + '</td></tr>';
    entity.description +='</tbody></table>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/limites_de_communes/information/" target="_blank" rel="noopener">Informations sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs de la donnée Limite de sections avec le bon format  <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauSections(entity, dataSource) {

    let longitudeNom = entity._properties.geo_point_2d._value[1];
    let latitudeNom = entity._properties.geo_point_2d._value[0];
    dataSource.entities.add({
      name : entity._properties.nom_com._value + '_SECTION ' + entity._properties.n_section._value,
      position : Cesium.Cartesian3.fromDegrees(longitudeNom,latitudeNom,280),
      label : {
        text : entity._properties.n_section._value,
        font : '24px Helvetica',
        showBackground : true,
        fillColor : Cesium.Color.WHITE,
        outlineColor : Cesium.Color.BLACK,
        outlineWidth : 2,
        style : Cesium.LabelStyle.FILL_AND_OUTLINE,
        scaleByDistance : new Cesium.NearFarScalar(5000, 0.8, 100000, 0),
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM
      }
    });

    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Commune </td><td>' + String(entity.properties['nom_com']) + '</td></tr>';
    entity.description += '<tr><td>Code INSEE </td><td>' + String(entity.properties['num_com']) + '</td></tr>';
    entity.description += '<tr><td>Numéro SECTION </td><td>' + String(entity.properties['n_section']) + '</td></tr>';
    entity.description += '<tr><td>Source </td><td>' + String(entity.properties['source']) + '</td></tr>';
    entity.description += '<tr><td>Date export </td><td>' + String(entity.properties['date_exprt']) + '</td></tr>';
    entity.description += '<tr><td>Licence </td><td>' + String(entity.properties['licence']) + '</td></tr>';
    entity.description +='</tbody></table>';
  }

  /**
  *
  * Afficher le tableau d'attributs des couches de données du parcellaire cadastral avec le bon format <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauCadastre(entity, dataSource) {
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Département </td><td>' + String(entity.properties['num_dept']) + '</td></tr>';
    switch (String(entity.properties['num_com'])) {
      case '049':
      entity.description += '<tr><td>Commune </td><td>BLAESHEIM</td></tr>'
      break;
      case '152':
      entity.description += '<tr><td>Commune </td><td>GEISPOLSHEIM</td></tr>'
      break;
      case '001':
      entity.description += '<tr><td>Commune </td><td>ACHENHEIM</td></tr>'
      break;
      case '043':
      entity.description += '<tr><td>Commune </td><td>BISCHHEIM</td></tr>'
      break;
      case '065':
      entity.description += '<tr><td>Commune </td><td>BREUSCHWICKERSHEIM</td></tr>'
      break;
      case '118':
      entity.description += '<tr><td>Commune </td><td>ECKBOLSHEIM</td></tr>'
      break;
      case '119':
      entity.description += '<tr><td>Commune </td><td>ECKWERSHEIM</td></tr>'
      break;
      case '124':
      entity.description += '<tr><td>Commune </td><td>ENTZHEIM</td></tr>'
      break;
      case '131':
      entity.description += '<tr><td>Commune </td><td>ESCHAU</td></tr>'
      break;
      case '137':
      entity.description += '<tr><td>Commune </td><td>FEGERSHEIM</td></tr>'
      break;
      case '182':
      entity.description += '<tr><td>Commune </td><td>HANGENBIETEN</td></tr>'
      break;
      case '204':
      entity.description += '<tr><td>Commune </td><td>HOENHEIM</td></tr>'
      break;
      case '212':
      entity.description += '<tr><td>Commune </td><td>HOLTZHEIM</td></tr>'
      break;
      case '218':
      entity.description += '<tr><td>Commune </td><td>ILLKIRCH-GRAFFENSTADEN</td></tr>'
      break;
      case '247':
      entity.description += '<tr><td>Commune </td><td>KOLBSHEIM</td></tr>'
      break;
      case '256':
      entity.description += '<tr><td>Commune </td><td>LAMPERTHEIM</td></tr>'
      break;
      case '267':
      entity.description += '<tr><td>Commune </td><td>LINGOLSHEIM</td></tr>'
      break;
      case '268':
      entity.description += '<tr><td>Commune </td><td>LIPSHEIM</td></tr>'
      break;
      case '296':
      entity.description += '<tr><td>Commune </td><td>MITTELHAUSBERGEN</td></tr>'
      break;
      case '309':
      entity.description += '<tr><td>Commune </td><td>MUNDOLSHEIM</td></tr>'
      break;
      case '326':
      entity.description += '<tr><td>Commune </td><td>NIEDERHAUSBERGEN</td></tr>'
      break;
      case '343':
      entity.description += '<tr><td>Commune </td><td>OBERHAUSBERGEN</td></tr>'
      break;
      case '350':
      entity.description += '<tr><td>Commune </td><td>OBERSCHAEFFOLSHEIM</td></tr>'
      break;
      case '363':
      entity.description += '<tr><td>Commune </td><td>OSTHOFFEN</td></tr>'
      break;
      case '365':
      entity.description += '<tr><td>Commune </td><td>OSTWALD</td></tr>'
      break;
      case '378':
      entity.description += '<tr><td>Commune </td><td>PLOBSHEIM</td></tr>'
      break;
      case '389':
      entity.description += '<tr><td>Commune </td><td>REICHSTETT</td></tr>'
      break;
      case '447':
      entity.description += '<tr><td>Commune </td><td>SCHILTIGHEIM</td></tr>'
      break;
      case '471':
      entity.description += '<tr><td>Commune </td><td>SOUFFELWEYERSHEIM</td></tr>'
      break;
      case '482':
      entity.description += '<tr><td>Commune </td><td>STRASBOURG</td></tr>'
      break;
      case '506':
      entity.description += '<tr><td>Commune </td><td>VENDENHEIM</td></tr>'
      break;
      case '519':
      entity.description += '<tr><td>Commune </td><td>LA_WANTZENAU</td></tr>'
      break;
      case '551':
      entity.description += '<tr><td>Commune </td><td>WOLFISHEIM</td></tr>'
      break;
      default:
      entity.description += '<tr><td>Commune </td><td>Inconnue</td></tr>'
    }
    entity.description += '<tr><td>Section </td><td>' + String(entity.properties['n_section']) + '</td></tr>';
    entity.description += '<tr><td>Parcelle </td><td>' + String(entity.properties['n_parcelle']) + '</td></tr>';
    //entity.description += '<tr><td>Code précision </td><td>' + String(entity.properties['code_preci']) + '</td></tr>';
    entity.description += '<tr><td>Source </td><td>' + String(entity.properties['source']) + '</td></tr>';
    entity.description += '<tr><td>Date export </td><td>' + String(entity.properties['date_exprt']) + '</td></tr>';
    entity.description += '<tr><td>Licence </td><td>' + String(entity.properties['licence']) + '</td></tr>';
    entity.description +='</tbody></table>';
  }

  /**
  *
  * Afficher le tableau d'attributs de la donnée Emplacement_réservé avec le bon format <br/>
  * Utilisée dans loadPolygon
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  */
  createTableauER(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.name = 'Emplacement réservé n°  ' + String(entity.properties['er_numero']);
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<hr/>'
    entity.description += '<p>' + String(entity.properties['er_designation']) + '<p/>';
    entity.description += '<hr/><br/>'
    entity.description += '<tr><td>Bénéficiaire</td><td>' + String(entity.properties['er_beneficiaire']) + '</td></tr>';
    entity.description += '<tr><td>Commune</td><td>' + String(entity.properties['commune']) + '</td></tr>';
    entity.description += '<tr><td>Surface (m²)</td><td>' + String(entity.properties['surf_m2']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/plu_prescription_s/information/" target="_blank" rel="noopener">Informations sur les données</a><br/><br/>';
  }

  createTableauParkres(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Zone</td><td>' + String(entity.properties['numero']) + '</td></tr>';
    entity.description += '<tr><td>Détails</td><td>' + '<a href= "' + String(entity.properties['url_pdf']) + '" target="_blank"> zone ' + String(entity.properties['numero']) +' </a></td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/stationnement_residant/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
  }

  createTableauStatpayant(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Tarif</td><td>' + String(entity.properties['libelle']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/stationnement-payant/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
  }

    //--------------------------------------------------------------------------------------------------------------------------
    // Les fonctions appelées dans la fonction loadPolyline


  /**
  *
  * Afficher le tableau d'attributs de la donnée Traffic_routier_Eurométropole avec le bon format <br/>
  * Utilisée dans loadPolyline
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolyline
  */
  createTableauTraffic(entity, dataSource){
    //Renseignement des éléments de la boite d'information
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Nom</td><td>' + String(entity.properties['nom']) + '</td></tr>';
    entity.description += '<tr><td>Etat du traffic</td><td>' + String(entity.properties['etat']) + '</td></tr>';
    entity.description += '<tr><td>Date/heure de mise à jour</td><td>' + String(entity.properties['dmajetatexp']) + '</td></tr>';
    entity.description += '<tr><td>tauxlisse</td><td>' + String(entity.properties['tauxlisse']) + '</td></tr>';
    entity.description += '<tr><td>debitlisse</td><td>' + String(entity.properties['debitlisse']) + '</td></tr>';
    entity.description += '<tr><td>vitessebrp</td><td>' + String(entity.properties['vitessebrp']) + '</td></tr>';
    entity.description += '<tr><td>debit</td><td>' + String(entity.properties['debit']) + '</td></tr>';
    entity.description += '<tr><td>ident</td><td>' + String(entity.properties['ident']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/trafic-routier-eurometropole/information/" target="_blank" rel="noopener">Informations sur les données</a><br/>';
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


  //--------------------------------------------------------------------------------------------------------------------------
  // Les fonctions appelées dans la fonction loadPoint

  /**
  *
  * Afficher le tableau d'attributs de la donnée Patrimoine de mon quartier avec le bon format<br/>
  * Utilisée dans loadPoint
  *
  * @param  {Array} billboard le billboard auquel on va lier l'attribut de l'entité
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauPatrimoine(billboard, entity){
    //Renseignement des éléments de la boite d'information
    billboard.name = String(entity.properties['nom_du_patrimoine']);
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['photo'])) {
      billboard.description += '<img src="https://sig.strasbourg.eu/datastrasbourg/patrimoine_quartier/' + String(entity.properties['photo']) + '" align="center" width="99%">';
    }
    billboard.description += '<p>' + String(entity.properties['texte_de_presentation']) + '</p>';
    billboard.description += '<tr><td>Nom</td><td>' + String(entity.properties['nom_du_patrimoine']) + '</td></tr>';
    if (Cesium.defined(entity.properties['adresse'])) {
      billboard.description += '<tr><td>Adresse</td><td>' + String(entity.properties['adresse']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['quartier'])) {
      billboard.description += '<tr><td>Quartier</td><td>' + String(entity.properties['quartier']) + '</td></tr>';
    }
    billboard.description += '<tr><td>Quartier calculé</td><td>' + String(entity.properties['quartier_calcule']) + '</td></tr>';
    billboard.description += '<tr><td>Type de patrimoine </td><td>' + String(entity.properties['type_de_patrimoine']) + '</td></tr>';
    if (Cesium.defined(entity.properties['ancienne_denomination'])) {
      billboard.description += '<tr><td>Ancienne dénomination</td><td>' + String(entity.properties['ancienne_denomination']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['nouvelle_denomination'])) {
      billboard.description += '<tr><td>Nouvelle dénomination</td><td>' + String(entity.properties['nouvelle_denomination']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['architecte'])) {
      billboard.description += '<tr><td>Architecte</td><td>' + String(entity.properties['architecte']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['annee_construction'])) {
      billboard.description += '<tr><td>Année de construction</td><td>' + String(entity.properties['annee_construction']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['copyright_photo'])) {
      billboard.description += '<tr><td>Source photographie </td><td>' + String(entity.properties['copyright_photo']) + '</td></tr>';
    }
    billboard.description += '<tr><td>Source donnée </td><td>' + String(entity.properties['source']) + '</td></tr>';
    billboard.description +='</tbody></table><br/>';

    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/patrimoine_quartier/information/" target="_blank" rel="noopener">Informations sur les données</a><br/><br/>';
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

  createTableauLieuCulturel(billboard, entity){
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
    if(name.includes('"fr_FR":')) {
      name = name.substring(name.indexOf('"fr_FR": "'), name.indexOf('", "de_DE": "'));
      name = name.replace('"fr_FR": "','');
    }
    var description = String(entity.properties['description']);
    description = description.replace(/<a/g,'<a target=_blank');
    description = description.replace(/{"de_DE": "/g, '');
    description = description.replace(/{"fr_FR": "/g, '');
    description = description.replace(/{"en_US": "/g, '');
    description = description.replace(/", "en_US": "/g, '');
    description = description.replace(/", "de_DE": "/g, '');
    description = description.replace('", "fr_FR": "', '');
    description = description.replace(/\\n/g,'');
    description = description.replace(/\\t/g,'');
    description = description.replace('"}','');
    description = description.replace('{}','');
    description = description.replace(/\\"/g,'"');
    var characteristics = String(entity.properties['characteristics']);
    characteristics = characteristics.replace(/{"de_DE": "/g, '');
    characteristics = characteristics.replace(/{"fr_FR": "/g, '');
    characteristics = characteristics.replace(/{"en_US": "/g, '');
    characteristics = characteristics.replace(/", "en_US": "/g, '');
    characteristics = characteristics.replace(/", "de_DE": "/g, '');
    characteristics = characteristics.replace('", "fr_FR": "', '');
    characteristics = characteristics.replace(/\\n/g,'');
    characteristics = characteristics.replace(/\\t/g,'');
    characteristics = characteristics.replace('"}','');
    characteristics = characteristics.replace('{}','');
    characteristics = characteristics.replace(/\\"/g,'"');
    var typelieu = String(entity.properties['types']);
    typelieu = typelieu.replace('Cat_08_01;', '');
    var accesslieu = String(entity.properties['access']);
    accesslieu = accesslieu.replace(/href=\\"/g, 'href="https://www.strasbourg.eu');
    accesslieu = accesslieu.replace('{"de_DE": "', '');
    accesslieu = accesslieu.replace('{"fr_FR": "', '');
    accesslieu = accesslieu.replace('{"en_US": "', '');
    accesslieu = accesslieu.replace('", "en_US": "', '');
    accesslieu = accesslieu.replace('", "de_DE": "', '');
    accesslieu = accesslieu.replace('", "fr_FR": "', '');
    accesslieu = accesslieu.replace(/\\n/g,'');
    accesslieu = accesslieu.replace(/\\t/g,'');
    accesslieu = accesslieu.replace('"}','');
    accesslieu = accesslieu.replace('{}','');
    accesslieu = accesslieu.replace(/\\"/g,'"');

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
    if (Cesium.defined(entity.properties['types'])) {
      billboard.description += '<tr><td>Type de lieu</td><td>' + typelieu + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['address'])) {
      billboard.description += '<tr><td>Adresse</td><td>' + String(entity.properties['address']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['access'])) {
      billboard.description += '<tr><td>Accès</td><td>' + accesslieu + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['friendlyurl'])) {
      billboard.description += '<tr><td>Lien vers la page de présentation du lieu</td><td> <a href="' + String(entity.properties['friendlyurl']) + '"target="_blank">Lien</a></td></tr>';
    }
    if (Cesium.defined(entity.properties['mail'])) {
      billboard.description += '<tr><td>Mail</td><td>' + String(entity.properties['mail']) + '</td></tr>';
    }
    billboard.description +='</tbody></table><br/>';
    if (Cesium.defined(entity.properties['characteristics'])) {
      billboard.description += '<p>' + characteristics + '</p>';
    }

    if (Cesium.defined(entity.properties['images'])) {
      for(let i=1;i<copy.length;i++) {
        for(let j=0;j<copy[i].length;j+=2) {
          billboard.description += '<figure><img src="' + copy[i][j] + '" align="center" width="99%"> <figcaption> ' + copy[i][j+1] + '</figcaption></figure>';
          billboard.description += '<br/><br/>';
        }
      }
    }

    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_culture/information/" target="_blank">Informations sur les données</a><br/><br/>';
  }

  createTableauArbresRemarquables(billboard, entity){
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

    var description = String(entity.properties['description']);
    description = description.replace(/{"de_DE": "/g, '');
    description = description.replace(/{"fr_FR": "/g, '');
    description = description.replace(/{"en_US": "/g, '');
    description = description.replace(/", "en_US": "/g, '');
    description = description.replace(/", "de_DE": "/g, '');
    description = description.replace('", "fr_FR": "', '');
    description = description.replace(/\\n/g,'');
    description = description.replace(/\\t/g,'');
    description = description.replace('"}','');
    description = description.replace('{}','');
    description = description.replace(/\\"/g,'"');
    var characteristics = String(entity.properties['characteristics']);
    characteristics = characteristics.replace(/{"de_DE": "/g, '');
    characteristics = characteristics.replace(/{"fr_FR": "/g, '');
    characteristics = characteristics.replace(/{"en_US": "/g, '');
    characteristics = characteristics.replace(/", "en_US": "/g, '');
    characteristics = characteristics.replace(/", "de_DE": "/g, '');
    characteristics = characteristics.replace('", "fr_FR": "', '');
    characteristics = characteristics.replace(/\\n/g,'');
    characteristics = characteristics.replace(/\\t/g,'');
    characteristics = characteristics.replace('"}','');
    characteristics = characteristics.replace('{}','');
    characteristics = characteristics.replace(/\\"/g,'"');


    //Renseignement des éléments de la boite d'information
    billboard.name = String(entity.properties['name']);
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['images'])) {
      for(let i=0;i<copy.length;i=+10) {
        for(let j=0;j<copy[i].length;j=+2) {
          billboard.description += '<figure><img src="' + copy[i][j] + '" align="center" width="99%"> <figcaption> ' + copy[i][j+1] + '</figcaption></figure>';
        }
      }
    }
    billboard.description += '<p>' + description + '</p>';
    billboard.description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
    if (Cesium.defined(entity.properties['address'])) {
      billboard.description += '<tr><td>Adresse</td><td>' + String(entity.properties['address']) + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['characteristics'])) {
      billboard.description += '<tr><td>Caratéristiques</td><td>' + characteristics + '</td></tr>';
    }
    if (Cesium.defined(entity.properties['friendlyurl'])) {
      billboard.description += '<tr><td>Lien vers la page de présentation du lieu</td><td> <a href="' + String(entity.properties['friendlyurl']) + '"target="_blank">Lien</a></td></tr>';
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
    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_arbres-remarquables/information/" target="_blank">Informations sur les données</a><br/><br/>';
  }

  //--------------------------------------------------------------------------------------------------------------------------
  // Les fonctions appelées dans la fonction loadTimeJson


/**
*
* Afficher le tableau d'attributs de la donnée Qualite_Air_Eurométropole avec le bon format <br/>
* Utilisée dans loadTimeJson
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


  //--------------------------------------------------------------------------------------------------------------------------
  // Les fonctions appelées dans la fonction loadJsonAttribut


  /**
  *
  * Afficher le tableau d'attributs de la donnée fréquentation en temps réel avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  * @param  {json} jsonAttribut l'objet Json attributaire qu'on charge par dessus le GeoJson
  * @param  {Array} billboard le tableau qui sert à stocker le CustomDataSource dans lequel on range les billboardData
  * @param  {Cartesian3} coordLabel les coordonnées du label
  * @param  {promise} dataSource le GeoJsonDataSource en promise dans la fonction loadPolygon
  *
  */
  createTableauParkings(entity, jsonAttribut, billboard, coordLabel, dataSource) {
    // on nettoie les textes d'affichage des attributs (beaucoup de caractères parasites)


    // Renseignement des éléments de la boite d'information
    // billboard.name = String(entity.properties['name']);
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    // if (Cesium.defined(entity.properties['imageurl'])) {
    //   billboard.description += '<img src="' + String(entity.properties['imageurl']) + '"align="center" width="99%">';
    // }
    //
    // billboard.description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
    // billboard.description += '<tr><td>Mail</td><td>' + String(entity.properties['mail']) + '</td></tr>';
    // billboard.description += '<tr><td>Téléphone </td><td>' + String(entity.properties['phone']) + '</td></tr>';
    // billboard.description += '<tr><td>Adresse </td><td>' + String(entity.properties['address']) + '</td></tr>';
    // billboard.description += '<tr><td>Accès </td><td>' + acces + '</td></tr>';
    // billboard.description += '<tr><td>Lien vers le site de la piscine</td><td>' + '<a href= "' + String(entity.properties['friendlyurl']) + '" target="_blank"> '+ String(entity.properties['friendlyurl']) +' </a></td></tr>';

    // on rentre dans le fichier json chargé pour récupérer les attributs
    for(let j = 0; j < jsonAttribut.length; j++) {
      if(entity.name == jsonAttribut[j].fields.nom_parking) {
        console.log(jsonAttribut[j]);
        billboard.description += '<tr><td>Informations Usagers</td><td>' + String(jsonAttribut[j].fields.infousager) + '</td></tr>';
        billboard.description += '<tr><td>Nombre total de places</td><td>' + String(jsonAttribut[j].fields.total) + '</td></tr>';
        billboard.description += '<tr><td>Nombres de places libres</td><td>' + String(jsonAttribut[j].fields.libre) + '</td></tr>';

        // on définit le texte à afficher sur le label, soit le chiffre d'occupation soit 'closed'
        if(jsonAttribut[j].fields.etat === 1) {
          var occupation = (jsonAttribut[j].fields.libre).toString();
        } else if(jsonAttribut[j].fields.etat === 2) {
          var occupation = 'FERME';
        }
          else if(jsonAttribut[j].fields.etat === 0) {
          var occupation = 'NoData';
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
        // if(jsonAttribut[j].fields.realtimestatus === 'GREEN') {
        //   statut.label.fillColor = Cesium.Color.fromCssColorString('#1d9c1a');
        // } else if(jsonAttribut[j].fields.realtimestatus === 'ORANGE') {
        //   statut.label.fillColor = Cesium.Color.fromCssColorString('#d47808');
        // } else if(jsonAttribut[j].fields.realtimestatus === 'RED') {
        //   statut.label.fillColor = Cesium.Color.fromCssColorString('#e61207');
        // } else if(jsonAttribut[j].fields.realtimestatus === 'BLACK') {
        //   statut.label.fillColor = Cesium.Color.fromCssColorString('#1a1515');
        // } else if(jsonAttribut[j].fields.realtimestatus === 'CLOSED') {
        //   statut.label.fillColor = Cesium.Color.fromCssColorString('#FFFFFF');
        // }

      }
    }

    // le reste du tableau d'attributs
    // if (Cesium.defined(entity.properties['serviceandactivities'])) {
    //   billboard.description += '<tr><td>Services et activités </td><td>' + service + '</td></tr>';
    // }
    // if (Cesium.defined(entity.properties['characteristics'])) {
    //   billboard.description += '<tr><td>Caractéristiques </td><td>' + caracteristique + '</td></tr>';
    // }
    // if (Cesium.defined(entity.properties['exceptionalschedule'])) {
    //   billboard.description += '<tr><td>Mesures exceptionnelles </td><td>' + exception + '</td></tr>';
    // }
    // if (Cesium.defined(entity.properties['additionalinformation'])) {
    //   billboard.description += '<tr><td>Informations supplémentaires </td><td>' + info + '</td></tr>';
    // }
    //
    // billboard.description +='</tbody></table><br/>';
    // billboard.description += '<p>' + description + '</p>';
    // billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_piscines/information/" target="_blank">Informations sur les données</a><br/><br/>';

  }

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
        console.log(jsonAttribut[j]);
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



}
