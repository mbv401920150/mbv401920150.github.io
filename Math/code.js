let SeleccionUnica = React.createClass({
	getInitialState() {
		return {
			isCorrectFormat: '',
			isCorrect: false,
			canValidate: true
		}
	},
	render() {
		let img;

		if (this.props.imgUrl != undefined)
			img = <img className='imgSU' src={this.props.imgUrl}></img>

		return <div>
			<p>{this.props.questionIndex}. {this.props.question}</p>
			<div className='gridSU'>
				<div>{this.props.options.map(this.eachOption)}</div>
				<i className={this.state.isCorrectFormat}></i>
				{img}
			</div>
		</div>
	},
	validate(e) {
		if(!this.state.canValidate) return;

		let status = '';

		if (this.props.correctAnswer == e.target.value)
			status = 'SU-correct fa-check-circle';
		else
			status = 'SU-incorrect fa-times-circle';

		this.setState({ isCorrectFormat: "SU-validate far fa-4x " + status });

		console.log(status);
	},
	eachOption(option, i) {
		let opt = '';

		switch (i) {
			case 0: opt = "a"; break;
			case 1: opt = "b"; break;
			case 2: opt = "c"; break;
			case 3: opt = "d"; break;
		}

		let id = this.props.questionIndex + '.' + i;

		return <div className='SU-opt' key={i}>
			<label>
				<i>{opt}.</i>
				<input onClick={this.validate} id={id} type='radio' name={"SU-" + this.props.questionIndex} value={opt} />
				<i> {option}</i>
			</label>
		</div>
	}
});

let SectionSeleccionUnica = React.createClass({
	render() {
		return <div>
			{content.SeleccionUnica.map(this.eachItem)}
		</div>
	},

	eachItem(question, i) {
		return <SeleccionUnica
			key={"SU" + i}
			questionIndex={question.Indice}
			question={question.Pregunta}
			options={question.Opciones}
			imgUrl={question.Imagen}
			totalPer={question.Nota}
			correctAnswer={question.Respuesta}
		/>
	}
});

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

let AllContent = React.createClass({
	getInitialState() {
		return {
		}
	},
	render() {
		return (
			<div className='allContent'>
				<Header />
				<h2>PARTE I. SELECCION UNICA</h2>
				<SectionSeleccionUnica />
			</div>
		)
	}
});

let content;

fetch("./content/content.json?v3")
	.then(response => response.json())
	.then(json => {
		content = json;

		ReactDOM.render(
			<AllContent />,
			document.getElementById('main')
		);
	});