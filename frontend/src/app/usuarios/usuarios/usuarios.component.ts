import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft, faHandMiddleFinger } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from 'src/app/core/shell/header/header.component';
import { UsuarioAdministrador } from '../models/usuarioAdministrador';
import { UsuarioAdministradorImpl } from '../models/usuarioAdministrador-impl';
import { UsuarioGestor } from '../models/usuarioGestor';
import { UsuarioGestorImpl } from '../models/usuarioGestor-impl';
import { UsuarioNormal } from '../models/usuarioNormal';
import { UsuarioNormalImpl } from '../models/usuarioNormal-impl';
import { UsuarioAdministradorService } from '../service/usuarioAdministrador.service';
import { UsuarioGestorService } from '../service/usuarioGestor.service';
import { UsuarioNormalService } from '../service/usuarioNormal.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;
  /**
   * variable que dice si es tu cenad o no
   */
  isMiCenad: boolean = false;
  /**
   * variable boolean que dice si es administrador (ve gestores de su cenad) o no (ve administradores)
   */
  isAdministrador: boolean = false;
  /**
   * variable para capturar el idCenad en el caso de que el que acceda sea el administrador de un cenad
   */
  idCenad: string = "";
  /**
   * variable que recogera el string para el routerLink de volver atras en funcion de donde viene
   */
  volver: string = '';
  /**
   * variable que recogera el string para el routerLink de nuevo usuario normal en funcion de donde viene
   */
  nuevoUsuarioNormal: string = '';
  /**
   * variable que guarda todos los usuariosAdministradores
   */
  usuariosAdministrador: UsuarioAdministrador[] = [];
  /**
   * variable que guarda todos los usuariosGestores
   */
  usuariosGestor: UsuarioGestor[] = [];
  /**
   * variable que guarda todos los usuariosNormales
   */
  usuariosNormal: UsuarioNormal[] = [];
  /**
   * variable que comunicara los datos del usuarioAdministrador
   */
  usuarioAdministradorVerDatos: UsuarioAdministrador;
  /**
   * variable que comunicara los datos del usuarioGestor
   */
  usuarioGestorVerDatos: UsuarioGestor;
  /**
   * variable que comunicara los datos del usuario normal
   */
  usuarioNormalVerDatos: UsuarioNormal;
  /**
   * variable que comunicara los datos del usuario administrador
   */

  /**
   * 
   * @param usuarioAdministradorService Para usar los metodos propios de UsuarioAdministrador
   * @param usuarioNormalService Para usar los metodos propios de UsuarioNormal
   * @param usuarioGestorService Para usar los metodos propios de UsuarioGestor
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private usuarioAdministradorService: UsuarioAdministradorService,
    private usuarioNormalService: UsuarioNormalService,
    private usuarioGestorService: UsuarioGestorService,
    private router: Router, private activateRoute: ActivatedRoute) { }

  /**
   * - captura el id del cenad de la barra de navegacion
   * - compruebo si el usuario loggeado pertenece a este cenad
   * - compruebo si el usuario loggeado es administrador
   * - comprueba que sea administrador de ese cenad
   * - recupera todos los usuarios normal del loccal storage
   * - recupera del local storage los usuarios gestores del cenad
   * - la variable volver nos llevara a "superadministrador"o a "ppalCenad"
   * - aqui debo sacar el idCenad del administrador que esta logueado
   * - recupera todos los administradores de la BD
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.isMiCenad = (this.idCenad === sessionStorage.idCenad);
    this.isAdministrador = (sessionStorage.isAdmin === 'true');
    this.usuariosNormal = JSON.parse(localStorage.usuariosNormal);
    if (this.isAdministrador && this.isMiCenad) {
      this.usuariosGestor = JSON.parse(localStorage.getItem(`usuariosGestor_${this.idCenad}`));
    }
    if (this.isAdministrador) {
      this.volver = `/principalCenad/${this.idCenad}`;
      this.nuevoUsuarioNormal = `/principalCenad/${this.idCenad}/usuarios/${this.idCenad}/formulario-usuarioNormal/${this.idCenad}`;
    } else {
      this.usuariosAdministrador = JSON.parse(localStorage.usuariosAdministrador);
      this.volver = `/superadministrador`;
      this.nuevoUsuarioNormal = `/usuarios/formulario-usuarioNormal`;
    }
  }

  /**
   * metodo para traspasar los datos del usuario administrador
   * @param usuarioAdministrador UsuarioAdministrador del modal
   */
  verDatosUsuarioAdministrador(usuarioAdministrador: UsuarioAdministrador): void {
    this.usuarioAdministradorVerDatos = usuarioAdministrador;
  }

  /**
   * metodo para eliminar un usuario administrador
   * @param usuarioAdministrador usuario a eliminar
   * - actualiza el localStorage
   */
  onUsuarioAdministradorEliminar(usuarioAdministrador: UsuarioAdministradorImpl): void {
    this.usuarioAdministradorService.delete(usuarioAdministrador).subscribe(response => {
      this.usuarioAdministradorService.getUsuarios().subscribe((response) => {
        localStorage.usuariosAdministrador = JSON.stringify(this.usuarioAdministradorService.extraerUsuarios(response));
        console.log(`He borrado el Administrador ${usuarioAdministrador.nombre}`);
        this.router.navigate(['/usuarios']);
      });
    });
  }

  /**
   * metodo para editar un usuario administrador
   * @param usuarioAdministrador usuario a editar
   * - actualiza el localStorage
   */  
  onUsuarioAdministradorEditar(usuarioAdministrador: UsuarioAdministradorImpl): void {
    this.usuarioAdministradorService.update(usuarioAdministrador).subscribe(response => {
      this.usuarioAdministradorService.getUsuarios().subscribe((response) => {
        localStorage.usuariosAdministrador = JSON.stringify(this.usuarioAdministradorService.extraerUsuarios(response));
        console.log(`He actualizado el Administrador ${usuarioAdministrador.nombre}`);
        this.router.navigate(['/usuarios']);
      });
    });
  }

  /**
   * metodo para traspasar los datos del usuario gestor
   * @param usuarioGestor usuarioGestor del modal
   */  
  verDatosUsuarioGestor(usuarioGestor: UsuarioGestor): void {
    this.usuarioGestorVerDatos = usuarioGestor;
  }

  /**
   * metodo para eliminar un usuario gestor
   * @param usuarioGestor usuario a eliminar
   * - actualiza el localStorage
   */  
  onUsuarioGestorEliminar(usuarioGestor: UsuarioGestorImpl): void {
    this.usuarioGestorService.delete(usuarioGestor).subscribe(response => {
      this.usuarioGestorService.getUsuarios().subscribe((response) => localStorage.usuariosGestor = JSON.stringify(this.usuarioGestorService.extraerUsuarios(response)));
      this.usuarioGestorService.getUsuariosGestoresDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`usuariosGestor_${this.idCenad}`, JSON.stringify(this.usuarioGestorService.extraerUsuarios(response)));
        console.log(`He borrado el gestor ${usuarioGestor.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}/usuarios/${this.idCenad}`]);
      });
    });
  }

  /**
   * metodo para editar un usuario gestor
   * @param usuarioGestor usuario a editar
   * - actualiza el localStorage
   */    
  onUsuarioGestorEditar(usuarioGestor: UsuarioGestorImpl): void {
    this.usuarioGestorService.update(usuarioGestor).subscribe(response => {
      this.usuarioGestorService.getUsuarios().subscribe((response) => localStorage.usuariosGestor = JSON.stringify(this.usuarioGestorService.extraerUsuarios(response)));
      this.usuarioGestorService.getUsuariosGestoresDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`usuariosGestor_${this.idCenad}`, JSON.stringify(this.usuarioGestorService.extraerUsuarios(response)));
        console.log(`He actualizado el gestor ${usuarioGestor.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}/usuarios/${this.idCenad}`]);
      });
    });
  }

  /**
   * metodo para traspasar los datos del usuario normal
   * @param usuarioAdministrador Usuario del modal
   */  
  verDatosUsuarioNormal(usuarioNormal: UsuarioNormal): void {
    this.usuarioNormalVerDatos = usuarioNormal;
  }

  /**
   * metodo para eliminar un usuario normal
   * @param usuarioNormal usuario a eliminar
   * - actualiza el localStorage
   */  
  onUsuarioNormalEliminar(usuarioNormal: UsuarioNormalImpl): void {
    let ruta: string = (this.idCenad !== undefined) ? `principalCenad/${this.idCenad}/usuarios/${this.idCenad}` : 'usuarios'
    this.usuarioNormalService.delete(usuarioNormal).subscribe(response => {
      this.usuarioNormalService.getUsuarios().subscribe((response) => {
        localStorage.usuariosNormal = JSON.stringify(this.usuarioNormalService.extraerUsuarios(response));
        console.log(`He borrado el usuario ${usuarioNormal.nombre}`);
        this.closebutton.nativeElement.click();
        //this.router.navigate([ruta]);
        this.ngOnInit(); 
      });
    });
  }

  /**
   * metodo para editar un usuario normal
   * @param usuarioNormal usuario a editar
   * - actualiza el localStorage
   */ 
  
  onUsuarioNormalEditar(usuarioNormal: UsuarioNormalImpl): void {
    let ruta: string = (this.idCenad !== undefined) ? `principalCenad/${this.idCenad}/usuarios/${this.idCenad}` : 'usuarios'
    this.usuarioNormalService.update(usuarioNormal).subscribe(response => {
      this.usuarioNormalService.getUsuarios().subscribe((response) => {
        localStorage.usuariosNormal = JSON.stringify(this.usuarioNormalService.extraerUsuarios(response));
        console.log(`He actualizado el usuario ${usuarioNormal.nombre}`);
        
        
        //this.router.navigate([ruta]);
        document.getElementById('ficha-normal').removeAttribute('disabled');
        this.closebutton.nativeElement.click();
        document.getElementById('ficha-normal').setAttribute('disabled', 'disabled');
        this.ngOnInit();             
      });      
    });    
    
  }
}