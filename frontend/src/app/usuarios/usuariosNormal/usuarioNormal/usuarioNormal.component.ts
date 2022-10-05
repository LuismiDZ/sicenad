import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsuarioNormal } from '../../models/usuarioNormal';
import { UsuarioNormalService } from '../../service/usuarioNormal.service';

@Component({
  selector: 'app-usuarioNormal',
  templateUrl: './usuarioNormal.component.html',
  styleUrls: []
})
export class UsuarioNormalComponent implements OnInit {
  /**
   * variable que trae del otro componente el usuario normal
   */
  @Input() usuarioNormal: UsuarioNormal;
  /**
   * variable que emitira al otro componente el usuario normal para mostrar los datos
   */
  @Output() usuarioNormalSeleccionado = new EventEmitter<UsuarioNormal>();
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;

  /**
   * 
   * @param usuarioNormalService Para usar los metodos propios de UsuarioNormal
   */
  constructor(private usuarioNormalService: UsuarioNormalService) {}

  /**
   * Recupera la unidad del Usuario
   */
  ngOnInit() {
    this.usuarioNormalService.getUnidad(this.usuarioNormal.idUsuario).subscribe((response) => 
      this.usuarioNormal.unidad = this.usuarioNormalService.mapearUnidad(response));
  }
}