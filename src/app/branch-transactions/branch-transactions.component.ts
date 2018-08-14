import {Component, OnInit, ViewChild} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {MyOperationsModel} from '../models/my-operations.model';
import {FormControl} from '@angular/forms';
import {LibertyUserModel} from '../models/liberty-user.model';

@Component({
  selector: 'app-branch-transactions',
  templateUrl: './branch-transactions.component.html',
  styleUrls: ['./branch-transactions.component.css'],
})
export class BranchTransactionsComponent implements OnInit {
  displayedColumns = [
    'employeeName',
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
    'hrCode',
  ];
  branchOperations: MyOperationsModel[] = [];
  dataSource = new MatTableDataSource(this.branchOperations);
  @ViewChild(MatSort) sort: MatSort;
  checked = false;
  toppings = new FormControl();
  saleQuantities: MyOperationsModel[] = [];
  mySaleQuantities = new MatTableDataSource(this.saleQuantities);
  branchEmployees: LibertyUserModel[] = [];
  selectedOption = 0;

  constructor(private network: NetworkingService) {
  }

  ngOnInit() {
    this.network.getRequest('/sales/BranchCurrentMonthSales')
      .subscribe(
        (branchOperations: any) => {
          branchOperations.forEach((o) => {
            this.branchOperations.push(o);
          });
          this.dataSource.sort = this.sort;
        });
    this.getBranchBonusPoints();
    this.getBranchEmployees();
  }

  getBranchBonusPoints() {
    this.network.getRequest('/bonusRewards/branchCurrentMonthBonuses')
      .subscribe(
        (response: any) => {
          response.forEach((o) => {
            this.saleQuantities.push(o);
          });
          this.mySaleQuantities.sort = this.sort;
        });
  }

  onSlideChange() {
    this.checked = !this.checked;
  }

  getBranchEmployees() {
    this.network.getRequest('/branches/branchEmployeesList')
      .subscribe(
        (employees: LibertyUserModel[]) => {
          employees.forEach((e) => {
            this.branchEmployees.push(e);
          });
        });

  }

  filterUsers(id: number) {
    let name;
    if (id > 0) {
      name = this.saleQuantities.find(s => s.id === id).firstName;
      this.mySaleQuantities.filter = name;
      this.dataSource.filter = name;
    } else {
      this.mySaleQuantities.filter = '';
      this.dataSource.filter = '';
    }
  }

}
