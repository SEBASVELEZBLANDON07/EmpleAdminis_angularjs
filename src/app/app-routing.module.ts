import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UserEmpresaComponent } from './components/user-empresa/user-empresa.component';
import { RegistroEmpleadoComponent } from './components/registro-empleado/registro-empleado.component';

const routes: Routes = [
  
  //ruta inicio de sesion 
  { path: 'login', component: LoginComponent },

  //ruta para ingresar un perfil de empresa 
  { path: 'registro', component: RegistroComponent },

  //indefinido 
  { path: 'userEmpresa', component: UserEmpresaComponent },

  //ruta de inicio pagina principal //necesita tener token y rol admin
  { path: 'inicio', component: InicioComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

   //ruta de ingresar un usuario nuevo a la base de datos //necesita tener token y rol admin
   { path: 'regitroEmpleado', component: RegistroEmpleadoComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta indefinido // necesita tener un token  
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },

  //ruta indefinido //necesita token y rol user
  { path: 'empleado', component: EmpleadoComponent, canActivate: [RoleGuard], data: {expectedRole: 'user'}},
  
  //ruta por defecto // se inicia en esta ruta
  //{ path: '**', pathMatch: 'full', redirectTo: 'inicio' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }









/*import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouteModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';



const route: Route = [


  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];


@NgModule({
  imports: [RouteModule.forRoot(route)],
  exports: [RouteModule]
})


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class AppRoutingModule { }
*/

