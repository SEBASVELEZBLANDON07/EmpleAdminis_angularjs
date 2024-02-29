# EmpleAdminis  <img src="https://img.icons8.com/color/20/000000/angularjs.png" width="30" height="30"/> 

EmpleAdminis es una plataforma de administración de empleados desarrollada en Angular, que se comunica con un microservicio de Node.js. Este proyecto permite a las empresas gestionar el registro de empleados, sus cuentas bancarias, asistencias, horas extras, incapacidades, inventario general y más.

## Características principales

- **Inicio de sesión**: Módulo de inicio de sesión para acceder a la plataforma.
- **Registro de empresas**: Permite registrar las empresas que desean utilizar la plataforma.
- **Navegación principal**: Módulo inicial con la navegación a todos los demás módulos.
- **Registro de empleados**: Permite el ingreso de nuevos empleados a la plataforma.
- **Registro de cuentas bancarias**: Registra las cuentas bancarias de los empleados para el pago de sueldos.
- **Registro de asistencia**: Toma la asistencia diaria de los empleados.
- **Registro de horas extras**: Permite registrar las horas extras realizadas por los empleados.
- **Registro de incapacidades**: Registra las incapacidades de los empleados.
- **Inventario general**: Muestra los empleados registrados en la plataforma.
- **Detalle del empleado**: Permite ver la información detallada de cada empleado, incluyendo asistencias, horas extras, incapacidades, etc.
- **Eliminar empleado**: Permite eliminar empleados que ya no forman parte de la empresa y ver un historial de empleados eliminados.

## Experiencia de usuario y animaciones

Hemos implementado animaciones en toda la plataforma para mejorar la experiencia visual del usuario. Desde transiciones suaves hasta efectos de carga interactivos, hemos cuidado cada detalle para hacer que EmpleAdminis sea elegante y fácil de usar.

## Dependencias del proyecto

- `@angular/animations`: Animaciones para aplicaciones Angular. <img src="https://img.icons8.com/color/20/000000/angularjs.png" width="20" height="20"/>  version 16.2.3.
- `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `@angular/router`: Dependencias principales de Angular.
- `@auth0/angular-jwt`: Herramientas para trabajar con JSON Web Tokens (JWT) en Angular.
- `@fortawesome/angular-fontawesome`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`: Iconos FontAwesome para Angular.
- `@ionic-native/core`, `@ionic-native/file`: Capacidades nativas de Ionic para Angular.
- `animejs`: Librería para animaciones en JavaScript.
- `jwt-decode`: Decodificador de JSON Web Tokens en JavaScript.
- `rxjs`: Librería reactiva para JavaScript.
- `sweetalert2`: Librería para crear modales y alertas personalizadas.
- `tslib`, `zone.js`: Librerías para soporte de TypeScript y gestión de zonas en Angular.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Ejecuta el servidor de desarrollo con `ng serve`.
4. Abre tu navegador y accede a `http://localhost:4200/`.

## Uso

1. Inicia sesión con tus credenciales.
2. Explora los diferentes módulos para gestionar los empleados y sus registros.
 
