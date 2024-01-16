import { Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//decodificar
import jwt_decode from 'jwt-decode';
import { Token } from '@angular/compiler';

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

  //verificamos si el rol del token es autorizado o no a la para la siguiente pagina si no es autorizado lo debuelve a login 
  canActivate( route: ActivatedRouteSnapshot):
  boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token');
    
    if (typeof token === 'string' && token.length > 0) {
      
      const decode: JwtTokenData = jwt_decode(token); 
      const  {email, role} = decode;
      //console.log(role)

      if(!this.authService.isAunt() ){
        //console.log("no estas autorizado")
        alert("La sesión ha caducado inicia sesión de nuevo")
        this.route.navigate(['login']);
        //retorna salse si el token no es autorizado 
        return false; 
      }else{
        if(role !== expectedRole){
          //console.log("no estas autorizado")
          alert("Usuario no autorizado ")
          this.route.navigate(['login']);
          //retorna salse si el token no es autorizado 
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
    // true si cumple la autenticación
    return true; 
  }
}
