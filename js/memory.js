var Memory = React.createClass({
	getInitialState: function(){
		return {
			table: this.generateCards(0),
			player: 1,
			nbPlayer: '',
			nbShot: 0,
			level: '',
			score: 0,
			backUrl: 'img/back.jpg',
			clickCount: 0,
			highscores: [],
			firstCard: '',
			speed: 1000,
			started: false,
			timeElapsed : 0
		};
	},
	generateCards: function(level) {
		var caseLevel = Math.sqrt(parseInt(level));

		// Création du tableau de carte et mélange
		var finalArray = _.times(caseLevel, function(){
			return _.times(caseLevel, function(){return ''})
		})

		var images = [];
		var cards = [];

		var nbrImg = level / 2

		var idCards = [];
		for (var i = 1 ; i <= 33; i++) {
			idCards.push(i);
		}
		idCards = _.shuffle(idCards);

		for (var i = 1 ; i <= nbrImg; i++) {
			var id = idCards[i];
			images.push("img/" + id + ".jpg");
		}
		images = images.concat(images);
		images = _.shuffle(images);

		for (var i = 0 ; i < images.length ; i++) {
			cards.push({
				url: images[i],
				isVisible: false,
				blocked: false,
				playerWinCard: ''
			});

			var modulo = i%caseLevel
			var division = i/caseLevel
			var entierdivision = parseInt(division)
			finalArray[modulo][entierdivision] = cards[i]
		}
		return finalArray
	},
	clickTile: function(id) {
		cards[id].flipped = true;
	},
	play: function(x, y) {
		return function() {
			var newTable = this.state.table
			var firstCardProps

			// Si carte déjà retourné
			if (newTable[x][y].blocked == true || newTable[x][y] == this.state.firstCard) {
				return alert('impossible');
			}

			// Empêche clique sur une 3ème carte
			if (this.state.clickCount == 2) {
				return alert('attends');
			}

			// Retourne la 1ère carte
			if(this.state.clickCount == 0) {
				firstCardProps = newTable[x][y]

				newTable[x][y].isVisible = 1
				return this.setState({clickCount: 1, firstCard: firstCardProps, table: newTable})
			}
			
			newTable[x][y].isVisible = 1
			this.setState({clickCount: 2, table: newTable})

			// Si les deux cartes correspondent
			if(newTable[x][y].url == this.state.firstCard.url) {
				var PC = this.state.firstCard;

				newTable[x][y].blocked = true;
				PC.blocked = true;

				newTable[x][y].playerWinCard = this.state.player;
				PC.playerWinCard = this.state.player;

				var nbShot = this.state.nbShot;
				var time = this.state.timeElapsed;
				var scoreFinal = parseInt((time * 2) / (nbShot * 4) * 1000)

				this.setState({table: newTable, clickCount: 0, nbShot: nbShot+1, score: scoreFinal})
			}
			// Si elles ne correspondent pas
			else {
				var PC = this.state.firstCard;
				var nbShot = this.state.nbShot;
				var nbPlayer = this.state.nbPlayer;
				var self = this
				var player

				setTimeout(function() {
					newTable[x][y].isVisible = 0;
					PC.isVisible = 0;

					// Changement de joueur
					if(self.state.player == self.state.nbPlayer){

						if(self.state.nbPlayer == 1) {
							return self.setState({table: newTable, clickCount: 0, player: 1, firstCard: '', nbShot: nbShot+1})
						}

						return self.setState({table: newTable, clickCount: 0, player: 1, firstCard: ''})
						
					}

					var newPlayer = self.state.player + 1;
					self.setState({table: newTable, clickCount: 0, player: newPlayer, firstCard: ''})
					
					
				}, this.state.speed);

			}
			
		}.bind(this)
	},
	getScore: function(player) {
		// Score de chaque joueur
		var tableInOne = _.flatten(this.state.table, true);
		var tableScore = tableInOne.filter(
			function(obj) {
				if (obj.playerWinCard == player) {
					return true;
				} else {
					return false;
				}
			}
		);
		var score = tableScore.length / 2
		return score;
	},
	getAllFlipped: function() {
		// VICTOIRE !
		var tableInOne = _.flatten(this.state.table, true);
		var tableFlipped = tableInOne.filter(
			function(obj) {

				return obj.blocked == 1;
				
			}
		);
		if(tableFlipped.length != 0 && tableFlipped.length == tableInOne.length) {
			var winner
			if(this.state.nbPlayer == 1){
				winner = 'Score : '+this.state.score
				clearInterval(this.interval)
			}
			else{

				var scores = []
				for (var i = 1 ; i <= this.state.nbPlayer ; i++) {
					scores.push({
						'joueur': 'Gagnant : Joueur ' + i,
						'score': this.getScore(i)
					})
				};

				// Tableau des score trié
				var sortScores = _.sortBy(scores, function(o) { return o.scores; });

				// Récupère le score le plus haut
				var last = _.last(sortScores);

				// Vérification s'il y a une égalité ou non
				var verifDraw = sortScores.filter(function (a) { return a.scores == last.score });
				if(verifDraw.length > 1) {
					winner = 'Egalité';
				}
				else {
					winner = last.joueur;
				}
			}
	
			return winner;
		}
	},
	handleChangeLevel:function(e){
		this.setState({level: e.target.value, table: this.generateCards(e.target.value)});
	},
	handleChangeSpeed:function(e){
		this.setState({speed: e.target.value});
	},
	handleChangePlayer:function(e){
		this.setState({nbPlayer: e.target.value});
	},
	startGame:function(){
		// Sélection des paramètres et lancement du jeu
		var playerValue = this.refs.player.value; 
		var levelValue =  this.refs.level.value; 
		var speedValue =  this.refs.speedFlip.value; 

		if(playerValue != 0 && levelValue != 0 && speedValue != 0){
			this.setState({started: true});
			this.interval = setInterval(this.tick,1000)
		}else{
			alert('Sélectionnez tous les champs !');
		}

	},
	reStartGame:function(){
		this.setState({started:false, highscores:[], nbShot: 0, timeElapsed: 0});
	},
	saveScore:function(){
		var self = this;
		$.ajax({
			url: "http://localhost:3000/highscore?score="+this.state.score,
			method: "POST"
		}).done(function(){
			$.ajax({
				url: "http://localhost:3000/highscore",
				method: "GET"
			}).done(function(highscores){
				console.log(highscores)
				self.setState({highscores:highscores})
			})
		})
	},
	saveScorePhp:function(){
		var self = this;
		$.ajax({
			url: "php/save.php",
			data: {
                score : this.state.score,
            }
		}).done(function(){
			$.ajax({
				url: "php/list.php",
			}).done(function(data){
				var data = JSON.parse(data);
				self.setState({highscores: data})
			})
		}) 
	},
	tick: function() {
		this.setState({timeElapsed: this.state.timeElapsed+1})
	},
	componentWillUnmount: function(){
		clearInterval(this.interval)
	},

	render: function(){

		var options

		if(this.state.nbPlayer > 2){
			options = [36,64];
		}else{
			options = [16,36,64];
		}
		
		var optionJsx = options.map(function(level, i){
			return <option key={i} value={level}>{level}</option>
		})
			
		var menu = 	( 

			<div className="menu-wrapper">

				<span>Memory Game</span>

				{/* Choisir le nombre de joueur */}
				<div className="player">
					<select ref="player" onChange={this.handleChangePlayer} >
						<option value="0" defaultValue>Choisir le nombre de joueur</option>
						<option value="1">Un joueur</option>
						<option value="2">Deux joueurs</option>
						<option value="3">Trois joueurs</option>
						<option value="4">Quatre joueurs</option>
					</select>
				</div>

				{/* Choisir le niveaux de difficulté */}
				<div className="level">
						<select ref="level" onChange={this.handleChangeLevel} >
						<option value="0" defaultValue>Choisir le niveau</option>
						{optionJsx}
					</select>
				</div>

				{/* Choisir la vitesse du retournement des cartes */}
				<div className="speedFlip">
					<select ref="speedFlip" onChange={this.handleChangeSpeed} >
						<option value="0" defaultValue>Choisir la vitesse</option>
						<option value="1000">1000</option>
						<option value="500">500</option>
						<option value="250">250</option>
					</select>
				</div>

				{/* Lancer la partie */}
				<div className="playing">
					<input id="submit" type="submit" value="Play" onClick={this.startGame}/>
				</div>

			</div>

		)


		var jeu = (

			<div>
				{/* Affichage jeu */}
				<div className={'level-'+this.state.level +' '+this.state.started}>

				{this.state.table.map(function(_, x){
					return this.state.table[x].map(function(_, y){
					var id = x+'-'+y

					var src
					if (this.state.table[x][y].isVisible == 1) {
						src = this.state.table[x][y].url
					}
					else {
						src = this.state.backUrl
					}

					return (
						<div className='cell' id={id} onClick={this.play(x, y)}>
							<img src={src} />
						</div>
					)
				}.bind(this))}.bind(this))}
				</div>
			</div>
		)

		
		{/* Joueur en cours */}
		var player = (
			<p>Joueur en cours : {this.state.player}</p>
		)

		{/* Timer */}
		var time = (
			<p>Temps écoulé : {this.state.timeElapsed}s</p>
		)

		{/* Nombre de coups */}
		var nbShots = (
			<p>Nombre de coups : {this.state.nbShot}</p>
		)	

		var score = (
			<div>
				{/* Affichage score */}
				<div className={'score '+this.state.started}>

					{_.times(this.state.nbPlayer).map(i=>{
						return <p key={i}>Score joueur {i+1} = {this.getScore(i+1)}</p>;
					})}

					{/* Affiche joueur en cours */}
					{this.state.nbPlayer != 1 ? player : null}

					{/* Affichage Timer */}
					{this.state.nbPlayer == 1 ? time : null}

					{/* Affichage Nombre de coups */}
					{this.state.nbPlayer == 1 ? nbShots : null}

				</div>
			</div>
		)

		var highscoreJsx;
		var self = this;

		if(this.state.highscores.length > 0) {
			highscoreJsx = this.state.highscores.map(function(highscore,i){
				var style = self.state.score == highscore ? {backgroundColor:"red"} : {}
				return <li key={i} style={style}>{highscore}</li>;
			});
			highscoreJsx.unshift(<p key="highscore">Liste des scores :</p>);
		}
		else {
			highscoreJsx = <input type="submit" value="Enregistre ton score" onClick={this.saveScorePhp}/>
		}

		var resultat = (
			<div className={'resultat '+this.state.started}>
				<p>{this.getAllFlipped()}</p>
				<div id="result"></div>
				{this.state.nbPlayer == 1 ? highscoreJsx : null}

				<input type="submit" value="Nouvelle partie" onClick={this.reStartGame}/>
			</div>
		)

		return(
			<div className="container">

				{!this.state.started ? menu : null}

				{this.state.started ? score : null}	

				{this.state.started && this.getAllFlipped() ? resultat : null}	

				{this.state.started ? jeu : null}	
			
			 </div>
		);
	}
});

ReactDOM.render(
	<Memory />,
	document.getElementById('memory')
);