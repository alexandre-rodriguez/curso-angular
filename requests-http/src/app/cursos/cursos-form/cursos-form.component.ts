import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { CursosService } from './../cursos.service';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss'],
  preserveWhitespaces: true,
})
export class CursosFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: CursosService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const curso = this.route.snapshot.data.curso;

    this.criarFormulario(curso);
  }

  private criarFormulario(curso) {
    this.form = this.fb.group({
      id: [curso.id],
      nome: [
        curso.nome,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
    });
  }

  updateForm(curso) {
    this.form.patchValue({
      id: curso.id,
      nome: curso.nome,
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);

    let msgSuccess = 'Curso criado com sucesso!';
    let msgError = 'Erro ao criar curso, tente novamente!';
    if (this.form.value.id) {
      msgSuccess = 'Curso atualizado com sucesso!';
      msgError = 'Erro ao atualizar curso, tente novamente!';
    }

    if (this.form.valid) {
      console.log('submit');
      this.service.save(this.form.value).subscribe(
        (success) => {
          this.modal.showAlertSuccesso(msgSuccess);
          this.location.back();
        },
        (error) =>
          this.modal.showAlertDanger(msgError)
      );
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
    console.log('onCancel');
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }
}
