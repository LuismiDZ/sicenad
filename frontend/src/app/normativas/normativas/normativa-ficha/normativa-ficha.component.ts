import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { NormativaService } from '../../service/normativa.service';

@Component({
  selector: 'app-normativa-ficha',
  templateUrl: './normativa-ficha.component.html',
  styleUrls: []
})
export class NormativaFichaComponent implements OnInit {
  /**
   * variable que recogera el host del properties.json
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable que me comunica del otro componente la normativa a ver/editar
   */
  @Input() normativa: FicheroImpl;
  /**
   * variable que comunica al otro componente el evento para eliminar la normativa
   */
  @Output() normativaEliminar = new EventEmitter<FicheroImpl>();
  /**
   * variable que comunica al otro componente el evento para eliminar la normativa
   */
  @Output() normativaEditar = new EventEmitter<FicheroImpl>();
  /**
   * variables para la subida de archivos
   */
  /**
    * variable para la seleccion del archivo
    */
  selectedFiles: FileList;
  /**
   * variable que contiene el archivo seleccionado
   */
  currentFile: File;
  /**
   * variable que define el tamaño maximo del archivo
   */
  sizeMaxDocRecurso: number = environment.sizeMaxDocRecurso;
  /**
   * variable booleana que define si el archivo se ha subido o no
   */
  archivoSubido: boolean = false;
  /**
   * variable que guarda la categoria de fichero de cartografia. Como es indiferente uso esta
   */
  categoriaFicheroCartografia: string = environment.categoriaFicheroCartografia;


  /**
   * 
   * @param normativaService Para usar los metodos propios de Normativa
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(private activateRoute: ActivatedRoute, private normativaService: NormativaService,
    private appConfigService: AppConfigService) {
    this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
    this.sizeMaxDocRecurso = appConfigService.sizeMaxDocRecurso ? appConfigService.sizeMaxDocRecurso : environment.sizeMaxDocRecurso;
    this.categoriaFicheroCartografia = appConfigService.categoriaFicheroCartografia ? appConfigService.categoriaFicheroCartografia : environment.categoriaFicheroCartografia;
  }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - recuperamos del properties.json, si existe, el host
   * - asigna el path relativo, que junto con el nombreArchivo del fichero formara la url en la que se encuentra el archivo
   * - asignamos el CENAD y la categoria de fichero a la normativa que creamos
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.hostSicenad = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
    this.normativa.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
    this.normativa.categoriaFichero = `${this.hostSicenad}categoriasFichero/${this.categoriaFicheroCartografia}`;
  }

  /**
   * metodo que emite el evento al otro componente para eliminar la normativa
   */
  eliminar(): void {
    this.normativaEliminar.emit(this.normativa);
  }

  /**
   * metodo que emite el evento al otro componente para editar la normativa
   * - si cambiamos el archivo, borra el anterior y sube el actual
   */
  editar(): void {
    if (this.selectedFiles) {
      this.upload();
      if (this.archivoSubido) {
        this.delete_Archivo(this.normativa);
        this.normativa.nombreArchivo = this.currentFile.name;
        this.normativaEditar.emit(this.normativa);
      }
    } else {
      this.normativaEditar.emit(this.normativa);
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
   * - si supera el tamaño archivoSubido sera false, y no se creara el cenad
   */  
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    this.archivoSubido = (this.currentFile.size > this.sizeMaxDocRecurso * 1024 * 1024) ? false : true;//son MB
    this.normativaService.upload(this.currentFile, this.idCenad).subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para borrar el archivo del fichero
   * @param normativa Archivo a borrar
   */
  delete_Archivo(normativa: FicheroImpl) {
    this.normativaService.deleteArchivo(normativa.nombreArchivo, this.idCenad).subscribe();
  }
}