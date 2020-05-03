import { BaseFormComponent } from './../shared/base-form/base-form.component';
import { VerficaEmailService } from './services/verfica-email.service';
import { DropdownService } from './../shared/services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EstadosBr } from '../shared/models/estados-br.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable, empty } from 'rxjs';
import { FormValidations } from '../shared/form-validations';
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Cidade } from '../shared/models/cidade.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent extends BaseFormComponent implements OnInit {
  estados: EstadosBr[];
  cidades: Cidade[];

  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerficaEmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dropdownService
      .getEstadosBr()
      .subscribe((dados) => (this.estados = dados));

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();

    this.formulario = this.formBuilder.group({
      nome: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          // Validators.maxLength(30),
        ],
      ],
      email: [
        null,
        [Validators.required, Validators.email],
        [this.validarEmail.bind(this)],
      ],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFramewokrs(),
    });

    this.formulario
      .get('endereco.cep')
      .statusChanges.pipe(
        distinctUntilChanged(),
        tap((value) => console.log('status CEP: ', value)),
        switchMap((status) =>
          status === 'VALID'
            ? this.cepService.consultaCEP(
                this.formulario.get('endereco.cep').value
              )
            : empty()
        )
      )
      .subscribe((dados) => (dados ? this.populaDadosForm(dados) : {}));

    this.formulario
      .get('endereco.estado')
      .valueChanges.pipe(
        tap((estado) => console.log('Novo estado: ', estado)),
        map((estado) => this.estados.filter((e) => e.sigla === estado)),
        map((estados) =>
          estados && estados.length > 0 ? estados[0].id : empty()
        ),
        switchMap((estadoId: number) =>
          this.dropdownService.getCidades(estadoId)
        ),
        tap(console.log)
      )
      .subscribe((cidades) => (this.cidades = cidades));
  }

  buildFramewokrs() {
    const values = this.frameworks.map((v) => new FormControl(false));

    return this.formBuilder.array(
      values,
      FormValidations.requiredMinCheckbox(1)
    );
  }

  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => (v ? this.frameworks[i] : null))
        .filter((v) => v != null),
    });

    this.httpClient
      .post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .subscribe(
        (dados) => {
          console.log(dados);
          // this.resetar();
        },
        (erro: any) => alert('erro')
      );
  }

  verificaEmailInvalido() {
    const campoEmail = this.formulario.get('email');

    if (campoEmail.errors) {
      return campoEmail.getError('email') && campoEmail.touched;
    }
  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService
        .consultaCEP(cep)
        .subscribe((dados) => this.populaDadosForm(dados));
    }
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }

  populaDadosForm(dados) {
    console.log(dados);
    if (dados) {
      this.formulario.patchValue({
        endereco: {
          rua: dados.logradouro,
          // cep: dados.cep,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        },
      });
    }
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }

  setarTecnologias() {
    const tecnologias = ['java', 'javascript', 'php'];
    this.formulario.get('tecnologias').setValue(tecnologias);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 && obj2;
  }

  getFrameworksControls() {
    return (this.formulario.get('frameworks') as FormArray).controls;
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService
      .verificarEmail(formControl.value)
      .pipe(
        map((emailExiste) => (emailExiste ? { emailInvalido: true } : null))
      );
  }
}
