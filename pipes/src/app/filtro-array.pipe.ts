import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroArray',
})
export class FiltroArrayPipe implements PipeTransform {
  transform(value: any, arg?: any): any {
    if (value.length === 0 || arg === undefined) {
      return value;
    }

    let filter = arg.toLocaleLowerCase();

    return value.filter((v) => v.toLocaleLowerCase().indexOf(filter) !== -1);
  }
}
