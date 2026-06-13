import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'rIACommonDashboard',
})
export class RIACommonDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'cxo_RIA',
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
          item?.ordertype?.toLowerCase()?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'cxo_RIA',
    );
    this.sharedService.cxoRIADashData = filteredItems;
    return filteredItems;
  }
}
