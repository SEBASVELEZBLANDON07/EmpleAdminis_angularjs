import { NgModule } from '@angular/core';

//animacion de girar
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { AppRoutingModule } from './app-routing.module';


//module
import { FormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//providers
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt'
import { TokenInterceptoService } from './services/token-intercepto.service';
import { InicioComponent } from './components/inicio/inicio.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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


//import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    EmpleadoComponent,
    InicioComponent,
    RegistroComponent,
    UserEmpresaComponent,
    RegistroEmpleadoComponent,
    CuentaEmpleadoComponent,
    AsistenciaComponent,
    HorasExtrasComponent,
    IncapacidadComponent,
    DeleteEmpleadoComponent,
    InventarioGereralComponent,
    DetalleEmpleadoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  providers: [
    //jwt
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    //token interception 
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptoService, multi: true},
    //File,
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
