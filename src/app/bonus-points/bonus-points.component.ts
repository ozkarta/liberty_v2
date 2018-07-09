import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ProductAddDialogComponent } from '../product-add-dialog/product-add-dialog.component';

@Component({
  selector: 'app-bonus-points',
  templateUrl: './bonus-points.component.html',
  styleUrls: ['./bonus-points.component.css'],
})
export class BonusPointsComponent implements OnInit {
  displayedColumns = ['name', 'bonusSystem', 'productMinSales', 'productBonusPointStart', 'bonusPoints'];
  products: BonusPoints[] = [];
  dataSource = new MatTableDataSource(this.products);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private auth: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getBonusPoints();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.getBonusPoints();
      });
  }

  getBonusPoints() {
    this.auth.getRequest('/products')
      .subscribe(
        (response: any[]) => {
          response.forEach((t) => {
            this.products.push({
              name: t.product.name,
              bonusSystem: t.product.bonusSystem.name,
              bonusPoints: t.product.bonusPoints,
              productMinSales: t.competenceLevel.productMinSales,
              productBonusPointStart: t.competenceLevel.productBonusPointStart,
              evaluationGroup: t.evaluationGroup.name,
              product: t.product,
            });
          });
          this.products.sort((a, b) => a.product.sortOrder - b.product.sortOrder);
          this.dataSource.sort = this.sort;
        });
  }

  export() {
    this.auth.getRequestDownload('/bonusRewards/exportCurrentMonthBonuses')
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
}
