import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from '../../auth/auth.guard'; 
import { NoauthGuard } from '../../auth/noauth.guard'; 
import { AdminGuard } from '../../auth/admin.guard'; 

import { NavbarPage } from './navbar.page';

const routes: Routes = [
  {
    path: '',
    component: NavbarPage,
    children: [
      {
        canActivate: [authGuard, AdminGuard],
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        canActivate: [NoauthGuard],
        path: 'login',
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginPageModule),
      },
      {
        canActivate: [NoauthGuard],
        path: 'registro',
        loadChildren: () =>
          import('../registro/registro.module').then(
            (m) => m.RegistroPageModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'datos',
        loadChildren: () => import('../datos/datos.module').then( m => m.DatosPageModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarPageRoutingModule {}
