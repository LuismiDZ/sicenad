import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { ArmaImpl } from '../../models/arma-impl';

@Component({
  selector: 'app-arma-ficha',
  templateUrl: './arma-ficha.component.html',
  styleUrls: []
})
export class ArmaFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el arma
   */
  @Input() arma: ArmaImpl;
  /**
   * variable que emite al otro componente los eventos para eliminar el arma
   */
  @Output() armaEliminar = new EventEmitter<ArmaImpl>();
  /**
   * variable que emite al otro componente los eventos para editar el arma
   */
  @Output() armaEditar = new EventEmitter<ArmaImpl>();
  /**
   * variable que recoge los tipos de tiro
   */
  tiposTiro: string[] = environment.tiposTiro;

  /**
   * @param appConfigService Para utilizar las variables del `properties`
   */
  constructor(private appConfigService: AppConfigService) {
    this.tiposTiro = appConfigService.tiposTiro ? appConfigService.tiposTiro : environment.tiposTiro;
  }

  ngOnInit(): void { }

  /**
   * metodo que emite el evento para eliminar el arma
   */
  eliminar(): void {
    this.armaEliminar.emit(this.arma);
  }

  /**
   * metodo que emite el evento para editar el arma
   */
  editar(): void {
    this.armaEditar.emit(this.arma);
  }
}
