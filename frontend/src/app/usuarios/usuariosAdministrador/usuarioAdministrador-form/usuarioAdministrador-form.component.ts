import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Cenad } from 'src/app/superadministrador/models/cenad';
import { UsuarioAdministradorImpl } from '../../models/usuarioAdministrador-impl';
import { UsuarioAdministradorService } from '../../service/usuarioAdministrador.service';

@Component({
  selector: 'app-usuarioAdministrador-form',
  templateUrl: './usuarioAdministrador-form.component.html',
  styleUrls: []
})
export class UsuarioAdministradorFormComponent implements OnInit {
  /**
   * variable en la que se grabara el nuevo usuarioAdministrador
   */
  usuarioAdministrador: UsuarioAdministradorImpl = new UsuarioAdministradorImpl();
  /**
   * variable para cargar todos los cenads
   */
  cenads: Cenad[] = [];
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   * 
   * @param usuarioAdministradorService Para usar los metodos propios de UsuarioAdministrador
   * @param router Para redirigir
   */
  constructor(
    private usuarioAdministradorService: UsuarioAdministradorService,
    private router: Router) { }

  /**
   * rescata de la BD los cenads sin administrador
   */
  ngOnInit(): void {
    this.usuarioAdministradorService.getCenadsSinAdmin().subscribe((response) => this.cenads = this.usuarioAdministradorService.extraerCenads(response));
  }

  /**
   * metodo para crear un usuarioAdministrador
   * - actualiza el localStorage
   */
  crearUsuarioAdministrador(): void {
    this.usuarioAdministradorService.create(this.usuarioAdministrador).subscribe((response) => {
      console.log(`He creado el Usuario Administrador ${this.usuarioAdministrador.nombre}`);
      this.usuarioAdministradorService.getUsuarios().subscribe((response) => {
        localStorage.usuariosAdministrador = JSON.stringify(this.usuarioAdministradorService.extraerUsuarios(response));
        this.router.navigate(['/usuarios']);
      });
    });
  }
}