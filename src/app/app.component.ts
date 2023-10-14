import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { interval } from 'rxjs';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('tituloAnimation', [
      state('in', style({ transform: 'rotateY(0deg)' })),
      state('out', style({ transform: 'rotateY(360deg)' })),
      transition('in => out', animate('400ms ease-out')),
      transition('out => in', animate('400ms')),
    ]),
  ],
})
export class AppComponent {
  title = 'frontend';
 
  //titulo girando 
  animation1 = 'in';
  animation2 = 'in';
  animation3 = 'in';
  animation4 = 'in';
  animation5 = 'in';
  animation6 = 'in';
  animation7 = 'in';
  animation8 = 'in';
  animation9 = 'in';
  animation10 = 'in';
  animation11 = 'in';
  animation12 = 'in';

  ngAfterViewInit() {
   
    //se definen los tiempos de cada letra para girar 
    this.inicializarParticulas();

    interval(2000).subscribe(() => {
      this.rotateTitle(); 
    });

    interval(3000).subscribe(() => {
      this.rotateTitledos(); 
    });

    interval(4000).subscribe(() => {
      this.rotateTitletres(); 
    });

    interval(5000).subscribe(() => {
      this.rotateTitlecuatro(); 
    });

    interval(6000).subscribe(() => {
      this.rotateTitlecinco(); 
    });

    interval(7000).subscribe(() => {
      this.rotateTitleseis(); 
    });

    interval(8000).subscribe(() => {
      this.rotateTitlesiete(); 
    });

    interval(9000).subscribe(() => {
      this.rotateTitleocho(); 
    });

    interval(10000).subscribe(() => {
      this.rotateTitlenueve(); 
    });

    interval(11000).subscribe(() => {
      this.rotateTitlediez(); 
    });

    interval(12000).subscribe(() => {
      this.rotateTitleonce(); 
    });

    interval(13000).subscribe(() => {
      this.rotateTitledose(); 
    });
    
  }

  //se define la animacion
  rotateTitle() { 
    this.animation1 = 'out'; 
    setTimeout(() => {
      this.animation1 = 'in'; 
    }, 900);
  } 

  //se define la animacion
  rotateTitledos() {
    this.animation2 = 'out'; 
    setTimeout(() => {
      this.animation2 = 'in'; 
    }, 900);
  }

  //se define la animacion
  rotateTitletres() {
    this.animation3 = 'out'; 
    setTimeout(() => {
      this.animation3 = 'in'; 
    }, 900);
  }

  //se define la animacion
  rotateTitlecuatro(){
    this.animation4 = 'out'; 
    setTimeout(() => {
      this.animation4 = 'in'; 
    }, 900);
  } 

  //se define la animacion
  rotateTitlecinco() {
    this.animation5 = 'out'; 
    setTimeout(() => {
      this.animation5 = 'in'; 
    }, 900); 
  } 

  //se define la animacion
  rotateTitleseis() {
    this.animation6 = 'out'; 
    setTimeout(() => {
      this.animation6 = 'in'; 
    }, 900);
  }
 
  //se define la animacion
  rotateTitlesiete(){
    this.animation7 = 'out'; 
    setTimeout(() => {
      this.animation7 = 'in'; 
    }, 900);
  } 

  //se define la animacion
  rotateTitleocho() {
    this.animation8 = 'out'; 
    setTimeout(() => {
      this.animation8 = 'in'; 
    }, 900); 
  } 

  //se define la animacion
  rotateTitlenueve() { 
    this.animation9 = 'out'; 
    setTimeout(() => {
      this.animation9 = 'in'; 
    }, 900); 
  } 

  //se define la animacion
  rotateTitlediez() {
    this.animation10 = 'out'; 
    setTimeout(() => {
      this.animation10 = 'in'; 
    }, 900);
  }
  
  //se define la animacion
  rotateTitleonce(){
    this.animation11 = 'out'; 
    setTimeout(() => {
      this.animation11 = 'in'; 
    }, 900);
  } 

  //se define la animacion
  rotateTitledose() {
    this.animation12 = 'out'; 
    setTimeout(() => {
      this.animation12 = 'in'; 
    }, 200); 
  } 


  inicializarParticulas(){
    //titulo animacion
    particlesJS('particles', {
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


}



