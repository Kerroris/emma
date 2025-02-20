import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule, Time } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { LoadingController, AlertController } from '@ionic/angular';

// para los forms
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class EditUserModalComponent {
  @Input() usuario: any;
  @Input() idUser: any;
  @Input() userRegistered!: () => void;
  
  private secretKey = 'MiClaveSecreta123';
  // ejecurat una funcion de la page donde llama este componente
  registerForm: FormGroup;
  showPassword: boolean = false;
  contraDes: string = '';
  birthDateFormat: string = '';
  birthDateError: boolean = false;
  birthDateValid: boolean = false;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
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
    // Aseguramos que la fecha de nacimiento se maneje correctamente
    const timestamp = this.usuario.birthDate;
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000); // Convertimos el timestamp de Firebase a objeto Date
      this.birthDateFormat = this.formatDate(date); // Formateamos la fecha antes de asignarla
    }

    this.registerForm.get('fullName')?.valueChanges.subscribe((value) => {
      if (value) {
        this.registerForm
          .get('fullName')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    setTimeout(() => {
      this.validateBirthDate();
    }, 2000);
    this.contraDes = this.decryptData(this.usuario.password);
  }

  // Función para formatear la fecha en el formato correcto
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Aseguramos que tenga 2 dígitos
    const day = date.getDate().toString().padStart(2, '0'); // Aseguramos que tenga 2 dígitos
    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
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

  async editarUser() {
    if (this.registerForm.valid) {
      const { username, email, password, fullName, birthDate } =
        this.registerForm.value;
      try {
        const encryptedPss = this.encryptData(password);
        await this.authService.updateUser(
          username,
          email,
          encryptedPss,
          fullName,
          birthDate,
          this.idUser
        );

        // Cerrar el modal solo si la actualización es exitosa
        this.dismiss();
        if (this.userRegistered) {
          this.userRegistered(); // Ejecuta la función pasada desde el modal
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);

        // Obtener el mensaje de error
        const errMsg =
          (error as Error).message || 'Ocurrió un error inesperado.';

        // Mostrar alerta con el mensaje de error
        const errorAlert = await this.alertController.create({
          header: 'Error en la actualización',
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
