import { Component, OnInit, ViewChild, ElementRef, Host} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-incapacidad',
  templateUrl: './incapacidad.component.html',
  styleUrls: ['./incapacidad.component.css']
})
export class IncapacidadComponent {

  //variable titulo empresa 
  nom_empresa: string = 'empresa';

  //estado de cargando los datos al servidor 
  loading: boolean = false;

  //datos del empleado
  nombre: string='';
  apellidos: string= '';

  //octener la fecha actual 
  fechaActual: string = '';


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
      this.ver_datos();

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

  // Función para oganizar el formato de la fecha
  cambiarFormatoFecha(fecha: string): string {
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}/${mes}/${dia}`;
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
  //para desocultar el contenedor del formulario 2
  const datosocultosDos = document.querySelector('.datosocultosDos');
  //var div = document.getElementById("miDiv");
  if(datosocultosDos instanceof HTMLElement){
    if (datosocultosDos.style.display === "block") {
      datosocultosDos.style.display = "none";
    } 
  }else{
    console.log("error no se allo el div oculto ")
    return;
  }

  //para desocultar el contenedor del formulario 2
  const datosocultosTes = document.querySelector('.datosocultosTres');
    //var div = document.getElementById("miDiv");
    if(datosocultosTes instanceof HTMLElement){
      if (datosocultosTes.style.display === "block") {
        datosocultosTes.style.display = "none";
      } 
  }else{
    console.log("error no se allo el div oculto ")
    return;
  }
  this.EmpleadoBusar.id_cedula = '',
  this.EmpleadoBusar.tipo_documento = '';

  }

  //datos del contenedor que contiene los datos de asistensi
  ver_datos(){
    //se octinen la fecha actual del momento del registro 
    const fecha = new Date();
    const fechaOpcion: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
    };
    this.fechaActual = fecha.toLocaleDateString('es-CO', fechaOpcion);


    //para desocultar el contenedor del formulario 1
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

    //para desocultar el contenedor del formulario 2
    const datosocultosDos = document.querySelector('.datosocultosDos');
      //var div = document.getElementById("miDiv");
      if(datosocultosDos instanceof HTMLElement){
        if (datosocultosDos.style.display === "none") {
          datosocultosDos.style.display = "block";
        } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }

    //para desocultar el contenedor del formulario 2
    const datosocultosTes = document.querySelector('.datosocultosTres');
      //var div = document.getElementById("miDiv");
      if(datosocultosTes instanceof HTMLElement){
        if (datosocultosTes.style.display === "none") {
          datosocultosTes.style.display = "block";
        } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
      
  }

  datos_incapacidad ={
    fecha_registro: '',
    fecha_incapacidad: '',
    causa: '',
    descripcion: '',
    archivo_incapacidad: null as File | null,
    cantidad_dias_incapacidad: '',
    id_cedula_i: '',
  }

  //se evian los datos al servidor
  enviar_incapacidad(){
    // Verifica si los campos requeridos del primer formulario están completos
    const formulario1 = document.querySelector('.formDos');
    if (formulario1) {
      const camposRequeridos1 = formulario1.querySelectorAll('[required]');
      const camposCompletos1 = Array.from(camposRequeridos1).every((campo) => (campo as HTMLInputElement).value);
      //se muestra un error en pantalla si faltan campos requeridos 
      if (!camposCompletos1) {
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

    // Verifica si los campos requeridos del primer formulario están completos
    const formulario2 = document.querySelector('.formTres');
    if (formulario2) {
      const camposRequeridos2 = formulario2.querySelectorAll('[required]');
      const camposCompletos2 = Array.from(camposRequeridos2).every((campo) => (campo as HTMLInputElement).value);
      //se muestra un error en pantalla si faltan campos requeridos 
      if (!camposCompletos2) {
        Swal.fire({
          title: 'Por favor, complete todos los campos requeridos',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }else{
      Swal.fire({
        title: 'Error: No se encontró el segundo formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    //se cambia el loadinf de false a true para que comiense acargar mientras se procesa los datos 
    this.loading = true;

    //organizamos el formato de fecha
    const convertirFecha = this.fechaActual;
    const fechaEnOrden = this.cambiarFormatoFecha(convertirFecha);
    //se asignan valores 
    this.datos_incapacidad.fecha_registro = fechaEnOrden;
    this.datos_incapacidad.id_cedula_i = this.EmpleadoBusar.id_cedula;

    //se inicia el constructor de recopilacion de formulario 
    const formData = new FormData()

    formData.append('fecha_registro', this.datos_incapacidad.fecha_registro);
    formData.append('fecha_incapacidad', this.datos_incapacidad.fecha_incapacidad);
    formData.append('causa', this.datos_incapacidad.causa);
    formData.append('descripcion', this.datos_incapacidad.descripcion);
    
    formData.append('cantidad_dias_incapacidad', this.datos_incapacidad.cantidad_dias_incapacidad);
    formData.append('id_cedula_i', this.datos_incapacidad.id_cedula_i);

    if(this.datos_incapacidad.archivo_incapacidad){
      formData.append('archivoIncapacidad', this.datos_incapacidad.archivo_incapacidad, 'pdf_de_incapacidad.pdf');
    }

    this.authService.incapacidad(formData).subscribe( 
      (res: any) => {
       
        //se reinicia todos los campos 
        this.limpiarCampos();
        this.ocultar_datos();
  
        this.loading = false;
        Swal.fire({
          title: 'incapacidad registrada con exito ',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

      }, 
      (error) => {
        console.log('Error: ', error);
        this.loading = false;
        Swal.fire({
          title: 'No se pudo insertar el la incapacidad',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    ); 
  }

  //asignar el valor del file a la estructura de datos 
  onFileSelected(event: any) {
    this.datos_incapacidad.archivo_incapacidad = event.target.files[0];
  }

  //para limbiar los datos 
  limpiarCampos(): void {
    this.datos_incapacidad = {
      fecha_registro: '',
      fecha_incapacidad: '',
      causa: '',
      descripcion: '',
      archivo_incapacidad: null as File | null,
      cantidad_dias_incapacidad: '',
      id_cedula_i: '',
    }
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
