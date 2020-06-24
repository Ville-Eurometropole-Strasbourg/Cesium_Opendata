"use strict";
// web server: http://127.1.0.0:8000/
// Créé un object globe qui pertmet de manipuler cesium plus simplement
class Globe {

  /**
  * Le constructeur de la classe globe, qui créé le viewer Cesium, ajoute la flèche nord
  * importe le grille raf09, créé le PinBuilder
  * déclare toutes les checkbox pour l'affichage dynamique
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
        scene3DOnly : true, // enlève le bouton permettant de basculer la vue en 2D
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

      //this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {}); // pour ajouter la flèche nord (plus compatible avec Cesium 1.70)


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
    * Définit le zoom par défaut à l'ouverture de l'appli et lorsqu'on clique sur le bouton maison
    * Si on accède à l'appli avec un autre zoom que la cathédrale, le bouton maison renverra sur cette vue
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
    * lit et retourne les paramètres présents dans l'URL
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
    * Définit le point de vue de caméra en fonction de la position (Cartesian3) et des 3 paramètres d'orientation de la caméra
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
    *   Créer le lien de partage qui conserve le niveau de zoom de la scène
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
        document.getElementById('nomlink').value = window.location.href +'&X='+X+'&Y='+Y+'&Z='+Z+'&heading='+heading+'&pitch='+pitch+'&roll='+roll;
      } else {
        document.getElementById('nomlink').value = window.location.href +'?X='+X+'&Y='+Y+'&Z='+Z+'&heading='+heading+'&pitch='+pitch+'&roll='+roll;
      }

    }

    /*
    *
    * Chargement de données
    *
    */

    /**
    * Permet de charger et d'enregister le tileset au format 3DTiles
    *
    * @param  {String} link Le lien vers le fichier
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
    *
    * @param  {tileset} tileset Le 3DTileset à ajouter
    * @return  {tileset} tilesetPrimitive l'entité contenant le tileset
    */
    addPhotomaillage(tileset) {
      var tilesetPrimitive = this.viewer.scene.primitives.add(tileset);
      return tilesetPrimitive.readyPromise;
    }


