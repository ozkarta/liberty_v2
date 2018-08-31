import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouteGuardService } from './guards/route-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoggedOutGuardService } from './services/logged-out-guard.service';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BonusPointsComponent } from './bonus-points/bonus-points.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { BranchTransactionsComponent } from './branch-transactions/branch-transactions.component';
import { OrganizationStructureComponent } from 'src/app/organization-structure/organization-structure.component';
import { ProductWikiComponent } from './product-wiki/product-wiki.component';
import { BonusSystemsComponent } from './admin/bonus-systems/bonus-systems.component';
import { AdminGuard } from './guards/admin.guard';
import { EvaluationGroupComponent } from './admin/evaluation-group/evaluation-group.component';
import { ProductsComponent } from './admin/products/products.component';
import { BranchBonusSystemComponent } from './admin/branch-bonus-system/branch-bonus-system.component';
import { StaffLevelBonusesComponent } from './admin/staff-level-bonuses/staff-level-bonuses.component';
import { ProductDocumentationComponent } from './admin/product-documentation/product-documentation.component';
import { ProductReorderingComponent } from './admin/product-reordering/product-reordering.component';
import { ProductCompetenceLevelComponent } from './admin/product-competence-level/product-competence-level.component';
import { ProductEditingComponent } from './admin/product-editing/product-editing.component';
import { AdditionalParametersComponent } from './admin/additional-parameters/additional-parameters.component';
import { RecalculateBonusComponent } from './admin/recalculate-bonus/recalculate-bonus.component';
// import { KnowledgeBaseComponentAdmin } from './admin/knowledge-base/knowledge-base.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

// Admin Imports
import { AdminKnowledgeBaseComponent } from './admin/knowledge-base/knowledge-base.component';
import { AdminProductCategoriesComponent } from './admin/product-categories/product-categories.component';
import {EvaluationGroupListComponent} from './evaluation-group-list/evaluation-group-list.component';
import { AdminUncategorizedProductsComponent } from "./admin/uncotegoriesed-products/uncotegoriesed-products.component";

const appRoutes: Routes = [











  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuardService] },
  { path: 'bonus/profile', component: UserProfileComponent, canActivate: [RouteGuardService] },
  { path: 'bonus/my-transactions', component: MyTransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'bonus/org-chart', component: OrganizationStructureComponent, canActivate: [RouteGuardService] },
  { path: 'bonus/employees', component: EmployeeListComponent, canActivate: [RouteGuardService] },
  { path: 'bonus/branch-bonuses', component: BonusPointsComponent, canActivate: [RouteGuardService] },
  { path: 'knowledge-base', component: KnowledgeBaseComponent, canActivate: [RouteGuardService] },
  { path: 'knowledge-base/:productId', component: KnowledgeBaseComponent, canActivate: [RouteGuardService] },
  { path: 'bonus', redirectTo: '/bonus/profile', canActivate: [RouteGuardService] },
  { path: 'profile', redirectTo: '/bonus/profile', canActivate: [RouteGuardService] },
  { path: 'my-transactions', redirectTo: '/bonus/my-transactions', canActivate: [RouteGuardService] },
  { path: 'branch-bonuses', redirectTo: '/bonus/branch-bonuses', canActivate: [RouteGuardService] },
  { path: 'employees', redirectTo: '/bonus/employees', canActivate: [RouteGuardService] },
  { path: 'org-chart', redirectTo: '/bonus/org-chart', canActivate: [RouteGuardService] },

  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },

  // { path: 'profile', component: UserProfileComponent, canActivate: [RouteGuardService] },
  { path: 'others/:id', component: OtherUserProfileComponent, canActivate: [RouteGuardService] },
  // { path: 'employees', component: EmployeeListComponent, canActivate: [RouteGuardService] },
  // { path: 'branch-bonuses', component: BonusPointsComponent, canActivate: [RouteGuardService] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'evaluation-group-list/:id', component: EvaluationGroupListComponent, canActivate: [RouteGuardService] },
  // { path: 'my-transactions', component: MyTransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'my-branch-transactions', component: BranchTransactionsComponent, canActivate: [RouteGuardService] },
  // { path: 'org-chart', component: OrganizationStructureComponent, canActivate: [RouteGuardService] },
  { path: 'product', component: ProductWikiComponent, canActivate: [RouteGuardService] },
  // { path: 'knowledge-base', component: KnowledgeBaseComponent, canActivate: [RouteGuardService] },
  // { path: 'knowledge-base/product/:productId', component: KnowledgeBaseComponent, canActivate: [RouteGuardService] },

  { path: 'admin/bonus-systems', component: BonusSystemsComponent, canActivate: [AdminGuard] },
  { path: 'admin/evaluation-groups', component: EvaluationGroupComponent, canActivate: [AdminGuard] },
  { path: 'admin/products', component: ProductsComponent, canActivate: [AdminGuard]  },
  { path: 'admin/branch-bonus-system', component: BranchBonusSystemComponent, canActivate: [AdminGuard] },
  { path: 'admin/staff-level-bonuses', component: StaffLevelBonusesComponent, canActivate: [AdminGuard] },
  { path: 'admin/product-documentation', component: ProductDocumentationComponent, canActivate: [AdminGuard] },
  { path: 'admin/product-reordering', component: ProductReorderingComponent, canActivate: [AdminGuard] },
  { path: 'admin/product-competence-level', component: ProductCompetenceLevelComponent, canActivate: [AdminGuard] },
  { path: 'admin/product-product-edit', component: ProductEditingComponent, canActivate: [AdminGuard] },
  { path: 'admin/additional-parameters', component: AdditionalParametersComponent, canActivate: [AdminGuard] },
  { path: 'admin/recalculate', component: RecalculateBonusComponent, canActivate: [AdminGuard] },
  { path: 'admin/knowledge-base', component: AdminKnowledgeBaseComponent, canActivate: [AdminGuard] },
  { path: 'admin/knowledge-base/product/new', component: AdminKnowledgeBaseComponent, canActivate: [AdminGuard] },
  { path: 'admin/knowledge-base/product/uncategorized-products', component: AdminUncategorizedProductsComponent, canActivate: [AdminGuard] },
  { path: 'admin/knowledge-base/product/:productId', component: AdminKnowledgeBaseComponent, canActivate: [AdminGuard] },
  { path: 'admin/product-categories', component: AdminProductCategoriesComponent, canActivate: [AdminGuard] },

  { path: '', redirectTo: 'bonus/profile', pathMatch: 'full' },
  { path: '**', redirectTo: 'bonus/profile', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
})
export class RoutingModule {
}
