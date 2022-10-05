import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UnidadImpl } from '../models/unidad-impl';
import { UnidadService } from '../service/unidad.service';

@Component({
  selector: 'app-unidad-form',
  templateUrl: './unidad-form.component.html',
  styleUrls: []
})
export class UnidadFormComponent implements OnInit {
  /**
   * variable boolean que dice si es administrador o no
   */
  isAdministrador: boolean = false;
  /**
   * variable para capturar el idCenad en el caso de que el que acceda sea el administrador de un cenad
   */
  idCenad: string = "";
  /**
   * variable que recogera el string para el routerLink de volver atras en funcion de donde viene
   */
  volver: string = '';
  /**
   * variable para guardar la nueva unidad
   */
  unidad: UnidadImpl = new UnidadImpl();
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   *
   * @param unidadService Para usar los metodos propios de Unidad
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   */
  constructor(
    private unidadService: UnidadService,
    private router: Router, private activateRoute: ActivatedRoute) { }

    /**
     * - captura el id del cenad de la barra de navegacion
     * - la variable volver nos llevara a "unidades"o a "ppalCenad/{id}/unidades/{id}"
     * - aqui debo sacar el idCenad del administrador que esta logueado
     */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.isAdministrador = (this.idCenad !==undefined);
    if (this.isAdministrador) {
      this.volver = `/principalCenad/${this.idCenad}/unidades/${this.idCenad}`;
    } else {
      this.volver = `/unidades`;
    }
  }

  /**
   * metodo que crea una unidad y vuelve al listado de unidades
   *
   * Tambien actualiza el localStorage
   */
  crearUnidad(): void {
    let ruta: string = (this.idCenad !==undefined) ? `principalCenad/${this.idCenad}/unidades/${this.idCenad}` : 'unidades'
    this.unidadService.create(this.unidad).subscribe((response) => {
      console.log(`He creado la unidad ${this.unidad.nombre}`);
      this.unidadService.getUnidades().subscribe((response) => {
        localStorage.unidades = JSON.stringify(this.unidadService.extraerUnidades(response));
        this.router.navigate([ruta]);
      });
    });
  }
}
