let RespuestaBreve = React.createClass({
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
		return <div key={i}>
			<div className='RB-question'>
				{e.Pregunta}
				{e.Respuesta.map(this.eachAnswer)}
			</div>
		</div>;
	},
	eachAnswer(e, i) {
		let answer = <input className='RB-input' key={i} type='text'></input>;

		if (i > 0) answer = <div className="RB-multipleAnswers"> y <input className='RB-input' key={i} type='text'></input> </div>

		return answer;
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