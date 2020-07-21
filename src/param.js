class Data {

  constructor(globe){
    this.globe = globe;
    this.terrain = terrain; // format entités
    this.tileset = tileset; // format 3DTileset
    this.viewer = Globe.viewer;
    this.handler = Globe.handler;
    this.dataSources = globe.dataSources; // liste des dataSources (photomaillage, json, 3dtiles)

  }

  couchesOD() {
    var params = globe.getAllUrlParams(window.location.href);
    var lectureURL = params[Object.keys(params)[0]];

    var filePath = 'https://3d.strasbourg.eu/TEST/CESIUM_OPENDATA/src/param.json'; // donne le chemin d'accès au dossier

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath);
    xmlhttp.responseType = 'json';
    xmlhttp.send();


    xmlhttp.onreadystatechange = function () {
      if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {

        var paramJson = xmlhttp.response;
        console.log(paramJson);

        for(let i=0;i<paramJson.menu.length;i++) {
          // ajout du menu déroulant
          let boutonMenu = document.createElement('BUTTON');
          boutonMenu.classList.add('panel-title');
          boutonMenu.innerHTML = paramJson.menu[i].name;

          let fleche = document.createElement('i');
          fleche.classList.add('arrow');
          boutonMenu.appendChild(fleche);

          var panel = document.getElementsByClassName("panel");
          panel[0].appendChild(boutonMenu);

          let couchesDiv = document.createElement('div');
          couchesDiv.classList.add('panel-content');
          couchesDiv.style.display = "none";
          panel[0].appendChild(couchesDiv);


          for(let j=0;j<paramJson.menu[i].couches.length;j++) {

            let couche = document.createElement('div');
            couche.classList.add('nowrap');
            couche.classList.add('show');
            couche.style.display === "block";

            let coucheCheckbox = document.createElement("input");
            coucheCheckbox.type = "checkbox";
            coucheCheckbox.id = paramJson.menu[i].couches[j].id_data;
            coucheCheckbox.style.display === "block";


            var nom = document.createElement("Label");
            nom.setAttribute("for",coucheCheckbox.id);
            nom.innerHTML = paramJson.menu[i].couches[j].name;

            couche.appendChild(coucheCheckbox);
            couche.appendChild(nom);

            let lienInfo = document.createElement("a");
            lienInfo.href = paramJson.menu[i].couches[j].url_info;
            lienInfo.target = "_blank";
            let boutonInfo = document.createElement('BUTTON');
            boutonInfo.classList.add('button');
            boutonInfo.title = "Informations sur les données"
            boutonInfo.innerHTML = '<img src="src/img/icons8-info.png">';
            lienInfo.appendChild(boutonInfo);
            couche.appendChild(lienInfo);

            if(paramJson.menu[i].couches[j].temps_reel === 'oui') {
              if(paramJson.menu[i].couches[j].type_donnee != 'point') {
                // on clone l'objet qui contient les couleurs car Cesium modifie la structure après le passage
                // dans les fonctions show et perd ensuite la classification
                var cloneColor = JSON.parse(JSON.stringify(paramJson.menu[i].couches[j].couleur_classif));
              }

              let boutonRefresh = document.createElement('BUTTON');
              boutonRefresh.classList.add('button');
              boutonRefresh.id = paramJson.menu[i].couches[j].id_data + 'Refresh';
              boutonRefresh.title = "Rafraîchir la donnée"
              boutonRefresh.innerHTML = '<img src="src/img/icons8-synchroniser.png">';
              couche.appendChild(boutonRefresh);
            }

            if(paramJson.menu[i].couches[j].animation === 'oui') {
              let boutonTime = document.createElement('BUTTON');
              boutonTime.classList.add('button');
              boutonTime.id = paramJson.menu[i].couches[j].id_data + 'Time';
              boutonTime.title = "Démarrer l'animation des données"
              boutonTime.innerHTML = '<img src="src/img/icons8-temps.png">';
              couche.appendChild(boutonTime);
            }

            couchesDiv.appendChild(couche);


            // on créé une variable différente pour chaque array de ligne de contour
            window['line'+i+j] = [];
            window['billboard'+i+j] = [];


            coucheCheckbox.addEventListener('change', (e) => {
              if(paramJson.menu[i].couches[j].type_donnee === 'surface' && paramJson.menu[i].couches[j].animation === 'non') {
                globe.showPolygon(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].choice, window['line'+i+j] , paramJson.menu[i].couches[j].couleur_contour, paramJson.menu[i].couches[j].taille_contour, paramJson.menu[i].couches[j].couleur_highlight, paramJson.menu[i].couches[j].alpha_highlight, {
                  classification: true,
                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: paramJson.menu[i].couches[j].couleur_classif,
                  alpha: paramJson.menu[i].couches[j].alpha
                });

                if(e.target.checked){
                  if(paramJson.menu[i].couches[j].legende === 'oui') {
                    globe.legendManager.addLegend(paramJson.menu[i].couches[j].nom_legende, paramJson.menu[i].couches[j].id_data + 'Legend', paramJson.menu[i].couches[j].couleur_legende, paramJson.menu[i].couches[j].type_donnee);
                  }

                } else{
                  if(paramJson.menu[i].couches[j].legende === 'oui') {
                    globe.legendManager.removeLegend(paramJson.menu[i].couches[j].id_data + 'Legend');
                  }
                }
                globe.viewer.scene.requestRender();

              }

              if(paramJson.menu[i].couches[j].type_donnee === 'ligne') {

                globe.showPolyline(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].choice, {
                  classification: true,
                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: paramJson.menu[i].couches[j].couleur_classif,
                  alpha: paramJson.menu[i].couches[j].alpha
                });

                if(e.target.checked){
                  globe.legendManager.addLegend(paramJson.menu[i].couches[j].nom_legende, paramJson.menu[i].couches[j].id_data + 'Legend', paramJson.menu[i].couches[j].couleur_legende, paramJson.menu[i].couches[j].type_donnee);
                } else{
                  globe.legendManager.removeLegend(paramJson.menu[i].couches[j].id_data + 'Legend');
                }
                globe.viewer.scene.requestRender();

              }

              if(paramJson.menu[i].couches[j].type_donnee === 'point') {
                if(paramJson.menu[i].couches[j].couche_attributaire === 'oui') {
                  globe.showPoint(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].url_attribut, paramJson.menu[i].couches[j].image, window['billboard'+i+j], paramJson.menu[i].couches[j].choice, window['line'+i+j], paramJson.menu[i].couches[j].couleur_ligne, {});
                } else {
                  globe.showPoint(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, undefined, paramJson.menu[i].couches[j].image, window['billboard'+i+j], paramJson.menu[i].couches[j].choice, window['line'+i+j], paramJson.menu[i].couches[j].couleur_ligne, {});
                }


                if(e.target.checked){
                  globe.legendManager.addLegend(paramJson.menu[i].couches[j].nom_legende, paramJson.menu[i].couches[j].id_data + 'Legend', paramJson.menu[i].couches[j].couleur_legende, paramJson.menu[i].couches[j].type_donnee, paramJson.menu[i].couches[j].billboard_legende);
                } else{
                  globe.legendManager.removeLegend(paramJson.menu[i].couches[j].id_data + 'Legend');
                }
                globe.viewer.scene.requestRender();

              }

              if(paramJson.menu[i].couches[j].type_donnee === 'surface' && paramJson.menu[i].couches[j].animation === 'oui') {
                var today = Cesium.JulianDate.now();
                var start = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].start), new Cesium.JulianDate());
                var end = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].end), new Cesium.JulianDate());
                globe.viewer.clock.currentTime = end;

                globe.showTimeJson(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, window['line'+i+j] , paramJson.menu[i].couches[j].choice, start, end, {
                  classification: true,                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: paramJson.menu[i].couches[j].couleur_classif,
                  alpha: paramJson.menu[i].couches[j].alpha
                });

                if(e.target.checked){
                  globe.legendManager.addLegend(paramJson.menu[i].couches[j].nom_legende, paramJson.menu[i].couches[j].id_data + 'Legend', paramJson.menu[i].couches[j].couleur_legende, paramJson.menu[i].couches[j].type_donnee);
                } else{
                  globe.legendManager.removeLegend(paramJson.menu[i].couches[j].id_data + 'Legend');
                }
                globe.viewer.scene.requestRender();

              }

            }); // fin de l'évènement change


            if(paramJson.menu[i].couches[j].type_donnee === 'ligne' && paramJson.menu[i].couches[j].temps_reel === 'oui') {

              document.querySelector('#' + paramJson.menu[i].couches[j].id_data + 'Refresh').addEventListener('click', function() {
                // On fait un 2ème clone qu'on garde en mémoire avant que le 1er ne soit modifié par la fonction updatePolyline
                var cloneBis = JSON.parse(JSON.stringify(cloneColor));

                globe.updatePolyline(paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].name, {
                  classification: true,
                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: cloneColor,
                  alpha: paramJson.menu[i].couches[j].alpha
                });

                // on redonne le bon format à la couleur
                cloneColor = cloneBis;
              });

            }

            if(paramJson.menu[i].couches[j].type_donnee === 'point' && paramJson.menu[i].couches[j].temps_reel === 'oui' && paramJson.menu[i].couches[j].couche_attributaire === 'oui') {

              document.querySelector('#' + paramJson.menu[i].couches[j].id_data + 'Refresh').addEventListener('click', function() {

                globe.updatePoint(paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].url_attribut, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].image, window['billboard'+i+j], paramJson.menu[i].couches[j].choice, window['line'+i+j], paramJson.menu[i].couches[j].couleur_ligne,{
                });

              });

            }

            if(paramJson.menu[i].couches[j].type_donnee === 'surface' && paramJson.menu[i].couches[j].animation === 'oui') {
              document.querySelector('#' + paramJson.menu[i].couches[j].id_data + 'Time').addEventListener('click', function() {
                var today = Cesium.JulianDate.now();
                var start = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].start), new Cesium.JulianDate());
                var end = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].end), new Cesium.JulianDate());

                globe.viewer.clock.startTime = start;
                globe.viewer.clock.stopTime = end;
                globe.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop when we hit the end time
                globe.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
                globe.viewer.clock.multiplier = 50000; // how much time to advance each tick
                globe.viewer.clock.shouldAnimate = true; // Animation on by default

              });
            }

            // ouvre la couche à l'ouverture de la page si le paramètre est dans l'url
            var minuscule = paramJson.menu[i].couches[j].id_data.toLowerCase();
            if(lectureURL === 'enable' + minuscule) {
              coucheCheckbox.checked = true;
              var action = new Event('change');
              coucheCheckbox.dispatchEvent(action); // on déclenche l'évenement associé à la couche correspondante

              // lancer l'animation si une couche temporelle est présente dans l'url
              if(paramJson.menu[i].couches[j].animation === 'oui') {
                var today = Cesium.JulianDate.now();
                var start = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].start), new Cesium.JulianDate());
                var end = Cesium.JulianDate.addDays(today, Number(paramJson.menu[i].couches[j].end), new Cesium.JulianDate());

                globe.viewer.clock.startTime = start;
                globe.viewer.clock.stopTime = end;
                globe.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop when we hit the end time
                globe.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
                globe.viewer.clock.multiplier = 50000; // how much time to advance each tick
                globe.viewer.clock.shouldAnimate = true; // Animation on by default

              }
            }


          } // fin du for j

          boutonMenu.addEventListener('click', function() {
            boutonMenu.classList.toggle("active");
            if (couchesDiv.style.display === "block") {
              couchesDiv.style.display = "none";
            } else {
              couchesDiv.style.display = "block";
            }
          });


        } // fin du for i





      }


    }
  }

}
