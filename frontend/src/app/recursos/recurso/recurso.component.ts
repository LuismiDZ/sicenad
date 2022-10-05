import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Recurso } from '../models/recurso';
import { RecursoService } from '../service/recurso.service';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: []
})
export class RecursoComponent implements OnInit {
  /**
   * variable que trae del otro componente el recurso
   */
  @Input() recurso: Recurso;
  /**
   * variable que emite al otro componente un evento con sus datos
   */
  @Output() recursoSeleccionado = new EventEmitter<Recurso>();
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   */
  constructor(private recursoService: RecursoService) { }

  /**
   * - asigna al campo categoria del recurso su valor
   * - asigna al campo usuario gestor del recurso su valor
   * - asigna al campo tipo de formulario del recurso su valor
   */
  ngOnInit() {
    this.recursoService.getCategoria(this.recurso.idRecurso).subscribe((response) => this.recurso.categoria = this.recursoService.mapearCategoria(response));
    this.recursoService.getUsuarioGestor(this.recurso).subscribe((response) => this.recurso.usuarioGestor = this.recursoService.mapearUsuario(response));
    this.recursoService.getTipoFormulario(this.recurso).subscribe((response) => this.recurso.tipoFormulario = this.recursoService.mapearUsuario(response));
  }
}
