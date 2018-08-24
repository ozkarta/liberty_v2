import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {NetworkingService} from '../services/networking.service';
import {MyOperationsModel} from '../models/my-operations.model';
import {AuthorizedUserService} from '../services/authorized-user.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css'],
})
export class MyTransactionsComponent implements OnInit {
  myTotalBonus = 0;
  myTotalOperations = 0;

  groupMinSumBonus = 0;
  groupAvgSumBonus = 0;
  groupMaxSumBonus = 0;
  bankMinSumBonus = 0;
  bankAvgSumBonus = 0;
  bankMaxSumBonus = 0;

  groupMinSumOperations = 0;
  groupAvgSumOperations = 0;
  groupMaxSumOperations = 0;
  bankMinSumOperations = 0;
  bankAvgSumOperations = 0;
  bankMaxSumOperations = 0;


  dataLoaded = false;
  displayedColumns = [
    'motivation',
    'productName',
    'userResult',
    'groupRating',
    'bankrating',
    'groupMin',
    'groupAverage',
    'groupMax',
    'bankMin',
    'bankAverage',
    'bankmax',
  ];

  // cols = [
  //   { field: 'motivation', header: 'სამოტივაციო ბლოკი' },
  //   { field: 'productName', header: 'პროდუქტი' },
  //   { field: 'myOwn', header: 'ჩემი შედეგი' },
  //   { field: 'groupRating', header: 'რეიტინგი ჯგუფში' },
  //   { field: 'bankRating', header: 'რეიტინგი ბანკში' },
  //   { field: 'groupMin', header: 'ჯგუფის მინიმუმი' },
  //   { field: 'groupAvg', header: 'ჯგუფის საშუალო' },
  //   { field: 'groupMax', header: 'ჯგუფის მაქსიმუმი' },
  //   { field: 'bankMin', header: 'ბანკის მინიმუმი' },
  //   { field: 'bankAvg', header: 'ბანკის საშუალო' },
  //   { field: 'bankMax', header: 'ბანკის მაქსიმუმი' },
  // ];
  myBonuses: MyOperationsModel[] = [];

  saleQuantities: MyOperationsModel[] = [];
  checked = false;

  dataSourceSales: MatTableDataSource<MyOperationsModel>;
  dataSourceBonuses: MatTableDataSource<MyOperationsModel>;

  @ViewChild('downloadFile') private downloadExcel: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkingService, private currentUser: AuthorizedUserService) {
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
            bonuses = bonuses.filter(b => b.product.productMotivationalBlockType !== 'OTHER');
            bonuses.forEach((b) => {
              b.productName = b.product.name;
              b.motivation = b.product.productMotivationalBlockType === 'ACQUISITION' ?
                'მოზიდვა' : b.product.productMotivationalBlockType === 'CREDIT_ISSUANCE' ? 'დაკრედიტება' : 'მომსახურება';
              this.myBonuses.push(b);
            });
            this.dataSourceBonuses = new MatTableDataSource(this.myBonuses);
            this.dataSourceBonuses.sort = this.sort;
            this.getMyResultSum();
            this.getMyResultSumOperations();
            this.dataLoaded = true;
          }
        });
  }

  getMySales() {
    this.currentUser.getMyOperations
      .subscribe(
        (operations: MyOperationsModel[]) => {
          if (operations) {
            operations = operations.filter(b => b.product.productMotivationalBlockType !== 'OTHER');
            operations.forEach((b) => {
              b.productName = b.product.name;
              b.motivation = b.product.productMotivationalBlockType === 'ACQUISITION' ?
                'მოზიდვა' : b.product.productMotivationalBlockType === 'CREDIT_ISSUANCE' ? 'დაკრედიტება' : 'მომსახურება';
              this.saleQuantities.push(b);
            });
            this.dataSourceSales = new MatTableDataSource(this.saleQuantities);
            this.dataSourceSales.sort = this.sort;
            this.dataLoaded = true;
          }
        });
  }

  onSlideChange() {
    this.checked = !this.checked;
  }

  export() {
    let url;
    let ids = '';
    if (this.checked) {
      url = '/bonusRewards/exportCurrentMonthBonuses?';
      if (this.dataSourceBonuses.filter !== '') {
        this.dataSourceBonuses.filteredData.forEach((p) => {
          ids += 'productId=' + p.product.id + '&';
        });
        url += ids;
      }
    } else {
      url = '/sales/exportCurrentMonthSales?';
      if (this.dataSourceSales.filter !== '') {
        this.dataSourceSales.filteredData.forEach((p) => {
          ids += 'productId=' + p.product.id + '&';
        });
        url += ids;
      }
    }

    this.network.getRequestDownload(url)
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

  getMyResultSum() {
    this.dataSourceBonuses.data.forEach((d) => {
      this.myTotalBonus += d.userResult;
      this.groupMinSumBonus += d.groupMin;
      this.groupAvgSumBonus += d.groupAverage;
      this.groupMaxSumBonus += d.groupMax;
      this.bankMinSumBonus += d.bankMin;
      this.bankAvgSumBonus += d.bankAverage;
      this.bankMaxSumBonus += d.bankmax;
    });
  }

  getMyResultSumOperations() {
    this.dataSourceSales.data.forEach((d) => {
      this.myTotalOperations += d.userResult;
      this.groupMinSumOperations += d.groupMin;
      this.groupAvgSumOperations += d.groupAverage;
      this.groupMaxSumOperations += d.groupMax;
      this.bankMinSumOperations += d.bankMin;
      this.bankAvgSumOperations += d.bankAverage;
      this.bankMaxSumOperations += d.bankmax;
    });
  }
}
