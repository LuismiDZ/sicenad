import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TipoFormulario } from 'src/app/tiposFormulario/models/tipoFormulario';
import { environment } from 'src/environments/environment';
import { CartografiaImpl } from '../../models/cartografia-impl';
import { CartografiaService } from '../../service/cartografia.service';


@Component({
  selector: 'app-cartografia-ficha',
  templateUrl: './cartografia-ficha.component.html',
  styleUrls: []
})
export class CartografiaFichaComponent implements OnInit {
 /**
  * variable que recogera el host del properties.json
  */
 hostSicenad: string = environment.hostSicenad;
 /**
  * variable para recuperar el id del CENAD/CMT
  */
 idCenad: string = "";
  /**
   * variable que me comunica del otro componente la cartografia a ver/editar
   */
  @Input() cartografia: CartografiaImpl;
  /**
   * variable que comunica al otro componente el evento para eliminar la cartografia
   */
  @Output() cartografiaEliminar = new EventEmitter<CartografiaImpl>();
  /**
   * variable que comunica al otro componente el evento para editar la cartografia
   */
  @Output() cartografiaEditar = new EventEmitter<CartografiaImpl>();
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
   * variable que marca el tamaño maximo de la cartografia a subir
   */
  sizeMaxCartografia: number = environment.sizeMaxCartografia;
 /**
  * variable que guarda la categoria de fichero de cartografia
  */
  //categoriaFicheroCartografia: string = environment.categoriaFicheroCartografia;
  categoriaFichero: string;

    /**
   * variable para dar al gestor la opcion de elegir que categoria de fichero asignar a cada fichero
   */
     categoriasFichero: CategoriaFichero[] = [];

  /**
   *
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param cartografiaService Para usar los metodos propios de Cartografias
   * @param appConfigService Para usar las variables del `properties`
   * @param categoriasFichero Para el desplegable de categoría Fichero
   */
  constructor(private activateRoute: ActivatedRoute,
              private cartografiaService: CartografiaService,
              private appConfigService: AppConfigService) {
              this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
              this.sizeMaxCartografia = appConfigService.sizeMaxCartografia ? appConfigService.sizeMaxCartografia : environment.sizeMaxCartografia;
              //this.categoriaFicheroCartografia = appConfigService.categoriaFicheroCartografia ? appConfigService.categoriaFicheroCartografia : environment.categoriaFicheroCartografia;
              this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
  }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - recuperamos del properties.json, si existe, el host
   * - asignamos el CENAD a la categoria que creamos
   */
  ngOnInit(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.hostSicenad = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
    this.cartografia.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
    //this.cartografia.categoriaFichero = `${this.hostSicenad}categoriasFichero/${this.categoriaFicheroCartografia}`;    
    this.categoriaFichero = this.cartografia.categoriaFichero; //No recupera este valor
    console.log ("Categoria fichero: " + this.categoriaFichero);
  }

  /**
   * metodo que emite el evento al otro componente para eliminar la cartografia
   */
  eliminar(): void {
    this.cartografiaEliminar.emit(this.cartografia);
  }

  /**
   * metodo que emite el evento al otro componente para editar la cartografia
   */
  editar(): void {
    if (this.selectedFiles) {
      this.upload();
      if(this.archivoSubido) {
        this.delete_Archivo(this.cartografia);
        this.cartografia.nombreArchivo = this.currentFile.name;
        this.cartografiaEditar.emit(this.cartografia);
      }
    } else {
      this.cartografiaEditar.emit(this.cartografia);
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
   *
   * compruebo si es imagen para aplicarle el tamaño maximo de imagen o el de docRecurso
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    this.archivoSubido = (this.currentFile.size > this.sizeMaxCartografia * 1024 * 1024 * 1024) ? false : true;
    this.cartografiaService.upload(this.currentFile, this.idCenad).subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para borrar el archivo del fichero
   * @param cartografia Cartografia a borrar
   */
  delete_Archivo(cartografia: CartografiaImpl) {
    this.cartografiaService.deleteArchivo(cartografia.nombreArchivo, this.idCenad).subscribe();
  }
}
