import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
//import { File } from '@ionic-native/file';


// Declaración para particlesJS
declare var particlesJS: any;

@Component({
  selector: 'app-registro-empleado',
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})
export class RegistroEmpleadoComponent implements OnInit {

  //variable titulo empresa 
  nom_empresa: string = 'empresa';

  //vartiable de imagen 
  imagenSrc: string | ArrayBuffer | null = null;
  imagenSrcPredeterminada: string | null = '../../../assets/perfil_empleado.PNG';




  @ViewChild('abrirnavegacion', { static: true }) abrirnavegacion!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('columnaizquierda', { static: true }) columnaizquierda!: ElementRef;
  @ViewChild('columnaderecha', { static: true }) columnaderecha!: ElementRef;
  @ViewChild('columnacentral', { static: true }) columnacentral!: ElementRef;

  @ViewChild('imagenMostrada', { static: true }) imagenMostrada!: ElementRef;

 


  //almacenar las variables de los datos de los empleados 
  empleado_f = {
    id_cedula: '',
    tipo_documento: '',
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    pais: '',
    num_contacto: '',
    correo: '',
    direccion: '',
    hora_inicio: '',
    hora_fin: '',
    primer_dias_laboral: '',
    ultimo_dias_laboral: '',
    cargo: '',
    imagen: null as File | null,
    nom_empresa: '',
  }

  constructor(
    private authService: AuthService,
    private route: Router,
    //private file: File,
    
  ){}

  enviar_f(){
    console.log(this.empleado_f);
    this.empleado_f.nom_empresa = this.nom_empresa;
    console.log(this.empleado_f.nom_empresa);

    
    

    const formData = new FormData();

    formData.append('id_cedula', this.empleado_f.id_cedula);
    formData.append('tipo_documento', this.empleado_f.tipo_documento);
    formData.append('nombre', this.empleado_f.nombre);
    formData.append('apellidos', this.empleado_f.apellidos);
    formData.append('fecha_nacimiento', this.empleado_f.fecha_nacimiento);
    formData.append('pais', this.empleado_f.pais);
    formData.append('num_contacto', this.empleado_f.num_contacto);
    formData.append('correo', this.empleado_f.correo);
    formData.append('direccion', this.empleado_f.direccion);
    formData.append('hora_inicio', this.empleado_f.hora_inicio);
    formData.append('hora_fin', this.empleado_f.hora_fin);
    formData.append('primer_dias_laboral', this.empleado_f.primer_dias_laboral);
    formData.append('ultimo_dias_laboral', this.empleado_f.ultimo_dias_laboral);
    formData.append('cargo', this.empleado_f.cargo);
    //formData.append('imagen', this.empleado_f.imagen);
    formData.append('nom_empresa', this.empleado_f.nom_empresa);


      // Verifica si hay una imagen válida
      if (this.empleado_f.imagen) {
        formData.append('imagen', this.empleado_f.imagen, 'imagen.jpg');
      }

    console.log(this.empleado_f.imagen);

        //insercion del usuario de la empresa 
      this.authService.regis_empleado(formData).subscribe(   
      (res: any) => {
              this.route.navigate(['inicio']);
              alert('Empresa insertada exitosamente');
      }, 
      (error) => {
            console.log('Error: ', error);
      }
      );


  }

  ngAfterViewInit() {
    this.inicializarParticulas();
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

  mostrarImagen(event: any) {
    const input = event.target;
   
   // const file: File = input.files[0];

    if (input.files && input.files[0]) {

      const file: File = input.files[0];
     

      const lector = new FileReader();

    

      lector.onload = (e) => {
        this.empleado_f.imagen = file;
        this.imagenSrcPredeterminada = null;
        this.imagenSrc = e.target?.result as string;
        this.mostrarImagenMostrada();
      };

      lector.readAsDataURL(input.files[0]);
    }
  }

  //sesion de imagenes 
  mostrarImagenMostrada() {
    if (this.imagenMostrada) {
      this.imagenMostrada.nativeElement.style.display = 'block';
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
