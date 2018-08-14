import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { NetworkingService } from '../services/networking.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RouteGuardService implements CanActivate {
  constructor(private networkService: NetworkingService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    return this.networkService.isnetworkorized().pipe(map(
      (isLoggedIn: any) => {
        if (isLoggedIn) {
          return true;
        }
        this.router.navigate(['login']);
        return false;
      }));
  }
}
