/* GameArea component is the parent div, it has 4 children components: Dashboard, Maze, Information, and Message. */
var GameArea = React.createClass({
	/* Contains default values for many variables. Default health, dungeon, XP, level values, weaponDamage.
	Weapons array contains list of weapons and how much damage it adds when picked up.
	xpMultiplier is multiplier for experience points earned after killing an enemy, this number increases with increasing level.
	messageStatus controls the display of Message component, initiallt false.
	messages is an object containing the win and loss messages.
	gameProgress is used to stop accepting keyboard presses, set to false when game is over or won.
	dark specifies whether the game is being played in dark mode or not. */
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
	/* This method by default increases health by 20 when health items are picked up. It also increases health when level increases and decreases the health when attacking enemies. */
	increaseHealth: function(increment = 20) {
		if (increment == 20) {
			this.setState({health: this.state.health + increment * this.state.dungeon});
		} else {
			this.setState({health: this.state.health + increment});
		}
	},
	/* Called when a weapon is picked up, it displays the new weapon's name and increases the damage. */
	upgradeWeapon: function() {
		/* Each dungeon has a specific weapon that can be picked up, so the dungeon namber is used to pick the weapon from the weapons array. */
		this.setState({selectedWeapon: this.state.weapons[this.state.dungeon].name});
		/* The damage of the selected weapon is added to weaponDamage. */
		this.setState({weaponDamage: this.state.weaponDamage + this.state.weapons[this.state.dungeon].damage});
	},
	/* This method increases the dungeon number displayed on the Dashboard. */
	incrementDungeon: function() {
		this.setState({dungeon: this.state.dungeon + 1});
	},
	/* When the player kills an enemy, the experience points needed to the next level are reduced. This method handles that. */
	updateXp: function() {
		/* The number of experience points earned depends on the level, if the earned points subtracted from the current XP is higher than zero, xp is updated to the new value. */
		if (this.state.xp - this.state.level * 10 > 0) {
			this.setState({xp: this.state.xp - this.state.level * 10});
		/* If earned points subtracted from the current XP is less than zero, which means that the player made it to a new level. */
		} else {
			/* The xpMultiplier is increased. */
			var xpMultiplier = this.state.xpMultiplier + 1;
			/* xp is set depending on the xpMultiplier, level is increased, weaponDamage is increased which depends on the level. Health is also increased depending on the level number.
			Note that health is updated using the level value. The value to update health will be the old one not the new one. */
			this.setState({xpMultiplier: xpMultiplier, xp: xpMultiplier * 60, level: this.state.level + 1, weaponDamage: this.state.weaponDamage + this.state.level * 2, health: this.state.health + this.state.level * 20});
		}
	},
	/* The method shows the Win or Loss meesage when the game is over. It also resets some value to prepare for a new game. result is a string ("win" or "loss") to decide what message to display. */
	displayMessage: function(result) {
		/* Scrolling is disabled. */
		document.body.style.overflow = "hidden";
		/* gameProgress: false makes sure keyboard presses are not responded to until a new game starts. messageStatus set to true to display the message. message property is set to the message to be displayed. */
		this.setState({gameProgress: false, messageStatus: true, message: this.state.messages[result]});
		/* Default values are restored to prepare for a new game. */
		this.setState({health: 100, dungeon: 1, selectedWeapon: "Needle", weaponDamage: 2, xp: 60, xpMultiplier: 1, level: 1, dark: true});
	},
	/* This method handles the "New Game" button click. */
	handleClick: function() {
		/* Scrolling is restored. gameProgress set back to true. messageStatus set to false to hide message. newGrid method in Maze is called using refs. */
		document.body.style.overflow = "auto";
		this.setState({gameProgress: true, messageStatus: false});
		this.refs['maze'].newGrid();
	},
	/* Handles "Toggle Lights" button click. */
	toggleLights: function() {
		/* The status pf dark is reversed. */
		this.setState({dark: !this.state.dark});
		/* toggleTiles method in Maze is called to set the tiles to black. */
		this.refs['maze'].toggleTiles();
	},
	/* render method for GameArea. */
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
	/* This component only has one method, render. All elements display value passed from GameArea as props. The button calls toggleLights method in GameArea. */
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

/* Maze component is contains the grid and all game elements. */
var Maze = React.createClass({
	getInitialState: function() {
		/* initializeGrid methed is called. It returns the player position and the squares. The grid is divided into squares (60x60) each square can be a wall, room, enemy, weapon, health, stairs or player. All these data are saved in squares. Also, an array containing enemies locations is returned. */
		var gridData = this.initializeGrid();
		/* Audio files are loaded, they are saved in the state to be called whenever neede. */
		var winAudio = new Audio('sounds/cheer.wav');
		var healthAudio = new Audio('sounds/collect-health.wav');
		var weaponAudio = new Audio('sounds/collect-weapon.wav');
		var stairsAudio = new Audio('sounds/stairs.wav');
		var loseAudio = new Audio('sounds/lose.wav');
		/* enemies is an array containing all enemies locations. playerPosition is an array containing row and colomn numbers. squares is an array of tiles. */
		return ({squares: gridData[0], playerPosition: gridData[1], enemies: gridData[2], winAudio: winAudio, healthAudio: healthAudio, weaponAudio: weaponAudio, stairsAudio: stairsAudio, loseAudio: loseAudio});
	},
	/* This method creates the main grid, it calls other methods that generate elements of the game. */
	initializeGrid: function() {
		/* Width and height are set to 60 squares. */
		var width = 60;
		var height = 60;
		/* generateGrid method is called. This method generates a random maze (rooms and tunnels connecting them). The method return an array which is saved into squares. Each element in the array is a div element representing a square on the grid. */
		var squares = this.generateGrid(width, height);
		/* This array will be looped through to generate a player, a stairs, and an element. The stairs takes the player to new dungeons. */
		var elements = ["player", "stairs", "weapon"];
		for (var element in elements) {
			/* generateItem is called with each element in elements and returns a new squares arrays which is saved into squares (after a plaer is generated for example, the squares array is updated.). */
			var itemData = this.generateItem(squares, width, height, elements[element]);
			squares = itemData[0];
			/* If the element generated is player, the player position is returned and saved. */
			if (elements[element] == "player"){
				var playerPosition = itemData[1];
			}
		}
		/* Next, enemies are generated using generateEnemies method, squares array is updated again. */
		var enemyData = this.generateEnemies(squares, width,height); 
		squares = enemyData[0];
		/* enemies contains locations of all enemies, it is also returned from generateEnemies method. */
		var enemies = enemyData[1];
		/* Health items are generated using generateHealth method and squared is updated once more. */
		squares = this.generateHealth(squares, width,height);
		/* If dark mode is on, playerVisibility method is called to give the squares a black color. */
		if (this.props.dark) {
			squares = this.playerVisibility(squares, playerPosition, width, height);
		}
		return [squares, playerPosition, enemies];
	},
	/* This method generates 20 rooms random in size and position, and then generates tunnels connecting rooms to ensure reachability. There are two algorithms to generate maze, one is commented out but left here to be used if desired. */
	generateGrid: function(width, height) {
		/* squares array is initialized. */
		var squares = [];
		/* This will be a two dimensional array to ease accessing its elements. first empty arrays are pushed into squares. */
		for (var i = 0; i < width; i++) {
			squares.push([]);
		}
		/* Now two nested loops populate the squares array with elements which all represent walls (no room and tunnels exist yet). */
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
		/* Counter controls the number of the rooms to be randomly generated. */
		var counter = 20;
		/* roomCenters is an array of arrays and will hold the center of each room which is needed for tunnels generation. */
		var roomCenters = [];
		/* The while loop keep running until 20 rooms are generated. */
		while (counter > 0) {
			/* For each room, a starting point is randomly generated as well as its size (random in terms of width and height). */
			/* In the if statement below, i and k start fron startPointX - 1. This is because we want to make sure that there is a wall right BEFORE this current room to avoid rooms with no wall between them. But if startPointX is 0, this will generate an error because we don't have a -1 index. So 1 is always added to random in startPointX generation to make sure we don't end up with such an error. */
			var startPointX = Math.floor(1 + Math.random() * 59);
			var startPointY = Math.floor(1 + Math.random() * 59);
			var roomWidth = Math.floor(Math.random() * 10 + 5);
			var roomHeight = Math.floor(Math.random() * 10 + 5);
			/* The overlap variable indicates whether 2 generated rooms are overlapping or not. */
			var overlap = false;
			/* The if statement ensures that the room will not go out of the maze, when the dimensions are added to the starting point, the room should fall within the borders of the maze. */
			if (startPointX + roomHeight < height && startPointY + roomWidth < width) {
				/* If the condition is met, the nested loops loop over the squares which the new room should consist of. If one the squares already has a room (figured out using the id of the square), overlap is set to true and the room is not built. */
				for (var i = startPointX - 1; i <= startPointX + roomHeight; i++) {
					for (var k = startPointY - 1; k <= startPointY + roomWidth; k++) {
						if (squares[i][k].props.id == "room") {
							overlap = true;
							break;
						}		
					}
				}
				/* If no overlap is found, the room is built by replacing the wall squares with room squares instead. */
				if (!overlap) {
					for (var i = startPointX; i < startPointX + roomHeight; i++) {
						for (var k = startPointY; k < startPointY + roomWidth; k++) {
							squares[i].splice(k, 1, <div key={[i, k]} id="room"></div>);
						}
					}
					/* The center point of the room is calculated and pushed to roomCenters. */
					roomCenters.push([Math.floor((2 * startPointX + roomHeight) / 2), Math.floor((2 * startPointY + roomWidth) / 2)]);
					/* A room is built, so the counter is decremented. */
					counter--;
				}
			}
		}
		/* Next, to ensure that each room is reachable, a tunnel is built from each room to the room preceeding it. Tunnels are built from center to center of each room. point starts from 1 because room 0 doesn't have any preceeding room */
		for (var point = 1; point < roomCenters.length; point++) {
			/* Direction of the tunnl is random as well, can move horizontally then verticallt or the other way around. Chances are 50:50 */
			var direction = Math.random();
			if (direction > 0.5) { //horizontal then vertical	
				this.buildHorTunnel(squares, roomCenters[point - 1], roomCenters[point]);
				this.buildVerTunnel(squares, roomCenters[point - 1], roomCenters[point]);
			} else { // vertical then horizontal
				this.buildVerTunnel(squares, roomCenters[point - 1], roomCenters[point]);
				this.buildHorTunnel(squares, roomCenters[point - 1], roomCenters[point]);
			}
		}
		/* squares is returned. */
		return squares;
	},
	/* Called by genereateGrid, it builds horizontal tunnels. It builds a tunnel between two points horizontally. */
	buildHorTunnel: function(squares, point1, point2) {
		/* Loops through a horizontal line and replace squares with room squares. */
		for (var k = Math.min(point1[1], point2[1]); k <= Math.max(point1[1], point2[1]); k++) {
			squares[point1[0]].splice(k, 1, <div key={[point1[0], k]} id="room"></div>);
		}
		return squares;
	},
	/* Called by genereateGrid, it builds vertical tunnels. It builds a tunnel between two points vertically. */
	buildVerTunnel: function(squares, point1, point2) {
		/* Loops through a vertical line and replace squares with room squares. */
		for (var k = Math.min(point1[0], point2[0]); k <= Math.max(point1[0], point2[0]); k++) {
			squares[k].splice(point2[1], 1, <div key={[k, point2[1]]} id="room"></div>);
		}
		return squares;
	},
	/* This method generates player, weapon and stairs. */
	generateItem: function(squares, width, height, item) {
		/* The condition remains true until the item is generated. */
		var condition = true;
		/* while is used because the generated item's position could be occupied by another item, so the loop keeps trying until the item is successfully placed. */
		while (condition) {
			/* Random position is generated. */
			var xPosition = Math.floor(Math.random() * width);
			var yPosition = Math.floor(Math.random() * height);
			/* If the generated position has a room, the new item is placed there, otherwise the loop restarts. */
			if (squares[xPosition][yPosition].props.id == "room") {
				if (item == "player") {
					/* If the item is player it replaces the room square in squares. */
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="player"></div>);
					/* The maze is scrolled to have the player centered (unless the player is at the top or bottom, but is guaranteed to be shown.) */
					/* Moving this to componentDidMount doesn't work, playerPosition wouldn't be defined yet */
					if (xPosition > 15) {
						window.onload = function() {
							document.getElementById("maze").scrollTop = (xPosition - 15) * 15;
						}
					}
					/* The player position is saved. */
					var playerXPosition = xPosition; //because xPosition will be overridden for weapon and stairs genetaion
					var playerYPosition = yPosition;
				/* If the item is stairs AND dungeon number is less than 5, stairs is created. No stairs needed in dungeon 5. */
				} else if (item == "stairs" && this.props.dungeon < 5) {
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="stairs"></div>);
				/* weapon is placed in squares. */
				} else if (item == "weapon") {
					squares[xPosition].splice(yPosition, 1, <div key={[xPosition, yPosition]} id="weapon"></div>);
				}
				/* consition set false to stop the while loop. */
				condition = false;
			}
		}
		/* if no player is generated, playerPosition will undefined, which is fine beause it will be ignored. */
		return [squares, [playerXPosition, playerYPosition]];
	},
	/* This method generates enemies and boss. */
	generateEnemies: function(squares, width, height) {
		/* enemies array is initialized. */
		var enemies = [];
		/* 5 enemies are needed in each dungeon. */
		var enemiesToPlace = 5;
		/* while loop keeps running until 5 enemies are generated. */
		while (enemiesToPlace > 0) {
			/* Random position generated. */
			var enemyXPosition = Math.floor(Math.random() * width);
			var enemyYPosition = Math.floor(Math.random() * height);
			/* enemy is created if the position has a room square. */
			if (squares[enemyXPosition][enemyYPosition].props.id == "room") {
				/* enemy is placed in squares. */
				squares[enemyXPosition].splice(enemyYPosition, 1, <div key={[enemyXPosition, enemyYPosition]} id="enemy"></div>);
				/* enemy location and health are pushed into enemies array. health is randomly generated based on dungeon number. */
				enemies.push({enemyHealth: (this.props.dungeon) * 15 + Math.floor(Math.random() * 5),
							location: [enemyXPosition, enemyYPosition]});
				enemiesToPlace--;
			}
		}
		/* If the dungeon's number is 5, boss is generated. The boss will occupy 4 squares (2x2). */
		if (this.props.dungeon == 5) {
			/* While loop needed to keep trying until boss is properly placed. */
			var bossCondition = true;
			while (bossCondition) {
				/* Random position generated. */
				var bossXPosition = Math.floor(Math.random() * width);
				var bossYPosition = Math.floor(Math.random() * height);
				/* Now need to check for 4 squares, they all must be room squares. */
				if (squares[bossXPosition][bossYPosition].props.id == "room" && squares[bossXPosition + 1][bossYPosition].props.id == "room" && squares[bossXPosition][bossYPosition + 1].props.id == "room" && squares[bossXPosition + 1][bossYPosition + 1].props.id == "room") {
					/* squares is updated twice, one for each row. */
					squares[bossXPosition].splice(bossYPosition, 2, <div key={[bossXPosition, bossYPosition]} id="boss"></div>, <div key={[bossXPosition, bossYPosition + 1]} id="boss"></div>);
					squares[bossXPosition + 1].splice(bossYPosition, 2, <div key={[bossXPosition + 1, bossYPosition]} id="boss"></div>, <div key={[bossXPosition + 1, bossYPosition + 1]} id="boss"></div>);
					/* set to false after boss is generated. */
					bossCondition = false;
				}
			}
			/* boss is given random health within a range. */
			var bossHealth = Math.floor(Math.random() * 50 + 350);
			this.setState({bossHealth: bossHealth});
		}
		/* squares and enemies are returned. */
		return [squares, enemies];
	},
	/* This method generates health items and places them randomly on the grid. */
	generateHealth: function(squares, width, height) {
		/* Five health items need to be generated. */
		var healthToPlace = 5;
		/* Procedure same as other items with minor differences. */
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
	/* An event listener for pressing a keyboard button is declared. It calls handlepress method. */
	componentDidMount: function() {
		window.addEventListener('keydown', this.handlepress);
	},
	/* The handler for pressing a keyboard button. It deals with pressing one of the arrow keys. */
	handlepress: function(e) {
		/* If gameProgress (from GameArea) is false, keyboard presses will be ignored. */
		if (this.props.gameProgress) {
			/* To prevent keyboard from scrolling the page. This will only move the player in the grid. */
			e.preventDefault();
			/* squares and playerPosition are loaded. */
			var squares = this.state.squares;
			var playerXPosition = this.state.playerPosition[0];
			var playerYPosition = this.state.playerPosition[1];
			/* The next two variables will save the new position of the player. These new positions will be stored in playerPosition in the state. In case the player doesn't move, these variables are initially given the current position. */
			var newXPosition = playerXPosition; //in case the player won't move
			var newYPosition = playerYPosition; //
			/* This variable holds the type of the square the player is trying to move to. */
			var newPositionType;
			/* If the pressed key is the Arrow Up. */
			if (e.code == "ArrowUp") {
				/* The new possible location the player is trying to go to is figured out. */
				var possibleNewXPosition = playerXPosition - 1;
				var possibleNewYPosition = playerYPosition;
				/* The id of the html element is retreived which tells what lies in the that square. */
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
				/* If the player is trying to go to a room, or health or weapon square, the following executes */
				if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
					/* If the player is in a row less than 45, the page scrolls down to keep the player centered. */
					if (playerXPosition < 45) {	
						/* must be -= 15 (not = -15). setting it to -15 means you're positiong at a fixed value. -=15 means you're taking the current poistion and moving 15 from there. */
						document.getElementById("maze").scrollTop -= 15;
					}
				}
			/* Similar to Arrow up, except motion and scrolling are reversed. */
			} else if (e.code == "ArrowDown") {
				var possibleNewXPosition = playerXPosition + 1;
				var possibleNewYPosition = playerYPosition;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
				if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
					if (playerXPosition > 15) {
						document.getElementById("maze").scrollTop += 15;
					}
				}
			/* If the pressed key is right or left, the new location is calculated and the existing square type is figured out. */
			} else if (e.code == "ArrowLeft") {
				var possibleNewXPosition = playerXPosition;
				var possibleNewYPosition = playerYPosition - 1;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
			} else if (e.code == "ArrowRight") {
				var possibleNewXPosition = playerXPosition;
				var possibleNewYPosition = playerYPosition + 1;
				newPositionType = this.state.squares[possibleNewXPosition][possibleNewYPosition].props.id;
			}
			/* If the new position is room, health, or weapon, the ollwing executes regardless of the pressed arrow key. */
			if (newPositionType == "room" || newPositionType == "health" || newPositionType == "weapon") {
				/* movePlayer method is called to move the player to the new square. */
				squares = this.movePlayer(squares, playerXPosition, playerYPosition, possibleNewXPosition, possibleNewYPosition);
				/* The new position is saved. */
				newXPosition = possibleNewXPosition;
				newYPosition = possibleNewYPosition;
			/* In case of enemy, the following executes */
			} else if (newPositionType == "enemy") {
				/* enemies array is retreived. */
				var enemies = this.state.enemies
				/* The index of the enemy in enemies is determined, this is needed since each enemy has different health. And it is needed to save the damage done to the enemy if the player starts attacking but don't kill the enemy. */
				for (var enemy in enemies) {
					if (enemies[enemy].location[0] == possibleNewXPosition && enemies[enemy].location[1] == possibleNewYPosition) {
						/* The attacked enemy is determined. */
						var attackedEnemy = enemies[enemy];
						/* The index of the attacked enemy in enemies is saved. */
						var index = enemy;
					}
				}
				/* Attack audio is played. For some reason, attack audio plays with no lag if placed here rather than in the state like all other audio files. */
				var attackAudio = new Audio('sounds/attack.wav');
				attackAudio.play();
				/* attackEnemy method is called to determine the result of the attack, results are saved in attackResult. */
				var attackResult = this.attackEnemy(attackedEnemy);
				/* If the the result is true which means enemy is killed, squares is updated by calling the movePlayer method which moves the player to the new square. */
				if (attackResult === true) {
					squares = this.movePlayer(squares, playerXPosition, playerYPosition, possibleNewXPosition, possibleNewYPosition);
					/* position is updated, updateXp method in GameArea is called. */
					newXPosition = possibleNewXPosition;
					newYPosition = possibleNewYPosition;
					this.props.updateXp();
				} else {
					/* If enemy didn't die, the new enemy health is saved to the enemies array and the player doesn't move. */
					enemies.splice(index, 1, attackResult);
				}
			/* If a boss is in the new location */
			} else if (newPositionType == "boss") {
				/* Attack audio played. */
				var attackAudio = new Audio('sounds/attack.wav');
				attackAudio.play();
				/* Boss's health is retrieved. */
				var boss = {enemyHealth: this.state.bossHealth};
				/* attackEnemy method called with boss as arguement. */
				var attackBoss = this.attackEnemy(boss, "boss");
				/* If boss is killed, win audio plays, and win message is displayed. */
				if (attackBoss === true) {
					this.state.winAudio.play();
					/* call to displayMessage in GameArea. */
					this.props.displayMessage("win");
				} else {
					/* If the boss is not killed, it's health is updated. */
					this.setState({bossHealth: attackBoss.enemyHealth});
				}
			}
			/* Additional lines to execute if the new position is health, weapon or stairs. */
			if (newPositionType == "health") {
				/* Collecting health item audio playes. */
				this.state.healthAudio.play();
				/* increaseHealth method in GameArea is called. */
				this.props.increaseHealth();
			} else if (newPositionType == "weapon") {
				/* Audio plays */
				this.state.weaponAudio.play();
				/* upgradeWeapon in GameArea is called. */
				this.props.upgradeWeapon();
			} else if (newPositionType == "stairs") {
				this.state.stairsAudio.play();
				/* incrementDungeon method in GameArea is called. */
				this.props.incrementDungeon();
				/* initializeGrid method is called to craete a new grid for the new dungeon. */
				var newGrid = this.initializeGrid();
				/* The outcomes of the initializeGrid method are saved. */
				squares = newGrid[0];
				newXPosition = newGrid[1][0];
				newYPosition = newGrid[1][1];
				var enemies = newGrid[2];
				/* Creates the enemis list in the new dungeon. It's not set at the last line of this method alongside squares and playerposition because we only need to change it when a new grid is created. */
				this.setState({enemies: enemies});
				/* Grid is scrolled to have the player centered. */
				document.getElementById("maze").scrollTop = (newXPosition - 15) * 15;
			}
			this.setState({squares: squares, playerPosition: [newXPosition, newYPosition]});
		}	
	},
	/* This method moves the player to a new square, it takes as arguments squares array, old and new positions. */
	movePlayer: function(squares, playerXPosition, playerYPosition, newXPosition, newYPosition) {
		/* The old position is replaced with a room square. */
		squares[playerXPosition].splice(playerYPosition, 1, <div key={[playerXPosition, playerYPosition]} id="room"></div>);
		/* The new position is replaced with a player square. */
		squares[newXPosition].splice(newYPosition, 1, <div key={[newXPosition, newYPosition]} id="player"></div>);
		/* If dark mode is on, playerVisibility is called. */
		if (this.props.dark) {
			squares = this.playerVisibility(squares, [newXPosition, newYPosition], 60, 60);
		}
		/* squares are returned. */
		return squares;
	},
	/* This method works is called when dark mode is on. It sets necessary squares to dark and ensures the player and the surrounding rhombus are shown. */
	playerVisibility: function(squares, playerPosition, width, height) {
		/* The loop loops through all squares, finds lit squares and gives them dark class. */
		for (var i = 0; i < height; i++) {
			for (var k = 0; k < width; k++) {
				if (squares[i][k].props.className != "dark"){
					/* The type of the square is retreived. */
					var tile = squares[i][k].props.id;
					/* lit square is replaced by a dark one. */
					squares[i].splice(k, 1, <div key={[i, k]} id={tile} className="dark"></div>);
				}		
			}
		}
		/* row and colomn of the player are retreived. */
		var row = playerPosition[0];
		var colomn = playerPosition[1];
		/* The c variable is needed to display the lit rhombus surrounding the player correctly. */
		var c = 5;
		/* c needs to be modified to show part of the rhombus if the player is in the top 5 rows. No modification needed for other borders. */
		if (row - 5 < 0) {
			c -= Math.abs(row - 5);
		}
		/* The nested loops loop through the rhombus and removes the dark class. Math.max and Math.min are used to avoid any error when the player moves to the boundaries. Otherwise, we'll be out of index of squares array. */
		for (var i = Math.max(0, row - 5); i <= Math.min(row + 5, 59); i++) {
			for (var k = Math.max(colomn - Math.abs(5 - Math.abs(c)), 0); k <= Math.min(colomn + Math.abs(5-Math.abs(c)), 59); k++) {
				var tile = squares[i][k].props.id;
				squares[i].splice(k, 1, <div key={[i, k]} id={tile}></div>)
			}
			c--;
		}
		/* squares us returned. */
		return squares;
	},
	/* The method decides if the attacked enemy (or boss) is to be killed ot remain alive. */
	attackEnemy: function(attackedEnemy, char = "enemy") {
		/* If the weaponDamage is too much for the enemy's health to handle, the enemy dies and the method returns true. */
		if (attackedEnemy.enemyHealth - this.props.weaponDamage <= 0){
			return true;
		/* If the enemy doesn't die it will harm the player. Player's new health is caluclated randomly within a range and depending on the dungeon number. */
		} else {
			if (char = "enemy") {
				var newPlayerHealth = this.props.health - Math.floor(5 * Math.random() + this.props.dungeon * 15);
			} else if (char = "boss") {
				var newPlayerHealth = this.props.health - Math.floor(5 * Math.random() + this.props.dungeon * 60);
			}
		
		if (newPlayerHealth <= 0) {
			/* If the player health reduces to zero or less, the player loses the game. Loss audio plays and displayMesage method from gameArea is called. */
			this.state.loseAudio.play();
			this.props.displayMessage("loss");
			} else {
				/* If the player doesn't die, its health is reduced and returned. */
				this.props.increaseHealth(newPlayerHealth - this.props.health);
				attackedEnemy.enemyHealth -= this.props.weaponDamage;
				return attackedEnemy;		
			}	
		}
	},
	/* This method is called via refs from GameArea when the Toggle Lights button is pressed. */
	toggleTiles: function() {
		/* squares are loaded to be modified. */
		var squares = this.state.squares;
		/* props.dark is not updated, that's why !dark is used when it was expected to be if (dark) */
		if (!this.props.dark) {
			/* If dark mode is on, playerVisibility is called. */
			squares = this.playerVisibility(squares, this.state.playerPosition, 60, 60);
		} else {
			/* If darkness is off. The id for each element is retreived, each square is replaced with an identical square type except that the dark class is removed. */
			for (var i = 0; i < 60; i++) {
				for (var k = 0; k < 60; k++) {
					var tile = squares[i][k].props.id;
					squares[i].splice(k, 1, <div key={[i, k]} id={tile}></div>)
				}
			}
		}
		/* squares is updated. */
		this.setState({squares: squares});
	},
	/* This method is called via refs from GameArea when a new game starts. */
	newGrid: function() {
		/* initializeGrid is called and the outcomes are saved. */
		var newGrid = this.initializeGrid();
		var squares = newGrid[0];
		var newXPosition = newGrid[1][0];
		var newYPosition = newGrid[1][1];
		var enemies = newGrid[2];
		/* PLayer centered. */
		document.getElementById("maze").scrollTop = (newXPosition - 15) * 15;
		/* New data saved to the state. */
		this.setState({squares: squares, playerPosition: [newXPosition, newYPosition], enemies: enemies});
	},
	/* render method for Maze. It loops through squares array and renders the squares. */
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
		/* Returns a list of instructions and information. */
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

/* Message component. Displayed when a game is over. */
var Message = React.createClass({
	render: function() {
		/* if messageStatus is true, the component will be displayed. Otherwise, it will not be shown. It has a message announcing the result and a button to start a new game. */
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