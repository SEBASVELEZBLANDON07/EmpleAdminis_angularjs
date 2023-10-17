import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 //estado de cargando los datos al servidor 
 loading: boolean = false;

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
    // Verifica si los campos requeridos del formulario están completos
    const formulario = document.querySelector('.login_form');
    if (formulario) {
      const camposRequeridos = formulario.querySelectorAll('[required]');
      const camposCompletos = Array.from(camposRequeridos).every((campo) => (campo as HTMLInputElement).value);
      //se muestra un info en pantalla si faltan campos requeridos 
      if (!camposCompletos) {
        Swal.fire({
          title: 'Por favor, complete todos los campos requeridos',
          icon: 'info',
          confirmButtonText: 'Aceptar'
         });
        return;
      }
    }else {
      Swal.fire({
        title: 'Error: No se encontró el primer formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    //se cambia el loadinf de false a true para que comiense acargar mientras se procesa los datos 
    this.loading = true;
    
    //almacenar el correo 
    const correo = this.user.correo;
    
    //se inicia sesion 
    this.authService.Login(this.user).subscribe( 
      (res:any) =>{
        // Almacena el dato en el auth.servicio el correo de usuario 
        this.authService.setCorreoUsuario(correo); 
        
        localStorage.setItem('token', res.token);

        this.loading = false;
        Swal.fire({
          title: 'EXITO',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.route.navigate(['inicio']);
      }, 
      error =>{
        this.loading = false;
        console.log('error: ', error); 
        Swal.fire({
          title: 'USUARIO O CONTRASEÑA INCORRECTO',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
    }
    )
  }
}
