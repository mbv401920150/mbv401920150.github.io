let Header = React.createClass({
	render() {
		return <div className='titleContent'>
			<img className='imgHeader' src={content.ImagenPagina}></img>
			<h2 className='title'>{content.Titulo}</h2>
			{content.Intro.map(this.eachIntro)}
		</div>;
	},
	eachIntro(intro, i) {
		return <h3 key={i}>{intro}</h3>
	}
});