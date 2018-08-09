import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
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
    this.checkLoginStatus().then(() => {
      if (this.isAuthorized) {
        this.auth.getLoggedUser().then(() => {
          this.setUser();
        });
      } else {
        this.setUser();
      }
    });
  }

  setUser() {
    this.currentUser.getUser
      .subscribe(
        (userData: LibertyUserModel) => {
          this.checkLoginStatus().then(() => {
            this.userData = userData;
          });
        });
  }

  async checkLoginStatus() {
    this.auth.isAuthorized()
      .subscribe(
        (isLoggedIn: boolean) => {
          this.isAuthorized = isLoggedIn;
        });
  }

  logout() {
    localStorage.clear();
    this.checkLoginStatus().then(() => {
      this.router.navigate(['login']).then(
        (wtf) => {
          console.log(wtf);
        });
    });
  }
}
