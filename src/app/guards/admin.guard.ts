import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizedUserService } from '../services/authorized-user.service';
import { LibertyUserModel } from '../models/liberty-user.model';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private currentUser: AuthorizedUserService, private router: Router, private auth: AuthService) {
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.auth.isAuthorized().pipe(map(
  //     (isLoggedIn: any) => {
  //       if (isLoggedIn) {
  //         this.currentUser.getUser.subscribe(
  //           (user: LibertyUserModel) => {
  //             if (user.isAdmin) {
  //               return true;
  //             }
  //             this.router.navigate(['profile']);
  //             return false;
  //           });
  //       } else {
  //         this.router.navigate(['login']);
  //         return false;
  //       }
  //     }));
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    return this.auth.isAuthorized().pipe(map(
      (isLoggedIn: any) => {
        if (isLoggedIn) {
          return true;
        }
        this.router.navigate(['login']);
        return false;
      }));
  }
}
