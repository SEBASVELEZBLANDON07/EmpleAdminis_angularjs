import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

 // Declaración para particlesJS
declare var particlesJS: any;

//Manejo de mensajes personalizados. 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-gereral',
  templateUrl: './inventario-gereral.component.html',
  styleUrls: ['./inventario-gereral.component.css']
})
export class InventarioGereralComponent {

  //Variable título, empresa. 
  nom_empresa: string = 'empresa';

  // Estado de cargando los datos al servidor. 
  loading: boolean = false;

  //Se crea un array que contendrá los datos enviados del servidor de los empleados eliminados 
  infoEmpleados: any[] = [];

  //Número a buscar 
  numeroBuscado: number | null = null;

  // Referencias a elementos HTML utilizados en la plantilla del componente
  @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
  @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
  @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;

  constructor(
    private authService: AuthService,
    private route: Router,
  ){}

  //Se ase la solicitud http para traer información básica de los empleados de la empresa
  inventariogeneral(){
    
    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos 
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

  //Función para buscar empleados de la empresa 
  buscarEnTabla() {
    // Se busca el elemento que contiene la cédula que se está buscando 
    const indiceEncontrado = this.infoEmpleados.findIndex(
      (datos) => datos.id_cedula === this.numeroBuscado
    );

    // Si encontramos la cédula que se está buscando, se desplaza a la primera fila  
    if (indiceEncontrado !== -1) {
      // Mover el elemento encontrado al principio del array
      const elementoEncontrado = this.infoEmpleados.splice(indiceEncontrado, 1)[0];
      this.infoEmpleados.unshift(elementoEncontrado);
      this.resaltarElemento(indiceEncontrado); 
    }else{
      // si no se encuentra la cedula se manda una info 
      Swal.fire({
        title: 'ducumento no encontrado ',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  //Función para resaltar el elemento encontrado. 
  resaltarElemento(indice: number) {
    // Se obtener el elemento HTML
    const elemento = document.getElementById(`fila-${indice}`);

    // Si se encuentra el elemento 
    if (elemento) {
      const estilosAnteriores = {
        backgroundColor: elemento.style.backgroundColor,
        boxShadow: elemento.style.boxShadow
      };

      // Estilos para resaltar la fila 
      elemento.style.backgroundColor = '#55585c';
      elemento.style.boxShadow = '0 6px 6px -6px #0E1119';

      // Se obtiene la celda de la cédula 
      const celdaDocumento = elemento.querySelector('.ducumento');

      // Se resalta la celda de la fila por donde pase el mouse  
      if (celdaDocumento) {
        celdaDocumento.classList.add('simular-mouseenter');
      }

      // Se restablecen los estilos predeterminados al pasar 2 segundos
      setTimeout(() => {
        elemento.style.backgroundColor = estilosAnteriores.backgroundColor;
        elemento.style.boxShadow = estilosAnteriores.boxShadow;

        if (celdaDocumento) {
          celdaDocumento.classList.remove('simular-mouseenter');
        }
      }, 2000);
    }
  }

  //Se redirige hacia la ruta de detalles del empleado donde se encuentra toda la información del empleado seleccionado  
  redireccionar(idCedula: string) {
    this.route.navigate(['/InventarioGeneral/detalle-empleado', idCedula]);
  }

  // particles-js
  inicializarParticulas(){
    //Menú izquierdo animación
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

 //Se presiona el butt de abrir menú desplegable 
  buttabrirnavegacion(){
    this.inicializarParticulas();
  }

  // Ejecuciones automáticas, se ejecutan una vez que se inicie el componente 
  ngOnInit() {
    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');

    //Verificamos si hay un valor almacenado en localStorage 
    if (nom_empresaGuardada) {
      // Lo asigna a la variable nom_empresa
      this.nom_empresa = nom_empresaGuardada;
    } else {
      // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
      this.nom_empresa = 'perfil empresa x';
    }

    //se ejecuta la solicitud http para traer informacion basica de los empleados
    this.inventariogeneral()

    //Método para abrir navegación desplegable
    //Definimos variables de estado
    let botoncerrar = 0;
    let botonabrir = 0;
    let estado= false;

    //Cuando se presiona el butt para abrir la navegación 
    this.abrirnavegacion.nativeElement.addEventListener('click', () => {
      estado = true;
      botonabrir=1;
      botoncerrar=botoncerrar+1;
    })

    //Se selecciona alguna opción del menú desplegable  
    this.menu.nativeElement.addEventListener('click', (elemento: MouseEvent) => {
      estado = false;
      if(elemento.target instanceof HTMLElement) {
        const opcionseleccionada = elemento.target.closest('.menu-contenido a');
        if (elemento.target.closest('.menu-contenido a')) { 
          console.log(opcionseleccionada); 
        }
      }
    });

    //Dependiendo de qué se presiona, se define el evento de cierre o desplegar el menú  
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
