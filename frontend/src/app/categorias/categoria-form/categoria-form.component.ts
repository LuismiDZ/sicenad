import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';
import { CategoriaImpl } from '../models/categoria-impl';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: []
})
export class CategoriaFormComponent implements OnInit {
  /**
   * variable que recogera el host del properties.json
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable con la que guardar la nueva categoria
   */
  categoria: Categoria = new CategoriaImpl();
  /**
   * variable en la que meteremos las categorias de este CENAD/CMT para poder seleccionarlas como categoria padre
   */
  categorias: Categoria[] = [];
  /**
   * variable para icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   * 
   * @param categoriaService Para usar los metodos propios de Categoria
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService) {
    this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
  }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - metemos en la variable todas las categorias del cenad, para seleccionar la categoria padre
   * - recuperamos del properties.json, si existe, el host
   * - asignamos el CENAD a la categoria que creamos
   */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.categorias = JSON.parse(localStorage.getItem(`categorias_${this.idCenad}`));
    this.hostSicenad = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
    this.categoria.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
  }

  /**
   * metodo para crear una nueva categoria y volver al listado de categorias de ese cenad
   * - actualiza el localStorage
   */
  crearCategoria(): void {
    this.categoriaService.create(this.categoria).subscribe((response) => {
      this.categoriaService.getCategoriasPadreDeCenad(this.idCenad).subscribe((response) => localStorage.setItem(`categoriasPadre_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response))));
      this.categoriaService.getCategoriasDeCenad(this.idCenad).subscribe((response) => {
        localStorage.setItem(`categorias_${this.idCenad}`, JSON.stringify(this.categoriaService.extraerCategorias(response)));
        console.log(`He creado la Categoria ${this.categoria.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}/categorias/${this.idCenad}`]);
      });
    });
  }
}