import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { networkorizedUserService } from '../services/authorized-user.service';
import { NetworkingService } from '../services/networking.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private currentUser: networkorizedUserService,
              private router: Router,
              private network: NetworkingService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    return this.network.isnetworkorized().pipe(map(
      (isLoggedIn: any) => {
        if (isLoggedIn) {
          return true;
        }
        this.router.navigate(['login']);
        return false;
      }));
  }
}
