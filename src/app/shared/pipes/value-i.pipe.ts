import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueI'
})
export class ValueIPipe implements PipeTransform {

  transform(value: number): string {
    return 'element.value' + value.toString();
  }


}
