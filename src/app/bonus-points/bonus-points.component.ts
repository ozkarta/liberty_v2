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
            });
          });
          this.dataSource.sort = this.sort;
        });
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
}
