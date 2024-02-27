import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
//import { FormsModule } from '@angular/forms';

// Manejo de mensajes personalizados.
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-cuenta-empleado',
  templateUrl: './cuenta-empleado.component.html',
  styleUrls: ['./cuenta-empleado.component.css']
})
export class CuentaEmpleadoComponent implements OnInit {

  //  Estado de cargando los datos al servidor..
  loading: boolean = false;

  // Variable título, empresa y nombre empleado. 
  nom_empresa: string = 'Empresa'; 
  nom_empleado: string = 'Empleado';

  // Variable ID del empleado del que seta registrando. 
  id_cedula: string = '';

  // Variables predeterminadas de la tarjeta. 
  num_cuenta: string = '**** **** **** ****';
  nombreEntidad: string = 'NOMBRE DE LA ENTIDAD';
  tipoCuenta: string = 'Tipo de cuenta';
  salario: string= '0';

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

  // Restablecer los campos de la cuenta.  
  cuenta_b ={
    num_cuenta_bancaria: '',
    nom_banco: '',
    tipo_cuenta: '',
    salario: '',
    id_cedula_c: '',
  }

  //Función para registrar la cuenta bancaria del empleado. 
  guardar_c(){
    //Verificamos si los campos requeridos están completos.
    const formulario = document.querySelector('.formul_cuenta_b');
    if(formulario){
      const composReqqueridos = formulario.querySelectorAll('[required]');
      const camposcompletos = Array.from(composReqqueridos).every((campo) => (campo as HTMLInputElement).value);
      //Se muestra un error en pantalla si faltan los campos requeridos.  
      if(!camposcompletos){
        Swal.fire({
          title: 'por favor completa los campos requeridos',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }else{
      Swal.fire({
        title: 'Error: No se encontro el formulario',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    //Se cambia el loadinf de false a true para que comiese a cargar mientras se procesan los datos. 
    this.loading = true;

    //Se almacena el ID del empleado en el campo de id_cuenta_c 
    this.cuenta_b.id_cedula_c = this.id_cedula;

    // Enviamos los datos del formulario de cuenta bancaria al servidor.
    this.authService.guardar_c(this.cuenta_b).subscribe(
      (res: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Cuenta bancaria ingresada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.route.navigate(['inicio']);
      },
      (error) => {
        console.log('error', error);
        this.loading = false;
        Swal.fire({
          title: 'Cuenta bancaria ya ingresada, verifique los campos e intente de nuevo ',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );  
  }

  // Se presiona el butt para abrir menú desplegable.
  buttabrirnavegacion(){
    this.inicializarParticulas();
  }

  // Visualización en la tarjeta, nombre del banco.
  updatInputNom_banco(event: any) {
    const userInput = event.target.value.toUpperCase();;
    event.target.value = userInput;
    this.nombreEntidad = userInput
  }

  // Visualización en la tarjeta tipo de cuenta.  
  updatiInputTipo_cuenta(event: any) {
    const userInput = event.target.value;
    event.target.value = userInput;
    this.tipoCuenta = userInput
  }
 
  // Visualización en la tarjeta salario.
  updatInputSalario(event: any) {
    const userInput = event.target.value;
    const maximoNume = userInput.substring(0, 9);
    const remplazar = maximoNume.replace(/[,.]/g, '');
    const numvalor = parseFloat(remplazar);

    //Se verifica si el número ingresado es válido. 
    if(!isNaN(numvalor)){
      //Se utiliza el separador del peso colombiano. 
      const numero_modificado = numvalor.toLocaleString('es-CO', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
      });

      const num_separado = numero_modificado.replace(/,/g, ' ');

      event.target.value = maximoNume;
      // Se muestra el valor en la tarjeta.
      this.salario = num_separado;
    }else{
      console.log('numero no valifdo')
    }
  }

  // Visualización en la tarjeta número de cuenta. 
  updatenum_cuenta(event: any) {
    const userInput = event.target.value;
    const numericValue = userInput.replace(/\D/g, '');
    const formattedValue = numericValue.substring(0, 30);
    //Se agrega un espacio después de cada 4 caracteres.
    this.num_cuenta = formattedValue.replace(/(.{4})/g, '$1 ').trim(); 
    event.target.value = formattedValue;
  }

  // Ejecuciones automáticas, se ejecutan una vez que se inicie el componente
  ngOnInit() {
    // Recupera el valor almacenado en localStorage
    const nom_empresaGuardada = localStorage.getItem('nom_empresa');
    const id_cedulaGuardada = localStorage.getItem('id_cedula');
    const nom_empleadoGuardado = localStorage.getItem('nombre')
    
    //Verificamos si el valor nombre de la empresa está almacenado en localStorage 
    if (nom_empresaGuardada) {
      // Lo asigna a la variable nom_empresa
      this.nom_empresa = nom_empresaGuardada;
    } else {
      // Si no hay un valor almacenado, se designa un valor predeterminado 
      this.nom_empresa = 'perfil empresa x';
    }

    //Verificamos si el valor nombre del empleado está almacenado en localStorage 
    if (nom_empleadoGuardado) {
      // Lo asigna a la variable nom_empleado
      this.nom_empleado = nom_empleadoGuardado;
    } else {
      // Si no hay un valor almacenado, se designa un valor predeterminado 
      this.nom_empleado = '';
    }

    //Verificamos si el valor de la célula del empleado está almacenado en localStorage 
    if (id_cedulaGuardada) {
      // lo asigna a la variable id_cedula
      this.id_cedula = id_cedulaGuardada;
    } else {
      // Si no hay un valor almacenado, se designa un valor predeterminado 
      this.id_cedula = '';
    }

    // Método para abrir navegación desplegable.
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

    // Se selecciona alguna opción del menú desplegable. 
    this.menu.nativeElement.addEventListener('click', (elemento: MouseEvent) => {
      estado = false;
      if(elemento.target instanceof HTMLElement) {
        const opcionseleccionada = elemento.target.closest('.menu-contenido a');
        if (elemento.target.closest('.menu-contenido a')) { 
          console.log(opcionseleccionada); 
        }
      }
    });

    // Dependiendo de qué se presiona, se define el evento de cierre o desplegar el menú. 
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
