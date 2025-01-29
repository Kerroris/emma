import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  username: string = '';
  password: string = '';
  isValid: boolean = false;
  showPassword: boolean = false; 

  constructor(private alertController: AlertController) {}

  // Funcion q se ejectura para validar los imputs y deshabilita el botón 
  validateForm() {
    this.username = this.username.toLowerCase().replace(/\s/g, '');

    this.password = this.password.replace(/\s/g, '');

    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  // funcion q se ejecuta al precional el boton 
  login(event: Event) {
    event.preventDefault(); 
    this.presentLoginAlert();
  }

  // funcion de mostrar la modal 
  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Datos de Inicio de Sesión',
      message: `👤 Usuario: ${this.username} - 🔒 Contraseña: ${this.password}`,
      buttons: ['OK'],
    });

    await alert.present();
  }
  // funcion para ver password 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
