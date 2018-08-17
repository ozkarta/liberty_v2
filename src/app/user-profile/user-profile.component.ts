import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {FormControl} from '@angular/forms';
import {AuthorizedUserService} from '../services/authorized-user.service';
import {MyOperationsModel} from '../models/my-operations.model';
import {LibertyUserModel} from '../models/liberty-user.model';
import {BankStatisticsModel} from '../models/bank-statistics.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  selectedTab = new FormControl(0);
  dataIsLoading = true;
  color = 'warn';
  mode = 'indeterminate';
  value = 50;

  selectedOption = -1;
  selected = new FormControl(-1);
  isDataAvailable = false;
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

  monthNames = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
    'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
  ];
  combinedArray: any[] = [];

  public lineChartData: {
    data: number[];
    label: string;
  }[] = [];
  public lineChartLabels: string[] = [];
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

  user: LibertyUserModel;

  lineChartArray: any;

  branchTotalOperations: BranchStatistics;

  bankAvarageBonus = 0;

  bankStatistics: BankStatisticsModel;

  monthlyLineChartData: BankTotalStatistics[] = [];

  totalBonuses: BankTotalStatistics[] = [];

  subscription: Subscription;

  constructor(private network: NetworkingService, private currentUser: AuthorizedUserService) {
  }

  ngOnInit() {
    this.setUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setUser() {
    this.subscription = this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          if (userData) {
            if (!userData.isAdmin) {
              this.loadChartData();
              this.getUserOperations();
              this.getBankStatistics();
              this.getBonusRewards();
            } else {
              return;
            }
            this.user = userData;
            if (this.user.userStaffLevel === 'MIDDLE_MANAGER') {
              this.network.getRequest('/sales/branchTotalOperations')
                .subscribe(
                  (response: BranchStatistics) => {
                    this.branchTotalOperations = response;
                  });
            }
          }
        });
  }

  getBonusRewards() {
    this.network.getRequest('/bonusRewards/getUserData')
      .subscribe(
        (response: any) => {
          this.lineChartArray = response;
          this.network.getRequest('/bonusRewards/totalStatisticsByMonths')
            .subscribe(
              (totals: BankTotalStatistics[]) => {
                this.monthlyLineChartData = totals;
                this.loadLineChartData(-1, 3);
              });
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
              this.bankAvgOperations += o.bankAverage;
              this.bankMaxOperations += o.bankmax;
            });
          }
        });
  }

  loadChartData() {
    let otherCount = 0;
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
              if (b.product.primary) {
                this.doughnutChartData.push(b.userResult);
                this.doughnutChartLabels.push(b.product.name);
              } else {
                otherCount += b.userResult;
              }
              this.bankAvarageBonus += b.bankAverage;
              this.bonusTotalQuantityPrimary += b.product.primary ? b.userResult : 0;
              this.bonusTotalQuantityOther += !b.product.primary ? b.userResult : 0;
              this.bonusTotalQuantity += b.bonusPoints;
            });
            this.doughnutChartData.push(otherCount);
            this.doughnutChartLabels.push('სხვა');
            this.mergeArrays();
            this.network.getRequest('/bonusRewards/getUserTotalBonus')
              .subscribe(
                (response: any) => {
                  this.myBonusInGel = response;
                  this.isDataAvailable = true;
                });
          }
        });
  }

  loadLineChartData(index: number, months: number) {
    let firstData = index === -1 ? JSON.parse(JSON.stringify(this.monthlyLineChartData)) : JSON.parse(JSON.stringify(this.lineChartArray));
    if (index !== -1) {
      firstData.prorductsBonusesByMonths.forEach((p) => {
        p.productMonthBonuses = p.productMonthBonuses.filter(prod => prod.monthOrdinal <= months);
      });
    } else {
      firstData = Object.values(firstData);
      firstData = firstData.filter(prod => prod.monthOrdinal <= months);
    }
    this.lineChartData.length = 0;
    this.lineChartLabels.length = 0;
    this.lineChartDataAvailable = false;
    const _lineChartData = Array(this.lineChartData.length);
    if (index !== -1) {
      if (this.checked) {
        _lineChartData.push({
          label: 'ჩემი ბონუსი',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusReward),
        });
        _lineChartData.push({
          label: 'ბანკის მაქსიმუმი',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusBankMax),
        });

        _lineChartData.push({
          label: 'ბანკის საშუალო',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusBankMean),
        });
        _lineChartData.push({
          label: 'ჯგუფის მაქსიმუმი',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusGroupMax),
        });

        _lineChartData.push({
          label: 'ჯგუფის საშუალო',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusGroupMean),
        });
      } else {
        _lineChartData.push({
          label: 'ჩემი ოპერაციები',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.saleQuantity),
        });
        _lineChartData.push({
          label: 'ბანკის მაქსიმუმი',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.salesBankMax),
        });

        _lineChartData.push({
          label: 'ბანკის საშუალო',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.salesBankMean),
        });
        _lineChartData.push({
          label: 'ჯგუფის მაქსიმუმი',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.salesGroupMax),
        });

        _lineChartData.push({
          label: 'ჯგუფის საშუალო',
          data: firstData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.salesGroupMean),
        });
      }
    } else {
      if (this.checked) {
        _lineChartData.push({
          label: 'ჩემი ბონუსი',
          data: firstData.map(number => number.bonusReward),
        });
        _lineChartData.push({
          label: 'ბანკის მაქსიმუმი',
          data: firstData.map(number => number.bonusBankMax),
        });

        _lineChartData.push({
          label: 'ბანკის საშუალო',
          data: firstData.map(number => number.bonusBankMean),
        });
        _lineChartData.push({
          label: 'ჯგუფის მაქსიმუმი',
          data: [],
        });

        _lineChartData.push({
          label: 'ჯგუფის საშუალო',
          data: [],
        });
      } else {
        _lineChartData.push({
          label: 'ჩემი ოპერაციები',
          data: firstData.map(number => number.saleQuantity),
        });
        _lineChartData.push({
          label: 'ბანკის მაქსიმუმი',
          data: firstData.map(number => number.salesBankMax),
        });

        _lineChartData.push({
          label: 'ბანკის საშუალო',
          data: firstData.map(number => number.salesBankMean),
        });
        _lineChartData.push({
          label: 'ჯგუფის მაქსიმუმი',
          data: [],
        });

        _lineChartData.push({
          label: 'ჯგუფის საშუალო',
          data: [],
        });
      }
    }
    _lineChartData.forEach((data) => {
      data.data.reverse();
    });
    let tmpMonth = new Date().getMonth();
    let monthLiteral;
    for (let i = 0; i < months; i++) {
      monthLiteral = this.monthNames[tmpMonth - 1];
      this.lineChartLabels.push(monthLiteral);
      tmpMonth = (tmpMonth === 1) ? 12 : tmpMonth - 1;
    }
    this.lineChartLabels.reverse();
    this.lineChartData = _lineChartData;
    this.lineChartDataAvailable = true;
    this.dataIsLoading = false;
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
    this.loadLineChartData(this.selected.value, (this.selectedTab.value + 1) * 3);
  }

  getBankStatistics() {
    this.network.getRequest('/bonusRewards/getBankStatistics')
      .subscribe(
        (response: any) => {
          this.bankStatistics = response;
        });
  }

}

export interface BranchStatistics {
  branchesMax: number;
  branchesMean: number;
  currentBranchSales: number;
}

export interface BankTotalStatistics {
  bonusBankMax: number;
  bonusBankMean: number;
  salesBankMax: number;
  salesBankMean: number;
}
