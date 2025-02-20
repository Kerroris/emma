import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoauthGuard  implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      this.router.navigate(['/navbar/home']);
      return false;
    }

    return true;
  }
}
