import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private URL = 'http://localhost:8080'; 

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
