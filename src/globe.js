"use strict";
// web server: http://127.1.0.0:8000/


// Créé un object globe qui pertmet de manipuler cesium plus simplement

/**
* La classe Globe va permettre de manipuler Cesium plus facilement ; elle contient toutes les fonctions techniques,
* qui vont permettre d’ajouter des couches de données,
* de dessiner, de découper, d’ajouter des points de vues de caméra, etc. <br/>
* Les fonctions peuvent être réutilisées dans un autre projet
*
*
*/

class Globe {

  /**
  * Le constructeur de la classe globe, qui créé :  <br/>
  * - le viewer Cesium <br/>
  * - le handler c’est à dire l’objet qui va contenir les évènements liés à la souris <br/>
  * - le tableau contenant les dataSources <br/>
  * - la grille Raf09 pour les conversions hauteur ellipsoïdale/altitude <br/>
  * - le PinBuilder <br/>
  * - déclare toutes les checkbox de la boîte à outils pour l'affichage dynamique <br/>
  * - définit les valeurs par défaut pour le réglage du contraste et luminosité <br/>
  *
  * on supprime aussi le fond de plan, on définit la couleur de fond et on ajoute les logos en bas de l’écran
  *
  * @param  {String} elementId Le nom du contenant html dans lequel on l'ajoute
  * @param  {Object} geocoder Le Geocoder à associer
  */

  constructor(elementId, geocoder){
    // Activer cette ligne pour avoir accès aux différents fonds de plan dispo - accès vers mon compte Cesium
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDA3NDMwNi0zZGZmLTQ1MzEtOWZjOC1mNzE5YWM2MDkxNjkiLCJpZCI6ODEzNCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MTI4MTk1NH0.bj-9TqaOHDBD8sMBIeIWTH6-YVl-1Zp6fxjjgP3OXEg';

    // Créer le globe dans la div HTML qui a l'id cesiumContainer
    this.viewer = new Cesium.Viewer(elementId, {
      geocoder: geocoder, // connexion à la base de données d'adresses de l'EMS
      selectionIndicator: false, // enlève le carré vert lorsqu'on clique sur qqch
      requestRenderMode : true, // amélioration de performance: l'appli calcule uniquement quand on lui demande (https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/)
        maximumRenderTimeChange : Infinity,
        baseLayerPicker: false, // enlève le bouton qui permet de choisir le fond de plan
        //scene3DOnly : true, // enlève le bouton permettant de basculer la vue en 2D
        gamma : 5,
        highDynamicRange : true,
        skyBox : new Cesium.SkyBox({ // définit le ciel bleu
          sources : {
            positiveX : 'src/img/Sky.jpg',
            negativeX : 'src/img/Sky.jpg',
            positiveY : 'src/img/Sky.jpg',
            negativeY : 'src/img/Sky.jpg',
            positiveZ : 'src/img/Sky.jpg',
            negativeZ : 'src/img/Sky.jpg'
          }
        })
      });

      //this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {}); // pour ajouter la flèche nord (plus compatible avec Cesium 1.67)


      //PHS
      // Supprime le terrain par défaut sur le globe
      this.viewer.scene.imageryLayers.removeAll();
      // Définit la couleur de fond du globe étant donné qu'on a supprimé le terrain
      this.viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#AB9B8B').withAlpha(0.4);
      // importe la grille de conversion pour hauteur ellispoïdale vers altitude IGN69
      this.raf09 = undefined;
      new Raf09('src/grilles/RAF09.mnt', (raf090) => {
        this.raf09 = raf090;
      });

      // Créer la liste des dataSource sous forme d'un object clé / valeur
      // Avec le nom de la source comme clé et la dataSource comme valeur
      this.dataSources = [];

      // insère les logos en bas
      this.viewer.bottomContainer.innerHTML = '<img src="src/img/logo/logo-strasbourg.png" alt="Logo strasbourg" />\
      <img src="src/img/logo/europe-sengage.jpg" alt="Logo strasbourg" />\
      <img src="src/img/logo/logo-ue.jpg" alt="Logo strasbourg" />\
      <span style="color: #BEC8D1;font-size:small;"> Icons created by : <a style="color: #BEC8D1;font-size:small;" href="https://icons8.com" target="_blank" > https://icons8.com </span>';

      // variable qui stocke les évenements liés à la souris
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

      // Construction de pin pour les billboard
      this.pinBuilder = new Cesium.PinBuilder();

      /*
      * Div pour les affichage de coordonnées et mesures
      */
      // mesures de coords
      this.coordX = document.querySelector('#coordX');
      this.coordY = document.querySelector('#coordY');
      this.coordZ = document.querySelector('#coordZ');

      // mesures de distance
      this.distance = document.querySelector('#distance');
      this.distanceCumulee = document.querySelector('#distancecumulee');
      this.hauteur = document.querySelector('#hauteur');
      this.distanceInclinee = document.querySelector('#distanceinclinee');
      this.distanceInclineeC = document.querySelector('#distanceinclineecum');
      // mesures de surface
      this.aire = document.querySelector('#aire');
      // plan de coupe
      this.altitude = document.querySelector('#alticoupe');
      this.coupeX = document.querySelector('#X');
      this.coupeY = document.querySelector('#Y');
      this.coupeZ = document.querySelector('#hauteurcoupe');

      //paramètres de départ de l'amélioration du contraste et de la luminosité
      this.viewModel = {
        show : true,
        contrast : -98,
        brightness : 0.54,
        delta : 3.0,
        sigma : 5,
        stepSize : 0
      };

    }
    /*
    * Fin du constructor
    */

    /*
    *
    *  Contrôle de la caméra/de la vue affichée
    *
    */

