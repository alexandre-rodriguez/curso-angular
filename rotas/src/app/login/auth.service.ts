import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioAutenticado: boolean = false;

  mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  fazerLogin(usuario: Usuario) {
    this.usuarioAutenticado =
      usuario.nome === 'usuario' && usuario.senha === 'senha';

    this.mostrarMenuEmitter.emit(this.usuarioAutenticado);

    if (this.usuarioAutenticado) {
      this.router.navigate(['/']);
    }
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }
}
