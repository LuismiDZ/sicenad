import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { Cartografia } from '../models/cartografia';
import { CartografiaImpl } from '../models/cartografia-impl';
import { CartografiaService } from '../service/cartografia.service';

@Component({
  selector: 'app-cartografia-form',
  templateUrl: './cartografia-form.component.html',
  styleUrls: []
})
export class CartografiaFormComponent implements OnInit {
  /**
   * variable que recogera el host del properties.json
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable con la que guardar la nueva cartografia
   */
  cartografia: Cartografia = new CartografiaImpl();
  /**
   * variable para icono "volver"
   */
  faVolver =faArrowAltCircleLeft;
  /**
   * variable que crea la ruta de las cartografias
   */
  pathRelativo: string = `${this.hostSicenad}files/cartografias/${this.idCenad}/`;
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
   **/

  categoriaFichero: string;


  /**
   * variable para dar al gestor la opcion de elegir que categoria de fichero asignar a cada fichero
   */
   categoriasFichero: CategoriaFichero[] = [];


  /**
   *
   * @param cartografiaService Para usar los metodos propios de Cartografias
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegación
   * @param appConfigService Para usar las variables del `properties`
   * @param categoriasFichero Para el desplegable de categoría Fichero
   */
  constructor(
    private cartografiaService: CartografiaService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService) {
    this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
    this.sizeMaxCartografia = appConfigService.sizeMaxCartografia ? appConfigService.sizeMaxCartografia : environment.sizeMaxCartografia;
    //this.categoriaFicheroCartografia = appConfigService.categoriaFicheroCartografia ? appConfigService.categoriaFicheroCartografia : environment.categoriaFicheroCartografia;
    this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
    }
    /**
     * - recuperamos el id del CENAD de la barra de navegacion
     * - recuperamos del properties.json, si existe, el host
     * - asigna el path relativo, que junto con el nombreArchivo del fichero formara la url en la que se encuentra el archivo
     * - asignamos el CENAD y la categoria de fichero a la cartografia que creamos
     */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.hostSicenad = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
    this.pathRelativo = `${this.hostSicenad}files/cartografias/${this.idCenad}/`;
    this.cartografia.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
  }

  /**
   * metodo para crear una nueva cartografia y volver al listado de cartografias de ese cenad
   * - sube el archivo, le asigna el nombre al campo escudo y crea el cenad
   * - compruebo que el archivo se sube antes de crear el cenad
   * - actualizamos el localStorage
   */
  crearCartografia(): void {
    this.upload();
    this.cartografia.nombreArchivo = this.currentFile.name;
    if(this.archivoSubido) {
      this.cartografiaService.create(this.cartografia).subscribe((response) => {
        this.cartografiaService.getCartografiasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`cartografias_${this.idCenad}`, JSON.stringify(this.cartografiaService.extraerCartografias(response)));
          console.log(`He creado la cartografia ${this.cartografia.nombre}`);
          this.router.navigate([`/principalCenad/${this.idCenad}/cartografias/${this.idCenad}`]);
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
   * si supera el tamaño archivoSubido sera false, y no se creara el cenad
   *
   * debo pasarlo a bytes y son gigas
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    this.archivoSubido = (this.currentFile.size > this.sizeMaxCartografia * 1024 * 1024 * 1024) ? false : true;
    this.cartografiaService.upload(this.currentFile, this.idCenad).subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para construir la url del archivo a mostrar o descargar
   * @param nombreArchivo Nombre del archivo
   * @returns Devuelve la ruta del archivo
   */
  pathArchivo(nombreArchivo: string): string {
    const pathImg: string = `${this.pathRelativo}${nombreArchivo}`;
    return pathImg;
  }
}
