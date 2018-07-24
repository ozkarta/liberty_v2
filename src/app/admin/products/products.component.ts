import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductModel } from '../../models/product.model';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import {MatDialog} from '@angular/material';
import {AddBonusSystemComponent} from '../../dialogs/add-bonus-system/add-bonus-system.component';
import {ProductAddDialogComponent} from '../../product-add-dialog/product-add-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  productGroups: ProductModel[] = [];
  initialProducts: InitialProduct[] = [];
  private subscription: Subscription;

  constructor(private auth: AuthService, private dragulaService: DragulaService, public dialog: MatDialog) {
    this.subscription = dragulaService.drag.subscribe((value) => {
    });
    const dropSub = dragulaService.drop.subscribe((value) => {
      this.mapProduct(value[2].getAttribute('groupid'), value[1].getAttribute('groupid'));
    });
    this.subscription.add(dropSub);
    const overSub = dragulaService.over.subscribe((value) => {
    });
    this.subscription.add(overSub);
    const outSub = dragulaService.out.subscribe((value) => {
    });
    this.subscription.add(outSub);
  }

  ngOnInit() {
    this.getInitialProducts();
    this.getProductGroups();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getInitialProducts() {
    this.auth.getRequest('/products/getAllInitialProducts')
      .subscribe(
        (products: InitialProduct[]) => {
          products.forEach((p) => {
            this.initialProducts.push(p);
          });
        });
  }

  getProductGroups() {
    this.auth.getRequest('/products/all')
      .subscribe(
        (groups: ProductModel[]) => {
          groups.forEach((g) => {
            this.productGroups.push(g);
          });
        });
  }
  mapProduct(productId: any, initialId: any) {
    this.auth.putRequest(parseInt(productId), `/products/initialProduct/${initialId}/mapToProduct`)
      .subscribe(
        (response: any) => {
          const prod = this.productGroups.find(p => p.id === parseInt(productId));
          prod.initialProducts.push(response);
        });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: '500px',
      data: 'product',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      //   this.getBonusSystems();
      //   this.editBonusSystem(result);
      // }
    });
  }
}

export interface InitialProduct {
  externalId: number;
  id: number;
  name: string;
  product?: ProductModel;
  productCode: string;
  status: string;
}
