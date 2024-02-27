import {  Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//Manejo de mensajes personalizados. 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 // Estado de cargando los datos al servidor. 
 loading: boolean = false;

  // Referencias a elementos HTML utilizados en la plantilla del componente
  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('logoojo', { static: true }) logoojo!: ElementRef;

  constructor(
    private authService: AuthService,
    private route: Router,
  ){}
 
  ngAfterViewInit() {

    //Se establece el estado de la contraseña de visible a oculta
    let passwordVisible = false;

    //Se ejecuta el cambio de estado del ojo, invierte el estado en que se encuentre  
    this.logoojo.nativeElement.addEventListener('click', () => {
      passwordVisible = !passwordVisible;
      const type = passwordVisible ? 'text' : 'password';
      this.password.nativeElement.setAttribute('type', type);

      // Se muestra el nuevo estilo del ojo de vista de la contraseña 
      const iconElement = this.logoojo.nativeElement;
      iconElement.innerHTML = passwordVisible ? '👁️' : '<i class="fa-solid fa-eye-slash"></i>';
      iconElement.style.color = '#fff';
    }); 
  }

  ngOnInit() {
  }

  //Se almacenan los datos enviados del formulario
  user = {
    correo: '',
    password: ''
  }

  //Función para verificar al usuario que está iniciando sesión, Si los campos son correctos, lo redirige al inicio. 
  logIn(){
    // Verifica si los campos requeridos del formulario están completos
    const formulario = document.querySelector('.login_form');
    if (formulario) {
      const camposRequeridos = formulario.querySelectorAll('[required]');
      const camposCompletos = Array.from(camposRequeridos).every((campo) => (campo as HTMLInputElement).value);
      //Se muestra una info en pantalla si faltan campos requeridos 
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

    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos 
    this.loading = true;
    
    //Almacenar el correo 
    const correo = this.user.correo;
    
    // Se hace la solicitud de verificación del usuario al servidor
    this.authService.Login(this.user).subscribe( 
      (res:any) =>{
        // Almacena el dato en el auth.servicio el correo de usuario 
        this.authService.setCorreoUsuario(correo); 
        
        // Se almacena el token en el localStorege para su autenticación con el servidor
        localStorage.setItem('token', res.token);

        this.loading = false;
        Swal.fire({
          title: 'EXITO',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Se redirige al inicio 
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
