import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnidadImpl } from '../../models/unidad-impl';

@Component({
  selector: 'app-unidad-ficha',
  templateUrl: './unidad-ficha.component.html',
  styleUrls: []
})
export class UnidadFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente la unidad
   */
  @Input() unidad: UnidadImpl;
  /**
   * variable que emite al otro componente los eventos para eliminar la unidad
   */
  @Output() unidadEliminar = new EventEmitter<UnidadImpl>();
  /**
   * variable que emite al otro componente los eventos para editar la unidad
   */
  @Output() unidadEditar = new EventEmitter<UnidadImpl>();

  constructor() {}

  ngOnInit(): void {}

  /**
   * metodo que emite el evento para eliminar la unidad
   */
  eliminar(): void {
    this.unidadEliminar.emit(this.unidad);
  }

  /**
   * metodo que emite el evento para editar la unidad
   */
  editar(): void {
    this.unidadEditar.emit(this.unidad);
  }
}
