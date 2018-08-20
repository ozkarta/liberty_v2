import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {AuthorizedUserService} from '../../services/authorized-user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NetworkingService} from '../../services/networking.service';
const ELEMENT_DATA: any[] = [
  {id: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {id: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {id: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {id: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {id: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {id: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {id: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {id: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {id: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {id: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-admin-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.style.css'],
})

export class AdminProductCategoriesComponent implements OnInit, OnDestroy {
  public categories: any[] = [];
  public displayedColumns;
  public dataSource: any;
  newCategory: any = {
    id: '',
    name: ''
  };
  constructor(private currentUser: AuthorizedUserService,
              private router: Router,
              private network: NetworkingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCategories();
    this.displayedColumns = ['id', 'name', 'edit'];
    this.dataSource = ELEMENT_DATA;
  }

  ngOnDestroy() {
  }

  getCategories() {
    this.network.getRequest('/liberty-category/all') // TODO too many calls for the page, API needs to be refactored
      .subscribe(
        (categories: any[]) => {
          if (categories) {
            // Mutate Category
            this.categories = categories.map(category => {
              category['ACTION_TYPE'] = 'VIEW';
              return category;
            });

            console.dir(this.categories);
          }
        },
        (error: Error) => {
          // TODO handle
          console.dir(error);
        }
      );
  }

  editCategory(event: Event, category) {
    this.categories[this.categories.indexOf(category)] && (this.categories[this.categories.indexOf(category)]['ACTION_TYPE'] = 'EDIT');
    console.dir(this.categories);

    event.preventDefault();
  }

  saveCategory($event: Event, category) {
    this.updateCategory(category.id, category);
    event.preventDefault();
  }

  deleteCategory($event: Event, category) {
    console.dir(category);
    this.network.deleteRequest(`/liberty-category/delete/${category.id}`)
      .subscribe(
        (success) => {
          this.categories.splice(this.categories.indexOf(category), 1);
          const catCP = Object.assign([], this.categories);
          this.categories = [];
          this.categories = catCP;
        },
        (error: Error) => {
          console.dir(error);
        }
      )
    event.preventDefault();
  }
  // HTTP records

  updateCategory(categoryId, category) {
    this.network.putRequest(category, `/liberty-category/update/${categoryId}`)
      .subscribe(
        (success) => {
          this.categories[this.categories.indexOf(category)]['ACTION_TYPE'] = 'VIEW';
        },
        (error: Error) => {
          console.dir(error);
        }
      );
  }

  createCategory() {
    this.network.postRequest(this.newCategory, '/liberty-category/add')
      .subscribe(
        (category) => {
          this.newCategory = {
            id: '',
            name: ''
          };
          if (category && category.id) {
            this.loadCategoryById(category.id);
          }
        },
        (error: Error) => {
          console.dir(error);
          // TODO handle
        }
      );
  }

  loadCategoryById(categoryId) {
    this.network.getRequest(`/liberty-category/${categoryId}`)
      .subscribe(
        (category: any) => {
          category['ACTION_TYPE'] = 'VIEW';
          this.categories.push(category);
          const catCP = Object.assign([], this.categories);
          this.categories = [];
          this.categories = catCP;
        }
      );
  }
}
