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
		document.getElementById("maze").scrollTop = 375;
	},
	scrollUp: function() {
		document.getElementById("maze").scrollTop = -375;
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
		var squares = [];	
		for (var i = 0; i < width; i++) {
			squares.push([]);
		}
		for (var i = 0; i < width; i++) {
			for (var k = 0; k < height; k++) {
				squares[i].push(<div key={[i, k]} className="empty">{i}, {k}</div>)
			}
		}

		for (var i = 3; i < 13; i++) {
			for (var k = 3; k < 13; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}	

		for (var i = 14; i < 20; i++) {
			for (var k = 3; k < 8; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 21; i < 27; i++) {
			for (var k = 5; k < 20; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 1; i < 8; i++) {
			for (var k = 14; k < 21; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 9; i < 20; i++) {
			for (var k = 14; k < 24; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 4; i < 11; i++) {
			for (var k = 25; k < 30; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 8; i < 15; i++) {
			for (var k = 31; k < 45; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 2; i < 10; i++) {
			for (var k = 46; k < 54; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 16; i < 26; i++) {
			for (var k = 25; k < 34; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 16; i < 27; i++) {
			for (var k = 35; k < 45; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 28; i < 37; i++) {
			for (var k = 14; k < 24; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 28; i < 33; i++) {
			for (var k = 25; k < 37; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 28; i < 40; i++) {
			for (var k = 38; k < 44; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 38; i < 44; i++) {
			for (var k = 9; k < 19; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 38; i < 49; i++) {
			for (var k = 25; k < 37; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 41; i < 46; i++) {
			for (var k = 38; k < 50; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 41; i < 57; i++) {
			for (var k = 51; k < 58; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 47; i < 55; i++) {
			for (var k = 41; k < 50; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 50; i < 55; i++) {
			for (var k = 27; k < 34; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		for (var i = 45; i < 51; i++) {
			for (var k = 16; k < 24; k++) {
				squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
			}
		}

		var passages = [[5, 13], [13, 5], [12, 13], [9,24], [20, 17], [10, 30], [9, 45], [15, 32], [15, 44], [27, 41], [30, 37], [19, 24], [39, 37], [32, 24], [37, 15], [44, 16], [49, 30], [45, 37], [43, 50], [54, 50]];
		for (var point in passages) {
			squares[passages[point][0]].splice(passages[point][1], 1, <div key={[passages[point][0], passages[point][1]]} className="passage"></div>);
		}
		/* A METHOD FOR GENERATING GRID 
		for (var i = 1; i < squares.length - 1; i++) {
			for (var k = 1; k < squares[i].length - 1; k++) {
				if (squares[i][k].props.className == "empty" && squares[i][k-1].props.className == "empty" && squares[i][k+1].props.className == "empty" && squares[i-1][k].props.className == "empty" && squares[i+1][k].props.className == "empty" && squares[i-1][k-1].props.className == "empty" && squares[i-1][k+1].props.className == "empty" && squares[i+1][k-1].props.className == "empty" && squares[i+1][k+1].props.className == "empty") {
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
		/* ANOTHER METHOD
		var grid = [[5,5], [5, 15], [5, 25], [5, 35], [5, 45], [5, 55],
					[15,5], [15, 15], [15, 25], [15, 35], [15, 45], [15, 55],
					[25,5], [25, 15], [25, 25], [25, 35], [25, 45], [25, 55],
					[35,5], [35, 15], [35, 25], [35, 35], [35, 45], [35, 55],
					[45,5], [45, 15], [45, 25], [45, 35], [45, 45], [45, 55],
					[55,5], [55, 15], [55, 25], [55, 35], [55, 45], [55, 55]];

		for (var point in grid) {
			var roomWidth = Math.floor(Math.random() * 2 + 3);
			var roomHeight = Math.floor(Math.random() * 2 + 3); 
			for (var i = grid[point][0] - roomHeight; i < grid[point][0] + roomHeight; i++) {
				for (var k = grid[point][1] - roomWidth; k < grid[point][1] + roomWidth; k++) {
					squares[i].splice(k, 1, <div key={[i, k]} className="room"></div>);
				}
			}
		}

		for (var point in grid) {
			if (grid[point][0] == 5 && grid[point][1] == 5) { /* grid[point] == [5,5] doesn't work */
		/*		if (Math.random() > 0.5) {
					for (var k = 5; k < 15; k++) {
						squares[5].splice(k, 1, <div key={[5, k]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) {
					for (var i = 5; i < 15; i++) {
						squares[i].splice(5, 1, <div key={[i, 5]} className="room"></div>);		
					}
				}
			} else if (grid[point][0] == 5 && grid[point][1] == 55) {
				if (Math.random() > 0.5) {
					for (var k = 55; k > 45; k--) {
						squares[5].splice(k, 1, <div key={[5, k]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) {
					for (var i = 5; i < 15; i++) {
						squares[i].splice(55, 1, <div key={[i, 55]} className="room"></div>);		
					}
				}
			} else if (grid[point][0] == 55 && grid[point][1] == 5){
				if (Math.random() > 0.5) {
					for (var k = 5; k < 15; k++) {
						squares[55].splice(k, 1, <div key={[5, k]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) {
					for (var i = 55; i > 45; i--) {
						squares[i].splice(5, 1, <div key={[i, 5]} className="room"></div>);		
					}
				}
			} else if (grid[point] == [55, 55]) {
				if (Math.random() > 0.5) {
					for (var k = 55; k > 45; k--) {
						squares[55].splice(k, 1, <div key={[55, k]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) {
					for (var i = 55; i > 45; i--) {
						squares[i].splice(55, 1, <div key={[i, 55]} className="room"></div>);		
					}
				}
			} else if (grid[point][0] == 5) {
				if (Math.random() > 0.5) {
					for (var k = grid[point][1]; k < grid[point][1] + 10; k++) { /* right */
			/*			squares[5].splice(k, 1, <div key={[5, k]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) { /* down */
			/*		for (var i = 5; i < 15; i++) {
						squares[i].splice(grid[point][1], 1, <div key={[i, grid[point][1]]} className="room"></div>);		
					}
				}
				if (Math.random() > 0.5) {
					for (var k = grid[point][1]; k < grid[point][1] - 15; k--) { /* right */
			/*			squares[5].splice(k, 1, <div key={[5, k]} className="room"></div>);		
					}
				}
			} else if (grid[point][0] == 55) {

			} else if (grid[point][1] == 5) {

			} else if (grid[point][1] == 55) {

			} else {

			}
		}*/



		/* irrelevant to any method
		if (squares[5][5].props.className == "room") {
			console.log("Room detected");
		}*/
		/* ANOTHER METHOD
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
		return ({squares: squares});
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