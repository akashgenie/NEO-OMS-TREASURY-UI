import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYeaFormat',
})
export class MonthYeaFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const month = date
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();
    const year = date.getFullYear();

    return `${month}-${year}`;
  }
}
