import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords',
})
export class NumberToWordsPipe implements PipeTransform {
  transform(value: string): string {
    const numericValue = parseInt(value.replace(/,/g, ''), 10);

    if (isNaN(numericValue)) {
      return 'Invalid number';
    }

    return this.convertNumberToWordsIndian(numericValue);
  }

  private convertNumberToWordsIndian(num: number): string {
    if (num === 0) return 'Zero';

    let words = '';

    if (num >= 10000000) {
      let reminderWord = num / 10000000;
      let convertString = parseInt(reminderWord.toString());

      let convertNumber = parseInt(convertString.toString());

      let word = this.convertNumberToWordsIndian(convertNumber);

      words += word + ' Crore ';
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

    words = words.trim().replace(/\s+/g, ' ');

    return words || 'Zero';
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
      words =
        tens[Math.floor(chunk / 10)] +
        (chunk % 10 > 0 ? ' ' + belowTwenty[chunk % 10] : '');
    } else if (chunk < 1000) {
      words =
        belowTwenty[Math.floor(chunk / 100)] +
        ' Hundred ' +
        (chunk % 100 > 0 ? this.convertChunkToWords(chunk % 100) : '');
    }

    return words.trim();
  }
}
