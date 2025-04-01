import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
  standalone: false,
})
export class DatosPage implements OnInit {
logout() {
throw new Error('Method not implemented.');
}
  fullName: string | null = null;
  username: string | null = null;
  role: string | null = null;
  birthDate: string | null = null;
  email: string | null = null;
  user : any = null;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    this.user = localStorage.getItem('user');
    const usuario = JSON.parse(this.user);
    if (usuario) {
        this.fullName = usuario.fullName || 'No disponible';
        this.username = usuario.username || 'No disponible';
        this.email = usuario.email || 'No disponible';
        this.birthDate = usuario.birthDate || 'No disponible';

            
      console.log(this.birthDate);
    }
  }
}
