import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faDownload, faEdit } from "@fortawesome/free-solid-svg-icons";
import { AppConfigService } from "src/app/services/app-config.service";
import { environment } from "src/environments/environment";
import { Cartografia } from "../models/cartografia";
import { CartografiaService } from "../service/cartografia.service";

@Component({
  selector: "app-cartografia",
  templateUrl: "./cartografia.component.html",
  styleUrls: [],
})
export class CartografiaComponent implements OnInit {
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que trae los datos correspondientes a la cartografia del otro componente
   */
  @Input() cartografia: Cartografia;
  /**
   * variable que comunica al otro componente el evento para ver sus datos y editarlos
   */
  @Output() cartografiaSeleccionada = new EventEmitter<Cartografia>();
  /**
   * variable para construir la url de descarga del archivo del fichero
   */
  pathRelativo: string = `${environment.hostSicenad}files/cartografias/${this.idCenad}/`;
  /**
   * variable para icono "editar"
   */
  faEdit = faEdit;
  /**
   * variable para icono "descargar"
   */
  faDownload = faDownload;
  /**
   * variable del texto a mostrar para recortarlo (nombre)
   */
  nombreMostrado: string = "";
  /**
   * variable del texto a mostrar para recortarlo (descripcion)
   */
  descripcionMostrada: string = "";
  /**
   * variable boolean que dice si eres administrador de ese CENAD y por tanto puedes editarla
   */
  isAdminCenad: boolean = true;

  /**
   *
   * @param cartografiaService Para usar los metodos propios de `Cartografia`
   * @param activateRoute Para capturar el id de la barra de navegación
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private cartografiaService: CartografiaService,
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService
  ) {}

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - comprueba si estas loggeado como administrador de este cenad
   * - recorta los textos 'nombre' y 'descripcion' para mostrar solo una linea
   */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params["idCenad"];
    this.isAdminCenad =
      this.idCenad === sessionStorage.idCenad &&
      sessionStorage.isAdmin === "true";
    this.pathRelativo = this.appConfigService.hostSicenad
      ? `${this.appConfigService.hostSicenad}files/cartografias/${this.idCenad}/`
      : `${environment.hostSicenad}files/cartografias/${this.idCenad}/`;
    this.nombreMostrado = this.recortarTexto(this.cartografia.nombre, 45);
    this.descripcionMostrada = this.recortarTexto(
      this.cartografia.descripcion,
      50
    );
  }

  /**
   * metodo que construye la url de descarga del archivo
   * @param nombreArchivo Nombre del archivo
   * @returns Devuelve la ruta del archivo
   */
  pathArchivo(nombreArchivo: string): string {
    const pathImg: string = `${this.pathRelativo}${nombreArchivo}`;
    return pathImg;
  }

  /**
   * metodo que recorta el texto a mostrar
   * @param texto texto a acortar
   * @param numeroCaracteres numero de caracteres que tendra el texto resultante
   * @returns Devuelve el texto recortado
   */
  recortarTexto(texto: string, numeroCaracteres: number): string {
    let textoFinal: string = "";
    textoFinal =
      texto.length > numeroCaracteres
        ? texto.slice(0, numeroCaracteres)
        : texto;
    return textoFinal;
  }
}
