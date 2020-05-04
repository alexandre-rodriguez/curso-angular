import { Component, OnInit } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { Observable, empty, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  cursos$: Observable<Curso[]>;

  constructor(
    private service: CursosService,
    private alertService: AlertModalService
  ) {}

  ngOnInit(): void {
    this.onRefresh();
  }

  onDeclineDelete() {}

  onConfirmDelete() {}

  onDelete(curso: Curso) {}

  onEdit(i: number) {}

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.handleError();
        return empty();
      })
    );
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos');
  }
}
