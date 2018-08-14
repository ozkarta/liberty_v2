import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NetworkingService } from '../services/networking.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['name', 'totalBonus', 'thisMonthBonus', 'lastMonthBonus', 'active'];
  employeeList: EmployeeModel[] = [];
  dataSource = new MatTableDataSource(this.employeeList);
  @ViewChild(MatSort) sort: MatSort;

  animal: string;
  name: string;
  totalBonus = 0;
  bankMaximum = 0;

  constructor(private network: NetworkingService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.network.getRequest('/branches/branch-employees')
      .subscribe(
        (employees: any[]) => {
          employees.forEach((e) => {
            this.employeeList.push({
              id: e.id,
              name: e.firstName + ' ' + e.lastName,
              totalBonus: e.totalBonus,
              thisMonthBonus: e.currentMonthBonus,
              lastMonthBonus: e.previousMonthBonus,
              isActive: e.isActive,
            });
          });
          this.getTotalBonus();
          this.dataSource.sort = this.sort;
        });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getTotalBonus() {
    this.employeeList.forEach((em) => {
      this.totalBonus += em.thisMonthBonus;
    });
  }

  getMax() {
    const vals = this.employeeList.map(e => e.thisMonthBonus);
    return Math.max(...vals);
  }

  getShewonili() {
    let pows = 0;
    let sums = 0;
    this.employeeList.forEach((e) => {
      pows += Math.pow(e.thisMonthBonus, 2);
      sums += e.thisMonthBonus;
    });
    return Math.round(pows / sums);
  }

  getBankAvarage() {
    let sums = 0;
    let count = 0;
    this.employeeList.forEach((e) => {
      sums += e.thisMonthBonus;
      count += 1;
    });
    return Math.round(sums / count);
  }
}

export interface EmployeeModel {
  id: number;
  name: string;
  totalBonus: number;
  thisMonthBonus: number;
  lastMonthBonus: number;
  isActive: boolean;
}
