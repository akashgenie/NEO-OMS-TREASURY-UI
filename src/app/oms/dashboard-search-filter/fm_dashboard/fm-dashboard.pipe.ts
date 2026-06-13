import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'fmDashboard',
})
export class FmDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'fundManager',
      );
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.referencenumber &&
          item?.referencenumber
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientname &&
          item.clientname?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.securityname &&
          item?.securityname?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isincode &&
          item?.isincode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.quantitybooked &&
          item?.quantitybooked
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.buyselltype &&
          item?.buyselltype?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.amount &&
          item?.amount
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.referenceId &&
          item.referenceId?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.clientName &&
          item.clientName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.securityName &&
          item.securityName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isinCode &&
          item.isinCode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.transType &&
          item.transType?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.amount &&
          item?.amount
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'fundManager',
    );
    this.sharedService.fundManagerData = filteredItems;
    return filteredItems;
  }
}
