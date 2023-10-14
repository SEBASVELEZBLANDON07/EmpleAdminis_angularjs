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
    private jwtHerper: JwtHelperService) { }

  //metodo para iniciar sesion 
  Login(user:any){
    return this.http.post(`${this.URL}/userRoute/login`, user);
  }

  //metodo para insertar el prerfil de la empresa
  crearf(user_f:any){
    return this.http.post(`${this.URL}/crearF_route/InsEmpre`, user_f);
  }

  //metodo para insertar el usurio administrador de la cuenta de la empresa 
  crearfP(user_fP:any){
    return this.http.post(`${this.URL}/crearF_route/InsEmpreUSer`, user_fP);
  }

   //metodo para establecer el correo del usuario
   setCorreoUsuario(correologin: string) {
    this.correo = correologin;
  }

  // método para obtener el correo del usuario
  getCorreoUsuario() {
    return this.correo;
  }

  //metodo para obtener el nombre de la empresa
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
