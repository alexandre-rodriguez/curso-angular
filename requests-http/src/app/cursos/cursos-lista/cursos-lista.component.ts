import { Component, OnInit } from '@angular/core';

import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  cursos$: Observable<Curso[]>;

  constructor(private service: CursosService) {}

  ngOnInit(): void {
    this.cursos$ = this.service.list();
  }

  onDeclineDelete() {}

  onConfirmDelete() {}

  onDelete(curso: Curso) {}

  onEdit(i: number) {}

  onRefresh() {}
}
