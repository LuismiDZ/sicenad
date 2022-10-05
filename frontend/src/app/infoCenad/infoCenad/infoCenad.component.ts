import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Fichero } from 'src/app/recursos/models/fichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Cenad } from 'src/app/superadministrador/models/cenad';
import { CenadImpl } from 'src/app/superadministrador/models/cenad-impl';
import { CenadService } from 'src/app/superadministrador/service/cenad.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-infoCenad',
  templateUrl: './infoCenad.component.html',
  styleUrls: []
})
export class InfoCenadComponent implements OnInit {
  /**
   * variable para mostrar el nombre del cenad
   */
  nombreCenad: string = "";
  /**
   * variable que define el usuario administrador que accede para modificar la infoCenad
   */
  idUsuarioAdministrador: string = '';
  /**
   * variable que dice si el usuario esta loggeado como administrador de ese Cenad
   */
  isAdminCenad: boolean = false;
  /**
   * variable para cambiar el boton de la vista administrador/previa
   */
  cambioBoton: boolean = false;
  /**
   * variable para ver el rol que se esta usando. se borrara cuando haya logging
   */
  rol: string = 'Previa';
  /**
   * variable para el icono "volver"
   */
  faVolver = faArrowAltCircleLeft;
  /**
   * variable con la que rescatamos de la barra de navegacion el idCenad
   */
  idCenad: string = "";
  /**
   * variable sobre la que se carga el Cenad
   */
  cenad: Cenad = new CenadImpl();
  /**
   * variable que define la ruta del archivo
   */
  pathRelativo: string = `${environment.hostSicenad}files/infoCenads/${this.idCenad}/`;
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
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  /**
   * variable booleana que define si el archivo se ha subido o no
   */
  archivoSubido: boolean = false;

  /**
   * 
   * @param cenadService Para usar los metodos propios de Cenad
   * @param router Para redirigir
   * @param activateRoute Para capturar el id de la barra de navegacion
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private cenadService: CenadService, private router: Router,
    private activateRoute: ActivatedRoute, private appConfigService: AppConfigService) { }

  /**
   * metodo para q el boton cambie de rol. se borrara cuando haya logging
   */
  cambiaRol() {
    this.cambioBoton = this.cambioBoton ? false : true;
    this.rol = this.cambioBoton ? 'Previa' : 'Administrador';
  }

  /**
   * - Carga el Cenad
   * - Recupero el usuario Administrador y su id
   * - comprobamos si el usuario es administrador de este cenad
   * - Define el path relativo/ruta del archivo infoCenad y el tamaño maximo del archivo
   */
  ngOnInit() {
    this.cargarCenad();
    setTimeout(() => {
      this.cenadService.getUsuarioAdministradorCenadId(this.idCenad).subscribe((response) => {
        this.cenad.usuarioAdministrador = this.cenadService.mapearUsuario(response);
        this.idUsuarioAdministrador = this.cenadService.mapearUsuario(response).idUsuario;
        if ((sessionStorage.isAdmin === 'true') && (sessionStorage.idUsuario === this.idUsuarioAdministrador)) {
          this.isAdminCenad = this.cambioBoton = true;
        }
      });
    }, 1000);
    this.pathRelativo = this.appConfigService.hostSicenad ? `${this.appConfigService.hostSicenad}files/infoCenads/${this.idCenad}/` : `${environment.hostSicenad}files/infoCenads/${this.idCenad}/`;

    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo ? this.appConfigService.sizeMaxEscudo : environment.sizeMaxEscudo;
  }

  /**
   * Captura el idCenad pasado como parámetro en la barra de navegación
   */
  capturarIdBarraNavegacion(): void {
    this.idCenad = this.activateRoute.snapshot.params['idCenad'];
  }

  /**
   * Rescata de la BD el CENAD/CMT cuyo id es pasado como parámetro desde la barra de navegación
   */
  cargarCenad(): void {
    this.capturarIdBarraNavegacion();
    this.cenadService.getCenad(this.idCenad).subscribe(response => {
      this.cenad = this.cenadService.mapearCenad(response);
      this.nombreCenad = this.cenad.nombre;
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
   * - compruebo si es imagen y le aplico el tamaño maximo de imagen
   */
  upload() {
    this.currentFile = this.selectedFiles.item(0);
    if (this.currentFile.type.includes("image")) {
      this.archivoSubido = (this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024) ? false : true;//debo pasarlo a bytes
    }
    this.cenadService.uploadInfo(this.currentFile, this.idCenad).subscribe();
    this.selectedFiles = undefined;
  }

  /**
   * metodo para construir la url del archivo a mostrar o descargar
   * @param nombreArchivo Nombre del archivo
   * @returns Devuelve la ruta del archivo
   */
   pathArchivo(nombreArchivo: string): string {
    const pathImg: string = nombreArchivo ? `${this.pathRelativo}${nombreArchivo}` : '';
    return pathImg;
  } 

  /**
   * metodo para modificar el cenad
   * - si modifico el archivo, sube el nuevo y borra el viejo 
   */
  actualizar(): void {
    this.cenad.usuarioAdministrador = this.cenad.usuarioAdministrador.url;
    if (this.selectedFiles) {
      this.upload();
      if (this.archivoSubido) {
        this.delete_Archivo(this.cenad);
        this.cenad.infoCenad = this.currentFile.name;
      }
    }
    this.cenadService.update(this.cenad).subscribe(
      (cenad) => {
        console.log(`He actualizado el Cenad ${this.cenad.nombre}`);
        this.router.navigate([`/principalCenad/${this.idCenad}`]);
      });
  }

  /**
   * metodo para borrar el archivo del infoCenad
   * @param cenad Cenad
   */
  delete_Archivo(cenad: Cenad) {
    this.cenadService.delete_Archivo(cenad.infoCenad, this.idCenad).subscribe();
  }
}