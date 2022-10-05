import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { CategoriaFichero } from '../models/categoriaFichero';

@Component({
  selector: 'app-categoriaFichero',
  templateUrl: './categoriaFichero.component.html',
 styleUrls: []
})
export class CategoriaFicheroComponent implements OnInit {
  /**
   * variable que trae los datos correspondientes a la categoria de fichero del otro componente
   */
  @Input() categoriaFichero: CategoriaFichero;
  /**
   * variable que comunica al otro componente el evento para ver sus datos y editarlos
   */
  @Output() categoriaFicheroSeleccionada = new EventEmitter<CategoriaFichero>();
  /**
   * variable para icono "editar"
   */
  faEdit = faEdit;

  constructor() { }

  ngOnInit() {}
}