import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCommaSeparated]',
})
export class CommaSeparatedDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const originalCursorPos = input.selectionStart; // Capture the original cursor position
    const originalValue = input.value.replace(/,/g, ''); // Get the value without commas
    const originalLength = input.value.length; // Capture the original length of the value

    const formattedValue = this.addCommas(originalValue);

    input.value = formattedValue;

    const newCursorPos = this.calculateNewCursorPos(
      originalCursorPos,
      originalLength,
      formattedValue,
    );

    input.setSelectionRange(newCursorPos, newCursorPos);
  }

  private addCommas(value: string): string {
    if (!value) {
      return value;
    }

    const parts = value.split('.');

    if (/^0+$/.test(parts[0])) {
      return value;
    }

    parts[0] = parts[0].replace(/^0+(?=\d)/, '');

    let lastThree = parts[0].substring(parts[0].length - 3);
    let otherNumbers = parts[0].substring(0, parts[0].length - 3);

    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }

    let rgx = /(\d+)(\d{2})/;
    while (rgx.test(otherNumbers)) {
      otherNumbers = otherNumbers.replace(rgx, '$1' + ',' + '$2');
    }

    parts[0] = otherNumbers + lastThree;

    return parts.join('.');
  }

  private calculateNewCursorPos(
    originalCursorPos: number | null,
    originalLength: number,
    formattedValue: string,
  ): number {
    if (originalCursorPos === null) {
      return formattedValue.length; // Default to the end if the original position is null
    }

    const formattedLength = formattedValue.length;
    const lengthDifference = formattedLength - originalLength;

    let newCursorPos = originalCursorPos + lengthDifference;

    newCursorPos = Math.max(newCursorPos, 0);
    newCursorPos = Math.min(newCursorPos, formattedLength);

    return newCursorPos;
  }
}
