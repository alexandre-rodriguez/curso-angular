import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css'],
})
export class TemplateFormComponent implements OnInit {
  usuario: any = {
    nome: null,
    email: null,
  };

  constructor(
    private httpClient: HttpClient,
    private cepService: ConsultaCepService
  ) {}

  ngOnInit(): void {}

  onSubmit(form) {
    console.log(form);

    this.httpClient
      .post('https://httpbin.org/post', JSON.stringify(form.value))
      .subscribe((dados) => console.log(dados));
  }

  verificaInvalidTouched(campo) {
    return campo.invalid && campo.touched;
  }

  aplicaCssErro(campo) {
    return {
      'has-error': this.verificaInvalidTouched(campo),
      'has-feedback': this.verificaInvalidTouched(campo),
    };
  }

  consultaCEP(cep, form) {
    if (cep != null && cep !== '') {
      this.cepService
        .consultaCEP(cep)
        .subscribe((dados) => this.populaDadosForm(dados, form));
    }
  }

  populaDadosForm(dados, formulario) {
    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }

  resetaDadosForm(formulario) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }
}
