import React,{ Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

	constructor(props) {
		super(props);
		this.state = {titulo: '',preco: '',autorId: ''};
		this.enviaForm = this.enviaForm.bind(this);
		this.setTitulo = this.setTitulo.bind(this);
		this.setPreco = this.setPreco.bind(this);
		this.setAutorId = this.setAutorId.bind(this);
	}

	enviaForm(evento) {
		evento.preventDefault();
		$.ajax({
			url: 'http://localhost:8080/api/livros',
			contentType: 'application/json',
			dataType: 'json',
			type: 'post',
			data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
			success: (novaListagem) => {
				PubSub.publish('atualiza-lista-livros', novaListagem);
				this.setState({titulo: '', preco: '', autorId: ''});
			},
			error: (resposta) => {
				if (resposta.status === 400) {
					new TratadorErros().publicaErros(resposta.responseJSON);
				}
			},
			beforeSend: () => PubSub.publish('limpa-erros', {})
		})
	}

	setTitulo(evento) {
		this.setState({titulo: evento.target.value});
	}

	setPreco(evento) {
		this.setState({preco: evento.target.value});
	}

	setAutorId(evento) {
		this.setState({autorId: evento.target.value});
	}

	render() {
      return (
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
              <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo"/>                                              
              <InputCustomizado id="preco" type="decimal" name="preco" value={this.state.Preco} onChange={this.setPreco} label="Preco"/>
              <div className='pure-control-group'>
			      <label htmlFor="" >Autor</label>
	              <select value={ this.state.autorId } name="autorId" onChange={ this.setAutorId } label="Autor" >
	              <option value="">Selecione</option>
	              { 
	              	this.props.autores.map( (autor) => <option key={ autor.id } value={ autor.id }> { autor.nome } </option> )
	              }
	              </select>
	          </div>
              <div className="pure-control-group">                                  
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>             

          </div>  

      );
  }

}

class TabelaLivros extends Component {

    render() {
        return(
	            <div>            
	              <table className="pure-table">
	                <thead>
	                  <tr>
	                    <th>Título</th>
	                    <th>Preço</th>
	                    <th>Autor</th>
	                  </tr>
	                </thead>
	                <tbody>
	                  {
	                    this.props.lista.map(function(livro){
	                      return (
	                        <tr key={livro.id}>
	                          <td>{livro.titulo}</td>
	                          <td>{livro.preco}</td>
	                          <td>{livro.autor.nome}</td>
	                        </tr>
	                      );
	                    })
	                  }
	                </tbody>
	              </table> 
	            </div>                     
        );
    }
}

export default class LivroBox extends Component {

  constructor() {
    super();    
    this.state = {lista: [],autores: []};    
  }

  componentDidMount(){  
    $.ajax({
        url:"http://localhost:8080/api/livros",
        dataType: 'json',
        success: (resposta) => this.setState({lista:resposta})
      } 
    );

    $.ajax({
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success: (resposta) => this.setState({autores:resposta})
      } 
    );          

    PubSub.subscribe('atualiza-lista-livros',(topico,novaLista) => this.setState({lista:novaLista}));
  }   


  render(){
    return (
      <div>
        <div className="header">
          <h1>Cadastro de livros</h1>
        </div>
        <div className="content" id="content">
          <FormularioLivro autores={this.state.autores}/>
          <TabelaLivros lista={this.state.lista}/>
        </div>
      </div>
    );
  }
}