import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable, throwError} from 'rxjs';
import { AuthorizedUserService } from '../services/authorized-user.service';
import { NetworkingService } from '../services/networking.service';
import {catchError, map} from 'rxjs/operators';
import {LibertyUserModel} from "../models/liberty-user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private currentUser: AuthorizedUserService,
              private router: Router,
              private network: NetworkingService,
              private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    // return this.network.isAuthorized().pipe(map(
    //   (isLoggedIn: any) => {
    //     if (isLoggedIn) {
    //       this.network.getLoggedUser().then(
    //         () => {
    //           this.currentUser.getUser
    //             .subscribe(
    //               (user: LibertyUserModel) => {
    //                 if (user.isAdmin) {
    //                   return true;
    //                 } else {
    //                   this.router.navigate(['']);
    //                 }
    //               }
    //             )
    //         }
    //       )
    //       //return true;
    //     }
    //     this.router.navigate(['login']);
    //     return false;
    //   }));
    if (!this.network.getCookie('access_token')) {
      this.router.navigate(['login']);
      return false;
    }
    const header = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
      .set('authorization', 'Bearer ' + this.network.getCookie('access_token'));
    return this.http.get(`${this.network.url}/users/me`, {headers: header})
      .pipe(map(
        (user: LibertyUserModel) => {
          if (!user) {
            this.router.navigate(['login']);
            return false;
          }
          let found = false;
          for (let i = 0; i < user.authorities.length; i++) {
            if (user.authorities[i].authority === 'ADMIN') {
              found = true;
              break;
            }
          }
          if (!found) {
            this.router.navigate(['/'])
          }
          return found;
        }), catchError(
        (error: Response) => {
          return throwError(error);
        }));
  }
}
