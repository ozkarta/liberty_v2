import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NetworkingService} from '../../services/networking.service';
@Component({
  selector: 'app-product-category-form',
  templateUrl: 'product-category-form.component.html',
  styleUrls: ['./product-category-form.style.css'],
})
export class ProductCategoryFormComponent implements OnInit{
  errorMessage = '';
  constructor(
    public dialogRef: MatDialogRef<ProductCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private network: NetworkingService
  ) {}

  ngOnInit() {
    console.log('Edit Form is initialized');
  }

  onDismiss(event: Event) {
    this.dialogRef.close({type: 'dismiss'});
    event.preventDefault();
  }

  onSummit(event: Event) {
    if (this.data.type === 'create') {
      this.createCategory();
    }
    if (this.data.type === 'update') {
      this.updateCategory();
    }
    event.preventDefault();
  }

  // HTTP

  createCategory() {
    this.network.postRequest(this.data['category'], '/liberty-category/add')
      .subscribe(
        (category) => {
          this.dialogRef.close({type: 'create', data: category});
        },
        (error: Error) => {
          if (!this.data.type) {
            this.errorMessage = error.message;
            return;
          }

          this.errorMessage = 'შეცდომა კატეგორიის დამატების დროს.';
        }
      );
  }

  updateCategory() {
    this.network.putRequest(this.data['category'], `/liberty-category/update/${this.data['category']['id']}`)
      .subscribe(
        (category) => {
          this.dialogRef.close({type: 'update', data: category});
        },
        (error: Error) => {
          console.dir(error);
          if (!this.data.type) {
            this.errorMessage = error.message;
            return;
          }

          if (error['status'] === 406) {
            this.errorMessage = 'ასეთი კატეგორიის ID უკვე არსებობს';
            return;
          }

          this.errorMessage = 'შეცდომა კატეგორიის განახლების დროს.';
        }
      );
  }
}
