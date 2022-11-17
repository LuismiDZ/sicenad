import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriaFicheroImpl } from 'src/app/categoriasFichero/models/categoriaFichero-impl';
import { Fichero } from 'src/app/recursos/models/fichero';
import { FicheroImpl } from 'src/app/recursos/models/fichero-impl';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Cenad } from 'src/app/superadministrador/models/cenad';
import { CenadImpl } from 'src/app/superadministrador/models/cenad-impl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NormativaService {
  /**
   * endpoint raiz de la API
   */
  private host: string = environment.hostSicenad;
  /**
   * endpoint especifico de los ficheros
   */
  private urlEndPoint: string = `${this.host}ficheros/`;
  /**
   * endpoint del almacenamiento de archivos
   */
  private urlFiles = `${this.host}files/`;
  /**
   * variable que recoge su categoria de fichero. como es indiferente uso la de cartografia
   */
  categoriaFicheroCartografia: string = environment.categoriaFicheroCartografia;

  /**
   * 
   * @param http Para usar los metodos propios de HTTP
   * @param appConfigService Para usar las variables del `properties`
   */
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService) { 
      this.host = this.appConfigService.hostSicenad ? this.appConfigService.hostSicenad : environment.hostSicenad;
      this.urlEndPoint =  `${this.host}ficheros/`;
      this.urlFiles =  `${this.host}files/`;
      this.categoriaFicheroCartografia = this.appConfigService.categoriaFicheroCartografia ? this.appConfigService.categoriaFicheroCartografia : environment.categoriaFicheroCartografia;
    }

  /**
   * metodo que recupera de la BD las normativas de un CENAD/CMT
   * @param idCenad Id del Cenad
   */
  getNormativasDeCenad(idCenad:string): Observable<any> {
    return this.http.get<any>(`${this.host}cenads/${idCenad}/normativas/?page=0&size=1000`);
  }

  /**
   * metodo que extrae el [ ] de cartografias
   * @param respuestaApi [ ] de ficheros API 
   * @returns Devuelve un [ ] de Fichero
   */
  extraerNormativas(respuestaApi: any): Fichero[] {
    const normativas: Fichero[] = [];
    respuestaApi._embedded.ficheros.forEach(f => 
      normativas.push(this.mapearNormativa(f)));
    return normativas;
  }

  /**
   * metodo para mapear una normativa segun la interfaz
   * @param normativaApi Normativa API
   * @returns Devuelve un FicheroImpl (Normativa)
   */
  mapearNormativa(normativaApi: any): FicheroImpl {
    const normativa = new FicheroImpl();
    normativa.nombre = normativaApi.nombre;
    normativa.nombreArchivo = normativaApi.nombreArchivo;
    normativa.imagen = normativaApi.imagen;
    normativa.descripcion = normativaApi.descripcion;
    normativa.url = normativaApi._links.self.href;
    normativa.idFichero = normativa.getId(normativa.url);
    this.getCategoriaFichero(normativa.idFichero).subscribe((response) =>
    normativa.categoriaFichero = this.mapearCategoriaFichero(response));
    console.log("Mapeo: " + normativa.categoriaFichero);
    return normativa;    
  }

/**
 * metodo para obtener la categoria de fichero de un fichero
 * @param idFichero Id del fichero (normativa)
 */
getCategoriaFichero(idFichero: string): Observable<any> {
  return this.http.get<any>(`${this.host}ficheros/${idFichero}/categoriaFichero/?page=0&size=1000`);
}

/**
 * metodo para mapear una categoria de fichero segun su interfaz
 * @param categoriaFicheroApi Categoria de Fichero API
 * @returns Devuelve una CategoriaFicheroImpl
 */
