# OD@CiT
 OD@CiT : Données libres et Ville en 3D pour une vision augmentée du territoire

•	Résumé du projet 
OD@CiT est un service Web3D qui permet une découverte 3D intuitive du territoire accessible à tous (agents de la collectivité, secteurs public et privé, citoyens). 
Les données libres diffusées par la plateforme data.strasbourg.eu apportent des informations complémentaires qui transforment la modélisation 3D du territoire en ville numérique augmentée. 
OD@CiT est à la fois un outil technique d’analyse et d’aide à la décision et un service Web3D grand public. 

•	Description détaillée 
Le service OD@CiT s’inscrit dans la démarche globale du projet SIG3D, avec pour objectifs spécifiques :
•	de proposer au plus grand nombre un accès performant, fluide et intuitif au Photomaillage 3D
•	en complémentarité avec les outils existants, d’apporter des fonctionnalités 3D aux agents de la collectivité dans le cadre de leurs missions (accueil du public, urbanisme, prospective, concertation, aide à la décision) 
•	simplifier pour le citoyen la découverte, la compréhension et l’usage des données diffusées en opendata
•	de mutualiser les ressources et favoriser les réutilisations en publiant les développements en opensource

A l’été 2018, une campagne de photographies aériennes a permis de produire une modélisation 3D du territoire couvrant 340 km² appelée Photomaillage 3D (maillage 3D texturé). 
Exhaustive, précise, détaillée, innovante, cette production représente un volume de données très important. 
Durant ce même été, un POC (Proof Of Concept) a été mené par un étudiant en informatique dans le cadre d’un stage d’été. 
Il s’agissait d’évaluer le potentiel de la bibliothèque 3D opensource CESIUM appliquée aux données 3D disponibles à l’Eurométropole.
Les conclusions étant très positives, une expérimentation plus poussée est réalisée en 2019 dans le cadre d’un projet de fin d’études (Webmapping3D, un outil pour l’aménagement du territoire). 
Ce PFE s’est déroulé durant 6 mois (Février-Août 2019). Un état de l’art des outils de Webmapping3D a permis de confirmer la pertinence de la technologie opensource CESIUM. 
En amont des développements, des échanges avec les utilisateurs potentiels ont permis d’identifier les fonctionnalités 3D les plus utiles. 
A l’issue du PFE, une première version d’OD@CiT est mise en ligne et rencontre un certain succès, aussi bien en interne qu’en externe.
Début 2020, la redynamisation de la plateforme opendata de la collectivité ouvre de nouvelles perspectives de développement des usages en permettant l’affichage des données dans une cartographie 3D. 
Pour cela, sur une période de 3 mois, le service a travaillé sur deux axes : 
-	développer en interne les fonctionnalités complémentaires de connexion et d’affichage des données de la plateforme opendata
-	réorganiser et documenter le code pour permettre la publication en opensource et faciliter la réutilisation et la mutualisation des développements
Depuis juin 2020, une nouvelle version enrichie OD@CiT est disponible. 
En complément de l’accès à la modélisation 3D, elle permet une compréhension augmentée et multidimensionnelle du territoire. 
A titre d’exemples :
-	Urbanisme réglementaire : consultation du PLU (plan de zonage et plan détaillé) et du parcellaire cadastral
-	Climat : visualisation temporelle 4D des données de la qualité de l’air
-	Transport : visualisation du trafic routier en temps réel, occupation en temps réel des parkings, cartographie du bruit
-	Patrimoine : enrichissement du modèle 3D par des données sémantiques 2D 
-	Loisirs : occupation en temps réel des piscines, parcours sportifs Vitaboucle
-	…


OD@CiT repose sur la bibliothèque opensource CESIUM, le Photomaillage 3D est exploité au format 3DTiles qui est une spécification ouverte pour le streaming de données 3D.
Les données SIG opendata sont délivrées par le site data.strasbourg.eu qui met en œuvre la technologie Opendatasoft.
La location d’un espace web hébergé auprès d’un fournisseur permet de proposer le service web et de centraliser le modèle 3D texturé.

