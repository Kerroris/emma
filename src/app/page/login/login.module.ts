// ----- 
// Cervantes Yañez Hector -IDGS08
// ----- 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
// Importamos el componennte Splash 
import { SphashComponent } from '../../components/sphash/sphash.component'; 
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SphashComponent
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
