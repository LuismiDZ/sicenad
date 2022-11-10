import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { HeaderComponent } from 'src/app/core/shell/header/header.component';
import { Fichero } from 'src/app/recursos/models/fichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { Recurso } from 'src/app/recursos/models/recurso';
import { RecursoImpl } from 'src/app/recursos/models/recurso-impl';
import { RecursoService } from 'src/app/recursos/service/recurso.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-consultaRecurso-form',
  templateUrl: './consultaRecurso-form.component.html',
  styleUrls: []
})
export class ConsultaRecursoFormComponent implements OnInit {
 /**
   * para controlar el botón cerrar del modal
   */
  @ViewChild ('closebutton_Fichero') closebutton_Fichero;

  /**
   * variable que define el usuario gestor que accede para modificar recursos
   */
  idUsuarioGestor: string = '';
  /**
   * variable que dice si el usuario esta loggeado como gestor de ese recurso
   */
  isGestorRecurso: boolean = false;
  /**
   * variable para cambiar el boton de la vista gestor/previa
   */
  cambioBoton: boolean = false;
  /**
   * variable para ver el rol que se esta usando. se borrara cuando haya logging
   */
  rol: string = 'Previa';
  /**
   * variable para el icono "volver"
   */
  faVolver =faArrowAltCircleLeft;
  /**
   * variable con la que rescatamos de la barra de navegacion el idCenad
   */
  idCenad: string = "";
  /**
   * variable con la que rescatamos de la barra de navegacion el idRecurso
   */
  idRecurso: string = '';
  /**
   * variable sobre la que se carga el recurso
   */
  recurso: Recurso = new RecursoImpl();
  /**
   * variable que da visibilidad al formulario de crear fichero
   */
  nuevoFichero: boolean = false;
  /**
   * variable que comunicara los datos del fichero
   */
  ficheroVerDatos: Fichero;
  /**
   * variable sobre la que crearemos un fichero nuevo
   */
  fichero: FicheroImpl = new FicheroImpl();
  /**
   * variable con todos los ficheros del recurso
   */
  ficheros: Fichero[];
  /**
   * variable para dar al gestor la opcion de elegir que categoria de fichero asignar a cada fichero
   */
  categoriasFichero: CategoriaFichero[] = [];
  /**
   * variable que me filtra las categorias de fichero, y por tanto los apartados, a mostrar en la vista no gestor
   */
  categoriasFicheroDeRecurso: CategoriaFichero[] = [];
  /**
   * variable que crea la ruta de las cartografias
   */
   pathRelativo: string = `${environment.hostSicenad}files/docRecursos/${this.recurso.idRecurso}/`;
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
   * variable que muestra el modal de imagen
   */
  showModal: boolean;
  /**
   * variable que guarda la imagen q lanzara el modal
   */
  imagenModal: Fichero = new FicheroImpl();

  /**
   *
   * @param recursoService Para usar los metodos propios de Recurso
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private recursoService: RecursoService, private router: Router,
    private activateRoute: ActivatedRoute, private appConfigService: AppConfigService) { }

  /**
   * metodo para q el boton cambie de rol. se borrara cuando haya logging
   */
  cambiaRol() {
    this.cambioBoton = this.cambioBoton ? false : true;
    this.rol = this.cambioBoton ? 'Previa' : 'Gestor';
  }

