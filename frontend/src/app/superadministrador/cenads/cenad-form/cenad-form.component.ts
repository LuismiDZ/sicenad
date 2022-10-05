import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { AppConfigService } from "src/app/services/app-config.service";
import { UsuarioAdministrador } from "src/app/usuarios/models/usuarioAdministrador";
import { UsuarioAdministradorService } from "src/app/usuarios/service/usuarioAdministrador.service";
import { environment } from "src/environments/environment";
import { CenadImpl } from "../../models/cenad-impl";
import { CenadService } from "../../service/cenad.service";

@Component({
  selector: "app-cenad-form",
  templateUrl: "./cenad-form.component.html",
  styleUrls: []
})
export class CenadFormComponent implements OnInit {
  /**
   * variable en la que grabaremos el Cenad creado
   */
  cenad: CenadImpl = new CenadImpl();
  /**
   * variable donde recuperamos todos los administradores
   */
  administradores: UsuarioAdministrador[] = [];
  /**
   * variable del icono "volver"
   */
  faVolver = faArrowAltCircleLeft;
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
   * @param cenadService Para usar los metodos propios de Cenad
   * @param router Para redirigir
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private cenadService: CenadService,
    private router: Router,
    private appConfigService: AppConfigService
  ) { }

  /**
   * rescata del local storage todos los administradores y coge la variable del `properties`
   */
  ngOnInit(): void {
    this.administradores = JSON.parse(localStorage.usuariosAdministrador);
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo
      ? this.appConfigService.sizeMaxEscudo
      : environment.sizeMaxEscudo;
  }

  /**
   * Metodo para crear un Cenad
   * - sube el archivo, le asigna el nombre al campo escudo y crea el cenad
   * - compruebo que el archivo se sube antes de crear el cenad
   * - actualiza el local storage
   */
  crearCenad(): void {
    this.upload();
    this.cenad.escudo = this.currentFile.name;
    if (this.archivoSubido) {
      this.cenadService.create(this.cenad).subscribe((response) => {
        this.cenadService.getCenads().subscribe((response) => {
          localStorage.cenads = JSON.stringify(
            this.cenadService.extraerCenads(response)
          );
          console.log(`He creado el CENAD/CMT ${this.cenad.nombre}`);
          this.router.navigate(["/superadministrador"]);
        });
      });
    }
  }
  /**
   * metodo para seleccionar el archivo a subir
   */
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * metodo para subir los archivos
   * - si supera el tamaño archivoSubido sera false, y no se creara el cenad (son bytes)
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
}
