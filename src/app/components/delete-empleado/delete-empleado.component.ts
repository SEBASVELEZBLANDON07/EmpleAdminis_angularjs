import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
//import { FormsModule } from '@angular/forms';

//Manejo de mensajes personalizados. 
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-delete-empleado',
  templateUrl: './delete-empleado.component.html',
  styleUrls: ['./delete-empleado.component.css']
})
export class DeleteEmpleadoComponent {

  //Variable título, empresa. 
  nom_empresa: string = 'empresa';

  // Estado de cargando los datos al servidor. 
  loading: boolean = false;

  //Variable para obtener la fecha actual. 
  fechaActual: string = '';

  //Imagina predeterminada.
  imagenSrcPredeterminada: string | null = '../../../assets/perfil_empleado.PNG';

  //Variable de información previa del empleado.
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

  //Historial breve del registro.
  diastrabajados: string= '';
  inasistencias: string= '';
  horasExtras: string= '';
  incapacidades: string= '';

  //Se crea un array que contendrá los datos enviados del servidor de los empleados eliminados.  
  infoEMpleadosEliminados: any[] = [];

  // Variable del ID a  buscar. 
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

  // Restablecer los campos de búsqueda 
  EmpleadoBusar = {
    nom_empresa: '',
    id_cedula: '',
    tipo_documento: '',
   }

