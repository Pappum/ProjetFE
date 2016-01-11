var Memory = React.createClass({
	getInitialState: function(){
		return {
			table: this.generateCards(),
			player: '',
			score: '',
			backUrl: 'img/back.jpg',
			win: 'false',
			firstClick: true,
			firstCard: ''
		};
	},
	generateCards: function() {
		var finalArray = [
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', '']
		];
		var images = [];
		var cards = [];

		for (var i = 1 ; i < 9 ; i++) {
			images.push("img/0" + i + ".jpg");
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

			var modulo = i%4
			var division = i/4
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

			if (newTable[x][y].blocked == true) {
				alert('nein');
			}
			else {
				if(this.state.firstClick == true) {
					firstCardProps = newTable[x][y]

					newTable[x][y].isVisible = 1
					this.setState({firstClick: false, firstCard: firstCardProps, table: newTable})
				}
				else {
					newTable[x][y].isVisible = 1
					this.setState({firstClick: true, table: newTable})

					if(newTable[x][y].url == this.state.firstCard.url) {
						newTable[x][y].blocked = true;
						var PC = this.state.firstCard;
						PC.blocked = true;
						alert('champion');
					}
					else {
						newTable[x][y].isVisible = 0;
						var PC = this.state.firstCard;
						PC.isVisible = 0;
					}
				}
			}

			console.log(newTable[x][y]);

		}.bind(this)
	},
	render: function(){
		return(
			 <div className="container">
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
		);
	}
});

ReactDOM.render(
	<Memory />,
	document.getElementById('memory')
);