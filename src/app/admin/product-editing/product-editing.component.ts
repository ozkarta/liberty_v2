import {Component, OnInit} from '@angular/core';
import {ProductModel} from '../../models/product.model';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ProductEditComponent} from '../../dialogs/product-edit/product-edit.component';

@Component({
  selector: 'app-product-editing',
  templateUrl: './product-editing.component.html',
  styleUrls: ['./product-editing.component.css']
})
export class ProductEditingComponent implements OnInit {
  products: ProductModel[] = [];
  displayedColumns = ['name', 'bonusPoints', 'bonusSystem', 'productMotivationalBlockType'];
  dataSource = new MatTableDataSource();

  constructor(private auth: AuthService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getProductGroups();
  }

  getProductGroups() {
    this.products.length = 0;
    this.auth.getRequest('/products/all')
      .subscribe(
        (product: ProductModel[]) => {
          product.forEach((p) => {
            this.products.push(p);
          });
          this.dataSource.data = this.products;
        });
  }

  editProduct(id: number) {
    const dialog = this.dialog.open(ProductEditComponent, {
      width: '500px',
      data: id,
    });
    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.getProductGroups();
        }
      });
  }
}
