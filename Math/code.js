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

		let item = <div>
			<p>{this.props.questionIndex}. {this.props.question}</p>
			<div className='gridSU'>
				<div className='gridSU-options'>{this.props.options.map(this.eachOption)}</div>
				<i className={this.state.isCorrectFormat}></i>
				{img}
			</div>
		</div>;

		return item;
	},
	validate(e) {
		if (!this.state.canValidate) return;

		let status = '';
		let score = 0;
		let key = 'SU' + this.props.questionIndex;

		if (this.props.correctAnswer == e.target.value) {
			score = this.props.totalPer;
			status = 'SU-correct fa-check-circle';
		}
		else
			status = 'SU-incorrect fa-times-circle';

		results[key] = score;

		this.setState({ isCorrectFormat: "SU-validate far fa-4x " + status });
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

let RespuestaBreve = React.createClass({
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
			img = <img className='' src={this.props.imgUrl}></img>

		return <div>
			<p>{this.props.questionIndex}. {this.props.descr}</p>
			{img}
			<div>{this.props.questions.map(this.eachQuestion)}</div>
		</div>
	},
	eachQuestion(e, i) {
		let index = 0;

		return <div key={i}>
			<div className='RB-question'>
				{e.Pregunta}
				{e.Respuesta.map(
					e => {
						return this.eachAnswer(e, i, index++);
					}
				)}
			</div>
		</div>;
	},
	eachAnswer(e, indexQuestion, indexAnswer) {
		let answer = <input
			className='RB-input'
			key={indexQuestion + '.' + indexAnswer}
			type='text'
			onChange={(e) => { this.validate(e, indexQuestion, indexAnswer); }}></input>;

		if (indexAnswer > 0) answer = <div className="RB-multipleAnswers"> y <input
			className='RB-input'
			key={indexQuestion + '.' + indexAnswer + '.2'}
			type='text'
			onChange={(e) => { this.validate(e, indexQuestion, indexAnswer); }}></input> </div>

		return answer;
	},
	validate(e, indexQuestion, indexAnswer) {
		if (!this.state.canValidate) return;

		e.currentTarget.style.fontWeight = "bolder";

		let key = "RB" + this.props.questionIndex + "." + indexQuestion + "." + indexAnswer;
		let score = 0;

		if (this.props.questions[indexQuestion].Respuesta[indexAnswer] == e.target.value) {
			e.currentTarget.style.color = 'lightseagreen';
			score = this.props.questions[indexQuestion].Nota / this.props.questions[indexQuestion].Respuesta.length;
		}
		else {
			e.currentTarget.style.color = 'red';
		}

		results[key] = score;
	}
});

let SectionSeleccionUnica = React.createClass({
	render() {
		return <div>
			<h2>PARTE I. SELECCION UNICA</h2>
			{content.SeleccionUnica.map(this.eachItem)}
		</div>
	},
	eachItem(question, i) {
		let item = <SeleccionUnica
			key={"SU" + i}
			questionIndex={question.Indice}
			question={question.Pregunta}
			options={question.Opciones}
			imgUrl={question.Imagen}
			totalPer={question.Nota}
			correctAnswer={question.Respuesta}
		/>

		return item;
	}
});

let SectionRespuestaBreve = React.createClass({
	render() {
		return <div>
			<h2>PARTE II. RESPUESTA BREVE</h2>
			{content.RespuestaBreve.map(this.eachItem)}
		</div>
	},
	eachItem(question, i) {
		return <RespuestaBreve
			key={"RB" + i}
			questionIndex={question.Indice}
			descr={question.Descripcion}
			imgUrl={question.Imagen}
			questions={question.Preguntas}
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
				<SectionSeleccionUnica />
				<SectionRespuestaBreve />
				<Validate />
			</div>
		)
	}
});

let Validate = React.createClass({
	render() {
		return <div>
			<hr style= {{margin: '40px 0'}} />
			<input id='btn-NotaFinal' type='button' value='Ver nota final' onClick={this.validate} />
			<div>
				<p className='hideNote showNote'>Su nota final es: </p>
			</div>
		</div>
	},
	validate() {
		let finalScore = 0;

		for (let item in results)
			finalScore += results[item];

		let message = document.getElementsByClassName('showNote')[0];

		if (finalScore == undefined) finalScore = 0;

		message.innerHTML = "Su nota final es: " + finalScore;
		message.classList.remove('hideNote');
	}
});

let results = {};
let content;

fetch("./content/content.json?v4")
	.then(response => response.json())
	.then(json => {
		content = json;

		ReactDOM.render(
			<AllContent />,
			document.getElementById('main')
		);
	});