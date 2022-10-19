import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Unidad } from '../models/unidad';
import { UnidadImpl } from '../models/unidad-impl';
import { UnidadService } from '../service/unidad.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: []
})
export class UnidadesComponent implements OnInit {
   /**
   * para controlar el botón cerrar del modal
   */
    @ViewChild ('closebutton_unidad') closebutton_unidad;

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
   * variable que recogera el string para el routerLink de nueva unidad en funcion de donde viene
   */
  nuevaUnidad: string = '';
  /**
   * variable que recoge todas las unidades
   */
  unidades: Unidad[] = [];
  /**
   * variable que relaciona cada unidad con sus datos
   */
  unidadVerDatos: Unidad;
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
     * - recoge del local storage en la variable todas las unidades
     * - la variable volver nos llevara a "superadministrador"o a "ppalCenad"
     */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.isAdministrador = (this.idCenad !==undefined);
    this.unidades = JSON.parse(localStorage.unidades);
    if (this.isAdministrador) {
      //aqui debo sacar el idCenad del administrador que esta logueado
      this.volver = `/principalCenad/${this.idCenad}`;
      this.nuevaUnidad = `/principalCenad/${this.idCenad}/unidades/${this.idCenad}/formulario/${this.idCenad}`;
    } else {
      this.volver = `/superadministrador`;
      this.nuevaUnidad = `/unidades/formulario`;
    }
  }

  /**
   * metodo para poder mostrar los datos de la unidad
   * @param unidad Unidad a mostrar en el modal
   */
  verDatos(unidad: Unidad): void {
    this.unidadVerDatos = unidad;
  }

  /**
   * metodo para eliminar una unidad y volver al listado
   *
   * Tambien se actualiza el localStorage
   */
  onUnidadEliminar(unidad: UnidadImpl): void {
    const ruta: string = (this.idCenad !==undefined) ? `principalCenad/${this.idCenad}/unidades/${this.idCenad}` : 'unidades'
    this.unidadService.delete(unidad).subscribe(response => {
      this.unidadService.getUnidades().subscribe((response) => {
        localStorage.unidades = JSON.stringify(this.unidadService.extraerUnidades(response));
        console.log(`He borrado la unidad ${unidad.nombre}`);
        //this.router.navigate([ruta]);
        document.getElementById('ficha-unidad').removeAttribute('disabled');
        this.closebutton_unidad.nativeElement.click();
        document.getElementById('ficha-unidad').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }

  /**
   * metodo para editar una unidad y volver al listado
   *
   * Tambien se actualiza el localStorage
   */  onUnidadEditar(unidad: UnidadImpl): void {
    const ruta: string = (this.idCenad !==undefined) ? `principalCenad/${this.idCenad}/unidades/${this.idCenad}` : 'unidades'
    this.unidadService.update(unidad).subscribe(response => {
      this.unidadService.getUnidades().subscribe((response) => {
        localStorage.unidades = JSON.stringify(this.unidadService.extraerUnidades(response));
        console.log(`He actualizado la unidad ${unidad.nombre}`);
        //this.router.navigate([ruta]);
        document.getElementById('ficha-unidad').removeAttribute('disabled');
        this.closebutton_unidad.nativeElement.click();
        document.getElementById('ficha-unidad').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }
}
