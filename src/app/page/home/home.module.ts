import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import { EditUserModalComponent } from '../../components/edit-user-modal/edit-user-modal.component';
import { HomePageRoutingModule } from './home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalComponent,
    EditUserModalComponent,
    ReactiveFormsModule
    // HomePage 
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
