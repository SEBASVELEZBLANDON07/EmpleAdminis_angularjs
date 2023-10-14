import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('logoojo', { static: true }) logoojo!: ElementRef;
 
  ngAfterViewInit() {

    //se establece el estado de la contraseña de visible a oculta
    let passwordVisible = false;

    this.logoojo.nativeElement.addEventListener('click', () => {
      passwordVisible = !passwordVisible;
      const type = passwordVisible ? 'text' : 'password';
      this.password.nativeElement.setAttribute('type', type);

      const iconElement = this.logoojo.nativeElement;
      iconElement.innerHTML = passwordVisible ? '👁️' : '<i class="fa-solid fa-eye-slash"></i>';
      iconElement.style.color = '#fff';
    }); 
  }

  ngOnInit() {

  }

  //se almacenan los datos enviados del formulario
  user = {
    correo: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private route: Router,
    
  ){}

 
  logIn(){
    //console.log(this.user);
    
    //almacenar el correo 
    const correo = this.user.correo;
    
    //se inicia sesion 
    this.authService.Login(this.user).subscribe( 
      (res:any) =>{
        //console.log(res)
        
        // Almacena el dato en el auth.servicio el correo de usuario 
        this.authService.setCorreoUsuario(correo); 
        
        localStorage.setItem('token', res.token);
        this.route.navigate(['inicio']);
        alert('tienes status true')
      }, 
      error =>{
      console.log('error: ', error); 
      }
    )
  }
  

}
