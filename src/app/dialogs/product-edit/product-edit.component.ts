import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BonusSystemEditComponent} from '../bonus-system-edit/bonus-system-edit.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProductModel} from '../../models/product.model';
import {BonusSystem} from '../../admin/bonus-systems/bonus-systems.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  product: ProductModel;
  dataAvailable = false;
  bonusSystems: BonusSystem[] = [];

  constructor(public dialogRef: MatDialogRef<ProductEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number, private auth: AuthService) { }

  ngOnInit() {
    this.auth.getRequest(`/products/${this.data}`)
      .subscribe(
        (product: ProductModel) => {
          this.product = product;
          this.dataAvailable = true;
        });
    this.getBonusSystems();
  }
  getBonusSystems() {
    this.auth.getRequest('/bonusSystems/all')
      .subscribe(
        (systems: BonusSystem[]) => {
          systems.forEach((b) => {
            this.bonusSystems.push(b);
          });
        });
  }
  saveEditing() {
    const data = {
      productId: this.product.id,
      name: this.product.name,
      bonusSystemId: this.product.bonusSystem.id,
      bonusPoints: this.product.bonusPoints,
      productMotivationalBlockTypeId: this.product.productMotivationalBlockTypeId,
    };

    this.auth.putRequest(data, `/products/edit`)
      .subscribe(
        () => {
          this.dialogRef.close(true);
        });
  }

}
