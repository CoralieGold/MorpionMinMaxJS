window.addEventListener("DOMContentLoaded",function(){

	const VIDE = 0;
	const CROIX = 1;
	const ROND = 2;
	const HUMAN = 0;
	const ORDI = 1;
	
	var joueur;
	var morpion;
	
	function initTabJS(){
		var i,j;
		morpion = new Array();
		for(i=0;i<3;i++){
			morpion[i] = new Array();
			for(j=0;j<3;j++){
				morpion[i][j] = VIDE;
			}
		}
	}

	function copieMorpion(morp){
		var i,j;
		var copie = new Array();
		for(i=0;i<3;i++){
			copie[i] = new Array();
			for(j=0;j<3;j++){
				copie[i][j] = morp[i][j];
			}
		}
		return copie;
	}
	
	function rondGagne(morp){
		var gagne;
		var ligneGagnante = false;
		var colonneGagnante = false;
		var diagonaleGagnante;
		var i = 0;
		while((i<3)&&(!ligneGagnante)){
			ligneGagnante = (morp[i][0]==ROND)&&(morp[i][1]==ROND)&&(morp[i][2]==ROND);
			i++;
		}
		i = 0;
		while((i<3)&&(!colonneGagnante)){
			colonneGagnante = (morp[0][i]==ROND)&&(morp[1][i]==ROND)&&(morp[2][i]==ROND);
			i++;
		}
		diagonaleGagnante = (morp[0][0]==ROND)&&(morp[1][1]==ROND)&&(morp[2][2]==ROND);
		if(!diagonaleGagnante){
			diagonaleGagnante = (morp[0][2]==ROND)&&(morp[1][1]==ROND)&&(morp[2][0]==ROND);
		}
		gagne = ligneGagnante || colonneGagnante || diagonaleGagnante;
		return gagne;
	}
	
	function croixGagne(morp){
		var gagne;
		var ligneGagnante = false;
		var colonneGagnante = false;
		var diagonaleGagnante;
		var i = 0;
		while((i<3)&&(!ligneGagnante)){
			ligneGagnante = (morp[i][0]==CROIX)&&(morp[i][1]==CROIX)&&(morp[i][2]==CROIX);
			i++;
		}
		i = 0;
		while((i<3)&&(!colonneGagnante)){
			colonneGagnante = (morp[0][i]==CROIX)&&(morp[1][i]==CROIX)&&(morp[2][i]==CROIX);
			i++;
		}
		diagonaleGagnante = (morp[0][0]==CROIX)&&(morp[1][1]==CROIX)&&(morp[2][2]==CROIX);
		if(!diagonaleGagnante){
			diagonaleGagnante = (morp[0][2]==CROIX)&&(morp[1][1]==CROIX)&&(morp[2][0]==CROIX);
		}
		gagne = ligneGagnante || colonneGagnante || diagonaleGagnante;
		return gagne;
	}
	
	function estPlein(morp){
		var i,j;
		var nbCasesVides = 0;
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(morp[i][j]==VIDE)
					nbCasesVides++;
			}
		}
		return (nbCasesVides==0);
	}
	
	function estFini(morp){
		return rondGagne(morp)||croixGagne(morp)||estPlein(morp);
	}
	
	function initTabHTML(){
		var i,j;
		var ligne,cellule;
		var tab = document.getElementById("morpion");
		for(i=0;i<3;i++){
			ligne = document.createElement("tr");
			for(j=0;j<3;j++){
				cellule = document.createElement("td");
				cellule.addEventListener("click",function(x,y){
					return function(){
						if((joueur==HUMAN)&&(morpion[x][y]==VIDE)){
							affiche("Le joueur humain joue en ("+x+","+y+")");
							morpion[x][y] = ROND;
							majTabHTML();
							if(estFini(morpion))
								finDePartie(morpion);
							else {
								joueur = ORDI;
								coupOrdi();
							}
						}
					}
				}(i,j),false);
				ligne.appendChild(cellule);
			}
			tab.appendChild(ligne);
		}
	}

	function majTabHTML(){
		var i,j;
		var cellules = document.getElementsByTagName("td");
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				switch(morpion[i][j]){
					case VIDE :
						cellules[i*3+j].setAttribute("class","vide");
						break;
					case CROIX :
						cellules[i*3+j].setAttribute("class","croix");
						break;
					case ROND :
						cellules[i*3+j].setAttribute("class","rond");
						break;
				}
			}
		}
	}
	
	function finDePartie(morp){
		if(croixGagne(morp))
			affiche("L'intelligence artificielle a gagné.");
		else if(rondGagne(morp))
			affiche("Le joueur humain a gagné.");
		else
			affiche("Partie nulle");
	}
	
	function min(m){
		var i,j,val;
		var morp;
		var evalMin = 1;
		if(estFini(m)){
			if(croixGagne(m))
				evalMin = 1;
			else if(rondGagne(m))
				evalMin = -1;
			else if(estPlein(m))
				evalMin = 0;
		}
		else {
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(m[i][j]==VIDE){
						morp = copieMorpion(m);
						morp[i][j] = ROND;
						val = max(morp);
						if(val<evalMin){
							evalMin = val;
						}
					}
				}
			}
		}
		return evalMin;
	}
	
	function max(m){
		var i,j,val;
		var morp;
		var evalMax = -1;
		if(estFini(m)){
			if(croixGagne(m))
				evalMax = 1;
			else if(rondGagne(m))
				evalMax = -1;
			else if(estPlein(m))
				evalMax = 0;
		}
		else {
			for(i=0;i<3;i++){
				for(j=0;j<3;j++){
					if(m[i][j]==VIDE){
						morp = copieMorpion(m);
						morp[i][j] = CROIX;
						val = min(morp);
						if(val>evalMax){
							evalMax = val;
						}
					}
				}
			}
		}
		return evalMax;
	}
	
	function coupOrdi(){
		var i,j,val;
		var m;
		var choixLigne;
		var choixColonne;
		var evalMax = -1;
		for(i=0;i<3;i++){
			for(j=0;j<3;j++){
				if(morpion[i][j]==VIDE){
					m = copieMorpion(morpion);
					m[i][j] = CROIX;
					val = min(m);
					if(val>evalMax){
						evalMax = val;
						choixLigne = i;
						choixColonne = j;
					}
				}
			}
		}
		affiche("l'ordi joue en ("+choixLigne+","+choixColonne+")");
		setTimeout(function(){
			morpion[choixLigne][choixColonne] = CROIX;
			majTabHTML();
			if(estFini(morpion)){
				finDePartie(morpion);
			}
			else {
				joueur = HUMAN;
				affiche("A l'humain de jouer");
			}
		},1000);
	}
	
	
	function initJeu(){
		var bouton = document.getElementById("debut");
		bouton.addEventListener("click",debutJeu,false);
		initTabHTML();
	}
	
	function debutJeu(){
		initTabJS();
		majTabHTML();
		joueur = HUMAN;
		affiche("Le joueur humain commence");
	}
	
	function affiche(ch){
		var p = document.getElementById("message");
		p.innerHTML = ch;
	}

	initJeu();
	
},false);