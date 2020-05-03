import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-exemplos-pipe',
  templateUrl: './exemplos-pipe.component.html',
  styleUrls: ['./exemplos-pipe.component.css'],
})
export class ExemplosPipeComponent implements OnInit {
  livro: any = {
    titulo: 'Learning Javascript Data Structures and Algorithms',
    rating: 4.54321,
    numeroPaginas: 314,
    preco: 44.99,
    dataLancamento: new Date(2016, 5, 23),
    url: 'http://a.co/glqjpRP',
  };

  filtro: string;
  livros: string[] = ['Java', 'Angular 2'];

  valorAsync = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Valor assíncrono'), 2000);
  });

  constructor() {}

  ngOnInit(): void {}

  addCurso(novoValor) {
    this.livros.push(novoValor);
    console.log(this.livros);
  }

  obterLivros() {
    if (
      this.livros.length === 0 ||
      this.filtro === undefined ||
      this.filtro.trim() === ''
    ) {
      return this.livros;
    }

    const filter = this.filtro.toLocaleLowerCase();

    return this.livros.filter(
      (v) => v.toLocaleLowerCase().indexOf(filter) !== -1
    );
  }
}
