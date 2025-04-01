import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-citas',
  standalone: false,
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
})
export class GestionCitasPage implements OnInit {
logout() {
throw new Error('Method not implemented.');
}
  tipoUsuario: string = '';
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  materiaSeleccionada: string = '';
  horariosGuardados: any[] = [];

  horariosDisponibles: string[] = ['07:00', '09:00', '11:00', '13:00', '15:00'];
  materiasDisponibles: string[] = ['Matemáticas', 'Historia', 'Física', 'Química', 'Programación'];
  
  constructor(private alertController: AlertController) {}

  ngOnInit() {
    console.log('Gestión de Citas cargado.');
  }

  async seleccionarFecha(event: any) {
    this.fechaSeleccionada = event.detail.value.split('T')[0];
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
  }

  async guardarHorario() {
    if (!this.tipoUsuario || !this.fechaSeleccionada || !this.horaSeleccionada || !this.materiaSeleccionada) {
      const alert = await this.alertController.create({
        header: 'Información Incompleta',
        message: 'Por favor, completa todos los campos antes de guardar el horario.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const nuevoHorario = {
      tipoUsuario: this.tipoUsuario,
      fecha: this.fechaSeleccionada,
      hora: this.horaSeleccionada,
      materia: this.materiaSeleccionada
    };

    this.horariosGuardados.push(nuevoHorario);
    console.log('Horario guardado:', nuevoHorario);

    // Resetear selección después de guardar
    this.horaSeleccionada = '';
    this.materiaSeleccionada = '';

    const alert = await this.alertController.create({
      header: 'Horario Guardado',
      message: `Horario guardado con éxito:<br><strong>${nuevoHorario.fecha}</strong> a las <strong>${nuevoHorario.hora}</strong> para <strong>${nuevoHorario.materia}</strong> (${nuevoHorario.tipoUsuario}).`,
      buttons: ['OK']
    });
    await alert.present();
  }
}
