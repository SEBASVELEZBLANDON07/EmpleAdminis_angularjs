import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

//manejo de mensajes personalizados 
import Swal from 'sweetalert2';

// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-cuenta-empleado',
  templateUrl: './cuenta-empleado.component.html',
  styleUrls: ['./cuenta-empleado.component.css']
})
export class CuentaEmpleadoComponent implements OnInit {

//estado de cargando los datos al servidor 
loading: boolean = false;

//variable titulo empresa 
nom_empresa: string = 'Empresa'; 

nom_empleado: string = 'Empleado';

//variable id del empleado del registrando
id_cedula: string = '';

//variables predeterminadas de la targeta 
num_cuenta: string = '**** **** **** ****';
nombreEntidad: string = 'NOMBRE DE LA ENTIDAD';
tipoCuenta: string = 'Tipo de cuenta';
salario: string= '0';

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

cuenta_b ={
  num_cuenta_bancaria: '',
  nom_banco: '',
  tipo_cuenta: '',
  salario: '',
  id_cedula_c: '',
}

guardar_c(){
  console.log("se presiona")
  //verificamos si los campos requeridos estan completos
  const formulario = document.querySelector('.formul_cuenta_b');
  if(formulario){
    const composReqqueridos = formulario.querySelectorAll('[required]');
    const camposcompletos = Array.from(composReqqueridos).every((campo) => (campo as HTMLInputElement).value);
    //se mustra un error en pantalla si faltan los campos requeridos 
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
  

  //se cambia el loadinf de false a true para que comiense a cargar mientras se procesan los datos 
  this.loading = true;

  //se almacena el id del empleado en el campo de id_cuenta_c
  this.cuenta_b.id_cedula_c = this.id_cedula;

  console.log(this.cuenta_b);

  //enviamos los datos del formulario de cuenta bancaria al servidor
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
        title: 'No se pudo ingresar la cuenta',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  );
  
}

//se presiona el butt de abrir menu desplegable 
buttabrirnavegacion(){
  this.inicializarParticulas();
}

//visualizacion en la targeta nombre de banco
updatInputNom_banco(event: any) {
  const userInput = event.target.value.toUpperCase();;
  event.target.value = userInput;
  this.nombreEntidad = userInput
}

//visualizacion en la targeta tipo de cuenta 
updatiInputTipo_cuenta(event: any) {
  const userInput = event.target.value;
  event.target.value = userInput;
  this.tipoCuenta = userInput
}
 
//visualizacion en la targeta salario
updatInputSalario(event: any) {
  const userInput = event.target.value;
  const maximoNume = userInput.substring(0, 9);
  const remplazar = maximoNume.replace(/[,.]/g, '');
  const numvalor = parseFloat(remplazar);

  //se verifica si el numero ingresado es valido 
  if(!isNaN(numvalor)){
    //se utiliza el separador de peso colombiano
    const numero_modificado = numvalor.toLocaleString('es-CO', {
     //style: 'currency',
     //currency: 'COP',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0,
    });

    const num_separado = numero_modificado.replace(/,/g, ' ');

    event.target.value = maximoNume;
    //se muestra el valor en la targeta
    this.salario = num_separado;

  }else{
    console.log('numero no valifdo')

  }
  /*
  event.target.value = userInput;
  this.salario = userInput.replace(/(.{3})/g, '$1 ').trim();
  */
 
}

//visualizacion en la targeta numero de cuenta
updatenum_cuenta(event: any) {
  const userInput = event.target.value;
  const numericValue = userInput.replace(/\D/g, '');
  const formattedValue = numericValue.substring(0, 30);
  //se agrega un espacio después de cada 4 caracteres
  this.num_cuenta = formattedValue.replace(/(.{4})/g, '$1 ').trim(); 
  event.target.value = formattedValue;
}


ngOnInit() {
  // Recupera el valor almacenado en localStorage
  const nom_empresaGuardada = localStorage.getItem('nom_empresa');
  const id_cedulaGuardada = localStorage.getItem('id_cedula');
  const nom_empleadoGuardado = localStorage.getItem('nombre')
  


  //verificamos si hay un valor almacenado en localStorage, 
  if (nom_empresaGuardada) {
    // lo asigna a la variable nom_empresa
    this.nom_empresa = nom_empresaGuardada;
  } else {
    // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
    this.nom_empresa = 'perfil empresa x';
  }

   //verificamos si hay un valor almacenado en localStorage, 
   if (nom_empleadoGuardado) {
    // lo asigna a la variable nom_empresa
    this.nom_empleado = nom_empleadoGuardado;
  } else {
    // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
    this.nom_empleado = '';
  }

  //verificamos si hay un valor almacenado en localStorage, 
  if (id_cedulaGuardada) {
    // lo asigna a la variable nom_empresa
    this.id_cedula = id_cedulaGuardada;
  } else {
    // Si no hay un valor almacenado, puedes proporcionar un valor predeterminado
    this.id_cedula = '';
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
