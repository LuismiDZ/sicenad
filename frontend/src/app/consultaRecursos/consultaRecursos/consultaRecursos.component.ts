import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/categorias/models/categoria';
import { Recurso } from 'src/app/recursos/models/recurso';
import { RecursoService } from 'src/app/recursos/service/recurso.service';

@Component({
  selector: 'app-consultaRecursos',
  templateUrl: './consultaRecursos.component.html',
  styleUrls: []
})
export class ConsultaRecursosComponent implements OnInit {
  /**
   * variable que define el usuario gestor que accede para modificar recursos
   */
  idUsuarioGestor: string = '';
  /**
   * variable que dice si el usuario esta loggeado como gestor de ese cenad
   */
  isGestorCenad: boolean = false;
  /**
   * variable con la que se muestra o no el boton de ver todas o solo las tuyas
   */
  cambioBoton: boolean = false;
  /**
   * variable con la que rescatamos de la barra de navegacion el idCenad
   */
  idCenad: string = "";
  /**
   * variable en la que se guardan todos los recursos del cenad
   */
  recursos: Recurso[] = [];
  /**
   * variable que recoge las categorias del cenad. inicialmente las padre, luego van filtrandose
   */
  categoriasFiltradas: Categoria[] = [];
  /**
   * variable que recoge los recursos pertenecientes a las categorias filtradas
   */
  recursosFiltrados: Recurso[] = [];
  /**
   * con esta variable vamos mostrando la categoria con la que he filtrado y de ella se sacan subcategorias y recursos
   */
  categoriaSeleccionada: Categoria;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param router Para redirigir
   * @param activateRoute Para recuperar el id de la barra de navegacion
   */
  constructor(
    private recursoService: RecursoService,
    private router: Router, private activateRoute: ActivatedRoute) { }

    /**
     * - rescatamos el id del Cenad de la barra de navegacion
     * - rescatamos del local storage los recursos de ese cenad
     * - asignamos a la variable categorias filtradas las categorias padre del cenad, para comenzar a filtrar
     * - comprobamos si el usuario es un gestor de este cenad
     */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.recursos = JSON.parse(localStorage.getItem(`recursos_${this.idCenad}`));
    this.categoriasFiltradas = JSON.parse(localStorage.getItem(`categoriasPadre_${this.idCenad}`));
    if((sessionStorage.isGestor ==='true') && (sessionStorage.idCenad === this.idCenad)) {
      this.idUsuarioGestor = sessionStorage.idUsuario;
      this.isGestorCenad = this.cambioBoton = true;
    }
  }

  /**
   * metodo que filtra por la categoria seleccionada y muestra los recursos de la misma o sus hijas...
   * - se asigna a la variable de categorias filtradas las subcategorias de la categoria seleccionada
   * - si la categoria seleccionada no tiene subcategorias, los recursos a mostrar son los suyos
   * - los recursos a mostrar son los que tenga cualquier subcategoria de la seleccionada, sea el nivel de subcategoria que sea
   */
  filtrar() {
    this.recursoService.getSubcategorias(this.categoriaSeleccionada).subscribe((response) =>
      this.categoriasFiltradas = this.recursoService.extraerCategorias(response));
    setTimeout(() => {
      if (this.categoriasFiltradas.length === 0) {
        this.recursoService.getRecursosDeCategoria(this.categoriaSeleccionada).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
      }
      else {
        this.recursoService.getRecursosDeSubcategorias(this.categoriaSeleccionada).subscribe((response) => this.recursos = this.recursoService.extraerRecursos(response));
      }
    }, 1000);
  }

  /**
   * metodo para resetear los filtros y volver a mostrar todos los recursos del cenad
   */
  borrarFiltros() {
    this.categoriasFiltradas = JSON.parse(localStorage.getItem(`categoriasPadre_${this.idCenad}`));
    this.recursos = JSON.parse(localStorage.getItem(`recursos_${this.idCenad}`));
    this.categoriaSeleccionada = null;
  }

  /**
   * metodo para conseguir los recursos de un gestor
   */
  verSoloMisRecursos(): void {
    this.recursoService.getRecursosDeGestor(this.idUsuarioGestor).subscribe((response) => {
      if (response._embedded) {//con este condicional elimino el error de consola si no hay ningun recurso
        this.recursos = this.recursoService.extraerRecursos(response);
      }});
    this.cambioBoton = false;
  }
}
