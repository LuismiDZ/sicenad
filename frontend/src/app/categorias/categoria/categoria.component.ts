import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Categoria } from '../models/categoria';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: []
})
export class CategoriaComponent implements OnInit {
  /**
   * variable que trae los datos correspondientes a la categoria del otro componente
   */
  @Input() categoria: Categoria;
  /**
   * variable que comunica al otro componente el evento para ver sus datos y editarlos
   */
  @Output() categoriaSeleccionada = new EventEmitter<Categoria>();
  /**
   * variable para icono "editar"
   */
  faEdit = faEdit;

  /**
   * 
   * @param categoriaService Para usar los metodos propios de Categoria
   */
  constructor(private categoriaService: CategoriaService) { }

  /**
   * metodo para conseguir la categoria padre de cada categoria
   */
  ngOnInit() {
    this.categoriaService.getCategoriaPadre(this.categoria).subscribe((response) => this.categoria.categoriaPadre = this.categoriaService.mapearCategoria(response));
  }
}