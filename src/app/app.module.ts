// Angular Common Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Component Imports
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { BonusPointsComponent } from './bonus-points/bonus-points.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { ProductAddDialogComponent } from './product-add-dialog/product-add-dialog.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { DialogComponent } from './dialog/dialog.component';
import { BranchTransactionsComponent } from './branch-transactions/branch-transactions.component';
import { OrganizationStructureComponent } from './organization-structure/organization-structure.component';

// Module Imports
import { RoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Service Imports
import { AuthService } from './services/auth.service';
import { RouteGuardService } from './services/route-guard.service';
import { LoggedOutGuardService } from './services/logged-out-guard.service';
import { OtherUserService } from './services/other-user.service';
import { AuthorizedUserService } from './services/authorized-user.service';

// Material Design Imports
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { ProductWikiComponent } from './product-wiki/product-wiki.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    EmployeeListComponent,
    BonusPointsComponent,
    TransactionsComponent,
    DialogComponent,
    OtherUserProfileComponent,
    ProductAddDialogComponent,
    MyTransactionsComponent,
    BranchTransactionsComponent,
    OrganizationStructureComponent,
    ProductWikiComponent,
  ],
  imports: [
    HttpClientModule,
    RoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatGridListModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatExpansionModule,
    MatRadioModule,
    PdfViewerModule,
  ],
  providers: [
    AuthService,
    RouteGuardService,
    LoggedOutGuardService,
    OtherUserService,
    AuthorizedUserService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, ProductAddDialogComponent],
})
export class AppModule {
}
