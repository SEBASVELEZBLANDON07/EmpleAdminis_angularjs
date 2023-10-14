import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

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
    this.user_fP.nom_empresa = this.user_f.nom_empresa;
    
    //insercion de la empresa 
    this.authService.crearf(this.user_f).subscribe(
      (res: any) => {
        
        //insercion del usuario de la empresa 
        this.authService.crearfP(this.user_fP).subscribe(   
          (res: any) => {
              this.route.navigate(['login']);
              alert('Empresa insertada exitosamente');
          }, 
          (error) => {
            console.log('Error: ', error);
          }
        );

      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }
}



