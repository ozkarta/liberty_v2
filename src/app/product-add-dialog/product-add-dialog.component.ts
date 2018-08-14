import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {MatDialogRef, MatSelect} from '@angular/material';

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
  @ViewChild('motivationBlock') motivationBlock: MatSelect;

  constructor(private network: NetworkingService,
              private dialogRef: MatDialogRef<ProductAddDialogComponent>) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.network.getRequest('/bonusSystems')
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
      productMotivationalBlockTypeId: this.motivationBlock.value,
    };
    this.network.postRequest(data, '/products/add')
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
