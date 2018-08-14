import {Component, OnInit, ViewChild} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'productName', 'quantity'];
  transactions: Transactions[] = [];
  dataSource = new MatTableDataSource(this.transactions);
  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkingService) {
  }

  ngOnInit() {
    this.network.getRequest('/sales/currentMonthSalesGrouped')
      .subscribe(
        (transactions: Transactions[]) => {
          transactions.forEach((t) => {
            this.transactions.push(t);
          });
          this.dataSource.sort = this.sort;
        });
  }
}

export interface Transactions {
  bonusReward: number;
  product: Product;
  saleDate: SaleDate;
  saleQuantity: number;
  status: string;
  user: User;
}

export interface Product {
  bonusPoints: number;
  externalId: number;
  id: number;
  name: string;
  productCode: number;
  status: string;
}

export interface SaleDate {
  chronology: { id: string, calendarType: string };
  dayOfMonth: number;
  dayOfWeek: string;
  dayOfYear: number;
  era: string;
  leapYear: boolean;
  month: string;
  monthValue: number;
  year: number;
}

export interface User {
  address: string;
  networkIds?: any;
  networkorities?: any;
  email: string;
  emailActive?: any;
  enabled: boolean;
  externalId?: any;
  firstName: string;
  id: number;
  lastName: string;
  lastPasswordResetDate?: any;
  passwordDto?: any;
  personalNumber?: any;
  phoneNumber?: any;
  pictureId?: any;
  smsActive?: any;
  status?: any;
  username?: any;
}
