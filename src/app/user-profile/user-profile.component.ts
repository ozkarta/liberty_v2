import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';
import { AuthorizedUserService } from '../services/authorized-user.service';
import { UserModel } from '../models/user.model';
import { MyOperationsModel } from '../models/my-operations.model';
import { LibertyUserModel } from '../models/liberty-user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  selectedOption = -1;
  selected = new FormControl(0);
  isDataAvailable = false;
  summedProductBonuses: SummerProductData[] = [];
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType = 'doughnut';
  doughnutOptions = {
    legend: {
      display: false,
    },
    animation: {
      animateScale: true,
    },
    cutoutPercentage: 80,
  };
  doughnutChartColors = [{
    backgroundColor: ['#000000',
      '#0066FF',
      '#AF593E',
      '#01A368',
      '#FF861F',
      '#ED0A3F',
      '#FF3F34',
      '#76D7EA',
      '#8359A3',
      '#FBE870',
      '#C5E17A',
      '#03BB85',
      '#FFDF00',
      '#8B8680',
      '#0A6B0D',
      '#8FD8D8',
      '#A36F40',
      '#F653A6',
      '#CA3435',
      '#FFCBA4',
      '#FF99CC',
      '#FA9D5A',
      '#FFAE42',
      '#A78B00',
      '#788193',
      '#514E49',
      '#1164B4'],
  }];

  combinedArray: any[] = [];

  public lineChartData: {
    data: number[];
    label: string;
  }[] = [];
  public lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          Min: 3,
          Max: 6,
        },
      }],
    },
  };
  public lineChartColors = [
    { // grey
      backgroundColor: 'rgba(41,255,188,0.2)',
      borderColor: '#6dffaf',
      pointBackgroundColor: '#6dffaf',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#6dffaf',
      pointHoverBorderColor: '6dffaf',
    },
    { // dark grey
      backgroundColor: 'rgba(255,239,159,0.2)',
      borderColor: '#ffed36',
      pointBackgroundColor: '#ffed36',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ffed36',
      pointHoverBorderColor: '#ffed36',
    },
    { // grey
      backgroundColor: 'rgba(255,81,84,0.2)',
      borderColor: '#ff5154',
      pointBackgroundColor: '#ff5154',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ff5154',
      pointHoverBorderColor: '#ff5154',
    },
    { // dark grey
      backgroundColor: 'rgba(205,155,255,0.2)',
      borderColor: '#f067ff',
      pointBackgroundColor: '#f067ff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#f067ff',
      pointHoverBorderColor: '#f067ff',
    },
    { // grey
      backgroundColor: 'rgba(92,96,255,0.2)',
      borderColor: '#4060ff',
      pointBackgroundColor: '#4060ff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#4060ff',
      pointHoverBorderColor: '#4060ff',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  summedProductData: SummerProductData = { name: '', value: 0 };

  userData: UserModel;

  progressBarData: LastTwoMonthBonuses[] = [];

  lineChartDataAvailable = false;

  checked = false;

  salesTotalQuantity = 0;
  salesTotalQuantityPrimary = 0;
  salesTotalQuantityOther = 0;

  bonusTotalQuantity = 0;
  bonusTotalQuantityPrimary = 0;
  bonusTotalQuantityOther = 0;

  myBonusInGel = 0;

  userSales: MyOperationsModel[] = [];

  userBonuses: MyOperationsModel[] = [];

  bankAvgOperations = 0;

  bankMaxOperations = 0;

  bankMaxBonusPoints = 0;

  myRatingByBonusPoints = 0;

  user: LibertyUserModel;

  lineChartArray: UserModel;

  branchTotalOperations: BranchStatistics;

  constructor(private auth: AuthService, private currentUser: AuthorizedUserService) {
  }

  ngOnInit() {
    this.auth.getRequest('/bonusRewards/getUserData')
      .subscribe(
        (response: UserModel) => {
          this.lineChartArray = response;
          this.loadLineChartData(0);
        });
    this.loadChartData();
    this.getUserOperations();
    this.getBankStatistics();
    this.setUser();
  }

  getUserData() {
    this.currentUser.getUser
      .subscribe(
        (response: UserModel) => {
          if (response === null) {
            return;
          }
          this.userData = response;
          this.userData.prorductsBonusesByMonths.forEach((item) => {
            this.summedProductData.name = item.product.name;
            item.productMonthBonuses.forEach((inner) => {
              this.summedProductData.value += inner.bonusReward;
            });
            this.summedProductBonuses.push({
              name: this.summedProductData.name,
              value: this.summedProductData.value,
            });
          });
          this.loadChartData();
          this.loadProgressData();
          this.loadLineChartData(0);
          this.isDataAvailable = true;
          this.mergeArrays();
        });
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          if (userData) {
            this.user = userData;
            if (this.user.userStaffLevel === 'MIDDLE_MANAGER') {
              this.auth.getRequest('/sales/branchTotalOperations')
                .subscribe(
                  (response: BranchStatistics) => {
                    this.branchTotalOperations = response;
                  });
            }
          }
        });
  }

  getUserOperations() {
    this.currentUser.getMyOperations
      .subscribe(
        (operations: MyOperationsModel[]) => {
          if (operations) {
            this.userSales.length = 0;
            this.userSales = operations;
            operations.forEach((o) => {
              this.salesTotalQuantityPrimary += o.product.primary ? o.userResult : 0;
              this.salesTotalQuantityOther += !o.product.primary ? o.userResult : 0;
              this.salesTotalQuantity += o.userResult;
              this.bonusTotalQuantityPrimary += o.product.primary ? o.bonusPoints : 0;
              this.bonusTotalQuantityOther += !o.product.primary ? o.bonusPoints : 0;
              this.bonusTotalQuantity += o.bonusPoints;
              this.bankAvgOperations += o.bankAverage;
              this.bankMaxOperations += o.bankmax;
            });
          }
        });
  }

  loadChartData() {
    this.currentUser.getMyBonuses
      .subscribe(
        (bonuses: MyOperationsModel[]) => {
          if (bonuses) {
            this.userBonuses.length = 0;
            this.doughnutChartData = [];
            this.doughnutChartLabels = [];
            this.myBonusInGel = 0;
            this.userBonuses = bonuses;
            bonuses.forEach((b) => {
              this.doughnutChartData.push(b.userResult);
              this.doughnutChartLabels.push(b.product.name);
              this.myBonusInGel += b.userResult;
            });
            this.mergeArrays();
            this.isDataAvailable = true;
          }
        });
  }

  loadProgressData() {

  }

  loadLineChartData(index: number) {
    this.lineChartData.length = 0;
    this.lineChartDataAvailable = false;
    const _lineChartData = Array(this.lineChartData.length);
    _lineChartData.push({
      label: 'თქვენი ქულა',
      data: this.lineChartArray.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusReward),
    });
    _lineChartData.push({
      label: 'ბანკის მაქსიმუმი',
      data: this.lineChartArray.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusBankMax),
    });

    _lineChartData.push({
      label: 'ბანკის საშუალო',
      data: this.lineChartArray.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusBankMean),
    });
    _lineChartData.push({
      label: 'ჯგუფის მაქსიმუმი',
      data: this.lineChartArray.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusGroupMax),
    });

    _lineChartData.push({
      label: 'ჯგუფის საშუალო',
      data: this.lineChartArray.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusGroupMean),
    });
    this.lineChartData = _lineChartData;
    this.lineChartDataAvailable = true;
  }

  mergeArrays() {
    this.combinedArray = [];
    for (let _i = 0; _i < this.doughnutChartLabels.length; _i++) {
      this.combinedArray.push({
        label: this.doughnutChartLabels[_i],
        color: this.doughnutChartColors[0].backgroundColor[_i],
      });
    }
  }

  onSlideChange() {
    this.checked = !this.checked;
  }

  getBankStatistics() {
    this.auth.getRequest('/bonusRewards/getBankStatistics')
      .subscribe(
        (response: any) => {
          this.bankMaxBonusPoints = response.maxPoints;
          this.myRatingByBonusPoints = response.rating;
        });
  }

}

export interface SummerProductData {
  name?: string;
  value?: number;
}

export interface LastTwoMonthBonuses {
  id?: number;
  name: string;
  saleQuantity: number;
  bankMax: number;
}

export interface BranchStatistics {
  branchesMax: number;
  branchesMean: number;
  currentBranchSales: number;
}
