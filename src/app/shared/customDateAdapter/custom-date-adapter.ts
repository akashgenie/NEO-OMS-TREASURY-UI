import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.length === 10) {
      const [day, month, year] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return null; // Invalid date format
  }

  override format(date: Date, displayFormat: Object): string {
    const day = this._to2digit(date.getDate());
    const month = this._to2digit(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private _to2digit(n: number) {
    return n < 10 ? `0${n}` : n.toString();
  }
}
