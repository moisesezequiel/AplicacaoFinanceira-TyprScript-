import {NegociacoesView,MensagemView} from '../views/index';
import {Negociacoes,Negociacao} from '../models/index'
import {tempoDeExecucao , throttle } from "../helpers/decorators/Index"
import {donInject} from "../helpers/decorators/Index"
import { NegociacaoParcial } from '../models/NegociacaoParcial';
import { NegociacaoService ,ResponseHandler } from '../services/îndex';
export class NegociacaoController{

    @donInject('#data')
    private _inputData :JQuery;

    @donInject('#quantidade')
    private _inputQuantidade : JQuery;

    @donInject('#valor')
    private _inputValor :JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#tabela',false);
    private _mensagemView = new MensagemView('#mensagemView')
    private _service = new NegociacaoService();

    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }
                  
    //Tipando os eventos que manipulam o DOM com o tipo Event 

    @throttle()
    adiciona(){
        let data = new Date(this._inputData.val().replace(/-/g,','))//retira o ifem e subistitui por virgula
        debugger
        if(!this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente Possivel fazer negociacoes em dias da semana ')
            return
        }
        console.log(data.getDay())

        const negociacao = new Negociacao(

           data, 
            parseInt(this._inputQuantidade.val()), //parse de HTMLInputElement para int
            parseFloat(this._inputValor.val()), //parse de HTMLInputElement para float
        );
        this._negociacoes.adiciona(negociacao)
        this._negociacoesView.update(this._negociacoes); //ebviando as negociacoes para o view e montar na tabela 
        // console.log(negociacao)
        this._mensagemView.update('negociacao adicionada com sucesso')
    }

    private _ehDiaUtil(data : Date){
        return data.getDay()!=Dias.sabado && data.getDay()!=Dias.domingo;

    }
    @throttle()
    importarDados() {

        this._service
        .obterNegociacoes(res => {
            if(res.ok) return res;
            throw new Error(res.statusText);
        })
        .then(negociacoes => {
            negociacoes.forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);
        });
    }
}

enum Dias{
    domingo,
    segunda,
    terca,
    quarta, 
    quinta, 
    sexta , 
    sabado
}