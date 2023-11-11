import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  //url al servidor 
  private URL = 'http://localhost:8080'; 

  //correo de quien inicia secion
  correo: string = '';

  constructor( 
    private http: HttpClient,
    private jwtHerper: JwtHelperService
  ){}

  //Solicitud HTTP al servidor para iniciar sesión 
  Login(user:any){
    return this.http.post(`${this.URL}/userRoute/login`, user);
  }

  //Solicitud HTTP al servidor para insertar el perfil de la empresa
  crearf(user_f:any){
    return this.http.post(`${this.URL}/crearF_route/InsEmpre`, user_f);
  }

  //Solicitud HTTP al servidor para insertar el usuario administrador de la cuenta de la empres
  crearfP(user_fP:any){
    return this.http.post(`${this.URL}/crearF_route/InsEmpreUSer`, user_fP);
  }

  //Solicitud HTTP al servidor para insercion de nuevo empleado
  regis_empleado(formData:any){
    return this.http.post(`${this.URL}/Empleado_edic/InsEmpleado`, formData);
  }

  //Solicitud HTTP al servidor para insertar la cuenta bancaria del empleado
  guardar_c(cuenta_b:any){
    return this.http.post(`${this.URL}/Empleado_edic/cuenBancaria`, cuenta_b);
  }

  //Solicitud HTTP al servidor para buscar empleados para sus registros
  buscarEmpleado(EmpleadoBusar:any){
    return this.http.post(`${this.URL}/Empleado_edic/buscarEmpleado`, EmpleadoBusar);
  }

  //Solicitud HTTP al servidor para insertar la asistencia
  asistencia_i(datosasistencia:any){
    return this.http.post(`${this.URL}/Empleado_edic/asistenciaR`, datosasistencia);
  }

  //Solicitud HTTP al servidor para insertar la horas extras
  horasExtras(horaRegistro:any){
    return this.http.post(`${this.URL}/Empleado_edic/horasExtras`, horaRegistro);
  }

  //Solicitud HTTP al servidor para insertar la horas extras
  incapacidad(formData:any){
    return this.http.post(`${this.URL}/Empleado_edic/incapacidad`, formData);
  }

  //Solicitud HTTP al servidor para insertar la horas extras
  eliminarRegistro(motivoData:any){
    return this.http.post(`${this.URL}/delet_Empleado/RegisEmpleado_eliminado`, motivoData);
  }



  //metodo para establecer el correo del usuario
  setCorreoUsuario(correologin: string) {
    this.correo = correologin;
  }

  // método para obtener el correo del usuario
  getCorreoUsuario() {
    return this.correo;
  }

  //Solicitud HTTP al servidor para obtener el nombre de la empresa
  obtenerNomEmpresa(correo: string): Observable<any>{
    const params = new HttpParams().set('correo', correo)
    return this.http.get(`${this.URL}/crearF_route/nombreEmpresa`, {params});
  }

  //Solicitud HTTP al servidor para obtener la fotografia del empleado
  historialEmpleado(id: string): Observable<any> {
    return this.http.get(`${this.URL}/info_empleado/infoEmpleadoEliminar/${id}`);
  }
  
  //Solicitud HTTP al servidor para obtener la fotografia del empleado
  buscarFotografia(id: string): Observable<Blob> {
    return this.http.get(`${this.URL}/info_empleado/fotografiaDescargar/${id}`, { responseType: 'blob' });
  }

  //Solicitud HTTP al servidor para eliminar el empleado
  eliminarEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/delet_Empleado/deleteEmpleado/${id}`);
  }
  
/*
  buscarEmpleado(EmpleadoBusar: any){
    const params = new HttpParams()
    .set('id_cedula', EmpleadoBusar.id_cedula)
    .set('tipo_documento', EmpleadoBusar.tipo_documento);

    return this.http.get(`${this.URL}/Empleado_edic/buscarEmpleado`, params);
  }
  */

  //se verifica si el usuario tiene un token 
  isAunt(): boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHerper.isTokenExpired(token) || !localStorage.getItem('token')){
      //flser si no lo tienen 
      return false;
    }
    //true si lo tiene
    return true;
  }
}
