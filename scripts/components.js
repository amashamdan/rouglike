/* GameArea component is the parent div, it has 3 children components: Dashboard, Maze, Information. */
var GameArea = React.createClass({
	render: function() {
		return (
			<div>
				<h3>Roguelike Dungeon Crawler (ReactJS & Sass)</h3>
				<Dashboard />
				<Maze />
				<Information />
			</div>
		);
	}
});

/* This components contains stats and controls of the game. The stats include health, weapon used, attack power, level, XP points needed to reach nect level and the dungeon number. Controls include the button to toggle visibility. */
var Dashboard = React.createClass({
	lightsClick: function() {
		console.log('fff');
		//document.getElementById("maze").scrollTop = 10;
	},
	scrollDown: function() {
		document.getElementById("maze").scrollTop = 450;
	},
	scrollUp: function() {
		document.getElementById("maze").scrollTop = -450;
	},
	render: function() {
		return (
			<div className="controls">
				<div className="control">Health: 100</div>
				<div className="control">Weapon: Stick</div>
				<div className="control">Attack: 7</div>
				<div className="control">Level: 0</div>
				<div className="control">XP to next level: 60</div>
				<div className="control">Dungeon: 0</div>
				<button>Turn lights on</button>
				<button onClick={this.scrollUp}>Scroll Up</button>
				<button onClick={this.scrollDown}>Scroll Down</button>
			</div>
		);
	}
});

