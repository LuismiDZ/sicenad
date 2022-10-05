import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Arma } from '../models/arma';
import { ArmaImpl } from '../models/arma-impl';
import { ArmaService } from '../service/arma.service';

@Component({
  selector: 'app-armas',
  templateUrl: './armas.component.html',
  styleUrls: []
})
export class ArmasComponent implements OnInit {
  /**
   * variable que recoge todas las armas
   */
  armas: Arma[] = [];
  /**
   * variable que relaciona cada arma con sus datos
   */
  armaVerDatos: Arma;
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;

  /**
   * @param armaService Contiene los metodos propios de 'Arma'
   * @param router Para redirigir...
   */
  constructor(
    private armaService: ArmaService,
    private router: Router) { }

  ngOnInit(): void {
    /**
     * recoge del local storage en la variable todas las armas
     */
    this.armas = JSON.parse(localStorage.armas);
  }

  /**
   * metodo para poder mostrar los datos del arma
   * @param arma Arma que se mostrará en el modal
   */
  verDatos(arma: Arma): void {
    this.armaVerDatos = arma;
  }

  /**
   * metodo para eliminar un arma y volver al listado
   * - elimina el arma y actualiza el local storage
   * - vuelve al listado de armas
   * @param arma Arma que se va a eliminar
   */
  onArmaEliminar(arma: ArmaImpl): void {
    this.armaService.delete(arma).subscribe(response => {
      this.armaService.getArmas().subscribe((response) => {
        localStorage.armas = JSON.stringify(this.armaService.extraerArmas(response));
        console.log(`He borrado el arma ${arma.nombre}`);
        this.router.navigate(['/armas']);
      });
    });
  }

  /**
   * metodo para editar un arma y volver al listado
   * - Edita el arma y actualiza el local storage
   * - Vuelve al listado de armas
   * @param arma Arma que se va a editar
   */
  onArmaEditar(arma: ArmaImpl): void {
    this.armaService.update(arma).subscribe(response => {
      this.armaService.getArmas().subscribe((response) => {
        localStorage.armas = JSON.stringify(this.armaService.extraerArmas(response));
        console.log(`He actualizado el arma ${arma.nombre}`);
        this.router.navigate(['/armas']);
      });
    });
  }
}
