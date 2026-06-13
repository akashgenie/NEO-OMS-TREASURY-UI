import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeperated',
})
export class CommaSeperatedPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '';

    let amount = parseFloat(value.toString()).toFixed(2);

    const [integerPart, decimalPart] = amount.split('.');

    let formattedIntegerPart = integerPart;

    if (integerPart.length > 3) {
      const lastThree = integerPart.slice(-3);
      const otherNumbers = integerPart.slice(0, integerPart.length - 3);
      formattedIntegerPart =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }

    return `${formattedIntegerPart}.${decimalPart}`;
  }
}
