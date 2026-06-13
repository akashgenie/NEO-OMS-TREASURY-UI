import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'wsaFileGen',
})
export class WsaFileGenPipe implements PipeTransform {
  constructor(private readonly sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'wsa',
      );
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.orderRefereneNo &&
          item?.orderRefereneNo
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.clientId &&
          item.clientId?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.clientName &&
          item?.clientName?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.transactionType &&
          item?.transactionType
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.securityName &&
          item?.securityName
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.isin &&
          item?.isin?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.quantity &&
          item?.quantity
            .toString()
            ?.toLowerCase()
            ?.includes(searchTextDashboard)) ||
        (item?.rate &&
          item?.rate?.toLowerCase()?.includes(searchTextDashboard)) ||
        (item?.amount &&
          item?.amount?.toLowerCase()?.includes(searchTextDashboard))
      );
    });
    this.sharedService.updateFilteredDataLength(filteredItems?.length, 'wsa');
    this.sharedService.wsaDashData = filteredItems;
    return filteredItems;
  }
}
