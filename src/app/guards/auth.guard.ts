import { Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private route: Router
  ){}

  //se verifica el estado del token 
  canActivate(): 
  boolean {
      if(!this.authService.isAunt()){
        //console.log("token no vlido inicia seccion de nuevo");
        this.route.navigate(['login'])
        alert ('token caducado inicia sesion')
        // false si el token caduco
        return false;
      }
      // true si se cumple la autenticación
       return true; 
  }
}
