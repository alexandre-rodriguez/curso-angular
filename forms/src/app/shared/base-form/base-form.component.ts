import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

export abstract class BaseFormComponent implements OnInit {
  formulario: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  abstract submit();

  onSubmit() {
    if (this.formulario.valid) {
      this.onSubmit();
    } else {
      console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  verificaInvalidTouched(nomeCampo: string) {
    return (
      this.formulario.get(nomeCampo).invalid &&
      (this.formulario.get(nomeCampo).touched ||
        this.formulario.get(nomeCampo).dirty)
    );
  }

  verificaRequired(nomeCampo: string) {
    return (
      this.formulario.get(nomeCampo).hasError('required') &&
      (this.formulario.get(nomeCampo).touched ||
        this.formulario.get(nomeCampo).dirty)
    );
  }

  aplicaCssErro(nomeCampo: string) {
    return {
      'has-error': this.verificaInvalidTouched(nomeCampo),
      'has-feedback': this.verificaInvalidTouched(nomeCampo),
    };
  }
}
