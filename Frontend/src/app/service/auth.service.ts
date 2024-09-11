import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate ,CanActivateChild ,CanLoad{


  constructor(private userservice : UserService , private router : Router) { }

  canActivate(route:ActivatedRouteSnapshot , state:RouterStateSnapshot):boolean{

    if (state.url === '/' && this.userservice.isUserLoggedIn()) {
      // Prevent navigation to the login page if the user is already logged in
      this.router.navigate(['/home']);
      return false;
    }
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }
  canLoad(): boolean {
    return this.checkAuth();
  }
  private checkAuth():boolean{
    if(this.userservice.isUserLoggedIn()){
      return true
    }else{
      this.router.navigate(['/'])
      return false
    }
  }
}
