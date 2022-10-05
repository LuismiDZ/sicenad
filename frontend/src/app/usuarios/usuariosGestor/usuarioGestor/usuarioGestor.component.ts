import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsuarioGestor } from '../../models/usuarioGestor';

@Component({
  selector: 'app-usuarioGestor',
  templateUrl: './usuarioGestor.component.html',
  styleUrls: []
})
export class UsuarioGestorComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuarioGestor
   */
  @Input() usuarioGestor: UsuarioGestor;
  /**
   * variable que emitira al otro componente el usuarioGestor para mostrar los datos
   */
  @Output() usuarioGestorSeleccionado = new EventEmitter<UsuarioGestor>();
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;

  constructor() {}

  ngOnInit() {}
}