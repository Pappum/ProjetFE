var Memory = React.createClass({
	getInitialState: function(){
		// var card = {url: '../img/01.jpg', IsVisible: 1, blocked: 0, playerWinCard: ''};
		// var card2 = {url: '../img/01.jpg', IsVisible: 0, blocked: 0, playerWinCard: ''};
		// this.generateCards()
		return {
			table: this.generateCards(),
			player: '',
			score: '',
			backUrl: '../img/back.jpg',
			win: 'false',
			FirstClick: '',
			FirstCard: ''
		};
	},
	generateCards: function() {
		var cards = [];
		var finalArray = [
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', '']
		];

		var images = [];
		for (var i = 1 ; i < 9 ; i++) {
			images.push("../img/0" + i + ".jpg");
		}
		images = images.concat(images);
		images = _.shuffle(images);

		for (var i = 0 ; i < images.length ; i++) {
			cards.push({
				url: images[i],
				IsVisible: 1,
				blocked: 0,
				playerWinCard: ''
			});

			var modulo = i%4
			var division = i/4
			var entierdivision = parseInt(division)
			finalArray[modulo][entierdivision] = cards[i]
		}
		return finalArray
	},
	play: function(x, y) {
		return function() {
			var newTable = this.state.table
			console.log(newTable[x][y])
			if(newTable[x][y].IsVisible == 0) {
				newTable[x][y].IsVisible = 1
				this.setState({table: newTable})
				console.log(newTable[x][y])
			}
			else {
				newTable[x][y].IsVisible = 0
				this.setState({table: newTable})
				console.log(newTable[x][y])
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
					if (this.state.table[x][y].IsVisible == 1) {
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