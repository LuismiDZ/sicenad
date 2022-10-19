import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Cenad } from "../models/cenad";
import { CenadImpl } from "../models/cenad-impl";
import { CenadService } from "../service/cenad.service";
import { ViewChild } from '@angular/core';

@Component({
  selector: "app-superadministrador",
  templateUrl: "./superadministrador.component.html",
  styleUrls: ["./superadministrador.component.css"],
})
export class SuperadministradorComponent implements OnInit {
   /**
   * para controlar el botón cerrar del modal
   */
    @ViewChild ('closebutton_cenad') closebutton_cenad;
    
  /**
   * variable del icono "inicio"
   */
  faHome = faHome;
  /**
   * variable que guarda todos los cenads
   */
  cenads: Cenad[] = [];
  /**
   * variable que comunicara los datos del cenad
   */
  cenadVerDatos: Cenad;

  /**
   *
   * @param cenadService Para usar los metodos propios de Cenad
   * @param router Para redirigir
   */
  constructor(private cenadService: CenadService, private router: Router) {}

  /**
   * recupera todos los cenads del local storage
   */
  ngOnInit(): void {
    this.cenads = JSON.parse(localStorage.cenads);
  }

  /**
   * metodo para traspasar los datos del cenad
   * @param cenad Cenad a mostrar en el modal
   */
  verDatosCenad(cenad: Cenad): void {
    this.cenadVerDatos = cenad;
  }

  /**
   * metodo para eliminar un cenad, y actualizo el localStorage
   * @param cenad Cenad a eliminar
   */
  onCenadEliminar(cenad: CenadImpl): void {
    this.cenadService.delete(cenad).subscribe((response) => {
      this.cenadService.getCenads().subscribe((response) => {
        localStorage.cenads = JSON.stringify(
          this.cenadService.extraerCenads(response)
        );
        console.log(`He borrado el CENAD/CMT ${cenad.nombre}`);
       // this.router.navigate(["/superadministrador"]);
        document.getElementById('ficha-cenad').removeAttribute('disabled');
        this.closebutton_cenad.nativeElement.click();
        document.getElementById('ficha-cenad').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }

  /**
   * metodo para editar un cenad, y actualizo el localStorage
   * @param cenad Cenad a editar
   */
  onCenadEditar(cenad: CenadImpl): void {
    this.cenadService.update(cenad).subscribe((response) => {
      this.cenadService.getCenads().subscribe((response) => {
        localStorage.cenads = JSON.stringify(
          this.cenadService.extraerCenads(response)
        );
        console.log(`He actualizado el CENAD/CMT ${cenad.nombre}`);
        //this.router.navigate(["/superadministrador"]);
        document.getElementById('ficha-cenad').removeAttribute('disabled');
        this.closebutton_cenad.nativeElement.click();
        document.getElementById('ficha-cenad').setAttribute('disabled', 'disabled');
        this.ngOnInit();
      });
    });
  }
}
