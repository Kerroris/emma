import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      this.router.navigate(['/navbar/login']);
      return false;
    }
    const decodedToken = this.authService.decodeJWT(token);
    if (!decodedToken) {
      this.router.navigate(['/navbar/login']);
      return false;
    }

    // Si el token es válido, permitir el acceso
    return true;
  }
}