  /**
   * - recupera del Local Storage todas las categorias de fichero y las guarda en la variable para poder seleccionarlas si se añade un fichero nuevo
   * - se recupera el id del recurso de la barra de navegacion
   * - se recuperan de la BD las categorias de fichero de los ficheros del recurso y se asignan a la variable. esto posibilita filtrar que apartados tendra la vista de usuario
   * - carga el recurso cuyo id hemos recuperado
   * - se recupera el id del cenad de la barra de navegacion
   * - se ejecuta con retardo para asegurar que cuando hace la llamada ya tiene el id.
   * - recupero el idUsuario del gestor del recurso
   * - comprobamos si el usuario es un gestor de este recurso
   * - recupera de la BD los ficheros del recurso y los asigna a la variable
   * - recupera de la BD la categoria del recurso y se la asigna al campo de la variable del mismo
   * - asigna el path relativo, que junto con el nombreArchivo del fichero formara la url en la que se encuentra el archivo
   * - para que use el valor del properties.json
   */
  ngOnInit() {
    this.pathRelativo = this.appConfigService.hostSicenad ? `${this.appConfigService.hostSicenad}files/docRecursos/${this.recurso.idRecurso}/` : `${environment.hostSicenad}files/docRecursos/${this.recurso.idRecurso}/`;
    this.categoriasFichero = JSON.parse(localStorage.categoriasFichero);
    this.idRecurso = this.activateRoute.snapshot.params['idRecurso'];
    this.recursoService.getCategoriasFicheroDeRecurso(this.idRecurso).subscribe((response) => {
      if (response._embedded) {//con este condicional elimino el error de consola si no hay ningun fichero
        this.categoriasFicheroDeRecurso = this.recursoService.extraerCategoriasFichero(response);
      }});
    this.cargarRecurso(this.idRecurso);
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
    setTimeout(() => {
      this.recursoService.getUsuarioGestorDeIdRecurso(this.idRecurso).subscribe((response) => {
        this.idUsuarioGestor = this.recursoService.mapearUsuario(response).idUsuario;
        if((sessionStorage.isGestor === 'true') && (sessionStorage.idUsuario === this.idUsuarioGestor)) {
        this.isGestorRecurso = this.cambioBoton = true;
        }
      });
      this.recursoService.getFicheros(this.idRecurso).subscribe((response) =>
        this.ficheros = this.recursoService.extraerFicheros(response));
      this.recursoService.getCategoria(this.idRecurso).subscribe((response) => this.recurso.categoria = this.recursoService.mapearCategoria(response));
      this.pathRelativo = this.appConfigService.hostSicenad ? `${this.appConfigService.hostSicenad}files/docRecursos/${this.recurso.idRecurso}/` : `${environment.hostSicenad}files/docRecursos/${this.recurso.idRecurso}/`;
    }, 1000);
    this.sizeMaxDocRecurso = this.appConfigService.sizeMaxDocRecurso ? this.appConfigService.sizeMaxDocRecurso : environment.sizeMaxDocRecurso;
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo ? this.appConfigService.sizeMaxEscudo : environment.sizeMaxEscudo;
  }

  /**
   * metodo que habilita el formulario para crear fichero
   */
  mostrarNuevoFichero() {
    this.nuevoFichero = true;
  }

  /**
   * metodo para crear un nuevo fichero
   * - sube el archivo
   * - asigna el nombre del mismo al campo del fichero
   * - compruebo que el archivo se sube antes de crear el fichero
   * - crea el fichero propiamente dicho
   * - actualiza el [] con los ficheros del recurso
   * - cierra el formulario de crear fichero y resetea la variable
   */
  crearFichero() {
    this.upload();
    this.fichero.nombreArchivo = this.currentFile.name;
    if(this.archivoSubido) {
      this.recursoService.createFichero(this.fichero).subscribe((response) =>
        console.log(`He creado el fichero ${this.fichero.nombre}`));
      setTimeout(() => {
        this.recursoService.getFicheros(this.idRecurso).subscribe((response) =>
          this.ficheros = this.recursoService.extraerFicheros(response));
      }, 1000);
    }
    this.nuevoFichero = false;
    this.fichero = new FicheroImpl();
    this.fichero.recurso = this.appConfigService.hostSicenad ? `${this.appConfigService.hostSicenad}recursos/${this.recurso.idRecurso}/` : `${environment.hostSicenad}recursos/${this.recurso.idRecurso}`;
  }

  /**
   * metodo para eliminar un fichero
   * @param fichero Fichero a eliminar
   * - actualiza el [ ] con los ficheros del recurso
   */
  onEliminarFichero(fichero: Fichero): void {
    this.recursoService.deleteFichero(fichero).subscribe(response => {
      console.log(`He eliminado el fichero ${fichero.nombre}`);
      this.recursoService.getFicheros(this.idRecurso).subscribe((response) =>
        this.ficheros = this.recursoService.extraerFicheros(response));
    });
  }

  /**
   * metodo para seleccionar el archivo a subir
   */
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  /**
   * metodo para subir un archivo
   * - compruebo si es imagen para aplicarle el tamaño maximo de imagen o el de docRecurso
   * - si supera el tamaño archivoSubido sera false, y no se creara el fichero
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    if(this.currentFile.type.includes("image")) {
      this.archivoSubido = (this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024) ? false : true;//debo pasarlo a bytes
    } else {
      this.archivoSubido = (this.currentFile.size > this.sizeMaxDocRecurso * 1024 * 1024) ? false : true;
    }
    this.recursoService.upload(this.currentFile, this.recurso.idRecurso).subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para construir la url del archivo a mostrar o descargar
   * @param nombreArchivo Nombre del archivo
   */
  pathArchivo(nombreArchivo: string): string {
    const pathImg: string = `${this.pathRelativo}${nombreArchivo}`;
    return pathImg;
  }

