import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reviewCurrency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: string | number): string {
    const numericValue = Number((value + '').replace(/,/g, ''));

    if (isNaN(numericValue)) {
      return 'Invalid number';
    }

    const wholeNumber = Math.floor(numericValue); // Ignore decimal

    return this.convertNumberToWordsIndian(wholeNumber);
  }

  private convertNumberToWordsIndian(num: number): string {
    if (num === 0) return 'Zero';

    let words = '';

    if (num >= 10000000) {
      words += this.convertChunkToWords(Math.floor(num / 10000000)) + ' Crore ';
      num %= 10000000;
    }

    if (num >= 100000) {
      words += this.convertChunkToWords(Math.floor(num / 100000)) + ' Lakh ';
      num %= 100000;
    }

    if (num >= 1000) {
      words += this.convertChunkToWords(Math.floor(num / 1000)) + ' Thousand ';
      num %= 1000;
    }

    if (num > 0) {
      words += this.convertChunkToWords(num);
    }

    return words.trim().replace(/\s+/g, ' ') || 'Zero';
  }

  private convertChunkToWords(chunk: number): string {
    const belowTwenty = [
      'Zero',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];

    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    let words = '';

    if (chunk < 20) {
      words = belowTwenty[chunk];
    } else if (chunk < 100) {
      words = tens[Math.floor(chunk / 10)];
      if (chunk % 10 > 0) {
        words += ' ' + belowTwenty[chunk % 10];
      }
    } else if (chunk < 1000) {
      words = belowTwenty[Math.floor(chunk / 100)] + ' Hundred';
      if (chunk % 100 > 0) {
        words += ' ' + this.convertChunkToWords(chunk % 100);
      }
    }

    return words ? words.trim() : '';
  }
}
