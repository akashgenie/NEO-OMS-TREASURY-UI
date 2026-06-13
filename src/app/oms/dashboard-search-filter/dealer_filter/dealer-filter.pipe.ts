import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'dealerFilter',
})
export class DealerFilterPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'dealer',
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
        (item?.remainingquantity &&
          item?.remainingquantity
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
        (item?.status &&
          item?.status?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.clientcode &&
          item?.clientcode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.pan &&
          item?.pan?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.lob &&
          item?.lob?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.ordertype &&
          item?.ordertype?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.referancenumber &&
          item?.referancenumber
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientName &&
          item?.clientName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.bankAccount &&
          item?.bankAccount?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.entity &&
          item?.entity?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.latestBalance &&
          item?.latestBalance
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.amountToTransfer &&
          item?.amountToTransfer
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.destinationAccount &&
          item?.destinationAccount
            ?.toLowerCase()
            ?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'dealer',
    );
    this.sharedService.dealerDashData = filteredItems;
    return filteredItems;
  }
}
