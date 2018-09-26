let Validate = React.createClass({
	render() {
		return <div>
			<input type='button' id='btnValidate' value='Validate' onClick={this.validate}></input>
		</div>
	},
	validate() {
		console.log(Header);
	}
});