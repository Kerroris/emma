import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';

import { Auth } from '@angular/fire/auth';

interface Role {
  [key: string]: string[]; // Permite propiedades dinámicas con arrays de strings
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  showSplash: boolean = true;
  isValid: boolean = false;
  showPassword: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService,
    private auth: Auth
  ) {}

  // ----- Inicialización -----
  async ngOnInit() {
    // Oculta el splash
    setTimeout(() => {
      this.showSplash = false;
    }, 3000);
  }

  // --------------

  async login(event: Event) {
    event.preventDefault();
    this.showSplash = true;

    try {
      this.authService.loginService(this.username, this.password).subscribe({
        next: async (response) => {
          // Guardar datos en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));        
          const successAlert = await this.alertController.create({
            header: 'Login Exitoso',
            message: 'bienvenido',
            buttons: ['OK'],
          });  
          this.router.navigate(['/navbar/datos']);
        },
        error: async (error) => {  
          console.error('Error al registrar:', error);
          const errMsg =
            (error as Error).message || 'Ocurrió un error inesperado';
  
          const errorAlert = await this.alertController.create({
            header: 'Error en el registro',
            message: errMsg,
            buttons: ['OK'],
          });
  
          await errorAlert.present();
        },
      });

        // window.location.href = '/navbar/datos';
    } catch (error) {
      console.error(error);
      this.showError('Hubo un problema al iniciar sesión');
    } finally {
      this.showSplash = false;
    }
  }

  private showError(message: string) {
    this.showSplash = false;
    this.presentLoginAlert('Error', message);
  }
  // --------------

  // Función para mostrar alerta
  async presentLoginAlert(
    header: string = 'Inicio Exitoso!',
    message: string = 'Bienvenido...'
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Función para validar los inputs
  validateForm() {
    this.password = this.password.replace(/\s/g, '');
    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  // Función para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Función para mostrar modal con mis credenciales
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

  // Esto se ejecuta cada vez que navego sin recargar la página
  async ionViewWillEnter() {
    // await this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
      spinner: 'crescent',
    });
    await loading.present();
  }
}
