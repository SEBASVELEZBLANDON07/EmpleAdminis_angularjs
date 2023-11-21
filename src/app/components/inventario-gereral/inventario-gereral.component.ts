import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Route, Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

 // Declaración para particlesJS
declare var particlesJS: any;

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-gereral',
  templateUrl: './inventario-gereral.component.html',
  styleUrls: ['./inventario-gereral.component.css']
})
export class InventarioGereralComponent {

  //variable titulo empresa 
  nom_empresa: string = 'empresa';

  //estado de cargando los datos al servidor 
  loading: boolean = false;

  //se crea un array que contrendra los datos enviados del servidor de los empleados eliminados  
  infoEmpleados: any[] = [];

  //numero a buscar 
  numeroBuscado: number | null = null;


  @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
  @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
  @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;

  constructor(
    private authService: AuthService,
    private route: Router,
  ){}

/*
  ngAfterViewInit() {
    this.inicializarParticulas();
  }
*/

//se ase la solicitud http para traer informacion basica de los empleados de la empresa
inventariogeneral(){
  
  //se cambia el loadinf de false a true para que comiense acargar mientras se procesa los datos 
  this.loading = true;
  
  this.authService.inventarioGeneral(this.nom_empresa).subscribe(
    (res)=>{
      this.infoEmpleados = res as any[];
      this.loading = false;
    },
    (error)=>{
      this.loading = false;
      console.log('error: ', error); 
      Swal.fire({
        title: 'error al buscar los empleados eliminados',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.loading = false;
    }
    )
}

 //funcion para buscar empleados por el ducumento en la tabla
 buscarEnTabla() {
  const indiceEncontrado = this.infoEmpleados.findIndex(
    (datos) => datos.id_cedula === this.numeroBuscado
  );

  console.log(indiceEncontrado);

  if (indiceEncontrado !== -1) {
    // Mover el elemento encontrado al principio del array
    const elementoEncontrado = this.infoEmpleados.splice(indiceEncontrado, 1)[0];
    this.infoEmpleados.unshift(elementoEncontrado);

    this.scrollIntoView(indiceEncontrado); 
  }else{
    Swal.fire({
      title: 'ducumento no encontrado ',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    })
  }
}

// resaltar el elemento encontrado 
scrollIntoView(indice: number) {
  const elemento = document.getElementById(`fila-${indice}`);

  if (elemento) {
    const estilosAnteriores = {
      backgroundColor: elemento.style.backgroundColor,
      boxShadow: elemento.style.boxShadow
    };

    elemento.style.backgroundColor = '#55585c';
    elemento.style.boxShadow = '0 6px 6px -6px #0E1119';

    const celdaDocumento = elemento.querySelector('.ducumento');

    // Simular evento mouseenter
    if (celdaDocumento) {
      celdaDocumento.classList.add('simular-mouseenter');
    }

    // restablecemos los valores predeterminados
    setTimeout(() => {
      elemento.style.backgroundColor = estilosAnteriores.backgroundColor;
      elemento.style.boxShadow = estilosAnteriores.boxShadow;

      if (celdaDocumento) {
        celdaDocumento.classList.remove('simular-mouseenter');
      }
    }, 2000);
  }
}


//se redirige asia la ruta de detalles del empleado donde se encuentra toda la informacion del empleado
redireccionar(idCedula: string) {
  this.route.navigate(['/InventarioGeneral/detalle-empleado', idCedula]);
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

  ngOnInit() {
    
    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');

    //verificamos si hay un valor almacenado en localStorage, 
    if (nom_empresaGuardada) {
      // lo asigna a la variable nom_empresa
      this.nom_empresa = nom_empresaGuardada;
    } else {
      // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
      this.nom_empresa = 'perfil empresa x';
    }

    //se ejecuta la solicitud http para traer informacion basica de los empleados
    this.inventariogeneral()

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

        this.columnacentral.nativeElement.style.flexBasis = '1250px';
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

        this.columnacentral.nativeElement.style.flexBasis = '1250px';
        this.columnacentral.nativeElement.classList.add('columna-derecha-reducir');
        
        botonabrir=0;
      }else{
        this.columnaizquierda.nativeElement.style.flexBasis = '5%';
        this.columnaizquierda.nativeElement.classList.remove('columna-izquierda-ambliar');

        this.columnaderecha.nativeElement.style.flexBasis = '5%';
        this.columnaderecha.nativeElement.classList.remove('columna-derecha-reducir');

        this.columnacentral.nativeElement.style.flexBasis = '1250px';
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
