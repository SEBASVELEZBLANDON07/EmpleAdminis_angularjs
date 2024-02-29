import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  //URL al servidor  
  private URL = 'http://localhost:8080'; 

  //Correo de quién inicia sesión
  correo: string = '';

  constructor( 
    private http: HttpClient,
    private jwtHerper: JwtHelperService
  ){}

  //Solicitudes por el método post 

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

  //Solicitud HTTP al servidor para insertar la incapacidad
  incapacidad(formData:any){
    return this.http.post(`${this.URL}/Empleado_edic/incapacidad`, formData);
  }

  //Solicitud HTTP al servidor para registrar el empleado eliminado 
  eliminarRegistro(motivoData:any){
    return this.http.post(`${this.URL}/delet_Empleado/RegisEmpleado_eliminado`, motivoData);
  }

  //Solicitudes por el método get 

  //Solicitud HTTP al servidor para obtener el nombre de la empresa
  obtenerNomEmpresa(correo: string): Observable<any>{
    const params = new HttpParams().set('correo', correo)
    return this.http.get(`${this.URL}/crearF_route/nombreEmpresa`, {params});
  }

  //Solicitud HTTP al servidor para obtener historial breve del empleado a eliminar
  historialEmpleado(id: string): Observable<any> {
    return this.http.get(`${this.URL}/info_empleado/infoEmpleadoEliminar/${id}`);
  }
  
  //Solicitud HTTP al servidor para obtener la fotografia del empleado
  buscarFotografia(id: string): Observable<Blob> {
    return this.http.get(`${this.URL}/info_empleado/fotografiaDescargar/${id}`, { responseType: 'blob' });
  }

  //Solicitud HTTP al servidor para buscar empleados eliminados 
  infoEliminarEmpleado(id: string): Observable<any> {
    return this.http.get(`${this.URL}/delet_Empleado/Empleado_eliminados/${id}`);
  }

  //Solicitud HTTP al servidor para obtener los empleados de la empresa 
  inventarioGeneral(id: string): Observable<any> {
    return this.http.get(`${this.URL}/inventarioEmple/inventarioGeneral/${id}`);
  }

  //Solicitud HTTP al servidor para obtener la información detallada del empleado   
  detalleEmpleado(id: string): Observable<any> {
    return this.http.get(`${this.URL}/info_empleado/infoEmpleado/${id}`);
  }

  //Solicitud HTTP al servidor para obtener información de la plataforma más completa 
  tablasContec(id: string): Observable<any> {
    return this.http.get(`${this.URL}/info_empleado/tablaContec/${id}`);
  }

  //Solicitudes por el método delete 

  //Solicitud HTTP al servidor para eliminar el empleado
  eliminarEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/delet_Empleado/deleteEmpleado/${id}`);
  }

  //Método para establecer el correo del usuario
  setCorreoUsuario(correologin: string) {
    this.correo = correologin;
  }

  // Método para obtener el correo del usuario 
  getCorreoUsuario() {
    return this.correo;
  }
  
  //Se verifica si el usuario tiene un token 
  isAunt(): boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHerper.isTokenExpired(token) || !localStorage.getItem('token')){
      //false si no lo tienen.
      return false;
    }
    //True si lo tiene 
    return true;
  }
}
