import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//decodificar
import jwt_decode from 'jwt-decode';

interface JwtTokenData {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    public route: Router
  ){}

 // Verificamos si el rol del usuario que inició sesión es un usuario autorizado.
 // Se verifica si el token está vigente. 
 // Se verifica si el campo del token está vacío o si no es una cadena validad. 
 // Si el usuario cumple las condiciones, retornará true, de lo contrario retornará false. 

  canActivate( route: ActivatedRouteSnapshot):
  boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token');
    
    //  Se verifica si el token está vacío y es una cadena validad
    if (typeof token === 'string' && token.length > 0) {
      
      const decode: JwtTokenData = jwt_decode(token); 
      const  {email, role} = decode;
      //console.log(role)

      if(!this.authService.isAunt() ){
        //console.log("no estas autorizado")
        alert("La sesión ha caducado inicia sesión de nuevo")
        this.route.navigate(['login']);
        //Retorna false si el token ha caducado
        return false; 
      }else{
        if(role !== expectedRole){
          //console.log("no estas autorizado")
          alert("Usuario no autorizado ")
          this.route.navigate(['login']);
          //Retorna false si el usuario no está autorizado
          return false;
        }else{
          console.log("autorizado")
          //alert("autorizado")
        }
      }
    } else {
      // Manejar el caso en que el token no sea una cadena válida o esté vacío
      console.error('Token no válido');
      alert("No autorizado inicia sesión");
      this.route.navigate(['login']);
    }
    // True si cumple la autenticación
    return true; 
  }
}
