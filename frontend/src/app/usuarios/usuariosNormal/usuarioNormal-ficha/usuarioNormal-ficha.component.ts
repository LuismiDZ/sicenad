import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Unidad } from 'src/app/unidades/models/unidad';
import { UsuarioNormalImpl } from '../../models/usuarioNormal-impl';
import { UsuarioNormalService } from '../../service/usuarioNormal.service';

@Component({
  selector: 'app-usuarioNormal-ficha',
  templateUrl: './usuarioNormal-ficha.component.html',
  styleUrls: []
})
export class UsuarioNormalFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuario normal
   */
  @Input() usuarioNormal: UsuarioNormalImpl;
  /**
   * variable que emitira al otro componente el evento para eliminarlo
   */
  @Output() usuarioNormalEliminar = new EventEmitter<UsuarioNormalImpl>();
  /**
   * variable que emitira al otro componente el evento para editarlo
   */
  @Output() usuarioNormalEditar = new EventEmitter<UsuarioNormalImpl>();
  /**
   * variable para cargar todas las unidades
   */
  unidades: Unidad[] = [];
  /**
   * variables para poder mostrar el valor inicial de la unidad en el campo select
   */
  unidadSeleccionada: string;

  /**
   * 
   * @param usuarioNormalService Para usar los metodos de UsuarioNormal
   */
  constructor(
    private usuarioNormalService: UsuarioNormalService) { }

  /**
   * - rescata del local storage las unidades
   * - asigna los valores seleccionados a los select de los campos del recurso
   */
  ngOnInit(): void {
    this.unidades = JSON.parse(localStorage.unidades);
    this.actualizarNgModels();
  }

  /**
   * metodo para emitir el usuario a eliminar
   */
  eliminar(): void {
    this.usuarioNormalEliminar.emit(this.usuarioNormal);
  }

  /**
   * metodo para emitir el usuario a editar
   */
  editar(): void {
    this.usuarioNormal.unidad = this.unidadSeleccionada;
    this.usuarioNormalEditar.emit(this.usuarioNormal);
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.unidadSeleccionada = this.usuarioNormal.unidad.url;
  }
}