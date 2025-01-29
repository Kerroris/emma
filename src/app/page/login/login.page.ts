import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  isValid: boolean = false;
  showPassword: boolean = false;
  
  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  validateForm() {
    this.username = this.username.toLowerCase().replace(/\s/g, '');
    this.password = this.password.replace(/\s/g, '');
    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  async login(event: Event) {
    event.preventDefault();
    await this.presentLoginModal();
  }

  async presentLoginModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        username: this.username,
        password: this.password,
      },
    });
    await modal.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Datos de Inicio de Sesión',
      message: `👤 Usuario: ${this.username} - 🔒 Contraseña: ${this.password}`,
      buttons: ['OK'],
    });

    await alert.present();
  }
}