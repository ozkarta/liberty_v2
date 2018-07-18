import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.css'],
})
export class ProductAddDialogComponent implements OnInit {
  @ViewChild('productName') productName: ElementRef;
  @ViewChild('productPoints') bonusValue: ElementRef;
  @ViewChild('minSaleQuantity') minSaleQuantity: ElementRef;
  @ViewChild('startPoint') startPoint: ElementRef;
  selectedOption = 0;
  bonusSystems: BonusSystem[] = [];

  constructor(private auth: AuthService,
              private dialogRef: MatDialogRef<ProductAddDialogComponent>) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.auth.getRequest('/bonusSystems')
      .subscribe(
        (response: BonusSystem[]) => {
          this.bonusSystems = response;
          console.log(this.bonusSystems);
        });
  }

  addProduct() {
    const data = {
      name: this.productName.nativeElement.value,
      bonusSystemId: this.selectedOption,
      bonusPoints: this.bonusValue.nativeElement.value,
      minSales: this.minSaleQuantity.nativeElement.value,
      bonusStartPoint: this.startPoint.nativeElement.value,
    };
    this.auth.postRequest(data, '/products/add')
      .subscribe(
        () => {
          this.dialogRef.close();
        });
  }
}

export interface BonusSystem {
  id: number;
  name: string;
  status: string;
}
