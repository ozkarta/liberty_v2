import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NetworkingService} from '../services/networking.service';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {SpinnerService} from "../services/spinner.service";

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

  constructor(private network: NetworkingService,
              private router: Router,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
  }

  checkUsername() {
    this.spinnerService.next(true);
    this.network.getRequest(`/users/checkUser?userName=${this.username.nativeElement.value}`)
      .subscribe(
        (response: any) => {
          if (response.userExists) {
            this.usernameVal = this.username.nativeElement.value;
            this.usernameExists = response.userExists;
            this.passwordExists = response.passwordExists;
          } else {
            this.user.setErrors({notExists: true});
          }
          this.spinnerService.next(false);
        },
      );
  }

  login() {
    this.spinnerService.next(true);
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
                this.router.navigate(['home'])
                  .then(
                    () => {
                      this.spinnerService.next(false);
                    });
              });
            },
          );
      } else {
        this.passwordVal.setErrors({passNotEqual: true});
        this.spinnerService.next(false);
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
              this.router.navigate(['home'])
                .then(
                  () => {
                    this.spinnerService.next(false);
                  });
            });
          },
          () => {
            this.spinnerService.next(false);
            this.passwordValOriginal.setErrors({wrongPassword: true});
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


  clickEventHandler(event: Event) {
    this.spinnerService.next(true);
    this.network.getRequest(`/users/checkUser?userName=${this.username.nativeElement.value}`)
      .subscribe(
        (response: any) => {
          if (response.userExists) {
            this.usernameVal = this.username.nativeElement.value;
            this.login();
            // this.usernameExists = response.userExists;
            // this.passwordExists = response.passwordExists;
          } else {
            this.user.setErrors({notExists: true});
          }
          this.spinnerService.next(false);
        },
      );

    event.preventDefault();
  }
}
