import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'viewCounterParty',
})
export class ViewCounterPartyPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}
  transform(items: any[], searchViewData: string): any[] {
    if (!items || !searchViewData) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'viewCounter_dash',
      );
      return items || [];
    }

    searchViewData = searchViewData
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    const filteredItems = items.filter((item) => {
      return (
        (item?.brokerCode &&
          item?.brokerCode?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerName &&
          item.brokerName?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerPan &&
          item?.brokerPan?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerGstNo &&
          item?.brokerGstNo?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerTanNo &&
          item?.brokerTanNo?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerAddr1 &&
          item?.brokerAddr1?.toLowerCase()?.includes(searchViewData)) ||
        (item?.brokerAddr2 &&
          item?.brokerAddr2?.toLowerCase()?.includes(searchViewData))
      );
    });
    this.sharedService.updateFilteredDataLength(
      filteredItems?.length,
      'viewCounter_dash',
    );
    this.sharedService.viewCounterDashData = filteredItems;
    return filteredItems;
  }
}
