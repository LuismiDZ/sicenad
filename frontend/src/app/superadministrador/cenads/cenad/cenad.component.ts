import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsuarioAdministrador } from 'src/app/usuarios/models/usuarioAdministrador';
import { UsuarioAdministradorService } from 'src/app/usuarios/service/usuarioAdministrador.service';
import { Cenad } from '../../models/cenad';
import { CenadService } from '../../service/cenad.service';

@Component({
  selector: 'app-cenad',
  templateUrl: './cenad.component.html',
  styleUrls: []
})
export class CenadComponent implements OnInit {
  /**
   * variable que trae del otro componente el cenad
   */
  @Input() cenad: Cenad;
  /**
   * variable que emite el cenad al otro componente
   */
  @Output() cenadSeleccionado = new EventEmitter<Cenad>();
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;
  /**
   * variable para capturar el nombre de la provincia
   */
  provincia: string;
  /**
   * variable para capturar el administrador de ese cenad
   */
  usuarioAdministrador: UsuarioAdministrador;
  /**
   * variable con todas las provincias
   */
  provincias = [{idProvincia:15, nombre:"A CORUÑA"}, {idProvincia:1, nombre:"ALAVA"}, {idProvincia:2, nombre:"ALBACETE"},
  {idProvincia:3, nombre:"ALICANTE"}, {idProvincia:4, nombre:"ALMERIA"}, {idProvincia:33, nombre:"ASTURIAS"},
  {idProvincia:5, nombre:"AVILA"}, {idProvincia:6, nombre:"BADAJOZ"}, {idProvincia:8, nombre:"BARCELONA"},
  {idProvincia:9, nombre:"BURGOS"}, {idProvincia:10, nombre:"CACERES"}, {idProvincia:11, nombre:"CADIZ"},
  {idProvincia:39, nombre:"CANTABRIA"}, {idProvincia:12, nombre:"CASTELLON"}, {idProvincia:51, nombre:"CEUTA"},
  {idProvincia:13, nombre:"CIUDAD REAL"}, {idProvincia:14, nombre:"CORDOBA"}, {idProvincia:16, nombre:"CUENCA"},
  {idProvincia:17, nombre:"GERONA"}, {idProvincia:18, nombre:"GRANADA"}, {idProvincia:19, nombre:"GUADALAJARA"},
  {idProvincia:20, nombre:"GUIPUZCOA"}, {idProvincia:21, nombre:"HUELVA"}, {idProvincia:22, nombre:"HUESCA"},
  {idProvincia:7, nombre:"ISLAS BALEARES"}, {idProvincia:23, nombre:"JAEN"}, {idProvincia:26, nombre:"LA RIOJA"},
  {idProvincia:24, nombre:"LEON"}, {idProvincia:25, nombre:"LERIDA"}, {idProvincia:27, nombre:"LUGO"},
  {idProvincia:28, nombre:"MADRID"}, {idProvincia:29, nombre:"MALAGA"}, {idProvincia:52, nombre:"MELILLA"},
  {idProvincia:30, nombre:"MURCIA"}, {idProvincia:31, nombre:"NAVARRA"}, {idProvincia:32, nombre:"OURENSE"},
  {idProvincia:34, nombre:"PALENCIA"}, {idProvincia:35, nombre:"LAS PALMAS"}, {idProvincia:36, nombre:"PONTEVEDRA"},
  {idProvincia:37, nombre:"SALAMANCA"}, {idProvincia:40, nombre:"SEGOVIA"}, {idProvincia:41, nombre:"SEVILLA"},
  {idProvincia:42, nombre:"SORIA"}, {idProvincia:38, nombre:"STA CRUZ TENERIFE"}, {idProvincia:43, nombre:"TARRAGONA"},
  {idProvincia:44, nombre:"TERUEL"}, {idProvincia:45, nombre:"TOLEDO"}, {idProvincia:46, nombre:"VALENCIA"},
  {idProvincia:47, nombre:"VALLADOLID"}, {idProvincia:48, nombre:"VIZCAYA"}, {idProvincia:49, nombre:"ZAMORA"},
  {idProvincia:50, nombre:"ZARAGOZA"}];

  /**
   *
   * @param cenadService Para usar los metodos propios de Cenad
   */
  constructor(private cenadService: CenadService) { }

  /**
   * Consigue la provincia del Cenad y recupera su administrador
   */
  ngOnInit() {
    this.getProvincia(this.cenad);
    this.cenadService.getUsuarioAdministrador(this.cenad).subscribe((response) => this.usuarioAdministrador = this.cenadService.mapearUsuario(response));
  }

  /**
   * metodo que devuelve el nombre de la provincia del cenad
   * @param cenad Cenad
   */
  getProvincia(cenad: Cenad) {
    this.provincias.forEach(p => {
      if (p.idProvincia === cenad.provincia) {
        this.provincia = p.nombre;
      }
    });
  }
}
