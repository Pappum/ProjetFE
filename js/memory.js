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

			var firstCardUrl = newTable[x][y].url

			if(this.state.firstClick == true) {
				firstCardUrl = newTable[x][y].url

				newTable[x][y].isVisible = 1
				this.setState({firstClick: false, firstCard: firstCardUrl, table: newTable})
			}
			else {
				
				newTable[x][y].isVisible = 0
				this.setState({firstClick: true, isVisible: 0, table: newTable})

			console.log(newTable[x][y])

			if(newTable[x][y].IsVisible == 0) {
				newTable[x][y].IsVisible = 1
				this.setState({table: newTable})
				//console.log(newTable[x][y])
			}
			else {
				alert('Vous avez déjà retourné cette carte !');
			}

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