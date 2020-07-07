"use strict";

// Gérer les interactions avec l'utilisateur (évènement sur le menu)
class Menu {

  /**
  * Le constructeur de la classe menu qui déclare toutes les variables utiles aux évènements
  * et créé le LegendManager
  *
  * @param  {Object} globe L'objet globe défini dans la classe Globe
  */
  constructor(globe){
    this.globe = globe;
    this.terrain = terrain; // format entités
    this.tileset = tileset; // format 3DTileset
    this.viewer = Globe.viewer;
    this.handler = Globe.handler;
    this.dataSources = globe.dataSources; // liste des dataSources (photomaillage, json, 3dtiles)

    // Récuperer les éléments du menu de gauche et de la boite à outils (pour l'affichage)
    this.menu = document.querySelector('#menu'); // le grand menu coulissant
    this.leftPane = document.querySelector('#left-pane'); // la zone à gauche après ce menu où s'affichent les légendes/formulaires
    this.dropdown = document.getElementsByClassName("panel-title"); // grands menus déroulants (catégorie PLU etc)
    this.deroulant = document.getElementsByClassName("deroulant"); // plus petits menus déroulants (sous catégorie PPRI etc)
    this.aideCheckbox = document.querySelector('.annotation'); // annotation en bas à droite
    // Div de la boite à outils
    this.mesuresDiv = document.querySelector('#mesures');
    this.constructionDiv = document.querySelector('#construction');
    this.coupeDiv = document.querySelector('#coupe');
    this.timeDiv = document.querySelector('#time');
    this.cameraDiv = document.querySelector('#camera');
    this.linkDiv = document.querySelector('#link');

    // Créer un gestionnaire pour les légendes
    this.legendManager = new LegendManager(this.leftPane);
    globe.legendManager = this.legendManager;

    /*
    *  Div qui contiennent les formulaires de personnalisation (affichés à gauche)
    */
    // mesures
    this.coordsList = document.querySelector('#coordsList');
    this.distanceList = document.querySelector('#distanceList');
    this.aireList = document.querySelector('#aireList');
    // dessin
    this.pointList = document.querySelector('#pointList');
    this.ligneList = document.querySelector('#ligneList');
    this.surfaceList = document.querySelector('#surfaceList');
    this.volumeList = document.querySelector('#volumeList');
    // coupe
    this.planList = document.querySelector('#planList');
    this.decoupeList = document.querySelector('#decoupeList');
    //camera & lien
    this.cameraList = document.querySelector('#cameraList');
    this.linkList = document.querySelector('#linkList');
    // choisir config
    this.configList = document.querySelector('#configList');
    // ajout de couches & classification des couches
    this.fileList = document.querySelector('#fileList');
    this.classifList = document.querySelector('#classifList');

    // Créer le calendrier pour l'affichage des ombres
    this.datepicker = $("#date")
    this.datepicker.datepicker();
    this.datepicker.datepicker("option", "dateFormat", "dd/mm/yy");
    // Récupérer la checkbox pour la classification du velum
    this.velumCouleurCheckbox = document.querySelector('#velumCouleur');

    // tableaux pour stocker les billboard des entités ponctuelles

    /*
    * Outil de découpe dans le photomaillage
    */
    this.viewModel = {
      affich : true,
      trou : false
    };

    // la fonction pour gérer les paramètres d'affichage du photomaillage
	  this.HSVinit();

    // La fonction pour gérer la zone morte
    this.panelGauche();

  }
  /*
  * Fin du constructeur
  */

