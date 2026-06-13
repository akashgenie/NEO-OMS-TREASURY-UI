import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'rIAAIFDashboard',
})
export class RIAAIFDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'cxo_AIF',
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
        (item?.buyselltype &&
          item?.buyselltype?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.actualpriceordered &&
          item?.actualpriceordered
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientconsent &&
          item.clientconsent?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.paymentstatus &&
          item?.paymentstatus?.toLowerCase()?.includes(searchTextDashboard)) ||
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
        (item?.equilizationAmount &&
          item?.equilizationAmount
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.setupFee &&
          item?.setupFee
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.commitmentAmount &&
          item?.commitmentAmount
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item.transactionType &&
          item.transactionType.toLowerCase().includes(searchTextDashboard)) ||
        (item.accountCode &&
          item.accountCode.toLowerCase().includes(searchTextDashboard)) ||
        (item.securityName &&
          item.securityName.toLowerCase().includes(searchTextDashboard)) ||
        (item.isinCode &&
          item.isinCode.toLowerCase().includes(searchTextDashboard)) ||
        (item.quantity &&
          item.quantity
            .toString()
            .toLowerCase()
            .includes(searchTextDashboard)) ||
        (item.totalConsideration &&
          item.totalConsideration
            .toString()
            .toLowerCase()
            .includes(searchTextDashboard)) ||
        (item.price &&
          item.price.toString().toLowerCase().includes(searchTextDashboard)) ||
        (item.referenceNumber &&
          item.referenceNumber.toLowerCase().includes(searchTextDashboard)) ||
        (item.product &&
          item.product.toLowerCase().includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'cxo_AIF',
    );
    this.sharedService.CXO_AIF_DashData = filteredItems;
    return filteredItems;
  }
}
