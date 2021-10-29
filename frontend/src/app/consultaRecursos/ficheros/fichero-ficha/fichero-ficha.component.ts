import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaFichero } from 'src/app/categoriasFichero/models/categoriaFichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { Recurso } from 'src/app/recursos/models/recurso';
import { RecursoService } from 'src/app/recursos/service/recurso.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-fichero-ficha',
  templateUrl: './fichero-ficha.component.html',
  styleUrls: ['./fichero-ficha.component.css']
})
export class FicheroFichaComponent implements OnInit {
  //variable que trae del otro componente el fichero
  @Input() fichero: FicheroImpl;
  //variable para emitir los eventos al otro componente para editar un fichero
  @Output() ficheroEditar = new EventEmitter<FicheroImpl>();
  //variables para la subida de archivos de escudos
  selectedFiles: FileList;
  currentFile: File;
  sizeMaxDocRecurso: number = environment.sizeMaxDocRecurso;
  sizeMaxEscudo: number = environment.sizeMaxEscudo;
  //variables para poder mostrar el valor inicial de los campos select
  recursoSeleccionado: string;
  categoriaFicheroSeleccionada: string;
  //variable para recoger las categorias de ficheros
  categoriasFichero: CategoriaFichero[] = [];
  //variable para recoger los recursos
  recursos: Recurso[] = [];
  archivoSubido: boolean = false;

  constructor(private recursoService: RecursoService, private appConfigService: AppConfigService) { }

  ngOnInit(): void {
    //recupera de la BD todos los recursos
    this.recursoService.getRecursos().subscribe((response) => 
       this.recursos = this.recursoService.extraerRecursos(response));
    //recupera de la BD todas las categorias de fichero
    this.recursoService.getCategoriasFichero().subscribe((response) => 
       this.categoriasFichero = this.recursoService.extraerCategoriasFichero(response));
    //asigna los valores seleccionados a los select de los campos del recurso
    this.actualizarNgModels();
    //para que use la variable del properties.json
    this.sizeMaxDocRecurso = this.appConfigService.sizeMaxDocRecurso;
    this.sizeMaxEscudo = this.appConfigService.sizeMaxEscudo;
  }

  //metodo para poder mostrar en los select los valores seleccionados
  actualizarNgModels(): void {
    this.categoriaFicheroSeleccionada = this.fichero.categoriaFichero.url;
    this.recursoSeleccionado = this.fichero.recurso.url;
    }

  //metodo que emite el evento para editar el fichero y elimina el archivo anterior del fichero y carga el nuevo si es necesario
  editar(): void {
    this.fichero.categoriaFichero = this.categoriaFicheroSeleccionada;
    this.fichero.recurso = this.recursoSeleccionado;
    if (this.selectedFiles) { 
      this.upload();
      if(this.archivoSubido) {
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
    if(this.currentFile.type.includes("image")) {//si supera el tamaño archivoSubido sera false, y no se creara el fichero
      this.archivoSubido = (this.currentFile.size > this.sizeMaxEscudo * 1024 * 1024) ? false : true;//debo pasarlo a bytes
    } else {
      this.archivoSubido = (this.currentFile.size > this.sizeMaxDocRecurso * 1024 * 1024) ? false : true;
    }
    this.recursoService.upload(this.currentFile, this.fichero.recurso.idRecurso).subscribe(
      );
    this.selectedFiles = undefined;
  }

  //metodo para borrar el archivo del fichero
  delete_Archivo(fichero: FicheroImpl) {
    this.recursoService.deleteArchivo(this.fichero.nombreArchivo, this.fichero.recurso.idRecurso).subscribe(); 
  }
}