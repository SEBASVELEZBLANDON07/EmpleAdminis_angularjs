import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//Manejo de mensajes personalizados. 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

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

  //Nombre de la empresa 
  user_f = {
    nom_empresa: '',
  }

  //Datos del usuario administrador de la empresa.
  user_fP ={
    correo: '',
    password: '',
    nom_empresa: '',
  }

  //Función para registrar la empresa en la plataforma
  crearf() {
    // Verifica si los campos requeridos del formulario están completos
    const formulario = document.querySelector('.login_form');
    if (formulario) {
      const camposRequeridos = formulario.querySelectorAll('[required]');
      const camposCompletos = Array.from(camposRequeridos).every((campo) => (campo as HTMLInputElement).value);
      //Se muestra una info en pantalla si faltan campos requeridos. 
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

    //Se guarda el nombre de la empresa para el usuario admin  
    this.user_fP.nom_empresa = this.user_f.nom_empresa;
    
    //Se hace la solicitud al servidor para registrar la empresa 
    this.authService.crearf(this.user_f).subscribe(
      (res: any) => {
        
        //Se hace la solicitud al servidor para registrar los datos del usuario administrador 
        this.authService.crearfP(this.user_fP).subscribe(   
          (res: any) => {
            this.loading = false;
            Swal.fire({
              title: 'EMPRESA INGRESADA EXITOSAMENTE',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            //Si se registró la empresa con éxito, se redirige al login 
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
