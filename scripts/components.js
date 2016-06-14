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
			</div>
		);
	}
});

/* Maze component is contains the maze (all game elements.). */
var Maze = React.createClass({
	render: function() {
		return (
			<div className="maze">
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