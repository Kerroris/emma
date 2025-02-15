// -----
// Cervantes Yañez Hector -IDGS08
// -----
import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';
// Modal componente de la parctica 2 de mostrar password y username en modal
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string = '';
  showSplash: boolean = true; // visibilidad del splash screen
  password: string = '';
  isValid: boolean = false; //Valida el password y username q sean correctos
  showPassword: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  // -----
  // Cervantes Yañez Hector -IDGS08
  // -----
  async ngOnInit() {
    // Oculta el splash
    setTimeout(() => {
      this.showSplash = false;
    }, 3000);
  }

  // Funcion q se ejecuta despues q el formulario este lleno
  async login(event: Event) {
    event.preventDefault();

    this.showSplash = true;

    setTimeout(() => {
      this.showSplash = false;
      this.presentLoginAlert();
      this.router.navigate(['/navbar/home']);
    }, 3000);
  }
  // Funcion para mostrar alerta
  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Inicio Ecxitoso!',
      message: `Bienvenido...`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Funcion para validar los imput
  validateForm() {
    this.username = this.username.toLowerCase().replace(/\s/g, '');
    this.password = this.password.replace(/\s/g, '');
    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  // finción para mostrar constraseña y ocultar
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // función para mostrar modal con mis credenciales
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

  // Esto se ejecuta cada q navego sin recargar la pagina
  async ionViewWillEnter() {
    // await this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 3000,
      spinner: 'crescent',
    });
    await loading.present();
  }
}
