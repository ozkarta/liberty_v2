import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NetworkingService} from './services/networking.service';
import {Router} from '@angular/router';
import {networkorizedUserService} from './services/authorized-user.service';
import {LibertyUserModel} from './models/liberty-user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  options: FormGroup;
  isnetworkorized = false;
  userData: LibertyUserModel;

  constructor(public network: NetworkingService, fb: FormBuilder, public router: Router, private currentUser: networkorizedUserService) {
    this.options = fb.group({
      fixed: true,
    });
  }

  ngOnInit() {
    this.checkLoginStatus().then(() => {
      if (this.isnetworkorized) {
        this.network.getLoggedUser().then(() => {
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
    this.network.isnetworkorized()
      .subscribe(
        (isLoggedIn: boolean) => {
          this.isnetworkorized = isLoggedIn;
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
