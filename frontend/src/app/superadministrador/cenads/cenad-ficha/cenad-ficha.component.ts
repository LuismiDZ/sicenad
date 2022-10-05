import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Recurso } from "src/app/recursos/models/recurso";
import { AppConfigService } from "src/app/services/app-config.service";
import { SolicitudRecurso } from "src/app/solicitudes-recursos/models/solicitud-recurso";
import { UsuarioAdministradorService } from "src/app/usuarios/service/usuarioAdministrador.service";
import { environment } from "src/environments/environment";
import { CenadImpl } from "../../models/cenad-impl";
import { CenadService } from "../../service/cenad.service";

@Component({
  selector: "app-cenad-ficha",
  templateUrl: "./cenad-ficha.component.html",
  styleUrls: []
})
export class CenadFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el cenad
   */
  @Input() cenad: CenadImpl;
  /**
   * variable para emitir el evento al otro componente para eliminar un cenad
   */
  @Output() cenadEliminar = new EventEmitter<CenadImpl>();
  /**
   * variable para emitir el evento al otro componente para editar un cenad
   */
  @Output() cenadEditar = new EventEmitter<CenadImpl>();
  /**
   * variable que guarda el nombre del administrador
   */
  administrador: string;
  /**
   * variable de seleccion del archivo
   */
  selectedFiles: FileList;
  /**
   * variable del archivo seleccionado
   */
  currentFile: File;
  /**
   * variable booleana que indica si el archivo se ha subido o no
   */
  archivoSubido: boolean = false;
  /**
   * variable que marca el tamaño maximo de la imagen a subir
   */
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  /**
   * variable con todos los recursos del cenad
   */
  recursos: Recurso[] = [];
  /**
   * variable con todas las solicitudes del cenad
   */
  solicitudes: SolicitudRecurso[] = [];
  /**
   * variable con todas las provincias
   */
  provincias = [
    { idProvincia: 15, nombre: "A CORUÑA" },
    { idProvincia: 1, nombre: "ALAVA" },
    { idProvincia: 2, nombre: "ALBACETE" },
    { idProvincia: 3, nombre: "ALICANTE" },
    { idProvincia: 4, nombre: "ALMERIA" },
    { idProvincia: 33, nombre: "ASTURIAS" },
    { idProvincia: 5, nombre: "AVILA" },
    { idProvincia: 6, nombre: "BADAJOZ" },
    { idProvincia: 8, nombre: "BARCELONA" },
    { idProvincia: 9, nombre: "BURGOS" },
    { idProvincia: 10, nombre: "CACERES" },
    { idProvincia: 11, nombre: "CADIZ" },
    { idProvincia: 39, nombre: "CANTABRIA" },
    { idProvincia: 12, nombre: "CASTELLON" },
    { idProvincia: 51, nombre: "CEUTA" },
    { idProvincia: 13, nombre: "CIUDAD REAL" },
    { idProvincia: 14, nombre: "CORDOBA" },
    { idProvincia: 16, nombre: "CUENCA" },
    { idProvincia: 17, nombre: "GERONA" },
    { idProvincia: 18, nombre: "GRANADA" },
    { idProvincia: 19, nombre: "GUADALAJARA" },
    { idProvincia: 20, nombre: "GUIPUZCOA" },
    { idProvincia: 21, nombre: "HUELVA" },
    { idProvincia: 22, nombre: "HUESCA" },
    { idProvincia: 7, nombre: "ISLAS BALEARES" },
    { idProvincia: 23, nombre: "JAEN" },
    { idProvincia: 26, nombre: "LA RIOJA" },
    { idProvincia: 24, nombre: "LEON" },
    { idProvincia: 25, nombre: "LERIDA" },
    { idProvincia: 27, nombre: "LUGO" },
    { idProvincia: 28, nombre: "MADRID" },
    { idProvincia: 29, nombre: "MALAGA" },
    { idProvincia: 52, nombre: "MELILLA" },
    { idProvincia: 30, nombre: "MURCIA" },
    { idProvincia: 31, nombre: "NAVARRA" },
    { idProvincia: 32, nombre: "OURENSE" },
    { idProvincia: 34, nombre: "PALENCIA" },
    { idProvincia: 35, nombre: "LAS PALMAS" },
    { idProvincia: 36, nombre: "PONTEVEDRA" },
    { idProvincia: 37, nombre: "SALAMANCA" },
    { idProvincia: 40, nombre: "SEGOVIA" },
    { idProvincia: 41, nombre: "SEVILLA" },
    { idProvincia: 42, nombre: "SORIA" },
    { idProvincia: 38, nombre: "STA CRUZ TENERIFE" },
    { idProvincia: 43, nombre: "TARRAGONA" },
    { idProvincia: 44, nombre: "TERUEL" },
    { idProvincia: 45, nombre: "TOLEDO" },
    { idProvincia: 46, nombre: "VALENCIA" },
    { idProvincia: 47, nombre: "VALLADOLID" },
    { idProvincia: 48, nombre: "VIZCAYA" },
    { idProvincia: 49, nombre: "ZAMORA" },
    { idProvincia: 50, nombre: "ZARAGOZA" },
  ];

  /**
   *
   * @param usuarioAdministradorService Para usar los metodos propios de UsuarioAdministrador
   * @param cenadService Para usar los metodos propios de Cenad
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private usuarioAdministradorService: UsuarioAdministradorService,
    private cenadService: CenadService,
    private appConfigService: AppConfigService
  ) { }

  /**
   * Actualiza el administrador y carga las variables del `properties`
   *
   * Recupera los recursos y las solicitudes del Cenad
   */
  ngOnInit(): void {
    this.actualizarAdministrador();
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo
      ? this.appConfigService.sizeMaxEscudo
      : environment.sizeMaxEscudo;
    this.cenadService
      .getRecursosDeCenad(this.cenad.idCenad)
      .subscribe(
        (response) =>
          (this.recursos = this.cenadService.extraerRecursos(response))
      );
    this.cenadService
      .getSolicitudesDeCenad(this.cenad.idCenad)
      .subscribe(
        (response) =>
          (this.solicitudes = this.cenadService.extraerSolicitudes(response))
      );
  }

  /**
   * metodo que rescata el nombre del administrador del cenad
   */
  actualizarAdministrador(): void {
    this.usuarioAdministradorService
      .getUsuarioAdministrador(this.cenad)
      .subscribe(
        (response) =>
        (this.administrador =
          this.usuarioAdministradorService.mapearUsuario(response).nombre)
      );
  }

  /**
   * metodo que emite el evento para eliminar el cenad y elimina el archivo del escudo, y las carpetas de los archivos de las cartografias, recursos y solicitudes del cenad
   */
  eliminar(): void {
    this.delete_Archivo(this.cenad);
    this.deleteCarpetaCartografias(this.cenad);
    this.deleteInfoCenad(this.cenad);
    this.deleteCarpetaRecursos();
    this.deleteCarpetaSolicitudes();
    this.cenadEliminar.emit(this.cenad);
  }

  /**
   * metodo que emite el evento para editar el cenad y elimina el archivo anterior del escudo y carga el nuevo si es necesario
   */
  editar(): void {
    if (this.selectedFiles) {
      this.upload();
      if (this.archivoSubido) {
        this.delete_Archivo(this.cenad);
        this.cenad.escudo = this.currentFile.name;
        this.cenadEditar.emit(this.cenad);
      }
    } else {
      this.cenadEditar.emit(this.cenad);
    }
  }

  /**
   * metodo para seleccionar el archivo a subir
   */
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * metodo para subir el archivo de escudo
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    if (this.currentFile.type.includes("image")) {
      this.archivoSubido =
        this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024 ? false : true; //debo pasarlo a bytes
      this.cenadService.upload(this.currentFile).subscribe();
    } else {
      alert("El archivo seleccionado debe ser una imagen");
    }
    this.selectedFiles = undefined;
  }

  /**
   * metodo para borrar el archivo de escudo del cenad
   * @paramcenad Cenad
   */
  delete_Archivo(cenad: CenadImpl) {
    this.cenadService.deleteArchivo(cenad.escudo).subscribe();
  }

  /**
   * metodo para borrar la carpeta con los archivos de cartografias del cenad
   * @param cenad Cenad
   */
  deleteCarpetaCartografias(cenad: CenadImpl) {
    this.cenadService.deleteCartografias(cenad.idCenad).subscribe();
  }

  /**
   * metodo para borrar la carpeta de infoCenad del cenad
   * @param cenad Cenad
   */
  deleteInfoCenad(cenad: CenadImpl) {
    this.cenadService.deleteInfoCenad(cenad.idCenad).subscribe();
  }

  /**
   * metodo para borrar las carpetas de archivos de los recursos del cenad
   */
  deleteCarpetaRecursos() {
    this.recursos.forEach((r) => {
      this.cenadService.deleteCarpetaRecurso(r.idRecurso).subscribe();
    });
  }

  /**
   * metodo para borrar las carpetas de archivos de las solicitudes del cenad
   */
  deleteCarpetaSolicitudes() {
    this.solicitudes.forEach((s) => {
      this.cenadService.deleteCarpetaSolicitud(s.idSolicitud).subscribe();
    });
  }
}
