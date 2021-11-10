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
  styleUrls: ['./fichero-solicitud-ficha.component.css']
})
export class FicheroSolicitudFichaComponent implements OnInit {
  //variable que trae del otro componente el fichero
  @Input() fichero: FicheroImpl;
  //variable que trae del otro componente el id de la solicitud del recurso
  @Input() idSolicitud: string;
  //variable para emitir los eventos al otro componente para editar un fichero
  @Output() ficheroEditar = new EventEmitter<FicheroImpl>();
  //variables para la subida de archivos de escudos
  selectedFiles: FileList;
  currentFile: File;
  sizeMaxDocSolicitud: number = environment.sizeMaxDocSolicitud;
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  //variables para poder mostrar el valor inicial de los campos select
  solicitudCenadSeleccionado: string;
  solicitudUnidadSeleccionado: string;
  categoriaFicheroSeleccionada: string;
  //variable para recoger las categorias de ficheros
  categoriasFichero: CategoriaFichero[] = [];
  //variable para recoger los recursos
  solicitudesCenad: SolicitudRecurso[] = [];
  solicitudesUnidad: SolicitudRecurso[] = [];
  archivoSubido: boolean = false;
  //si un Usuario es Normal
  isUsuarioNormal: boolean = false;
  // si un usuario es Gestor
  isGestor: boolean = false;
  //id del Cenad
  idCenad: string = "";
  //si un usuario se ha loggeado
  isAutenticado: boolean = false;

  constructor(private recursoService: RecursoService, private appConfigService: AppConfigService, private solicitudService: SolicitudRecursoService) { }

  ngOnInit(): void {
    this.idCenad = sessionStorage.idCenad;
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

  //método que comprueba el rol del usuario logeado en el sistema
  comprobarUser(): void {
    this.isAutenticado = sessionStorage.isLogged;
    if (this.isAutenticado) {
    } if (sessionStorage.isGestor == "true" && this.idCenad == sessionStorage.idCenad) {
      this.isGestor = true;
    } else if (sessionStorage.isNormal == "true") {
      this.isUsuarioNormal = true;
    }
  }

  //metodo para poder mostrar en los select los valores seleccionados
  actualizarNgModels(): void {
    this.categoriaFicheroSeleccionada = this.fichero.categoriaFichero.url;
    if (this.isGestor) {
      this.solicitudCenadSeleccionado = this.fichero.solicitudRecursoCenad.url;
    }

    if (this.isUsuarioNormal) {
      this.solicitudUnidadSeleccionado = this.fichero.solicitudRecursoUnidad.url;
    }

  }

  //metodo que emite el evento para editar el fichero y elimina el archivo anterior del fichero y carga el nuevo si es necesario
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

  //metodo para seleccionar el archivo a subir
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  //metodo para subir el archivo 
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

  //metodo para borrar el archivo del fichero
  delete_Archivo(fichero: FicheroImpl) {
    this.recursoService.deleteArchivoSolicitud(fichero.nombreArchivo, this.idSolicitud).subscribe(
    );
  }
}