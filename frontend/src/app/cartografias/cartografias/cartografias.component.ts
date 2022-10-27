import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigService } from "src/app/services/app-config.service";
import { environment } from "src/environments/environment";
import { Cartografia } from "../models/cartografia";
import { CartografiaImpl } from "../models/cartografia-impl";
import { CartografiaService } from "../service/cartografia.service";
import { ViewChild } from '@angular/core';

@Component({
  selector: "app-cartografias",
  templateUrl: "./cartografias.component.html",
  styleUrls: []
})
export class CartografiasComponent implements OnInit {
  /**
   * para controlar el botón cerrar del modal
   */
   @ViewChild ('closebutton_cartografia') closebutton_cartografia;

  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que recoge todas las cartografias del cenad
   */
  cartografias: Cartografia[] = [];
  /**
   * variable que posibilita la comunicacion de datos con el otro componente para mostrar los datos de una cartografia
   */
  cartografiaVerDatos: Cartografia;
  /**
   * variable que recoge la url host de la aplicación
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable boolean que dice si eres administrador de ese CENAD y por tanto puedes editarla
   */
  isAdminCenad: boolean = true;

  /**
   *
   * @param cartografiaService Para usar los metodos propios de Cartografias
   * @param router Para redirigir
   * @param activateRoute Para recuperar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private cartografiaService: CartografiaService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService
  ) {
    this.hostSicenad = appConfigService.hostSicenad
      ? appConfigService.hostSicenad
      : environment.hostSicenad;
  }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - comprueba si estas loggeado como administrador de este cenad
   * - metemos en la variable todas las cartografias del cenad
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params["idCenad"];
    this.isAdminCenad =
      this.idCenad === sessionStorage.idCenad &&
      sessionStorage.isAdmin === "true";
    this.cartografias = JSON.parse(
      localStorage.getItem(`cartografias_${this.idCenad}`)
    );
  }

  /**
   * metodo que asigna los datos de la cartografia para la comunicacion al otro componente
   * @param cartografia Cartografia que mostrara el modal
   */
  verDatos(cartografia: Cartografia): void {
    this.cartografiaVerDatos = cartografia;
  }

  /**
   * metodo que materializa la eliminacion de una cartografia y vuelve al listado de cartografias del cenad, actualizando el storage
   * @param cartografia Cartografia a eliminar
   */
  onCartografiaEliminar(cartografia: CartografiaImpl): void {
    this.cartografiaService.delete(cartografia).subscribe((response) => {
      this.cartografiaService
        .getCartografiasDeCenad(this.idCenad)
        .subscribe((response) => {
          localStorage.setItem(
            `cartografias_${this.idCenad}`,
            JSON.stringify(
              this.cartografiaService.extraerCartografias(response)
            )
          );
          console.log(`He borrado la cartografia ${cartografia.nombre}`);
          // this.router.navigate([
          //   `/principalCenad/${this.idCenad}/cartografias/${this.idCenad}`,
          // ]);
          document.getElementById('ficha-cartografia').removeAttribute('disabled');
          this.closebutton_cartografia.nativeElement.click();
          document.getElementById('ficha-cartografia').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
    });
  }

  /**
   * metodo que materializa la edición de una cartografia y vuelve al listado de cartografias del cenad, actualizando el storage
   * @param cartografia Cartografia a editar
   */ 
  onCartografiaEditar(cartografia: CartografiaImpl): void {
    cartografia.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
    this.cartografiaService.update(cartografia).subscribe((response) => {
      this.cartografiaService
        .getCartografiasDeCenad(this.idCenad)
        .subscribe((response) => {
          localStorage.setItem(
            `cartografias_${this.idCenad}`,
            JSON.stringify(
              this.cartografiaService.extraerCartografias(response)
            )
          );
          console.log(`He actualizado la cartografia ${cartografia.nombre}`);
          // this.router.navigate([
          //   `/principalCenad/${this.idCenad}/cartografias/${this.idCenad}`,
          // ]);
          document.getElementById('ficha-cartografia').removeAttribute('disabled');
          this.closebutton_cartografia.nativeElement.click();
          document.getElementById('ficha-cartografia').setAttribute('disabled', 'disabled');
          this.ngOnInit();
        });
    });
  }
}
