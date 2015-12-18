var Morpion = React.createClass({
getInitialState: function(){
	return {
		round: [],
		cross: [],
		table: [
			['','',''],
			['','',''],
			['','','']
		],
		player: 'round',
		output: '',
		win: 'false'
	};
},
play: function(id){
	return function(){
		var xy = id.split('-')
		var x = xy[0]
		var y = xy[1]
		var newTable = this.state.table
		if(newTable[x-1][y-1] != ''){
			this.setState({output: 'Ce coup n\'est pas permis'})
			return;                                
		}
		if(this.state.player == 'round'){
			newTable[x-1][y-1] = 'round'
			var val = this.state.round.concat([id])
			this.setState({round: val, player: 'cross', table: newTable, output: ''}) 
			this.checkWin('round', x-1, y-1)
		}
		if(this.state.player == 'cross'){
			newTable[x-1][y-1] = 'cross'
			var val = this.state.cross.concat([id])
			this.setState({cross: val, player: 'round', table: newTable, output: ''}) 
			this.checkWin('cross', x-1, y-1)   
		} 
	}.bind(this)
},
checkWin: function(player, posX, posY){
		if(this.state.table[posX][0] == this.state.table[posX][1] && this.state.table[posX][1] == this.state.table[posX][2] && this.state.table[posX][0] == this.state.table[posX][2]){
			this.setState({output: 'Le joueur '+player+' a gagné', win: 'true'})
		}
		if(this.state.table[0][posY] == this.state.table[1][posY] && this.state.table[1][posY] == this.state.table[2][posY] && this.state.table[0][posY] == this.state.table[2][posY]){
			this.setState({output: 'Le joueur '+player+' a gagné', win: 'true'})
		}
		if((this.state.table[0][0] == player && this.state.table[1][1] == player && this.state.table[2][2] == player) && (this.state.table[0][0] == this.state.table[1][1] && this.state.table[0][0] == this.state.table[2][2] && this.state.table[1][1] == this.state.table[2][2] )){
			this.setState({output: 'Le joueur '+player+' a gagné', win: 'true'})
		}
		 if((this.state.table[0][2] == player && this.state.table[1][1] == player && this.state.table[2][0] == player) && (this.state.table[0][2] == this.state.table[1][1] && this.state.table[0][2] == this.state.table[2][0] && this.state.table[1][1] == this.state.table[2][0])){
			 this.setState({output: 'Le joueur '+player+' a gagné', win: 'true'})
		 }
		 var res = 0
		 for(var i = 0; i < this.state.table.length; i++){
			for(var j = 0; j < 3; j++){
				if(this.state.table[i][j] != ''){
					res = res + 1
				}
			}
		 }
		if(res == 9){
			this.setState({output: 'Match nul', win: 'true'})
		}
		console.log(res)
},
Restart: function(){
	this.setState(this.getInitialState())
},
render: function(){
	return(
		 <div className="container">
			<div className="output">
					<p>{this.state.output}</p>
					{
						this.state.win == 'true' ? <button onClick={this.Restart}>Restart</button> : null
					}
			</div>
			{[1, 2, 3].map(function(x){
				return [1, 2, 3].map(function(y){
				var id = x+'-'+y

				var style = 'cell'
			
					if(this.state.table[x-1][y-1] == 'round'){
						style += " round"
					}
					if(this.state.table[x-1][y-1] == 'cross'){
						style += " cross"
					}
				return (
					<div className={style} id={id} onClick={this.play(id)}>
					</div>
				) 
			}.bind(this))}.bind(this))}
		 </div>
	);
}
});

ReactDOM.render(
	<Morpion />,
	document.getElementById('morpion')
);