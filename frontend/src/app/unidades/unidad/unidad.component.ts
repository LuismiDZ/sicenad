import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Unidad } from '../models/unidad';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: []
})
export class UnidadComponent implements OnInit {
  /**
   * variable que trae del otro componente la unidad
   */
  @Input() unidad: Unidad;
  /**
   * variable que emite al otro componente un evento con la unidad seleccionada
   */
  @Output() unidadSeleccionada = new EventEmitter<Unidad>();
  /**
   * variable para el icono "editar"
   */
  faEdit = faEdit;

  constructor() {}

  ngOnInit() {}
}
