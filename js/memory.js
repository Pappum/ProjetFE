var Memory = React.createClass({
	getInitialState: function(){
		var card = {url: '../img/01.jpg', IsVisible: 1, blocked: 0, playerWinCard: ''};
		var card2 = {url: '../img/01.jpg', IsVisible: 0, blocked: 0, playerWinCard: ''};
		return {
			table: [
				[card, card2, card],
				[card, card, card],
				[card, card, card]
			],
			player: '',
			score: '',
			backUrl: '../img/back.jpg',
			win: 'false',
			FirstClick: '',
			FirstCard: ''
		};
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

var ar = Array.apply(null, Array(8)).map(Number.prototype.valueOf,0);
var urls = ar.map(function(_, i) {
	return '../img/0'+i+'.jpg'
})
console.log(urls)

ReactDOM.render(
	<Memory urls={urls}/>,
	document.getElementById('memory')
);