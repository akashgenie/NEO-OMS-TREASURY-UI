import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Pipe({
  name: 'operationDashboard',
})
export class OperationDashboardPipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(
    items: any[],
    searchTextOpsDashboard: string,
    checkDashBoard: string,
  ): any[] {
    if (!items || !searchTextOpsDashboard) {
      if (checkDashBoard == 'omsOperationDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'operation',
        );
      } else if (checkDashBoard == 'pmsDealingDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'pmsDealing',
        );
      } else if (checkDashBoard == 'bondOpsDash') {
        this.sharedService.updateFilteredDataLength(
          items ? items.length : 0,
          'bondOps',
        );
      }
      return items || [];
    }

    searchTextOpsDashboard = searchTextOpsDashboard
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');

    let filteredItems: any[] = [];

    if (checkDashBoard == 'omsOperationDash') {
      filteredItems = items.filter((item) => {
        return (
          (item.referencenumber &&
            item.referencenumber
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientname &&
            item.clientname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.securityname &&
            item.securityname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.isincode &&
            item.isincode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.remainingquantity &&
            item.remainingquantity
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.buyselltype &&
            item.buyselltype.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.quantitybooked &&
            item.quantitybooked
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientconsent &&
            item.clientconsent
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.paymentstatus &&
            item.paymentstatus
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.status &&
            item.status.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.clientcode &&
            item.clientcode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.pan &&
            item.pan.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.lob &&
            item.lob.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.ordertype &&
            item.ordertype.toLowerCase().includes(searchTextOpsDashboard))
        );
      });
    } else if (checkDashBoard == 'pmsDealingDash') {
      filteredItems = items.filter((item) => {
        return (
          (item.referencenumber &&
            item.referencenumber
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientname &&
            item.clientname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.securityname &&
            item.securityname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.isincode &&
            item.isincode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.remainingquantity &&
            item.remainingquantity
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.buyselltype &&
            item.buyselltype.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.quantitybooked &&
            item.quantitybooked
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientconsent &&
            item.clientconsent
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.paymentstatus &&
            item.paymentstatus
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.status &&
            item.status.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.clientcode &&
            item.clientcode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.pan &&
            item.pan.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.lob &&
            item.lob.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.ordertype &&
            item.ordertype.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.transactionType &&
            item.transactionType
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.accountCode &&
            item.accountCode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.securityName &&
            item.securityName.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.clientName &&
            item.clientName.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.isinCode &&
            item.isinCode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.quantity &&
            item.quantity
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.totalConsideration &&
            item.totalConsideration
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.price &&
            item.price
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.referenceNumber &&
            item.referenceNumber
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.product &&
            item.product.toLowerCase().includes(searchTextOpsDashboard))
        );
      });
    } else if (checkDashBoard == 'bondOpsDash') {
      filteredItems = items.filter((item) => {
        return (
          (item.referencenumber &&
            item.referencenumber
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientname &&
            item.clientname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.securityname &&
            item.securityname.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.isincode &&
            item.isincode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.remainingquantity &&
            item.remainingquantity
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.buyselltype &&
            item.buyselltype.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.quantitybooked &&
            item.quantitybooked
              .toString()
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.clientconsent &&
            item.clientconsent
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.paymentstatus &&
            item.paymentstatus
              .toLowerCase()
              .includes(searchTextOpsDashboard)) ||
          (item.status &&
            item.status.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.clientcode &&
            item.clientcode.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.pan &&
            item.pan.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.lob &&
            item.lob.toLowerCase().includes(searchTextOpsDashboard)) ||
          (item.ordertype &&
            item.ordertype.toLowerCase().includes(searchTextOpsDashboard))
        );
      });
    }

    if (checkDashBoard == 'omsOperationDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems.length,
        'operation',
      );
      this.sharedService.opsDashData = filteredItems;
    } else if (checkDashBoard == 'pmsDealingDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'pmsDealing',
      );
      this.sharedService.pmdsDealingData = filteredItems;
    } else if (checkDashBoard == 'bondOpsDash') {
      this.sharedService.updateFilteredDataLength(
        filteredItems?.length,
        'bondOps',
      );
      this.sharedService.bondOpsData = filteredItems;
    }

    return filteredItems;
  }
}
