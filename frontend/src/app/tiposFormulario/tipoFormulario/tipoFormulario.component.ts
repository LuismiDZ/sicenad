import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { TipoFormulario } from '../models/tipoFormulario';

@Component({
  selector: 'app-tipoFormulario',
  templateUrl: './tipoFormulario.component.html',
  styleUrls: []
})
export class TipoFormularioComponent implements OnInit {
  /**
   * variable que trae del otro componente el tipo de formulario
   */
  @Input() tipoFormulario: TipoFormulario;
  /**
   * variable que emite al otro componente un evento con el tipo de formulario seleccionado
   */
  @Output() tipoFormularioSeleccionado = new EventEmitter<TipoFormulario>();
  /**
   * variable para el icono "editar"
   */
  faEdit = faEdit;

  constructor() {}

  ngOnInit() {}
}
