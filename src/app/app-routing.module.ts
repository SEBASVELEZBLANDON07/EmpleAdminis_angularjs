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
import { CuentaEmpleadoComponent } from './components/cuenta-empleado/cuenta-empleado.component';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { HorasExtrasComponent } from './components/horas-extras/horas-extras.component';
import { IncapacidadComponent } from './components/incapacidad/incapacidad.component';
import { DeleteEmpleadoComponent } from './components/delete-empleado/delete-empleado.component';
import { InventarioGereralComponent } from './components/inventario-gereral/inventario-gereral.component';
import { DetalleEmpleadoComponent } from './components/detalle-empleado/detalle-empleado.component';

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

  //ruta de ingresar la cuneta bancaria del empleado a la base de datos //necesita tener token y rol admin
  { path: 'regitroEmpleado/cuentaEmpleado', component: CuentaEmpleadoComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta de ingresar la asistencia a la base de datos //necesita tener token y rol admin
  { path: 'asistencia', component: AsistenciaComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta de ingresar las horas extras de los empleados base de datos //necesita tener token y rol admin
  { path: 'horasExtras', component: HorasExtrasComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta de ingresar las incapacidades de los empleados base de datos //necesita tener token y rol admin
  { path: 'incapacidad', component: IncapacidadComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta para eliminar los empleados de la base de datos y archivos guardados en drive de este enpleado, se puede ver el historial de empleados eliminados en la empresa //necesita tener token y rol admin
  { path: 'deleteEmpleado', component: DeleteEmpleadoComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta para ver el inventario del total de trabajadores ingresados en la empresa //necesita tener token y rol admin
  { path: 'InventarioGeneral', component: InventarioGereralComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},

  //ruta para ver el registro de un solo empleado//necesita tener token y rol admin
  { path: 'InventarioGeneral/detalle-empleado/:idCedula', component: DetalleEmpleadoComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},


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

