import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'rIAMFDashboard',
})
export class RIAMFDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'MF_RIA',
      );
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.referenceNumber &&
          item?.referenceNumber
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientName &&
          item.clientName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.clientCode &&
          item?.clientCode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.pan &&
          item?.pan?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.orderType &&
          item?.orderType
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.schemeName &&
          item?.schemeName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.mode &&
          item?.mode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isinCode &&
          item?.isinCode
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.tradeDate &&
          moment(item?.tradeDate)
            .format('DD MMM YYYY')
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.trxType &&
          item?.trxType?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.units &&
          item?.units?.toString()?.includes(searchTextDashboard)) ||
        (item?.amount &&
          item?.amount?.toString()?.includes(searchTextDashboard)) ||
        (item?.mode &&
          item?.mode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.folioNo &&
          item?.folioNo?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.clientConsent &&
          item?.clientConsent?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.tradeStatus &&
          item?.tradeStatus?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.uccCode &&
          item?.uccCode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isFirstOrderToday &&
          item?.isFirstOrderToday
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.orderType &&
          item?.orderType?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.wsAccountCode &&
          item?.wsAccountCode?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.pmsAccountCode &&
          item?.pmsAccountCode?.toLowerCase()?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'MF_RIA',
    );
    this.sharedService.dealerDashData = filteredItems;
    return filteredItems;
  }
}
