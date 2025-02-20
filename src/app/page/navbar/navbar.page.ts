import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
  standalone: false,
})
export class NavbarPage implements OnInit {
  autenticado = false;
  userRole: string | null = null;

  constructor(public authService: AuthService) {
    this.authService.autenticado$.subscribe((auth) => {
      this.autenticado = auth;
    });
    this.authService.currentUserRole$.subscribe((role) => {
      this.userRole = role;
    });
  } 

  ngOnInit() {
  }
  
  logout() {
    this.authService.logout();
  }
  

}
