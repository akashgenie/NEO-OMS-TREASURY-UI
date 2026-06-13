import { Pipe, PipeTransform } from '@angular/core';

import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'bondDashboardSearch',
})
export class BondDashboardSearchPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'bond',
      );
      return items || [];
    }

    searchText = searchText?.toLowerCase()?.trim()?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item.referencenumber &&
          item.referencenumber.toLowerCase().includes(searchText)) ||
        (item.clientname &&
          item.clientname.toLowerCase().includes(searchText)) ||
        (item.securityname &&
          item.securityname.toLowerCase().includes(searchText)) ||
        (item.isincode && item.isincode.toLowerCase().includes(searchText)) ||
        (item.remainingquantity &&
          item.remainingquantity
            .toString()
            .toLowerCase()
            .includes(searchText)) ||
        (item.buyselltype &&
          item.buyselltype.toLowerCase().includes(searchText)) ||
        (item.selectedInvId &&
          item.selectedInvId.toString().toLowerCase().includes(searchText)) ||
        (item.clientcode &&
          item.clientcode.toLowerCase().includes(searchText)) ||
        (item.pan && item.pan.toLowerCase().includes(searchText)) ||
        (item.lob && item.lob.toLowerCase().includes(searchText)) ||
        (item.ordertype && item.ordertype.toLowerCase().includes(searchText))
      );
    });

    this.sharedService.updateFilteredDataLength(filteredItems?.length, 'bond');
    this.sharedService.bondDashData = filteredItems;
    return filteredItems;
  }
}
