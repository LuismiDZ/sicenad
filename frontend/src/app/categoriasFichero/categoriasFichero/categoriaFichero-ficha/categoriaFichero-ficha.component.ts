import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaFicheroImpl } from '../../models/categoriaFichero-impl';

@Component({
  selector: 'app-categoriaFichero-ficha',
  templateUrl: './categoriaFichero-ficha.component.html',
  styleUrls: []
})
export class CategoriaFicheroFichaComponent implements OnInit {
  /**
   * variable que me comunica del otro componente la categoria de fichero a ver/editar
   */
  @Input() categoriaFichero: CategoriaFicheroImpl;
  /**
   * variable que comunica al otro componente el evento para eliminar la categoria de fichero
   */
  @Output() categoriaFicheroEliminar = new EventEmitter<CategoriaFicheroImpl>();
  /**
   * variable que comunica al otro componente el evento para eliminar la categoria de fichero
   */
  @Output() categoriaFicheroEditar = new EventEmitter<CategoriaFicheroImpl>();

  constructor() { }

  ngOnInit(): void { }

  /**
   * metodo que emite el evento al otro componente para eliminar la categoria de fichero
   */
  eliminar(): void {
    this.categoriaFicheroEliminar.emit(this.categoriaFichero);
  }

  /**
   * metodo que emite el evento al otro componente para editar la categoria de fichero
   */
  editar(): void {
    this.categoriaFicheroEditar.emit(this.categoriaFichero);
  }
}