import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../models/categoria';
import { CategoriaImpl } from '../models/categoria-impl';
import { CategoriaService } from '../service/categoria.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: []
})
export class CategoriasComponent implements OnInit {
  /**
   * para controlar el botón cerrar del modal
   */
   @ViewChild ('closebutton_categoria') closebutton_categoria;

  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que recoge todas las categorias del cenad
   */
  categorias: Categoria[] = [];
  /**
   * variable que posibilita la comunicacion de datos con el otro componente para mostrar los datos de una categoria
   */
  categoriaVerDatos: Categoria;

  /**
   * 
   * @param categoriaService Para usar los metodos propios de Categoria
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private categoriaService: CategoriaService,
    private router: Router
    , private activateRoute: ActivatedRoute) { }

    /**
     * - recuperamos el id del CENAD de la barra de navegacion
     * - metemos en la variable todas las categorias del cenad
     * - metodo que asigna los datos de la categoria para la comunicacion al otro componente
     */
    ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.categorias = JSON.parse(localStorage.getItem(`categorias_${this.idCenad}`));
    }

    /**
     * Metodo para mostrar el modal
     * @param categoria Categoria a mostrar en el modal
     */
    verDatos(categoria: Categoria): void {
      this.categoriaVerDatos = categoria;
    }

    /**
     * metodo que materializa la eliminacion de una categoria y vuelve al listado de categorias del cenad
     * - actualiza localStorage
     */
    onCategoriaEliminar(categoria: CategoriaImpl): void {
      this.categoriaService.delete(categoria).subscribe(response => {
        this.categoriaService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`categoriasPadre_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response))));
        this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`categorias_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response)));
          console.log(`He borrado la Categoria ${categoria.nombre}`);
          //this.router.navigate([`/principalCenad/${this.idCenad}/categorias/${this.idCenad}`]);
          document.getElementById('ficha-categoria').removeAttribute('disabled');
          this.closebutton_categoria.nativeElement.click();
          document.getElementById('ficha-categoria').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
      });
    }

    /**
     * metodo que materializa la edicion de una categoria y vuelve al listado de categorias del cenad
     * - actualiza localStorage
     */
    onCategoriaEditar(categoria: CategoriaImpl): void {
      this.categoriaService.update(categoria).subscribe(response => {
        this.categoriaService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`categoriasPadre_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response))));
        this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`categorias_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response)));
          console.log(`He actualizado la Categoria ${categoria.nombre}`);
          //this.router.navigate([`/principalCenad/${this.idCenad}/categorias/${this.idCenad}`]);
          document.getElementById('ficha-categoria').removeAttribute('disabled');
          this.closebutton_categoria.nativeElement.click();
          document.getElementById('ficha-categoria').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
      });
    }
  }