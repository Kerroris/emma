import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
  standalone: false,
})
export class DatosPage implements OnInit {
  fullName: string | null = null;
  username: string | null = null;
  role: string | null = null;
  birthDate: string | null = null;
  email: string | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const decodedToken = this.authService.decodeJWT(token);
      if (decodedToken) {
        this.fullName = decodedToken.fullName || 'No disponible';
        this.username = decodedToken.username || 'No disponible';
        this.email = decodedToken.email || 'No disponible';
        this.role = decodedToken.role || 'No disponible';

        if (decodedToken.birthDate && decodedToken.birthDate.seconds) {
          const birthDateObj = new Date(decodedToken.birthDate.seconds * 1000);
          this.birthDate = birthDateObj.toLocaleDateString('es-MX'); 
        } else {
          this.birthDate = 'No disponible';
        }
      }
      console.log(this.birthDate);
    }
  }
}
