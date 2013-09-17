//trieda Puzzle
function Puzzle(xx, yy, empty) {
	this.oX = this.aX = xx;
	this.oY = this.aY = yy;
	this.empty = empty;
}
//miesanie puzzli
Array.prototype.shuffle = function() {
	/*var j, x, y, i;
	i = this.length-1;
	
	while (i) {
		j = parseInt(Math.random() * i);
		i -= 1;
		x = this[i].oX;
		y = this[i].oY;
		this[i].oX = this[j].oX;
		this[i].oY = this[j].oY;
		this[j].oX = x;
		this[j].oY = y;
	};	
	return this;*/
	var field, rand, exRand, change;
	field = count*count-1;	//prazdne policko - zaciatkom miesania
	
	for (var i=0;i<15*count;i++) {
		exRand = "";
		change = -1;
		while (change == -1) {
			rand = Math.ceil(Math.random()*4);
			if (exRand.indexOf(rand) == -1)  {
				switch(rand) {
					case 1:
						if (field+1 in this)
							change = field+1;
						break;
					case 2:
						if (field-1 in this)
						change = field-1;
						break;
					case 3:
						if (field+count in this)
						change = field+count;
						break;
					case 4:
						if (field-count in this)
						change = field-count;
						break;
				}
				exRand += rand;
			}
		}
		
		if (!this[change].empty) {				
			var hX;
			var hY;	
			hX = this[change].oX;
			hY = this[change].oY;
			this[change].oX = this[field].oX;
			this[change].oY = this[field].oY;
			this[change].empty = true;
			this[field].oX = hX;
			this[field].oY = hY;
			this[field].empty = false;
			field = change;
		}
	}
	
	return this;
}
//inicializacia hry
function initialize() {	
 	canvas = document.getElementById("canvas");
	timeBox = document.getElementById("timer");
	scoreBox = document.getElementById("score");
	stopIcon = document.getElementById("stopIcon");
	startIcon = document.getElementById("startIcon");	
	helpSection = document.querySelector("#middle article");
	
	width = canvas.width;
	height = canvas.height;
	
	count = 4;
	win = true;
	showHelp = true;
	showImage = 0;	
	level = 0;
	interval = "";
	
	Images = new Array(3);
	Images[0] = new Image();
	Images[0].src = "img/panda.jpg";
	Images[1] = new Image();
	Images[1].src = "img/bled.jpg";
	Images[2] = new Image();
	Images[2].src = "img/picasso.jpg";
	
	Scores = new Array(0,0,0);	
	
 	if (canvas.getContext){
    	ctx = canvas.getContext("2d");	
  	} else {
    	alert("Váš prehliadač nepodporuje potrebné funkcie pre fungovanie stránky.");
  	}
	
	Images[level].onload = function(){
		ctx.drawImage(Images[level], 0, 0);
	}
	
	canvas.onclick = function(e) {
		if (!win) {
			var x;
			var y;
			if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
			} else {
			x = e.clientX + document.body.scrollLeft +
					document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop +
					document.documentElement.scrollTop;
			}
			var page = document.getElementById("page");
			x -= page.offsetLeft + canvas.offsetLeft;
			y -= page.offsetTop + canvas.offsetTop;
			var policko = Math.floor(x/xx) + Math.floor(y/yy) * count;
			
			if (!Puzzles[policko].empty) {
				
				var hX;
				var hY;			
				var change = -1;
				
				//policko hore
				if (policko >= count && Puzzles[policko-count].empty)
					change = policko - count;
				//polickoa dolava	
				else if (policko % count > 0 && Puzzles[policko-1].empty)
					change = policko - 1;
				//policko doprava
				else if (policko % count < (count - 1) && Puzzles[policko+1].empty)
					change = policko + 1;
				//policko dole
				else
				if (policko < (count-1)*count && Puzzles[policko+count].empty)
					change = policko + count;
					
				if (change > -1) {
					hX = Puzzles[change].oX;
					hY = Puzzles[change].oY;
					Puzzles[change].oX = Puzzles[policko].oX;
					Puzzles[change].oY = Puzzles[policko].oY;
					Puzzles[change].empty = false;
					Puzzles[policko].oX = hX;
					Puzzles[policko].oY = hY;
					Puzzles[policko].empty = true;
					kresli();
				}
			}
		}
	}
}
//nacitanie rozmerov, priradenie casti obrazkov do jednotlivych puzziel
function loadDimension(){
	Puzzles = new Array(count*count);
	
	xx = width / count;
	yy = height / count;
	for (x=0;x<count;x++) {
		for (y=0;y<count;y++) {
			if (x+1 < count || y+1 < count)
				Puzzles[x+y*count] = new Puzzle(x*xx, y*yy, false);
			else
				Puzzles[x+y*count] = new Puzzle(x*xx, y*yy, true);
		}				
	}
	
	Puzzles.shuffle();
}
//vykreslovanie do canvasu
function kresli() {
	ctx.fillRect(0, 0, width, height);
	for (i=0;i<Puzzles.length;i++) {
		if (!Puzzles[i].empty)
			ctx.drawImage(Images[level], Puzzles[i].oX, Puzzles[i].oY, xx, yy, Puzzles[i].aX, Puzzles[i].aY, xx, yy);
	}
	win = true;
	for (i=0;i<Puzzles.length;i++) {
		if (Puzzles[i].oX != Puzzles[i].aX || Puzzles[i].oY != Puzzles[i].aY) {
			win = false;
			break;
		}
	}
	if (win) {
		var ss = (1800 - time - 60*showImage)*(count-2);
		alert("Gratulujem. Vaše skóre je " + ss +"!");
		if (ss > Scores[level])
			Scores[level] = ss;
		scoreBox.innerHTML = Scores[level];
		stopPlay();
	} else {
		ctx.beginPath();
		for (x=0;x<count;x++) {
			ctx.moveTo(x*xx, 0);
			ctx.lineTo(x*xx, height);
			ctx.moveTo(0, x*yy);
			ctx.lineTo(width, x*yy);
		}		
		ctx.moveTo(0, height);
		ctx.lineTo(width, height);
		ctx.lineTo(width, 0);
		ctx.strokeStyle = "#b8b8b8";
		ctx.stroke();		
	}
}
//zaciatok novej hry
function startPlay() {
	stopPlay();
	if (showHelp) {
		helpSection.className = "no";
		canvas.className = "";
		showHelp = false;
	}
	
	time = 0;
	showImage = 0;
	win = false;
	
	loadDimension();
	kresli();

	stopIcon.className = "";
	startIcon.className = "show";
	
	interval = setInterval(countTime,1000);
}
//zastavenie hry
function stopPlay() {	
	stopIcon.className = "show";
	startIcon.className = "";
	if (interval != "")
		clearInterval(interval);
}
//zobrazenie celeho obrazku
function fullImage() {
	if (!win) {
		showImage++;
		ctx.drawImage(Images[level], 0, 0);
		setTimeout(kresli,2000);
	}
}
//zmena urovne
function change(el,llevel) {
	stopPlay();
	if (showHelp) {
		helpSection.className = "no";
		canvas.className = "";
		showHelp = false;
	}
	var hrefs = document.querySelectorAll("#left img");
    for (var i = 0; i < hrefs.length; i++)
        hrefs[i].className = "";
	el.className = "selected";
	level = llevel-1;
	ctx.drawImage(Images[level], 0, 0);
	scoreBox.innerHTML = Scores[level];
}
//zmena poctu puzzli
function changeDimension(elem) {
	stopPlay();
	count = Number(elem.value);
	ctx.drawImage(Images[level], 0, 0);
}
//pocitanie casu
function countTime() {
	var help = 0;
	var minutes = "00";
	var seconds = "00";
	help = Math.floor(time/60);
	if (help < 10)
		minutes = "0" + help;
	else
		minutes = help;
	help = time%60;
	if (help < 10)
		seconds = "0" + help;
	else
		seconds = help;
	timeBox.innerHTML = minutes + ":" + seconds;
	time++;
}
//zobrazenie napovedy, uvodnej stranky
function help() {
	if (showHelp) {
		canvas.className = "";
		helpSection.className = "no";
		showHelp = false;
	} else {
		canvas.className = "no";
		helpSection.className = "";
		showHelp = true;
	}
}