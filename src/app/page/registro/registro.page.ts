import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  registerForm: FormGroup;
  loading!: HTMLIonLoadingElement;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      birthDate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Actualizamos la validación de las contraseñas cada vez que el formulario cambia
    this.registerForm.valueChanges.subscribe(() => {
      this.passwordsMatch(this.registerForm);
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Validación de las contraseñas
  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password === confirmPassword) {
      form.get('confirmPassword')?.setErrors(null);
    } else {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = await this.loadingController.create({
      message: 'Registrando...',
    });
    await this.loading.present();

    setTimeout(async () => {
      await this.loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: 'Tu cuenta ha sido creada correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/navbar/login']);
    }, 2000);
  }
}
