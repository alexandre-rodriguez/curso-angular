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
    this.criarFormulario();

    // this.route.params.subscribe((params: any) => {
    //   const id = params['id'];
    //   const curso$ = this.service.loadById(id);
    //   curso$.subscribe((curso) => {
    //     this.updateForm(curso);
    //   });
    // });

    this.route.params.pipe(
      map((params: any) => params.id),
      switchMap(id => this.service.loadById(id))).subscribe(curso =>
        this.updateForm(curso)
      );

    // concatMap -> ordem da requisção importa
    // mergeMap -> ordem nao importa
    // exhaustMap -> casos de login
  }

  private criarFormulario() {
    this.form = this.fb.group({
      id: [null],
      nome: [
        null,
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

    if (this.form) {
      console.log('submit');
      this.service.create(this.form.value).subscribe(
        (success) => {
          this.modal.showAlertSuccesso('Curso criado com sucesso!');
          this.location.back();
        },
        (error) =>
          this.modal.showAlertDanger('Erro ao criar curso, tente novamente!'),
        () => console.log('request completo')
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