import { Component, OnInit } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { Observable, empty, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  constructor(private service: CursosService) {}

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
        this.error$.next(true);
        return empty();
      })
    );
  }
}
