import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { MyOperationsModel } from '../models/my-operations.model';
import { Transactions } from '../transactions/transactions.component';
import { AuthorizedUserService } from '../services/authorized-user.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css'],
})
export class MyTransactionsComponent implements OnInit {
  displayedColumns = [
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
  @ViewChild(MatSort) sort: MatSort;
  checked = false;

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
            this.myBonuses = bonuses;
          }
        });
  }

  getMySales() {
    this.currentUser.getMyOperations
        .subscribe(
          (operations: MyOperationsModel[]) => {
            if (operations) {
              this.saleQuantities = operations;
            }
          });
  }

  onSlideChange() {
    this.checked = !this.checked;
  }
  export() {
    this.auth.getRequestDownload('/bonusRewards/exportCurrentMonthBonuses')
      .subscribe(
        (response: any) => {
          this.downloadFile(response);
        });
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
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