   // Función para buscar el empleado. 
  buscarEmp(){

    // Ocultamos los datos para buscar la información del empleado.
    this.ocultar_datos();
    this.ocultar_datos_empleados_eliminados()

    // Verificamos que los campos están llenos.  
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

    this.authService.buscarEmpleado(this.EmpleadoBusar).subscribe(
      (res:any)=>{

        //Se busca un breve historial del empleado.
        this.authService.historialEmpleado(this.EmpleadoBusar.id_cedula).subscribe(
          (res)=>{

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

            //Asignamos los datos a las variables. 
            if(res.perfil && res.perfil.length > 0){
              this.nombre = res.perfil[0].nombre;
              this.apellidos = res.perfil[0].apellidos;
              this.cc = res.perfil[0].tipo_documento;
              this.numeroCedula = res.perfil[0].id_cedula;
              this.cargo = res.perfil[0].cargo;
              this.fechaNacimiento = res.perfil[0].fecha_nacimiento;
              this.pais = res.perfil[0].pais;
              this.cel = res.perfil[0].num_contacto;
              this.correo = res.perfil[0].correo;
              this.direccion = res.perfil[0].direccion;
              this.horaInicio = res.perfil[0].hora_inicio;
              this.horafin = res.perfil[0].hora_fin;
              this.diaInicio = res.perfil[0].primer_dias_laboral;
              this.diaFin = res.perfil[0].ultimo_dias_laboral;
            }
          
            if (res.salario && res.salario.length > 0) {
              this.salario = res.salario[0].salario;
            }

            if (res.asistencia && res.asistencia.length > 0) {
              this.diastrabajados = res.asistencia[0].total_inserciones_asistencias;
            }
            
            if (res.inasistencias && res.inasistencias.length > 0) {
              this.inasistencias = res.inasistencias[0].total_inserciones_inasistencias;
            }

            if (res.totalHorasExtras && res.totalHorasExtras.length > 0) {
              this.horasExtras= res.totalHorasExtras[0].total;
            }
            if(res.incapacidades && res.incapacidades.length > 0){
              this.incapacidades= res.incapacidades[0].total_inserciones_incapacidades;
            }

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

  //Función para traer el historial de empleados eliminados. 
  buttEmpleEliminados(){
    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos. 
    this.loading = true;

    this.ocultar_datos();

    this.authService.infoEliminarEmpleado(this.nom_empresa).subscribe(
      (res)=>{

        this.infoEMpleadosEliminados = res as any[];

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

    this.mostar_datos_empleados_eliminados();

  }

  //Función para buscar empleados por el documento en el historial de empleados eliminados. 
  buscarEnTabla() {
    const indiceEncontrado = this.infoEMpleadosEliminados.findIndex(
      (datos) => datos.id_empleados_eliminados === this.numeroBuscado
    );

    if (indiceEncontrado !== -1) {
      // Mover el elemento encontrado al principio del array
      const elementoEncontrado = this.infoEMpleadosEliminados.splice(indiceEncontrado, 1)[0];
      this.infoEMpleadosEliminados.unshift(elementoEncontrado);

      this.scrollIntoView(indiceEncontrado); 
    }else{
      Swal.fire({
        title: 'ducumento no encontrado ',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  // Función para resaltar el elemento encontrado.  
  scrollIntoView(indice: number) {
    const elemento = document.getElementById(`fila-${indice}`);

    if (elemento) {
      const estilosAnteriores = {
        backgroundColor: elemento.style.backgroundColor,
        boxShadow: elemento.style.boxShadow
      };

      elemento.style.backgroundColor = '#55585c';
      elemento.style.boxShadow = '0 6px 6px -6px #0E1119';

      const celdaDocumento = elemento.querySelector('.ducumentoEliminado');

      // Simular evento mouseenter
      if (celdaDocumento) {
        celdaDocumento.classList.add('simular-mouseenter');
      }

      // Establecemos los valores predeterminados.
      setTimeout(() => {
        elemento.style.backgroundColor = estilosAnteriores.backgroundColor;
        elemento.style.boxShadow = estilosAnteriores.boxShadow;

        if (celdaDocumento) {
          celdaDocumento.classList.remove('simular-mouseenter');
        }
      }, 2000);
    }
  }
  
  //Función para separar por grupos de 3 números al salario.
  formatoSalario(salario: number): string {
    const salarioString = salario.toString();
    const salarioFormateado = salarioString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return salarioFormateado;
  }

  // Restablecemos los campos de eliminar empleado.  
  motivoData ={
    id_empleados_eliminados: '',
    motivo_eliminacion: '',
    fechaEliminacion: '',
    empresa_empleado: '',
  }

  // Función para eliminar al empleado de la empresa. 
  butteliminar(){
    // Se verifica que el campo requerido esté completo. 
    const formulario = document.querySelector('.form_motivo');
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
    // Confirmamos la primera vez si está seguro de eliminar.
    Swal.fire({
      title: 'Se eliminará todo registro del empleado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then((result) => {
      //Sí, se le da aceptar para eliminar al empleado.
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
          //Sí, se le da aceptar para eliminar al empleado.  
          if (result.isConfirmed) {
            
            //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos. 
            this.loading = true;

            //Sacamos la fecha del día actual en que se elimina el empleado.
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
            
            this.motivoData.fechaEliminacion = this.fechaActual;
            this.motivoData.id_empleados_eliminados = this.EmpleadoBusar.id_cedula;

            this.motivoData.empresa_empleado = this.nom_empresa;
            
            //Se hace la solicitud de insertar el motivo de la eliminación del empleado. 
            this.authService.eliminarRegistro(this.motivoData).subscribe(
              (res)=>{

                // Se hace la solicitud para eliminar todos los archivos y registros  del empleado. 
                this.authService.eliminarEmpleado(this.EmpleadoBusar.id_cedula).subscribe(
                  (res)=>{
                    //Llamamos la función para restablecer los campos. 
                    this.limbiardartos();
                    //Ocultamos los campos de información del empleado. 
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
            
          //Si la respuesta es cancelar, se detiene el proceso de eliminación. 
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
      //Si la respuesta es cancelar, se detiene el proceso de eliminación. 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      
      }
    });
  }

  // Restablecer los datos de información previa. 
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
      empresa_empleado: '',
    }

    this.EmpleadoBusar = {
      nom_empresa: '',
      id_cedula: '',
      tipo_documento: '',
     }

  }

  // Función para ocultar el historial de los empleados eliminados. 
  ocultar_datos_empleados_eliminados(){
    const datosocultos = document.querySelector('.datosocultosEmpleadosEliminados');
    if(datosocultos instanceof HTMLElement){
      if (datosocultos.style.display === "block") {
        datosocultos.style.display = "none";
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  //Función para mostrar el historial de los empleados eliminados. 
  mostar_datos_empleados_eliminados(){
    //Para desocultarel contenedor. 
    const datosocultos = document.querySelector('.datosocultosEmpleadosEliminados');
    if(datosocultos instanceof HTMLElement){
      if (datosocultos.style.display === "none") {
        datosocultos.style.display = "block";
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // Función para ocultar los campos de la información previa.
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

  // Función para Mostar los campos de la información previa.
  mostar_datos(){
    //Se des oculta el contenedor. 
    const datosocultos = document.querySelector('.datosocultos');
      if(datosocultos instanceof HTMLElement){
        if (datosocultos.style.display === "none") {
          datosocultos.style.display = "block";
        } 
      }else{
        console.log("error no se allo el div oculto ")
        return;
      }
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

    // Verificamos si hay un valor almacenado en localStorage.
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

    // Cuando se presiona el butt para abrir la navegación 
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