  /**
   * metodo para cargar el recurso
   * @param id Id del recurso
   * - asigna al campo recurso del fichero que se vaya a crear el valor de ese recurso
   */
  cargarRecurso(id): void {
    if (id) {
      this.recursoService.getRecurso(id).subscribe((recurso) => {
        this.recurso = this.recursoService.mapearRecurso(recurso);
        this.recursoService.getTipoFormulario(this.recurso).subscribe((response =>
          this.recurso.tipoFormulario = this.recursoService.mapearTipoFormulario(response)));
        this.fichero.recurso = this.recursoService.mapearRecurso(recurso).url;
      });
    }
  }

  /**
   * metodo para modificar el recurso y volver al listado de los recursos de ese cenad
   */
  actualizar(): void {
    this.recurso.categoria = this.recurso.categoria.url;
    this.recurso.tipoFormulario = this.recurso.tipoFormulario.url;
    this.recursoService.update(this.recurso).subscribe(
      (recurso) => {
        console.log(`He actualizado el recurso ${this.recurso.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}/consultaRecursos/${this.idCenad}`]);
      });
  }
  /**
   * metodos para filtrar en la vista de usuario no gestor
   * - metodo que desprecia las categorias de fichero de las cuales el recurso no tiene ningun fichero
   * @param ficheros Ficheros que se va a filtrar
   * @param categoriaFichero Categoria de Fichero por la que se filtra
   * @returns Devuelve los ficheros que tienen esa categoria de fichero
   */
  filtrarPorCategoriaFichero(ficheros: Fichero[], categoriaFichero: CategoriaFichero): Fichero[] {
    if (ficheros) {
      return ficheros.filter(f => f.categoriaFichero && f.categoriaFichero.idCategoriaFichero === categoriaFichero.idCategoriaFichero);
    }
  }

  /**
   * metodo que selecciona solo las categorias de fichero que son imagenes
   * - implicara que sus ficheros se muestren como imagen
   * @param categoriasFichero Categorias de fichero que se van a filtrar
   * @returns Devuelve las categoria de fichero q son imagenes
   */
  categoriasFicheroImagenes(categoriasFichero: CategoriaFichero[]):CategoriaFichero[] {
    return categoriasFichero.filter(c => c.tipo ===0);
  }

  /**
   * metodo que selecciona solo las categorias de fichero que no son imagenes
   * - implicara que sus ficheros se muestren como enlaces de descarga
   * @param categoriasFichero Categorias de fichero que se van a filtrar
   * @returns Devuelve las categoria de fichero q no son imagenes
   */
  categoriasFicheroHref(categoriasFichero: CategoriaFichero[]):CategoriaFichero[] {
    return categoriasFichero.filter(c => c.tipo !==0);
  }

  /**
   * metodo para mostrar el modal de una imagen
   * @param imagen Imagen que se mostrara en el modal
   */
  show(imagen: Fichero) {
    this.showModal = true;
    this.imagenModal = imagen;
  }

  /**
   * metodo para cerrar el modal de las imagenes
   */
  hide() {
  this.showModal = false;
  }

  /**
   * metodo para traspasar los datos del fichero
   * @param fichero Fichero que se mostrara en el modal
   */
  verDatosFichero(fichero: Fichero): void {
    this.ficheroVerDatos = fichero;
  }

  /**
   * metodo para editar un fichero
   * - actualiza el [] con los ficheros del recurso
   */
  onFicheroEditar(fichero: FicheroImpl): void {
    this.recursoService.updateFichero(fichero).subscribe(response => {
      console.log(`He actualizado el fichero ${fichero.nombre}`);
    this.recursoService.getFicheros(this.idRecurso).subscribe((response) =>
    this.ficheros = this.recursoService.extraerFicheros(response));
    });
    document.getElementById('ficha-Fichero').removeAttribute('disabled');
    this.closebutton_Fichero.nativeElement.click();
    document.getElementById('ficha-Fichero').setAttribute('disabled', 'disabled');
    this.ngOnInit();
  }
}
