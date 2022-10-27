import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fichero } from 'src/app/recursos/models/fichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { NormativaService } from '../service/normativa.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-normativas',
  templateUrl: './normativas.component.html',
  styleUrls: []
})
export class NormativasComponent implements OnInit {
   /**
   * para controlar el botón cerrar del modal
   */
    @ViewChild ('closebutton_normativa') closebutton_normativa;

  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que recoge todas las normativas del cenad
   */
  normativas: Fichero[] = [];
  /**
   * variable que posibilita la comunicacion de datos con el otro componente para mostrar los datos de una normativa
   */
  normativaVerDatos: Fichero;
  /**
   * variable que recoge el host de la aplicacion
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable boolean que dice si eres administrador de ese CENAD y por tanto puedes editarla
   */
  isAdminCenad: boolean = true;

  /**
   * 
   * @param normativaService Para usar los metodos propios de Normativa
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private normativaService: NormativaService,
    private router: Router, 
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService) {
      this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
    }

    /**
     * - recuperamos el id del CENAD de la barra de navegacion
     * - comprueba si estas loggeado como administrador de este cenad
     * - metemos en la variable todas las normativas del cenad
     */
    ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.isAdminCenad = (this.idCenad === sessionStorage.idCenad && (sessionStorage.isAdmin === 'true'));
    this.normativas = JSON.parse(localStorage.getItem(`normativas_${this.idCenad}`));
    }

    /**
     * metodo que asigna los datos de la normativa para la comunicacion al otro componente
     * @param normativa Normativa
     */ 
    verDatos(normativa: Fichero): void {
      this.normativaVerDatos = normativa;
    }

    /**
     * metodo que materializa la eliminacion de una normativa y vuelve al listado de normativas del cenad
     * - actualiza el localStorage
     * @param normativa Normativa a eliminar
     */
    onNormativaEliminar(normativa: FicheroImpl): void {
      this.normativaService.delete(normativa).subscribe(response => {
        this.normativaService.getNormativasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`normativas_${this.idCenad}`, JSON.stringify(this.normativaService.extraerNormativas(response)));
          console.log(`He borrado la normativa ${normativa.nombre}`);
          //this.router.navigate([`/principalCenad/${this.idCenad}/normativas/${this.idCenad}`]);
          document.getElementById('ficha-normativa').removeAttribute('disabled');
          this.closebutton_normativa.nativeElement.click();
          document.getElementById('ficha-normativa').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
      });
    }

    /**
     * metodo que materializa la edicion de una normativa y vuelve al listado de normativas del cenad
     * - Actualiza el localStorage
     * @param normativa Normativa a editar
     */
    onNormativaEditar(normativa: FicheroImpl): void {
      normativa.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
      this.normativaService.update(normativa).subscribe(response => {
        this.normativaService.getNormativasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`normativas_${this.idCenad}`, JSON.stringify(this.normativaService.extraerNormativas(response)));
          console.log(`He actualizado la normativa ${normativa.nombre}`);
          //this.router.navigate([`/principalCenad/${this.idCenad}/normativas/${this.idCenad}`]);
          document.getElementById('ficha-normativa').removeAttribute('disabled');
          this.closebutton_normativa.nativeElement.click();
          document.getElementById('ficha-normativa').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
      });
    }
  }