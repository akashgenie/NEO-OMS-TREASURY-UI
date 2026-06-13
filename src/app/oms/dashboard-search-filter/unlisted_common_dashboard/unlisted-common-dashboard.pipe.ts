import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'unlistedCommonDashboard',
})
export class UnlistedCommonDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(
    items: any[],
    searchTextDashboard: string,
    selectDash: string,
  ): any[] {
    if (!items || !searchTextDashboard) {
      if (selectDash == 'unlistedCommonDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'unlistedCommon',
        );
      } else if (selectDash == 'unlistedOperationDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'unlistedOperation',
        );
      } else if (selectDash == 'unlistedPMSDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'unlistedPMS',
        );
      }
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
        (item?.securityName &&
          item?.securityName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.isin &&
          item?.isin?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.trxType &&
          item?.trxType?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.totalConsideration &&
          item?.totalConsideration
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientConsent &&
          item.clientConsent?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.paymentStatus &&
          item?.paymentStatus?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.tradeStatus &&
          item?.tradeStatus?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.wsW_ClientId &&
          item?.wsW_ClientId?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.pan &&
          item?.pan?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.lob &&
          item?.lob?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.acType &&
          item?.acType?.toLowerCase()?.includes(searchTextDashboard))
      );
    });

    if (selectDash == 'unlistedCommonDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'unlistedCommon',
      );
      this.sharedService.unlistedCommonDashData = filteredItems;
    } else if (selectDash == 'unlistedOperationDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'unlistedOperation',
      );
      this.sharedService.unlistedOperationDashData = filteredItems;
    } else if (selectDash == 'unlistedPMSDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'unlistedPMS',
      );
      this.sharedService.unlistedPMSDashData = filteredItems;
    }

    return filteredItems;
  }
}
