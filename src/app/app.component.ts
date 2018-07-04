import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from './models/user.model';
import {AuthorizedUserService} from './services/authorized-user.service';
import {LibertyUserModel} from './models/liberty-user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  options: FormGroup;
  isAuthorized = false;
  userData: LibertyUserModel;

  constructor(public auth: AuthService, fb: FormBuilder, private router: Router, private currentUser: AuthorizedUserService) {
    this.options = fb.group({
      fixed: true,
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events
      .subscribe(
        () => {
          this.checkLoginStatus();
        });
    if (this.auth.isAuthorized()) {
      this.auth.getLoggedUser();
      this.auth.getLoggedUserOperations();
      this.auth.getLoogedUserBonuses();
    }
    this.setUser();
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          this.userData = userData;
        });
  }

  checkLoginStatus() {
    this.auth.isAuthorized()
      .subscribe(
        (isLoggedIn: boolean) => {
          this.isAuthorized = isLoggedIn;
        });
  }

  logout() {
    this.auth.setCookie('access_token', '', 0, -1);
    this.auth.setCookie('refresh_token', '', 0, -1);
    this.router.navigate(['login']);
  }
}
