import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-login-modal', 
  templateUrl: './modal.component.html', 
  styleUrls: ['./modal.component.scss'], 
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class ModalComponent {
  @Input() username!: string; // Recibe 
  @Input() password!: string;
  constructor(private modalController: ModalController) {}

  //cerrar la modal
  dismiss() {
    this.modalController.dismiss();
  }
}