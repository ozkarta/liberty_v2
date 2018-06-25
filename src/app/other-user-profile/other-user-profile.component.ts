import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';
import { OtherUserService } from '../services/other-user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.css'],
})
export class OtherUserProfileComponent implements OnInit, OnDestroy {
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
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  summedProductData: SummerProductData = { name: '', value: 0 };

  userData: UserProfileData;

  progressBarData: LastTwoMonthBonuses[] = [];

  lineChartDataAvailable = false;

  checked = false;

  private subscription: Subscription;

  dispersion = 0;

  userID: number;

  constructor(private auth: AuthService, private other: OtherUserService, private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.other.getSelectedUserId.subscribe(
      (id: number) => {
        if (id) {
          this.getUserData(id);
          this.getDispersion(id);
        } else {
          this.getUserData(parseInt(this.router.url.substr(this.router.url.length - 1)));
          this.getDispersion(parseInt(this.router.url.substr(this.router.url.length - 1)));
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUserData(id: number) {
    this.auth.getRequest(`/bonusRewards/getUserData/${id}`)
      .subscribe(
        (response: UserProfileData) => {
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

  getDispersion(id: number) {
    this.auth.getRequest(`/bonusRewards/getUserVariance?id=${id}`).subscribe(
      (response: number) => {
        this.dispersion = Math.round(response);
      });
  }

  loadChartData() {
    this.summedProductBonuses.forEach((item) => {
      this.doughnutChartData.push(item.value);
      this.doughnutChartLabels.push(item.name);
    });
  }

  loadProgressData() {
    this.userData.prorductsBonusesByMonths.forEach((item) => {
      this.progressBarData.push({
        name: item.product.name,
        currentMonth: item.productMonthBonuses[item.productMonthBonuses.length - 1].bonusReward,
        previousMonth: item.productMonthBonuses[item.productMonthBonuses.length - 2].bonusReward,
        saleQuantity: item.productMonthBonuses[item.productMonthBonuses.length - 1].saleQuantity,
        bankMax: item.productMonthBonuses[item.productMonthBonuses.length - 1].bankMax,
        percentage: item.productMonthBonuses[item.productMonthBonuses.length - 1].bonusReward / item.productMonthBonuses[item.productMonthBonuses.length - 1].bankMax * 100,
      });
    });
  }

  loadLineChartData(index: number) {
    this.lineChartData.length = 0;
    this.lineChartDataAvailable = false;
    const _lineChartData: Array<any> = new Array(this.lineChartData.length);
    _lineChartData.push({
      label: this.userData.prorductsBonusesByMonths[index].product.name,
      data: this.userData.prorductsBonusesByMonths[index].productMonthBonuses.map(number => number.bonusReward),
    });
    this.lineChartData = _lineChartData;
    this.lineChartDataAvailable = true;
  }

  mergeArrays() {
    for (let _i = 0; _i < this.doughnutChartLabels.length; _i++) {
      this.combinedArray.push({
        label: this.doughnutChartLabels[_i],
        color: this.doughnutChartColors[0].backgroundColor[_i],
      });
    }
  }
// events

  onSlideChange() {
    this.checked = !this.checked;
  }
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}

export interface UserProfileData {
  bankCurrentMonthMean: number;
  bonusByCurrentMonth: number;
  bonusByYear: number;
  firstName: string;
  highestCurrentMonth: number;
  lastName: string;
  productsBonusByMonth: any;
  productsBonusByYear: any;
  prorductsBonusesByMonths: any;
  email?: string;
  mobile?: string;
}

export interface SummerProductData {
  name?: string;
  value?: number;
}

export interface LastTwoMonthBonuses {
  name: string;
  currentMonth: number;
  previousMonth: number;
  saleQuantity?: number;
  bankMax: number;
  percentage: number;
}