    /**
    *
    * Permet de paramétrer la vue de base de l’application ainsi que le zoom par défaut sur lequel le viewer se repositionne lorsqu’on clique sur le bouton « maison » <br/>
    * Elle ne prend pas de paramètres mais considère deux cas différents : <br/>
    * Si l’URL ne contient pas de paramètres, elle définit le zoom sur le photomaillage global pour la vue de départ et le bouton maison <br/>
    * Si l’URL contient des paramètres spécifiques (outil partage de liens), elle lit ces paramètres pour zoomer à l’endroit voulu et définit le zoom par défaut sur cet endroit
    *
    */
    setHome(){
      var params = this.getAllUrlParams(window.location.href);
      let X = params.x;
      let Y = params.y;
      let Z = params.z;
      let heading = params.heading;
      let pitch = params.pitch;
      let roll = params.roll;

      // si l'URL ne contient pas de paramètres
      if(X === undefined || Y === undefined || Z === undefined || heading === undefined || pitch === undefined || roll === undefined) {
        let position = new Cesium.Cartesian3(4227894, 573584, 4758748);
        this.viewer.camera.setView({
          destination : position,
          orientation: {
            heading : 0.0,
            pitch : -0.808,
            roll : 0
          }
        });
      } else {
        // sinon on lit les paramètres présents dans l'URL
        let position = new Cesium.Cartesian3(X,Y,Z);
        this.viewer.camera.setView({
          destination : position,
          orientation: {
            heading : heading,
            pitch : pitch,
            roll : roll
          }
        });
      }
      // Définir ce qu'il se passe lorsqu'on clique sur le bouton "maison" (ici retour à l'écran d'accueil)
      this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
        e.cancel = true;
        if(X === undefined || Y === undefined || Z === undefined || heading === undefined || pitch === undefined || roll === undefined) {
          let position = new Cesium.Cartesian3(4227894, 573584, 4758748)
          this.fly(position, 0.0, -0.808, 0);

        } else {
          let position = new Cesium.Cartesian3(X,Y,Z);
          this.fly(position, heading, pitch, roll);
        }
      });
    }

    /**
    * lit et retourne les paramètres présents dans l'URL <br/>
    *
    * @param  {String} url L'url à analyser
    * @return  {Object} obj Un objet contenant les paramètres de l'url
    */
    getAllUrlParams(url) {
      var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
      var obj = {};

      if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
          var a = arr[i].split('=');
          var paramName = a[0];
          var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

          paramName = paramName.toLowerCase();
          if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

          if (paramName.match(/\[(\d+)?\]$/)) {
            var key = paramName.replace(/\[(\d+)?\]/, '');
            if (!obj[key]) obj[key] = [];

            if (paramName.match(/\[\d+\]$/)) {
              var index = /\[(\d+)\]/.exec(paramName)[1];
              obj[key][index] = paramValue;
            } else {
              obj[key].push(paramValue);
            }
          } else {
            if (!obj[paramName]) {
              obj[paramName] = paramValue;
            } else if (obj[paramName] && typeof obj[paramName] === 'string'){
              obj[paramName] = [obj[paramName]];
              obj[paramName].push(paramValue);
            } else {
              obj[paramName].push(paramValue);
            }
          }
        }
      }
      return obj;
    }

    /**
    * Définit le point de vue de caméra en fonction de la position de la caméra (Cartesian3) et des 3 paramètres d'orientation
    *
    * @param  {Cartesian3} position La position de la caméra
    * @param  {Number} lacet Le paramètre lacet d'orientation de la caméra
    * @param  {Number} tangage Le paramètre tangage d'orientation de la caméra
    * @param  {Number} roulis Le paramètre roulis d'orientation de la caméra
    */
    fly(position, lacet, tangage, roulis) {
      this.viewer.camera.flyTo({
        destination : position,
        orientation: {
          heading : lacet,
          pitch : tangage,
          roll : roulis
        }
      });
    }

    /**
    * Ajoute un bouton HTML qui enregistre un point de vue de caméra
    *
    * @param  {String} nom Le nom qu'on souhaite donner au point de vue
    * @return  {BoutonHTML} viewPoint Le bouton HTML avec le nom saisi
    */
    addViewPoint(nom) {
      var viewPoint = document.createElement("BUTTON");
      viewPoint.innerHTML = nom;
      viewPoint.classList.add('nowrap');
      document.getElementById("camera-content").appendChild(viewPoint);

      return viewPoint;

    }

    /**
    * récupère les paramètres actuels de position et orientation de la caméra ainsi que les couches cochées
    * pour créer un lien et l’afficher dans le format html correspondant
    */
    createLink() {
      // On récupère les paramètres de la caméra
      let X = globe.viewer.camera.positionWC.x;
      let Y = globe.viewer.camera.positionWC.y;
      let Z = globe.viewer.camera.positionWC.z;
      let heading = globe.viewer.camera.heading;
      let pitch = globe.viewer.camera.pitch;
      let roll = globe.viewer.camera.roll;

      // le premier paramètre doit débuter avec un "?" et les autres paramètres doivent être séparés par un "&"

      // On teste si le lien contient le paramètre open
      if (window.location.search.indexOf('open') > -1) {
        // on récupère l'url et on le sépare à chaque '?'
          var url = window.location.href.split('&');

          // si l'url contient déjà des paramètres d'orientation, on coupe la fin de l'url pour pouvoir en remettre des nouveaux après
          if (window.location.search.indexOf('X') > -1) {
            url.splice(url.length-6, 6);
          }

          var string = '&';
          for (let i = 1; i < url.length; i++) {
            var minuscule = url[i].toLowerCase();
            string += minuscule + '&';
          }

          // on créé le lein
          document.getElementById('nomlink').value = url[0] + string +'X='+X+'&Y='+Y+'&Z='+Z+'&heading='+heading+'&pitch='+pitch+'&roll='+roll;

      }  else { // si le lien ne contient rien du tout on regarde si les couches sont cochées
        var url = window.location.href.split('?');
        var couches = [];
        var open = [];

        // on récupère tous les id dans les panel-content
        $('.panel-content input').each(function(){
          if(this.id !== null) {
            couches.push(this.id);
          }
        });

        // si l'id est défini et coché, on le met dans un tableau
        for (let j = 0; j < couches.length; j++) {
          if(document.getElementById(couches[j]) !== null) {
            if (document.getElementById(couches[j]).checked) {
              open.push(couches[j]);
            }
          }
        }

        // on créé la chaine de caractère qui va permettre d'ouvrir toutes les couches
        var string = '?';
        for (let k = 0; k < open.length; k++) {
          var minuscule = open[k].toLowerCase();
          string += 'open' + k + '=enable' + minuscule + '&';

        }

        document.getElementById('nomlink').value = url[0] + string +'X='+X+'&Y='+Y+'&Z='+Z+'&heading='+heading+'&pitch='+pitch+'&roll='+roll;

      }

    }

    /*
    *
    * Chargement de données
    *
    */

    /**
    * Permet de charger et d'enregister le tileset au format 3DTiles <br/>
    * Ce format est important dans la fonction holePlanes, où on ajoute une collection de ‘clippingPlanes’ qui vont découper le photomaillage ;
    * l’ajout de cette collection n’est effectif qu’avec un format tileset <br/>
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {Number} maxError 'The maximum screen space error used to drive level of detail refinement', différent pour les deux photomaillages 2018 et PSMV
    * @param  {Object} options facultatif - Les options pour le chargement
    * @return  {tileset} tileset Le 3DTileset
    */
    loadPhotomaillage(link, maxError, options = {}){
      // Chargement du photo maillage au format 3D tiles
      let tileset = new Cesium.Cesium3DTileset({
        url : link, // URL vers le ficher JSON "racine"
        maximumScreenSpaceError : maxError,
        maximumNumberOfLoadedTiles : 1000, // Nombre maximum de dalles chargées simultanément
        lightColor : new Cesium.Cartesian3(3,2.8,2.4),
        imageBasedLightingFactor : new Cesium.Cartesian2(2,2),
        luminanceAtZenith : 0.5,
        immediatelyLoadDesiredLevelOfDetail : false,
        foveatedConeSize : 0.5,
        skipLevelOfDetail: true
      });
      return tileset;
    }

    /**
    * ajoute le tileset sous forme d'entités  et garde une structure asynchrone
    * qui permet de pouvoir naviguer dans l’application et d’interagir avec le photomaillage sans que celui-ci ne soit entièrement chargé
    *
    * @param  {tileset} tileset Le 3DTileset à ajouter
    * @return  {tileset} tilesetPrimitive l'entité contenant le tileset
    */
    addPhotomaillage(tileset) {
      var tilesetPrimitive = this.viewer.scene.primitives.add(tileset);
      return tilesetPrimitive.readyPromise;
    }


    /**
    * combine les deux addPhotomaillage et loadPhotomaillage : elle charge le 3DTiles et l’ajoute sous forme d’entités. <br/>
    * Le format tileset est perdue pour les modèles chargés avec cette fonction ;
    * elle permet entres autres de charger des projets 3D sans que ceux-ci ne soient impactés par les découpes effectuées dans le photomaillage
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {Object} options facultatif - Les options pour le chargement
    * @return  {tileset} tilesetPrimitive l'entité contenant le tileset
    */
    load3DTiles(link, options = {}){
      let tileset = globe.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url : link,
        maximumScreenSpaceError : 0.1,
        maximumNumberOfLoadedTiles : 1000

      }));
      return tileset.readyPromise;
    }

    /**
    *
    * Afficher ou masquer la source de données 3DTiles "name" en fonction de la valeur de "show" <br/>
    * Si elle n'a pas enore été affiché, la fonction va télécharger les données avec le lien "link" passé en parametre
    *
    * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
    * @param  {String} link Le lien vers le fichier
    * @param  {String} name Le nom qu'on donne au json
    * @param  {Object} options facultatif - Les options pour le chargement
    */
    show3DTiles(show, name, link, maxError, options = {}){
      if(show){
        if(this.dataSources[name] === undefined){
          globe.showLoader();

          globe.addPhotomaillage(globe.loadPhotomaillage(link, maxError, options)).then((data) => {
            this.dataSources[name] = data;
            globe.hideLoader();
          });

        } else{
          this.dataSources[name].show = true;
          this.viewer.scene.requestRender();
        }
      } else{
        if(this.dataSources[name] !== undefined){
          this.dataSources[name].show = false;
          this.viewer.scene.requestRender();
        }
      }
    }

    /**
    * Permet de charger les dessins exportés depuis Cesium <br/>
    * va chercher les propriétés de dessin (couleur, épaisseur de ligne, hauteur de volume, etc)
    * dans le json pour garder les propriétés à l'affichage <br/>
    * Utilise la fonction showPolygon pour afficher les données <br/>
    * Les points seront affichés simplement avec le même billboard pour tous
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {String} name Le nom qu'on donne au json
    * @param  {Object} options facultatif - Les options pour le chargement
    * @return  {GeoJsonDataSource} le json une fois que tout est chargé
    */
    loadDrawing(link, name, options = {}){
      let promisse = Cesium.GeoJsonDataSource.load(link, {
        clampToGround: true
      });
      this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

      promisse.then((dataSource) => {
        this.viewer.dataSources.add(dataSource);
        this.dataSources[name] = dataSource;
        this.hideLoader();

        // Get the array of entities
        var entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          if(Cesium.defined(entity.billboard)) {
            entity.billboard.height = entity.properties.height;
            entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            entity.billboard.image = entity.properties.image;

          } else if (Cesium.defined(entity.polygon)) {
            let rouge = entity.properties.color._value.red;
            let vert = entity.properties.color._value.green;
            let bleu = entity.properties.color._value.blue;
            let alpha = entity.properties.color._value.alpha;
            let couleur = new Cesium.Color(rouge, vert, bleu, alpha);

            entity.polygon.material =  couleur;
            entity.polygon.outline = false;
            entity.polygon.extrudedHeight = entity.properties.extrudedHeight;
            entity.polygon.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;

          } else if(Cesium.defined(entity.polyline)) {
            let rouge = entity.properties.color._value.red;
            let vert = entity.properties.color._value.green;
            let bleu = entity.properties.color._value.blue;
            let alpha = entity.properties.color._value.alpha;
            let couleur = new Cesium.Color(rouge, vert, bleu, alpha);

            entity.polyline.material = couleur;
            entity.polyline.width = entity.properties.width;
            entity.polyline.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;

          }
        }
      });
      return promisse;
    }

    /**
    * Affiche une icône de chargement sur l'écran
    */
    showLoader(){
      document.querySelector('#loadingIndicator').classList.remove('hidden');
    }
    /**
    * Retire l'icône de chargement sur l'écran
    */
    hideLoader(){
      document.querySelector('#loadingIndicator').classList.add('hidden');
    }

    /**
    *
    * Afficher ou masquer les ombres
    *
    * @param  {String} enabled le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
    */
    shadow(enabled){
      this.handler.globe = this; // pour les problèmes de scope
      this.viewer.shadows = enabled;
      if(enabled) {
        document.addEventListener("mousemove", function() {
          globe.viewer.scene.requestRender();
        });
      } else {
        this.supprSouris();
        globe.viewer.scene.requestRender();
      }
    }

    /*
    * Coordonnées
    */

    /**
    *
    * récupère lat/lon/hauteur à chaque clic gauche, les convertit en CC48 / IGN69 et les affiche
    */
    showCoords(){
      let scene = this.viewer.scene;
      this.handler.globe = this; // pour les problèmes de scope

      this.handler.setInputAction(function(event) {
        let cartesian = scene.pickPosition(event.position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian); // cartesian = coords géometriques de l'écran
          // cartographic est en radians

          let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7); // conversion en degrés décimaux
          let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
          let height = cartographic.height.toFixed(3);
          var coords = proj4('EPSG:4326','EPSG:3948', [longitude, latitude]);
          globe.coordX.innerHTML = coords[0].toFixed(2);
          globe.coordY.innerHTML = coords[1].toFixed(2);
          globe.coordZ.innerHTML = (Number(height) - Number(globe.raf09.getGeoide(latitude, longitude))).toFixed(2);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    /*
    * Plan de coupe horizontal
    */

    /**
    *
    * ajoute un plan de coupe horizontal <br/>
    * les paramètres de la fonction vont être lus dans le formulaire avant de cliquer sur 'ajouter'
    *
    * @param  {Number} X la coordonnée X du point au centre du plan
    * @param  {Number} Y la coordonnée Y du point au centre du plan
    * @param  {Number} hauteurCoupe la coordonnée Z du point au centre du plan
    * @param  {Number} longueurCoupe la largeur du plan
    * @param  {Number} largeurCoupe la longueur du plan
    * @param  {String} couleurCoupe la couleur du plan
    * @param  {Object} planeEntities les entités de plans
    * @param  {ClippingPlaneCollection} clippingPlanes la collection de plan (array) dans laquelle stocker les plans
    */
    addClippingPlanes(X, Y, hauteurCoupe, longueurCoupe, largeurCoupe, couleurCoupe, planeEntities, clippingPlanes) {
      // on n'associe pas les clippingPlanes au tileset: c'est pour ça qu'ils ne coupent pas le tileset mais passent à travers
      var clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes : [
          new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0, -1), 0.0) // donne l'orientation du clippingPlanes
        ]
      });

      for (var i = 0; i < clippingPlanes.length; i=+1) {
        var coords = proj4('EPSG:3948','EPSG:4326', [Number(X), Number(Y)]);
        var a = Number(this.raf09.getGeoide(coords[1], coords[0]));

        var y = coords[1];
        var x = coords[0];
        var z = (Number(hauteurCoupe) + a);

        var plane = clippingPlanes.get(i);
        var planeEntity = this.viewer.entities.add({
          position : Cesium.Cartesian3.fromDegrees(x, y, z),
          plane : {
            dimensions : new Cesium.Cartesian2(longueurCoupe, largeurCoupe),
            material : Cesium.Color.fromCssColorString(couleurCoupe).withAlpha(0.4),
            plane : new Cesium.CallbackProperty(this.planeUpdate(plane, couleurCoupe), false),
            outline : true,
            outlineColor : Cesium.Color.WHITE
          }
        });
        planeEntities.push(planeEntity);
      }
      this.viewer.scene.requestRender();
    }

    /**
    *  Récupère les coordonnées au clic et les affiche dans le formulaire du plan de coupe horizontal
    */
    coordCoupe(){
      let scene = this.viewer.scene;
      this.handler.globe = this;

      this.handler.setInputAction(function(event) {
        let cartesian = scene.pickPosition(event.position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
          let height = cartographic.height.toFixed(3);

          var coords = proj4('EPSG:4326','EPSG:3948', [longitude, latitude]);
          document.getElementById("X").value = (coords[0].toFixed(2));
          document.getElementById("Y").value = (coords[1].toFixed(2));
          document.getElementById("hauteurcoupe").value = ((Number(height) - Number(globe.raf09.getGeoide(latitude, longitude))).toFixed(2));
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    /**
    *
    *  permet de gérer les mouvements du plan de coupe avec la souris
    *
    * @param  {Object} plane l'entité de plan
    * @param  {String} couleurCoupe la couleur du plan à chaque évenement de souris
    * @return {Entity} shape l'entité plan avec les évènements associés
    */
    planeUpdate(plane, couleurCoupe) {
      var targetY = 0.0;
      var selectedPlane;
      var scene = this.viewer.scene;
      this.altitude.innerHTML = 0;
      this.handler.globe = this;

      // Select plane when mouse down
      this.handler.setInputAction(function(movement) {
        var pickedObject = scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
          selectedPlane = pickedObject.id.plane;
          selectedPlane.material = Cesium.Color.fromCssColorString(couleurCoupe).withAlpha(0.4);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Release plane on mouse up
      this.handler.setInputAction(function() {
        if (Cesium.defined(selectedPlane)) {
          selectedPlane.material = Cesium.Color.fromCssColorString(couleurCoupe).withAlpha(0.4);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          selectedPlane = undefined;
        }
        scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Update plane on mouse move
      this.handler.setInputAction(function(movement) {
        if (Cesium.defined(selectedPlane)) {
          var deltaY = movement.startPosition.y - movement.endPosition.y;
          targetY += deltaY;
        }
        globe.altitude.innerHTML = targetY; // affiche la différence entre l'altitude actuelle et l'altitude de départ (pas métrique)
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      return function () {
        plane.distance = targetY;
        return plane;
      };
    }

    /*
    *
    *
    *  Outils de dessin
    *
    *
    */

    /**
    *
    *  permet de créer un point: entité uniquement technique qui sert à dessiner les autres figures
    * (chaque point est affiché transparent)
    *
    * @param  {Cartesian3} worldPosition la position du point
    */
    createPoint(worldPosition) {
      var point = this.viewer.entities.add({
        position : worldPosition,
        point : {
          color : Cesium.Color.TRANSPARENT,
          pixelSize : 1,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND // plaque au 3dtiles
        }
      });
      return point;
    }

    /**
    *
    * Construit un marqueur maki (pin) à l'aide du symbole (url) et de la couleur <br/>
    * On ajoute directement les entités dans le tableau dans la fonction ici à cause de la structure asynchrone
    *
    * @param  {Array} billboard le tableau où stocker les entités billboard
    * @param  {Cartesian3} worldPosition la position du point
    * @param  {String} url le lien vers l'image à utiliser
    * @param  {String} couleur la couleur du pin
    * @param  {Number} height la hauteur du pin
    * @param  {Boolean} size true si on veut la taille en mètre, false si on veut la taille en pixels
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    createPinBillboard(billboard, worldPosition, url, couleur, height, size) {
      this.handler.globe = this;
      var url = Cesium.buildModuleUrl(url);
      Cesium.when(globe.pinBuilder.fromUrl(url, Cesium.Color.fromCssColorString(couleur), height), function(canvas) {
        var shape = globe.viewer.entities.add({
          position : worldPosition,
          billboard : {
            image : canvas.toDataURL(),
            height: height,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            sizeInMeters: size
          }
        });
        billboard.push(shape);
        return shape;
      });
    }

    /**
    *
    *  Ajoute un billboard simple (une image) à une position spécifiée (structure synchrone)
    *
    * @param  {Cartesian3} worldPosition la position du point
    * @param  {String} url le lien vers l'image à utiliser
    * @param  {Boolean} size true si on veut la taille en mètre, false si on veut la taille en pixels
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    createBillboard(worldPosition, url, size) {
      var symbol = this.viewer.entities.add({
        position : worldPosition,
        billboard : {
          image : url,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          sizeInMeters: size,
          scaleByDistance : new Cesium.NearFarScalar(10000, 1, 150000, 0)
        }
      });
      return symbol;
    }

    /**
    *
    *  Ajoute une polyligne
    *
    * @param  {Cartesian3} positionData les coordonnées des sommets de la ligne
    * @param  {Number} largeur la largeur de la ligne
    * @param  {String} couleur le couleur de la ligne
    * @param  {Number} transparence la transparence de la ligne
    * @param  {Boolean} clamp true si on veut que la ligne soit collée au photomaillage, false si pas collée
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    drawLine(positionData, largeur, couleur, transparence, clamp, name) {
      var shape = this.viewer.entities.add({
        name: name,
        polyline : {
          positions : positionData,
          material : Cesium.Color.fromCssColorString(couleur).withAlpha(transparence),
          clampToGround : clamp,
          width : largeur
        }
      });
      return shape;
    }

    /**
    *
    *  Ajoute une polyligne avec une flèche au bout
    *
    * @param  {Cartesian3} positionData les coordonnées des sommets de la ligne
    * @param  {Number} largeur la largeur de la ligne
    * @param  {String} couleur le couleur de la ligne
    * @param  {Number} transparence la transparence de la ligne
    * @param  {Boolean} clamp true si on veut que la ligne soit collée au photomaillage, false si pas collée
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    drawArrowLine(positionData, largeur, couleur, transparence, clamp) {
      var shape = this.viewer.entities.add({
        polyline : {
          positions : positionData,
          material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString(couleur).withAlpha(transparence)),
          clampToGround : clamp,
          width : largeur
        }
      });
      return shape;
    }

    /**
    *
    *  Ajoute une polyligne en pointillés
    *
    * @param  {Cartesian3} positionData les coordonnées des sommets de la ligne
    * @param  {Number} largeur la largeur de la ligne
    * @param  {String} couleur le couleur de la ligne
    * @param  {Number} transparence la transparence de la ligne
    * @param  {Boolean} clamp true si on veut que la ligne soit collée au photomaillage, false si pas collée
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    drawDashLine(positionData, largeur, couleur, transparence, clamp) {
      var shape = this.viewer.entities.add({
        polyline : {
          positions : positionData,
          material : new Cesium.PolylineDashMaterialProperty({
            color : Cesium.Color.fromCssColorString(couleur).withAlpha(transparence)
          }),
          clampToGround : clamp,
          width : largeur
        }
      });
      return shape;
    }

    /**
    *
    *  Ajoute une surface
    *
    * @param  {Cartesian3} positionData les coordonnées des sommets de la surface
    * @param  {String} couleur le couleur de la surface
    * @param  {Number} transparence la transparence de la surface
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    drawPolygon(positionData, couleur, transparence) {
      var shape = this.viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material : Cesium.Color.fromCssColorString(couleur).withAlpha(transparence)
        }
      });
      return shape;
    }

    /**
    *
    *  Ajoute une surface extrudée, ie une boîte pour laquelle on précise la hauteur
    *
    * @param  {Cartesian3} positionData les coordonnées des sommets de la boîte
    * @param  {String} couleur le couleur de la boîte
    * @param  {Number} transparence la transparence de la boîte
    * @param  {Number} hauteurVol la hauteur de la boîte
    * @return {Entity} shape l'entité ajoutée au viewer
    */
    drawVolume(positionData, couleur, transparence, hauteurVol) {
      var shape = this.viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material : Cesium.Color.fromCssColorString(couleur).withAlpha(transparence),
          extrudedHeight: hauteurVol,
          shadows : Cesium.ShadowMode.ENABLED
          //extrudedHeightReference : Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
      return shape;
    }

    /**
    *
    * La fonction qui permet de tout dessiner <br/>
    * le paramètre choice designe si on mesure (dessins temporaires) ou si on dessine
    * (dessins qui restent après fermeture de la fonction de dessin) <br/>
    * le paramètre choice2 désigne le type de dessin (line, surface, volume etc) <br/>
    * On met tous les tableaux d'entités en paramètres de la fonction car ils seront définis dans la classe Menu
    * pour garder une trace des entités et permettre leur annulation/exportation <br/>
    * Le reste des paramètres correspond aux paramètres de personnalisation définis par l'utilisateur dans les formulaires
    *
    * @param  {String} choice prend la valeur 'dessin' ou 'mesure'
    * @param  {String} choice2 le type d'entités à dessiner: 'point', 'line', 'polygon' ou 'volume'
    * @param  {String} couleur le couleur de l'entité
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Number} options.largeur la largeur de l'entité
    * @param  {Number} options.transparence la transparence de l'entité
    * @param  {Number} options.hauteurVol la hauteur de l'entité
    * @param  {String} options.url le lien vers les images pour les entités billboard
    * @param  {Array} options.billboard le tableau où stocker les entités billboard
    * @param  {Array} options.line le tableau où stocker les entités lignes
    * @param  {Array} options.surface le tableau où stocker les entités surface
    * @param  {Array} options.volume le tableau où stocker les entités boîte
    * @param  {Array} options.dline le tableau où stocker les entités lignes pour les mesures
    * @param  {Array} options.dsurface tableau où stocker les entités surface pour les mesures
    */
    updateShape(choice, choice2, couleur, options = {}) {
      var activeShapePoints = [];
      var activeShape;
      var floatingPoint;
      var z;
      var distanceList;
      var distanceListDebut = $("#distanceList").clone();

      var scene = this.viewer.scene;
      this.handler.globe = this; // problème de scope à l'intérieur du this.handler

      this.handler.setInputAction(function(event) {
        var earthPosition = scene.pickPosition(event.position);
        if(Cesium.defined(earthPosition)) {
          if(activeShapePoints.length === 0) {
            // on ajoute 2 fois un point au début pour permettre l'affichage de la ligne/surface
            // le dernier point correspond au point flottant du mouvement de la souris
            floatingPoint = globe.createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            activeShapePoints.push(earthPosition);
            var dynamicPositions = new Cesium.CallbackProperty(function () {
              if (choice === 'polygon' || choice === 'volume') {
                return new Cesium.PolygonHierarchy(activeShapePoints);
              }
              return activeShapePoints;
            }, false);
            options.largeur = parseFloat(options.largeur);
            options.transparence = parseFloat(options.transparence);
            if(choice === 'point') {
              activeShape = globe.createPoint(dynamicPositions);
              if($('#taille').val() === 'metre') {
                floatingPoint = globe.createPinBillboard(options.billboard, earthPosition, options.url, couleur, options.hauteurVol, true);
                options.billboard.pop();
              } else if($('#taille').val() === 'pixel') {
                floatingPoint = globe.createPinBillboard(options.billboard, earthPosition, options.url, couleur, options.hauteurVol, false);
              }
            } else if(choice === 'polygon') {
              activeShape = globe.drawPolygon(dynamicPositions, couleur, options.transparence);
            } else if(choice === 'volume') {
              z = globe.getHauteur(activeShapePoints, options.hauteurVol);
              activeShape = globe.drawVolume(dynamicPositions, couleur, options.transparence, z);
            } else if(choice === 'line') {
              if(choice2 === 'mesure') {
                activeShape = globe.drawLine(dynamicPositions, options.largeur, couleur, options.transparence, false); // 1ère ligne non collée au sol pour la distance inclinée
                options.largeur = parseFloat(options.largeur);
                activeShape = globe.drawLine(dynamicPositions, options.largeur, '#000000', '0.5', true); // 2ème collée au sol pour distance horizontale
              } else if(choice2 === 'dessin') {
                couleur = couleur.toString();
                if($('#clampligne').val() === 'colle') { // clamp to ground ou pas
                  if($('#styleligne').val() === 'simple') { // style normal
                    activeShape = globe.drawLine(dynamicPositions, options.largeur, couleur, options.transparence, true);
                  } else if($('#styleligne').val() === 'pointille') { // style pointillé
                    activeShape = globe.drawDashLine(dynamicPositions, options.largeur, couleur, options.transparence, true);
                  } else if($('#styleligne').val() === 'fleche') { // avec une flèche à la fin
                    activeShape = globe.drawArrowLine(dynamicPositions, options.largeur, couleur, options.transparence, true);
                  }
                } else if($('#clampligne').val() === 'noncolle'){ // mêmes instructions avec la ligne non collée au sol
                  if($('#styleligne').val() === 'simple') {
                    activeShape = globe.drawLine(dynamicPositions, options.largeur, couleur, options.transparence, false);
                  } else if($('#styleligne').val() === 'pointille') {
                    activeShape = globe.drawDashLine(dynamicPositions, options.largeur, couleur, options.transparence, false);
                  } else if($('#styleligne').val() === 'fleche') {
                    activeShape = globe.drawArrowLine(dynamicPositions, options.largeur, couleur, options.transparence, false);
                  }
                }
              }
            }
          } else {
            activeShapePoints.push(earthPosition);
            if(choice === 'point'){
              globe.createPoint(earthPosition);
              if($('#taille').val() === 'metre') {
                globe.createPinBillboard(options.billboard, earthPosition, options.url, couleur, options.hauteurVol, true);
              } else if($('#taille').val() === 'pixel') {
                globe.createPinBillboard(options.billboard, earthPosition, options.url, couleur, options.hauteurVol, false);
              }
            } else {
              globe.createPoint(earthPosition);
            }
          }
        }
        if(choice === 'polygon'&& choice2 === 'mesure') {
          globe.measureSurface(activeShapePoints); // mesure l'aire du polygone à chaque clic gauche
        }
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.handler.setInputAction(function(event) {
        if(Cesium.defined(floatingPoint)) {
          var newPosition = scene.pickPosition(event.endPosition);
          if (Cesium.defined(newPosition)) {
            floatingPoint.position.setValue(newPosition);
            activeShapePoints.pop();
            activeShapePoints.push(newPosition);
          }
        }
        if(choice === 'line' && choice2 === 'mesure') {
          globe.measureDistance(activeShapePoints); // mesure la distance à chaque mouvement de souris
          distanceList = $("#distanceList").clone();
        }
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.handler.setInputAction(function(event) {
        options.largeur = parseFloat(options.largeur);
        options.transparence = parseFloat(options.transparence);
        // on supprime le dernier point flottant
        activeShapePoints.pop();

        // on ajoute les entités dans le taleau d'entités correspondant
        if(choice2 === 'dessin'){
          if(choice === 'point') {
            globe.createPoint(activeShapePoints);
            if($('#taille').val() === 'metre') {
              globe.createPinBillboard(options.billboard, activeShapePoints, options.url, couleur, options.hauteurVol, true);
            } else if($('#taille').val() === 'pixel') {
              globe.createPinBillboard(options.billboard, activeShapePoints, options.url, couleur, options.hauteurVol, false);
            }
          } else if(choice === 'line') {
            if($('#clampligne').val() === 'colle') {
              if($('#styleligne').val() === 'simple') {
                options.line.push(globe.drawLine(activeShapePoints, options.largeur, couleur, options.transparence, true));
              } else if($('#styleligne').val() === 'pointille') {
                options.line.push(globe.drawDashLine(activeShapePoints, options.largeur, couleur, options.transparence, true));
              } else if($('#styleligne').val() === 'fleche') {
                options.line.push(globe.drawArrowLine(activeShapePoints, options.largeur, couleur, options.transparence, true));
              }
            } else if($('#clampligne').val() === 'noncolle') {
              if($('#styleligne').val() === 'simple') {
                options.line.push(globe.drawLine(activeShapePoints, options.largeur, couleur, options.transparence, false));
              } else if($('#styleligne').val() === 'pointille') {
                options.line.push(globe.drawDashLine(activeShapePoints, options.largeur, couleur, options.transparence, false));
              } else if($('#styleligne').val() === 'fleche') {
                options.line.push(globe.drawArrowLine(activeShapePoints, options.largeur, couleur, options.transparence, false));
              }
            }

          } else if( choice === 'polygon') {
            options.surface.push(globe.drawPolygon(activeShapePoints, couleur, options.transparence));
          } else if( choice === 'volume') {
            options.volume.push(globe.drawVolume(activeShapePoints, couleur, options.transparence, z));
          }
        } else if(choice2 === 'mesure'){
          if(choice === 'line') {
            options.dline.push(globe.drawLine(activeShapePoints, options.largeur, couleur, options.transparence, false));
            options.dline.push(globe.drawLine(activeShapePoints, options.largeur, '#000000', '0.5', true));
          } else if( choice === 'polygon') {
            options.dsurface.push(globe.drawPolygon(activeShapePoints, couleur, options.transparence));
          }
        }
        globe.viewer.entities.remove(floatingPoint);
        globe.viewer.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];

        if(choice === 'line' && choice2 === 'mesure') {
          // permet de garder l'affichage des mesures actif
          $("#distanceList").replaceWith(distanceList);
        }

        globe.viewer.scene.requestRender();
        //options.billboard.pop(); // quand on clique droit avec le billboard Cesium ajoute un billboard à la position (0,0,0)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }

    /**
    *
    *  Enlève la dernière entité dans le tableau spécifié en paramètre
    *
    * @param  {String} element l'élément HTML sur lequel ajouter l'évènement
    * @param  {Array} figure le tableau d'entités à impacter
    */
    annulFigure(element, figure) {
      document.querySelector(element).addEventListener('click', (e) => {
        var lastLine = figure.pop();
        this.viewer.entities.remove(lastLine);
        this.viewer.scene.requestRender();
      });
    }

    /**
    *
    *  Supprime toutes les entités par catégorie (vide le tableau correspondant)
    *
    * @param  {String} element l'élément HTML sur lequel ajouter l'évènement
    * @param  {Array} figure le tableau d'entités à impacter
    */
    supprFigure(element, figure) {
      document.querySelector(element).addEventListener('click', (e) => {
        for(var i = 0; i < figure.length; i++){
          this.viewer.entities.remove(figure[i]);
        }
        for(var j = 0; j <= figure.length+1; j++){
          figure.pop();
        }
        this.viewer.scene.requestRender();
      });
      this.viewer.scene.requestRender();
    }

    /**
    *
    *  Permet de mesurer la distance horizontale et inclinée entre deux points
    *
    * @param  {Object} activeShapePoints le tableau de coordonnées cartésiennes x y z des points à partir duquel calculer la distance
    */
    measureDistance(activeShapePoints)  {
      var coordsX = [];
      var coordsY = [];
      var coordsZ = [];
      var distance;
      var distanceIncl;
      var difference;
      var distCumul =0;
      var distInclCumul =0;

      for (let i=0; i < activeShapePoints.length; i+=1) {
        // convertit les coordonnées cartésiennes en lat/lon, puis en CC48
        var cartesian = new Cesium.Cartesian3(activeShapePoints[i].x, activeShapePoints[i].y, activeShapePoints[i].z);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
        let height = cartographic.height.toFixed(3);

        var coords = proj4('EPSG:4326','EPSG:3948', [longitude, latitude]);
        // on stocke chque coordonnée dans un tableau séparé pour faliciter le calcul
        coordsX.push(coords[0]);
        coordsY.push(coords[1]);
        var z = (Number(height) - Number(this.raf09.getGeoide(latitude, longitude))); // conversion des hauteurs
        coordsZ.push(z);
      }

      for (let i=0; i < coordsX.length-1; i+=1) {
        // calcul de distances et différences d'alti
        var a = (coordsX[i+1]-coordsX[i])*(coordsX[i+1]-coordsX[i]);
        var b = (coordsY[i+1]-coordsY[i])*(coordsY[i+1]-coordsY[i]);
        var c = (coordsZ[i+1]-coordsZ[i])*(coordsZ[i+1]-coordsZ[i]);

        distance = Number(Math.sqrt(a+b).toFixed(3));
        distanceIncl = Number(Math.sqrt(a+b+c).toFixed(3));
        difference = Number(coordsZ[i+1]-coordsZ[i]).toFixed(2);

        if(distance !== undefined) {
          distCumul = Number((distCumul + distance).toFixed(2));
          $("#distancecumulee").text(distCumul);
          distInclCumul = Number((distInclCumul + distanceIncl).toFixed(2));
          $("#distanceinclineecum").text(distInclCumul);
        }
      }

      if(distance !== undefined) {
        $("#distance").text((distance.toFixed(2).toString()));
        $("#distanceinclinee").text((distanceIncl.toFixed(2).toString()));
        $("#hauteur").text((difference.toString()));
        distance = 0;
        distanceIncl = 0;
        difference = 0;
        distCumul = 0;
        distInclCumul = 0;
      }
    }

    /**
    *
    *  Mesure l'aire plaquée au sol (2D) du polygone dessiné (le calcul de surface s'effectue uniquement avec les coordonnées XY)
    *
    * @param  {Array} activeShapePoints le tableau de coordonnées cartésiennes x y z des points à partir duquel calculer l'aire
    */
    measureSurface(activeShapePoints) {
      var coordsX = [];
      var coordsY = [];
      var aire = 0;
      this.aire.innerHTML = 0;

      for (let i=0; i < activeShapePoints.length-1; i+=1) {
        // convertit les coordonnées cartésiennes en lat/lon, puis en CC48
        var cartesian = new Cesium.Cartesian3(activeShapePoints[i].x, activeShapePoints[i].y, activeShapePoints[i].z);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);

        var coords = proj4('EPSG:4326','EPSG:3948', [longitude, latitude]);
        coordsX.push(coords[0]);
        coordsY.push(coords[1]);
      }

      // dès qu'on a au moins 3 sommets
      if(coordsX.length > 2){
        for (let i=0; i < coordsX.length; i+=1) {
          // le % est un modulo qui permet de faire une boucle des sommets (ie sommet n+1 = sommet 1)
          var a = (coordsX[(i+1) % coordsX.length] - coordsX[i]);
          var b = (coordsY[(i+1) % coordsX.length] + coordsY[i] - (2 * coordsY[0]));
          var c = ((Number(a) * Number(b))/2);
          aire = (Number(aire) + Number(c)).toFixed(1);
        }
      }
      this.aire.innerHTML = Math.abs(aire);
    }

    /**
    *
    *  Récupère la hauteur d'un point en coords cartésiennes et la transforme en hauteur ellipsoïdale (pour le dessin de volumes)
    *
    * @param  {Array} activeShapePoints le tableau de points à partir duquel calculer l'aire
    * @param  {Number} hauteurVol la hauteur de l'entité
    * @return {Number} z la hauteur ellipsoïdale du point
    */
    getHauteur(activeShapePoints, hauteurVol){
      var cartesian = new Cesium.Cartesian3(activeShapePoints[0].x, activeShapePoints[0].y, activeShapePoints[0].z);
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      let alti = cartographic.height.toFixed(3);

      var z = (Number(hauteurVol) + Number(alti));
      return z;
    }

    /*
    *
    * Découpe dans le photomaillage
    *
    */

    /**
    * Découpe un trou dans le photomaillage - ajoute les points blancs visuellement et coupe selon la forme définie <br/>
    * La forme définie doit impérativement être convexe pour que la découpe soit cohérente
    *
    * @param  {tileset} viewModel le modèle 3D à impacter
    */
    createHole(viewModel) {
      var dig_point = [];
      var hole_pts = [];
      var coordsX = [];
      var coordsY = [];
      var aire = 0;
      var scene = this.viewer.scene;
      this.handler.globe = this;
      var points = globe.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());

      this.handler.setInputAction(function(event) {
        var earthPosition = scene.pickPosition(event.position);
        let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);

        var coords = proj4('EPSG:4326','EPSG:3948', [longitudeString, latitudeString]);
        coordsX.push(coords[0]);
        coordsY.push(coords[1]);

        // on ajoute visuellement des points pour la découpe qu'on supprimera au clic droit
        points.add({
          position : earthPosition,
          color : Cesium.Color.WHITE
        });

        dig_point.push(new Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString));
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.handler.setInputAction(function(event) {
        hole_pts = Array.from(dig_point);

        for (let i=0; i < coordsX.length; i+=1) {
          var a = (coordsX[(i+1) % coordsX.length] - coordsX[i]);
          var b = (coordsY[(i+1) % coordsX.length] + coordsY[i] - (2 * coordsY[0]));
          var c = ((Number(a) * Number(b))/2);
          aire = (Number(aire) + Number(c)).toFixed(3);
        }

        // si l'aire est négative (ie si l'utilisateur a dessiné sa figure dans le sens trigo)
        // on inverse le tableau de points pour que la découpe marche
        if(aire > 0) {
          globe.holePlanes(viewModel, hole_pts);
        } else if(aire < 0) {
          hole_pts = hole_pts.reverse();
          globe.holePlanes(viewModel, hole_pts);
        }
        points.removeAll();
        dig_point = [];
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      // définit les actions sur les 2 options du formulaire (afficher ou inverser la découpe)
      Cesium.knockout.getObservable(viewModel, 'affich').subscribe(function(value) {
        tileset.clippingPlanes.enabled = value;
      });
      Cesium.knockout.getObservable(viewModel, 'trou').subscribe(function(value) {
        globe.holePlanes(viewModel, hole_pts);
      });
    }

    /**
    * Ajoute les plans de coupes nécessaire à la visualisation de la découpe dans la fonction createHole
    *
    * @param  {tileset} viewModel le modèle 3D à impacter
    * @param  {Array} hole_pts les coordonnées de la forme à découper
    */
    holePlanes(viewModel, hole_pts) {
      var pointsLength = hole_pts.length;
      var clippingPlanes = [];

      for (var i = 0; i < pointsLength; ++i) {
        var nextIndex = (i + 1) % pointsLength;
        var midpoint = Cesium.Cartesian3.add(hole_pts[i], hole_pts[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
        var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        var right = Cesium.Cartesian3.subtract(hole_pts[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);
        var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);
        if (!viewModel.trou){
          normal = Cesium.Cartesian3.multiplyByScalar(normal, -1 ,normal);
        }
        var plane = new Cesium.Plane.fromPointNormal(midpoint, normal);
        var clippingPlane = new Cesium.ClippingPlane.fromPlane(plane);
        clippingPlanes.push(clippingPlane);
      }

      // pour couper le globe
      /*this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes : clippingPlanes,
      unionClippingRegions : union,
      edgeColor: Cesium.Color.WHITE,
    });*/

    // pour couper le photomaillage
    tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes : clippingPlanes,
      unionClippingRegions: viewModel.trou, //si true: coupe tout ce qui est à l'extérieur de la zone cliquée
      enabled: viewModel.affich,
      edgeColor: Cesium.Color.WHITE,
      modelMatrix: Cesium.Matrix4.inverse(tileset._initialClippingPlanesOriginMatrix, new Cesium.Matrix4()) // ligne importante: on est obligés de passer par cette transfo de matrice car notre tileset n'a pas de matrice de transfo à la base
    });
  }

  /**
  * permet de cliquer les attributs sur le 3DTiles <br/>
  * colorise en vert les contours de la zone cliquée
  *
  * @param  {String} enabled le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
  * @param  {tileset} tileset le modèle 3D à impacter
  */
  handleBatimentClick(enabled, tileset){
    var scene = this.viewer.scene;
    this.handler.globe = this;

    // Informations sur le batiment séléctionné
    let selected = {
      feature: undefined,
      originalColor: new Cesium.Color(),
      selectedEntity: new Cesium.Entity() // Une entité qui contient les attributs du batiments selectionné
    };

    let defaultClickHandler = this.viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(this.viewer.scene)) {
      // Créer la bordure verte
      let silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteGreen.uniforms.color = Cesium.Color.fromCssColorString('#E20000').withAlpha(0.7);
      silhouetteGreen.uniforms.length = 0.01;
      silhouetteGreen.selected = [];
      // Enregistrer les bordures dans cesium
      this.viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteGreen]));

      this.handler.setInputAction(function(movement) {
        // Supprimer toutes les bordures verte
        silhouetteGreen.selected = [];
        // Récuperer la forme sur laquelle on a cliqué
        let pickedFeature = scene.pick(movement.position);
        // Si on clique sur un element qui n'appartient pas à tileset on ne met pas de bordure verte
        if (!Cesium.defined(pickedFeature) || !Cesium.defined(pickedFeature.content) || pickedFeature.content._tileset != tileset) {
          selected.feature = undefined;
          defaultClickHandler(movement);
          return;
        }
        // Ajouter le bord vert sur la forme selectionnée
        if (pickedFeature !== silhouetteGreen.selected[0]) {
          silhouetteGreen.selected = [pickedFeature];

          selected.feature = pickedFeature;
          selected.selectedEntity.name = pickedFeature.getProperty('name');
          selected.selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>';

          // Générer les lignes du tableau
          let propertyNames = pickedFeature.getPropertyNames();
          for(let i = 0; i < propertyNames.length; i++){
            selected.selectedEntity.description += '<tr><th>' + propertyNames[i] + '</th><td>' + pickedFeature.getProperty(propertyNames[i]) + '</td></tr>';
          }
          selected.selectedEntity.description += '</tbody></table>';

          // Afficher le tableau en haut à droite
          globe.viewer.selectedEntity = selected.selectedEntity;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Quitter la fonction pour desactiver la selection de batiments
      if(!enabled){
        silhouetteGreen.selected = [];
        return;
      }
    }
  }

  /**
  * supprime toutes les actions liées à la souris sur le handler de Cesium (clic gauche, droit et mouvement de souris)
  */
  supprSouris(){
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
  * Gere la luminosité et le contraste
  */
  updatePostProcess() {
    var bloom = globe.viewer.scene.postProcessStages.bloom;
    bloom.enabled = Boolean(globe.viewModel.show);
    bloom.uniforms.contrast = Number(globe.viewModel.contrast);
    bloom.uniforms.brightness = Number(globe.viewModel.brightness);
    bloom.uniforms.delta = Number(globe.viewModel.delta);
    bloom.uniforms.sigma = Number(globe.viewModel.sigma);
    bloom.uniforms.stepSize = Number(globe.viewModel.stepSize);
    globe.viewer.scene.requestRender();

  }


  /*
  *
  *
  *
  * Les fonctions de chargements des données opendata
  * Surfaciques, linéaires, ponctuelles, temporelles
  * Chaque fonction load a une fonction show associées pour simplifier les ajouts de couches et les arguments en paramètres
  *
  *
  *
  */

  /**
  *
  * permet de charger des fichiers geojson surfaciques <br/>
  * il est conseillé de donner un nom compréhensible à la variable choice: par défaut, c'est cette variable qui donne son nom aux entités <br/>
  * Note: dans le fichier param.js, l'option classification vaut toujours true <br/>
  * Optionnel: trace un contour autour des surfaces
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice permet de classifier la donnée pour charger le tableau d'attributs
  * @param  {Object} options facultatif - Les options pour le chargement
  * @param  {Boolean} options.classification true si la donnée doit être classifiée
  * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
  * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
  * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
  * @param  {Array} options.line Le tableau d'entités pour stocker les lignes de contours des polygones
  * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
  * @param  {String} options.couleurLigne La couleur des lignes de contour au format '#FFFFFF'
  * @param  {Number} options.tailleLigne La largeur des lignes de contour
  * @param  {String} options.nameLigne La nom des lignes de contour
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPolygon(link, name, choice, options = {}) {

    let promisse = Cesium.GeoJsonDataSource.load(link, {
      clampToGround: true
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // test pour voir si les json arrête de baver
    this.viewer.scene.logarithmicDepthBuffer = false; // idem
    this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

    promisse.then((dataSource) => {
      // Ajoute le json dans la liste des dataSource
      this.viewer.dataSources.add(dataSource);
      this.dataSources[name] = dataSource;
      this.hideLoader();

      // permet de classifier les json
      if(options.classification && options.classificationField !== undefined){
        // Get the array of entities
        let entities = dataSource.entities.values;
        if(options.colors != undefined){
          Object.keys(options.colors).forEach(function(c){
            options.colors[c] = Cesium.Color.fromCssColorString(options.colors[c]);
            options.colors[c].alpha = options.alpha || 0.8;
          })
        }
        let colors = options.colors || {};

        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          if (Cesium.defined(entity.polygon)) {
            let color = colors[entity.properties[options.classificationField]];
            if(!color){
              color = Cesium.Color.fromRandom({ alpha : options.alpha || 0.8 });
              colors[entity.properties[options.classificationField]] = color;
            }

            // si la donnée n'a pas de tableau d'attributs particulier, on change juste le nom des entités
            entity.name = choice;

            if(options.choiceTableau !== undefined) {
              var tabl = new TableauAttribut();

              // l'attribut choiceTableau permet de classifier entre les différentes données et de charger le tableau d'attributs au bon format
              var tablAttribut = 'createTableau' + options.choiceTableau;
              tabl[tablAttribut](entity, dataSource);
            }

            //Dessine le contour des limites des entités
            if(options.couleurLigne !== undefined) {
              options.line.push(this.drawLine(entity.polygon.hierarchy._value.positions, options.tailleLigne, options.couleurLigne, 0.7, true, options.nameLigne));
            }

            // on classifie les entités par couleur
            entity.polygon.material = color;
            entity.polygon.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;
            entity.polygon.arcType = Cesium.ArcType.GEODESIC;
          }
        }
        globe.viewer.scene.requestRender();
      }

    })
    return promisse;

  }


  /**
  * La fonction show associée à loadPolygon <br/>
  * Charger ou dé-charger la donnée "name" en fonction de la valeur de "show" <br/>
  * Met un highlight sur les entités selectionnées en cliquant
  * optionnel: peut mettre un highlight sur les entités sélectionnées en cliquant
  *
  * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice permet de classifier la donnée pour charger le tableau d'attributs
  * @param  {Object} options facultatif - Les options pour le chargement
  * @param  {Boolean} options.classification true si la donnée doit être classifiée
  * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
  * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
  * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
  * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
  * @param  {Array} options.line Le tableau d'entités pour stocker les lignes de contours des polygones
  * @param  {String} options.couleurLigne La couleur des lignes de contour au format '#FFFFFF'
  * @param  {Number} options.tailleLigne La largeur des lignes de contour
  * @param  {String} options.nameLigne La nom des lignes de contour
  * @param  {String} options.couleurSurf La couleur du highlight quand on clique à l'intérieur du polygone au format '#FFFFFF'
  * @param  {Number} options.transparence La transparence du highlight

  */
  showPolygon(show, name, link, choice, options = {}){
    var handler = new Cesium.ScreenSpaceEventHandler(globe.viewer.canvas);

    if(this.dataSources[name] == undefined) {
      if(options.couleurSurf !== undefined) {
        var highlighted = {
          feature : undefined,
          originalMaterial : new Cesium.Color()
        };
        // when we click on the entity change its scale and color
        handler.setInputAction(function(movement) {
          var pickedObject = globe.viewer.scene.pick(movement.position);
          if (!Cesium.defined(pickedObject)) {
            return;
          }
          // If a feature was previously highlighted, undo the highlight
          if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.id.polygon.material = highlighted.originalMaterial;
            highlighted.feature = undefined;
            globe.viewer.scene.requestRender();
          }
          // colorer la zone cliquée dans une couleur précise
          if (Cesium.defined(pickedObject)) {
            if (pickedObject.id.name === choice ) {
              highlighted.feature = pickedObject;
              highlighted.originalMaterial = pickedObject.id.polygon.material;
              pickedObject.id.polygon.material = Cesium.Color.fromCssColorString(options.couleurSurf).withAlpha(options.transparence);
              globe.viewer.scene.requestRender();
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }

    if(show){
      if(this.dataSources[name] !== undefined){
        this.viewer.dataSources.remove(this.dataSources[name]);
        this.viewer.scene.requestRender();
      }

      globe.loadPolygon(link, name, choice, options);
      if(options.couleurLigne !== undefined) {
        for(var i = 0; i < options.line.length; i++){
          options.line[i].show = true;
        }
      }
    } else{

      if(this.dataSources[name] !== undefined){
        this.viewer.dataSources.remove(this.dataSources[name]);

        if(options.couleurLigne !== undefined) {
          for(var i = 0; i < options.line.length; i++){
            options.line[i].show = false;
          }
        }

        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.viewer.scene.requestRender();
      }
    }
  }

  /**
  * permet de charger des fichiers geojson linéaires <br/>
  * il est conseillé de donner un nom compréhensible à la variable choice: par défaut, c'est cette variable qui donne son nom aux entités
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice spécifique à la donnée de donner un nom aux entités
  * @param  {Boolean} clamp true pour clampToGround et false sinon
  * @param  {Object} options facultatif - Les options pour le chargement
  * @param  {Boolean} options.classification true si la donnée doit être classifiée
  * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
  * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
  * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
  * @param  {Number} options.epaisseur L'épaisseur de la ligne
  * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPolyline(link, name, clamp, choice, options = {}) {
    let promisse = Cesium.GeoJsonDataSource.load(link, {
      clampToGround: clamp
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // test pour voir si les json arrête de baver
    this.viewer.scene.logarithmicDepthBuffer = false; // idem
    this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

    promisse.then((dataSource) => {
      // Ajoute le json dans la liste des dataSource
      this.viewer.dataSources.add(dataSource);
      this.dataSources[name] = dataSource;
      this.hideLoader();

      // permet de classifier les json
      if(options.classification && options.classificationField !== undefined){

        // Get the array of entities
        let entities = dataSource.entities.values;

        if(options.colors != undefined){
          Object.keys(options.colors).forEach(function(c){
            options.colors[c] = Cesium.Color.fromCssColorString(options.colors[c]);
            options.colors[c].alpha = options.alpha || 1;
          });
        }

        let colors = options.colors || {};
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];

          if (Cesium.defined(entity.polyline)) {
            let color = colors[entity.properties[options.classificationField]];
            if(!color){
              color = Cesium.Color.fromRandom({ alpha : options.alpha || 1 });
              colors[entity.properties[options.classificationField]] = color;
            }

            if(options.choiceTableau !== undefined) {
              var tabl = new TableauAttribut();
              // l'attribut choiceTableau permet de classifier entre les différentes données et de charger le tableau d'attributs au bon format
              var tablAttribut = 'createTableau' + options.choiceTableau;
              tabl[tablAttribut](entity, dataSource);
            }

            entity.polyline.material = color;
            if(options.epaisseur !== undefined){
              entity.polyline.width = options.epaisseur;
            } else {
              entity.polyline.width = 4.0;
            }

            entity.polyline.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;
            entity.polyline.arcType = Cesium.ArcType.GEODESIC;
          }

          entity.name = choice;
        }
        globe.viewer.scene.requestRender();
      }
    })
    return promisse;
  }

  /**
  * La fonction show associée à loadPolyline <br/>
  * permet de charger ou de supprimer la donnée linéaire en fonction de la valeur de show
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice permet de donner un nom aux entités
  * @param  {Boolean} clamp true pour clampToGround et false sinon
  * @param  {Object} options facultatif - Les options pour le chargement
  * @param  {Boolean} options.classification true si la donnée doit être classifiée
  * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
  * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
  * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
  * @param  {Number} options.epaisseur L'épaisseur de la ligne
  * @param  {String} options.couleurHighlight La couleur du highlight quand on clique à l'intérieur du polygone au format '#FFFFFF'
  * @param  {Number} options.alphaHighlight La transparence du highlight
  * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  showPolyline(show, name, link, clamp, choice, options = {}) {
    var handler = new Cesium.ScreenSpaceEventHandler(globe.viewer.canvas);

    if(this.dataSources[name] == undefined){
      if(options.couleurSurf !== undefined) {
        // Information about the currently highlighted feature
        var highlighted = {
          feature : undefined,
          originalMaterial : new Cesium.Color()
        };
        // when we click on the entity change its scale and color

        handler.setInputAction(function(movement) {
          var pickedObject = globe.viewer.scene.pick(movement.position);
          if (!Cesium.defined(pickedObject)) {
            return;
          }
          // If a feature was previously highlighted, undo the highlight
          if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.id.polyline.material = highlighted.originalMaterial;
            highlighted.feature = undefined;
            globe.viewer.scene.requestRender();
          }
          // colorer la zone cliquée dans une couleur précise
          if (Cesium.defined(pickedObject)) {
            if (pickedObject.id.name === choice ) {
              highlighted.feature = pickedObject;
              highlighted.originalMaterial = pickedObject.id.polyline.material;
              pickedObject.id.polyline.material = Cesium.Color.fromCssColorString(couleurHighlight).withAlpha(transparenceHighlight);
              globe.viewer.scene.requestRender();
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }

    if(show){
      // on supprime l'ancienne donnée si elle existe déjà
      if(this.dataSources[name] !== undefined){
        this.viewer.dataSources.remove(this.dataSources[name]);
      }
      globe.loadPolyline(link, name, clamp, choice, options);
      this.viewer.scene.requestRender();

    } else{
      if(this.dataSources[name] !== undefined){
        this.viewer.dataSources.remove(this.dataSources[name]);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.scene.requestRender();

      }
    }
  }

  /**
  * permet de charger des fichiers geojson ponctuels 2D ou 3D et de les cluster ou non <br/>
  *
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
  * @param  {Array} billboard l'objet dans lequel on stocke le CustomDataSource
  * @param  {Boolean} point3D true si les points ont une composante 3D, false sinon
  * @param  {Boolean} cluster true si les points doivent être clusterisés, false sinon
  * @param  {Object} options facultatif - Les options pour le chargement
  * @param  {Array} options.line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
  * @param  {String} options.couleur La couleur de la ligne et de la puce pour le cluster au format '#FFFFFF'
  * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPoint(link, name, image, billboard, point3D, cluster, options = {}){
    let promisse = Cesium.GeoJsonDataSource.load(link, {
      markerSize: 0 //pour que l'épingle n'apparaisse pas
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = true; // test pour voir si les json arrête de baver
    this.viewer.scene.logarithmicDepthBuffer = false; // idem
    this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

    // on crée un CustomDataSource car les entités ne peuvent pas être clusterisées
    // on ne peut que cluster des dataSource, et l'altitude des points dans la dataSource en peut pas être modifié
    var billboardData = new Cesium.CustomDataSource();

    promisse.then((dataSource) => {
      // Ajoute le json dans la liste des dataSource
      this.viewer.dataSources.add(dataSource);
      this.dataSources[name] = dataSource;
      this.hideLoader();
      let entities = dataSource.entities.values;

      for(let i = 0; i < entities.length; i++) {
        let entity = entities[i];

        // on récupère les coordonnées des points importés
        var X = (dataSource._entityCollection._entities._array[i]._position._value.x);
        var Y = (dataSource._entityCollection._entities._array[i]._position._value.y);
        var Z = (dataSource._entityCollection._entities._array[i]._position._value.z);

        var position = new Cesium.Cartesian3(X,Y,Z); // en coords cartesiennes (système ECEF)

        if(point3D === false) {
          // nécessité de convertir en lon/lat car la coordonnée Z en ECEF ne correspond pas à la hauteur
          let cartographic = Cesium.Cartographic.fromCartesian(position); // conversion en radians
          let longitude = cartographic.longitude;
          let latitude = cartographic.latitude;

          // on augmente la hauteur des points pour qu'ils apparaissent au dessus du photomaillage
          let randomHeight = Math.floor(Math.random() * 20) + 230; // hauteur aléatoire pour rendre les doublons visibles
          let height = Number(randomHeight + cartographic.height);

          var coordHauteur = new Cesium.Cartesian3.fromRadians(longitude, latitude, height);

          //on trace une ligne partant du sol jusqu'à la base du billboard
          var coordLigne = [position, coordHauteur];
          var lineEntity = this.drawLine(coordLigne, 2, options.couleur, 1, false);
          options.line.push(lineEntity);

          // créé un billboard pour chaque entité ponctuelle (en précisant l'image à utiliser dans les paramètres)
          // l'entité billboard ne conserve pas les attributs
          // des billboard sont disponibles dans le dossier src/img/billboard sous le nom marker_'color' (10 couleurs)
          var billboardEntity = billboardData.entities.add({
            position : coordHauteur,
            billboard : {
              image : image,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              sizeInMeters: false,
              scaleByDistance : new Cesium.NearFarScalar(10000, 1, 150000, 0)
            }
          });

        } else if(point3D === true) {
          var billboardEntity = billboardData.entities.add({
            position : position,
            billboard : {
              image : image,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              sizeInMeters: false,
              scaleByDistance : new Cesium.NearFarScalar(10000, 1, 150000, 0)
            }
          });
        }

        if(options.choiceTableau !== undefined) {
          var tabl = new TableauAttribut();
          // on lie les attributs des points au nouvelles entités billboard et lignes
          // l'attribut choiceTableau permet de classifier entre les différentes données
          var tablBillboard = 'createTableau' + options.choiceTableau;
          tabl[tablBillboard](billboardEntity, entity);

          // si on a tracé une ligne depuis le billboard jusqu'au sol on ajoute les attributs sur la ligne aussi
          if(point3D === false) {
            var tablLine = 'createTableau' + options.choiceTableau;
            tabl[tablLine](lineEntity, entity);
          }
        }

      } // fin du for entities

      // on ajoute les billboard dans le dataSource
      this.viewer.dataSources.add(billboardData);
      billboard.push(billboardData);

      if(cluster === true) {
        // on zoome sur les entités pour que le cluster apparaisse (apparait seulement une fois que tout est chargé)
        //this.viewer.zoomTo(billboardData);

        if(point3D === false) {
          // on masque les lignes par défaut car on est à un haut niveau de zoom
          for(var i = 0; i < options.line.length; i++){
            options.line[i].show = false;
          }
        }

        // Paramètres pour le cluster
        billboardData.clustering.enabled = true;
        billboardData.clustering.pixelRange = 80;
        billboardData.clustering.minimumClusterSize = 5;

        // on créé les puces pour l'affichage du cluster
        var pinBuilder = new Cesium.PinBuilder();
        var pin50 = pinBuilder.fromText("50+", Cesium.Color.fromCssColorString(options.couleur), 80).toDataURL();
        var pin40 = pinBuilder.fromText("40+", Cesium.Color.fromCssColorString(options.couleur), 70).toDataURL();
        var pin30 = pinBuilder.fromText("30+", Cesium.Color.fromCssColorString(options.couleur), 60).toDataURL();
        var pin20 = pinBuilder.fromText("20+", Cesium.Color.fromCssColorString(options.couleur), 50).toDataURL();
        var pin10 = pinBuilder.fromText("10+", Cesium.Color.fromCssColorString(options.couleur), 40).toDataURL();

        var singleDigitPins = new Array(8);
        for (var i = 0; i < singleDigitPins.length; ++i) {
          singleDigitPins[i] = pinBuilder.fromText("" + (i), Cesium.Color.fromCssColorString(options.couleur), 30).toDataURL();
        }

        billboardData.clustering.clusterEvent.addEventListener(
          function (clusteredEntities, cluster) {

            var position = cluster.billboard._position;
            let cartographic = Cesium.Cartographic.fromCartesian(position); // conversion en radians
            let longitude = cartographic.longitude;
            let latitude = cartographic.latitude;

            // on augmente la hauteur des points pour qu'ils apparaissent au dessus du photomaillage
            let height = Number(150 + cartographic.height);
            var coordHauteur = new Cesium.Cartesian3.fromRadians(longitude, latitude, height);

            // on monte la position du cluster pour qu'il apparaisse au dessus du photomaillage
            cluster.billboard.position = coordHauteur;
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.id = cluster.label.id;
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

            if(clusteredEntities.length <= 60 && clusteredEntities.length > 5) {
              if(options.line !== undefined) {
                for(var i = 0; i < options.line.length; i++){
                  options.line[i].show = false;
                }
              }
            }

            if (clusteredEntities.length >= 50) {
              cluster.billboard.image = pin50;
            } else if (clusteredEntities.length >= 40) {
              cluster.billboard.image = pin40;
            } else if (clusteredEntities.length >= 30) {
              cluster.billboard.image = pin30;
            } else if (clusteredEntities.length >= 20) {
              cluster.billboard.image = pin20;
            } else if (clusteredEntities.length >= 10) {
              cluster.billboard.image = pin10;
            } else if (clusteredEntities.length > 5) {
              cluster.billboard.image = singleDigitPins[clusteredEntities.length];
            } else if (clusteredEntities.length = 5) {
              cluster.billboard.image = singleDigitPins[clusteredEntities.length];
              // on montre les lignes quand on s'approche du point
              for(var i = 0; i < options.line.length; i++){
                options.line[i].show = true;
              }
            }
            globe.viewer.scene.requestRender();

          });

          // force a re-cluster with the new styling
          var pixelRange = billboardData.clustering.pixelRange;
          billboardData.clustering.pixelRange = 0;
          billboardData.clustering.pixelRange = pixelRange;
        }

      });
      return promisse;

    }

    /**
    * La fonction show associée à loadPoint <br/>
    * permet d'afficher ou de masquer la donnée ponctuelle en fonction de la valeur de show
    *
    * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
    * @param  {String} link Le lien vers le fichier
    * @param  {String} linkAttribut Le lien vers le fichier json attributaires sans géométrie
    * @param  {String} name Le nom qu'on donne au json
    * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
    * @param  {Array} billboard l'objet dans lequel on stocke le CustomDataSource
    * @param  {Boolean} point3D true si les points ont une composante 3D, false sinon
    * @param  {Boolean} cluster true si les points doivent être clusterisés, false sinon
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Array} options.line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
    * @param  {String} options.couleur La couleur de la ligne et de la puce pour le cluster au format '#FFFFFF'
    * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
    */
    showPoint(show, name, link, linkAttribut, image, billboard, point3D, cluster, options = {}){
      if(show){
        if(this.dataSources[name] === undefined){
          if(linkAttribut != undefined) {
            globe.loadJsonAttribut(link, linkAttribut, name, image, billboard, point3D, cluster, options);
            this.viewer.scene.requestRender();
          } else {
            globe.loadPoint(link, name, image, billboard, point3D, cluster, options);
            this.viewer.scene.requestRender();
          }

        } else{
          this.dataSources[name].show = true;
          for(var i = 0; i < billboard.length; i++){
            billboard[i].show = true;
          }

          if(point3D === false) {
            for(var i = 0; i < options.line.length; i++){
              options.line[i].show = true;
            }
          }

          this.viewer.scene.requestRender(); // dit à Cesium de recalculer la page
        }
      } else{
        if(this.dataSources[name] !== undefined){
          this.dataSources[name].show = false;
          for(var i = 0; i < billboard.length; i++){
            billboard[i].show = false;
          }
          if(point3D === false) {
            for(var i = 0; i < options.line.length; i++){
              options.line[i].show = false;
            }
          }
          this.viewer.scene.requestRender();
        }
      }
    }


    /**
    *
    * Permet de re-charger la donnée ponctuelle (temps réel)
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {String} linkAttribut Le lien vers le fichier json attributaires sans géométrie
    * @param  {String} name Le nom qu'on donne au json
    * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
    * @param  {Array} billboard l'objet dans lequel on stocke le CustomDataSource
    * @param  {Boolean} point3D true si les points ont une composante 3D, false sinon
    * @param  {Boolean} cluster true si les points doivent être clusterisés, false sinon
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Array} options.line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
    * @param  {String} options.couleur La couleur de la ligne au format '#FFFFFF'
    * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
    */
    updatePoint(link, linkAttribut, name, image, billboard, point3D, cluster, options = {}) {
      if(this.dataSources[name] !== undefined){
        this.viewer.dataSources.remove(this.dataSources[name]);
        this.viewer.scene.requestRender();
        if(linkAttribut != undefined) {
          globe.loadJsonAttribut(link, linkAttribut, name, image, billboard, point3D, cluster, options);
        } else {
          globe.loadPoint(link, name, image, billboard, point3D, cluster, options);
        }

        this.viewer.scene.requestRender();
      }

    }

    /**
    * permet de charger des fichiers geojson temporels (donnée dynamique qui va s'actualiser lorsqu'on bouge le curseur temps de Cesium)
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {String} name Le nom qu'on donne au json
    * @param  {String} choice spécifique à la donnée, permet de charger l'attribut dans lequel on stocke la date de la donnée
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Boolean} options.classification true si la donnée doit être classifiée
    * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
    * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
    * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
    * @param  {Array} options.line Le tableau d'entités où stocker les contours des polygones
    * @param  {String} options.nameLigne La nom des lignes de contour
    * @return  {GeoJsonDataSource} le json une fois que tout est chargé
    */
    loadTimeJson(link, name, choice, options = {}){
      let promisse = Cesium.GeoJsonDataSource.load(link, {
        clampToGround: true
      });
      this.viewer.scene.globe.depthTestAgainstTerrain = true; // test pour voir si les json arrête de baver
      this.viewer.scene.logarithmicDepthBuffer = false; // idem
      this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

      promisse.then((dataSource) => {
        // Ajoute le json dans la liste des dataSource
        this.viewer.dataSources.add(dataSource);
        this.dataSources[name] = dataSource;
        let entities = dataSource.entities.values;
        this.hideLoader();

        // l'évenement qui actualise la valeur de l'horloge quand on clique sur la timeline
        this.viewer.clock.onTick.addEventListener(function () {
          // on garde seulement les 10 premiers chiffres pour avoir le jour (sans l'heure et secondes)
          let updateTime = Cesium.JulianDate.toIso8601(globe.viewer.clock.currentTime).substring(0, 10);

          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];

            // attention aux formats de date, ici updateTime et dateValidite sont au format AAAA-MM-JJ
            // spécifique à la donnée, condition à rajouter pour récupérer le champ dans lequel on stocke la date
            // on récupère la date dans les attributs et on enlève un jour car date échéance = plus valable le jour même
            if(choice === 'Qualité air communes Eurométropole') {
              var dateIso = Cesium.JulianDate.fromIso8601(entity.properties._date_echeance._value);
              var date = Cesium.JulianDate.addDays(dateIso, -1, new Cesium.JulianDate());
              var dateValidite = Cesium.JulianDate.toIso8601(date).substring(0, 10);
            } else {
              var dateIso = Cesium.JulianDate.fromIso8601(entity.properties._date._value);
              var dateValidite = Cesium.JulianDate.toIso8601(date).substring(0, 10);
            }

            // si la date des attributs correspond à la date de la timeline on affiche l'entité
            if(dateValidite == updateTime) {
              entity.show = true;
            } else {
              entity.show = false;
            }
            // on demande d'actualiser à chaque changement d'horloge pour voir les couleurs défiler en bougeant la timeline
            globe.viewer.scene.requestRender();
          }

        });

        // permet de classifier les json
        if(options.classification && options.classificationField !== undefined){
          let entities = dataSource.entities.values;

          if(options.colors != undefined){
            Object.keys(options.colors).forEach(function(c){
              options.colors[c] = Cesium.Color.fromCssColorString(options.colors[c]);
              options.colors[c].alpha = options.alpha || 0.8;
            })
          }
          let colors = options.colors || {};

          for (let i = 0; i < entities.length; i++) {

            let entity = entities[i];
            if (Cesium.defined(entity.polygon)) {
              let color = colors[entity.properties[options.classificationField]];
              if(!color){
                color = Cesium.Color.fromRandom({ alpha : options.alpha || 0.8 });
                colors[entity.properties[options.classificationField]] = color;
              }
              entity.polygon.material = color;
              entity.polygon.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;
              entity.polygon.arcType = Cesium.ArcType.GEODESIC;
            }

            entity.name = choice;

            if(options.choiceTableau !== undefined) {
              var tabl = new TableauAttribut();

              var tablEntity = 'createTableau' + options.choiceTableau;
              tabl[tablEntity](entity);

            }

            if(options.nameLigne !== undefined) {
              // on trace les contours des entités
              options.line.push(this.drawLine(entity.polygon.hierarchy._value.positions, 3, '#FFFFFF', 1, true, options.nameLigne));
            }

          }
        }

      });
      return promisse;
    }


    /**
    *
    * La fonction show associée à loadTimeJson <br/>
    * permet d'afficher ou de masquer la donnée temporelle en fonction de la valeur de show
    *
    * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
    * @param  {String} link Le lien vers le fichier
    * @param  {String} name Le nom qu'on donne au json
    * @param  {String} choice spécifique à la donnée, permet de charger l'attribut dans lequel on stocke la date de la donnée
    * @param  {JulianDate} start La date de début de l'intervalle de temps qu'on souhaite afficher dans la timeline
    * @param  {JulianDate} end La date de fin de l'intervalle de temps qu'on souhaite afficher dans la timeline
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Boolean} options.classification true si la donnée doit être classifiée
    * @param  {String} options.classificationField le champ de la donnée selon lesquelles les données seront classifiées
    * @param  {Object} options.colors un objet qui contient les valeurs que peut prendre le classificationField et les couleurs à associer
    * @param  {Number} options.alpha La transparence de la couleur des entités à afficher
    * @param  {Array} options.line Le tableau d'entités où stocker les contours des polygones
    * @param  {String} options.nameLigne La nom des lignes de contour
    */
    showTimeJson(show, name, link, choice, start, end, options = {}){
      var today = Cesium.JulianDate.now();
      var demain = Cesium.JulianDate.addDays(today, 1, new Cesium.JulianDate());

      if(show){
        if(this.dataSources[name] === undefined){
          globe.loadTimeJson(link, name, choice, options);
          // on zoome la timeline sur l'intervalle souhaité
          globe.viewer.timeline.zoomTo(start, end);

        } else{
          globe.viewer.timeline.zoomTo(start, end);
          this.dataSources[name].show = true;
          if(options.nameLigne !== undefined) {
            for(var i = 0; i < options.line.length; i++){
              options.line[i].show = true;
            }
          }
          this.viewer.scene.requestRender(); // dit à Cesium de recalculer la page
        }
      } else{
        if(this.dataSources[name] !== undefined){
          // on rezoome la timeline sur aujourd'hui et on reset les paramètres de l'horloge
          var today = Cesium.JulianDate.now();
          var demain = Cesium.JulianDate.addDays(today, 1, new Cesium.JulianDate());
          globe.viewer.clock.shouldAnimate = false;
          globe.viewer.clock.currentTime = today;
          globe.viewer.clock.startTime = Cesium.JulianDate.addDays(today, -10, new Cesium.JulianDate());
          globe.viewer.clock.stopTime = Cesium.JulianDate.addDays(today, 10, new Cesium.JulianDate());
          globe.viewer.clock.multiplier = 1.0;
          globe.viewer.timeline.zoomTo(today, demain);

          this.dataSources[name].show = false;
          if(options.nameLigne !== undefined) {
            for(var i = 0; i < options.line.length; i++){
              options.line[i].show = false;
            }
          }
          this.viewer.scene.requestRender();
        }
      }
    }

    /**
    * permet de charger un fichier de données géographiques (geojson) ainsi qu'un 2ème fichier attributaire au format json <br/>
    * On lie ensuite les attributs à la donnée géographique <br/>
    * utilise la fonction showPoint pour afficher la donnée
    *
    * @param  {String} link Le lien vers le fichier
    * @param  {String} name Le nom qu'on donne au json
    * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
    * @param  {Array} billboard Le tableau d'entités où stocker les billboards
    * @param  {Boolean} point3D true si les points ont une composante 3D, false sinon
    * @param  {Boolean} cluster true si les points doivent être clusterisés, false sinon
    * @param  {Object} options facultatif - Les options pour le chargement
    * @param  {Array} options.line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
    * @param  {String} options.couleur La couleur de la ligne au format '#FFFFFF'
    * @param  {String} options.choiceTableau la chaine de caractère à rajouter à createTableau pour appeler la bonne fonction de mise en forme du tableau d'attributs
    * @return  {GeoJsonDataSource} le json une fois que tout est chargé
    */
    loadJsonAttribut(link, linkAttribut, name, image, billboard, point3D, cluster, options = {}){
      let promisse = Cesium.GeoJsonDataSource.load(link, {
        markerSize: 0 //pour que l'épingle n'apparaisse pas
      });
      this.viewer.scene.globe.depthTestAgainstTerrain = true; // test pour voir si les json arrête de baver
      this.viewer.scene.logarithmicDepthBuffer = false; // idem
      this.showLoader(); // fonction qui affiche un symbole de chargement sur la page

      promisse.then((dataSource) => {
        // Ajoute le json dans la liste des dataSource
        this.viewer.dataSources.add(dataSource);
        this.dataSources[name] = dataSource;
        this.hideLoader();

        let entities = dataSource.entities.values;

        // on est obligés de s'arrêter au nombre précis d'entités car ensuite les labels sont rajoutés à la liste des entités
        // ce qui entraine des bugs d'affichage et des erreurs au moment de la création du tableau d'attributs
        var stop = dataSource._entityCollection._entities.length;


        // on récupère le fichier json de la fréquentation en temps réel
        var lienJson = linkAttribut;
        var xmlhttp = new XMLHttpRequest();
        this.xmlhttp = this;
        xmlhttp.open('GET', lienJson);
        xmlhttp.responseType = 'json';
        xmlhttp.send();

        // une fois que le fichier est bien chargé
        xmlhttp.onreadystatechange = function () {
          if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            // on récupère le json chargé
            var jsonAttribut = xmlhttp.response;

            // le lien avec la classe tableau pour l'ajout du tableau d'attributs au bon format
            var tabl = new TableauAttribut();

            for(let i = 0; i < stop; i++) {
              let entity = entities[i];

              // on récupère les coordonnées des points importés
              var X = (dataSource._entityCollection._entities._array[i]._position._value.x);
              var Y = (dataSource._entityCollection._entities._array[i]._position._value.y);
              var Z = (dataSource._entityCollection._entities._array[i]._position._value.z);

              var position = new Cesium.Cartesian3(X,Y,Z); // en coords cartesiennes (système ECEF)

              if(point3D === false) {
                let cartographic = Cesium.Cartographic.fromCartesian(position); // conversion en radians
                let longitude = cartographic.longitude;
                let latitude = cartographic.latitude;
                // on augmente la hauteur des points pour qu'ils apparaissent au dessus du photomaillage
                let height = Number(225 + cartographic.height); // on rajoute 225m à la hauteur ellipsoïdale
                var coordHauteur = new Cesium.Cartesian3.fromRadians(longitude, latitude, height);

                // on ajoute une entité billboard à chaque point, 225m plus haut
                // l'entité billboard ne conserve pas les attributs
                billboard.push(globe.createBillboard(coordHauteur, image, false));
                // des billboard sont disponibles dans le dossier src/img/billboard sous le nom marker_'color' (10 couleurs)

                //on trace une ligne partant du sol jusqu'à la base du billboard
                var coordLigne = [position, coordHauteur];
                var lineEntity = globe.drawLine(coordLigne, 2, options.couleur, 1, false)
                options.line.push(lineEntity);

                // coordonnées 15m en dessous pour la lisibilité du texte
                let heightLabel = Number(210 + cartographic.height);
                var coordLabel = new Cesium.Cartesian3.fromRadians(longitude, latitude, heightLabel);

                if(options.choiceTableau !== undefined){
                  // on lie les attributs des points au nouvelles entités billboard et lignes
                  // l'attribut choiceTableau permet de classifier entre les différentes données
                  var tablBillboard = 'createTableau' + options.choiceTableau;
                  tabl[tablBillboard](entity, jsonAttribut, billboard[i], coordLabel, dataSource);

                  var tablLine = 'createTableau' + options.choiceTableau;
                  tabl[tablLine](entity, jsonAttribut, billboard[i], coordLabel, dataSource);

                }


              } else if(point3D === true) {
                billboard.push(globe.createBillboard(position, image, false));

                if(options.choiceTableau !== undefined) {
                  var tablBillboard = 'createTableau' + options.choiceTableau;
                  tabl[tablBillboard](entity, jsonAttribut, billboard[i], coordLabel, dataSource);
                }

              }


              globe.viewer.scene.requestRender();

            } // fin du for(i < entities.length)

          } // fin de la requête xmlhttp
        } // fin de la requête xmlhttp

      });
      return promisse;

    }

    /**
    * Récupère les 9 tuiles du plu détaillé à afficher en fonction des coordonnées du centre de l'écran
    *
    * @param  {Number} taille la taille des tuiles en pixel (souvent 256)
    * @param  {Number} zoom le niveau de zoom à utiliser (ici 17)
    * @param  {Array} pluTiles le tableau qui contient les polygones texturés
    * @param  {Array} linePLUdetaille le tableau qui contient les contours des 9 dalles
    */
    pluDetaille(taille, zoom, pluTiles, linePLUdetaille) {
      var tuile = new Tile(taille);

      // coordonnées du centre de l'écran
      var windowPosition = new Cesium.Cartesian2(globe.viewer.container.clientWidth / 2, globe.viewer.container.clientHeight / 2);
      var centre = globe.viewer.scene.pickPosition(windowPosition);

      let cartographic = Cesium.Cartographic.fromCartesian(centre);
      var latlong = {
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        lng: Cesium.Math.toDegrees(cartographic.longitude)
      }

      // on récupère la tuile qui correspond aux coordonnées du centre de l'écran
      var coordTile = tuile.getCoord(latlong, zoom);

      // puis on récupère les 8 tuiles autour
      var coord1 = {
        x: coordTile.x - 1,
        y: coordTile.y - 1,
        z: zoom
      }
      var coord2 = {
        x: coordTile.x ,
        y: coordTile.y - 1,
        z: zoom
      }
      var coord3 = {
        x: coordTile.x + 1,
        y: coordTile.y - 1,
        z: zoom
      }
      var coord4 = {
        x: coordTile.x - 1,
        y: coordTile.y,
        z: zoom
      }
      var coord5 = {
        x: coordTile.x + 1,
        y: coordTile.y,
        z: zoom
      }
      var coord6 = {
        x: coordTile.x - 1,
        y: coordTile.y + 1,
        z: zoom
      }
      var coord7 = {
        x: coordTile.x,
        y: coordTile.y + 1,
        z: zoom
      }
      var coord8 = {
        x: coordTile.x + 1,
        y: coordTile.y + 1,
        z: zoom
      }

      var coords = [coordTile, coord1, coord2, coord3, coord4, coord5, coord6, coord7, coord8];
      var coordLine = [];

      // on récupère les tuiles aux coordonnées tuiles qu'on a définies
      for (var i = 0; i < 9; i++) {
        var temp = coords[i];
        var latlon = tuile.getTile(temp, zoom);
        coordLine.push(latlon);

        // on ajoute le polygone texturé
        var pludetaille = this.viewer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([latlon[3], latlon[2], latlon[1], latlon[2], latlon[1], latlon[0], latlon[3], latlon[0]]),
            material: "https://3d.strasbourg.eu/CESIUM_OPENDATA/data/plu/"+ zoom + "/" + temp.x + "/" + temp.y + ".png",
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
          },
        });

        pluTiles.push(pludetaille);

      }

      // on trace le contour des 9 tuiles
      var coordContour = [coordLine[1][1], coordLine[1][2], coordLine[3][3], coordLine[3][2], coordLine[8][3], coordLine[8][0], coordLine[6][1], coordLine[6][0], coordLine[1][1], coordLine[1][2]];
      linePLUdetaille. push(this.drawLine(Cesium.Cartesian3.fromDegreesArray(coordContour), 2, "#FFFFFF", 1, true, 'Visibilité PLU détaillé'));

      this.viewer.scene.requestRender();

    }

    supprEntity(entity) {
      console.log('test');
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var pickedObject = globe.viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
          if (e.shiftKey === 46) {
            console.log('test1');
            globe.viewer.entities.remove(entity);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    }

  } // fin de la classe Globe
