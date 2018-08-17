import {Component, OnInit} from '@angular/core';
import {NetworkingService} from '../../services/networking.service';
import {ProductModel} from '../../models/product.model';
import {EvaluationGroup} from '../evaluation-group/evaluation-group.component';

@Component({
  selector: 'app-product-competence-level',
  templateUrl: './product-competence-level.component.html',
  styleUrls: ['./product-competence-level.component.css'],
})
export class ProductCompetenceLevelComponent implements OnInit {
  products: ProductModel[] = [];
  groups: EvaluationGroup[] = [];
  tableShown = true;

  constructor(private network: NetworkingService) {
  }

  ngOnInit() {
    this.getEvaluationGroups();
    this.getProducts();
  }

  getProducts() {
    this.network.getRequest('/products/all')
      .subscribe(
        (groups: ProductModel[]) => {
          groups.sort((a, b) => {
            return a.productMotivationalBlockTypeId - b.productMotivationalBlockTypeId || a.sortOrder - b.sortOrder;
          });
          groups.forEach((g) => {
            this.products.push(g);
          });
        });
  }

  getEvaluationGroups() {
    this.network.getRequest('/evaluationGroups/all')
      .subscribe(
        (response: EvaluationGroup[]) => {
          response.forEach((b) => {
            this.groups.push(b);
          });
        });
  }

  getMinSale(groupId: number, prodId: number) {
    const product = this.products.find(p => p.id === prodId);
    for (let i = 0; i < product.competenceLevels.length; i++) {
      if (product.competenceLevels[i].evaluationGroup.id === groupId) {
        return product.competenceLevels[i].productMinSales.toString();
      }
    }
    return '0';
  }

  getStartPoint(groupId: number, prodId: number): string {
    const product = this.products.find(p => p.id === prodId);
    for (let i = 0; i < product.competenceLevels.length; i++) {
      if (product.competenceLevels[i].evaluationGroup.id === groupId) {
        return product.competenceLevels[i].productBonusPointStart.toString();
      }
    }
    return '0';
  }

  updateMinSale(prodId: number, groupId: number, event: any) {
    // this.products.length = 0;
    // this.groups.length = 0;
    const data = {
      productId: prodId,
      evaluationGroupId: groupId,
      productMinSales: event.target.value,
      productBonusPointStart: null,
    };
    this.network.putRequest(data, '/products/editCompetenceLevel')
      .subscribe(
        () => {
          // this.tableShown = false;
          // this.getProducts();
          // this.getEvaluationGroups();
          // this.tableShown = true;
          const product = this.products.find(p => p.id === prodId);
          for (let i = 0; i < product.competenceLevels.length; i++) {
            if (product.competenceLevels[i].evaluationGroup.id === groupId) {
              product.competenceLevels[i].productMinSales = event.target.value;
            }
          }
        });
  }

  updateStartPoint(prodId: number, groupId: number, event: any) {
    // this.products.length = 0;
    // this.groups.length = 0;
    const data = {
      productId: prodId,
      evaluationGroupId: groupId,
      productMinSales: null,
      productBonusPointStart: event.target.value,
    };
    this.network.putRequest(data, '/products/editCompetenceLevel')
      .subscribe(
        () => {
          // this.tableShown = false;
          // this.getProducts();
          // this.getEvaluationGroups();
          // this.tableShown = true;
          const product = this.products.find(p => p.id === prodId);
          for (let i = 0; i < product.competenceLevels.length; i++) {
            if (product.competenceLevels[i].evaluationGroup.id === groupId) {
              product.competenceLevels[i].productBonusPointStart = event.target.value;
            }
          }
        });
  }

}

export interface EvalGroup {
  evaluationGroup: EvaluationGroup;
  id: number;
  productBonusPointStart: number;
  productMinSales: number;
  status: string;
}
