import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptoService implements HttpInterceptor{

  //Enviamos el token en cada consulta, después de obtenerlo 
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
