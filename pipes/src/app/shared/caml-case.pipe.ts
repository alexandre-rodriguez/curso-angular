import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'camelCase',
})
export class CamlCasePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let values = value.split(' ');
    let resultado = '';

    for (let v of values) {
      resultado += this.capitalize(v) + ' ';
    }

    return resultado;
  }

  capitalize(value: string) {
    return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
  }
}
