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

  //imagen predeterminada
  imagenSrcPredeterminada: string | null = '../../../assets/perfil_empleado.PNG';

  //datos del empleado
  fotografia: string | null = null;
  nombre: string='';
  apellidos: string= '';
  cc: string= '';
  numeroCedula: string='';
  cargo: string= '';
  salario: number = 0;
  fechaNacimiento: string= '';
  pais: string='';
  cel: string= '';
  correo: string= '';
  direccion: string= '';
  horaInicio: string= '';
  horafin: string= '';
  diaInicio: string= '';
  diaFin: string= '';

  //historial breve del registro
  diastrabajados: string= '';
  inasistencias: string= '';
  horasExtras: string= '';
  incapacidades: string= '';
  
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

  //ocultamos los datos para buscar la informacion del empleado
  this.ocultar_datos();

  //varificamos que los campos esten llenos 
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

  //se busca el un breve historial del empleado
  this.authService.historialEmpleado(this.EmpleadoBusar.id_cedula).subscribe(
    (res)=>{
      //llamamos al div que se encuentra oculto
      

      this.authService.buscarFotografia(this.EmpleadoBusar.id_cedula).subscribe(
        (response: Blob) => {
          this.imagenSrcPredeterminada = null;
          this.fotografia = URL.createObjectURL(response);
          this.mostar_datos();
          this.loading = false;
        }, 
        (error) => { 
          this.loading = false;
          console.log('error: ', error); 
          Swal.fire({
            title: 'error al encontar la imagen',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      )

      //asignamos los datos a las variables
      this.nombre = res.perfil[0].nombre;
      this.apellidos = res.perfil[0].apellidos;
      this.cc = res.perfil[0].tipo_documento;
      this.numeroCedula = res.perfil[0].id_cedula;
      this.cargo = res.perfil[0].cargo;

      if (res.salario && res.salario.length > 0) {
        this.salario = res.salario[0].salario;
      }
      
      this.fechaNacimiento = res.perfil[0].fecha_nacimiento;
      this.pais = res.perfil[0].pais;
      this.cel = res.perfil[0].num_contacto;
      this.correo = res.perfil[0].correo;
      this.direccion = res.perfil[0].direccion;
      this.horaInicio = res.perfil[0].hora_inicio;
      this.horafin = res.perfil[0].hora_fin;
      this.diaInicio = res.perfil[0].primer_dias_laboral;
      this.diaFin = res.perfil[0].ultimo_dias_laboral;
      this.diastrabajados = res.asistencia[0].total_inserciones_asistencias;
      this.inasistencias = res.inasistencias[0].total_inserciones_inasistencias;

      if (res.totalHorasExtras && res.totalHorasExtras.length > 0) {
        this.horasExtras= res.totalHorasExtras[0].total;
      }
      this.incapacidades= res.incapacidades[0].total_inserciones_incapacidades;

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

  //separamos por grupos de 3 numeros al salario
  formatoSalario(salario: number): string {
    const salarioString = salario.toString();
    const salarioFormateado = salarioString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return salarioFormateado;
  }

  motivoData ={
    id_empleados_eliminados: '',
    motivo_eliminacion: '',
    fechaEliminacion: '',
  }

  butteliminar(){
    //se verifica que el campo requerido este completo 
    const formulario = document.querySelector('.form_motivo');
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
    //confirmamos la primera vez si esta seguro de eliminar
    Swal.fire({
      title: 'Se eliminará todo registro del empleado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then((result) => {
      //si se le da aceptar para eliminar el empleado
      if (result.isConfirmed) {
        //confirmamos la la segunda vez si esta seguro de eliminar
        Swal.fire({
          title: `¿Estas seguro de eliminar al empleado ${this.nombre}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6"
        }).then((result) => {
          //si se le da aceptar para eliminar el empleado
          if (result.isConfirmed) {
            
            //se cambia el loadinf de false a true para que comiense acargar mientras se procesa los datos 
            this.loading = true;

            //sacamos la fecha del dia de eliminacion 
            const fecha = new Date();
            const fechaOpcion: Intl.DateTimeFormatOptions = {
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
            };
            this.fechaActual = fecha.toLocaleDateString('es-CO', fechaOpcion)
              .split('/')
              .reverse()
              .join('-');

            console.log(this.fechaActual);

            
            this.motivoData.fechaEliminacion = this.fechaActual;
            this.motivoData.id_empleados_eliminados = this.EmpleadoBusar.id_cedula;

            console.log(this.motivoData);
            
            //se busca el empleado a quien se le va a brindar la asistencia 
            this.authService.eliminarRegistro(this.motivoData).subscribe(
              (res)=>{

                //se busca el empleado a quien se le va a brindar la asistencia 
                this.authService.eliminarEmpleado(this.EmpleadoBusar.id_cedula).subscribe(
                  (res)=>{
                    //limbiamos los campos
                    this.limbiardartos();
                    //ocultamos los datos para buscar la informacion del empleado
                    this.ocultar_datos();
                    Swal.fire({
                      title: 'Empleado Eliminado con exito ',
                      icon: 'success',
                      confirmButtonText: 'Aceptar'
                    });
                    this.loading = false;

                },
                (error)=>{
                  this.loading = false;
                  console.log('error: ', error); 
                  Swal.fire({
                    title: 'error al eliminar el empleado',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                  this.loading = false;
                }
                )
              },
              (error)=>{
                this.loading = false;
                console.log('error: ', error); 
                Swal.fire({
                  title: 'error al registrar el registro de eliminacion',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
                this.loading = false;
              }
            )
            
          //si las respuestas son cancerlar se sale sin ninguna funcion a realizar 
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      
      }
    });
  }

  limbiardartos(){
    this.imagenSrcPredeterminada = '../../../assets/perfil_empleado.PNG';
    this.fotografia = null;
    this.nombre ='';
    this.apellidos = '';
    this.cc = '';
    this.numeroCedula ='';
    this.cargo = '';
    this.salario = 0;
    this.fechaNacimiento = '';
    this.pais ='';
    this.cel = '';
    this.correo = '';
    this.direccion = '';
    this.horaInicio = '';
    this.horafin = '';
    this.diaInicio = '';
    this.diaFin = '';
    this.diastrabajados = '';
    this.inasistencias = '';
    this.horasExtras = '';
    this.incapacidades = '';
    this.motivoData ={
      id_empleados_eliminados: '',
      motivo_eliminacion: '',
      fechaEliminacion: '',
    }

    this.EmpleadoBusar = {
      id_cedula: '',
      tipo_documento: '',
     }

  }

  //se oculta el contenedor de datos
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
  }

  //datos del contenedor que contiene los datos de asistensi
  mostar_datos(){
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
