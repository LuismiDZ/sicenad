import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { RecursoService } from 'src/app/recursos/service/recurso.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { SolicitudRecurso } from '../../models/solicitud-recurso';
import { SolicitudRecursoService } from '../../service/solicitud-recurso.service';


@Component({
  selector: 'app-fichero-solicitud-ficha',
  templateUrl: './fichero-solicitud-ficha.component.html',
  styleUrls: []
})
export class FicheroSolicitudFichaComponent implements OnInit {
  /**
   * variable que trae del otro componente el fichero
   */
  @Input() fichero: FicheroImpl;
  /**
   * variable que trae del otro componente el id de la solicitud del recurso
   */
  @Input() idSolicitud: string;
  /**
   * variable para emitir los eventos al otro componente para editar un fichero
   */
  @Output() ficheroEditar = new EventEmitter<FicheroImpl>();
  /**
   * variables para la subida de archivos de escudos
   * lista de ficheros seleccionados
   */
  selectedFiles: FileList;
  /**
   * archivo
   */
  currentFile: File;
  /**
   * tamaño maximo de la documentacion de la solicitud
   */
  sizeMaxDocSolicitud: number = environment.sizeMaxDocSolicitud;
  /**
   * tamaño maxido del escudo
   */
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  /**
   * para el endpoint de la solicidud del cenad seleccionada
   */
  solicitudCenadSeleccionado: string;
  /**
   * para el endpoint de la solicitud de la unida seleccionada
   */
  solicitudUnidadSeleccionado: string;
  /**
   * para el endpoint de la categoria del fichero seleccionada
   */
  categoriaFicheroSeleccionada: string;
  /**
   * array de las categorias de ficheros
   */
  categoriasFichero: CategoriaFichero[] = [];
  /**
   * array de solicitudes del Cenad
   */
  solicitudesCenad: SolicitudRecurso[] = [];
  /**
   * array de solicitudes de la unidad
   */
  solicitudesUnidad: SolicitudRecurso[] = [];
  /**
   * si el archivo se ha subido al repositorio
   */
  archivoSubido: boolean = false;
  /**
   * si un Usuario es Normal
   */
  isUsuarioNormal: boolean = false;
  /**
   * si un usuario es Gestor
   */
  isGestor: boolean = false;
  /**
   * id del Cenad
   */
  idCenad: string = "";
  /**
   * si un usuario se ha loggeado
   */
  isAutenticado: boolean = false;

  /**
   * 
   * @param recursoService contiene todos los metodos del objeto Recurso
   * @param appConfigService contiene todos los metodos comunes a la aplicacion
   * @param solicitudService contiene todos los metodos del objeto SolicitudRecurso
   */
  constructor(private recursoService: RecursoService, private appConfigService: AppConfigService, private solicitudService: SolicitudRecursoService) { }

  ngOnInit(): void {
    /**
     * otiene del session storage el id del cenad
     */
    this.idCenad = sessionStorage.idCenad;
    /**
    * método que comprueba el rol del usuario logeado en el sistema
    */
    this.comprobarUser();
    //recupera de la BD todos las solicitudes. es para un select hidden, no es importante la velocidad.
    if (this.isGestor) {
      this.solicitudService.getSolicitudesDeCenad(this.idCenad).subscribe((response) =>
        this.solicitudesCenad = this.solicitudService.extraerSolicitudes(response));
    }
    if (this.isUsuarioNormal) {
      this.solicitudService.getSolicitudesDeCenad(this.idCenad).subscribe((response) =>
        this.solicitudesUnidad = this.solicitudService.extraerSolicitudes(response));
    }
    //recupera del Local Storage todas las categorias de fichero y las guarda en la variable para poder seleccionarlas si se añade un fichero nuevo
    this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
    //asigna los valores seleccionados a los select de los campos del recurso
    this.actualizarNgModels();
    //para que use la variable del properties.json
    this.sizeMaxDocSolicitud = this.appConfigService.sizeMaxDocSolicitud ? this.appConfigService.sizeMaxDocSolicitud : environment.sizeMaxDocSolicitud;
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo ? this.appConfigService.sizeMaxEscudo : environment.sizeMaxEscudo;
  }

  /**
   * método que comprueba el rol del usuario logeado en el sistema
   */
  comprobarUser(): void {
    if (sessionStorage.isLogged == undefined) {
      this.isAutenticado = false;
    } else {
      sessionStorage.isLogged.toString() == "true" ? this.isAutenticado = true : this.isAutenticado = false;
    }
    if (this.isAutenticado) {
    } if (sessionStorage.isGestor == "true" && this.idCenad == sessionStorage.idCenad) {
      this.isGestor = true;
    } else if (sessionStorage.isNormal == "true") {
      this.isUsuarioNormal = true;
    }
  }

  /**
   * metodo para poder mostrar en los select los valores seleccionados
   */
  actualizarNgModels(): void {
    this.categoriaFicheroSeleccionada = this.fichero.categoriaFichero.url;
    if (this.isGestor) {
      this.solicitudCenadSeleccionado = this.fichero.solicitudRecursoCenad.url;
    }

    if (this.isUsuarioNormal) {
      this.solicitudUnidadSeleccionado = this.fichero.solicitudRecursoUnidad.url;
    }
  }

  /**
   * metodo que emite el evento para editar el fichero y elimina el archivo anterior del fichero 
   * y carga el nuevo si es necesario
   */
  editar(): void {
    this.fichero.categoriaFichero = this.categoriaFicheroSeleccionada;
    if (this.isGestor) {
      this.fichero.solicitudRecursoCenad = this.solicitudCenadSeleccionado;
    }
    if (this.isUsuarioNormal) {
      this.fichero.solicitudRecursoUnidad = this.solicitudUnidadSeleccionado;
    }
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
   * @param event de los ficheros seleccionados
   */
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * metodo para subir el archivo
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    //compruebo si es imagen para aplicarle el tamaño maximo de imagen o el de docRecurso
    if (this.currentFile.type.includes("image")) {//si supera el tamaño archivoSubido sera false, y no se creara el fichero
      this.archivoSubido = (this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024) ? false : true;//debo pasarlo a bytes
    } else {
      this.archivoSubido = (this.currentFile.size > this.sizeMaxDocSolicitud * 1024 * 1024) ? false : true;
    }

    this.recursoService.uploadSolicitud(this.currentFile, this.idSolicitud).subscribe(
    );

    this.selectedFiles = undefined;
  }

  /**
   * metodo para borrar el archivo del fichero
   * @param fichero a borrar
   */
  delete_Archivo(fichero: FicheroImpl) {
    this.recursoService.deleteArchivoSolicitud(fichero.nombreArchivo, this.idSolicitud).subscribe(
    );
  }
}