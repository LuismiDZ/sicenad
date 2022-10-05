import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { ArmaImpl } from '../models/arma-impl';
import { ArmaService } from '../service/arma.service';


@Component({
  selector: 'app-arma-form',
  templateUrl: './arma-form.component.html',
  styleUrls: []
})
export class ArmaFormComponent implements OnInit {
  /**
   * variable para guardar el nuevo arma
  */
  arma: ArmaImpl = new ArmaImpl();
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;
  /**
   * variable que recoge los tipos de tiro
   */
  tiposTiro: string[] = environment.tiposTiro;

  /**
   *
   * @param armaService Contiene los metodos propios de 'Arma'
   * @param router Para redirigir...
   * @param appConfigService Para utilizar las variables del `properties`
   */
  constructor(
    private armaService: ArmaService,
    private router: Router, private appConfigService: AppConfigService) {
      this.tiposTiro = appConfigService.tiposTiro ? appConfigService.tiposTiro : environment.tiposTiro;
    }

  ngOnInit() { }

  /**
   * metodo que crea un arma y vuelve al listado de armas
   * - actualizo el local storage
   */
  crearArma(): void {
    this.armaService.create(this.arma).subscribe((response) => {
      console.log(`He creado el arma ${this.arma.nombre}`);
      this.armaService.getArmas().subscribe((response) => {
        localStorage.armas = JSON.stringify(this.armaService.extraerArmas(response));
        this.router.navigate(['/armas']);
      });
    });
  }
}
