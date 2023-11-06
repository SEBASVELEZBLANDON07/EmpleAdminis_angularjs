import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-delete-empleado',
  templateUrl: './delete-empleado.component.html',
  styleUrls: ['./delete-empleado.component.css']
})
export class DeleteEmpleadoComponent {

  //variable titulo empresa 
  nom_empresa: string = 'empresa';

  //estado de cargando los datos al servidor 
  loading: boolean = false;

  //octener la fecha actual 
  fechaActual: string = '';
  timeActual: string = '';

  //datos del empleado
  nombre: string='';
  apellidos: string= '';


   @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
   @ViewChild('menu', { static: true }) menu!: ElementRef;
   @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
   @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
   @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;
 
  constructor(
    private authService: AuthService,
    private route: Router,
  ){}

  EmpleadoBusar = {
    id_cedula: '',
    tipo_documento: '',
   }

   //funcion para buscar el empleado 
 buscarEmp(){
  const formulario = document.querySelector('.form');
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

  //se busca el empleado a quien se le va a brindar la asistencia 
  this.authService.buscarEmpleado(this.EmpleadoBusar).subscribe(
    (res:any)=>{
      //llamamos al div que se encuentra oculto
      this.mostar_datos();

      //asicnamos las variables de nombre y pellidos 
      this.nombre = res.nombre;
      this.apellidos = res.apelidos;

      this.loading = false;
    },
    (error)=>{
      this.loading = false;
      console.log('error: ', error); 
      Swal.fire({
        title: 'usuario no encontrado',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  );
}


 //se oculta el contenedor de datos de asistencia 
 ocultar_datos(){
  const datosocultos = document.querySelector('.datosocultos');
  if(datosocultos instanceof HTMLElement){
    if (datosocultos.style.display === "block") {
      datosocultos.style.display = "none";
    } 
  }else{
    console.log("error no se allo el div oculto ")
    return;
  }
  this.EmpleadoBusar.id_cedula = '',
  this.EmpleadoBusar.tipo_documento = '';
}

//datos del contenedor que contiene los datos de asistensi
mostar_datos(){
  //se octinen la fecha actual del momento del registro 
  const fecha = new Date();
  const fechaOpcion: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
  };
  this.fechaActual = fecha.toLocaleDateString('es-CO', fechaOpcion);

  //se octinen la hora actual del registro
  const hora= new Date();
  const horaOpcion: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  this.timeActual = hora.toLocaleTimeString('es-CO', horaOpcion);

  //para desocultar el contenedor 
  const datosocultos = document.querySelector('.datosocultos');
    //var div = document.getElementById("miDiv");
    if(datosocultos instanceof HTMLElement){
      if (datosocultos.style.display === "none") {
        datosocultos.style.display = "block";
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
}

 /*
   ngAfterViewInit() {
     this.inicializarParticulas();
   }
 */
 
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
