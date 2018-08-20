// Angular Common Imports
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import { BranchTransactionsComponent } from './branch-transactions/branch-transactions.component';
import { OrganizationStructureComponent } from './organization-structure/organization-structure.component';
import { ProductWikiComponent } from './product-wiki/product-wiki.component';

// Module Imports
import { RoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DragulaModule } from 'ng2-dragula';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { FileUploadModule } from 'ng2-file-upload';
import { TinymceModule } from 'angular2-tinymce';
// Service Imports
import { NetworkingService } from './services/networking.service';
import { RouteGuardService } from './guards/route-guard.service';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BonusSystemsComponent } from './admin/bonus-systems/bonus-systems.component';
import { AddBonusSystemComponent } from './dialogs/add-bonus-system/add-bonus-system.component';
import { EvaluationGroupComponent } from './admin/evaluation-group/evaluation-group.component';
import { BonusSystemEditComponent } from './dialogs/bonus-system-edit/bonus-system-edit.component';
import { ProductsComponent } from './admin/products/products.component';
import { BranchBonusSystemComponent } from './admin/branch-bonus-system/branch-bonus-system.component';
import { StaffLevelBonusesComponent } from './admin/staff-level-bonuses/staff-level-bonuses.component';
import { TableModule } from 'primeng/table';
import { ProductDocumentationComponent } from './admin/product-documentation/product-documentation.component';
import { GroupIdDirective } from './directives/group-id.directive';
import { PickListModule } from 'primeng/picklist';
import { ProductReorderingComponent } from './admin/product-reordering/product-reordering.component';
import { ProductCompetenceLevelComponent } from './admin/product-competence-level/product-competence-level.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { MatMenuModule, MatSortModule, MatListModule } from '@angular/material';
import { EvaluationGroupEditComponent } from './dialogs/evaluation-group-edit/evaluation-group-edit.component';
import { ProductEditingComponent } from './admin/product-editing/product-editing.component';
import { ProductEditComponent } from './dialogs/product-edit/product-edit.component';
import { AdditionalParametersComponent } from './admin/additional-parameters/additional-parameters.component';
import { RecalculateBonusComponent } from './admin/recalculate-bonus/recalculate-bonus.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { ConfigModule, ConfigService } from '@lbge/config';
import { AuthModule, AuthService, AuthGuard } from '@lbge/auth';
import { AuthConfig } from '@lbge/auth/lib/models';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
// import {ErrorsHandler} from './handlers/errors-handler';
// import {ServerErrorsInterceptor} from './handlers/server-errors.interceptor';


// Admin Imports
import { AdminKnowledgeBaseComponent } from './admin/knowledge-base/knowledge-base.component';
import { AdminProductCategoriesComponent } from './admin/product-categories/product-categories.component';
// Shared imports
import { KnowledgeBaseMenuComponent } from './shared/components/knowledge-base-menu/knowledge-base-menu.component';

export function initializeApp(appConfig: NetworkingService) {
  return () => appConfig.getUrl();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    EmployeeListComponent,
    BonusPointsComponent,
    TransactionsComponent,
    OtherUserProfileComponent,
    ProductAddDialogComponent,
    MyTransactionsComponent,
    BranchTransactionsComponent,
    OrganizationStructureComponent,
    ProductWikiComponent,
    BonusSystemsComponent,
    AddBonusSystemComponent,
    EvaluationGroupComponent,
    BonusSystemEditComponent,
    ProductsComponent,
    BranchBonusSystemComponent,
    StaffLevelBonusesComponent,
    ProductDocumentationComponent,
    GroupIdDirective,
    ProductReorderingComponent,
    ProductCompetenceLevelComponent,
    EvaluationGroupEditComponent,
    ProductEditingComponent,
    ProductEditComponent,
    AdditionalParametersComponent,
    RecalculateBonusComponent,
    KnowledgeBaseComponent,
    AdminProductCategoriesComponent,
    // KnowledgeBaseComponentAdmin,

    // Admin
    AdminKnowledgeBaseComponent,
    // Shared
    KnowledgeBaseMenuComponent,
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
    MatProgressSpinnerModule,
    DragulaModule,
    TableModule,
    PickListModule,
    DragDropModule,
    ContextMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatListModule,
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    MatMenuModule,
    FileUploadModule,
    TinymceModule.withConfig({}),
    ConfigModule.forRoot('assets/config.json'),
    AuthModule,
  ],
  providers: [
    NetworkingService,
    RouteGuardService,
    LoggedOutGuardService,
    OtherUserService,
    AuthorizedUserService,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [NetworkingService], multi: true }
    // {
    //   provide: ErrorHandler,
    //   useClass: ErrorsHandler,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ServerErrorsInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ProductAddDialogComponent,
    AddBonusSystemComponent,
    BonusSystemEditComponent,
    EvaluationGroupEditComponent,
    ProductEditComponent,
  ],
})
export class AppModule {
  constructor(private auth: AuthService,
              private configService: ConfigService,
              private activatedRoute: ActivatedRoute,
              private network: NetworkingService,
              private router: Router,
              private http: HttpClient) {
    // this.configService.get('auth').subscribe((config: AuthConfig) => {
    //   this.auth.init(config);
    //   this.activatedRoute.fragment
    //     .subscribe(
    //       () => {
    //         const hash = window.location.hash;
    //         if (hash.split('&').length > 2) {
    //           const access = hash.split('&')[1];
    //           if (access.split('=')[0] === 'access_token') {
    //             this.network.setCookie('access_token', access.split('=')[1], 0, 0);
    //             this.router.navigate(['/home']);
    //           }
    //         }
    //       });
    // });
  }
}
