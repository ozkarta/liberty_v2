import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouteGuardService } from './services/route-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoggedOutGuardService } from './services/logged-out-guard.service';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BonusPointsComponent } from './bonus-points/bonus-points.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { BranchTransactionsComponent } from './branch-transactions/branch-transactions.component';
import { OrganizationStructureComponent } from 'src/app/organization-structure/organization-structure.component';
import {ProductWikiComponent} from './product-wiki/product-wiki.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuardService] },
  { path: 'profile', component: UserProfileComponent, canActivate: [RouteGuardService] },
  { path: 'others/:id', component: OtherUserProfileComponent, canActivate: [RouteGuardService] },
  { path: 'employees', component: EmployeeListComponent, canActivate: [RouteGuardService] },
  { path: 'branch-bonuses', component: BonusPointsComponent, canActivate: [RouteGuardService] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'my-transactions', component: MyTransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'my-branch-transactions', component: BranchTransactionsComponent, canActivate: [RouteGuardService] },
  { path: 'org-chart', component: OrganizationStructureComponent, canActivate: [RouteGuardService] },
  { path: 'product', component: ProductWikiComponent, canActivate: [RouteGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class RoutingModule {
}
