import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CategoriaFichero } from "src/app/categoriasFichero/models/categoriaFichero";
import { FicheroImpl } from "src/app/recursos/models/fichero-impl";
import { Recurso } from "src/app/recursos/models/recurso";
import { RecursoService } from "src/app/recursos/service/recurso.service";
import { AppConfigService } from "src/app/services/app-config.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-fichero-ficha",
  templateUrl: "./fichero-ficha.component.html",
  styleUrls: []
})
export class FicheroFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el fichero
   */
  @Input() fichero: FicheroImpl;
  /**
   * variable para emitir los eventos al otro componente para editar un fichero
   */
  @Output() ficheroEditar = new EventEmitter<FicheroImpl>();
  /**
   * variable para dar al gestor la opcion de elegir que categoria de fichero asignar a cada fichero
   */
  categoriasFichero: CategoriaFichero[] = [];  
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
   * variable que marca el tamaño maximo del archivo a subir si no es imagen
   */
  sizeMaxDocRecurso: number = environment.sizeMaxDocRecurso;
  /**
   * variable que marca el tamaño maximo del archivo a subir si  es imagen
   */
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  /**
   * variable para poder mostrar el valor inicial del recurso
   */
  recursoSeleccionado: string;
  /**
   * variable para poder mostrar el valor inicial de la categoria seleccionada
   */
  categoriaFicheroSeleccionada: string;
  /**
   * variable para recoger los recursos
   */
  recursos: Recurso[] = [];

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
   * - recupera de la BD todos los recursos. es para un select hidden, no es importante la velocidad.
   * - recupera del Local Storage todas las categorias de fichero y las guarda en la variable para poder seleccionarlas si se añade un fichero nuevo
   * - asigna los valores seleccionados a los select de los campos del recurso
   * - para que use la variable del properties.json
   */
  ngOnInit(): void {
    this.recursoService
      .getRecursos()
      .subscribe(
        (response) =>
          (this.recursos = this.recursoService.extraerRecursos(response))
      );
    this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
    this.actualizarNgModels();
    this.sizeMaxDocRecurso = this.appConfigService.sizeMaxDocRecurso
      ? this.appConfigService.sizeMaxDocRecurso
      : environment.sizeMaxDocRecurso;
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo
      ? this.appConfigService.sizeMaxEscudo
      : environment.sizeMaxEscudo;
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.categoriaFicheroSeleccionada = this.fichero.categoriaFichero.url;
    this.recursoSeleccionado = this.fichero.recurso.url;
  }

  /**
   * metodo que emite el evento para editar el fichero y elimina el archivo anterior del fichero y carga el nuevo si es necesario
   */
  editar(): void {
    this.fichero.categoriaFichero = this.categoriaFicheroSeleccionada;
    this.fichero.recurso = this.recursoSeleccionado;
    if (this.selectedFiles) {
      this.upload();
      if (this.archivoSubido) {
        this.delete_Archivo(this.fichero);
        this.fichero.nombreArchivo = this.currentFile.name;
        this.ficheroEditar.emit(this.fichero);
      }
    } else {
      this.ficheroEditar.emit(this.fichero);
    }
  }

  /**
   * metodo para seleccionar el archivo a subir
   */
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * metodo para subir el archivo
   * - compruebo si es imagen para aplicarle el tamaño maximo de imagen o el de docRecurso
   * - si supera el tamaño archivoSubido sera false, y no se creara el fichero
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    if (this.currentFile.type.includes("image")) {
      this.archivoSubido =
        this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024 ? false : true; //debo pasarlo a bytes
    } else {
      this.archivoSubido =
        this.currentFile.size > this.sizeMaxDocRecurso * 1024 * 1024
          ? false
          : true;
    }
    this.recursoService
      .upload(this.currentFile, this.getId(this.fichero.recurso))
      .subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para borrar el archivo del fichero
   * @param fichero Fichero a eliminar
   */
  delete_Archivo(fichero: FicheroImpl) {
    this.recursoService
      .deleteArchivo(fichero.nombreArchivo, this.getId(fichero.recurso))
      .subscribe();
  }

  /**
   * metodo que pasandole el endpoint (url), obtiene el id del objeto
   * @param url Texto al que extraer el "id"
   * @returns Devuelve el id
   */
  getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1, url.length);
  }
}
