import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { MyOperationsModel } from '../models/my-operations.model';
import { AuthorizedUserService } from '../services/authorized-user.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css'],
})
export class MyTransactionsComponent implements OnInit {
  displayedColumns = [
    'motivation',
    'productName',
    'myOwn',
    'groupRating',
    'bankRating',
    'groupMin',
    'groupAvg',
    'groupMax',
    'bankMin',
    'bankAvg',
    'bankMax',
  ];
  myBonuses: MyOperationsModel[] = [];

  saleQuantities: MyOperationsModel[] = [];
  checked = false;

  dataSourceSales: MatTableDataSource<MyOperationsModel>;
  dataSourceBonuses: MatTableDataSource<MyOperationsModel>;

  @ViewChild('downloadFile') private downloadExcel: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private auth: AuthService, private currentUser: AuthorizedUserService) {
  }

  ngOnInit() {
    this.getMyBonuses();
    this.getMySales();
  }

  getMyBonuses() {
    this.currentUser.getMyBonuses
      .subscribe(
        (bonuses: MyOperationsModel[]) => {
          if (bonuses) {
            bonuses.forEach((b) => {
              b.productName = b.product.name;
              this.myBonuses.push(b);
            });
            this.dataSourceBonuses = new MatTableDataSource(this.myBonuses);
            this.dataSourceBonuses.sort = this.sort;
            console.log(this.sort);
          }
        });
  }

  getMySales() {
    this.currentUser.getMyOperations
        .subscribe(
          (operations: MyOperationsModel[]) => {
            if (operations) {
              operations.forEach((b) => {
                b.productName = b.product.name;
                this.saleQuantities.push(b);
              });
              this.dataSourceSales = new MatTableDataSource(this.saleQuantities);
              this.dataSourceSales.sort = this.sort;
            }
          });
  }

  onSlideChange() {
    this.checked = !this.checked;
  }

  export() {
    let url;
    if (this.checked) {
      url = '/bonusRewards/exportCurrentMonthBonuses';
    } else {
      url = '/sales/exportCurrentMonthSales';
    }
    this.auth.getRequestDownload(url)
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
    this.dataSourceSales.filter = filterValue.trim().toLowerCase();
    this.dataSourceBonuses.filter = filterValue.trim().toLowerCase();
  }
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
