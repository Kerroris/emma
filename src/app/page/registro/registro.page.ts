import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

import * as CryptoJS from 'crypto-js';

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
  private secretKey = 'MiClaveSecreta123';
  birthDateError: boolean = false;
  birthDateValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: [
          '',
          [Validators.required, Validators.email, Validators.pattern(/^\S*$/)],
        ],
        fullName: ['', [Validators.required]], // Permitido  espacios
        username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
        birthDate: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/), // 1 mayúscula, 1 número y sin espacios
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatch }
    );
  }

  ngOnInit() {
    // al iniciar hace q el imput de nombre lo transforme a Mayusculas
    this.registerForm.get('fullName')?.valueChanges.subscribe((value) => {
      if (value) {
        this.registerForm
          .get('fullName')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.validateBirthDate();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  removeSpaces(field: string) {
    let value = this.registerForm.get(field)?.value;
    if (value) {
      this.registerForm
        .get(field)
        ?.setValue(value.replace(/\s/g, ''), { emitEvent: false });
    }
  }

  validateBirthDate() {
    const birthDate = this.registerForm.get('birthDate')?.value;

    if (!birthDate) {
      this.birthDateError = true;
      this.birthDateValid = false;
    } else {
      this.birthDateError = false;
      this.birthDateValid = true;
    }
  }

  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null); // Limpiar el error de mismatch
    }

    // Verificar si la contraseña tiene al menos 8 caracteres, una mayúscula y un número
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d).*$/;
    if (password.length < 8 || !strongPasswordRegex.test(password)) {
      form.get('password')?.setErrors({ weakPassword: true });
    } else {
      form.get('password')?.setErrors(null); // Limpiar el error de weakPassword
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
  
    if (this.registerForm.valid) {
      const { username, email, password, fullName, birthDate } =
        this.registerForm.value;
      const role = 'admin';
  
      try {
        // Encriptar datos
        const encryptedRole = this.encryptData(role);
        const encryptedPss = this.encryptData(password);
  
        // Llamar al servicio para registrar usuario
        await this.authService.registerUser(
          username,
          email,
          encryptedPss,
          fullName,
          encryptedRole,
          birthDate
        );
  
        await this.loading.dismiss();
  
        const successAlert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada correctamente.',
          buttons: ['OK'],
        });
  
        await successAlert.present();
        this.router.navigate(['/navbar/login']);
      } catch (error) {
        await this.loading.dismiss();
  
        console.error('Error al registrar:', error);
        const errMsg =
          (error as Error).message || 'Ocurrió un error inesperado';
  
        const errorAlert = await this.alertController.create({
          header: 'Error en el registro',
          message: errMsg,
          buttons: ['OK'],
        });
  
        await errorAlert.present();
      }
    }
  }
  

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
