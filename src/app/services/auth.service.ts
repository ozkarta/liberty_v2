import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthorizedUserService } from './authorized-user.service';
import { LibertyUserModel } from '../models/liberty-user.model';
import { MyOperationsModel } from '../models/my-operations.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  // url = 'http://home.gelashvili.net:8080';
  // url = 'http://31.146.153.23:8080';
  // url = 'http://192.168.100.100:9191';
  url = 'http://192.168.100.23:9191';

  constructor(private http: HttpClient, private currentUser: AuthorizedUserService, private router: Router) {
  }

  postRequest(data: any, url: string): Observable<any> {
    const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + this.getCookie('access_token'));
    return this.http.post(`${this.url}${url}`, data, { headers: header })
      .pipe(map(
        (response: Response) => {
          return response;
        }), catchError(
        (error: Response) => {
          return throwError(error);
        }));
  }

  putRequest(data: any, url: string): Observable<any> {
    const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + this.getCookie('access_token'));
    return this.http.put(`${this.url}${url}`, data, { headers: header })
      .pipe(map(
        (response: Response) => {
          return response;
        }),
            catchError(
          (error: Response) => {
            return throwError(error);
          }));
  }

  getRequest(url: string): Observable<any> {
    const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + this.getCookie('access_token'));
    return this.http.get(`${this.url}${url}`, { headers: header })
      .pipe(map(
        (response: Response) => {
          return response;
        }), catchError(
        (error: Response) => {
          return throwError(error);
        }));
  }

  getRequestDownload(url: string): Observable<Blob> {
    const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + this.getCookie('access_token'));
    return this.http.get(`${this.url}${url}`, { headers: header, responseType: 'blob' })
      .pipe(map(
        (response: Response) => {
          return response;
        }), catchError(
        (error: Response) => {
          return throwError(error);
        }));
  }

  async getLoggedUser() {
    this.getRequest('/users/me')
      .subscribe(
        (user: LibertyUserModel) => {
          let found = false;
          for (let i = 0; i < user.authorities.length; i++) {
            if (user.authorities[i].authority === 'ADMIN') {
              found = true;
              break;
            }
          }
          if (!found) {
            this.currentUser.setUser(user);
            this.getLoggedUserOperations();
            this.getLoogedUserBonuses();
          } else {
            user.isAdmin = true;
            this.currentUser.setUser(user);
            this.router.navigate(['admin/bonus-systems']);
          }
        });
  }

  getLoggedUserOperations() {
    this.getRequest('/sales/currentMonthSales')
      .subscribe(
        (sales: MyOperationsModel[]) => {
          sales.sort((a, b) => {
            return a.product.productMotivationalBlockTypeId - b.product.productMotivationalBlockTypeId || a.product.sortOrder - b.product.sortOrder;
          });
          this.currentUser.setMyOperations(sales);
        });
  }

  getLoogedUserBonuses() {
    this.getRequest('/bonusRewards/currentMonthBonuses')
      .subscribe(
        (operations: MyOperationsModel[]) => {
          operations.sort((a, b) => a.product.productMotivationalBlockTypeId - b.product.productMotivationalBlockTypeId || a.product.sortOrder - b.product.sortOrder);
          this.currentUser.setMyBonuses(operations);
        });
  }

  getCookie(cName): any {
    if (localStorage.getItem(cName)) {
      return decodeURI(localStorage.getItem(cName));
    }
    return null;
  }

  setCookie(cName, value, exDays, exSeconds) {
    const TmpExDays = isNaN(exDays) ? 0 : Number(exDays);
    const TmpExSeconds = isNaN(exSeconds) ? 0 : Number(exSeconds);
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + TmpExDays);
    exdate.setSeconds(exdate.getSeconds() + TmpExSeconds);
    let cValue = encodeURI(value);
    if (TmpExDays || TmpExSeconds) {
      cValue += '; expires=' + exdate.toUTCString();
    }
    localStorage.setItem(cName, value);
  }

  isAuthorized() {
    if (this.getCookie('access_token') !== null) {
      return of(true);
    }
    if (this.getCookie('access_token') === null && this.getCookie('refresh_token') !== null) {
      const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + this.getCookie('refresh_token'));
      this.http.post(`${this.url}/auth/refresh`, null, { headers: header })
        .pipe(map(
          (tokens: any) => {
            this.setCookie('access_token', tokens.access_token, 0, tokens.expires_in);
            this.setCookie('refresh_token', tokens.refresh_token, 0, tokens.expires_in);
            return true;
          }));
    }
    if (this.getCookie('access_token') === null && this.getCookie('refresh_token') === null) {
      return of(false);
    }
  }
}
