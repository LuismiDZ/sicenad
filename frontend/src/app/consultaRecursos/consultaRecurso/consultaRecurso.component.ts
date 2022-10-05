import { Component, Input, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Recurso } from 'src/app/recursos/models/recurso';
import { RecursoService } from 'src/app/recursos/service/recurso.service';


@Component({
  selector: 'app-consultaRecurso',
  templateUrl: './consultaRecurso.component.html',
  styleUrls: []
})
export class ConsultaRecursoComponent implements OnInit {
  /**
   * variable que trae los datos correspondientes al recurso del otro componente
   */
  @Input() recurso: Recurso;
  /**
   * variable icono para "ver" el recurso
   */
  faEye = faEye;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   */
  constructor(private recursoService: RecursoService) { }

  /**
   * recupera la categoria del recurso y se la asigna al campo de la variable del mismo
   */
  ngOnInit() {
    this.recursoService.getCategoria(this.recurso.idRecurso).subscribe((response) => this.recurso.categoria = this.recursoService.mapearCategoria(response));
  }
}
