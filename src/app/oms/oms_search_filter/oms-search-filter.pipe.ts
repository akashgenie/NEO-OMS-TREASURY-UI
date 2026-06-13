import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'omsSearchFilter',
})
export class OmsSearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || searchText.length < 3) {
      return items || [];
    }

    searchText = searchText?.toLowerCase()?.trim()?.replace(/\s\s+/g, ' ');

    return items.filter((item) => {
      return (
        (item?.uccCode && item?.uccCode?.toLowerCase()?.includes(searchText)) ||
        (item?.fullname &&
          item?.fullname
            ?.toLowerCase()
            ?.trim()
            ?.replace(/\s+/g, ' ')
            ?.includes(searchText)) ||
        (item?.pan && item?.pan?.toLowerCase()?.includes(searchText)) ||
        (item?.brokerCode &&
          item?.brokerCode?.toLowerCase()?.includes(searchText)) ||
        (item?.brokerName &&
          item?.brokerName?.toLowerCase()?.includes(searchText)) ||
        (item?.brokerPAN &&
          item?.brokerPAN?.toLowerCase()?.includes(searchText))
      );
    });
  }
}
