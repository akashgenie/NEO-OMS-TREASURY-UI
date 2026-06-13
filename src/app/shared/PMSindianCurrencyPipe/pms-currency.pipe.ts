import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PMSreviewCurrency',
})
export class PMSIndianCurrencyPipe implements PipeTransform {
  transform(value: any, decimalCount: number = 2): string {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue === 0) {
      return '0.00';
    }

    const [integer, decimal] = numericValue.toFixed(decimalCount).split('.');

    const integerWithCommas = this.addIndianCommas(integer);

    return `${integerWithCommas}.${decimal}`;
  }

  private addIndianCommas(integer: string): string {
    let lastThree = integer.substring(integer.length - 3);

    let otherNumbers = integer.substring(0, integer.length - 3);

    if (otherNumbers != '') {
      lastThree = ',' + lastThree; // Add a comma before the last three digits
    }

    const result =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return result;
  }
}
