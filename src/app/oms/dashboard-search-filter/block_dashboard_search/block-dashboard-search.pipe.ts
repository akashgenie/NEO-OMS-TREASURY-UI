import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'blockDashboardSearch',
})
export class BlockDashboardSearchPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'block',
      );
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.brokerName &&
          item.brokerName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.schemeName &&
          item?.schemeName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isin &&
          item?.isin?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.totalQty &&
          item?.totalQty
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.blockPrice &&
          item?.blockPrice
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.amount &&
          item?.amount
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.mappedQty &&
          item?.mappedQty
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.blockStatus &&
          item?.blockStatus?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.blockerRefNo &&
          item?.blockerRefNo
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(filteredItems?.length, 'block');
    this.sharedService.blockData = filteredItems;
    return filteredItems;
  }
}
