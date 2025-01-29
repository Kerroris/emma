import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
  // imports: [IonicModule],
})
export class HomePage  {
  texto: boolean = false;

  constructor() {}

  mostrarTexto() {
    this.texto = true;
    setTimeout(() => {
      this.texto = false;
    }, 5000);
  }
}
