"use strict";
//
// PARAMETRAGE DES COUCHES OPENDATA
//
// ----------------------------------------------------------------------------------------------
class Data {

  constructor(globe){
    this.globe = globe;
    this.terrain = terrain; // format entités
    this.tileset = tileset; // format 3DTileset
    this.viewer = Globe.viewer;
    this.handler = Globe.handler;
    this.dataSources = globe.dataSources; // liste des dataSources (photomaillage, json, 3dtiles)
  }

  couchesOD(){

    var enableODTerrasses2019 = false;
    var enableODTerrasses2020 = false;
    var enableODStationPayant = false;
    var enableODPLUiZonage = false;
    var enableODTraffic = false;
    var enableODPatrimoine = false;
    var enableODQualiteAir = false;
    var enableODPiscine = false;
    var enableODVitaBoucle = false;
    var enableODLimitesCommunes = false;
    var enableODLimitesSections = false;
    var enableODCadastreBlaesheim = false;
    var enableODCadastreGeispolsheim = false;
    var enableODCadastreAchenheim = false;
    var enableODCadastreBischheim = false;
    var enableODCadastreBreuschwickersheim = false;
    var enableODCadastreEckbolsheim = false;
    var enableODCadastreEckwersheim = false;
    var enableODCadastreEntzheim = false;
    var enableODCadastreEschau = false;
    var enableODCadastreFegersheim = false;
    var enableODCadastreHangenbieten = false;
    var enableODCadastreHoenheim = false;
    var enableODCadastreHoltzheim = false;
    var enableODCadastreIllkirch = false;
    var enableODCadastreKolbsheim = false;
    var enableODCadastreLampertheim = false;
    var enableODCadastreLingolsheim = false;
    var enableODCadastreLipsheim = false;
    var enableODCadastreMittelhausbergen = false;
    var enableODCadastreMundolsheim = false;
    var enableODCadastreNiederhausbergen = false;
    var enableODCadastreOberhausbergen = false;
    var enableODCadastreOberschaeffolsheim = false;
    var enableODCadastreOsthoffen = false;
    var enableODCadastreOstwald = false;
    var enableODCadastrePlobsheim = false;
    var enableODCadastreReichstett = false;
    var enableODCadastreSchiltigheim = false;
    var enableODCadastreSouffelweyersheim = false;
    var enableODCadastreStrasbourgCentre = false;
    var enableODCadastreStrasbourgGareKleber = false;
    var enableODCadastreStrasbourgEsplaBourseKrut = false;
    var enableODCadastreStrasbourgNeudorf = false;
    var enableODCadastreStrasbourgMeinau = false;
    var enableODCadastreStrasbourgNeuhof = false;
    var enableODCadastreStrasbourgKoenigsMV = false;
    var enableODCadastreStrasbourgCroHautPotHohberg = false;
    var enableODCadastreStrasbourgRobertsau = false;
    var enableODCadastreVendenheim = false;
    var enableODCadastreLaWantzenau = false;
    var enableODCadastreWolfisheim = false;

    // on lit les paramètres dans l'url
    var params = globe.getAllUrlParams(window.location.href);
    var lectureURL = params[Object.keys(params)[0]];

    // on retranscrit le paramètre open en variable
    switch(lectureURL){
      case 'enableodpluizonage':
      enableODPLUiZonage = true;
      break;
      case 'enableodterrasses2019':
      enableODTerrasses2019 = true;
      break;
      case 'enableodterrasses2020':
      enableODTerrasses2020 = true;
      break;
      case 'enableodstationpayant':
      enableODStationPayant = true;
      break;
      case 'enableodtraffic':
      enableODTraffic = true;
      break;
      case 'enableodpatrimoine':
      enableODPatrimoine = true;
      break;
      case 'enableodqualiteair':
      enableODQualiteAir = true;
      break;
      case 'enableodpiscine':
      enableODPiscine = true;
      break;
      case 'enableodvitaboucle':
      enableODVitaBoucle = true;
      break;
      case 'enableodlimitescommunes':
      enableODLimitesCommunes = true;
      break;
      case 'enableodlimitessections':
      enableODLimitesSections = true;
      break;

      case 'enableodcadastreachenheim':
      enableODCadastreAchenheim = true;
      break;
      case 'enableodcadastreblaesheim':
      enableODCadastreBlaesheim = true;
      break;
      case 'enableodcadastrebischheim':
      enableODCadastreBischheim = true;
      break;
      case 'enableodcadastrebreuschwickersheim':
      enableODCadastreBreuschwickersheim = true;
      break;
      case 'enableodcadastreeckbolsheim':
      enableODCadastreEckbolsheim = true;
      break;
      case 'enableodcadastreeckwersheim':
      enableODCadastreEckwersheim = true;
      break;
      case 'enableodcadastreentzheim':
      enableODCadastreEntzheim = true;
      break;
      case 'enableodcadastreeschau':
      enableODCadastreEschau = true;
      break;
      case 'enableodcadastrefegersheim':
      enableODCadastreFegersheim = true;
      break;
      case 'enableodcadastregeispolsheim':
      enableODCadastreGeispolsheim = true;
      break;
      case 'enableodcadastrehangenbieten':
      enableODCadastreHangenbieten = true;
      break;
      case 'enableodcadastrehoenheim':
      enableODCadastreHoenheim = true;
      break;
      case 'enableodcadastreholtzheim':
      enableODCadastreHoltzheim = true;
      break;
      case 'enableodcadastreillkirch':
      enableODCadastreIllkirch = true;
      break;
      case 'enableodcadastrekolbsheim':
      enableODCadastreKolbsheim = true;
      break;
      case 'enableodcadastrelampertheim':
      enableODCadastreLampertheim = true;
      break;
      case 'enableodcadastrelawantzenau':
      enableODCadastreLaWantzenau = true;
      break;
      case 'enableodcadastrelingolsheim':
      enableODCadastreLingolsheim = true;
      break;
      case 'enableodcadastrelipsheim':
      enableODCadastreLipsheim = true;
      break;
      case 'enableodcadastremittelhausbergen':
      enableODCadastreMittelhausbergen = true;
      break;
      case 'enableodcadastremundolsheim':
      enableODCadastreMundolsheim = true;
      break;
      case 'enableodcadastreniederhausbergen':
      enableODCadastreNiederhausbergen = true;
      break;
      case 'enableodcadastreoberhausbergen':
      enableODCadastreOberhausbergen = true;
      break;
      case 'enableodcadastreoberschaeffolsheim':
      enableODCadastreOberschaeffolsheim = true;
      break;
      case 'enableodcadastreosthoffen':
      enableODCadastreOsthoffen = true;
      break;
      case 'enableodcadastreostwald':
      enableODCadastreOstwald = true;
      break;
      case 'enableodcadastreplobsheim':
      enableODCadastrePlobsheim = true;
      break;
      case 'enableodcadastrereichstett':
      enableODCadastreReichstett = true;
      break;
      case 'enableodcadastreschiltigheim':
      enableODCadastreSchiltigheim = true;
      break;
      case 'enableodcadastresouffelweyersheim':
      enableODCadastreSouffelweyersheim = true;
      break;
      case 'enableodcadastrestrasbourgcentre':
      enableODCadastreStrasbourgCentre = true;
      break;
      case 'enableodcadastrestrasbourggarekleber':
      enableODCadastreStrasbourgGareKleber = true;
      break;
      case 'enableodcadastrestrasbourgesplaboursekrut':
      enableODCadastreStrasbourgEsplaBourseKrut = true;
      break;
      case 'enableodcadastrestrasbourgneudorf':
      enableODCadastreStrasbourgNeudorf = true;
      break;
      case 'enableodcadastrestrasbourgmeinau':
      enableODCadastreStrasbourgMeinau = true;
      break;
      case 'enableodcadastrestrasbourgneuhof':
      enableODCadastreStrasbourgNeuhof = true;
      break;
      case 'enableodcadastrestrasbourgkoenigsmv':
      enableODCadastreStrasbourgKoenigsMV = true;
      break;
      case 'enableodcadastrestrasbourgcrohautpothohberg':
      enableODCadastreStrasbourgCroHautPotHohberg = true;
      break;
      case 'enableodcadastrestrasbourgrobertsau':
      enableODCadastreStrasbourgRobertsau = true;
      break;
      case 'enableodcadastrevendenheim':
      enableODCadastreVendenheim = true;
      break;
      case 'enableodcadastrewolfisheim':
      enableODCadastreWolfisheim = true;
      break;

    }


    //-------------------------------------------------------------------------------------------------------------------------
    //
    // ONGLET INFORMATIONS CADASTRALES
    //
    //-------------------------------------------------------------------------------------------------------------------------

    // Affichage de la couche des limites de communes OPENDATA //
    var colorsLimitesCommunesClassif = {
      '67': '#AAAAAA'
    };
    var lineCommunes = [];
    if (enableODLimitesCommunes) {
      document.getElementById("ODLimitesCommunes").checked = true;
      globe.showPolygon(true, 'ODLimitesCommunes', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=limites_de_communes&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&timezone=Europe/Berlin', 'Limites de communes', lineCommunes, '#FFFFFF', 3.0, '#D3D3D3', 0.2, {
        classification: true,
        classificationField: 'num_dept',
        colors: colorsLimitesCommunesClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    }

    document.querySelector('#ODLimitesCommunes').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODLimitesCommunes', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=limites_de_communes&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&timezone=Europe/Berlin', 'Limites de communes', lineCommunes, '#FFFFFF', 3.0, '#D3D3D3', 0.2, {
        classification: true,
        classificationField: 'num_dept',
        colors: colorsLimitesCommunesClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });

    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche des limites de sections OPENDATA //
    var colorsLimitesSectionsClassif = {
      'licence ouverte etalab v2': '#AAAAAA'
    };
    var lineSections = [];
    if (enableODLimitesSections) {
      document.getElementById("ODLimitesSections").checked = true;
      globe.showPolygon(true, 'ODLimitesSections', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=sections_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&timezone=Europe/Berlin', 'Limites de sections', lineSections, '#FF0000', 3.0, '#D3D3D3', 0.2, {
        classification: true,
        classificationField: 'licence',
        colors: colorsLimitesSectionsClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODLimitesSections').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODLimitesSections', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=sections_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&timezone=Europe/Berlin', 'Limites de sections', lineSections, '#FF0000', 3.0, '#D3D3D3', 0.2, {
        classification: true,
        classificationField: 'licence',
        colors: colorsLimitesSectionsClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    //
    //
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Achenheim OPENDATA //
    var colorsCadastreAchenheimClassif = {
      '001': '#AAAAAA'
    };
    var lineAchenheim = [];
    if (enableODCadastreAchenheim) {
      document.getElementById("ODCadastreAchenheim").checked = true;

      globe.showPolygon(true, 'ODCadastreAchenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=001&timezone=Europe/Berlin', 'Parcellaire cadastral', lineAchenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreAchenheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreAchenheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreAchenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=001&timezone=Europe/Berlin', 'Parcellaire cadastral', lineAchenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreAchenheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });

    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Blaesheim OPENDATA //
    var colorsCadastreBlaesheimClassif = {
      '049': '#AAAAAA'
    };
    var lineBlaesheim = [];
    if (enableODCadastreBlaesheim) {
      document.getElementById("ODCadastreBlaesheim").checked = true;
      globe.showPolygon(true, 'ODCadastreBlaesheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=049&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBlaesheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBlaesheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreBlaesheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreBlaesheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=049&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBlaesheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBlaesheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });

    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Bischheim OPENDATA //
    var colorsCadastreBischheimClassif = {
      '043': '#AAAAAA'
    };
    var lineBisch = [];
    if (enableODCadastreBischheim) {
      document.getElementById("ODCadastreBischheim").checked = true;

      globe.showPolygon(true, 'ODCadastreBischheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=043&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBisch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBischheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreBischheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreBischheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=043&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBisch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBischheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Breuschwickersheim OPENDATA //
    var colorsCadastreBreuschwickersheimClassif = {
      '065': '#AAAAAA'
    };
    var lineBreusch = [];
    if (enableODCadastreBreuschwickersheim) {
      document.getElementById("ODCadastreBreuschwickersheim").checked = true;

      globe.showPolygon(true, 'ODCadastreBreuschwickersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=065&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBreusch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBreuschwickersheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreBreuschwickersheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreBreuschwickersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=065&timezone=Europe/Berlin', 'Parcellaire cadastral', lineBreusch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreBreuschwickersheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Eckbolsheim OPENDATA //
    var colorsCadastreEckbolsheimClassif = {
      '118': '#AAAAAA'
    };
    var lineEckbo = [];
    if (enableODCadastreEckbolsheim) {
      document.getElementById("ODCadastreEckbolsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreEckbolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=118&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEckbo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEckbolsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreEckbolsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreEckbolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=118&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEckbo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEckbolsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Eckwersheim OPENDATA //
    var colorsCadastreEckwersheimClassif = {
      '119': '#AAAAAA'
    };
    var lineEckwer = [];
    if (enableODCadastreEckwersheim) {
      document.getElementById("ODCadastreEckwersheim").checked = true;

      globe.showPolygon(true, 'ODCadastreEckwersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=119&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEckwer, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEckwersheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreEckwersheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreEckwersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=119&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEckwer, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEckwersheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Entzheim OPENDATA //
    var colorsCadastreEntzheimClassif = {
      '124': '#AAAAAA'
    };
    var lineEntzheim = [];
    if (enableODCadastreEntzheim) {
      document.getElementById("ODCadastreEntzheim").checked = true;

      globe.showPolygon(true, 'ODCadastreEntzheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=124&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEntzheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEntzheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreEntzheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreEntzheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=124&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEntzheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEntzheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Eschau OPENDATA //
    var colorsCadastreEschauClassif = {
      '131': '#AAAAAA'
    };
    var lineEschau = [];
    if (enableODCadastreEschau) {
      document.getElementById("ODCadastreEschau").checked = true;

      globe.showPolygon(true, 'ODCadastreEschau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=131&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEschau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEschauClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreEschau').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreEschau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=131&timezone=Europe/Berlin', 'Parcellaire cadastral', lineEschau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreEschauClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Fegersheim OPENDATA //
    var colorsCadastreFegersheimClassif = {
      '137': '#AAAAAA'
    };
    var lineFeger = [];
    if (enableODCadastreFegersheim) {
      document.getElementById("ODCadastreFegersheim").checked = true;

      globe.showPolygon(true, 'ODCadastreFegersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=137&timezone=Europe/Berlin', 'Parcellaire cadastral', lineFeger, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreFegersheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreFegersheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreFegersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=137&timezone=Europe/Berlin', 'Parcellaire cadastral', lineFeger, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreFegersheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Geispolsheim OPENDATA //
    var colorsCadastreGeispolsheimClassif = {
      '152': '#AAAAAA'
    };
    var lineGeispo = [];
    if (enableODCadastreGeispolsheim) {
      document.getElementById("ODCadastreGeispolsheim").checked = true;
      globe.showPolygon(true, 'ODCadastreGeispolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=152&timezone=Europe/Berlin', 'Parcellaire cadastral', lineGeispo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreGeispolsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreGeispolsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreGeispolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=152&timezone=Europe/Berlin', 'Parcellaire cadastral', lineGeispo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreGeispolsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Hangenbieten OPENDATA //
    var colorsCadastreHangenbietenClassif = {
      '182': '#AAAAAA'
    };
    var lineHangen = [];
    if (enableODCadastreHangenbieten) {
      document.getElementById("ODCadastreHangenbieten").checked = true;

      globe.showPolygon(true, 'ODCadastreHangenbieten', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=182&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHangen, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHangenbietenClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreHangenbieten').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreHangenbieten', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=182&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHangen, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHangenbietenClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Hoenheim OPENDATA //
    var colorsCadastreHoenheimClassif = {
      '204': '#AAAAAA'
    };
    var lineHoenheim = [];
    if (enableODCadastreHoenheim) {
      document.getElementById("ODCadastreHoenheim").checked = true;

      globe.showPolygon(true, 'ODCadastreHoenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=204&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHoenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHoenheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreHoenheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreHoenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=204&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHoenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHoenheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Holtzheim OPENDATA //
    var colorsCadastreHoltzheimClassif = {
      '212': '#AAAAAA'
    };
    var lineHoltz = [];
    if (enableODCadastreHoltzheim) {
      document.getElementById("ODCadastreHoltzheim").checked = true;

      globe.showPolygon(true, 'ODCadastreHoltzheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=212&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHoltz, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHoltzheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreHoltzheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreHoltzheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=212&timezone=Europe/Berlin', 'Parcellaire cadastral', lineHoltz, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreHoltzheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Illkirch OPENDATA //
    var colorsCadastreIllkirchClassif = {
      '218': '#AAAAAA'
    };
    var lineIllkirch = [];
    if (enableODCadastreIllkirch) {
      document.getElementById("ODCadastreIllkirch").checked = true;

      globe.showPolygon(true, 'ODCadastreIllkirch', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=218&timezone=Europe/Berlin', 'Parcellaire cadastral', lineIllkirch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreIllkirchClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreIllkirch').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreIllkirch', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=218&timezone=Europe/Berlin', 'Parcellaire cadastral', lineIllkirch, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreIllkirchClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Kolbsheim OPENDATA //
    var colorsCadastreKolbsheimClassif = {
      '247': '#AAAAAA'
    };
    var lineKolb = [];
    if (enableODCadastreKolbsheim) {
      document.getElementById("ODCadastreKolbsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreKolbsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=247&timezone=Europe/Berlin', 'Parcellaire cadastral', lineKolb, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreKolbsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreKolbsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreKolbsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=247&timezone=Europe/Berlin', 'Parcellaire cadastral', lineKolb, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreKolbsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Lampertheim OPENDATA //
    var colorsCadastreLampertheimClassif = {
      '256': '#AAAAAA'
    };
    var lineLamp = [];
    if (enableODCadastreLampertheim) {
      document.getElementById("ODCadastreLampertheim").checked = true;

      globe.showPolygon(true, 'ODCadastreLampertheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=256&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLamp, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLampertheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreLampertheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreLampertheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=256&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLamp, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLampertheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Lingolsheim OPENDATA //
    var colorsCadastreLingolsheimClassif = {
      '267': '#AAAAAA'
    };
    var lineLingo = [];
    if (enableODCadastreLingolsheim) {
      document.getElementById("ODCadastreLingolsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreLingolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=267&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLingo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLingolsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreLingolsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreLingolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=267&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLingo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLingolsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Lipsheim OPENDATA //
    var colorsCadastreLipsheimClassif = {
      '268': '#AAAAAA'
    };
    var lineLipsheim = [];
    if (enableODCadastreLipsheim) {
      document.getElementById("ODCadastreLipsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreLipsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=268&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLipsheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLipsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreLipsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreLipsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=268&timezone=Europe/Berlin', 'Parcellaire cadastral', lineLipsheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLipsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Mittelhausbergen OPENDATA //
    var colorsCadastreMittelhausbergenClassif = {
      '296': '#AAAAAA'
    };
    var lineMittel = [];
    if (enableODCadastreMittelhausbergen) {
      document.getElementById("ODCadastreMittelhausbergen").checked = true;

      globe.showPolygon(true, 'ODCadastreMittelhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=296&timezone=Europe/Berlin', 'Parcellaire cadastral', lineMittel, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreMittelhausbergenClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreMittelhausbergen').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreMittelhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=296&timezone=Europe/Berlin', 'Parcellaire cadastral', lineMittel, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreMittelhausbergenClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Mundolsheim OPENDATA //
    var colorsCadastreMundolsheimClassif = {
      '309': '#AAAAAA'
    };
    var lineMundo = [];
    if (enableODCadastreMundolsheim) {
      document.getElementById("ODCadastreMundolsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreMundolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=309&timezone=Europe/Berlin', 'Parcellaire cadastral', lineMundo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreMundolsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreMundolsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreMundolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=309&timezone=Europe/Berlin', 'Parcellaire cadastral', lineMundo, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreMundolsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Niederhausbergen OPENDATA //
    var colorsCadastreNiederhausbergenClassif = {
      '326': '#AAAAAA'
    };
    var lineNieder = [];
    if (enableODCadastreNiederhausbergen) {
      document.getElementById("ODCadastreNiederhausbergen").checked = true;

      globe.showPolygon(true, 'ODCadastreNiederhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=326&timezone=Europe/Berlin', 'Parcellaire cadastral', lineNieder, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreNiederhausbergenClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreNiederhausbergen').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreNiederhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=326&timezone=Europe/Berlin', 'Parcellaire cadastral', lineNieder, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreNiederhausbergenClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Oberhausbergen OPENDATA //
    var colorsCadastreOberhausbergenClassif = {
      '343': '#AAAAAA'
    };
    var lineOberhaus = [];
    if (enableODCadastreOberhausbergen) {
      document.getElementById("ODCadastreOberhausbergen").checked = true;

      globe.showPolygon(true, 'ODCadastreOberhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=343&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOberhaus, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOberhausbergenClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreOberhausbergen').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreOberhausbergen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=343&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOberhaus, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOberhausbergenClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Oberschaeffolsheim OPENDATA //
    var colorsCadastreOberschaeffolsheimClassif = {
      '350': '#AAAAAA'
    };
    var lineOberscha = [];
    if (enableODCadastreOberschaeffolsheim) {
      document.getElementById("ODCadastreOberschaeffolsheim").checked = true;

      globe.showPolygon(true, 'ODCadastreOberschaeffolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=350&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOberscha, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOberschaeffolsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreOberschaeffolsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreOberschaeffolsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=350&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOberscha, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOberschaeffolsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Osthoffen OPENDATA //
    var colorsCadastreOsthoffenClassif = {
      '363': '#AAAAAA'
    };
    var lineOsthoffen = [];
    if (enableODCadastreOsthoffen) {
      document.getElementById("ODCadastreOsthoffen").checked = true;

      globe.showPolygon(true, 'ODCadastreOsthoffen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=363&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOsthoffen, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOsthoffenClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreOsthoffen').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreOsthoffen', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=363&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOsthoffen, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOsthoffenClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Ostwald OPENDATA //
    var colorsCadastreOstwaldClassif = {
      '365': '#AAAAAA'
    };
    var lineOstwald = [];
    if (enableODCadastreOstwald) {
      document.getElementById("ODCadastreOstwald").checked = true;

      globe.showPolygon(true, 'ODCadastreOstwald', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=365&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOstwald, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOstwaldClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreOstwald').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreOstwald', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=365&timezone=Europe/Berlin', 'Parcellaire cadastral', lineOstwald, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreOstwaldClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Plobsheim OPENDATA //
    var colorsCadastrePlobsheimClassif = {
      '378': '#AAAAAA'
    };
    var linePlob = [];
    if (enableODCadastrePlobsheim) {
      document.getElementById("ODCadastrePlobsheim").checked = true;

      globe.showPolygon(true, 'ODCadastrePlobsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=378&timezone=Europe/Berlin', 'Parcellaire cadastral', linePlob, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastrePlobsheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium
    else {
      // on dechecked la checkbox si la couche n'est pas affichée à l'ouverture de Cesium
      document.getElementById("ODCadastrePlobsheim").checked = false;
    }


    document.querySelector('#ODCadastrePlobsheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastrePlobsheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=378&timezone=Europe/Berlin', 'Parcellaire cadastral', linePlob, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastrePlobsheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Reichstett OPENDATA //
    var colorsCadastreReichstettClassif = {
      '389': '#AAAAAA'
    };
    var lineReich = [];
    if (enableODCadastreReichstett) {
      document.getElementById("ODCadastreReichstett").checked = true;

      globe.showPolygon(true, 'ODCadastreReichstett', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=389&timezone=Europe/Berlin', 'Parcellaire cadastral', lineReich, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreReichstettClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium
    else {
      // on dechecked la checkbox si la couche n'est pas affichée à l'ouverture de Cesium
      document.getElementById("ODCadastreReichstett").checked = false;
    }


    document.querySelector('#ODCadastreReichstett').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreReichstett', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=389&timezone=Europe/Berlin', 'Parcellaire cadastral', lineReich, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreReichstettClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Schiltigheim OPENDATA //
    var colorsCadastreSchiltigheimClassif = {
      '447': '#AAAAAA'
    };
    var lineSchilig = [];
    if (enableODCadastreSchiltigheim) {
      document.getElementById("ODCadastreSchiltigheim").checked = true;

      globe.showPolygon(true, 'ODCadastreSchiltigheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=447&timezone=Europe/Berlin', 'Parcellaire cadastral', lineSchilig, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreSchiltigheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium


    document.querySelector('#ODCadastreSchiltigheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreSchiltigheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=447&timezone=Europe/Berlin', 'Parcellaire cadastral', lineSchilig, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreSchiltigheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Souffelweyersheim OPENDATA //
    var colorsCadastreSouffelweyersheimClassif = {
      '471': '#AAAAAA'
    };
    var lineSouffel = [];
    if (enableODCadastreSouffelweyersheim) {
      document.getElementById("ODCadastreSouffelweyersheim").checked = true;

      globe.showPolygon(true, 'ODCadastreSouffelweyersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=471&timezone=Europe/Berlin', 'Parcellaire cadastral', lineSouffel, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreSouffelweyersheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreSouffelweyersheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreSouffelweyersheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=471&timezone=Europe/Berlin', 'Parcellaire cadastral', lineSouffel, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreSouffelweyersheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Centre OPENDATA //
    var colorsCadastreStrasbourgCentreClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasCentre = [];
    if (enableODCadastreStrasbourgCentre) {
      document.getElementById("ODCadastreStrasbourgCentre").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgCentre', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Centre&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasCentre, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgCentreClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgCentre').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgCentre', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Centre&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasCentre, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgCentreClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Gare-Kléber OPENDATA //
    var colorsCadastreStrasbourgGareKleberClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasGare = [];
    if (enableODCadastreStrasbourgGareKleber) {
      document.getElementById("ODCadastreStrasbourgGareKleber").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgGareKleber', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Gare-Kléber&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasGare, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgGareKleberClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgGareKleber').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgGareKleber', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Gare-Kléber&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasGare, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgGareKleberClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------

    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Esplanade-Bourse-Krutenau OPENDATA //
    var colorsCadastreStrasbourgEsplaBourseKrutClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasEspla = [];
    if (enableODCadastreStrasbourgEsplaBourseKrut) {
      document.getElementById("ODCadastreStrasbourgEsplaBourseKrut").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgEsplaBourseKrut', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Esplanade-Bourse-Krutenau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasEspla, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgEsplaBourseKrutClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgEsplaBourseKrut').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgEsplaBourseKrut', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Esplanade-Bourse-Krutenau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasEspla, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgEsplaBourseKrutClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------


    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Neudorf-Schluthfeld-Port du Rhin-Musau OPENDATA //
    var colorsCadastreStrasbourgNeudorfClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasNeudorf = [];
    if (enableODCadastreStrasbourgNeudorf) {
      document.getElementById("ODCadastreStrasbourgNeudorf").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgNeudorf', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Neudorf-Schluthfeld-Port du Rhin-Musau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasNeudorf, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgNeudorfClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgNeudorf').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgNeudorf', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Neudorf-Schluthfeld-Port du Rhin-Musau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasNeudorf, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgNeudorfClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------


    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Meinau OPENDATA //
    var colorsCadastreStrasbourgMeinauClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasMeinau = [];
    if (enableODCadastreStrasbourgMeinau) {
      document.getElementById("ODCadastreStrasbourgMeinau").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgMeinau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Meinau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasMeinau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgMeinauClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgMeinau').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgMeinau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Meinau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasMeinau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgMeinauClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Neuhof OPENDATA //
    var colorsCadastreStrasbourgNeuhofClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasNeuhof = [];
    if (enableODCadastreStrasbourgNeuhof) {
      document.getElementById("ODCadastreStrasbourgNeuhof").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgNeuhof', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Neuhof&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasNeuhof, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgNeuhofClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgNeuhof').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgNeuhof', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Neuhof&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasNeuhof, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgNeuhofClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Koenigshoffen-Montagne Verte OPENDATA //
    var colorsCadastreStrasbourgKoenigsMVClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasKoenig = [];
    if (enableODCadastreStrasbourgKoenigsMV) {
      document.getElementById("ODCadastreStrasbourgKoenigsMV").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgKoenigsMV', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Koenigshoffen-Montagne Verte&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasKoenig, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgKoenigsMVClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgKoenigsMV').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgKoenigsMV', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Koenigshoffen-Montagne Verte&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasKoenig, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgKoenigsMVClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Cronenbourg-Hautepierre-Poteries-Hohberg OPENDATA //
    var colorsCadastreStrasbourgCroHautPotHohbergClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasCro = [];
    if (enableODCadastreStrasbourgCroHautPotHohberg) {
      document.getElementById("ODCadastreStrasbourgCroHautPotHohberg").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgCroHautPotHohberg', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Cronenbourg-Hautepierre-Poteries-Hohberg&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasCro, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgCroHautPotHohbergClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgCroHautPotHohberg').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgCroHautPotHohberg', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Cronenbourg-Hautepierre-Poteries-Hohberg&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasCro, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgCroHautPotHohbergClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Strasbourg Robertsau OPENDATA //
    var colorsCadastreStrasbourgRobertsauClassif = {
      '482': '#AAAAAA'
    };
    var lineStrasRobertsau = [];
    if (enableODCadastreStrasbourgRobertsau) {
      document.getElementById("ODCadastreStrasbourgRobertsau").checked = true;

      globe.showPolygon(true, 'ODCadastreStrasbourgRobertsau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Robertsau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasRobertsau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgRobertsauClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreStrasbourgRobertsau').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreStrasbourgRobertsau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&q=Strasbourg Robertsau&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=482&timezone=Europe/Berlin', 'Parcellaire cadastral', lineStrasRobertsau, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreStrasbourgRobertsauClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Vendenheim OPENDATA //
    var colorsCadastreVendenheimClassif = {
      '506': '#AAAAAA'
    };
    var lineVendenheim = [];
    if (enableODCadastreVendenheim) {
      document.getElementById("ODCadastreVendenheim").checked = true;

      globe.showPolygon(true, 'ODCadastreVendenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=506&timezone=Europe/Berlin', 'Parcellaire cadastral', lineVendenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreVendenheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreVendenheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreVendenheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=506&timezone=Europe/Berlin', 'Parcellaire cadastral', lineVendenheim, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreVendenheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire LaWantzenau OPENDATA //
    var colorsCadastreLaWantzenauClassif = {
      '519': '#AAAAAA'
    };
    var lineWantz = [];
    if (enableODCadastreLaWantzenau) {
      document.getElementById("ODCadastreLaWantzenau").checked = true;

      globe.showPolygon(true, 'ODCadastreLaWantzenau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=519&timezone=Europe/Berlin', 'Parcellaire cadastral', lineWantz, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLaWantzenauClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreLaWantzenau').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreLaWantzenau', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=519&timezone=Europe/Berlin', 'Parcellaire cadastral', lineWantz, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreLaWantzenauClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    //
    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche du Parcellaire Wolfisheim OPENDATA //
    var colorsCadastreWolfisheimClassif = {
      '551': '#AAAAAA'
    };
    var lineWolfi = [];
    if (enableODCadastreWolfisheim) {
      document.getElementById("ODCadastreWolfisheim").checked = true;

      globe.showPolygon(true, 'ODCadastreWolfisheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=551&timezone=Europe/Berlin', 'Parcellaire cadastral', lineWolfi, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreWolfisheimClassif,
        alpha: 0.01
      });

      globe.viewer.scene.requestRender();
    } //fin de si on affiche la couche à l'ouverture de cesium

    document.querySelector('#ODCadastreWolfisheim').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODCadastreWolfisheim', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=parcelles_cadastrales&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson&disjunctive.num_com=true&disjunctive.n_section=true&disjunctive.n_parcelle=true&refine.num_com=551&timezone=Europe/Berlin', 'Parcellaire cadastral', lineWolfi, '#F0E68C', 2.0, '#FF0000', 0.5, {
        classification: true,
        classificationField: 'num_com',
        colors: colorsCadastreWolfisheimClassif,
        alpha: 0.01
      });
      globe.viewer.scene.requestRender();

    });

    //-------------------------------------------------------------------------------------------------------------------------
    //
    // ONGLET TRANSPORT ET DEPLACEMENTS
    //
    //-------------------------------------------------------------------------------------------------------------------------


    // Affichage de la couche du stationnement payant OPENDATA //
    var colorsStationPayantClassif = {
      '0.5€/h ou 1€/3h': '#C7F79A',
      '1,7€/h': '#EBF975',
      '2,1€/h': '#F378B5'
    };
    var colorsStationPayantLegend = {
      '0.5€/h_ou_1€/3h': '#C7F79A',
      '1,7€/h': '#EBF975',
      '2,1€/h': '#F378B5'
    };
    var lineStation = [];
    if (enableODStationPayant) {
      document.getElementById("ODStationPayant").checked = true;
      globe.showPolygon(true, 'ODStationPayant', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=stationnement-payant&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Stationnement payant', lineStation , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'libelle',
        colors: colorsStationPayantClassif,
        alpha: 0.5
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Stationnement_payant', 'ODStationPayantLegend', colorsStationPayantLegend, 'polygon');
    } //fin de si on affiche stationnement payant à l'ouverture de cesium

    document.querySelector('#ODStationPayant').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODStationPayant', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=stationnement-payant&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Stationnement payant', lineStation , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'libelle',
        colors: colorsStationPayantClassif,
        alpha: 0.5
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Stationnement_payant', 'ODStationPayantLegend', colorsStationPayantLegend, 'polygon');
      } else{
        globe.legendManager.removeLegend('ODStationPayantLegend');
      }

      globe.viewer.scene.requestRender();

    });

    // ----------------------------------------------------------------------------------------------------------------
    // Affichage de la couche traffic routier OPENDATA //
    var colorsTraffic = {
      '1': '#15780c',
      '2': '#de8b1f',
      '3': '#fc0000'
    };
    var colorsTrafficLegend = {
      'Fluide': '#15780c',
      'Dense': '#de8b1f',
      'Saturé': '#e80707'
    };
    var choice = 'Traffic routier SIRAC';

    if (enableODTraffic) {
      document.getElementById("ODTraffic").checked = true;

      globe.showPolyline(true, 'ODTraffic', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=trafic-routier-eurometropole&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', choice, {
        classification: true,
        classificationField: 'etat',
        colors: colorsTraffic,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Traffic_routier_Eurométropole', 'ODTrafficLegend', colorsTrafficLegend, 'line');
    }

    document.querySelector('#ODTraffic').addEventListener('change', (e) => {

      globe.showPolyline(e.target.checked, 'ODTraffic', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=trafic-routier-eurometropole&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', choice, {
        classification: true,
        classificationField: 'etat',
        colors: colorsTraffic,
        alpha: 0.7
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Traffic_routier_Eurométropole', 'ODTrafficLegend', colorsTrafficLegend, 'line');
      } else{
        globe.legendManager.removeLegend('ODTrafficLegend');
      }

    });

    // le bouton pour rafraichir la donnée
    document.querySelector('#refreshTraffic').addEventListener('click', function() {
      // on redéfinit les couleurs pour ne pas perdre la classification
      var colorsTraffic = {
        '1': '#15780c',
        '2': '#de8b1f',
        '3': '#fc0000'
      };
      globe.updatePolyline('https://data.strasbourg.eu/api/records/1.0/download?dataset=trafic-routier-eurometropole&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'ODTraffic', choice, {
        classification: true,
        classificationField: 'etat',
        colors: colorsTraffic,
        alpha: 0.7
      });
    });

    //-------------------------------------------------------------------------------------------------------------------------
    //
    // ONGLET DATA.STRASBOURG.EU
    //
    //-------------------------------------------------------------------------------------------------------------------------
    // Affichage du PLU - Règlement graphique et écrit(Plan de zonage) OPENDATA //
    var colorsPLUiZonageClassif = {
      'A1': '#FFDC00',
      'A2': '#FFDC00',
      'A3': '#FFDC00',
      'A4': '#FFDC00',
      'A5': '#FFDC00',
      'A6': '#FFDC00',
      'A7': '#FFDC00',
      'A8': '#FFDC00',
      'IAUA1': '#FF6500',
      'IAUA2': '#FF6500',
      'IAUB': '#FF6500',
      'IAUB1': '#FF6500',
      'IAUE1' : '#F105FF',
      'IAUE2' : '#F105FF',
      'IAUXb1' : '#1F97E1',
      'IAUXb2' : '#1F97E1',
      'IAUXd' : '#1F97E1',
      'IAUXe' : '#1F97E1',
      'IAUZ' : '#1F97E1',
      'IIAU' : '#F1B39B',
      'IIAUE' : '#7400FB',
      'IIAUX' : '#21FFEE',
      'N1' : '#00B610',
      'N2' : '#00B610',
      'N3' : '#00B610',
      'N3z1' : '#00B610',
      'N4' : '#00B610',
      'N5' : '#00B610',
      'N6' : '#00B610',
      'N7' : '#00B610',
      'N8' : '#00B610',
      'PSMV' : '#F3001D',
      'UAA1' : '#F3001D',
      'UAA2' : '#F3001D',
      'UAA3' : '#F3001D',
      'UAB1' : '#F3001D',
      'UAB2' : '#F3001D',
      'UB1' : '#F3001D',
      'UB2' : '#F3001D',
      'UB2a' : '#F3001D',
      'UB3' : '#F3001D',
      'UB4' : '#F3001D',
      'UB5' : '#F3001D',
      'UCA1' : '#F3001D',
      'UCA2' : '#F3001D',
      'UCA3' : '#F3001D',
      'UCA4' : '#F3001D',
      'UCA5' : '#F3001D',
      'UCA6' : '#F3001D',
      'UCB1' : '#F3001D',
      'UCB2' : '#F3001D',
      'UD1' : '#F3001D',
      'UD2' : '#F3001D',
      'UD2a' : '#F3001D',
      'UDz1' : '#F3001D',
      'UDz2' : '#F3001D',
      'UDz3' : '#F3001D',
      'UDz4' : '#F3001D',
      'UDz5' : '#F3001D',
      'UE1': '#98104E',
      'UE2': '#98104E',
      'UE3': '#98104E',
      'UF': '#001B92',
      'UG': '#001B92',
      'UXa1': '#001B92',
      'UXa2': '#001B92',
      'UXb1': '#001B92',
      'UXb2': '#001B92',
      'UXb3': '#001B92',
      'UXb4': '#001B92',
      'UXb5': '#001B92',
      'UXc': '#001B92',
      'UXcz1': '#001B92',
      'UXcz2': '#001B92',
      'UXcz3': '#001B92',
      'UXd1': '#001B92',
      'UXd2': '#001B92',
      'UXd3a': '#001B92',
      'UXd3b': '#001B92',
      'UXd4': '#001B92',
      'UXe1': '#001B92',
      'UXe2': '#001B92',
      'UXf': '#001B92',
      'UXg': '#001B92',
      'UYa': '#001B92',
      'UYb': '#001B92',
      'UZ1': '#001B92',
      'UZ2': '#001B92'

    };
    var colorsPLUiZonageLegend = {
      'A': '#FFDC00',
      'IAUA,IAUB': '#FF6500',
      'IAUE' : '#F105FF',
      'IAUX,IAUZ' : '#1F97E1',
      'IIAU' : '#F1B39B',
      'IIAUE' : '#7400FB',
      'IIAUX' : '#21FFEE',
      'N' : '#00B610',
      'UAA,UAB,UB,UCA,UCB,UD,PSMV' : '#F3001D',
      'UE' : '#98104E',
      'UF,UG,UX,UY,UZ' : '#001B92'
    };
    var linePLU = [];
    if (enableODPLUiZonage) {
      document.getElementById("ODPLUiZonage").checked = true;
      globe.showPolygon(true, 'ODPLUiZonage', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=plu_zone_urba&format=geojson', 'PLUi Plan de Zonage', linePLU, '#FFFFFF', 1.0,'#708090', 0.5, {
        classification: true,
        classificationField: 'type',
        colors: colorsPLUiZonageClassif,
        alpha: 0.3
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('PLUi_Plan_de_zonage', 'ODPLUiZonageLegend', colorsPLUiZonageLegend, 'polygon');
    }

    document.querySelector('#ODPLUiZonage').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODPLUiZonage', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=plu_zone_urba&format=geojson', 'PLUi Plan de Zonage', linePLU, '#FFFFFF', 1.0, '#708090', 0.5, {
        classification: true,
        classificationField: 'type',
        colors: colorsPLUiZonageClassif,
        alpha: 0.3
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('PLUi_Plan_de_zonage', 'ODPLUiZonageLegend', colorsPLUiZonageLegend, 'polygon');
      } else{
        globe.legendManager.removeLegend('ODPLUiZonageLegend');
      }
      globe.viewer.scene.requestRender();

    });

// --------------------------------------------------------------------------------------------------------------

    document.querySelector('#ODPLUdetaille').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODPLUdetaille', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=plu_decoupage&format=geojson', 'PLU detaille', lineTerrasse , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'echelle'
      });

      /*if(e.target.checked){
        var pludetaille = globe.viewer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromRadiansArray([
              0.13409615484666773,
              0.8482662467760245,
              0.1356682982396785,
              0.848284967037624,
              0.1356577303015877,
              0.8474863781321933,
              0.13384067919821924,
              0.8475629459909885,
            ]),
            //material: "https://data.strasbourg.eu/api/datasets/1.0/carte_plu_detaille/attachments/carte_plu_detaille_png/",
            material: "https://sig.strasbourg.eu/datastrasbourg/plu_planches/6.1-PLU_zonage%202000/6.1-PLU_zonage2000_80_092019.pdf",
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
          },
        });

        globe.viewer.scene.requestRender();

      } else {
        //globe.viewer.entities.remove(pludetaille);
        globe.viewer.scene.requestRender();
      }*/
    });

    // --------------------------------------------------------------------------------------------------------------
    // Affichage de la couche des terrasses 2019 OPENDATA //
    var colorsTerrassesClassif = {
      'STRASBOURG': '#D7146E'
    };
    var colorsTerrassesLegend = {
      'Terrasses_autorisées_2019': '#D7146E'
    };
    var lineTerrasse = [];
    if (enableODTerrasses2019) {
      document.getElementById("ODTerrasses").checked = true;
      globe.showPolygon(true, 'ODTerrasses', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=terrasses-autorisees-en-2019&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Terrasses 2019', lineTerrasse , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'ville',
        colors: colorsTerrassesClassif,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Terrasses_autorisées_en_2019', 'ODTerrassesLegend', colorsTerrassesLegend, 'polygon');
    } //fin de si on affiche les terrasses à l'ouverture de cesium

    document.querySelector('#ODTerrasses').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODTerrasses', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=terrasses-autorisees-en-2019&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Terrasses 2019', lineTerrasse , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'ville',
        colors: colorsTerrassesClassif,
        alpha: 0.7
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Terrasses_autorisées_en_2019', 'ODTerrassesLegend', colorsTerrassesLegend, 'polygon');
      } else{
        globe.legendManager.removeLegend('ODTerrassesLegend');
      }

      globe.viewer.scene.requestRender();

    });

    // ----------------------------------------------------------------------------------------------
    // Affichage de la couche des terrasses 2020 OPENDATA //
    var colorsTerrasses2020Classif = {
      'STRASBOURG': '#076b2c'
    };
    var colorsTerrasses2020Legend = {
      'Terrasses_autorisées_2020': '#076b2c'
    };
    var lineTerrasse2020 = [];
    if (enableODTerrasses2020) {
      document.getElementById("ODTerrasses2020").checked = true;
      globe.showPolygon(true, 'ODTerrasses2020', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=terrasses-autorisees-en-2020&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Terrasses 2020', lineTerrasse2020 , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'ville',
        colors: colorsTerrasses2020Classif,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Terrasses_autorisées_en_2020', 'ODTerrasses2020Legend', colorsTerrasses2020Legend, 'polygon');
    } //fin de si on affiche les terrasses à l'ouverture de cesium

    document.querySelector('#ODTerrasses2020').addEventListener('change', (e) => {
      globe.showPolygon(e.target.checked, 'ODTerrasses2020', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=terrasses-autorisees-en-2020&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'Terrasses 2020', lineTerrasse2020 , '#FFFFFF', 0, '#708090', 0.5, {
        classification: true,
        classificationField: 'ville',
        colors: colorsTerrasses2020Classif,
        alpha: 0.7
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Terrasses_autorisées_en_2020', 'ODTerrassesLegend2020', colorsTerrasses2020Legend, 'polygon');
      } else{
        globe.legendManager.removeLegend('ODTerrassesLegend2020');
      }

      globe.viewer.scene.requestRender();

    });



    // --------------------------------------------------------------------------------------------------------------
    // Affichage de la couche patrimoine de mon quartier OPENDATA //
    var billboardPatrimoine = [];
    var linePatrimoine = [];

    var colorsPatrimoineLegend = {
      'Patrimoine    ': '#fcba03'
    };

    if (enableODPatrimoine) {
      document.getElementById("ODPatrimoine").checked = true;

      globe.showPoint(true, 'ODPatrimoine', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=patrimoine_quartier&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', undefined, 'src/img/billboard/marker_red.png', billboardPatrimoine, 'patrimoine', linePatrimoine, '#cf1204', {});

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Patrimoine_quartier', 'ODPatrimoineLegend', colorsPatrimoineLegend, 'point', "<img src='src/img/billboard/marker_red.png'>");
    }

    document.querySelector('#ODPatrimoine').addEventListener('change', (e) => {
      globe.showPoint(e.target.checked, 'ODPatrimoine', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=patrimoine_quartier&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', undefined, 'src/img/billboard/marker_red.png', billboardPatrimoine, 'patrimoine', linePatrimoine, '#cf1204', {});

      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Patrimoine_quartier', 'ODPatrimoineLegend', colorsPatrimoineLegend, 'point', "<img src='src/img/billboard/marker_red.png'>");
      } else{
        globe.legendManager.removeLegend('ODPatrimoineLegend');
      }

    });

    // --------------------------------------------------------------------------------------------------------------

    // Affichage de la couche qualité de l'air de l'eurométropole OPENDATA //
    var lineAir = [];
    var colorsQualiteAir = {
      '1': '#3b8019',
      '2': '#47991f',
      '3': '#589917',
      '4': '#9EE01A',
      '5': '#e8e823',
      '6': '#e3a112',
      '7': '#f07a13',
      '8': '#f04a13',
      '9': '#c91a0a',
      '10': '#850b0b'

    };
    var colorsQualiteAirLegend = {
      '1_Très_Bon': '#3b8019',
      '2_Très_Bon': '#47991f',
      '3_Bon': '#589917',
      '4_Bon': '#9EE01A',
      '5_Moyen': '#e8e823',
      '6_Médiocre': '#e3a112',
      '7_Médiocre': '#f07a13',
      '8_Mauvais': '#f04a13',
      '9_Mauvais': '#c91a0a',
      '10_Très_Mauvais': '#850b0b'

    };

    // paramètre pour l'horloge
    var today = Cesium.JulianDate.now();
    var hier = Cesium.JulianDate.addDays(today, -1, new Cesium.JulianDate());
    var start = Cesium.JulianDate.addDays(today, -8, new Cesium.JulianDate());

    if (enableODQualiteAir) {
      // quand on met les paramètres dans l'url l'animation se lance directement
      globe.viewer.clock.startTime = start;
      globe.viewer.clock.currentTime = start;
      globe.viewer.clock.stopTime = today;
      globe.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop when we hit the end time
      globe.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      globe.viewer.clock.multiplier = 50000; // how much time to advance each tick
      globe.viewer.clock.shouldAnimate = true; // Animation on by default

      document.getElementById("ODQualiteAir").checked = true;

      globe.showTimeJson(true, 'ODQualiteAir', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=qualite-de-lair-communes-eurometropole&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', lineAir, 'Qualité air communes Eurométropole', start, hier, {
        classification: true,
        classificationField: 'valeur',
        colors: colorsQualiteAir,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Qualite_Air_Eurométropole', 'ODQualiteAirLegend', colorsQualiteAirLegend, 'polygon');
    }

    document.querySelector('#ODQualiteAir').addEventListener('change', (e) => {
      globe.viewer.clock.currentTime = hier;
      globe.showTimeJson(e.target.checked, 'ODQualiteAir', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=qualite-de-lair-communes-eurometropole&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', lineAir, 'Qualité air communes Eurométropole', start, hier, {
        classification: true,
        classificationField: 'valeur',
        colors: colorsQualiteAir,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Qualite_Air_Eurométropole', 'ODQualiteAirLegend', colorsQualiteAirLegend, 'polygon');
      } else{
        globe.legendManager.removeLegend('ODQualiteAirLegend');
      }

    });

    // on lance l'animation en cliquant sur l'horloge
    document.querySelector('#timeAir').addEventListener('click', function() {
      globe.viewer.clock.startTime = start;
      globe.viewer.clock.stopTime = today;
      globe.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop when we hit the end time
      globe.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      globe.viewer.clock.multiplier = 50000; // how much time to advance each tick
      globe.viewer.clock.shouldAnimate = true; // Animation on by default

    });

    // --------------------------------------------------------------------------------------------------------------

    // Affichage de la couche fréquentation des piscines temps réel de l'eurométropole OPENDATA //
    var linePiscine = [];
    var billboardPiscine = [];
    var colorsPiscineLegend = {
      'Piscine        ': '#fcba03'
    };

    if (enableODPiscine) {
      document.getElementById("ODPiscine").checked = true;

      globe.showPoint(true, 'ODPiscine', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=lieux_piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=frequentation-en-temps-reel-des-piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=json', 'src/img/billboard/pool.png', billboardPiscine, 'piscine', linePiscine, '#4287f5', {});

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Fréquentation_piscine', 'ODPiscineLegend', colorsPiscineLegend, 'point', "<img src='src/img/billboard/pool_legend.png'>");
    }

    document.querySelector('#ODPiscine').addEventListener('change', (e) => {
      globe.showPoint(e.target.checked, 'ODPiscine', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=lieux_piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=frequentation-en-temps-reel-des-piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=json', 'src/img/billboard/pool.png', billboardPiscine, 'piscine', linePiscine, '#4287f5', {});

      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Fréquentation_piscine', 'ODPiscineLegend', colorsPiscineLegend, 'point', "<img src='src/img/billboard/pool_legend.png'>");
      } else{
        globe.legendManager.removeLegend('ODPiscineLegend');
      }

    });

    // le bouton pour rafraichir la donnée
    document.querySelector('#refreshPiscine').addEventListener('click', function() {
      globe.updatePoint('https://data.strasbourg.eu/api/records/1.0/download?dataset=lieux_piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=frequentation-en-temps-reel-des-piscines&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=json', 'ODPiscine', 'src/img/billboard/pool.png', billboardPiscine, 'piscine', linePiscine, '#4287f5', {

      });
    });

    // --------------------------------------------------------------------------------------------------------------

    var colorsVitaBoucle = {
      'facile': '#15780c',
      'moyenne': '#097db8',
      'difficile': '#fc0000'
    };
    var choice = 'Boucle sportive Vitaboucle';

    if (enableODVitaBoucle) {
      document.getElementById("ODVitaBoucle").checked = true;

      globe.showPolyline(true, 'ODVitaBoucle', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=boucles_sportives_vitaboucle&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', choice, {
        classification: true,
        classificationField: 'difficulte',
        colors: colorsVitaBoucle,
        alpha: 0.7
      });

      globe.viewer.scene.requestRender();

      globe.legendManager.addLegend('Boucle_sportive_Vitaboucle', 'ODVitaBoucleLegend', colorsVitaBoucle, 'line');
    }

    document.querySelector('#ODVitaBoucle').addEventListener('change', (e) => {

      globe.showPolyline(e.target.checked, 'ODVitaBoucle', 'https://data.strasbourg.eu/api/records/1.0/download?dataset=boucles_sportives_vitaboucle&apikey=3adb5f640063ee29feecfbf114d284e6be5d0284b1950baecab080e8&format=geojson', choice, {
        classification: true,
        classificationField: 'difficulte',
        colors: colorsVitaBoucle,
        alpha: 0.7
      });
      globe.viewer.scene.requestRender();

      if(e.target.checked){
        globe.legendManager.addLegend('Boucle_sportive_Vitaboucle', 'ODVitaBoucleLegend', colorsVitaBoucle, 'line');
      } else{
        globe.legendManager.removeLegend('ODVitaBoucleLegend');
      }

    });


  } // fin de la fonction couchesOD
} // fin de la classe Data
