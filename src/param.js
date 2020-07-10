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
          //couchesDiv.id = paramJson.menu[i].id_panel;
          couchesDiv.style.display = "none";
          panel[0].appendChild(couchesDiv);

          for(let j=0;j<paramJson.menu[i].couches.length;j++) {

            let couche = document.createElement('div');
            couche.classList.add('nowrap');
            couche.classList.add('show');
            //couche.id = paramJson.menu[i].couches[j].id_data + 'Div';
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

            couchesDiv.appendChild(couche);


            // on créé une variable différente pour chaque array de ligne de contour
            window['line'+j] = [];

            window['couleurClassif'+j] = paramJson.menu[i].couches[j].couleur_classif;

            window['couleurLegend'+j] = paramJson.menu[i].couches[j].couleur_legende;

            coucheCheckbox.addEventListener('change', (e) => {
              if(paramJson.menu[i].couches[j].type_donnee === 'surface' && paramJson.menu[i].couches[j].temps_reel === 'non' && paramJson.menu[i].couches[j].animation === 'non') {
                globe.showPolygon(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].name, window['line'+j] , paramJson.menu[i].couches[j].couleur_contour, paramJson.menu[i].couches[j].taille_contour, paramJson.menu[i].couches[j].couleur_highlight, paramJson.menu[i].couches[j].alpha_highlight, {
                  classification: true,
                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: window['couleurClassif'+j],
                  alpha: paramJson.menu[i].couches[j].alpha
                });
              } else if(paramJson.menu[i].couches[j].type_donnee === 'lineaire') {
                globe.showPolyline(e.target.checked, paramJson.menu[i].couches[j].id_data, paramJson.menu[i].couches[j].url_data, paramJson.menu[i].couches[j].name, {
                  classification: true,
                  classificationField: paramJson.menu[i].couches[j].champ_classif,
                  colors: window['couleurClassif'+j],
                  alpha: paramJson.menu[i].couches[j].alpha
                });

              } else if(paramJson.menu[i].couches[j].type_donnee === 'ponctuel') {

              }



              globe.viewer.scene.requestRender();

              if(e.target.checked){
                globe.legendManager.addLegend(paramJson.menu[i].couches[j].name, paramJson.menu[i].couches[j].id_data + 'Legend', window['couleurLegend'+j], paramJson.menu[i].couches[j].type_legende);
              } else{
                globe.legendManager.removeLegend(paramJson.menu[i].couches[j].id_data + 'Legend');
              }

              globe.viewer.scene.requestRender();

            });
          }

          boutonMenu.addEventListener('click', function() {
            boutonMenu.classList.toggle("active");
            if (couchesDiv.style.display === "block") {
              couchesDiv.style.display = "none";
            } else {
              couchesDiv.style.display = "block";
            }
          });


        }





      }


    }
  }

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


}
