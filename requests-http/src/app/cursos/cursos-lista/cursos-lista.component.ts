import { Component, OnInit } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { Observable, empty, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.onRefresh();
  }

  onDeclineDelete() {}

  onConfirmDelete() {}

  onDelete(curso: Curso) {}

  onEdit(id: number) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

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
