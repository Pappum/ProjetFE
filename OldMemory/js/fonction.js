var liste = ["01", "02", "03", "04", "05", "06", "07", "08", "01", "02", "03", "04", "05", "06", "07", "08"];
var permiereCarte = null;
var cliquePossible = true;
var mode = "1 joueur";
var scoreJ1 = 0;
var scoreJ2 = 0;
var Jactuel = 1;
var Jattente = 2;

//Fonction de mélange
function shuffleArray(theArray) {
	var len = theArray.length;
	var i = len;
	while (i--) {
		var p = parseInt(Math.random()*len);
		var t = theArray[i];
		theArray[i] = theArray[p];
		theArray[p] = t;
	}
}

//Appel pour mélanger les cartes
shuffleArray(liste);

//Fonction qui rend visible une carte
function retourne(numeroCarte) {
	var carte = document.getElementById("img"+numeroCarte);
	
	if (cliquePossible == true) {

		if(srcCarte == "images/back.jpg") {

			carte.setAttribute("src", "images/"+ liste[numeroCarte] +".jpg");
		}
			if(permiereCarte == null) {
				carte.setAttribute("src", "images/"+ liste[numeroCarte] +".jpg");
				permiereCarte = document.getElementById("img"+numeroCarte);
			}
			else {
				carte.setAttribute("src", "images/"+ liste[numeroCarte] +".jpg");
				var srcCarte = carte.getAttribute("src");
				var idCarte = carte.getAttribute("id");
				var srcPC = permiereCarte.getAttribute("src");
				var idPC = permiereCarte.getAttribute("id");
		
				if(srcCarte == srcPC) {
					permiereCarte = null;

					//Attribution des points en fonction du nombre de joueurs
					if (mode == "1 joueur"){
						scoreJ1 ++;
						affichage();
					}
					if (mode == "2 joueurs"){
						if (Jactuel == 1){
							scoreJ1 ++;
							affichage();
						} 
						else {
							scoreJ2 ++;
							affichage();
						}
					}

					//Conditions pour la gagne
					if(mode == "1 joueur") {
						if (scoreJ1 == 8){
							confirm("Bravo, vous avez finis le jeu, voulez-vous recommencer ?");
							remiseAZero();
						}
					}
					else {
						if (scoreJ1 == 5) {
							alert("Bravo ! Vous avez 5 points le joueur 2 ne peut pas vous rattraper, vous avez gagné !");
							remiseAZero();
						}
						else if (scoreJ2 == 5){
							alert("Bravo ! Vous avez 5 points le joueur 1 ne peut pas vous rattraper, vous avez gagné !");
							remiseAZero();
						}
						else if ((scoreJ1 + scoreJ2) == 8 && scoreJ2 == scoreJ1){
							confirm("Match nul ! On recommence ?")
							remiseAZero();
						}
					}
					
					messageDeFin();
				}
				else {
					cliquePossible = false;
					setTimeout("cache('" + idPC + "')", 1000);
					setTimeout("cache('" + idCarte + "')", 1000);
					setTimeout('cliquePossible = true', 1000);
					if (mode == "2 joueurs") {
						chgtJoueur();
					}
				}
				permiereCarte = null;
			}
		
	}
}

//Fonction qui cache une carte
function cache(id) {
	var carteCache = document.getElementById(id);
	carteCache.setAttribute("src", "images/back.jpg");
}

//Fonction de remise à zéro
function remiseAZero() {
	var ToutesLesCartes = document.getElementsByTagName("img");

	for (var i = 0 ; i < ToutesLesCartes.length ; i++) { 
		ToutesLesCartes[i].setAttribute("src", "images/back.jpg");
	}

	shuffleArray(liste);
	scoreJ1 = 0;
	scoreJ2 = 0;
	Jactuel = 1;
	Jattente = 2;
	affichage();
}

//Fonction affiche un message à la fin et remet à zéro
function messageDeFin() {
	var ToutesLesCartes = document.getElementsByTagName("img");
	var toutesRetournees;

	for (var i = 0 ; i < ToutesLesCartes.length ; i++) { 
		srcToutes = ToutesLesCartes[i].getAttribute("src");
		if (srcToutes == "images/back.jpg") {
			return toutesRetournees = false;
		}
	}

	if (toutesRetournees != false) {
		alert("Vous avez gagné ! BRAVO !");
		remiseAZero();
	}
}

//Fonction affichage
function affichage() {
	document.getElementById('mode').innerHTML = mode;
	document.getElementById('joueur' + Jactuel).setAttribute('style', 'background:red;color:white;');
	document.getElementById('joueur' + Jattente).setAttribute('style', 'background:initial;color:initial;');
	document.getElementById('scoreJ1').innerHTML = scoreJ1;
	document.getElementById('scoreJ2').innerHTML = scoreJ2;
}

//Initialisation des modes de jeu
function set_mode_1J(){
	mode = "1 joueur";
	remiseAZero();
	affichage();
}
		
function set_mode_2J(){
	mode = "2 joueurs";
	remiseAZero();
	affichage();
}

//Changement de joueur
function chgtJoueur() {
	if(Jactuel == 1) {
		Jactuel = 2;
		Jattente = 1;
		affichage();
	}
	else {
		Jactuel = 1;
		Jattente = 2;
		affichage();
	}
}



