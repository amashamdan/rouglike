/* GameArea component is the parent div, it has 3 children components: Dashboard, Maze, Information. */
var GameArea = React.createClass({
	getInitialState: function() {
		return ({health: 100,
				weapons: [
						{name: "Needle", damage: 2},
						{name: "Knife", damage: 5},
						{name: "Sword", damage: 8},
						{name: "Gun", damage: 11},
						{name: "Rifle", damage: 14},
						{name: "RBG", damage: 17}],
				dungeon: 1, selectedWeapon: "Needle", weaponDamage: 2, xp: 60, xpMultiplier: 1, level: 1, messageStatus: false,
				messages: {win: "Good for you! You beat the big boss.",
						loss: "Naaah... You got killed, get some practice and try again."},
				message: "", gameProgress: true, dark: true});
	},
	increaseHealth: function(increment = 20) {
		if (increment == 20) {
			this.setState({health: this.state.health + increment * this.state.dungeon});
		} else {
			this.setState({health: this.state.health + increment});
		}
	},
	upgradeWeapon: function() {
		this.setState({selectedWeapon: this.state.weapons[this.state.dungeon].name});
		this.setState({weaponDamage: this.state.weaponDamage + this.state.weapons[this.state.dungeon].damage});
	},
	incrementDungeon: function() {
		this.setState({dungeon: this.state.dungeon + 1});
	},
	updateXp: function() {
		if (this.state.xp - this.state.level * 10 > 0) {
			this.setState({xp: this.state.xp - this.state.level * 10});
		} else {
			var xpMultiplier = this.state.xpMultiplier + 1;
			/* Note that health is updated using the level value. The value value to update health will be the old one not the new one. */
			this.setState({xpMultiplier: xpMultiplier, xp: xpMultiplier * 60, level: this.state.level + 1, weaponDamage: this.state.weaponDamage + this.state.level * 2, health: this.state.health + this.state.level * 20});
		}
	},
	displayMessage: function(result) {
		document.body.style.overflow = "hidden";
		this.setState({gameProgress: false, messageStatus: true, message: this.state.messages[result]});
		this.setState({health: 100, dungeon: 1, selectedWeapon: "Needle", weaponDamage: 2, xp: 60, xpMultiplier: 1, level: 1, dark: true});
	},
	handleClick: function() {
		document.body.style.overflow = "auto";
		this.setState({gameProgress: true, messageStatus: false});
		this.refs['maze'].newGrid();
	},
	toggleLights: function() {
		this.setState({dark: !this.state.dark});
		this.refs['maze'].toggleTiles();
	},
	render: function() {
		return (
			<div>
				<h3>Roguelike Dungeon Crawler (ReactJS & Sass)</h3>
				<Dashboard health={this.state.health} weapon={this.state.selectedWeapon} dungeon={this.state.dungeon} attack={this.state.weaponDamage} xp={this.state.xp} level={this.state.level} toggleLights={this.toggleLights}/>
				<Maze ref="maze" health={this.state.health} increaseHealth={this.increaseHealth} upgradeWeapon={this.upgradeWeapon} incrementDungeon={this.incrementDungeon} dungeon={this.state.dungeon} weaponDamage={this.state.weaponDamage} updateXp={this.updateXp} displayMessage={this.displayMessage} gameProgress={this.state.gameProgress} dark={this.state.dark}/>
				<Information />
				<Message handleClick={this.handleClick} status={this.state.messageStatus} message={this.state.message} />
			</div>
		);
	}
});

/* This components contains stats and controls of the game. The stats include health, weapon used, attack power, level, XP points needed to reach nect level and the dungeon number. Controls include the button to toggle visibility. */
var Dashboard = React.createClass({
	render: function() {
		return (
			<div className="controls">
				<div className="control">Health: {this.props.health}</div>
				<div className="control">Weapon: {this.props.weapon}</div>
				<div className="control">Attack: {this.props.attack}</div>
				<div className="control">Level: {this.props.level}</div>
				<div className="control">XP to next level: {this.props.xp}</div>
				<div className="control">Dungeon: {this.props.dungeon}</div>
				<button onClick={this.props.toggleLights}>Toggle Lights</button>
			</div>
		);
	}
});

