import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ProductModel} from '../../models/product.model';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productGroups: ProductModel[] = [];
  initialProducts: InitialProduct[] = [];

  constructor(private auth: AuthService, private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  ngOnInit() {
    this.getInitialProducts();
    this.getProductGroups();
  }
  private onDrag(args) {
    let [e, el] = args;
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
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

  dragStarted(event: any) {
    console.log(event);
  }
  drugEnd(event: any) {
    console.log(event);
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
