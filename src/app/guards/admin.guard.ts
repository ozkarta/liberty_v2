import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizedUserService } from '../services/authorized-user.service';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private currentUser: AuthorizedUserService,
              private router: Router,
              private auth: AuthService) {
  }

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
