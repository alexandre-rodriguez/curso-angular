import { CrudService } from './../shared/crud-service';
import { take } from 'rxjs/operators';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Curso } from './curso';

@Injectable({
  providedIn: 'root',
})
export class CursosService extends CrudService<Curso> {
  private readonly API = `${environment.API}cursos`;

  constructor(protected http: HttpClient) {
    super(http, `${environment.API}cursos`);
  }

}
