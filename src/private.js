class Privatedata {

  /**
  * Le constructeur de la classe fait le lien avec la classe Globe pour pouvoir manipuler les objets et utiliser les fonctions <br/>
  * déclare le LegendManager
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

    this.leftPane = document.querySelector('#left-pane');
    // Créer un gestionnaire pour les légendes
    this.legendManager = new LegendManager(this.leftPane);
    globe.legendManager = this.legendManager;

  }


  getPrivateData() {


    document.querySelector('#affichercouche').addEventListener('click', function() {
      document.querySelector('#affichercouche').classList.add('hidden'); // on ne peut afficher qu'un seul contenu de dossier par session
      localStorage.setItem('identifiant', $('#idEMS').val()); // on enregistre l'identifiant dans la mémoire du navigateur (cookie)
      var identifiant = localStorage.getItem('identifiant'); // et on le récupère


    });


  }


}
