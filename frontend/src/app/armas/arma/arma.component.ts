import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Arma } from '../models/arma';

@Component({
  selector: 'app-arma',
  templateUrl: './arma.component.html',
  styleUrls: []
})
export class ArmaComponent implements OnInit {
  /**
   * Variable que trae del otro componente el arma
   */
  @Input() arma: Arma;
  /**
   * variable que emite al otro componente un evento con el arma seleccionada
   */
  @Output() armaSeleccionada = new EventEmitter<Arma>();
  /**
   * variable para el icono "editar"
   */
  faEdit = faEdit;

  constructor() {}

  ngOnInit() {}
}