  /**
  * Evenement pour les div déroulantes à l'intérieur du menu de gauche
  *
  * @param  {BoutonHTML} element Le bouton HTML sur lequel ajouter l'évènement
  */
  menuDeroulant(element){
    var i;
    for (i = 0; i < element.length; i++) {
      element[i].addEventListener('click', function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
  }

  /**
  * Affichage des divs dans la boîte à outils
  * et permet de fermer les divs lorsqu'on clique ailleurs
  *
  * @param  {BoutonHTML} bouton Le bouton HTML sur lequel ajouter l'évènement
  * @param  {DivHTML} element La div HTML qui va s'afficher au déclenchement de l'évènement
  */
  outilClic(bouton, element) {
    document.querySelector(bouton).addEventListener('click', (e) => {
      $(element).show();
    });
    window.addEventListener('click', function(event){
      var $trigger = $(bouton);
      if($trigger !== event.target && !$trigger.has(event.target).length){
        $(element).hide();
      }
    });
  }

  /**
  * Gère la zone morte sur la gauche de l'écran
  * Permet de pouvoir cliquer dans la zone quand aucun formulaire ni légende n'est affiché
  *
  */
  panelGauche() {
    document.querySelector("#left-pane").addEventListener('mouseover', (e) => {
      var panelGauche = document.getElementById("left-pane");
      if ($('#left-pane').prop('scrollHeight') > $('#left-pane').prop('clientHeight')) {
        panelGauche.style = "pointer-events: auto;";
      } else {
        panelGauche.style = "pointer-events: none;";
      }
    });

  }

  /**
  *
  *
  * Evenements sur tous les boutons dans le menu et toute la boîte à outils
  *
  *
  */

  evenementsCouches(){
    /*
    * Evenements d'ouverture des menus
    */

    // menu de gauche --> décale tous les éléments vers la droite
    document.querySelector("#left-pane #toggle-menu").addEventListener('click', (e) => {
      this.leftPane.classList.toggle('menu-open');
      this.menu.classList.toggle('menu-open');
      this.mesuresDiv.classList.toggle('menu-open');
      this.constructionDiv.classList.toggle('menu-open');
      this.coupeDiv.classList.toggle('menu-open');
      this.timeDiv.classList.toggle('menu-open');
      this.cameraDiv.classList.toggle('menu-open');
      this.linkDiv.classList.toggle('menu-open');
    });

    // menus déroulants et boite à outils
    this.menuDeroulant(this.dropdown);
    this.menuDeroulant(this.deroulant);
    this.outilClic("#boutonmesures", "#mesures-content");
    this.outilClic("#boutonconstruction", "#construction-content");
    this.outilClic("#boutoncoupe", "#coupe-content");
    this.outilClic("#boutontime", "#time-content");
    this.outilClic("#boutoncamera", "#camera-content");

    // afficher les 2 photomaillages
    document.querySelector('#photoMaillage').addEventListener('change', (e) => {
      globe.show3DTiles(e.target.checked, 'photoMaillage', 'https://3d.strasbourg.eu/CESIUM/DATA/PM3D_2018/3DTiles/EMS_CESIUM.json', 1);
    });
    document.querySelector('#photoMaillage2017').addEventListener('change', (e) => {
      globe.show3DTiles(e.target.checked, 'photoMaillage2017', 'https://3d.strasbourg.eu/CESIUM/DATA/PM3D_PSMV_OPTIM/PSMV_CESIUM.json', 2);
    });


    /*
    *
    * Boite à outils
    *
    */

    //Tableaux pour les dessins/mesures d'entités : on fait un seul tableau dans la fonction
    // pour garder une trace des entités à tout moment
    // dessin
    var billboard = [];
    var line = [];
    var surface = [];
    var volume = [];
    // mesures
    var dline = [];
    var dsurface = [];
    // plan de coupe horizontal
    var planeEntities = [];
    var clippingPlanes = [];

    /*
    * MESURES
    */
    // Boutons radios
    // Les boutons radios suppriment les éléments liés aux autres boutons avant d'afficher leurs spécificités
    document.querySelector('#neutre').addEventListener('click', (e) => {
      // Tout effacer
      globe.supprSouris();
      this.coordsList.classList.add('hidden');
      $("#distanceList").addClass('hidden');
      this.aideCheckbox.classList.add('hidden');
      // Enlever les entités
      for(var i = 0; i < dline.length+10; i++){
        globe.viewer.entities.remove(dline[i]);
      }
      // Vider le tableau
      for(var j = 0; j <= dline.length+1; j++){
        dline.pop();
      }

      this.aireList.classList.add('hidden');
      this.aideCheckbox.classList.add('hidden');
      for(var i = 0; i < dsurface.length; i++){
        globe.viewer.entities.remove(dsurface[i]);
      }
      for(var j = 0; j <= dsurface.length+1; j++){
        dsurface.pop();
      }
      globe.viewer.scene.requestRender();
    });

    document.querySelector('#point').addEventListener('click', (e) => {
      globe.supprSouris();
      $("#distanceList").addClass('hidden');
      this.aideCheckbox.classList.add('hidden');
      this.aireList.classList.add('hidden');
      this.aideCheckbox.classList.add('hidden');

      this.coordsList.classList.remove('hidden');
      var coords = globe.showCoords();
      globe.viewer.scene.requestRender();
    });

    document.querySelector('#ligne').addEventListener('click', (e) => {
      globe.supprSouris();
      this.coordsList.classList.add('hidden');
      this.aireList.classList.add('hidden');
      this.aideCheckbox.classList.add('hidden');

      var choice = 'line';
      var choice2 = 'mesure';
      var hauteurVol;
      var url;
      globe.updateShape(choice, choice2, 3, '#FF0000', 1, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
      $("#distanceList").removeClass('hidden');
      this.aideCheckbox.classList.remove('hidden');
      globe.viewer.scene.requestRender();
    });

    document.querySelector('#surface').addEventListener('click', (e) => {
      globe.supprSouris();
      this.coordsList.classList.add('hidden');
      $("#distanceList").addClass('hidden');
      this.aideCheckbox.classList.add('hidden');

      var choice = 'polygon';
      var choice2 = 'mesure';
      var hauteurVol;
      var url;
      globe.updateShape(choice, choice2, 3, '#1ABFD0', 0.4, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
      this.aireList.classList.remove('hidden');
      this.aideCheckbox.classList.remove('hidden');
      globe.viewer.scene.requestRender();
    });

    /*
    *
    * DESSINS
    *
    */
    //Evenements pour l'ajout de l'entité
    document.querySelector("#envoyerpoint").addEventListener('click', (e) => {
      var choice = 'point';
      var choice2 = 'dessin';
      var transparence;
      var couleur = $('#couleurpoint').val();
      var largeur;
      var hauteurVol = $('#hauteurpoint').val();
      var url = 'Assets/Textures/maki/' + $('#makisymbol').val() + '.png';
      globe.updateShape(choice, choice2, largeur, couleur, transparence, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
    });

    document.querySelector("#envoyerligne").addEventListener('click', (e) => {
      var choice = 'line';
      var choice2 = 'dessin';
      var hauteurVol;
      var url;
      var largeur = $('#largeur').val();
      var couleur = $('#couleur').val();
      var transparence = $('#transparence').val();
      globe.updateShape(choice, choice2, largeur, couleur, transparence, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
    });

    document.querySelector("#envoyersurf").addEventListener('click', (e) => {
      var choice = 'polygon';
      var choice2 = 'dessin';
      var hauteurVol;
      var url;
      var largeur = 3;
      var couleur = $('#couleursurf').val();
      var transparence = $('#transparencesurf').val();
      globe.updateShape(choice, choice2, largeur, couleur, transparence, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
    });

    document.querySelector("#envoyervol").addEventListener('click', (e) => {
      var choice = 'volume';
      var choice2 = 'dessin';
      var largeur = 3;
      var url;
      var hauteurVol = $('#hauteurvol').val();
      var couleur = $('#couleurvol').val();
      var transparence = $('#transparencevol').val();
      globe.updateShape(choice, choice2, largeur, couleur, transparence, hauteurVol, url, billboard, line, surface, volume, dline, dsurface);
    });

    //Evenements pour la suppression / anunulation des dessins
    globe.annulFigure('#annulerpoint', billboard);
    globe.supprFigure('#supprimerpoint', billboard);
    globe.annulFigure('#annulerligne', line);
    globe.supprFigure('#supprimerligne', line);
    globe.annulFigure('#annulersurf', surface);
    globe.supprFigure('#supprimersurf', surface);
    globe.annulFigure('#annulervol', volume);
    globe.supprFigure('#supprimervol', volume);

    // Boutons radios pour l'affichage des formulaires de dessin
    document.querySelector('#cneutre').addEventListener('click', (e) => {
      globe.supprSouris();
      this.aideCheckbox.classList.add('hidden');
      this.pointList.classList.add('hidden');
      this.ligneList.classList.add('hidden');
      this.surfaceList.classList.add('hidden');
      this.volumeList.classList.add('hidden');
    });

    document.querySelector('#cpoint').addEventListener('click', (e) => {
      //globe.supprSouris();
      this.aideCheckbox.classList.add('hidden');
      this.ligneList.classList.add('hidden');
      this.surfaceList.classList.add('hidden');
      this.volumeList.classList.add('hidden');

      this.pointList.classList.remove('hidden');
    });

    document.querySelector('#cligne').addEventListener('click', (e) => {
      //globe.supprSouris();
      this.pointList.classList.add('hidden');
      this.surfaceList.classList.add('hidden');
      this.volumeList.classList.add('hidden');

      this.ligneList.classList.remove('hidden');
      this.aideCheckbox.classList.remove('hidden');
    });

    document.querySelector('#csurface').addEventListener('click', (e) => {
      //globe.supprSouris();
      this.pointList.classList.add('hidden');
      this.ligneList.classList.add('hidden');
      this.volumeList.classList.add('hidden');

      this.surfaceList.classList.remove('hidden');
      this.aideCheckbox.classList.remove('hidden');
    });

    document.querySelector('#volume').addEventListener('click', (e) => {
      //globe.supprSouris();
      this.pointList.classList.add('hidden');
      this.ligneList.classList.add('hidden');
      this.surfaceList.classList.add('hidden');

      this.volumeList.classList.remove('hidden');
      this.aideCheckbox.classList.remove('hidden');
    });

    // supprime toutes les entités
    document.querySelector('#suppr').addEventListener('click', function() {
      for(var i = 0; i <= billboard.length+10; i++){
        globe.viewer.entities.remove(billboard[i]);
        billboard.pop();
      }
      for(var i = 0; i <= line.length+1; i++){
        globe.viewer.entities.remove(line[i]);
        line.pop();
      }
      for(var i = 0; i <= surface.length+1; i++){
        globe.viewer.entities.remove(surface[i]);
        surface.pop();
      }
      for(var i = 0; i <= volume.length+1; i++){
        globe.viewer.entities.remove(volume[i]);
        volume.pop();
      }
    });

    /*
    *
    *  Export des dessins
    *
    */
    document.querySelector("#exportDessin").addEventListener('click', (e) => {
      // on donne la structure au json
      let jsonGlob = {};
      jsonGlob = {"type" : "FeatureCollection", "features" : []};
      let features = [];

      // Export des entités ligne
      for (let i = 0; i < line.length; i++) {
        let j = 0;
        // le tableaux dans lequel on va mettre les coordonnées des sommets de la ligne
        let coordLine = [];
        // On récupère la valeur de chaque coordonnée X Y Z
        while (j < line[i].polyline.positions._value.length) {
          // Structure json
          var type = {"type" : "Feature", "properties" : {}, "geometry" : {}};
          type["geometry"] = {"type" : "LineString", "coordinates" : []};

          // Conversion des coordonnées cartesiennes en lat/long
          let cartesian = new Cesium.Cartesian3(line[i].polyline.positions._value[j].x, line[i].polyline.positions._value[j].y, line[i].polyline.positions._value[j].z);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let coordXY = [Number(longitude), Number(latitude)];
          coordLine.push(coordXY);
          j++;
        }

        // On récupère la valeur rgba de la couleur
        type["properties"].color = {};
        type["properties"]["color"].red = line[i].polyline.material.color._value.red;
        type["properties"]["color"].green = line[i].polyline.material.color._value.green;
        type["properties"]["color"].blue = line[i].polyline.material.color._value.blue;
        type["properties"]["color"].alpha = line[i].polyline.material.color._value.alpha;

        // la valeur de la largeur de la ligne
        type["properties"].width = line[i].polyline.width._value;

        // On met les coordonées dans le tableau
        type["geometry"].coordinates = coordLine;
        // On les ajoute à la liste des features
        features.push(type);
      }

      // Export des entités billboard (ie des points)
      for (let i = 0; i < billboard.length; i++) {
        // Structure du json
        var typePoint = {"type" : "Feature", "properties" : {}, "geometry" : {}};
        typePoint["geometry"] = {"type" : "Point", "coordinates" : {}};

        // Certaines entités n'ont pas la position définie car les marker sont créés de manière asynchrone
        if(Cesium.defined(billboard[i].position._value)) {
          let cartesian = new Cesium.Cartesian3(billboard[i].position._value.x, billboard[i].position._value.y, billboard[i].position._value.z);
          // Conversion des coordonnées cartesiennes en lat/long
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let z = cartographic.height;
          let coordXYZ = [Number(longitude), Number(latitude), Number(z)];

          // On exporte la hauteur du point
          let hauteur = billboard[i].billboard.height._value;
          typePoint["properties"].height = hauteur;

          // On ne sait pas exporter les entités maki donc on met une image unique
          typePoint["properties"].image = 'src/img/interface.png';

          // Les coordonnées ponctuelles n'ont qu'une seule coordonnée et donc pas besoin de 2 array
          typePoint["geometry"].coordinates = coordXYZ;
          features.push(typePoint);
        }
      }

      // Export des surfaces
      for (let i = 0; i < surface.length; i++) {
        let coordSurf = [];
        let arraySurf = [];
        let k = 0;

        while (k < surface[i].polygon.hierarchy._value.positions.length) {

          var typeSurf = {"type" : "Feature", "properties" : {}, "geometry" : {}};
          typeSurf["geometry"] = {"type" : "Polygon",  "coordinates" : [[]]};

          let cartesian = new Cesium.Cartesian3(surface[i].polygon.hierarchy._value.positions[k].x, surface[i].polygon.hierarchy._value.positions[k].y, surface[i].polygon.hierarchy._value.positions[k].z);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let coordXY = [Number(longitude), Number(latitude)];
          coordSurf.push(coordXY);
          k++;
        }

        // on rajoute la première coordonnée à la fin de la liste pour permettre l'affichage
        let cartesian = new Cesium.Cartesian3(surface[i].polygon.hierarchy._value.positions[0].x, surface[i].polygon.hierarchy._value.positions[0].y, surface[i].polygon.hierarchy._value.positions[0].z);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let coordXY = [Number(longitude), Number(latitude)];
        coordSurf.push(coordXY);

        typeSurf["properties"].color = {};
        typeSurf["properties"]["color"].red = surface[i].polygon.material.color._value.red;
        typeSurf["properties"]["color"].green = surface[i].polygon.material.color._value.green;
        typeSurf["properties"]["color"].blue = surface[i].polygon.material.color._value.blue;
        typeSurf["properties"]["color"].alpha = surface[i].polygon.material.color._value.alpha;

        // il faut une array de plus pour les coordonnées des polygon pour que Cesium arrive à lire le JSON
        arraySurf.push(coordSurf);
        typeSurf["geometry"].coordinates = arraySurf;
        features.push(typeSurf);
      }

      // Export des volumes, ie des surfaces avec un attribut 'extrudedHeight'
      for (let i = 0; i < volume.length; i++) {
        let coordVol = [];
        let arrayVol = [];
        let k = 0;
        while (k < volume[i].polygon.hierarchy._value.positions.length) {
          var typeVol = {"type" : "Feature", "properties" : {}, "geometry" : {}};
          typeVol["geometry"] = {"type" : "Polygon",  "coordinates" : [[]]};

          let cartesian = new Cesium.Cartesian3(volume[i].polygon.hierarchy._value.positions[k].x, volume[i].polygon.hierarchy._value.positions[k].y, volume[i].polygon.hierarchy._value.positions[k].z);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let coordXY = [Number(longitude), Number(latitude)];
          coordVol.push(coordXY);
          k++;
        }

        // on rajoute la première coordonnée à la fin de la liste pour permettre l'affichage
        let cartesian = new Cesium.Cartesian3(volume[i].polygon.hierarchy._value.positions[0].x, volume[i].polygon.hierarchy._value.positions[0].y, volume[i].polygon.hierarchy._value.positions[0].z);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let coordXY = [Number(longitude), Number(latitude)];
        coordVol.push(coordXY);

        typeVol["properties"].color = {};
        typeVol["properties"]["color"].red = volume[i].polygon.material.color._value.red;
        typeVol["properties"]["color"].green = volume[i].polygon.material.color._value.green;
        typeVol["properties"]["color"].blue = volume[i].polygon.material.color._value.blue;
        typeVol["properties"]["color"].alpha = volume[i].polygon.material.color._value.alpha;

        typeVol["properties"].extrudedHeight = volume[i].polygon.extrudedHeight._value;

        // il faut une accolade de plus pour les coordonnées des polygon pour que Cesium arrive à lire le JSON
        arrayVol.push(coordVol);
        typeVol["geometry"].coordinates = arrayVol;
        features.push(typeVol);
      }

      // Une fois toutes les features ajoutées dans l'array, on la définit dans le JSON
      jsonGlob["features"] = features;

      // On transforme la string en un JSON
      var download = JSON.stringify(jsonGlob);

      // Téléchargement du fichier drawing.json
      let element = document.querySelector('#exportDessin');
      element.setAttribute('href', 'data:json,' + encodeURIComponent(download));
      element.setAttribute('download', 'drawing.json');

    });

    /*
    *
    * Decoupes
    *
    */
    // Evenement pour l'ajout du plan
    document.querySelector("#envoyercoupe").addEventListener('click', (e) => {
      var X = $('#X').val();
      var Y = $('#Y').val();
      var hauteur = $('#hauteurcoupe').val();
      var longueur = $('#longueurcoupe').val();
      var largeur = $('#largeurcoupe').val();
      var couleur = $('#couleurcoupe').val();
      globe.addClippingPlanes(X, Y, hauteur, longueur, largeur, couleur, planeEntities, clippingPlanes);
    });
    // Evenement pour l'affichage du formulaire
    document.querySelector('#plancoupe').addEventListener('change', (e) => {
      if(e.target.checked){
        globe.coordCoupe();
        this.planList.classList.remove('hidden');
      } else {
        this.planList.classList.add('hidden');
        globe.supprSouris();
      }
    });
    // Suppression/ annulation des plans de coupe
    document.querySelector("#annulercoupe").addEventListener('click', (e) => {
      var annul = planeEntities.length-1;
      globe.viewer.entities.remove(planeEntities[annul]);
      planeEntities.pop();
      clippingPlanes = [];
      globe.viewer.scene.requestRender();
    });
    document.querySelector("#supprimercoupe").addEventListener('click', (e) => {
      //this.viewer.entities.remove(planeEntity);
      for(var i = 0; i < planeEntities.length; i++){
        globe.viewer.entities.remove(planeEntities[i]);
      }
      clippingPlanes = [];
      globe.viewer.scene.requestRender();
    });


    // Decoupe dans le photomaillage
    var toolbar = document.getElementById('toolbar');
    Cesium.knockout.track(this.viewModel);
    globe.viewer.scene.requestRender();
    Cesium.knockout.applyBindings(this.viewModel, toolbar);
    globe.viewer.scene.requestRender();

    document.querySelector('#decoupe').addEventListener('change', (e) => {
      if(e.target.checked){
        this.decoupeList.classList.remove('hidden');
      } else {
        this.decoupeList.classList.add('hidden');
        globe.supprSouris();
      }
    });

    document.querySelector("#envoyerdecoupe").addEventListener('click', (e) => {
      globe.createHole(this.viewModel);
      globe.viewer.scene.requestRender();
    });


    /*
    *
    * Ombres
    *
    */
    document.querySelector('#shadows').addEventListener('change', function(e){
      globe.shadow(e.target.checked);
    });
    // Créé le calendrier
    this.datepicker.on('change', () => {

      // on remet la date au bon format
      var annee = this.datepicker.val().substring(6,10);
      var mois = this.datepicker.val().substring(3,5);
      var jour = this.datepicker.val().substring(0,2);

      let startTime = Cesium.JulianDate.fromIso8601(annee + '-' + mois + '-' + jour + 'T00:00:00Z');
      let stopTime = Cesium.JulianDate.fromIso8601(annee + '-' + mois + '-' + jour + 'T23:59:59Z');

      // on centre l'horloge sur la date choisie
      globe.viewer.clock.startTime = startTime;
      globe.viewer.timeline.zoomTo(startTime, stopTime);
    });

    /*
    *
    *  Ajout de points de vue de caméra
    *
    */
    document.querySelector("#ajoutercamera").addEventListener('click', function() {
      var nom = $('#nomcamera').val();
      var viewPoint = globe.addViewPoint(nom);

      document.querySelector('#cameraList').classList.add('hidden');
      document.getElementById("nomcamera").value = '';

      let position = new Cesium.Cartesian3(globe.viewer.camera.positionWC.x, globe.viewer.camera.positionWC.y, globe.viewer.camera.positionWC.z);
      let heading = globe.viewer.camera.heading;
      let pitch = globe.viewer.camera.pitch;
      let roll = globe.viewer.camera.roll;

      viewPoint.addEventListener('click', function() {
        globe.fly(position, heading, pitch, roll);
      });

    });

    document.querySelector('#addcamera').addEventListener('click', (e) => {
      this.cameraList.classList.toggle('hidden');
    });
	document.querySelector('#achenheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4190494.10, 561015.32, 4759864.34);
      globe.fly(position, 3.51, -0.79, 0);
    });
	document.querySelector('#bischheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4186229.95, 569952.69, 4762530.48);
      globe.fly(position, 4.97, -0.69, 0);
    });
    document.querySelector('#blaesheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4196693.50, 560574.55, 4754531.05);
      globe.fly(position, 1.19, -0.83, 0);
    });
	document.querySelector('#breuschwickersheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4190598.59, 559301.35, 4759997.67);
      globe.fly(position, 2.99, -0.82, 0);
    });
	document.querySelector('#eckbolsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4189862.77, 565510.48, 4759887.19);
      globe.fly(position, 1.11, -0.82, 0);
    });
    document.querySelector('#eckwersheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4181297.27, 564788.54, 4767426.66);
      globe.fly(position, 5.92, -0.75, 0);
    });
	document.querySelector('#entzheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4194023.29, 562342.49, 4756631.48);
      globe.fly(position, 4.95, -0.766, 0);
    });
    document.querySelector('#eschau').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4197301.02, 568678.55, 4753015.26);
      globe.fly(position, 4.95, -0.66, 0);
    });
	document.querySelector('#fegersheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4197253.19, 565937.32, 4753387.91);
      globe.fly(position, 2.93, -0.77, 0);
    });
    document.querySelector('#geispolsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4195561.33, 563136.35, 4755203.03);
      globe.fly(position, 4.46, -0.76, 0);
    });
	document.querySelector('#hangenbieten').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4192127.35, 560335.37, 4758544.21);
      globe.fly(position, 3.38, -0.79, 0);
    });
	document.querySelector('#hoenheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4185672.02, 569983.83, 4763019.50);
      globe.fly(position, 1.51, -0.72, 0);
    });
    document.querySelector('#holtzheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4191886.86, 562498.64, 4758465.78);
      globe.fly(position, 0.41, -0.93, 0);
    });
	document.querySelector('#illkirch').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4193747.64, 567758.17, 4756204.42);
      globe.fly(position, 1.84, -0.60, 0);
    });
    document.querySelector('#kolbsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4192395.91, 558488.50, 4758546.61);
      globe.fly(position, 4.97, -0.68, 0);
    });
	document.querySelector('#lawantzenau').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4181831.09, 574938.23, 4765771.14);
      globe.fly(position, 3.79, -0.60, 0);
    });
    document.querySelector('#lampertheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4183771.19, 565724.11, 4765172.97);
      globe.fly(position, 3.99, -0.93, 0);
    });
	document.querySelector('#lingolsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4191863.71, 565388.71, 4758146.13);
      globe.fly(position, 0.36, -0.54, 0);
    });
    document.querySelector('#lipsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4197399.67, 564804.87, 4753366.40);
      globe.fly(position, 1.59, -0.64, 0);
    });
	document.querySelector('#mittelhausbergen').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4186858.76, 565543.69, 4762535.37);
      globe.fly(position, 2.88, -0.88, 0);
    });
    document.querySelector('#mundolsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4184310.67, 566949.34, 4764545.43);
      globe.fly(position, 3.90, -0.61, 0);
    });
	document.querySelector('#niederhausbergen').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4186064.74, 566076.67, 4763132.34);
      globe.fly(position, 5.43, -0.63, 0);
    });
    document.querySelector('#oberhausbergen').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4187684.39, 565211.40, 4761862.57);
      globe.fly(position, 5.27, -0.86, 0);
    });
	document.querySelector('#oberschaeffolsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4189778.59, 562566.46, 4760293.99);
      globe.fly(position, 1.74, -0.49, 0);
    });
    document.querySelector('#osthoffen').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4190663.24, 555808.46, 4760364.14);
      globe.fly(position, 1.34, -0.65, 0);
    });
	document.querySelector('#ostwald').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4191958.87, 567810.05, 4757778.75);
      globe.fly(position, 6.09, -0.56, 0);
    });
    document.querySelector('#plobsheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4198464.61, 569523.54, 4751880.29);
      globe.fly(position, 0.84, -0.58, 0);
    });
	document.querySelector('#reichstett').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4183383.79, 569668.59, 4765049.97);
      globe.fly(position, 3.47, -0.52, 0);
    });
    document.querySelector('#schiltigheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4187172.21, 569637.38, 4761783.19);
      globe.fly(position, 0.64, -0.53, 0);
    });
	document.querySelector('#souffelweyersheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4184718.61, 568888.73, 4764015.40);
      globe.fly(position, 6.28, -0.80, 0);
    });
    document.querySelector('#strasbourg').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4189285.38, 570210.64, 4760121.97);
      globe.fly(position, 6.28, -0.80, 0);
    });
	document.querySelector('#vendenheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4182524.16, 566365.22, 4766286.09);
      globe.fly(position, 5.46, -0.91, 0);
    });
    document.querySelector('#wolfisheim').addEventListener('click', function() {
      var position = new Cesium.Cartesian3(4189741.77, 563875.56, 4760209.97);
      globe.fly(position, 1.49, -0.70, 0);
    });


    /*
    *
    * Création du lien de partage
    *
    */
    document.querySelector("#addlink").addEventListener('click', function() {
      globe.createLink();
    });

    document.querySelector('#boutonlink').addEventListener('click', (e) => {
      this.linkList.classList.toggle('hidden');
    });

    /*
    *
    * Evenements sur les quatre points cardinaux à droite
    *
    */

    document.querySelector('#nord').addEventListener('click', function() {
      // on récupère les coordonnées du centre de l'écran
      var windowPosition = new Cesium.Cartesian2(globe.viewer.container.clientWidth / 2, globe.viewer.container.clientHeight / 2);
      var test = globe.viewer.scene.pickPosition(windowPosition); // on les transforme en coordonnées cartographiques

      // on calcule le range de la caméra, càd la distance depuis le centre
      var CC3 = Cesium.Cartesian3;
      var range = CC3.magnitude(CC3.subtract(globe.viewer.camera.position,test,new CC3()));

      // on oriente la caméra avec pour position le centre de l'écran et le range d'origine
      var location = new Cesium.BoundingSphere(test);
      var zoom = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0.0), globe.viewer.camera.pitch, range);
      globe.viewer.camera.flyToBoundingSphere(location, {
        offset : zoom
      });

    });
    document.querySelector('#ouest').addEventListener('click', function() {
      var windowPosition = new Cesium.Cartesian2(globe.viewer.container.clientWidth / 2, globe.viewer.container.clientHeight / 2);
      console.log(windowPosition);
      var test = globe.viewer.scene.pickPosition(windowPosition);
      console.log(test);

      var CC3 = Cesium.Cartesian3;
      var range = CC3.magnitude(CC3.subtract(globe.viewer.camera.position,test,new CC3()));

      var location = new Cesium.BoundingSphere(test, 1);
      var zoom = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), globe.viewer.camera.pitch, range);
      globe.viewer.camera.flyToBoundingSphere(location, {
        offset : zoom
      });

    });
    document.querySelector('#est').addEventListener('click', function() {
      var windowPosition = new Cesium.Cartesian2(globe.viewer.container.clientWidth / 2, globe.viewer.container.clientHeight / 2);
      console.log(windowPosition);
      var test = globe.viewer.scene.pickPosition(windowPosition);
      console.log(test);

      var CC3 = Cesium.Cartesian3;
      var range = CC3.magnitude(CC3.subtract(globe.viewer.camera.position,test,new CC3()));

      var location = new Cesium.BoundingSphere(test, 1);
      var zoom = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(90), globe.viewer.camera.pitch, range);
      globe.viewer.camera.flyToBoundingSphere(location, {
        offset : zoom
      });
    });
    document.querySelector('#sud').addEventListener('click', function() {
      var windowPosition = new Cesium.Cartesian2(globe.viewer.container.clientWidth / 2, globe.viewer.container.clientHeight / 2);
      console.log(windowPosition);
      var test = globe.viewer.scene.pickPosition(windowPosition);
      console.log(test);

      var CC3 = Cesium.Cartesian3;
      var range = CC3.magnitude(CC3.subtract(globe.viewer.camera.position,test,new CC3()));

      var location = new Cesium.BoundingSphere(test, 1);
      var zoom = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(180), globe.viewer.camera.pitch, range);
      globe.viewer.camera.flyToBoundingSphere(location, {
        offset : zoom
      });
    });

    // bouton poubelle en haut à droite
    document.querySelector('#poubelle').addEventListener('click', function() {
      globe.viewer.entities.removeAll();
      globe.viewer.scene.requestRender();
    });

  }

  /*
  *
  * Fin de la fonction evenementsCouches
  */



  /**
  * Ajoute une source de données à la liste en donnant son nom "name" et la datasource "value"
  *
  * @param  {String} name Le nom qu'on souhaite donner à la datasource
  * @param  {Object} value La valeur qu'on donne à la dataSource
  */
  addDataSource(name, value){
    this.dataSources[name] = value;
  }


  /**
  * Modification du contraste et saturation de l'affichage
  *
  */
  HSVinit(){

    Cesium.knockout.track(globe.viewModel);
    var toolbar = document.getElementById('HSVtoolbar');
    Cesium.knockout.applyBindings(globe.viewModel, toolbar);
    for (var name in globe.viewModel) {
      if (globe.viewModel.hasOwnProperty(name)) {
        Cesium.knockout.getObservable(globe.viewModel, name).subscribe(globe.updatePostProcess);
      }
    }
    globe.updatePostProcess();
  }


  /**
  * Ajout de couches interactif
  * Principe: on a un serveur web qui permet d'avoir les fichiers au format http (Cesium n'accepte pas les fichiers stockés en
  * local pour des raisons de crossOrigin), on veut récupérer une liste de tous les fichiers présents dans un dossier spécifique.
  * On envoie la requête sur le serveur qui nous donne la liste au format texte, on récupère tous les noms de fichiers et
  * on s'en sert pour créer les liens d'accès jusqu'aux json
  *
  * @return {Object} la liste des fichiers sur le serveur web
  *
  */
  getJson() {
    var result = []; // tableau pour stocker les éléments du dossier
    var noms = []; // stocke les noms des couches
    var json = []; // stocke les liens vers les json associés au nom

    var id = []; // tableau unitaire 1, 2, 3 jusqu'à 100
    // permet de donner un identifiant aux couches
    // on ne peut pas avoir plus de 100 fichiers présents dans le dossier du serveur
    var N = 100;
    for (var i = 1; i <= N; i++) {
      id.push(i);
    }

    var valeurClassif = []; // champ de texte utlisé pour la classification
    var couleurClassif = []; // couleur associée

    document.querySelector('#affichercouche').addEventListener('click', function() {
      document.querySelector('#affichercouche').classList.add('hidden'); // on ne peut afficher qu'un seul contenu de dossier par session
      localStorage.setItem('identifiant', $('#idEMS').val()); // on enregistre l'identifiant dans la mémoire du navigateur (cookie)
      var identifiant = localStorage.getItem('identifiant'); // et on le récupère

      var filePath = 'http://localhost:8000/' + identifiant + '/json/'; // donne le chemin d'accès au dossier

      var xmlhttp = new XMLHttpRequest();
      this.xmlhttp = this;
      xmlhttp.open("GET", filePath, true);
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {

          let html = xmlhttp.responseText; // renvoie un texte au format html où la liste des fichers est dans une li
          result = $(html).find("li > a"); // on récupère tous les li

          for(let i=0;i<result.length;i++) {
            noms.push(result[i].innerText);
            json.push(filePath + result[i].innerText);

            // créé les boutons qui récupère les infos du serveur et s'affiche dans la div fileList
            var couche = document.createElement("BUTTON");
            couche.innerHTML = noms[i];
            document.getElementById("fileList").appendChild(couche);
            var espace = document.createElement("br");
            document.getElementById("fileList").appendChild(espace);

            // Lorsqu'on clique sur un des boutons, ouvre un menu de classification et créé une checkbox dans l'onglet "mes couches"
            couche.addEventListener('click', (e) => {
              var divClone = $("#classifList").clone(); // on garde en mémoire l'état d'origine pour le remettre une fois une couche ajoutée
              document.querySelector('#fileList').classList.add('hidden');
              document.querySelector('#classifList').classList.remove('hidden');

              document.querySelector('#ajoutertype').addEventListener('click', function() {
                if($('#typeclassif').val() === 'ponctuelle') {
                  document.querySelector('#ponctuelleDiv').classList.remove('hidden');
                  document.querySelector('#ajouterclassif').classList.remove('hidden');
                  document.querySelector('#ajoutertype').classList.add('hidden');
                  document.querySelector('#choixDiv').classList.add('hidden');
                } else if($('#typeclassif').val() === 'surfacique') {
                  document.querySelector('#surfaciqueDiv').classList.remove('hidden');
                  document.querySelector('#ajouterclassif').classList.remove('hidden');
                  document.querySelector('#ajoutertype').classList.add('hidden');
                  document.querySelector('#choixDiv').classList.add('hidden');
                }
              });

              // A chaque clic, ajoute les 2 div pour classifier
              document.querySelector('#addclassif').addEventListener('click', function() {
                let divValClassif = document.createElement("input");
                divValClassif.type = "text";
                divValClassif.size = 10;
                divValClassif.classList.add('valeurclassif');
                let valText = document.createElement('span');
                valText.innerHTML = 'Valeur : ';

                let divCouleurClassif = document.createElement("input");
                divCouleurClassif.type = "color";
                divCouleurClassif.value = '#FFFFFF';
                divCouleurClassif.classList.add('couleurclassif');
                let coulText = document.createElement('span');
                coulText.innerHTML = 'Couleur : ';

                var espace2 = document.createElement("br");
                var espace3 = document.createElement("br");
                document.getElementById("classifForm").appendChild(valText);
                document.getElementById("classifForm").appendChild(divValClassif);
                document.getElementById("classifForm").appendChild(espace2);
                document.getElementById("classifForm").appendChild(coulText);
                document.getElementById("classifForm").appendChild(divCouleurClassif);
                document.getElementById("classifForm").appendChild(espace3);

              });

              // Lorsqu'on a tout classifié, on récupère les valeurs de classif et créé la checkbox dans l'onglet "mes couches"
              document.querySelector('#ajouterclassif').addEventListener('click', function() {
                let item = document.createElement('div');
                item.classList.add('nowrap');
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = noms[i];
                checkbox.id = id[i];

                let label = document.createElement('label');
                label.htmlFor = id[i];
                label.appendChild(document.createTextNode(noms[i]));
                item.appendChild(checkbox);
                item.appendChild(label);
                document.getElementById("mescouches").appendChild(item);
                document.querySelector('#mescouches').style.display = "block";

                // données surfaciques
                var champ = $('#classif').val();
                var transparence = $('#classiftransparence').val();
                valeurClassif = $('.valeurclassif').map(function() {
                  return $(this).val();
                }).get();
                couleurClassif = $('.couleurclassif').map(function() {
                  return $(this).val();
                }).get();

                var colors = new Map();
                for(let j=0; j<valeurClassif.length; j++) {
                  colors[valeurClassif[j]] = couleurClassif[j];
                }

                // données ponctuelles
                var couleur = $('#classifpoint').val();
                var url = $('#makiclassif').val();

                document.querySelector('#classifList').classList.add('hidden');
                $("#classifList").replaceWith(divClone); // pour avoir une div vierge lors de l'ajout de la prochaine couche

                // L'evenement pour afficher la nouvelle couche
                checkbox.addEventListener('change', (e) => {
                  globe.showJson(e.target.checked, noms[i], json[i], url, Cesium.Color.fromCssColorString(couleur), undefined, undefined, undefined, {
                    classification: true,
                    classificationField: champ,
                    colors: colors,
                    alpha: transparence
                  });
                });
              });
            });
          }
        }
      };

      xmlhttp.send();
    });
  }

  /**
  * Ajout de couches interactif
  * La même fonction qui récupère les données dans le dossier 3dtiles et affiche la couche
  * pas de classification simple pour les 3dtiles
  *
  */
  get3DTiles() {
    var result = [];
    var noms = [];
    var json = [];
    var id = [];
    var N = 100;
    for (var i = 1; i <= N; i++) {
      id.push(i);
    }

    document.querySelector('#affichercouche').addEventListener('click', function() {
      document.querySelector('#affichercouche').classList.add('hidden');
      var identifiant = localStorage.getItem('identifiant');


      var filePath = 'http://localhost:8000/' + identifiant + '/3dtiles/';

      var xmlhttp = new XMLHttpRequest();
      this.xmlhttp = this;

      xmlhttp.open("GET", filePath, true);
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {

          let html = xmlhttp.responseText;
          result = $(html).find("li > a");

          for(let i=0;i<result.length;i++) {
            noms.push(result[i].innerText);
            json.push(filePath + result[i].innerText + 'tileset.json');

            // créé les boutons qui récupère les infos du serveur
            var couche = document.createElement("BUTTON");
            couche.innerHTML = noms[i];
            document.getElementById("fileList").appendChild(couche);
            let espace = document.createElement("br");
            document.getElementById("fileList").appendChild(espace);

            // Pour chaque bouton, créé une checkbox dans l'onglet "mes couches"
            couche.addEventListener('click', (e) => {
              document.querySelector('#fileList').classList.add('hidden');

              let item = document.createElement('div');
              item.classList.add('nowrap');
              let checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = noms[i];
              checkbox.id = id[i];
              let label = document.createElement('label');
              label.htmlFor = id[i];
              label.appendChild(document.createTextNode(noms[i]));
              item.appendChild(checkbox);
              item.appendChild(label);
              document.getElementById("mescouches").appendChild(item);
              document.querySelector('#mescouches').style.display = "block";

              checkbox.addEventListener('change', (e) => {
                globe.show3DTiles(e.target.checked, 'test', json[i]);
              });

            });
          }
        }
      };

      xmlhttp.send();
    });
  }

  /**
  * Ajout de couches interactif
  * Et une 3ème fois la même fonction pour récupérer le contenu du dossier drawings et l'afficher
  *
  */
  getDrawing() {
    var result = []; // tableau pour stocker les éléments du dossier
    var noms = []; // stocke les noms des couches
    var json = []; // stocke les liens vers les json associés au nom

    var id = []; // tableau unitaire 1, 2, 3 jusqu'à 100
    // permet de donner un identifiant aux couches
    // on ne peut pas avoir plus de 100 fichiers présents dans le dossier du serveur
    var N = 100;
    for (var i = 1; i <= N; i++) {
      id.push(i);
    }

    var valeurClassif = []; // champ de texte utlisé pour la classification
    var couleurClassif = []; // couleur associée

    // variables neutres qui servent lors de l'appel de la fonction showJson
    var symbol;
    var couleur = 'FFFFFF';
    var options;

    document.querySelector('#affichercouche').addEventListener('click', function() {
      document.querySelector('#affichercouche').classList.add('hidden'); // on ne peut afficher qu'un seul contenu de dossier par session
      localStorage.setItem('identifiant', $('#idEMS').val()); // on enregistre l'identifiant dans la mémoire du navigateur (cookie)
      var identifiant = localStorage.getItem('identifiant'); // et on le récupère

      var filePath = 'http://localhost:8000/' + identifiant + '/drawing/'; // donne le chemin d'accès au dossier

      var divClone = $("#classifList").clone(); // on garde en mémoire l'état d'origine pour le remettre une fois une couche ajoutée

      var xmlhttp = new XMLHttpRequest();
      this.xmlhttp = this;
      xmlhttp.open("GET", filePath, true);
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {

          let html = xmlhttp.responseText; // renvoie un texte au format html où la liste des fichers est dans une li
          result = $(html).find("li > a"); // on récupère tous les li


          for(let i=0;i<result.length;i++) {
            noms.push(result[i].innerText);
            json.push(filePath + result[i].innerText);

            // créé les boutons qui récupère les infos du serveur
            var couche = document.createElement("BUTTON");
            couche.innerHTML = noms[i];
            document.getElementById("fileList").appendChild(couche);
            let espace = document.createElement("br");
            document.getElementById("fileList").appendChild(espace);

            // Pour chaque bouton, créé une checkbox dans l'onglet "mes couches"
            couche.addEventListener('click', (e) => {
              document.querySelector('#fileList').classList.add('hidden');

              let item = document.createElement('div');
              item.classList.add('nowrap');
              let checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = noms[i];
              checkbox.id = id[i];
              let label = document.createElement('label');
              label.htmlFor = id[i];
              label.appendChild(document.createTextNode(noms[i]));
              item.appendChild(checkbox);
              item.appendChild(label);
              document.getElementById("mescouches").appendChild(item);
              document.querySelector('#mescouches').style.display = "block";

              // L'evenement pour afficher la nouvelle couche
              checkbox.addEventListener('change', (e) => {
                if(e.target.checked){
                  if(globe.dataSources[noms[i]] === undefined){
                    globe.loadDrawing(json[i], noms[i], options);
                  } else{
                    globe.dataSources[noms[i]].show = true;
                    globe.viewer.scene.requestRender();
                  }
                } else{
                  if(globe.dataSources[noms[i]] !== undefined){
                    globe.dataSources[noms[i]].show = false;
                    globe.viewer.scene.requestRender();
                  }
                }
              });
            });
          }
        }
      };

      xmlhttp.send();
    });
  }

  /*
  * Fin de la classe Menu
  */

}
