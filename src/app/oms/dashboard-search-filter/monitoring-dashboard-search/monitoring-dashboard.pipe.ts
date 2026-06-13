import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'monitoringDashboard',
})
export class MonitoringDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(
    items: any[],
    searchTextDashboard: string,
    tableFlag: boolean,
  ): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'dealer',
      );
      if (!tableFlag) {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'cxoMonitoring',
        );
      } else {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'productMonitoring',
        );
      }
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    let filteredItems: any[] = [];

    if (!tableFlag) {
      filteredItems = items.filter((item) => {
        return (
          (item?.cxoName &&
            item?.cxoName?.toLowerCase()?.includes(searchTextDashboard)) ||
          item?.totalCount == searchTextDashboard ||
          item?.pendingCount == searchTextDashboard ||
          item?.executedCount == searchTextDashboard ||
          item?.rejectedCount == searchTextDashboard ||
          item?.totalCountNDPMS == searchTextDashboard ||
          item?.pendingCountNDPMS == searchTextDashboard ||
          item?.executedCountNDPMS == searchTextDashboard ||
          item?.rejectedCountNDPMS == searchTextDashboard
        );
      });
    } else if (tableFlag) {
      filteredItems = items.filter((item) => {
        return (
          (item?.productName &&
            item?.productName?.toLowerCase()?.includes(searchTextDashboard)) ||
          item?.totalCount == searchTextDashboard ||
          item?.pendingCount == searchTextDashboard ||
          item?.executedCount == searchTextDashboard ||
          item?.rejectedCount == searchTextDashboard ||
          item?.totalCountNDPMS == searchTextDashboard ||
          item?.pendingCountNDPMS == searchTextDashboard ||
          item?.executedCountNDPMS == searchTextDashboard ||
          item?.rejectedCountNDPMS == searchTextDashboard
        );
      });
    }
    if (!tableFlag) {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'cxoMonitoring',
      );
      this.sharedService.cxoMonitoringData = filteredItems;
    } else {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'productMonitoring',
      );
      this.sharedService.productMonitoringData = filteredItems;
    }

    return filteredItems;
  }
}