    /**
    * permet de charger des 3DTiles en gardant une structure asynchrone (voir fonction show3dtiles)
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
    * permet de charger les dessins exportés depuis Cesium;
    * va chercher les propriétés dans le json pour garder les propriétés à l'affichage
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
    *
    * Afficher ou masquer la source de données "name" en fonction de la valeur de "show"
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

          //console.log(name);
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
    * récupérer lat/lon/hauteur à chaque clic gauche, les convertit en CC48 / IGN69 et les affiche
    */
    showCoords(){
      let scene = this.viewer.scene;
      this.handler.globe = this; // pour les problèmes de scope

      this.handler.setInputAction(function(event) {
        let cartesian = scene.pickPosition(event.position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian); // cartesian = coords géometriques de l'écran
          let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7); // en degrés décimaux
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
    * ajouter le plan de coupe horizontal
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
    *  Récupérer les coordonnées au clic et les afficher dans le formulaire du plan de coupe horizontal
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
    *  pour créer un point: entité uniquement technique qui sert à afficher les autres figures
    * (ici chaque point est affiché transparent)
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
    *  Construit un marqueur maki (pin) à l'aide du symbole (url) et couleur
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
    *  Ajoute une image à une position spécifiée (structure synchrone)
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
    drawLine(positionData, largeur, couleur, transparence, clamp) {
      var shape = this.viewer.entities.add({
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
    *  LA fonction qui permet de tout dessiner
    * le paramètre choice designe si on mesure (dessins temporaires) ou si on dessine
    * (dessins qui restent après fermeture de la fonction de dessin)
    * le paramètre choice2 désigne le type de dessin (line, surface, volume etc)
    * On met tous les tableaux d'entités en paramètres de la fonction car ils seront définis dans la classe ui
    * pour garder une trace des entités et permettre leur annulation/exportation
    * Le reste des paramètres correspondent aux paramètres de personnalisation définis par l'utilisateur dans les formulaires
    *
    * @param  {String} choice prend la valeur dessin ou mesure
    * @param  {String} choice2 le type d'entités à dessiner
    * @param  {Number} largeur la transparence de l'entité
    * @param  {String} couleur le couleur de l'entité
    * @param  {Number} transparence la transparence de l'entité
    * @param  {Number} hauteurVol la hauteur de l'entité
    * @param  {String} url le lien vers les images pour les entités billboard
    * @param  {Array} billboard le tableau où stocker les entités billboard
    * @param  {Array} line le tableau où stocker les entités lignes
    * @param  {Array} surface le tableau où stocker les entités surface
    * @param  {Array} volume le tableau où stocker les entités boîte
    * @param  {Array} dline le tableau où stocker les entités lignes pour les mesures
    * @param  {Array} dsurface tableau où stocker les entités surface pour les mesures
    */
    updateShape(choice, choice2, largeur, couleur, transparence, hauteurVol, url, billboard, line, surface, volume, dline, dsurface) {
      var activeShapePoints = [];
      var activeShape;
      var floatingPoint;
      var z;

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
            largeur = parseFloat(largeur);
            transparence = parseFloat(transparence);
            if(choice === 'point') {
              activeShape = globe.createPoint(dynamicPositions);
              if($('#taille').val() === 'metre') {
                floatingPoint = globe.createPinBillboard(billboard, earthPosition, url, couleur, hauteurVol, true);
                billboard.pop();
              } else if($('#taille').val() === 'pixel') {
                floatingPoint = globe.createPinBillboard(billboard, earthPosition, url, couleur, hauteurVol, false);
              }
            } else if(choice === 'polygon') {
              activeShape = globe.drawPolygon(dynamicPositions, couleur, transparence);
            } else if(choice === 'volume') {
              z = globe.getHauteur(activeShapePoints, hauteurVol);
              activeShape = globe.drawVolume(dynamicPositions, couleur, transparence, z);
            } else if(choice === 'line') {
              if(choice2 === 'mesure') {
                activeShape = globe.drawLine(dynamicPositions, largeur, couleur, transparence, false); // 1ère ligne non collée au sol pour la distance inclinée
                largeur = parseFloat(largeur);
                activeShape = globe.drawLine(dynamicPositions, largeur, '#000000', '0.5', true); // 2ème collée au sol pour distance horizontale
              } else if(choice2 === 'dessin') {
                couleur = couleur.toString();
                if($('#clampligne').val() === 'colle') { // clamp to ground ou pas
                  if($('#styleligne').val() === 'simple') { // style normal
                    activeShape = globe.drawLine(dynamicPositions, largeur, couleur, transparence, true);
                  } else if($('#styleligne').val() === 'pointille') { // style pointillé
                    activeShape = globe.drawDashLine(dynamicPositions, largeur, couleur, transparence, true);
                  } else if($('#styleligne').val() === 'fleche') { // avec une flèche à la fin
                    activeShape = globe.drawArrowLine(dynamicPositions, largeur, couleur, transparence, true);
                  }
                } else if($('#clampligne').val() === 'noncolle'){ // mêmes instructions avec la ligne non collée au sol
                  if($('#styleligne').val() === 'simple') {
                    activeShape = globe.drawLine(dynamicPositions, largeur, couleur, transparence, false);
                  } else if($('#styleligne').val() === 'pointille') {
                    activeShape = globe.drawDashLine(dynamicPositions, largeur, couleur, transparence, false);
                  } else if($('#styleligne').val() === 'fleche') {
                    activeShape = globe.drawArrowLine(dynamicPositions, largeur, couleur, transparence, false);
                  }
                }
              }
            }
          } else {
            activeShapePoints.push(earthPosition);
            if(choice === 'point'){
              globe.createPoint(earthPosition);
              if($('#taille').val() === 'metre') {
                globe.createPinBillboard(billboard, earthPosition, url, couleur, hauteurVol, true);
              } else if($('#taille').val() === 'pixel') {
                globe.createPinBillboard(billboard, earthPosition, url, couleur, hauteurVol, false);
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
        }
        globe.viewer.scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.handler.setInputAction(function(event) {
        largeur = parseFloat(largeur);
        transparence = parseFloat(transparence);
        // on supprime le dernier point flottant
        activeShapePoints.pop();

        // on ajoute les entités dans le taleau d'entités correspondant
        if(choice2 === 'dessin'){
          if(choice === 'point') {
            globe.createPoint(activeShapePoints);
            if($('#taille').val() === 'metre') {
              globe.createPinBillboard(billboard, activeShapePoints, url, couleur, hauteurVol, true);
            } else if($('#taille').val() === 'pixel') {
              globe.createPinBillboard(billboard, activeShapePoints, url, couleur, hauteurVol, false);
            }
          } else if(choice === 'line') {
            if($('#clampligne').val() === 'colle') {
              if($('#styleligne').val() === 'simple') {
                line.push(globe.drawLine(activeShapePoints, largeur, couleur, transparence, true));
              } else if($('#styleligne').val() === 'pointille') {
                line.push(globe.drawDashLine(activeShapePoints, largeur, couleur, transparence, true));
              } else if($('#styleligne').val() === 'fleche') {
                line.push(globe.drawArrowLine(activeShapePoints, largeur, couleur, transparence, true));
              }
            } else if($('#clampligne').val() === 'noncolle') {
              if($('#styleligne').val() === 'simple') {
                line.push(globe.drawLine(activeShapePoints, largeur, couleur, transparence, false));
              } else if($('#styleligne').val() === 'pointille') {
                line.push(globe.drawDashLine(activeShapePoints, largeur, couleur, transparence, false));
              } else if($('#styleligne').val() === 'fleche') {
                line.push(globe.drawArrowLine(activeShapePoints, largeur, couleur, transparence, false));
              }
            }

          } else if( choice === 'polygon') {
            surface.push(globe.drawPolygon(activeShapePoints, couleur, transparence));
          } else if( choice === 'volume') {
            volume.push(globe.drawVolume(activeShapePoints, couleur, transparence, z));
          }
        } else if(choice2 === 'mesure'){
          if(choice === 'line') {
            dline.push(globe.drawLine(activeShapePoints, largeur, couleur, transparence, false));
            dline.push(globe.drawLine(activeShapePoints, largeur, '#000000', '0.5', true));
          } else if( choice === 'polygon') {
            dsurface.push(globe.drawPolygon(activeShapePoints, couleur, transparence));
          }
        }
        globe.viewer.entities.remove(floatingPoint);
        globe.viewer.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        if(choice2 === 'dessin'){
          // garder les activeShapePoints définis permet l'affichage des mesures
          activeShapePoints = [];
        }
        globe.viewer.scene.requestRender();
        billboard.pop(); // quand on clique droit avec le billboard Cesium ajoute un billboard à la position (0,0,0)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      // les 2 boutons "nouvelle mesure" pour la distance et surface: l'utilisateur est obligé d'appuyer dessus pour effectuer une nouvelle mesure
      $('.nouv').click(function(e) {
        activeShapePoints = [];
      });
    }

    /**
    *
    *  Enlève la dernière figure par catégorie (tableau lignes, surfaces etc)
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
    *  Supprime toutes les figures par catégorie
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
    *  mesure de distance
    *
    * @param  {Object} activeShapePoints le tableau de coordonnées cartésiennes x y z des points à partir duquel calculer la distance
    */
    measureDistance(activeShapePoints)  {
      var coordsX = [];
      var coordsY = [];
      var coordsZ = [];
      var distance = 0;
      var distanceIncl = 0;
      var difference = 0;
      this.distance.innerHTML = 0;
      this.distanceCumulee.innerHTML = 0;
      this.hauteur.innerHTML = 0;
      this.distanceInclinee.innerHTML = 0;
      this.distanceInclineeC.innerHTML = 0;

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

        this.distanceCumulee.innerHTML = (Number(this.distanceCumulee.innerHTML) + distance).toFixed(2);
        this.distanceInclineeC.innerHTML = (Number(this.distanceInclineeC.innerHTML) + distanceIncl).toFixed(2);
      }
      this.distance.innerHTML = distance.toFixed(2);
      this.distanceInclinee.innerHTML = distanceIncl.toFixed(2);
      this.hauteur.innerHTML = difference;
    }

    /**
    *
    *  mesure de d'aire
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
    * Découpe un trou dans le photomaillage - ajoute les points blancs visuellement et coupe selon la forme définie
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
    * ajoute les plans de coupe
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
  * permet de cliquer les attributs sur le 3DTiles
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
  * supprime toutes les actions liées à la souris
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
    //console.log(Boolean(globe.viewModel.show));
    //console.log(Number(globe.viewModel.contrast));
    //console.log(Number(globe.viewModel.brightness));
    //console.log(Number(globe.viewModel.delta));
    //console.log(Number(globe.viewModel.sigma));
    //console.log(Number(globe.viewModel.stepSize));
    globe.viewer.scene.requestRender();

  }

  //-------------------------------------------------------------------------

  /**
  *
  * permet de charger des fichiers geojson surfaciques
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice permet de classifier la donnée pour charger le tableau d'attributs
  * @param  {Array} line Le tableau d'entités pour stocker les lignes de contours des polygones
  * @param  {String} couleurLigne La couleur des lignes de contour au format '#FFFFFF'
  * @param  {Number} tailleLigne La largeur des lignes de contour
  * @param  {Object} options facultatif - Les options pour le chargement
  */
  loadPolygon(link, name, choice, line, couleurLigne, tailleLigne, options = {}) {

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

            if(choice === 'Limites de sections') {
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
              this.createTableauSections(entity);
            }
            if(choice === 'Limites de communes') {
              let longitudeNom = entity._properties.geo_point_2d._value[1];
              let latitudeNom = entity._properties.geo_point_2d._value[0];

              if (entity._properties.nom._value == 'Schiltigheim') {
                latitudeNom = latitudeNom - 0.0055;
              };
              if (entity._properties.nom._value == 'Bischheim') {
                latitudeNom = latitudeNom - 0.0055;
              };

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
              this.createTableauCommunes(entity);
            }
            if(choice === 'Parcellaire cadastral') {
              this.createTableauCadastre(entity);
            }
            if(choice === 'PLUi Plan de Zonage') {
              this.createTableauPLU(entity);
            }

            //Dessine le contour des limites des entités
            line.push(this.drawLine(entity.polygon.hierarchy._value.positions, tailleLigne, couleurLigne, 0.7, true));

            entity.polygon.material = color;
            entity.polygon.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;
            entity.polygon.arcType = Cesium.ArcType.GEODESIC;
            entity.name = choice;
          }

        }
        globe.viewer.scene.requestRender();
      }

    })
    return promisse;

  }


  /**
  *
  * Afficher ou masquer les sections cadatrales de données "name" en fonction de la valeur de "show"
  * Si elle n'a pas enore été affiché, la fonction va télécharger les données avec le lien "link" passé en parametre
  * Enlève/Affiche les entités billboard pour les points
  *
  * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice permet de classifier la donnée pour charger le tableau d'attributs
  * @param  {Array} line Le tableau d'entités pour stocker les lignes de contours des polygones
  * @param  {String} couleurLigne La couleur des lignes de contour au format '#FFFFFF'
  * @param  {Number} tailleLigne La largeur des lignes de contour
  * @param  {String} couleurSurf La couleur du highlight quand on clique à l'intérieur du polygone au format '#FFFFFF'
  * @param  {Number} transparence La transparence du highlight
  * @param  {Object} options facultatif - Les options pour le chargement
  */
  showPolygon(show, name, link, choice, line, couleurLigne, tailleLigne, couleurSurf, transparence, options = {}){
    if(show){
      if(this.dataSources[name] === undefined){
        globe.loadPolygon(link, name, choice, line, couleurLigne, tailleLigne, options);
        // Information about the currently highlighted feature
        var highlighted = {
          feature : undefined,
          originalMaterial : new Cesium.Color()
        };
        // If the mouse is over the billboard, change its scale and color
        var handler = new Cesium.ScreenSpaceEventHandler(globe.viewer.canvas);
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
          if (Cesium.defined(pickedObject)) {
            if (pickedObject.id.name === choice ) {
              highlighted.feature = pickedObject;
              highlighted.originalMaterial = pickedObject.id.polygon.material;
              pickedObject.id.polygon.material = Cesium.Color.fromCssColorString(couleurSurf).withAlpha(transparence);
              globe.viewer.scene.requestRender();
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


      } else{
        this.dataSources[name].show = true;
        for(var i = 0; i < line.length; i++){
            line[i].show = true;
        }

      }
      this.viewer.scene.requestRender(); // dit à Cesium de recalculer la page


    } //Fin du IF Show = true
    else{
      if(this.dataSources[name] !== undefined){
        this.dataSources[name].show = false;
        for(var i = 0; i < line.length; i++){
            line[i].show = false;
        }

        this.viewer.scene.requestRender();
      }

    }
  }

  updatePolygon(link, name, choice, line, couleurLigne, tailleLigne, couleurSurf, transparence, options) {
    if(this.dataSources[name] !== undefined){
      this.viewer.dataSources.remove(this.dataSources[name]);
      this.viewer.scene.requestRender();

      globe.loadPolygon(link, name, choice, line, couleurLigne, tailleLigne, options);
      this.viewer.scene.requestRender();
    }

  }

  //---------------------------------------------------------------------------------------------------

  /**
  * permet de charger des fichiers geojson linéaires
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice spécifique à la donnée, permet de charger le tableau d'attributs au bon format et de donner un nom aux entités
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPolyline(link, name, choice, options = {}) {
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

            /*entity.polylineVolume = new Cesium.PolylineVolumeGraphics({
              positions: entity.polyline.positions,
              shape: globe.computeCircle(1),
              material: color
            });*/
            entity.polyline.material = color;
            entity.polyline.width = 4.0;
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
  * permet d'afficher ou de masquer la donnée linéaire en fonction de la valeur de show
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} choice spécifique à la donnée, permet de charger le tableau d'attributs au bon format
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  showPolyline(show, name, link, choice, options = {}) {
    if(show){
      if(this.dataSources[name] === undefined){
        globe.loadPolyline(link, name, choice, options);
      } else{
        this.dataSources[name].show = true;
        this.viewer.scene.requestRender(); // dit à Cesium de recalculer la page
      }
    } else{
      if(this.dataSources[name] !== undefined){
        this.dataSources[name].show = false;
        this.viewer.scene.requestRender();
      }
    }
  }

  updatePolyline(link, name, choice, options) {
    if(this.dataSources[name] !== undefined){
      this.viewer.dataSources.remove(this.dataSources[name]);
      this.viewer.scene.requestRender();

      globe.loadPolyline(link, name, choice, options);
      this.viewer.scene.requestRender();
    }

  }

  //---------------------------------------------------------------------------------------------------

  /**
  * permet de charger des fichiers geojson ponctuels
  *
  * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
  * @param  {Array} billboard Le tableau d'entités où stocker les billboards
  * @param  {String} choice spécifique à la donnée, permet de charger le tableau d'attributs au bon format
  * @param  {Array} line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
  * @param  {String} couleur La couleur de la ligne au format '#FFFFFF'
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPoint(link, name, image, billboard, choice, line, couleur, options = {}){
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

      // créé un billboard pour chaque entité ponctuelle (en précisant l'image à utiliser dans les paramètres)
      // l'entité billboard ne conserve pas les attributs
      for(let i = 0; i < entities.length; i++) {
        let entity = entities[i];

        // on récupère les coordonnées des points importés
        var X = (dataSource._entityCollection._entities._array[i]._position._value.x);
        var Y = (dataSource._entityCollection._entities._array[i]._position._value.y);
        var Z = (dataSource._entityCollection._entities._array[i]._position._value.z);

        var position = new Cesium.Cartesian3(X,Y,Z); // en coords cartesiennes (système ECEF)
        let cartographic = Cesium.Cartographic.fromCartesian(position); // conversion en radians
        let longitude = cartographic.longitude;
        let latitude = cartographic.latitude;
        // on augmente la hauteur des points pour qu'ils apparaissent au dessus du photomaillage

        let randomHeight = Math.floor(Math.random() * 20) + 220;
        let height = Number(randomHeight + cartographic.height); // on rajoute 225m à la hauteur ellipsoïdale

        var coordHauteur = new Cesium.Cartesian3.fromRadians(longitude, latitude, height);

        // on ajoute une entité billboard à chaque point, 225m plus haut
        billboard.push(this.createBillboard(coordHauteur, image, false));
        // des billboard sont disponibles dans le dossier src/img/billboard sous le nom marker_'color' (10 couleurs)

        //on trace une ligne partant du sol jusqu'à la base du billboard
        var coordLigne = [position, coordHauteur];
        line.push(this.drawLine(coordLigne, 2, couleur, 1, false));

        // on lie les attributs des points au nouvelles entités billboard
        // l'attribut choice permet de classifier entre les différentes données
        if(choice == 'patrimoine'){
          this.createTableauPatrimoine(billboard[i], entity);
        }

      }
    });
    return promisse;

  }

  /**
  * permet d'afficher ou de masquer la donnée ponctuelle en fonction de la valeur de show
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
  * @param  {Array} billboard Le tableau d'entités où stocker les billboards
  * @param  {String} choice spécifique à la donnée, permet de charger le tableau d'attributs au bon format
  * @param  {Array} line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
  * @param  {String} couleur La couleur de la ligne au format '#FFFFFF'
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  showPoint(show, name, link, image, billboard, choice, line, couleur, options = {}){
    if(show){
      if(this.dataSources[name] === undefined){
        if(choice === 'piscine') {
          globe.loadPiscine(link, name, image, billboard, choice, line, couleur, options);
        } else {
          globe.loadPoint(link, name, image, billboard, choice, line, couleur, options);
        }

      } else{
        this.dataSources[name].show = true;
        for(var i = 0; i < billboard.length; i++){
            billboard[i].show = true;
            line[i].show = true;
          }
        this.viewer.scene.requestRender(); // dit à Cesium de recalculer la page
      }
    } else{
      if(this.dataSources[name] !== undefined){
        this.dataSources[name].show = false;
        for(var i = 0; i < billboard.length; i++){
            billboard[i].show = false;
            line[i].show = false;
          }
        this.viewer.scene.requestRender();
      }
    }
  }

  updatePoint(link, name, image, billboard, choice, line, couleur, options) {
    if(this.dataSources[name] !== undefined){
      this.viewer.dataSources.remove(this.dataSources[name]);
      this.viewer.scene.requestRender();

      globe.loadPoint(link, name, image, billboard, choice, line, couleur, options);
      this.viewer.scene.requestRender();
    }

  }

  //---------------------------------------------------------------------------------------------------

  /**
  * permet de charger des fichiers geojson temporels
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {Array} line Le tableau d'entités où stocker les contours des polygones
  * @param  {String} choice spécifique à la donnée, permet de charger l'attribut dans lequel on stocke la date de la donnée
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadTimeJson(link, name, line, choice, options = {}){
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

          // on récupère la date dans les attributs et on enlève un jour
          if(choice === 'Qualité air communes Eurométropole') {
            var dateIso = Cesium.JulianDate.fromIso8601(entity.properties._date_echeance._value);
            var date = Cesium.JulianDate.addDays(dateIso, -1, new Cesium.JulianDate());
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
          // on trace les contours des entités
          line.push(this.drawLine(entity.polygon.hierarchy._value.positions, 3, '#FFFFFF', 1, true));
        }

      }

    });
    return promisse;
  }


  /**
  *
  * Afficher ou masquer la source de données "name" en fonction de la valeur de "show"
  * Si elle n'a pas enore été affiché, la fonction va télécharger les données avec le lien "link" passé en parametre
  * Enlève/Affiche les entités billboard pour les points
  *
  * @param  {String} show le paramètre qui spécifie quand l'affichage doit être actif - prend la valeur e.target.checked ou non
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {Array} line Le tableau d'entités où stocker les contours des polygones
  * @param  {String} choice spécifique à la donnée, permet de charger l'attribut dans lequel on stocke la date de la donnée
  * @param  {JulianDate} start La date de début de l'intervalle de temps qu'on souhaite afficher dans la timeline
  * @param  {JulianDate} end La date de fin de l'intervalle de temps qu'on souhaite afficher dans la timeline
  * @param  {Object} options facultatif - Les options pour le chargement
  */
  showTimeJson(show, name, link, line, choice, start, end, options = {}){
    var today = Cesium.JulianDate.now();
    var demain = Cesium.JulianDate.addDays(today, 1, new Cesium.JulianDate());

    if(show){
      if(this.dataSources[name] === undefined){
        globe.loadTimeJson(link, name, line, choice, options);
        // on zoome la timeline sur l'intervalle souhaité
        globe.viewer.timeline.zoomTo(start, end);

      } else{
        globe.viewer.timeline.zoomTo(start, end);
        this.dataSources[name].show = true;
        for(var i = 0; i < line.length; i++){
            line[i].show = true;
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
        for(var i = 0; i < line.length; i++){
            line[i].show = false;
          }
        this.viewer.scene.requestRender();
      }
    }
  }

  /**
  * permet de charger le fichier des piscines + la fréquentation en temps réel
  * (pas de géométrie sur la couche de la fréquentation)
  * utilise la fonction showPolygon pour afficher
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} image L'image à utiliser pour les billboard des entités ponctuelles
  * @param  {Array} billboard Le tableau d'entités où stocker les billboards
  * @param  {String} choice spécifique à la donnée, permet de charger le tableau d'attributs au bon format
  * @param  {Array} line Le tableau d'entités où stocker les lignes qu'on trace depuis le bas du billbard jusqu'au sol
  * @param  {String} couleur La couleur de la ligne au format '#FFFFFF'
  * @param  {Object} options facultatif - Les options pour le chargement
  * @return  {GeoJsonDataSource} le json une fois que tout est chargé
  */
  loadPiscine(link, name, image, billboard, choice, line, couleur, options = {}){
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

      // on récupère le fichier json de la fréquentation en temps réel
      var piscineURL = 'https://data.strasbourg.eu/api/records/1.0/download?dataset=frequentation-en-temps-reel-des-piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=json';
      var xmlhttp = new XMLHttpRequest();
      this.xmlhttp = this;
      xmlhttp.open('GET', piscineURL);
      xmlhttp.responseType = 'json';
      xmlhttp.send();

      // une fois que le fichier est bien chargé
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {

          for(let i = 0; i < 8; i++) {
            let entity = entities[i];
            // on récupère les coordonnées des points importés
            var X = (dataSource._entityCollection._entities._array[i]._position._value.x);
            var Y = (dataSource._entityCollection._entities._array[i]._position._value.y);
            var Z = (dataSource._entityCollection._entities._array[i]._position._value.z);

            var position = new Cesium.Cartesian3(X,Y,Z); // en coords cartesiennes (système ECEF)
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
            line.push(globe.drawLine(coordLigne, 2, couleur, 1, false));
            globe.viewer.scene.requestRender();

            // coordonnées 15m en dessous pour la lisibilité du texte
            let heightLabel = Number(210 + cartographic.height);
            var coordLabel = new Cesium.Cartesian3.fromRadians(longitude, latitude, heightLabel);

            // on nettoie les textes d'affichage des attributs (beaucoup de caractères parasite)
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

            // on lie les attributs des points au nouvelles entités billboard
            //Renseignement des éléments de la boite d'information
            billboard[i].name = String(entity.properties['name']);
            billboard[i].description ='<table class="cesium-infoBox-defaultTable"><tbody>';
            if (Cesium.defined(entity.properties['imageurl'])) {
              billboard[i].description += '<img src="' + String(entity.properties['imageurl']) + '"align="center" width="99%">';
            }

            billboard[i].description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
            billboard[i].description += '<tr><td>Mail</td><td>' + String(entity.properties['mail']) + '</td></tr>';
            billboard[i].description += '<tr><td>Téléphone </td><td>' + String(entity.properties['phone']) + '</td></tr>';
            billboard[i].description += '<tr><td>Adresse </td><td>' + String(entity.properties['address']) + '</td></tr>';
            billboard[i].description += '<tr><td>Accès </td><td>' + acces + '</td></tr>';
            billboard[i].description += '<tr><td>Lien vers le site de la piscine</td><td>' + '<a href= "' + String(entity.properties['friendlyurl']) + '" target="_blank"> '+ String(entity.properties['friendlyurl']) +' </a></td></tr>';

            // on récupère le json chargé
            var attributPiscine = xmlhttp.response;
            for(let j = 0; j < attributPiscine.length; j++) {
              if(entity.name == attributPiscine[j].fields.name) {
                billboard[i].description += '<tr><td>Statut</td><td>' + String(attributPiscine[j].fields.realtimestatus) + '</td></tr>';
                billboard[i].description += '<tr><td>Occupation </td><td>' + String(attributPiscine[j].fields.occupation) + '</td></tr>';
                billboard[i].description += '<tr><td>Heure de mise à jour </td><td>' + String(attributPiscine[j].fields.updatedate) + '</td></tr>';

                // on définit le texte à afficher sur le label, soit le chiffre d'occupation soit closed
                if(Cesium.defined(attributPiscine[j].fields.occupation)) {
                  var occupation = (attributPiscine[j].fields.occupation).toString();
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
                if(attributPiscine[j].fields.realtimestatus === 'GREEN') {
                  statut.label.fillColor = Cesium.Color.fromCssColorString('#1d9c1a');
                } else if(attributPiscine[j].fields.realtimestatus === 'ORANGE') {
                  statut.label.fillColor = Cesium.Color.fromCssColorString('#d47808');
                } else if(attributPiscine[j].fields.realtimestatus === 'RED') {
                  statut.label.fillColor = Cesium.Color.fromCssColorString('#e61207');
                } else if(attributPiscine[j].fields.realtimestatus === 'BLACK') {
                  statut.label.fillColor = Cesium.Color.fromCssColorString('#1a1515');
                } else if(attributPiscine[j].fields.realtimestatus === 'CLOSED') {
                  statut.label.fillColor = Cesium.Color.fromCssColorString('#FFFFFF');
                }

              }
            }

            // le reste du tableau d'attributs
            if (Cesium.defined(entity.properties['serviceandactivities'])) {
              billboard[i].description += '<tr><td>Services et activités </td><td>' + service + '</td></tr>';
            }
            if (Cesium.defined(entity.properties['characteristics'])) {
              billboard[i].description += '<tr><td>Caractéristiques </td><td>' + caracteristique + '</td></tr>';
            }
            if (Cesium.defined(entity.properties['exceptionalschedule'])) {
              billboard[i].description += '<tr><td>Mesures exceptionnelles </td><td>' + exception + '</td></tr>';
            }

            billboard[i].description += '<tr><td>Informations supplémentaires </td><td>' +'<a href="https://www.strasbourg.eu/tarifs-piscines" target="_blank">Consultez les tarifs des piscines de l\'Eurométropole de Strasbourg.</a></td></tr>';
            billboard[i].description +='</tbody></table><br/>';
            billboard[i].description += '<p>' + description + '</p>';
            billboard[i].description += '<a href="https://data.strasbourg.eu/explore/dataset/lieux_piscines/information/" target="_blank">Information sur les données</a><br/><br/>';

          }

        }
      }

    });
    return promisse;

  }

  /**
  *
  * Afficher ou masquer la source de données "name" en fonction de la valeur de "show"
  * Si elle n'a pas enore été affiché, la fonction va télécharger les données avec le lien "link" passé en parametre
  * Enlève/Affiche les entités billboard
  *
  * @param  {String} link Le lien vers le fichier
  * @param  {String} name Le nom qu'on donne au json
  * @param  {String} image Le lien vers l'image à utiliser pour le billboard
  * @param  {Array} billbard Le tableau d'entités où stocker les billboard
  * @param  {String} choice spécifique à la donnée, permet de charger de classifier
  * @param  {Array} line Le tableau d'entités où stocker la ligne qu'on trace jusqu'au sol
  * @param  {String} couleur la couleur de la ligne
  * @param  {Object} options facultatif - Les options pour le chargement
  */
  updatePoint(link, name, image, billboard, choice, line, couleur, options) {
    if(this.dataSources[name] !== undefined){
      this.viewer.dataSources.remove(this.dataSources[name]);
      this.viewer.scene.requestRender();
      if(choice == 'piscine') {
        globe.loadPiscine(link, name, image, billboard, choice, line, couleur, options);
      } else {
        globe.loadPoint(link, name, image, billboard, choice, line, couleur, options);
      }

      this.viewer.scene.requestRender();
    }

  }

  //---------------------------------------------------------------------------------------------------
  // les fonctions createTableau(entity) permettent de charger les tableaux d'attributs spécifiques à chaque couche de donnée
  //---------------------------------------------------------------------------------------------------

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauPLU(entity) {
    //Renseignement des éléments de la boite d'information
    entity.description ='<br/><table class="cesium-infoBox-defaultTable"><tbody>';
    entity.name = 'PLUi Plan de Zonage'
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
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/plu_zone_urba/information/" target="_blank" rel="noopener">Information sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauCommunes(entity) {
    //Renseignement des éléments de la boite d'information
    entity.name = 'Limites de communes';
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>Département </td><td>' + String(entity.properties['num_dept']) + '</td></tr>';
    entity.description += '<tr><td>Commune </td><td>' + String(entity.properties['nom']) + '</td></tr>';
    entity.description += '<tr><td>Code INSEE </td><td>' + String(entity.properties['num_com']) + '</td></tr>';
    entity.description += '<tr><td>Source </td><td>' + String(entity.properties['source']) + '</td></tr>';
    entity.description += '<tr><td>Date export </td><td>' + String(entity.properties['date_exprt']) + '</td></tr>';
    entity.description += '<tr><td>Code précision </td><td>' + String(entity.properties['code_preci']) + '</td></tr>';
    entity.description += '<tr><td>Licence </td><td>' + String(entity.properties['licence']) + '</td></tr>';
    entity.description +='</tbody></table>';
  }

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauSections(entity) {
    //Renseignement des éléments de la boite d'information
    entity.name = 'Limites de sections'
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
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauCadastre(entity) {
    //Renseignement des éléments de la boite d'information
    entity.name = 'Parcellaire cadastral'
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
  * Afficher le tableau d'attributs avec le bon format
  *
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
    if (Cesium.defined(entity.properties['quartier'])) {
      billboard.description += '<tr><td>Quartier</td><td>' + String(entity.properties['quartier']) + '</td></tr>';
    }
    billboard.description += '<tr><td>Quartier calculé</td><td>' + String(entity.properties['quartier_calcule']) + '</td></tr>';
    billboard.description += '<tr><td>Type de patrimoine </td><td>' + String(entity.properties['type_de_patrimoine']) + '</td></tr>';
    if (Cesium.defined(entity.properties['copyright_photo'])) {
      billboard.description += '<tr><td>Source photographie </td><td>' + String(entity.properties['copyright_photo']) + '</td></tr>';
    }
    billboard.description += '<tr><td>Source donnée </td><td>' + String(entity.properties['source']) + '</td></tr>';
    billboard.description +='</tbody></table><br/>';

    billboard.description += '<a href="https://data.strasbourg.eu/explore/dataset/patrimoine_quartier/information/" target="_blank" rel="noopener">Information sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauTraffic(entity){
    //Renseignement des éléments de la boite d'information
    entity.name = 'Traffic routier SIRAC'
    entity.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    entity.description += '<tr><td>etat</td><td>' + String(entity.properties['etat']) + '</td></tr>';
    entity.description += '<tr><td>nom</td><td>' + String(entity.properties['nom']) + '</td></tr>';
    entity.description += '<tr><td>tauxlisse</td><td>' + String(entity.properties['tauxlisse']) + '</td></tr>';
    entity.description += '<tr><td>dmajetatexp</td><td>' + String(entity.properties['dmajetatexp']) + '</td></tr>';
    entity.description += '<tr><td>debitlisse</td><td>' + String(entity.properties['debitlisse']) + '</td></tr>';
    entity.description += '<tr><td>vitessebrp</td><td>' + String(entity.properties['vitessebrp']) + '</td></tr>';
    entity.description += '<tr><td>ident</td><td>' + String(entity.properties['ident']) + '</td></tr>';
    entity.description += '<tr><td>debit</td><td>' + String(entity.properties['debit']) + '</td></tr>';
    entity.description +='</tbody></table><br/>';
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/trafic-routier-eurometropole/information/" target="_blank" rel="noopener">Information sur les données</a><br/><br/>';
  }

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
  *
  * @param  {entity} entity l'entité à utiliser pour l'affichage du tableau d'attributs
  */
  createTableauPiscine(billboard, entity){
    //Renseignement des éléments de la boite d'information
    billboard.name = String(entity.properties['name']);
    billboard.description ='<table class="cesium-infoBox-defaultTable"><tbody>';
    if (Cesium.defined(entity.properties['imageurl'])) {
      billboard.description += '<img src="' + String(entity.properties['imageurl']) + '"align="center" width="99%">';
    }
    billboard.description += '<p>' + String(entity.properties['description']) + '</p>';
    billboard.description += '<tr><td>Nom</td><td>' + String(entity.properties['name']) + '</td></tr>';
    billboard.description += '<tr><td>Mail</td><td>' + String(entity.properties['mail']) + '</td></tr>';
    billboard.description += '<tr><td>Téléphone </td><td>' + String(entity.properties['phone']) + '</td></tr>';
    billboard.description += '<tr><td>Services </td><td>' + String(entity.properties['access']) + '</td></tr>';
    billboard.description += '<tr><td>Lien vers le site de la piscine</td><td>' + '<a href= "' + String(entity.properties['friendlyurl']) + '" target="_blank"> '+ String(entity.properties['friendlyurl']) +' </a></td></tr>';
    billboard.description +='</tbody></table><br/>';

    if (Cesium.defined(entity.properties['serviceandactivities'])) {
      billboard.description += '<p>' + String(entity.properties['serviceandactivities']) + '</p>';
    }
    if (Cesium.defined(entity.properties['characteristics'])) {
      billboard.description += '<p>' + String(entity.properties['characteristics']) + '</p>';
    }
    if (Cesium.defined(entity.properties['additionalinformation'])) {
      billboard.description += '<p>' + String(entity.properties['additionalinformation']) + '</p>';
    }
  }

  /**
  *
  * Afficher le tableau d'attributs avec le bon format
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
    entity.description += '<a href="https://data.strasbourg.eu/explore/dataset/qualite-de-lair-communes-eurometropole/information/" target="_blank" rel="noopener">Information sur les données</a><br/><br/>';
  }

  //---------------------------------------------------------------------------------------------------


  /*flecheNord() {
    var camera = globe.viewer.camera.positionWC;

    let heading = globe.viewer.camera.heading;
    let pitch = globe.viewer.camera.pitch;
    let roll = globe.viewer.camera.roll;
    var orientation = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var north = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0.0), Cesium.Math.toRadians(-90), 0);


    var symbol = this.viewer.entities.add({
      position : new Cesium.CallbackProperty(function (time, result) {

        endLongitude = startLongitude + 0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
      return Cesium.Cartesian3.fromDegreesArray( [startLongitude, startLatitude, endLongitude, startLatitude], Cesium.Ellipsoid.WGS84, result);
    }, false),
      billboard : {
        image : "<img src='src/img/icons8-nord.png'>",
        sizeInMeters: true
      }
    });

  }*/



} // fin de la classe Globe
