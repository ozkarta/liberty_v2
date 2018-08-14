import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NetworkingService } from '../services/networking.service';
import { FormControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '@lbge/auth';

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
  passwordValOriginal = new FormControl();
  hide = true;
  hideRepeat = true;

  color = 'warn';
  mode = 'indeterminate';
  value = 50;

  dataIsLoading = false;

  constructor(private network: NetworkingService,
              private router: Router,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }

  checkUsername() {
    this.dataIsLoading = true;
    this.network.getRequest(`/users/checkUser?userName=${this.username.nativeElement.value}`)
      .subscribe(
        (response: any) => {
          if (response.userExists) {
            this.usernameVal = this.username.nativeElement.value;
            this.usernameExists = response.userExists;
            this.passwordExists = response.passwordExists;
            this.dataIsLoading = false;
          } else {
            this.user.setErrors({ notExists: true });
          }
          this.dataIsLoading = false;
        },
      );
  }

  login() {
    this.dataIsLoading = true;
    if (!this.passwordExists) {
      if (this.password.nativeElement.value === this.repeatPassword.nativeElement.value) {
        const data = {
          username: this.usernameVal,
          password: this.password.nativeElement.value,
        };
        this.network.postRequest(data, '/auth/login')
          .subscribe(
            (tokens: any) => {
              this.network.setCookie('access_token', tokens.access_token, 0, tokens.expires_in);
              this.network.setCookie('refresh_token', tokens.refresh_token, 0, tokens.expires_in);
              this.network.getLoggedUser().then(() => {
                this.router.navigate(['/'])
                  .then(
                    () => {
                      this.dataIsLoading = false;
                    });
              });
            },
          );
      } else {
        this.passwordVal.setErrors({ passNotEqual: true });
        this.dataIsLoading = false;
        return;
      }
    } else {
      const data = {
        username: this.usernameVal,
        password: this.password.nativeElement.value,
      };
      this.network.postRequest(data, '/auth/login')
        .subscribe(
          (tokens: any) => {
            this.network.setCookie('access_token', tokens.access_token, 0, tokens.expires_in);
            this.network.setCookie('refresh_token', tokens.refresh_token, 0, tokens.expires_in);
            this.network.getLoggedUser().then(() => {
              this.router.navigate(['/'])
                .then(
                  () => {
                    this.dataIsLoading = false;
                  });
            });
          },
          (error) => {
            this.dataIsLoading = false;
            this.passwordValOriginal.setErrors({ wrongPassword: true });
            this.getPassErrorMessage();
          });
    }
  }

  getErrorMessage() {
    return this.user.hasError('notExists') ? 'ასეთი მომხმარებლის სახელი არ არსებობს' : '';
  }

  getPassErrorMessage() {
    return this.passwordVal.hasError('passNotEqual') ? 'შეყვანილი პაროლი არ ემთხვევა' : '';
  }
  getPassOriginalErrorMessage() {
    return this.passwordValOriginal.hasError('wrongPassword') ? 'პაროლი არასწორია' : '';
  }



}
