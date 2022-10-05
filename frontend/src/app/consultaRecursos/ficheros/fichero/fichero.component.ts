import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faDownload,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FicheroImpl } from "src/app/recursos/models/fichero-impl";
import { RecursoService } from "src/app/recursos/service/recurso.service";
import { AppConfigService } from "src/app/services/app-config.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-fichero",
  templateUrl: "./fichero.component.html",
  styleUrls: [],
})
export class FicheroComponent implements OnInit {
  /**
   * variable que trae el fichero del otro componente
   */
  @Input() fichero: FicheroImpl;
  /**
   * variable que emite un evento al otro componente para eliminar el fichero
   */
  @Output() ficheroEliminar = new EventEmitter<FicheroImpl>();
  /**
   * variable que emite un evento al otro componente para eliminar el fichero
   */
  @Output() ficheroSeleccionado = new EventEmitter<FicheroImpl>();
  /**
   * variable para construir la url de descarga del archivo del fichero
   */
  pathRelativo: string = "";
  /**
   * variable del icono "eliminar"
   */
  faTrashAlt = faTrashAlt;
  /**
   * variable del icono "editar"
   */
  faEdit = faEdit;
  /**
   * variable del icono "descargar"
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
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private recursoService: RecursoService,
    private appConfigService: AppConfigService
  ) {}

  /**
   * - asigna al campo recurso del fichero el valor del recurso
   * - le asigna al campo categoria fichero del fichero la categoria de fichero del mismo
   * - construye el path relativo para la url de descarga del archivo
   */
  ngOnInit() {
    this.recursoService
      .getRecursoDeFichero(this.fichero.idFichero)
      .subscribe(
        (response) =>
          (this.fichero.recurso = this.recursoService.mapearRecurso(response))
      );
    this.recursoService
      .getCategoriaFichero(this.fichero.idFichero)
      .subscribe(
        (response) =>
          (this.fichero.categoriaFichero =
            this.recursoService.mapearCategoriaFichero(response))
      );
    setTimeout(() => {
      if (this.fichero.recurso) {
        this.pathRelativo = this.appConfigService.hostSicenad
          ? `${this.appConfigService.hostSicenad}files/docRecursos/${this.fichero.recurso.idRecurso}/`
          : `${environment.hostSicenad}files/docRecursos/${this.fichero.recurso.idRecurso}/`;
      }
    }, 3000);
    this.nombreMostrado = this.recortarTexto(this.fichero.nombre, 45);
    this.descripcionMostrada = this.recortarTexto(this.fichero.descripcion, 50);
  }

  /**
   * metodo que emite el evento para eliminar el fichero (y elimina el archivo)
   * @param fichero Fichero a eliminar
   */
  eliminar(fichero: FicheroImpl): void {
    this.recursoService
      .deleteArchivo(this.fichero.nombreArchivo, this.fichero.recurso.idRecurso)
      .subscribe();
    this.ficheroEliminar.emit(fichero);
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
   * metodo para recortar el texto a mostrar
   * @param texto Texto a recortar
   * @param numeroCaracteres Numero de caracteres que tendra el texto resultante
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
