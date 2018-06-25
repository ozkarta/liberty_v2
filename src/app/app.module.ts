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

// Module Imports
import { RoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

// Service Imports
import { AuthService } from './services/auth.service';
import { RouteGuardService } from './services/route-guard.service';
import { LoggedOutGuardService } from './services/logged-out-guard.service';

// Material Design Imports
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import {OtherUserService} from './services/other-user.service';
import { ProductAddDialogComponent } from './product-add-dialog/product-add-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AuthorizedUserService} from './services/authorized-user.service';

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
    MatSlideToggleModule
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
