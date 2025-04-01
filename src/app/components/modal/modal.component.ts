import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';

// para los forms
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})

export class ModalComponent {
  registerForm: FormGroup;
  // ejecurat una funcion de la page donde llama este componente
  @Input() userRegistered!: () => void;
  showPassword: boolean = false;

  birthDateError: boolean = false;
  birthDateValid: boolean = false;

  private secretKey = 'MiClaveSecreta123';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group(
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
    this.registerForm.get('fullName')?.valueChanges.subscribe((value) => {
      if (value) {
        this.registerForm
          .get('fullName')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.validateBirthDate();
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

  dismiss() {
    this.modalController.dismiss();
  }

  removeSpaces(field: string) {
    let value = this.registerForm.get(field)?.value;
    if (value) {
      this.registerForm
        .get(field)
        ?.setValue(value.replace(/\s/g, ''), { emitEvent: false });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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

  async agregar() {
    if (this.registerForm.valid) {
      const { username, email, password, fullName, birthDate } =
        this.registerForm.value;
      const role = 'common_user';
      try {
        const encryptedRole = this.encryptData(role);
        const encryptedPss = this.encryptData(password);
        await this.authService.registerUser(
          username,
          email,
          password,
          fullName,
          birthDate
        );
        this.dismiss();
        if (this.userRegistered) {
          this.userRegistered(); // Ejecuta la función pasada desde el modal
        }
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      }
    }
  }

  private encryptData(role: string): string {
    return CryptoJS.AES.encrypt(role, this.secretKey).toString();
  }

}
