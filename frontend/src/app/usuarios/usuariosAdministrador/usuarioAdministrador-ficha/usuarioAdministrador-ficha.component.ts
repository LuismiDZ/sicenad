import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cenad } from 'src/app/superadministrador/models/cenad';
import { UsuarioAdministradorImpl } from '../../models/usuarioAdministrador-impl';
import { UsuarioAdministradorService } from '../../service/usuarioAdministrador.service';

@Component({
  selector: 'app-usuarioAdministrador-ficha',
  templateUrl: './usuarioAdministrador-ficha.component.html',
  styleUrls: []
})
export class UsuarioAdministradorFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuarioAdministrador
   */
  @Input() usuarioAdministrador: UsuarioAdministradorImpl;
  /**
   * variable que emitira al otro componente el evento para eliminarlo
   */
  @Output() usuarioAdministradorEliminar = new EventEmitter<UsuarioAdministradorImpl>();
  /**
   * variable que emitira al otro componente el evento para editarlo
   */
  @Output() usuarioAdministradorEditar = new EventEmitter<UsuarioAdministradorImpl>();
  /**
   * variable para cargar todas los cenads
   */
  cenads: Cenad[] = [];
  /**
   * variables para poder mostrar el valor inicial del cenad en el campo select
   */
  cenadSeleccionado: string;

  /**
   * 
   * @param usuarioAdministradorService Para usar los metodos propios de UsuarioAdministrador
   */
  constructor(
    private usuarioAdministradorService: UsuarioAdministradorService) { }

  /**
   * - rescata del local storage los cenads
   * - asigna los valores seleccionados a los select de los campos del usuario
   */
  ngOnInit(): void {
    this.cenads = JSON.parse(localStorage.cenads);
    this.actualizarNgModels();
  }

  /**
   * metodo para emitir el usuario a eliminar
   */
  eliminar(): void {
    this.usuarioAdministradorEliminar.emit(this.usuarioAdministrador);
  }

  /**
   * metodo para emitir el usuario a editar
   */
  editar(): void {
    this.usuarioAdministrador.cenad = this.cenadSeleccionado;
    this.usuarioAdministradorEditar.emit(this.usuarioAdministrador);
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.cenadSeleccionado = this.usuarioAdministrador.cenad.url;
  }
}