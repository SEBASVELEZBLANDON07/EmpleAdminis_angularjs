import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Route, Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

 // Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('tituloAnimation', [
      state('in', style({ transform: 'rotateY(0deg)' })),
      state('out', style({ transform: 'rotateY(360deg)' })),
      transition('in => out', animate('400ms ease-out')),
      transition('out => in', animate('400ms')),
    ]),
  ],
})
export class InicioComponent implements OnInit {

  //variables del titulo empresa x
  nom_empresa: string = 'empresa';
  CorreoUsuario: string = '';
  
  @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
  @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
  @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;

  constructor( 
    private router: ActivatedRoute, 
    private authService: AuthService,
  ) {}

  ngAfterViewInit() {
    this.obtenerCorreoUsuario();
    this.obtenerCorreoUsuarioPorCorreo(this.CorreoUsuario);
  }

  inicializarParticulas(){
    //menu izquierda animacion
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 150,
        },

        "color": {
          "value": ["#0ce513", "#0921f5", "#e0dd06", "#f51111"]
        },
      
        "size": {
          "value": 3,
        },

        "line_linked": {
          "distance": 150,
          "color":  "#1ae49a",
        },

        "move": {
          "speed": 6,
        }

      },
      "interactivity": {
        "events": {
          "onhover": {
            "mode": "repulse"
          },
        },

        "modes": {
          "repulse": {
            "distance": 150,
            "duration": 0.4
          }
        }
      },
    });
  }

 //se presiona el butt de abrir menu desplegable 
buttabrirnavegacion(){
  this.inicializarParticulas();
}


  //obtengo el correo con el que se ingreso el usuario 
  obtenerCorreoUsuario() {
    this.CorreoUsuario = this.authService.getCorreoUsuario();
  }

  obtenerCorreoUsuarioPorCorreo(correo: string) {
    //hacemos la consulta para identificar el nombre de la empresa con la que se inicio sesion 
    this.authService.obtenerNomEmpresa(correo).subscribe(
      (response: any) => {
        this.nom_empresa = response.nomEmpresa;

        //lo guardamos en el localStorage
        localStorage.setItem('nom_empresa', this.nom_empresa);
      },
      (error) => { 
        console.error('Error al obtener el nombre de la empresa:', error); 
      }
    );
  }

  ngOnInit() {
    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');

    //verificamos si hay un valor almacenado en localStorage, 
    if (nom_empresaGuardada) {
      // lo asigna a la variable nom_empresa
      this.nom_empresa = nom_empresaGuardada;
      this.inicializarParticulas();
    } else {
      // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
      this.nom_empresa = 'perfil empresa x';
    }


    //metodo para abrir navegacion desplegable
    //definimos variables de estado
    let botoncerrar = 0;
    let botonabrir = 0;
    let estado= false;

    //cuando se presiona el butt para abrir la navegacion 
    this.abrirnavegacion.nativeElement.addEventListener('click', () => {
      estado = true;
      botonabrir=1;
      botoncerrar=botoncerrar+1;
    })

    //se se seleciona algona ocion del menu desplegable 
    this.menu.nativeElement.addEventListener('click', (elemento: MouseEvent) => {
      estado = false;
      if(elemento.target instanceof HTMLElement) {
        const opcionseleccionada = elemento.target.closest('.menu-contenido a');
        if (elemento.target.closest('.menu-contenido a')) { 
          console.log(opcionseleccionada); 
        }
      }
    });

    //dependiendo que se presiona se define el evento de cierre o desplegar el menu 
    document.addEventListener('click', () => {

      if(estado == true && botoncerrar === 2){
        this.columnaizquierda.nativeElement.style.flexBasis = '5%';
        this.columnaizquierda.nativeElement.classList.remove('columna-izquierda-ambliar');

        this.columnaderecha.nativeElement.style.flexBasis = '5%';
        this.columnaderecha.nativeElement.classList.remove('columna-derecha-reducir');

        this.columnacentral.nativeElement.style.flexBasis = '1000px';
        this.columnacentral.nativeElement.classList.remove('columna-central-reducir');

        this.menu.nativeElement.style.left = '-40%';
        this.menu.nativeElement.classList.remove('menu-abrir');
        botoncerrar = 0;
        
      } else  if(estado == true){
      
        this.menu.nativeElement.style.left = '0';
        this.menu.nativeElement.classList.add('menu-abrir');

        this.columnaizquierda.nativeElement.style.flexBasis = '20%';
        this.columnaizquierda.nativeElement.classList.add('columna-izquierda-ambliar');

        this.columnaderecha.nativeElement.style.flexBasis = '0.05%';
        this.columnaderecha.nativeElement.classList.add('columna-derecha-reducir');

        this.columnacentral.nativeElement.style.flexBasis = '1000px';
        this.columnacentral.nativeElement.classList.add('columna-derecha-reducir');
        
        botonabrir=0;
      }else{
        this.columnaizquierda.nativeElement.style.flexBasis = '5%';
        this.columnaizquierda.nativeElement.classList.remove('columna-izquierda-ambliar');

        this.columnaderecha.nativeElement.style.flexBasis = '5%';
        this.columnaderecha.nativeElement.classList.remove('columna-derecha-reducir');

        this.columnacentral.nativeElement.style.flexBasis = '1000px';
        this.columnacentral.nativeElement.classList.remove('columna-central-reducir');

        this.menu.nativeElement.style.left = '-40%';
        this.menu.nativeElement.classList.remove('menu-abrir');
      
        botoncerrar=0;
      }
      estado= false;
    });

    window.onload = () => {  
    }
  }
}

