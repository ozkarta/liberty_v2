import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('repeatPassword') repeatPassword: ElementRef;
  usernameExists = false;
  passwordExists = true;
  user = new FormControl();
  usernameVal = '';
  passwordVal = new FormControl();
  hide = true;
  hideRepeat = true;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  checkUsername() {
    this.auth.getRequest(`/users/checkUser?userName=${this.username.nativeElement.value}`)
      .subscribe(
        (response: any) => {
          if (response.userExists) {
            this.usernameVal = this.username.nativeElement.value;
            this.usernameExists = response.userExists;
            this.passwordExists = response.passwordExists;
          } else {
            this.user.setErrors({ notExists: true });
          }
        },
      );
  }

  login() {
    if (!this.passwordExists) {
      if (this.password.nativeElement.value === this.repeatPassword.nativeElement.value) {
        const data = {
          username: this.usernameVal,
          password: this.password.nativeElement.value,
        };
        this.auth.postRequest(data, '/auth/login')
          .subscribe(
            (tokens: any) => {
              this.auth.setCookie('access_token', tokens.access_token, 0, tokens.expires_in);
              this.auth.setCookie('refresh_token', tokens.refresh_token, 0, tokens.expires_in);
              this.auth.getLoggedUser();
              this.router.navigate(['/']);
            },
          );
      } else {
        this.passwordVal.setErrors({ passNotEqual: true });
        return;
      }
    } else {
      const data = {
        username: this.usernameVal,
        password: this.password.nativeElement.value,
      };
      this.auth.postRequest(data, '/auth/login')
        .subscribe(
          (tokens: any) => {
            this.auth.setCookie('access_token', tokens.access_token, 0, tokens.expires_in);
            this.auth.setCookie('refresh_token', tokens.refresh_token, 0, tokens.expires_in);
            this.auth.getLoggedUser();
            this.auth.getLoggedUserOperations();
            this.auth.getLoogedUserBonuses();
            this.router.navigate(['/']);
          },
        );
    }
  }

  getErrorMessage() {
    return this.user.hasError('notExists') ? 'ასეთი მომხმარებლის სახელი არ არსებობს' : '';
  }

  getPassErrorMessage() {
    return this.passwordVal.hasError('passNotEqual') ? 'შეყვანილი პაროლი არ ემთხვევა' : '';
  }

}
