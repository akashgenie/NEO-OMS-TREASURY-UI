import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'allocationDashboard',
})
export class AllocationDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}
  transform(items: any[], searchTextAllocationDashboard: string): any[] {
    if (!items || !searchTextAllocationDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'allocation_dash',
      );
      return items || [];
    }

    searchTextAllocationDashboard = searchTextAllocationDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.product &&
          item?.product
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.scripName &&
          item.scripName
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.isin &&
          item?.isin?.toLowerCase()?.includes(searchTextAllocationDashboard)) ||
        (item?.tranche &&
          item?.tranche
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.quantity &&
          item?.quantity
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.cost &&
          item?.cost
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.floorPrice &&
          item?.floorPrice
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.lotSize &&
          item?.lotSize
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.multipleOf &&
          item?.multipleOf
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.buyingEntity &&
          item?.buyingEntity
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.entityBankAccount &&
          item?.entityBankAccount
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.actualClosingBalance &&
          item?.actualClosingBalance
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.totalMiscPayments &&
          item?.totalMiscPayments
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.totalMiscReceipts &&
          item?.totalMiscReceipts
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard)) ||
        (item?.boid &&
          item?.boid?.toLowerCase()?.includes(searchTextAllocationDashboard)) ||
        (item?.qty &&
          item?.qty
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextAllocationDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'allocation_dash',
    );
    this.sharedService.allocationDashData = filteredItems;
    return filteredItems;
  }
}
