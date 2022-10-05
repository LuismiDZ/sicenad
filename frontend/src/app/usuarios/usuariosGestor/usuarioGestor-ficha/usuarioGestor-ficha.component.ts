import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cenad } from 'src/app/superadministrador/models/cenad';
import { UsuarioGestorImpl } from '../../models/usuarioGestor-impl';
import { UsuarioGestorService } from '../../service/usuarioGestor.service';

@Component({
  selector: 'app-usuarioGestor-ficha',
  templateUrl: './usuarioGestor-ficha.component.html',
  styleUrls: []
})
export class UsuarioGestorFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuarioGestor
   */
  @Input() usuarioGestor: UsuarioGestorImpl;
  /**
   * variable que emitira al otro componente el evento para eliminarlo
   */
  @Output() usuarioGestorEliminar = new EventEmitter<UsuarioGestorImpl>();
  /**
   * variable que emitira al otro componente el evento para editarlo
   */
  @Output() usuarioGestorEditar = new EventEmitter<UsuarioGestorImpl>();
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
   * @param usuarioGestorService Para usar los metodos propios de UsuarioGestor
   */
  constructor(
    private usuarioGestorService: UsuarioGestorService) { }

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
    this.usuarioGestorEliminar.emit(this.usuarioGestor);
  }

  /**
   * metodo para emitir el usuario a editar
   */
  editar(): void {
    this.usuarioGestor.cenad = this.cenadSeleccionado;
    this.usuarioGestorEditar.emit(this.usuarioGestor);
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.cenadSeleccionado = this.usuarioGestor.cenad.url;
  }
}