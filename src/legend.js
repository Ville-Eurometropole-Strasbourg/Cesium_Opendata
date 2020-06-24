"use strict";

/*
* Classe permettant de gérer les légendes
*/
class LegendManager {

  /**
  * Le constructeur de la classe Legend qui créé le contenant pour les légendes
  *
  * @param  {DivHTML} legendContainer l'élément HTML dans lequel mettre les légendes, ici le left-pane
  */
  constructor(legendContainer){
    this.legendContainer = legendContainer;
  }

  /**
  * Permet d'ajouter une légende
  *
  * @param  {String} titre Le titre qu'on donne à la légende
  * @param  {String} id Le nom qu'on donne à la légende
  * @param  {Map} values la variable map qui contient les couleurs et leur valeur associée
  * @param  {String} choice prend la valeur point, line ou polygon, permet de différencier l'affichage des légendes
  * @param  {String} symbol le symbole à utiliser pour les légendes ponctuelles
  */
  addLegend(titre, id, values, choice, symbol){
    let legend = document.createElement('div');
    legend.id = id;
    legend.classList.add('legend');
    legend.classList.add('backdrop');

    let textTitre = document.createElement('span');
    textTitre.classList.add('legend-text');
    textTitre.innerHTML = titre;

    let titreLegend = document.createElement('div');
    titreLegend.classList.add('legend-element');
	  titreLegend.appendChild(textTitre);
    legend.appendChild(titreLegend);

    Object.keys(values).forEach((key) => {
      legend.appendChild(this.makeLegendItem(key, values[key], choice, symbol));
    });

    this.legendContainer.appendChild(legend);
  }

  /**
  * Permet de supprimer une légende
  *
  * @param  {String} id Le nom de la légende à retirer
  */
  removeLegend(id){
    let legend = this.legendContainer.querySelector('#' + id);
    legend.parentElement.removeChild(legend);
  }

  /**
  * Permet de vérifier si une légende existe
  *
  * @param  {String} id Le nom de la légende à tester
  * @return {Boolean} true si la légende existe, false sinon
  */
  hasLegend(id){
    return this.legendContainer.querySelectorAll('#' + id).length != 0;
  }

  /**
  * Créé les éléments HTML pour l'affichage de la légende
  *
  * @param  {String} label le texte à mettre dans la légende
  * @param  {String} color la couleur à mettre dans légende
  * @param  {String} choice prend la valeur point, line ou polygon, permet de différencier l'affichage des légendes
  * @param  {String} symbol le symbole à utiliser pour les légendes ponctuelles
  * @return {Object} l'objet HTML dans lequel la légende est créée
  */
  makeLegendItem(label, color, choice, symbol){
    let legendColor = document.createElement('span');
    if(choice === 'line'){
      legendColor.classList.add('legend-line');
      legendColor.style = "background-color: " + color + ";";
    } else if(choice === 'polygon') {
      legendColor.classList.add('legend-color');
      legendColor.style = "background-color: " + color + ";";
    } else if(choice === 'point') {
      legendColor.classList.add('legend-color');
      legendColor.innerHTML = symbol;
    }




    let legendText = document.createElement('span');
    legendText.classList.add('legend-text');
    legendText.innerHTML = label;

    let item = document.createElement('div');
    item.classList.add('legend-element');
    item.appendChild(legendColor);
    item.appendChild(legendText);

    return item;
  }
}