mapearCategoriaFichero(categoriaFicheroApi: any): CategoriaFicheroImpl {
  const categoriaFichero = new CategoriaFicheroImpl();
  categoriaFichero.nombre = categoriaFicheroApi.nombre;
  categoriaFichero.tipo = categoriaFicheroApi.tipo;
  categoriaFichero.descripcion = categoriaFicheroApi.descripcion;
  categoriaFichero.url = categoriaFicheroApi._links.self.href;
  categoriaFichero.idCategoriaFichero = categoriaFichero.getId(categoriaFichero.url);
  return categoriaFichero;
}

  /**
   * metodo que crea en nuestra BD una nueva normativa
   * @param normativa Normativa a crear
   */
  create(normativa: Fichero): Observable<any> {
    return this.http.post(`${this.urlEndPoint}`, normativa).pipe(
      catchError((e) => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  /**
   * metodo que borra de nuestra BD una normativa
   * @param normativa Normativa a eliminar
   */
  delete(normativa): Observable<Fichero> {
    return this.http.delete<Fichero>(`${this.urlEndPoint}${normativa.idFichero}`)
      .pipe(
        catchError((e) => {
          if (e.status === 405) {
            console.error('El metodo está bien hecho');
          }
          return throwError(e);
        })
      );
  }

  /**
   * metodo que actualiza en nuestra BD una normativa
   * @param normativa Normativa a editar
   */
  update(normativa: Fichero): Observable<any> {
    return this.http
      .patch<any>(`${this.urlEndPoint}${normativa.idFichero}`, normativa)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  /**
   * metodo que recupera de la BD todos los CENADS
   */
  getCenads(): Observable<any> {
    return this.http.get<any>(`${this.host}cenads/?page=0&size=1000`);
  }

  /**
   * metodo que recupera de la BD un CENAD (por su id)
   * @paramid Id del Cenad
   */
  getCenad(id): Observable<any> {
    return this.http.get<Cenad>(`${this.host}cenads/${id}`).pipe(
      catchError((e) => {
        if (e.status !== 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  /**
   * metodo que recupera de la BD el CENAD de una normativa
   * @param normativa Normativa de la que se quiere recuperar el Cenad
   */
  getCenadDeNormativa(normativa: Fichero): Observable<any> {
    return this.http.get<Cenad>(`${this.urlEndPoint}${normativa.idFichero}/cenad`).pipe(
      catchError((e) => {
        if (e.status !== 401 && e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  /**
   * metodo que extrae el [ ] de cenads
   * @param respuestaApi [ ] de Cenads API
   * @returns Devuelve un [ ] de Cenad
   */
  extraerCenads(respuestaApi: any): Cenad[] {
    const cenads: Cenad[] = [];
    respuestaApi._embedded.cenads.forEach(c => 
      cenads.push(this.mapearCenad(c)));
    return cenads;
  }

  /**
   * metodo que mapea un CENAD segun la interfaz
   * @param cenadApi Cenad API
   * @returns Devuelve un CenadImpl
   */
  mapearCenad(cenadApi: any): CenadImpl {
    const cenad = new CenadImpl();
    cenad.nombre = cenadApi.nombre;
    cenad.descripcion = cenadApi.descripcion;
    cenad.direccion = cenadApi.direccion;
    cenad.escudo = cenadApi.escudo;
    cenad.provincia = cenadApi.provincia;
    cenad.tfno = cenadApi.tfno;
    cenad.email = cenadApi.email;
    cenad.url = cenadApi._links.self.href;
    cenad.idCenad = cenad.getId(cenad.url);
    return cenad;
  }

  /**
   * metodo para subir un archivo a la subcarpeta de un cenad
   * @param file Archivo a subir
   * @param idCenad Id del Cenad
   */
  upload(file: File, idCenad: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.urlFiles}subirNormativa/${idCenad}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req).pipe(
      catchError((e) => {
        if (e.status === 413) {
          alert("El archivo tiene un tamaño superior al permitido");
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  /**
   * metodo para borrar un archivo de la subcarpeta de un cenad
   * @param fileName Nombre del archivo a eliminar
   * @param idCenad Id del Cenad
   */
  deleteArchivo(fileName: string, idCenad: string): Observable<any> {
    return this.http.get(`${this.urlFiles}borrarNormativa/${idCenad}/${fileName}`).pipe(
      catchError((e) => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }
}