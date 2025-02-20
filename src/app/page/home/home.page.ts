import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import { EditUserModalComponent } from '../../components/edit-user-modal/edit-user-modal.component';
import { AlertController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  userRole: string | null = null;
  currentUser: string | null = null;
  texto: boolean = false;
  users: any[] = [];
  fullName: string | null = null;

  private secretKey = 'MiClaveSecreta123';

  constructor(
    public authService: AuthService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.authService.currentUserRole$.subscribe((role) => {
      this.userRole = role;
    });
    this.authService.currentUserId$.subscribe((id) => {
      this.currentUser = id;
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.fullName = this.authService.getFullNameFromToken();
  }

  async loadUsers() {
    try {
      this.users = await this.authService.getAllUsers();
      // Desencriptar el 'role' de cada usuario
      this.users.forEach((user) => {
        if (user.role) {
          user.role = this.decryptData(user.role);
        }
      });
    } catch (error) {
      console.error('Error al cargar usuarios', error);
    }
  }

  // Mandar llamar el componente modal y enviamos una funcion para q sea ejecutada dede el componente
  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        userRegistered: () => {
          // funcion q se envia
          this.loadUsers();
        },
      },
    });
    await modal.present();
  }
  
  async editarUsuario(userId: string) {
    const usuarioEncontrado = this.users.find((user) => user.id === userId);
    if (!usuarioEncontrado) {
      console.log('Usuario no encontrado');
      return;
    }
    // console.log(usuarioEncontrado);
    const modal = await this.modalController.create({
      component: EditUserModalComponent,
      componentProps: { idUser: userId,  usuario: usuarioEncontrado, 
        userRegistered: () => {
          // funcion q se envia
          this.loadUsers();
        }, },
    });

    await modal.present();
  }

  async eliminarUsuario(userId: string) {
    // Mostrar la alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Si el usuario confirma la eliminación, procedemos con la eliminación
            this.authService
              .eliminarUsuario(userId)
              .then(() => {
                this.loadUsers();
              })
              .catch((error) => {
                console.error('Error al eliminar usuario', error);
              });
          },
        },
      ],
    });

    // Presentar la alerta
    await alert.present();
  }


  private decryptData(encryptedRole: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedRole, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
