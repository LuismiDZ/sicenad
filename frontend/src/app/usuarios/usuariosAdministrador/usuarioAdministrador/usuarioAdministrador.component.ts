import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsuarioAdministrador } from '../../models/usuarioAdministrador';
import { UsuarioAdministradorService } from '../../service/usuarioAdministrador.service';

@Component({
  selector: 'app-usuarioAdministrador',
  templateUrl: './usuarioAdministrador.component.html',
  styleUrls: []
})
export class UsuarioAdministradorComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuarioAdministrador
   */
  @Input() usuarioAdministrador: UsuarioAdministrador;
  /**
   * variable que emitira al otro componente el usuarioAdministrador para mostrar los datos
   */
  @Output() usuarioAdministradorSeleccionado = new EventEmitter<UsuarioAdministrador>();
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;

  /**
   * 
   * @param usuarioAdministradorService Para usar los metodos propios de Administrador
   */
  constructor(private usuarioAdministradorService: UsuarioAdministradorService) {}

  /**
   * Recupera el Cenad de ese administrador
   */
  ngOnInit() {
    this.usuarioAdministradorService.getCenad(this.usuarioAdministrador).subscribe((response) =>
      this.usuarioAdministrador.cenad = this.usuarioAdministradorService.mapearCenad(response));
  }
}