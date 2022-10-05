import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoFormularioImpl } from '../../models/tipoFormulario-impl';

@Component({
  selector: 'app-tipoFormulario-ficha',
  templateUrl: './tipoFormulario-ficha.component.html',
  styleUrls: []
})
export class TipoFormularioFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el tipo de formulario seleccionado
   */
  @Input() tipoFormulario: TipoFormularioImpl;
  /**
   * variable que emite al otro componente el evento para eliminar el tipo de formulario
   */
  @Output() tipoFormularioEliminar = new EventEmitter<TipoFormularioImpl>();
  /**
   * variable que emite al otro componente el evento para editar el tipo de formulario
   */
  @Output() tipoFormularioEditar = new EventEmitter<TipoFormularioImpl>();

  constructor() {}

  ngOnInit(): void {}

  /**
   * metodo que emite el evento para eliminar el tipo de formulario
   */
  eliminar(): void {
    this.tipoFormularioEliminar.emit(this.tipoFormulario);
  }

  /**
   * metodo que emite el evento para editar el tipo de formulario
   */
  editar(): void {
    this.tipoFormularioEditar.emit(this.tipoFormulario);
  }
}
