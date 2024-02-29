import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// Declaración para particlesJS
declare var particlesJS: any;

//Manejo de mensajes personalizados. 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-empleado',
  templateUrl: './detalle-empleado.component.html',
  styleUrls: ['./detalle-empleado.component.css']
})
export class DetalleEmpleadoComponent {
  //Variable título, empresa. 
  nom_empresa: string = 'empresa';

  // Estado de cargando los datos al servidor. 
  loading: boolean = false;

  // Estados de los botones de las tablas de contenido
  estatusAsistencia: boolean = false;
  estatusHorasExtras: boolean = false;
  estatusInasistencia: boolean = false;
  estatusIncapacidad: boolean = false;

  // Array de los datos de las tablas 
  ContTablaAsistenciaPorMes: any[] = [];
  ContTablaHorasExtrasPorMes: any[] = [];
  ContTablainasistenciaPorMes: any[] = [];
  ContTablaIncapacidadPorMes: any[] = [];

  //Variable del ID del empleado
  idCedula: string = '';

  //imagen predeterminada
  imagenSrcPredeterminada: string | null = '../../../assets/perfil_empleado.PNG';

  //Datos del empleado
  fotografia: string | null = null;
  nombre: string='';
  apellidos: string= '';
  cc: string= '';
  numeroCedula: string='';
  cargo: string= '';
  fechaNacimiento: string= '';
  pais: string='';
  cel: string= '';
  correo: string= '';
  direccion: string= '';
  horaInicio: string= '';
  horafin: string= '';
  diaInicio: string= '';
  diaFin: string= '';

  // Cuenta bancaria 
  num_cuenta_bancaria: string= '';
  nom_banco: string = '';
  tipo_cuenta: string = '';
  salario: number = 0;

  //Asistencia
  fechaAsistencia: string = '';
  horario: string = '';

  //Inasistencia
  fechaInasistencia: string = '';

  //Incapacidad
  fechaRegistroIncapacidad: string = '';
  fecha_incapacidad: string = '';
  causa: string = '';
  descripcion: string = '';
  archivo_incapacidad: string = '';
  cantidad_dias_incapacidad: number = 0;

  //Horas extras  
  fechaRegistroHorasExtras: string = '';
  horas_extras: number = 0;
  totalHorasExtras: number = 0;

  // Referencias a elementos HTML utilizados en la plantilla del componente
  @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
  @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
  @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;

  constructor(
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute,
  ){}

