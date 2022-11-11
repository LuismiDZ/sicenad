import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { Fichero } from 'src/app/recursos/models/fichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { NormativaService } from '../service/normativa.service';

@Component({
  selector: 'app-normativa-form',
  templateUrl: './normativa-form.component.html',
  styleUrls: []
})
export class NormativaFormComponent implements OnInit {
  /**
   * variable que recogera el host del properties.json
   */
  hostSicenad: string = environment.hostSicenad;
  /**
   * variable para recuperar el id del CENAD/CMT
   */
  idCenad: string = "";
  /**
   * variable con la que guardar la nueva normativa
   */
  normativa: Fichero = new FicheroImpl();
  /**
   * variable para icono "volver"
   */
  faVolver = faArrowAltCircleLeft;
  /**
     * variable que define la ruta del archivo
     */
  pathRelativo: string = `${environment.hostSicenad}files/normativas/${this.idCenad}/`;
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
  //categoriaFicheroCartografia: string = environment.categoriaFicheroCartografia;
  categoriaFichero: string;

  /**
   * variable para dar al gestor la opcion de elegir que categoria de fichero asignar a cada fichero
   */
   categoriasFichero: CategoriaFichero[] = [];

   
  
  /**
   * 
   * @param normativaService Para usar los metodos propios de Normativa
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private normativaService: NormativaService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private appConfigService: AppConfigService) {
    this.hostSicenad = appConfigService.hostSicenad ? appConfigService.hostSicenad : environment.hostSicenad;
    this.sizeMaxDocRecurso = appConfigService.sizeMaxDocRecurso ? appConfigService.sizeMaxDocRecurso : environment.sizeMaxDocRecurso;
    //this.categoriaFicheroCartografia = appConfigService.categoriaFicheroCartografia ? appConfigService.categoriaFicheroCartografia : environment.categoriaFicheroCartografia;
    this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
  }

  /**
   * - recuperamos el id del CENAD de la barra de navegacion
   * - recuperamos del properties.json, si existe, el host
   * - asigna el path relativo, que junto con el nombreArchivo del fichero formara la url en la que se encuentra el archivo
   * - asignamos el CENAD y la categoria de fichero a la normativa que creamos
   */
  ngOnInit() {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    this.hostSicenad = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
    this.pathRelativo = `${this.hostSicenad}files/normativas/${this.idCenad}/`;
    this.normativa.cenad = `${this.hostSicenad}cenads/${this.idCenad}`;
    this.normativa.categoriaFichero = `${this.hostSicenad}categoriasFichero/${this.categoriaFichero}`;
  }

  /**
   * - metodo para crear una nueva cartografia y volver al listado de cartografias de ese cenad
   * - sube el archivo, le asigna el nombre al campo escudo y crea el cenad
   * - comprueba que el archivo se sube antes de crear el cenad
   * - actualizamos el localStorage
   */
  crearNormativa(): void {
    this.upload();
    this.normativa.nombreArchivo = this.currentFile.name;
    if (this.archivoSubido) {
      this.normativaService.create(this.normativa).subscribe((response) => {
        this.normativaService.getNormativasDeCenad(this.idCenad).subscribe((response) => {
          localStorage.setItem(`normativas_${this.idCenad}`, JSON.stringify(this.normativaService.extraerNormativas(response)));
          console.log(`He creado la normativa ${this.normativa.nombre}`);
          this.router.navigate([`/principalCenad/${this.idCenad}/normativas/${this.idCenad}`]);
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
   * - si supera el tamaño archivoSubido sera false, y no se creara el cenad
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    this.archivoSubido = (this.currentFile.size > this.sizeMaxDocRecurso * 1024 * 1024) ? false : true;//debo pasarlo a bytes y son MB
    this.normativaService.upload(this.currentFile, this.idCenad).subscribe();
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