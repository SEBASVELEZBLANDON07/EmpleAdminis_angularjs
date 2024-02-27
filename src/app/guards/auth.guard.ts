import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private route: Router
  ){}

  //Se verifica el estado del token 
  canActivate(): 
  boolean {
      if(!this.authService.isAunt()){
        this.route.navigate(['login'])
        alert ('token caducado inicia sesion')
        // False si el token caduco
        return false;
      }
      // True si se cumple la autenticación  
       return true; 
  }
}
