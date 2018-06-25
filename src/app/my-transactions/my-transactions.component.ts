import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css'],
})
export class MyTransactionsComponent implements OnInit {
  displayedColumns = ['name', 'productMinSales', 'productBonusPointStart', 'mySaleQuantity', 'myBonusReward'];
  transactions: Transactions[] = [];
  dataSource = new MatTableDataSource(this.transactions);
  @ViewChild(MatSort) sort: MatSort;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getRequest('/sales/currentMonthSales')
      .subscribe(
        (trans: any[]) => {
          trans.forEach((t) => {
            this.transactions.push({
              name: t.sale.product.name,
              myBonusReward: t.bonusReward,
              productMinSales: t.competenceLevel.productMinSales,
              productBonusPointStart: t.competenceLevel.productBonusPointStart,
              mySaleQuantity: t.sale.saleQuantity,
            });
          });
          this.dataSource.sort = this.sort;
        });
  }
}
export interface Transactions {
  name: string;
  myBonusReward: number;
  productMinSales: number;
  productBonusPointStart: number;
  mySaleQuantity: number;
}

// export interface Product {
//   bonusPoints: number;
//   externalId: number;
//   id: number;
//   name: string;
//   productCode: number;
//   status: string;
// }
//
// export interface SaleDate {
//   chronology: { id: string, calendarType: string };
//   dayOfMonth: number;
//   dayOfWeek: string;
//   dayOfYear: number;
//   era: string;
//   leapYear: boolean;
//   month: string;
//   monthValue: number;
//   year: number;
// }
//
// export interface User {
//   address: string;
//   authIds?: any;
//   authorities?: any;
//   email: string;
//   emailActive?: any;
//   enabled: boolean;
//   externalId?: any;
//   firstName: string;
//   id: number;
//   lastName: string;
//   lastPasswordResetDate?: any;
//   passwordDto?: any;
//   personalNumber?: any;
//   phoneNumber?: any;
//   pictureId?: any;
//   smsActive?: any;
//   status?: any;
//   username?: any;
// }
