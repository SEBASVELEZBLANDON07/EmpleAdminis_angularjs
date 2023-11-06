import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

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

  //almacenamos el nombre de la empresa ingresado al formulario
  user_f = {
    nom_empresa: '',
  }

  //almacenamos los datos del usuario administrador de la empresa 
  user_fP ={
    correo: '',
    password: '',
    nom_empresa: '',
  }

  constructor(
    private authService: AuthService,
    private route: Router,
  ){}

  // hacemos la insercion a la base de datos de la empresa y su usuario 
  crearf() {
    
    // Verifica si los campos requeridos del formulario están completos
    const formulario = document.querySelector('.login_form');
    if (formulario) {
      const camposRequeridos = formulario.querySelectorAll('[required]');
      const camposCompletos = Array.from(camposRequeridos).every((campo) => (campo as HTMLInputElement).value);
      //se muestra un indo en pantalla si faltan campos requeridos 
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

    //gauadamos el nombre de empresa para el usuario admin   
    this.user_fP.nom_empresa = this.user_f.nom_empresa;
    
    //insercion de la empresa 
    this.authService.crearf(this.user_f).subscribe(
      (res: any) => {
        
        //insercion del usuario de la empresa 
        this.authService.crearfP(this.user_fP).subscribe(   
          (res: any) => {
            this.loading = false;
            Swal.fire({
              title: 'EMPRESA INGRESADA EXITOSAMENTE',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
              this.route.navigate(['login']);
            //alert('Empresa insertada exitosamente');
          }, 
          (error) => {
            this.loading = false;
            console.log('Error: ', error);
            Swal.fire({
              title: 'No se pudo insertar la empresa',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );

      },
      (error) => {
        this.loading = false;
        console.log('Error: ', error);
        Swal.fire({
          title: 'LA EMPRESA SE ENCUENTRA SEGISTRADA',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
}



