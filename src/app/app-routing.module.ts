// ---- 
// Autor: Cervantes Yañez Hector - IDGS08
// ---- 
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; 
import { NoauthGuard } from './auth/noauth.guard'; 
import { AdminGuard } from './auth/admin.guard'; 

const routes: Routes = [
  {
    path: '',
    redirectTo: 'navbar/login',
    pathMatch: 'full'
  },
  {
    canActivate: [authGuard, AdminGuard],
    path: 'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    canActivate: [NoauthGuard],
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'navbar',
    loadChildren: () => import('./page/navbar/navbar.module').then( m => m.NavbarPageModule)
  },
  {
    canActivate: [NoauthGuard],
    path: 'registro',
    loadChildren: () => import('./page/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    canActivate: [authGuard],
    path: 'datos',
    loadChildren: () => import('./page/datos/datos.module').then( m => m.DatosPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