  // Se hace la consulta al servidor para traer la información del empleado 
  detallEmpleado(id_empleado: string){

    //Se cambia el loadinf de false a true para que comience a cargar mientras se procesan los datos 
    this.loading = true;

    // Se hace la consulta al servidor de los datos principales 
    this.authService.detalleEmpleado(id_empleado).subscribe(
      (res)=>{

        // Se solicita la fotografía del empleado 
        this.authService.buscarFotografia(id_empleado).subscribe(
          (response: Blob) => {
            this.imagenSrcPredeterminada = null;
            this.fotografia = URL.createObjectURL(response);
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
        //Datos del empleado
        if (res.perfil && res.perfil.length > 0 ) {
          this.nombre = res.perfil[0].nombre;
          this.apellidos = res.perfil[0].apellidos;
          this.cc = res.perfil[0].tipo_documento;
          this.numeroCedula =res.perfil[0].id_cedula;
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
        
        // Cuenta bancaria 
        if(res.cuentaBancaria && res.cuentaBancaria.length > 0 ){
          this.num_cuenta_bancaria = res.cuentaBancaria[0].num_cuenta_bancaria;
          this.nom_banco  = res.cuentaBancaria[0].nom_banco;
          this.tipo_cuenta  = res.cuentaBancaria[0].tipo_cuenta;
          this.salario  = res.cuentaBancaria[0].salario; 
        }
         
        //Asistencia
        if(res.asistencia && res.asistencia.length > 0){
          this.fechaAsistencia  = res.asistencia[0].fecha;
          this.horario  = res.asistencia[0].horario;
        }
        
        //Inasistencia 
        if(res.inasistencia && res.inasistencia.length > 0){
          this.fechaInasistencia  = res.inasistencia[0].fecha;
        }

        //Incapacidad
        if(res.incapacidades && res.incapacidades.length > 0){
          this.fechaRegistroIncapacidad = res.incapacidades[0].fecha_registro;
          this.fecha_incapacidad  = res.incapacidades[0].fecha_incapacidad;
          this.causa  = res.incapacidades[0].causa;
          this.descripcion  = res.incapacidades[0].descripcion;
          this.archivo_incapacidad  = res.incapacidades[0].archivo_incapacidad;
          this.cantidad_dias_incapacidad  = res.incapacidades[0].cantidad_dias_incapacidad;
        }
        
        //Horas extras 
        if(res.horasExtras && res.horasExtras.length > 0){
          this.fechaRegistroHorasExtras  = res.horasExtras[0].fecha;
          this.horas_extras  = res.horasExtras[0].horas_extras;
          this.totalHorasExtras  = res.horasExtras[0].total;
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
    )
  }

  // Se ase la solicitud al servido para el contenido completo de las tablas 
  contenidoTablas(empleadoID: string){

    this.authService.tablasContec(empleadoID).subscribe(
      (res:any)=>{

        // Se almacenan los datos de la respuesta en las variables de array
        this.ContTablaAsistenciaPorMes = this.procesarDatosPorMes(res.asistencia);
        this.ContTablaHorasExtrasPorMes = this.procesarDatosPorMes(res.horas_extras);
        this.ContTablainasistenciaPorMes = this.procesarDatosPorMes(res.inasistencia);
        this.ContTablaIncapacidadPorMes = this.procesarDatosPorMes(res.incapacidad);
      },
      (error)=>{
        this.loading = false;
        console.log('error: ', error); 
        Swal.fire({
          title: 'error al buscar los empleados eliminados',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.log("error", error)
      }
    )
  }

  // Función para organizar los datos por meses
  procesarDatosPorMes(arrayDatos: any[]): any[] {
    const datosPorMes: any[] = [];

    // Agrupar los datos por mes
    const DatosAgrupados = arrayDatos.reduce((acc, curr) => {
      const fecha = new Date(curr.fecha);
      const mes = fecha.getMonth() + 1;
      const key = fecha.getFullYear() + '-' + (mes < 10 ? '0' : '') + mes;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(curr);
        return acc;
    }, {});

    // Convertir el objeto de datos agrupandolos en un array
    for (const key in DatosAgrupados) {
      if (Object.prototype.hasOwnProperty.call(DatosAgrupados, key)) {
        datosPorMes.push({ mes: key, arrayDatos: DatosAgrupados[key] });
      }
    }
    return datosPorMes;
  }

  //Apartamos por grupos de 3 números al salario
  formatoSalario(salario: number): string {
    const salarioString = salario.toString();
    const salarioFormateado = salarioString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return salarioFormateado;
  }

  // Botón para abrir tablas de asistencia
  buttAsistencia(){
    //Se verifica el estatus del botón
    if(this.estatusAsistencia == false){
      this.mostar_datosAsistencia();
    }else{
      this.ocultar_datosAsistencia();
    }
  }

  // Función para mostrar las tablas de asistencia 
  mostar_datosAsistencia(){
    const datostablas = document.querySelector('.contenedo_asistencia');
    const datosPrincipales = document.querySelector('.contenedo_asistencia_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "none") {
        // Se muestran las tablas 
        datostablas.style.display = "block";
        if(datosPrincipales instanceof HTMLElement){
          // Se ocultan los datos previos 
          datosPrincipales.style.display = "none"
        }else{
          console.log("error no se allo el div")
          return;
        }
        this.estatusAsistencia = true
      } 
    }else{
      console.log("error no se allo el div")
      return;
    }
  }

  // Función para ocultar las tablas de asistencia
  ocultar_datosAsistencia(){
    const datostablas = document.querySelector('.contenedo_asistencia');
    const datosPrincipales = document.querySelector('.contenedo_asistencia_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "block") {
        // Se ocultan las tablas 
        datostablas.style.display = "none";
        if(datosPrincipales instanceof HTMLElement){
          // Se muestran los datos previos 
          datosPrincipales.style.display = "block"
        }
        this.estatusAsistencia = false
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // buton para abrir datos de incapacidad 
  buttIncapacidad(){
    //Se verifica el estatus del botón
    if(this.estatusIncapacidad == false){
      this.mostar_datosTablaIncapacidad();
    }else{
      this.ocultar_datosTablaIncapacidad();
    }
  }

  // Función para mostrar todos los campos de incapacidad 
  mostar_datosTablaIncapacidad(){
    const datostablas = document.querySelector('.contenedo_incapacidad');
    const datosPrincipales = document.querySelector('.contenedor-incapacidad_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "none") {
         // Se muestran las tablas 
        datostablas.style.display = "block";
        if(datosPrincipales instanceof HTMLElement){
          //Se ocultan los datos previos
          datosPrincipales.style.display = "none"
        }
        this.estatusIncapacidad = true
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // Función para ocultar los campos de incapacidad
  ocultar_datosTablaIncapacidad(){
    const datostablas = document.querySelector('.contenedo_incapacidad');
    const datosPrincipales = document.querySelector('.contenedor-incapacidad_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "block") {
        // Se ocultan las tablas
        datostablas.style.display = "none";
        if(datosPrincipales instanceof HTMLElement){
          // Se muestran los datos previos 
          datosPrincipales.style.display = "block"
        }
        this.estatusIncapacidad = false
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // buton para abrir datos de las horas extras 
  buttHorasExtras(){
    //Se verifica el estatus del botón
    if(this.estatusHorasExtras == false){
      this.mostar_datosHorasExtras();
    }else{
      this.ocultar_datosAHorasExtrasa();
    }
  }

  // Función para mostrar las tablas de horas extras 
  mostar_datosHorasExtras(){
    const datostablas = document.querySelector('.contenedo_horasExtras');
    const datosPrincipales = document.querySelector('.contenedo_horas-extras_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "none") {
         // Se muestran las tablas
        datostablas.style.display = "block";
        if(datosPrincipales instanceof HTMLElement){
          //Se ocultan los datos previos
          datosPrincipales.style.display = "none"
        }
        this.estatusHorasExtras = true
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // Función para ocultar las tablas de horas extras 
  ocultar_datosAHorasExtrasa(){
    const datostablas = document.querySelector('.contenedo_horasExtras');
    const datosPrincipales = document.querySelector('.contenedo_horas-extras_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "block") {
        // Se ocultan las tablas
        datostablas.style.display = "none";
        if(datosPrincipales instanceof HTMLElement){
          // Se muestran los datos previos
          datosPrincipales.style.display = "block"
        }
        this.estatusHorasExtras = false
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  //  Botón para abrir datos de inasistencia 
  buttInasistencia(){
    //Se verifica el estatus del botón
    if(this.estatusInasistencia == false){
      this.mostar_datosInasistencia();
    }else{
      this.ocultar_datosInasistencia(); 
    }
  }

  // Función para mostrar las tablas de inasistencia 
  mostar_datosInasistencia(){
    const datostablas = document.querySelector('.contenedo_inasistencia');
    const datosPrincipales = document.querySelector('.contenedo_inasistencia_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "none") {
         // Se muestran las tablas
        datostablas.style.display = "block";
        if(datosPrincipales instanceof HTMLElement){
          // Se ocultan los datos previos
          datosPrincipales.style.display = "none"
        }
        this.estatusInasistencia = true
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // Función para ocultar las tablas de inasistencia 
  ocultar_datosInasistencia(){
    const datostablas = document.querySelector('.contenedo_inasistencia');
    const datosPrincipales = document.querySelector('.contenedo_inasistencia_datostablas');
    if(datostablas instanceof HTMLElement){
      if (datostablas.style.display === "block") {
        // Se ocultan las tablas 
        datostablas.style.display = "none";
        if(datosPrincipales instanceof HTMLElement){
          // Se muestran los datos previos 
          datosPrincipales.style.display = "block"
        }
        this.estatusInasistencia = false
      } 
    }else{
      console.log("error no se allo el div oculto ")
      return;
    }
  }

  // particles-js
  inicializarParticulas(){
    ////Menú izquierdo animación
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
  ngOnInit(): void {
    // Obtener el parámetro de la ruta
    this.router.params.subscribe((params: Params) => {
      this.idCedula = params['idCedula'];
    });

    // Se ejecuta la función para que haga la consulta al servidor de la información del empleado 
    this.detallEmpleado(this.idCedula)

    //Se ejecuta la función para hacer la consulta de la información de las tablas.  
    this.contenidoTablas(this.idCedula)

    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');

    //Verificamos si hay un valor almacenado en localStorage 
    if (nom_empresaGuardada) {
      // lo asigna a la variable nom_empresa
      this.nom_empresa = nom_empresaGuardada;
    } else {
      // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
      this.nom_empresa = 'perfil empresa x';
    }

    //Método para abrir navegación desplegable
    //definimos variables de estado
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
