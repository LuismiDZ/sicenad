import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../models/categoria';
import { CategoriaImpl } from '../../models/categoria-impl';

@Component({
  selector: 'app-categoria-ficha',
  templateUrl: './categoria-ficha.component.html',
  styleUrls: []
})
export class CategoriaFichaComponent implements OnInit {
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que me comunica del otro componente la categoria a ver/editar
   */
  @Input() categoria: CategoriaImpl;
  /**
   * variable que comunica al otro componente el evento para eliminar la categoria
   */
  @Output() categoriaEliminar = new EventEmitter<CategoriaImpl>();
  /**
   * variable que comunica al otro componente el evento para editar la categoria
   */
  @Output() categoriaEditar = new EventEmitter<CategoriaImpl>();
  /**
   * variable en la que meteremos las categorias de este CENAD/CMT para poder seleccionarlas como categoria padre
   */
  categorias: Categoria[] = [];
  /**
   * variable que se utiliza como variable intermedia para que se muestre en el select la opcion elegida inicialmente
   */
  categoriaPadreSeleccionada: string = "";

  /**
   * 
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(private activateRoute: ActivatedRoute) { }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - metemos en la variable todas las categorias del cenad, para seleccionar la categoria padre
   * - actualizamos los valores iniciales de los select, en este caso el de categoria padre
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.categorias = JSON.parse(localStorage.getItem(`categorias_${this.idCenad}`));
    this.actualizarNgModels();
  }

  /**
   * metodo que actualiza la variable intermedia que permite mostrar el valor de la categoria padre en el select
   */
  actualizarNgModels(): void {
    this.categoriaPadreSeleccionada = this.categoria.categoriaPadre ? this.categoria.categoriaPadre.url : "";
  }

  /**
   * metodo que emite el evento al otro componente para eliminar la categoria
   */
  eliminar(): void {
    this.categoriaEliminar.emit(this.categoria);
  }

  /**
   * metodo que emite el evento al otro componente para editar la categoria
   */
  editar(): void {
    this.categoria.categoriaPadre = this.categoriaPadreSeleccionada;
    this.categoriaEditar.emit(this.categoria);
  }
}
