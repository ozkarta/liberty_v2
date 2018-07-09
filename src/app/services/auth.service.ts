import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { AuthorizedUserService } from './authorized-user.service';
import { LibertyUserModel } from '../models/liberty-user.model';
import { MyOperationsModel } from '../models/my-operations.model';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class AuthService {
  // url = 'http://home.gelashvili.net:8080';
  // url = 'http://31.146.153.23:8080';
  url = 'http://192.168.100.23:9696';

  constructor(private http: HttpClient, private currentUser: AuthorizedUserService) {
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

  getLoggedUser() {
    this.getRequest('/users/me')
      .subscribe(
        (user: LibertyUserModel) => {
          this.currentUser.setUser(user);
        });
  }

  getLoggedUserOperations() {
    this.getRequest('/sales/currentMonthSales')
      .subscribe(
        (sales: MyOperationsModel[]) => {
          sales.sort((a, b) => {
            return a.product.sortOrder - b.product.sortOrder;
          });
          console.log(sales);
          this.currentUser.setMyOperations(sales);
        });
  }

  getLoogedUserBonuses() {
    this.getRequest('/bonusRewards/currentMonthBonuses')
      .subscribe(
        (operations: MyOperationsModel[]) => {
          operations.sort((a, b) => a.product.sortOrder - b.product.sortOrder);
          this.currentUser.setMyBonuses(operations);
        });
  }

  getCookie(cName): any {
    let i;
    let x;
    let y;
    const arRcookies = document.cookie.split(';');
    for (i = 0; i < arRcookies.length; i++) {
      x = arRcookies[i].substr(0, arRcookies[i].indexOf('='));
      y = arRcookies[i].substr(arRcookies[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, '');
      if (x === cName) {
        return decodeURI(y);
      }
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
    document.cookie = cName + '=' + cValue;
  }

  isAuthorized(): Observable<boolean> {
    if (this.getCookie('access_token') === null && this.getCookie('refresh_token') === null) {
      return of(false);
    }
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
  }

}