/* Maze component is contains the maze (all game elements.). */
var Maze = React.createClass({
	getInitialState: function() {
		var gridData = this.initializeGrid();
		var winAudio = new Audio('sounds/cheer.wav');
		var healthAudio = new Audio('sounds/collect-health.wav');
		var weaponAudio = new Audio('sounds/collect-weapon.wav');
		var stairsAudio = new Audio('sounds/stairs.wav');
		var loseAudio = new Audio('sounds/lose.wav');
		return ({squares: gridData[0], playerPosition: gridData[1], enemies: gridData[2], winAudio: winAudio, healthAudio: healthAudio, weaponAudio: weaponAudio, stairsAudio: stairsAudio, loseAudio: loseAudio});
	},
	newGrid: function() {
		var newGrid = this.initializeGrid();
		var squares = newGrid[0];
		var newXPosition = newGrid[1][0];
		var newYPosition = newGrid[1][1];
		var enemies = newGrid[2];
		document.getElementById("maze").scrollTop = (newXPosition - 15) * 15;
		this.setState({squares: squares, playerPosition: [newXPosition, newYPosition], enemies: enemies});
	},
	initializeGrid: function() {
		var width = 60;
		var height = 60;
		var squares = this.generateGrid(width, height);
		var elements = ["player", "stairs", "weapon"];
		for (var element in elements) {
			var itemData = this.generateItem(squares, width, height, elements[element]);
			squares = itemData[0];
			if (elements[element] == "player"){
				var playerPosition = itemData[1];
			}
		}
		var enemyData = this.generateEnemies(squares, width,height); 
		squares = enemyData[0];
		var enemies = enemyData[1];
		squares = this.generateHealth(squares, width,height);
		if (this.props.dark) {
			squares = this.playerVisibility(squares, playerPosition, width, height);
		}
		return [squares, playerPosition, enemies];
	},
	componentDidMount: function() {
		window.addEventListener('keydown', this.handlepress);
	},
	toggleTiles: function() {
		var squares = this.state.squares;
		/* props.dark is not updated */
		if (!this.props.dark) {
			squares = this.playerVisibility(squares, this.state.playerPosition, 60, 60);
		} else {
			for (var i = 0; i < 60; i++) {
				for (var k = 0; k < 60; k++) {
					var tile = squares[i][k].props.id;
					squares[i].splice(k, 1, <div key={[i, k]} id={tile}></div>)
				}
			}
		}
		this.setState({squares: squares});
	},
	playerVisibility: function(squares, playerPosition, width, height) {
		for (var i = 0; i < height; i++) {
			for (var k = 0; k < width; k++) {
				if (squares[i][k].props.className != "dark"){
					var tile = squares[i][k].props.id;
					squares[i].splice(k, 1, <div key={[i, k]} id={tile} className="dark"></div>);
				}		
			}
		}
		
		var row = playerPosition[0];
		var colomn = playerPosition[1];
		var c = 5;
		if (row - 5 < 0) {
			c -= Math.abs(row - 5);
		}
		for (var i = Math.max(0, row - 5); i <= Math.min(row + 5, 59); i++) {
			for (var k = Math.max(colomn - Math.abs(5 - Math.abs(c)), 0); k <= Math.min(colomn + Math.abs(5-Math.abs(c)), 59); k++) {
				var tile = squares[i][k].props.id;
				squares[i].splice(k, 1, <div key={[i, k]} id={tile}></div>)
			}
			c--;
		}

		return squares;
	},
	handlepress: function(e) {
		if (this.props.gameProgress) {
			/* To revent keyboard from scrolling. */
			e.preventDefault();
			var squares = this.state.squares;
			var playerXPosition = this.state.playerPosition[0];
			var playerYPosition = this.state.playerPosition[1];
			var newXPosition = playerXPosition; //in case the player won't move
			var newYPosition = playerYPosition; //
			var newPositionType;
			if (e.code == "ArrowUp") {
				var possibleNewXPosition = playerXPosition - 1;
				var possibleNewYPosition = playerYPosition;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
				if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
					if (playerXPosition < 45) {	
						/* must be -= 15 (not = -15). setting it to -15 means you're positiong at a fixed value. -=15 means you're taking the current poistion and moving 15 from there. */
						document.getElementById("maze").scrollTop -= 15;
					}
				}
			} else if (e.code == "ArrowDown") {
				var possibleNewXPosition = playerXPosition + 1;
				var possibleNewYPosition = playerYPosition;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
				if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
					if (playerXPosition > 15) {
						document.getElementById("maze").scrollTop += 15;
					}
				}
			} else if (e.code == "ArrowLeft") {
				var possibleNewXPosition = playerXPosition;
				var possibleNewYPosition = playerYPosition - 1;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
			} else if (e.code == "ArrowRight") {
				var possibleNewXPosition = playerXPosition;
				var possibleNewYPosition = playerYPosition + 1;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
			}
			if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
				squares = this.movePlayer(squares, playerXPosition, playerYPosition, possibleNewXPosition, possibleNewYPosition);
				newXPosition = possibleNewXPosition;
				newYPosition = possibleNewYPosition;
			} else if (newPositionType == "enemy") {
				var enemies = this.state.enemies
				for (var enemy in enemies) {
					if (enemies[enemy].location[0] == possibleNewXPosition && enemies[enemy].location[1] == possibleNewYPosition) {
						var attackedEnemy = enemies[enemy];
						var index = enemy;
					}
				}
				var attackAudio = new Audio('sounds/attack.wav');
				attackAudio.play();
				var attackResult = this.attackEnemy(attackedEnemy);
				if (attackResult === true) {
					squares = this.movePlayer(squares, playerXPosition, playerYPosition, possibleNewXPosition, possibleNewYPosition);
					newXPosition = possibleNewXPosition;
					newYPosition = possibleNewYPosition;
					this.props.updateXp();
				} else {
					enemies.splice(index, 1, attackResult);
				}
			} else if (newPositionType == "boss") {
				var attackAudio = new Audio('sounds/attack.wav');
				attackAudio.play();
				var boss = {enemyHealth: this.state.bossHealth};
				var attackBoss = this.attackEnemy(boss, "boss");
				if (attackBoss === true) {
					this.state.winAudio.play();
					this.props.displayMessage("win");
				} else {
					this.setState({bossHealth: attackBoss.enemyHealth});
				}
			}
			if (newPositionType == "health") {
				this.state.healthAudio.play();
				this.props.increaseHealth();
			} else if (newPositionType == "weapon") {
				this.state.weaponAudio.play();
				this.props.upgradeWeapon();
			} else if (newPositionType == "stairs") {
				this.state.stairsAudio.play();
				this.props.incrementDungeon();
				var newGrid = this.initializeGrid();
				squares = newGrid[0];
				newXPosition = newGrid[1][0];
				newYPosition = newGrid[1][1];
				var enemies = newGrid[2];
				/* Creates the enemis list in the new dungeon. It's not set at the last line of this method alongside squares and playerposition because we only need to change it when a new grid is created. */
				this.setState({enemies: enemies});
				document.getElementById("maze").scrollTop = (newXPosition - 15) * 15;
			}
			this.setState({squares: squares, playerPosition: [newXPosition, newYPosition]});
		}	
	},
	attackEnemy: function(attackedEnemy, char = "enemy") {
		if (attackedEnemy.enemyHealth - this.props.weaponDamage <= 0){
			return true;
		} else {
			if (char = "enemy") {
				var newPlayerHealth = this.props.health - Math.floor(5 * Math.random() + this.props.dungeon * 15);
			} else if (char = "boss") {
				var newPlayerHealth = this.props.health - Math.floor(5 * Math.random() + this.props.dungeon * 60);
			}
			
		if (newPlayerHealth <= 0) {
				this.state.loseAudio.play();
				this.props.displayMessage("loss");
			} else {
				this.props.increaseHealth(newPlayerHealth - this.props.health);
				attackedEnemy.enemyHealth -= this.props.weaponDamage;
				return attackedEnemy;		
			}	
		}
	},
	movePlayer: function(squares, playerXPosition, playerYPosition, newXPosition, newYPosition) {
		squares[playerXPosition].splice(playerYPosition, 1, <div key={[playerXPosition, playerYPosition]} id="room"></div>);
		squares[newXPosition].splice(newYPosition, 1, <div key={[newXPosition, newYPosition]} id="player"></div>);
		if (this.props.dark) {
			squares = this.playerVisibility(squares, [newXPosition, newYPosition], 60, 60);
		}
	
		return squares;
	},
	generateGrid: function(width, height) {
		var squares = [];	
		for (var i = 0; i < width; i++) {
			squares.push([]);
		}
		for (var i = 0; i < width; i++) {
			for (var k = 0; k < height; k++) {
				squares[i].push(<div key={[i, k]} id="wall"></div>)
			}
		}
		/* A METHOD FOR RANDOMLY GENERATING GRID 
		for (var i = 1; i < squares.length - 1; i++) {
			for (var k = 1; k < squares[i].length - 1; k++) {
				if (squares[i][k].props.id == "wall" && squares[i][k-1].props.id == "wall" && squares[i][k+1].props.id == "wall" && squares[i-1][k].props.id == "wall" && squares[i+1][k].props.id == "wall" && squares[i-1][k-1].props.id == "wall" && squares[i-1][k+1].props.id == "wall" && squares[i+1][k-1].props.id == "wall" && squares[i+1][k+1].props.id == "wall") {
					var roomWidth = Math.floor(Math.random() * 5 + 5);
					var roomHeight = Math.floor(Math.random() * 5 + 5);
					if (i + roomHeight < height && k + roomWidth < width) {
						for (var n = i; n < i+roomHeight; n++) {
							for (var m = k; m < k+roomWidth; m++) {
								squares[n].splice(m, 1, <div key={[n, m]} id="room"></div>);
							}
						}
					}
				} 
			}
		}
		
		for (var i = 1; i < squares.length - 1; i++) {
			for (var k = 1; k < squares[i].length - 1; k++) {
				if (squares[i - 1][k].props.id == "room" && squares[i + 1][k].props.id == "room") {
					if (Math.random() > 0.8) {
						squares[i].splice(k, 1, <div key={[i, k]} id="room"></div>);
					}
				} else if (squares[i][k-1].props.id == "room" && squares[i][k+1].props.id == "room") {
					if (Math.random() > 0.8) {
						squares[i].splice(k, 1, <div key={[i, k]} id="room"></div>);
					}
				}
			}
		}*/
		
		// ANOTHER METHOD FOR RANDOM GENERATION
		var counter = 20;
		var roomCenters = [];
		while (counter > 0) {
			/* In the if statement below, i and k start fron startPointX - 1. This is because we want to make sure that there is a wall right BEFORE this current room to avoid rooms with no wall between them. But if startPointX is 0, this will generate an error because we don't have a -1 index. So 1 is always added to random in startPointX generation to make sure we don't end up with such an error. */
			var startPointX = Math.floor(1 + Math.random() * 59);
			var startPointY = Math.floor(1 + Math.random() * 59);
			var roomWidth = Math.floor(Math.random() * 10 + 5);
			var roomHeight = Math.floor(Math.random() * 10 + 5);
			var overlap = false;
			if (startPointX + roomHeight < height && startPointY + roomWidth < width) {
				for (var i = startPointX - 1; i <= startPointX + roomHeight; i++) {
					for (var k = startPointY - 1; k <= startPointY + roomWidth; k++) {
						if (squares[i][k].props.id == "room") {
							overlap = true;
							break;
						}		
					}
				}
				if (!overlap) {
					for (var i = startPointX; i < startPointX + roomHeight; i++) {
						for (var k = startPointY; k < startPointY + roomWidth; k++) {
							squares[i].splice(k, 1, <div key={[i, k]} id="room"></div>);
						}
					}
					roomCenters.push([Math.floor((2 * startPointX + roomHeight) / 2), Math.floor((2 * startPointY + roomWidth) / 2)]);
					counter--;
				}
			}
		}
		/* point starts from 1 because room 0 doesn't have any preceeding room */
		for (var point = 1; point < roomCenters.length; point++) {
			var direction = Math.random();
			if (direction > 0.5) { //horizontal then vertical	
				this.buildHorTunnel(squares, roomCenters[point - 1], roomCenters[point]);
				this.buildVerTunnel(squares, roomCenters[point - 1], roomCenters[point]);
			} else { // vertical then horizontal
				this.buildVerTunnel(squares, roomCenters[point - 1], roomCenters[point]);
				this.buildHorTunnel(squares, roomCenters[point - 1], roomCenters[point]);
			}
		}
		return squares;
	},
	buildHorTunnel: function(squares, point1, point2) {
		for (var k = Math.min(point1[1], point2[1]); k <= Math.max(point1[1], point2[1]); k++) {
			squares[point1[0]].splice(k, 1, <div key={[point1[0], k]} id="room"></div>);
		}
		return squares;
	},
	buildVerTunnel: function(squares, point1, point2) {
		for (var k = Math.min(point1[0], point2[0]); k <= Math.max(point1[0], point2[0]); k++) {
			squares[k].splice(point2[1], 1, <div key={[k, point2[1]]} id="room"></div>);
		}
		return squares;
	},
	generateItem: function(squares, width, height, item) {
		var condition = true;
		while (condition) {
			var xPosition = Math.floor(Math.random() * width);
			var yPosition = Math.floor(Math.random() * height);
			if (squares[xPosition][yPosition].props.id == "room") {
				if (item == "player") {
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="player"></div>);
					/* Moving this to componentDidMount doesn't work, playerPosition wouldn't be defined yet */
					if (xPosition > 15) {
						window.onload = function() {
							document.getElementById("maze").scrollTop = (xPosition - 15) * 15;
						}
					}
					var playerXPosition = xPosition; //because xPosition will be overridden for weapon and stairs genetaion
					var playerYPosition = yPosition;
				} else if (item == "stairs" && this.props.dungeon < 5) {
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="stairs"></div>);
				} else if (item == "weapon") {
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="weapon"></div>);
				}
				condition = false;
			}
		}
		return [squares, [playerXPosition, playerYPosition]];
	},
	generateEnemies: function(squares, width, height) {
		var enemies = [];
		var enemiesToPlace = 5;
		while (enemiesToPlace > 0) {
			var enemyXPosition = Math.floor(Math.random() * width);
			var enemyYPosition = Math.floor(Math.random() * height);
			if (squares[enemyXPosition][enemyYPosition].props.id == "room") {
				squares[enemyXPosition].splice(enemyYPosition, 1, <div key={[enemyXPosition, enemyYPosition]} id="enemy"></div>);
				enemies.push({enemyHealth: (this.props.dungeon) * 15 + Math.floor(Math.random() * 5),
							location: [enemyXPosition, enemyYPosition]});
				enemiesToPlace--;
			}
		}
		/* To generate boss */
		if (this.props.dungeon == 5) {
			var bossCondition = true;
			while (bossCondition) {
				var bossXPosition = Math.floor(Math.random() * width);
				var bossYPosition = Math.floor(Math.random() * height);
				if (squares[bossXPosition][bossYPosition].props.id == "room" && squares[bossXPosition + 1][bossYPosition].props.id == "room" && squares[bossXPosition][bossYPosition + 1].props.id == "room" && squares[bossXPosition + 1][bossYPosition + 1].props.id == "room") {
					squares[bossXPosition].splice(bossYPosition, 2, <div key={[bossXPosition, bossYPosition]} id="boss"></div>, <div key={[bossXPosition, bossYPosition + 1]} id="boss"></div>);
					squares[bossXPosition + 1].splice(bossYPosition, 2, <div key={[bossXPosition + 1, bossYPosition]} id="boss"></div>, <div key={[bossXPosition + 1, bossYPosition + 1]} id="boss"></div>);
					bossCondition = false;
				}
			}
			var bossHealth = Math.floor(Math.random() * 50 + 350);
			this.setState({bossHealth: bossHealth});
		}
		return [squares, enemies];
	},
	generateHealth: function(squares, width, height) {
		var healthToPlace = 5;
		while (healthToPlace > 0) {
			var healthXPosition = Math.floor(Math.random() * width);
			var healthYPosition = Math.floor(Math.random() * height);
			if (squares[healthXPosition][healthYPosition].props.id == "room") {
				squares[healthXPosition].splice(healthYPosition, 1, <div key={[healthXPosition, healthYPosition]} id="health"></div>);
				healthToPlace--;
			}
		}
		return squares;
	},
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
			<ul className="information">
				<li>To win the game, find the boss in dungeon 5 and kill it.</li>
				<li>Look for the stairs to go to other dungeons.</li>
				<li>To beat the boss, you need to be an experienced fighter, kill enemies to gain more experience.</li>
				<li>Fighting enemies can be harmful, look for health items and collect them to recover.</li>
				<li>As you get closer to the boss, it becomes harder to kill enemies. You should always look for better weapons. There is one in each dungeon.</li>
				<li>If it's hard for you to find your way in the darkness, you can click Toggle Lights and take a peak.</li>
				<li>For more information visit <a href="https://github.com/amashamdan/rouglike" target="blank">this link.</a></li>
			</ul>
		);
	}
});

var Message = React.createClass({
	render: function() {
		if (this.props.status) {
			return (
				<div>
					<div className="layer">
					</div>
					<div className="message">
						<p>{this.props.message}</p>
						<button onClick={this.props.handleClick}>New Game</button>
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
});

ReactDOM.render(<GameArea />, document.getElementById("game"));