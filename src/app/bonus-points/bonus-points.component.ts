import {Component, OnInit, ViewChild} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {ProductAddDialogComponent} from '../product-add-dialog/product-add-dialog.component';

@Component({
  selector: 'app-bonus-points',
  templateUrl: './bonus-points.component.html',
  styleUrls: ['./bonus-points.component.css'],
})
export class BonusPointsComponent implements OnInit {
  displayedColumns = ['motivation', 'name', 'bonusSystem', 'productMinSales', 'productBonusPointStart', 'bonusPoints'];
  products: Products[] = [];
  dataSource = new MatTableDataSource(this.products);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkingService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getBonusPoints();
  }

  getBonusPoints() {
    this.network.getRequest('/products')
      .subscribe(
        (response: any[]) => {
          response.forEach((t) => {
            this.products.push(t);
          });
          this.products.sort((a, b) => a.productMotivationalBlockTypeId - b.productMotivationalBlockTypeId || a.productSortOrder - b.productSortOrder);
          this.dataSource.sort = this.sort;
        });
  }

  export() {
    this.network.getRequestDownload('/products/exportProducts')
      .subscribe(
        (response: any) => {
          this.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'export.xlsx');
        });
  }

  downloadFile(blob: any, type: string, filename: string) {

    const binaryData = [];
    binaryData.push(blob);

    const url = window.URL.createObjectURL(new Blob(binaryData)); // <-- work with blob directly

    // create hidden dom element (so it works in all browsers)
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    // create file, attach to hidden element and open hidden element
    a.href = url;
    a.download = filename;
    a.click();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

// export interface BonusPoints {
//   bonusPoints: number;
//   bonusSystem:
//     {id: number, status: string, name: string};
//   bonusSystemId?: number;
//   externalId?: number;
//   id: number;
//   name: string;
//   productCode?: any;
//   status: string;
// }

export interface BonusPoints {
  name: string;
  bonusSystem: string;
  bonusPoints: number;
  productMinSales: number;
  productBonusPointStart: number;
  evaluationGroup: any;
  product?: any;
  motivation?: string;
}

export interface Products {
  productMotivationalBlockType: string;
  productMotivationalBlockTypeId: number;
  productName: string;
  productId: number;
  evaluationGroupName: string;
  evaluationGroupId: number;
  productMinSale: number;
  productBonusPointStart: number;
  productBonusPoints: number;
  productSortOrder: number;
}

