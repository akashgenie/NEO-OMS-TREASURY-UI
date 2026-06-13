import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'dematReconDashboard',
})
export class DematReconDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(items: any[], searchTextDashboard: string): any[] {
    if (!items || !searchTextDashboard) {
      this.sharedService.updateFilteredDataLength(
        items ? items.length : 0,
        'demat_Recon',
      );
      return items || [];
    }

    searchTextDashboard = searchTextDashboard
      .toLowerCase()
      .trim()
      .replace(/\s\s+/g, ' ');

    const fieldsToSearch = [
      'orderDate',
      'orderNo',
      'isin',
      'scripName',
      'buyingClientId',
      'buyingClientName',
      'buyerBOID',
      'sellerClientId',
      'sellerName',
      'sellerBOID',
      'qty',
      'tc',
      'paymentStatus',
      'paymentFlag',
      'stockStatus',
      'stockFlag',
      'tradeStatus',
    ];

    const filteredItems = items.filter((item) =>
      fieldsToSearch.some((field) =>
        item[field]?.toString().toLowerCase().includes(searchTextDashboard),
      ),
    );

    this.sharedService.updateFilteredDataLength(
      filteredItems.length,
      'demat_Recon',
    );
    this.sharedService.dematReconData = filteredItems;
    return filteredItems;
  }
}
