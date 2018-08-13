import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ProductModel} from '../../models/product.model';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {ProductAddDialogComponent} from '../../product-add-dialog/product-add-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productGroups: ProductModel[] = [];
  initialProducts: InitialProduct[] = [];
  private subscription: Subscription;
  draggedProduct: InitialProduct;
  unMapGroup: ProductModel;

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

  getInitialProducts() {
    this.auth.getRequest('/products/getAllInitialProducts')
      .subscribe(
        (products: InitialProduct[]) => {
          products.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
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

  dragStart(event, product: InitialProduct) {
    this.draggedProduct = product;
  }

  dragEnd() {
    this.draggedProduct = null;
    this.unMapGroup = null;
  }

  drop(groupId: number) {
    this.mapProduct(groupId, this.draggedProduct.id);
    this.initialProducts = this.initialProducts.filter(val => val !== this.draggedProduct);
  }

  unDragStart(product: InitialProduct, group: ProductModel) {
    this.draggedProduct = product;
    this.unMapGroup = group;
  }

  unDrop() {
    this.auth.putRequest(null, `/products/initialProducts/${this.draggedProduct.id}/removeMapping`)
    .subscribe(
      () => {});
    this.productGroups.find(p => p === this.unMapGroup).initialProducts = this.productGroups.find(p => p === this.unMapGroup).initialProducts.filter(val => val !== this.draggedProduct);
    this.initialProducts.push(this.draggedProduct);
    this.initialProducts.sort((a, b) => {
      const textA = a.name.toUpperCase();
      const textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
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
