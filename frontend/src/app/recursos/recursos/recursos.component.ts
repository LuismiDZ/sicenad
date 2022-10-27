import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/categorias/models/categoria';
import { Recurso } from '../models/recurso';
import { RecursoImpl } from '../models/recurso-impl';
import { RecursoService } from '../service/recurso.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: []
})
export class RecursosComponent implements OnInit {
    /**
   * para controlar el botón cerrar del modal
   */
     @ViewChild ('closebutton_recurso') closebutton_recurso;

  /**
   * variable para capturar el id del cenad de la barra de navegacion
   */
  idCenad: string = "";
  /**
   * variable con todos los recursos del cenad
   */
  recursos: Recurso[] = [];
  /**
   * variable para trasferir los datos del recurso
   */
  recursoVerDatos: Recurso;
  /**
   * variable con las categorias que se van filtrando
   */
  categoriasFiltradas: Categoria[] = [];
  /**
   * variable con los recursos tras los filtros
   */
  recursosFiltrados: Recurso[] = [];
  /**
   * variable con la categoria seleccionada en el filtro
   */
  categoriaSeleccionada: Categoria;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private recursoService: RecursoService,
    private router: Router, private activateRoute: ActivatedRoute) { }

    /**
     * - captura el id del cenad de la barra de navegacion
     * - rescatamos del local storage los recursos de ese cenad
     * - recupera del local storage las categorias padre de ese cenad, para comenzar el filtrado
     */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.recursos = JSON.parse(localStorage.getItem(`recursos_${this.idCenad}`));
    this.categoriasFiltradas = JSON.parse(localStorage.getItem(`categoriasPadre_${this.idCenad}`));
  }

  /**
   * metodo para transferir los datos del recurso al otro componente
   * @param recurso Recurso q se muestra en el modal
   */
  verDatos(recurso: Recurso): void {
    this.recursoVerDatos = recurso;
  }

  /**
   * metodo para eliminar un recurso y volver al listado de recursos de ese cenad
   * @param recurso Recurso a eliminar
   * - actualiza el localStorage
   */
  onRecursoEliminar(recurso: RecursoImpl): void {
    this.recursoService.delete(recurso).subscribe(response => {
      this.recursoService.getRecursosDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`recursos_${this.idCenad}`, JSON.stringify(this.recursoService.extraerRecursos(response)));
        console.log(`He borrado el recurso ${recurso.nombre}`);
        //this.router.navigate([`/principalCenad/${this.idCenad}/recursos/${this.idCenad}`]);
        document.getElementById('ficha-recurso').removeAttribute('disabled');
        this.closebutton_recurso.nativeElement.click();
        document.getElementById('ficha-recurso').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }

  /**
   * metodo para editar un recurso y volver al listado de recursos de ese cenad
   * - actualiza el localStorage
   */
  onRecursoEditar(recurso: RecursoImpl): void {
    this.recursoService.update(recurso).subscribe(response => {
      this.recursoService.getRecursosDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`recursos_${this.idCenad}`, JSON.stringify(this.recursoService.extraerRecursos(response)));
        console.log(`He actualizado el recurso ${recurso.nombre}`);
        //this.router.navigate([`/principalCenad/${this.idCenad}/recursos/${this.idCenad}`]);
        document.getElementById('ficha-recurso').removeAttribute('disabled');
        this.closebutton_recurso.nativeElement.click();
        document.getElementById('ficha-recurso').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }

  /**
   * metodo para filtrar recursivamente las categorias
   * - rescata de la BD las subcategorias de la categoria seleccionada
   * - si la categoria seleccionada no tiene subcategorias muestra los recursos de esa categoria
   * - rescatamos de la BD los recursos de ese cenad de esa categoria seleccionada
   * - sino muestra los recursos de sus subcategorias, esten al nivel que esten
   */
  filtrar() {
    this.recursoService.getSubcategorias(this.categoriaSeleccionada).subscribe((response) =>
      this.categoriasFiltradas = this.recursoService.extraerCategorias(response));
    setTimeout(() => {
      if (this.categoriasFiltradas.length === 0) {
        this.recursoService.getRecursosDeCategoria(this.categoriaSeleccionada).subscribe((response) => {
          if (response._embedded) {//con este condicional elimino el error de consola si no hay ningun recurso
            this.recursos = this.recursoService.extraerRecursos(response);
          }
        });
      } else {
              this.recursoService.getRecursosDeSubcategorias(this.categoriaSeleccionada).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
          }
    }, 500);
  }

  /**
   * metodo que restea los filtros y regresa al listado de recursos del cenad
   * - rescata del local storage las categorias padre del cenad
   * - rescatamos del local storage los recursos de ese cenad
   * - resetea la categoria seleccionada
   */
  borrarFiltros() {
    this.categoriasFiltradas = JSON.parse(localStorage.getItem(`categoriasPadre_${this.idCenad}`));
    this.recursos = JSON.parse(localStorage.getItem(`recursos_${this.idCenad}`));
    this.categoriaSeleccionada = null;
  }
}
