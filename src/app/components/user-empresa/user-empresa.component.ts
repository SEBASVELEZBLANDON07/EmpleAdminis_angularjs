

import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Route, Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-user-empresa',
  templateUrl: './user-empresa.component.html',
  styleUrls: ['./user-empresa.component.css']
})
export class UserEmpresaComponent /*implements OnInit*/{

  //pasar variables del componente anterior
  /*
  nom_empresa: string= '';

  user_fP = {
    correo: '',
    password: '',
    nom_empresa: '',
  } 

*/

user_fP = {
  correo: '',
  password: '',
}


  @ViewChild('password', { static: true }) password!: ElementRef;
  @ViewChild('logoojo', { static: true }) logoojo!: ElementRef;


  ngAfterViewInit() {
    let passwordVisible = false;

    this.logoojo.nativeElement.addEventListener('click', () => {
      passwordVisible = !passwordVisible;
      const type = passwordVisible ? 'text' : 'password';
      this.password.nativeElement.setAttribute('type', type);

      const iconElement = this.logoojo.nativeElement;
      iconElement.innerHTML = passwordVisible ? '👁️' : '<i class="fa-solid fa-eye-slash"></i>';
      iconElement.style.color = '#fff';
    });
     
  }

  constructor(
    private authService: AuthService,
    private route: Router,
   // private router: ActivatedRoute,//pasar variables del componente anterior
    //library: FaIconLibrary,
  ){ //library.addIcons(faSquare, faCheckSquare, faCoffee);
    //this.nom_empresa = '';
  }
  //pasar variables del componente anterior
/*
  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.nom_empresa = params.get('nom_empresa') ?? '';
    });

    console.log(this.nom_empresa, "si da");
  }

*/





  

 
  crearfP(){

//    this.user_fP.nom_empresa = this.nom_empresa;//pasar variables del componente anterior

    console.log(this.user_fP);
   
    this.authService.crearf(this.user_fP).subscribe( 
    (res:any) =>{
      console.log(res)
      //localStorage.setItem('token', res.token);
      this.route.navigate(['inicio']);
     alert('insercion correcta')
    }, 
    error =>{
    console.log('error: ', error); 
    }
    )
  }


}
