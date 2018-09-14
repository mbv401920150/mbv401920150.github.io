
var DishElement = React.createClass({
	getInitialState() {
		return {
			heart: Boolean(this.props.heart),
			editing: false
		};
	},
	handleLike() {
		this.setState({ heart: !this.state.heart });
		console.log(this.props.name);
		this.state.heart != this.state.heart;
	},
	editDish() {
		this.setState({ editing: true });
	},
	removeDish() {
		this.props.onRemove(this.props.index);
	},
	acceptEdit() {
		this.props.onChange(this.refs.newName.value, this.props.index);
		this.setState({ editing: false });
	},
	cancelEdit() {
		this.setState({ editing: false });
	},
	showContent() {
		return <div className='food-container'>
			<div><b>Food:</b> {this.props.name}</div>
			<p><b>Origin country:</b> {this.props.children} </p>
			<div>
				<input
					type='checkbox'
					defaultChecked={this.state.heart}
					onChange={this.handleLike}
					className={(this.state.heart ? "heart" : "heartBlack")}>
				</input>
				<div className='dishOptions'>
					<div onClick={this.editDish}>✏️</div>
					<div onClick={this.removeDish}>️🗑️</div>
				</div>
			</div>
		</div>;
	},
	showEdit() {
		return <div className='food-container'>
			<input
				ref='newName'
				type='text'
				defaultValue={this.props.name}
				placeholder='Include the new name'>
			</input>
			<div className='dishOptions'>
				<div onClick={this.cancelEdit}>❌</div>
				<div onClick={this.acceptEdit}>✔️</div>
			</div>
		</div>;
	},
	render() {
		if (!this.state.editing)
			return this.showContent();
		else
			return this.showEdit();
	}
});

let Header = React.createClass({
	eachIntro(intro, i) {
		return <h2>{intro}</h2>
	},
	render() {
		return <div>
			<img className='imgHeader' src='img/mep.png'></img>
			{content.Intro.map(this.eachIntro)}
		</div>;
	}
});

let AllContent = React.createClass({
	getInitialState() {
		return {
		}
	},
	render() {
		return (
			<div>
				<Header></Header>
			</div>
		)
	}
});

let content;

fetch("./content/content.json?v1")
	.then(response => response.json())
	.then(json => {
		content = json;

		ReactDOM.render(
			<div className='allContent'>
				<AllContent />
			</div>,
			document.getElementById('main')
		);
	});