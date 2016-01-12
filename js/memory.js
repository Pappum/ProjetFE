var Memory = React.createClass({
	getInitialState: function(){
		return {
			table: this.generateCards(0),
			player: 1,
			level: '',
			score: '',
			backUrl: 'img/back.jpg',
			win: 'false',
			clickCount: 0,
			firstCard: '',
			speed: 1000
		};
	},
	generateCards: function(level) {
		var caseLevel

		if(level == 0) {
			caseLevel = 0
		}
		else if (level == 1) {
			caseLevel = 4
		}
		else if( level == 2) {
			caseLevel = 6
		}
		else if( level == 3){
			caseLevel = 8
		}

		var finalArray = _.times(caseLevel, function(){
			return _.times(caseLevel, function(){return ''})
		})

		var images = [];
		var cards = [];

		var nbrImg = (caseLevel * caseLevel) / 2

		for (var i = 1 ; i <= nbrImg; i++) {
			images.push("img/" + i + ".jpg");
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

			if (newTable[x][y].blocked == true || newTable[x][y] == this.state.firstCard) {
				alert('impossible');
			}
			else {
				if(this.state.clickCount == 0) {
					firstCardProps = newTable[x][y]

					newTable[x][y].isVisible = 1
					this.setState({clickCount: 1, firstCard: firstCardProps, table: newTable})
				}
				else if (this.state.clickCount == 2) {
					alert('attends');
				}
				else {
					newTable[x][y].isVisible = 1
					this.setState({clickCount: 2, table: newTable})

					if(newTable[x][y].url == this.state.firstCard.url) {
						var PC = this.state.firstCard;

						newTable[x][y].blocked = true;
						PC.blocked = true;

						newTable[x][y].playerWinCard = this.state.player;
						PC.playerWinCard = this.state.player;

						alert('champion');
						this.setState({table: newTable, clickCount: 0})
					}
					else {
						var PC = this.state.firstCard;
						var self = this
						var player
						setTimeout(function() {
							newTable[x][y].isVisible = 0;
							PC.isVisible = 0;
							self.state.player == 1 ? player = 2 : player = 1;
							self.setState({table: newTable, clickCount: 0, player: player, firstCard: ''})
						}, this.state.speed);
					}
				}
			}
		}.bind(this)
	},
	getScore: function(player) {
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
		var tableInOne = _.flatten(this.state.table, true);
		var tableFlipped = tableInOne.filter(
			function(obj) {
				if (obj.blocked == 1) {
					return true;
				} else {
					return false;
				}
			}
		);
		if(tableFlipped.length == 16) {
			var winner
			if(this.getScore(1) > this.getScore(2)) {
				winner = 'Joueur 1'
			}
			else if(this.getScore(1) == this.getScore(2)) {
				winner = 'Egalité'
			}
			else {
				winner = 'Joueur 2'
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
	render: function(){
		return(
			<div className="container">
				{/* Selection niveaux */}
				<div className="level">
					<select onChange={this.handleChangeLevel} >
						<option value="0" defaultValue>Choisir le niveau</option>
						<option value="1">16</option>
						<option value="2">36</option>
						<option value="3">64</option>
					</select>
				</div>

			{/* Selection vitesse de retournement */}
				<div className="speedFlip">
			 		<select onChange={this.handleChangeSpeed} >
						<option value="0" defaultValue>Choisir la vitesse</option>
						<option value="1000">1000</option>
						<option value="500">500</option>
						<option value="250">250</option>
					</select>
				</div>

				{/* Affichage score */}
				<div className="score">
					<p>Score joueur 1 = {this.getScore(1)}</p>
					<p>Score joueur 2 = {this.getScore(2)}</p>
					<p>All flipped : {this.getAllFlipped()}</p>
				</div>

				<div className={'level-'+this.state.level}>

			 	{/* Affichage jeu */}
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
		);
	}
});

ReactDOM.render(
	<Memory />,
	document.getElementById('memory')
);