/* Maze component is contains the maze (all game elements.). */
var Maze = React.createClass({
	getInitialState: function() {
		var width = 60;
		var height = 60;
		var squares = this.generateGrid(width, height);
		squares = this.generatePlayer(squares, width, height);

		return ({squares: squares});
	},
	generateGrid: function(width, height) {
		var squares = [];	
		for (var i = 0; i < width; i++) {
			squares.push([]);
		}
		for (var i = 0; i < width; i++) {
			for (var k = 0; k < height; k++) {
				squares[i].push(<div key={[i, k]} className="wall">{i}, {k}</div>)
			}
		}

		var rooms = [{room: 0, rowStart: 3, rowEnd: 13, colomnStart: 3, colomnEnd: 13},
					{room: 1, rowStart: 14, rowEnd: 20, colomnStart: 3, colomnEnd: 8},
					{room: 2, rowStart: 21, rowEnd: 27, colomnStart: 5, colomnEnd: 20},
					{room: 3, rowStart: 1, rowEnd: 8, colomnStart: 14, colomnEnd: 21},
					{room: 4, rowStart: 9, rowEnd: 20, colomnStart: 14, colomnEnd: 24},
					{room: 5, rowStart: 4, rowEnd: 11, colomnStart: 25, colomnEnd: 30},
					{room: 6, rowStart: 8, rowEnd: 15, colomnStart: 31, colomnEnd: 45},
					{room: 7, rowStart: 2, rowEnd: 10, colomnStart: 46, colomnEnd: 54},
					{room: 8, rowStart: 16, rowEnd: 26, colomnStart: 25, colomnEnd: 34},
					{room: 9, rowStart: 16, rowEnd: 27, colomnStart: 35, colomnEnd: 45},
					{room: 10, rowStart: 28, rowEnd: 37, colomnStart: 14, colomnEnd: 24},
					{room: 11, rowStart: 28, rowEnd: 33, colomnStart: 25, colomnEnd: 37},
					{room: 12, rowStart: 28, rowEnd: 40, colomnStart: 38, colomnEnd: 44},
					{room: 13, rowStart: 38, rowEnd: 44, colomnStart: 9, colomnEnd: 19},
					{room: 14, rowStart: 38, rowEnd: 49, colomnStart: 25, colomnEnd: 37},
					{room: 15, rowStart: 41, rowEnd: 46, colomnStart: 38, colomnEnd: 50},
					{room: 16, rowStart: 41, rowEnd: 57, colomnStart: 51, colomnEnd: 58},
					{room: 17, rowStart: 47, rowEnd: 55, colomnStart: 41, colomnEnd: 50},
					{room: 18, rowStart: 50, rowEnd: 55, colomnStart: 27, colomnEnd: 34},
					{room: 19, rowStart: 45, rowEnd: 51, colomnStart: 16, colomnEnd: 24}];

		for (var room in rooms) {
			for (var i = rooms[room].rowStart; i < rooms[room].rowEnd; i++) {
				for (var k = rooms[room].colomnStart; k < rooms[room].colomnEnd; k++) {
					squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
				}
			}			
		}

		var passages = [[5, 13], [13, 5], [12, 13], [9,24], [20, 17], [10, 30], [9, 45], [15, 32], [15, 44], [27, 41], [30, 37], [19, 24], [39, 37], [32, 24], [37, 15], [44, 16], [49, 30], [45, 37], [43, 50], [54, 50]];
		for (var point in passages) {
			squares[passages[point][0]].splice(passages[point][1], 1, <div key={[passages[point][0], passages[point][1]]} className="passage"></div>);
		}
		/* A METHOD FOR RANDOMLY GENERATING GRID 
		for (var i = 1; i < squares.length - 1; i++) {
			for (var k = 1; k < squares[i].length - 1; k++) {
				if (squares[i][k].props.className == "wall" && squares[i][k-1].props.className == "wall" && squares[i][k+1].props.className == "wall" && squares[i-1][k].props.className == "wall" && squares[i+1][k].props.className == "wall" && squares[i-1][k-1].props.className == "wall" && squares[i-1][k+1].props.className == "wall" && squares[i+1][k-1].props.className == "wall" && squares[i+1][k+1].props.className == "wall") {
					var roomWidth = Math.floor(Math.random() * 5 + 5);
					var roomHeight = Math.floor(Math.random() * 5 + 5);
					if (i + roomHeight < height && k + roomWidth < width) {
						for (var n = i; n < i+roomHeight; n++) {
							for (var m = k; m < k+roomWidth; m++) {
								squares[n].splice(m, 1, <div key={[n, m]} className="room"></div>);
							}
						}
					}
				} 
			}
		}
		
		for (var i = 1; i < squares.length - 1; i++) {
			for (var k = 1; k < squares[i].length - 1; k++) {
				if (squares[i - 1][k].props.className == "room" && squares[i + 1][k].props.className == "room") {
					if (Math.random() > 0.8) {
						squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
					}
				} else if (squares[i][k-1].props.className == "room" && squares[i][k+1].props.className == "room") {
					if (Math.random() > 0.8) {
						squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
					}
				}
			}
		}*/
		
		/* ANOTHER METHOD FOR RANDOM GENERATION
		var counter = 40;
		while (counter >= 0) {
			var startPointX = Math.floor(Math.random() * 60);
			var startPointY = Math.floor(Math.random() * 60);
			var roomWidth = Math.floor(Math.random() * 5 + 5);
			var roomHeight = Math.floor(Math.random() * 5 + 5);
			if (startPointX + roomWidth < width && startPointY + roomHeight < height) {
				for (var i = startPointY; i < startPointY + roomHeight; i++){
					for (var k = startPointX; k < startPointX + roomWidth; k++){
						squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
					}
				}
				counter--;
			}
		}
		
		for (var i = 9; i < 59; i = i+10) {
			for (var  k = 9; k < 50; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 9; i < 59; i = i+10) {
			for (var  k = 9; k < 50; k++) {
				squares[k].splice(i, 1, <div key={[i, k]} className="room"></div>);
			}
		}	
		*/		
		return squares;
	},
	generatePlayer: function(squares, width, height) {
		var condition = true;
		var dd = document.getElementById("maze");
		while (condition) {
			var playerXPosition = Math.floor(Math.random() * width);
			var playerYPosition = Math.floor(Math.random() * height);
			if (squares[playerXPosition][playerYPosition].props.className == "room") {
				squares[playerXPosition].splice(playerYPosition, 1, <div key={[playerXPosition, playerYPosition]} className="player"></div>);
				condition = false;
			}
		}
		if (playerXPosition > 15) {
			window.onload = function() {
				document.getElementById("maze").scrollTop = (playerXPosition - 15) * 15;
			}
		}
		return squares;
	},
	/*componentDidMount: function() {
		console.log("FFF");
		document.getElementById("maze").scrollTop = 500;
	},*/
	render: function() {
		return (
			<div id="maze">
				{this.state.squares}
			</div>
		);
	}
});

/* This component contains information and instructions for the game. */
var Information = React.createClass({
	render: function() {
		return (
			<ul>
				<li>Kill the boss in dungeon 4, the boss is the giant red square.</li>
				<li>More info will be added.</li>
			</ul>
		);
	}
})

ReactDOM.render(<GameArea />, document.getElementById("game"));