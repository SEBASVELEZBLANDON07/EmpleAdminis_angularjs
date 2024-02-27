import { Component, OnInit, ViewChild, ElementRef, Host} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//Manejo de mensajes personalizados.  
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent {

 //Variable título empresa. 
 nom_empresa: string = 'empresa';

 // Estado de cargando los datos al servidor.. 
 loading: boolean = false;

 //Obtener la fecha actual 
 fechaActual: string = '';
 timeActual: string = '';

 //Datos del empleado. 
 nombre: string='';
 apellidos: string= '';

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

  // particles-js
 inicializarParticulas(){
   //Menú izquierdo animación. 
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

  //Se presiona el butt para abrir menú desplegable. 
  buttabrirnavegacion(){
    this.inicializarParticulas();
  }

  // Restablecer los campos de búsqueda 
 EmpleadoBusar = {
  nom_empresa: '',
  id_cedula: '',
  tipo_documento: '',
 }

 //Función para buscar el empleado. 
 buscarEmp(){
    const formulario = document.querySelector('.form');
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

    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos. 
    this.loading = true;
    
    this.EmpleadoBusar.nom_empresa = this.nom_empresa;

    //se busca el empleado a quien se le va a brindar la asistencia 
    this.authService.buscarEmpleado(this.EmpleadoBusar).subscribe(
      (res:any)=>{
        //Llamamos al div que se encuentra oculto.
        this.datos_de_fechas();

        //Asignamos las variables de nombre y apellidos 
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

  // Función para organizar el formato de la fecha.
  cambiarFormatoFecha(fecha: string): string {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}/${mes}/${dia}`;
  }
  
  // Restablecer los campos de asistencia. 
  datosasistencia={
    fecha: '',
    horario: '',
    id_cedula_a: '',
  }

  //Se registra la asistencia del empleado.
  Regis_asistencia(){
    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos. 
    this.loading = true;

    //Organizamos el formato de fecha. 
    const convertirFecha = this.fechaActual;
    const fechaEnOrden = this.cambiarFormatoFecha(convertirFecha);

    //Asignamos valores.  
    this.datosasistencia.fecha=fechaEnOrden;
    this.datosasistencia.horario=this.timeActual;
    this.datosasistencia.id_cedula_a=this.EmpleadoBusar.id_cedula;
    
    //Se envía la solicitud de al servidor para almacenar la asistencia. 
    this.authService.asistencia_i(this.datosasistencia).subscribe(   
      (res: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Asistencia ingresada',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.ocultar_datos_de_fechas();
      }, 
      (error) => {
        console.log('Error: ', error);
        this.loading = false;
        Swal.fire({
          title: 'No se pudo insertar la asistencia',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  //Se oculta el contenedor con los campos de asistencia.  
  ocultar_datos_de_fechas(){
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

  //Datos del contenedor que contiene los campos de asistencia.
  datos_de_fechas(){
    //Se obtienen la fecha actual del momento del registro. 
    const fecha = new Date();
    const fechaOpcion: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
    };
    this.fechaActual = fecha.toLocaleDateString('es-CO', fechaOpcion);

    //Se obtienen la hora actual del registro.
    const hora= new Date();
    const horaOpcion: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    this.timeActual = hora.toLocaleTimeString('es-CO', horaOpcion);

    //Función Se des oculta el contenedor. 
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

  // Ejecuciones automáticas, se ejecutan una vez que se inicie el componente 
  ngOnInit(): void {
    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');
    //Verificamos si hay un valor almacenado en localStorage 
    if (nom_empresaGuardada) {
      // Lo asigna a la variable nom_empresa 
      this.nom_empresa = nom_empresaGuardada;
    } else {
      // Si no hay un valor almacenado, se designa un valor predeterminado 
      this.nom_empresa = 'perfil empresa x';
    }

    // método para abrir navegación desplegable.
    // Definimos variables de estado.
    let botoncerrar = 0;
    let botonabrir = 0;
    let estado= false;

    //Cuando se presiona el butt para abrir la navegación 
    this.abrirnavegacion.nativeElement.addEventListener('click', () => {
      estado = true;
      botonabrir=1;
      botoncerrar=botoncerrar+1;
    })

    //Se selecciona alguna opción del menú desplegable. 
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
