import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptoService implements HttpInterceptor{

  //enviamos el token en cada consulta, despues de obtenerlo 
  intercept( req: HttpRequest<any>, next: HttpHandler){
    const token = localStorage.getItem('token');
    const TokenHeader = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(TokenHeader); 
  }
  constructor() { }
}
