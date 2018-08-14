import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {NetworkingService} from './networking.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class LoggedOutGuardService implements CanActivate {
  constructor(private networkService: NetworkingService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    return this.networkService.isAuthorized().pipe(map(
      (isLoggedIn: any) => {
        if (!isLoggedIn) {
          return true;
        }
      }));
  }
}
